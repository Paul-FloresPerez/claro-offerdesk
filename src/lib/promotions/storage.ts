import "server-only";

import { createHash, randomUUID } from "crypto";
import {
  BlobNotFoundError,
  del,
  get,
  put,
  type GetBlobResult,
} from "@vercel/blob";
import { getVercelOidcToken } from "@vercel/oidc";
import { PromotionAssetKind } from "@prisma/client";
import {
  getPromotionAssetExtension,
  getPromotionAssetFolder,
  isMimeAllowedForPromotionAssetKind,
  isPromotionAssetMimeType,
  PROMOTION_ASSET_MAX_SIZE_BYTES,
  PROMOTION_STORE_ID_ENV,
  type PromotionAssetMimeType,
} from "@/lib/promotions/asset-policy";

export type PromotionStorageErrorCode =
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_CONTENT"
  | "INVALID_FILE_KEY"
  | "MIME_KIND_MISMATCH"
  | "STORAGE_AUTH_UNAVAILABLE"
  | "STORAGE_NOT_CONFIGURED"
  | "STORAGE_NOT_FOUND"
  | "UNSUPPORTED_MIME";

export class PromotionStorageError extends Error {
  constructor(
    public readonly code: PromotionStorageErrorCode,
    message: string
  ) {
    super(message);
    this.name = "PromotionStorageError";
  }
}

export type PromotionAssetFileValidationError = {
  code:
    | "EMPTY_FILE"
    | "FILE_TOO_LARGE"
    | "INVALID_FILE_CONTENT"
    | "MIME_KIND_MISMATCH"
    | "UNSUPPORTED_MIME";
  message: string;
};

export type PromotionAssetFileValidation =
  | { valid: true; mimeType: PromotionAssetMimeType }
  | { valid: false; errors: PromotionAssetFileValidationError[] };

type UploadPromotionAssetInput = {
  promotionId: string;
  kind: PromotionAssetKind;
  file: File;
};

type StoredPromotionAsset = {
  fileKey: string;
  mimeType: PromotionAssetMimeType;
  sizeBytes: number;
  checksum: string;
};

export async function validatePromotionAssetFile(
  file: Blob,
  kind?: PromotionAssetKind
): Promise<PromotionAssetFileValidation> {
  const errors: PromotionAssetFileValidationError[] = [];
  const mimeType = normalizeMimeType(file.type);

  if (file.size === 0) {
    errors.push({ code: "EMPTY_FILE", message: "El archivo está vacío." });
  }

  if (file.size > PROMOTION_ASSET_MAX_SIZE_BYTES) {
    errors.push({
      code: "FILE_TOO_LARGE",
      message: "El archivo supera el límite de 4 MB.",
    });
  }

  if (!isPromotionAssetMimeType(mimeType)) {
    errors.push({
      code: "UNSUPPORTED_MIME",
      message: "Solo se permiten PNG, JPEG, WebP y PDF.",
    });
  } else if (!(await matchesFileSignature(file, mimeType))) {
    errors.push({
      code: "INVALID_FILE_CONTENT",
      message: "El contenido del archivo no coincide con su tipo MIME.",
    });
  } else if (kind && !isMimeAllowedForPromotionAssetKind(kind, mimeType)) {
    errors.push({
      code: "MIME_KIND_MISMATCH",
      message: "El tipo de archivo no corresponde al material seleccionado.",
    });
  }

  return errors.length
    ? { valid: false, errors }
    : { valid: true, mimeType: mimeType as PromotionAssetMimeType };
}

export async function uploadPromotionAsset(
  input: UploadPromotionAssetInput
): Promise<StoredPromotionAsset> {
  const validation = await validatePromotionAssetFile(input.file, input.kind);

  if (!validation.valid) {
    const firstError = validation.errors[0];
    throw new PromotionStorageError(firstError.code, firstError.message);
  }

  const auth = await getPromotionStorageAuth();
  const pathname = buildPromotionAssetPathname({
    promotionId: input.promotionId,
    kind: input.kind,
    mimeType: validation.mimeType,
    originalName: input.file.name,
  });
  const checksum = await getFileChecksum(input.file);
  const blob = await put(pathname, input.file, {
    access: "private",
    ...auth,
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: validation.mimeType,
    cacheControlMaxAge: 60,
  });

  assertSafeFileKey(blob.pathname);

  return {
    fileKey: blob.pathname,
    mimeType: validation.mimeType,
    sizeBytes: input.file.size,
    checksum,
  };
}

