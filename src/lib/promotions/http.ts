import "server-only";

import {
  isAuthorizationError,
  type AuthorizationErrorCode,
} from "@/lib/authorization";
import {
  PromotionAssetServiceError,
  type PromotionAssetServiceErrorCode,
} from "@/lib/promotions/assets";
import {
  PromotionStorageError,
  type PromotionStorageErrorCode,
} from "@/lib/promotions/storage";

const authorizationStatuses: Record<AuthorizationErrorCode, number> = {
  UNAUTHENTICATED: 401,
  INACTIVE_USER: 403,
  FORBIDDEN: 403,
  BRANCH_REQUIRED: 403,
  BRANCH_INACTIVE: 403,
  BRANCH_FORBIDDEN: 403,
};

const serviceStatuses: Record<PromotionAssetServiceErrorCode, number> = {
  ASSET_NOT_FOUND: 404,
  FORBIDDEN: 403,
  METADATA_CREATE_FAILED: 500,
  METADATA_DELETE_FAILED: 500,
  PASSWORD_CHANGE_REQUIRED: 403,
  PUBLISHED_PROMOTION_INVALID: 409,
  PROMOTION_NOT_FOUND: 404,
  UPLOAD_COMPENSATION_FAILED: 500,
};

const storageStatuses: Record<PromotionStorageErrorCode, number> = {
  EMPTY_FILE: 400,
  FILE_TOO_LARGE: 413,
  INVALID_FILE_CONTENT: 400,
  INVALID_FILE_KEY: 400,
  MIME_KIND_MISMATCH: 415,
  STORAGE_AUTH_UNAVAILABLE: 503,
  STORAGE_NOT_CONFIGURED: 503,
  STORAGE_NOT_FOUND: 404,
  UNSUPPORTED_MIME: 415,
};

export function promotionAssetErrorResponse(error: unknown) {
  if (isAuthorizationError(error)) {
    return Response.json(
      { error: error.code, message: error.message },
      { status: authorizationStatuses[error.code] }
    );
  }

  if (error instanceof PromotionAssetServiceError) {
    return Response.json(
      { error: error.code, message: error.message },
      { status: serviceStatuses[error.code] }
    );
  }

  if (error instanceof PromotionStorageError) {
    return Response.json(
      { error: error.code, message: error.message },
      { status: storageStatuses[error.code] }
    );
  }

  console.error("Error inesperado en assets de promociones.");
  return Response.json(
    { error: "INTERNAL_ERROR", message: "No se pudo procesar el material." },
    { status: 500 }
  );
}

export function isSameOriginMutation(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