export async function deletePromotionAssetBlob(input: {
  fileKey: string;
}) {
  assertSafeFileKey(input.fileKey);
  const auth = await getPromotionStorageAuth();

  try {
    await del(input.fileKey, auth);
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error;
  }
}

export async function getPrivatePromotionAsset(input: {
  fileKey: string;
  ifNoneMatch?: string;
}): Promise<GetBlobResult> {
  assertSafeFileKey(input.fileKey);
  const auth = await getPromotionStorageAuth();
  const result = await get(input.fileKey, {
    access: "private",
    ...auth,
    ifNoneMatch: input.ifNoneMatch,
  });

  if (!result) {
    throw new PromotionStorageError(
      "STORAGE_NOT_FOUND",
      "El archivo privado no existe en el almacenamiento."
    );
  }

  return result;
}

async function getPromotionStorageAuth() {
  const storeId = process.env[PROMOTION_STORE_ID_ENV]?.trim();

  if (!storeId) {
    throw new PromotionStorageError(
      "STORAGE_NOT_CONFIGURED",
      "El identificador del almacenamiento privado de promociones no está configurado."
    );
  }

  let oidcToken: string;

  try {
    oidcToken = (await getVercelOidcToken()).trim();
  } catch {
    throw new PromotionStorageError(
      "STORAGE_AUTH_UNAVAILABLE",
      "La autenticación OIDC del almacenamiento de promociones no está disponible."
    );
  }

  if (!oidcToken) {
    throw new PromotionStorageError(
      "STORAGE_AUTH_UNAVAILABLE",
      "La autenticación OIDC del almacenamiento de promociones no está disponible."
    );
  }

  return { storeId, oidcToken };
}

function buildPromotionAssetPathname(input: {
  promotionId: string;
  kind: PromotionAssetKind;
  mimeType: PromotionAssetMimeType;
  originalName: string;
}) {
  const promotionId = input.promotionId.toLowerCase();

  if (!uuidPattern.test(promotionId)) {
    throw new PromotionStorageError(
      "INVALID_FILE_KEY",
      "El identificador de la promoción no es válido."
    );
  }

  const baseName = sanitizeBaseName(input.originalName);
  const folder = getPromotionAssetFolder(input.kind);
  const extension = getPromotionAssetExtension(input.mimeType);
  return `promotions/${promotionId}/${folder}/${baseName}-${randomUUID()}.${extension}`;
}

function sanitizeBaseName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const sanitized = nameWithoutExtension
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return sanitized || "asset";
}

function assertSafeFileKey(fileKey: string) {
  if (
    fileKey.includes("..") ||
    fileKey.includes("\\") ||
    fileKey.startsWith("/") ||
    !safeFileKeyPattern.test(fileKey)
  ) {
    throw new PromotionStorageError(
      "INVALID_FILE_KEY",
      "La ruta del archivo almacenado no es válida."
    );
  }
}

function normalizeMimeType(value: string) {
  return value.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}

async function matchesFileSignature(
  file: Blob,
  mimeType: PromotionAssetMimeType
) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (mimeType === "image/png") {
    return startsWith(bytes, [137, 80, 78, 71, 13, 10, 26, 10]);
  }

  if (mimeType === "image/jpeg") {
    return startsWith(bytes, [255, 216, 255]);
  }

  if (mimeType === "image/webp") {
    return (
      startsWith(bytes, [82, 73, 70, 70]) &&
      bytes[8] === 87 &&
      bytes[9] === 69 &&
      bytes[10] === 66 &&
      bytes[11] === 80
    );
  }

  return startsWith(bytes, [37, 80, 68, 70, 45]);
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

async function getFileChecksum(file: Blob) {
  const contents = Buffer.from(await file.arrayBuffer());
  return createHash("sha256").update(contents).digest("hex");
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const safeFileKeyPattern =
  /^promotions\/[0-9a-f-]{36}\/(?:flyer|coverage|official-table|official-document|internal)\/[a-z0-9][a-z0-9._-]*$/;
