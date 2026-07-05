import { readdirSync } from "fs";
import { extname, join, parse } from "path";

export type TrainingMediaFile = {
  id: string;
  title: string;
  description?: string | null;
  fileName: string;
  fileUrl: string;
  fileKey?: string | null;
  mimeType: string;
  mediaType: "audio" | "video";
  sourceType?: "blob" | "file" | "youtube";
  weekLabel?: string | null;
};

export type TrainingMediaRecord = {
  id: string;
  title: string;
  description: string | null;
  mediaType: string;
  fileUrl: string;
  fileKey: string | null;
  weekLabel: string | null;
};

const trainingRoot = join(process.cwd(), "public", "capacitacion");

const mediaDirectories = {
  audio: {
    directory: join(trainingRoot, "audios"),
    publicSegments: ["capacitacion", "audios"],
    extensions: new Set<string>([".mp3", ".m4a", ".ogg"]),
    priority: [".mp3", ".m4a", ".ogg"],
  },
  video: {
    directory: join(trainingRoot, "videos"),
    publicSegments: ["capacitacion", "videos"],
    extensions: new Set<string>([".mp4", ".webm"]),
    priority: [".mp4", ".webm"],
  },
} as const;

const mimeTypes: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
};

export function getTrainingMedia() {
  const videos = readMediaDirectory("video");
  const audios = readMediaDirectory("audio");

  return buildTrainingMediaResult(videos, audios);
}

export function getTrainingMediaFromRecords(records: TrainingMediaRecord[]) {
  const mappedRecords = records
    .map(mapTrainingMediaRecord)
    .filter((item): item is TrainingMediaFile => Boolean(item));

  const videos = mappedRecords.filter((item) => item.mediaType === "video");
  const audios = mappedRecords.filter((item) => item.mediaType === "audio");

  return buildTrainingMediaResult(videos, audios);
}

function buildTrainingMediaResult(
  videos: TrainingMediaFile[],
  audios: TrainingMediaFile[]
) {
  return {
    videos,
    audios,
    featuredVideo: videos[0],
    featuredAudios: audios.slice(0, 2),
  };
}

function readMediaDirectory(mediaType: "audio" | "video"): TrainingMediaFile[] {
  const config = mediaDirectories[mediaType];
  const priority = config.priority as readonly string[];

  try {
    const entries = readdirSync(config.directory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name !== ".gitkeep")
      .filter((entry) => config.extensions.has(getExtension(entry.name)));

    const mp4BaseNames =
      mediaType === "video"
        ? new Set(
            entries
              .filter((entry) => getExtension(entry.name) === ".mp4")
              .map((entry) => parse(entry.name).name.toLowerCase())
          )
        : null;

    return entries
      .filter((entry) => {
        if (mediaType !== "video" || getExtension(entry.name) !== ".webm") {
          return true;
        }

        return mp4BaseNames?.has(parse(entry.name).name.toLowerCase()) ?? false;
      })
      .sort((a, b) => {
        const priorityDifference =
          priority.indexOf(getExtension(a.name)) -
          priority.indexOf(getExtension(b.name));

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      })
      .map((entry) => ({
        id: `${mediaType}-${entry.name}`,
        title: titleFromFileName(entry.name),
        description: null,
        fileName: entry.name,
        fileUrl: encodePublicPath([...config.publicSegments, entry.name]),
        fileKey: null,
        mimeType: mimeTypes[getExtension(entry.name)] ?? "application/octet-stream",
        mediaType,
        sourceType: "file" as const,
        weekLabel: null,
      }));
  } catch {
    return [];
  }
}

function mapTrainingMediaRecord(
  record: TrainingMediaRecord
): TrainingMediaFile | null {
  if (record.mediaType !== "audio" && record.mediaType !== "video") {
    return null;
  }

  const sourceType = getSourceType(record.fileUrl);
  const extension = getExtensionFromUrl(record.fileUrl);

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    fileName: record.fileKey ?? fileNameFromUrl(record.fileUrl) ?? record.title,
    fileUrl: record.fileUrl,
    fileKey: record.fileKey,
    mimeType:
      sourceType === "youtube"
        ? "video/youtube"
        : mimeTypes[extension] ?? fallbackMimeType(record.mediaType),
    mediaType: record.mediaType,
    sourceType,
    weekLabel: record.weekLabel,
  };
}

function getSourceType(fileUrl: string): TrainingMediaFile["sourceType"] {
  try {
    const url = new URL(fileUrl);
    const host = url.hostname.toLowerCase();

    if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be"
    ) {
      return "youtube";
    }

    if (host.endsWith(".blob.vercel-storage.com")) {
      return "blob";
    }
  } catch {
    return "file";
  }

  return "file";
}

function getExtensionFromUrl(fileUrl: string) {
  try {
    return getExtension(new URL(fileUrl).pathname);
  } catch {
    return getExtension(fileUrl);
  }
}

function fileNameFromUrl(fileUrl: string) {
  try {
    const pathname = new URL(fileUrl).pathname;
    const name = pathname.split("/").filter(Boolean).at(-1);
    return name ? decodeURIComponent(name) : null;
  } catch {
    return fileUrl.split("/").filter(Boolean).at(-1) ?? null;
  }
}

function fallbackMimeType(mediaType: "audio" | "video") {
  return mediaType === "audio" ? "audio/mpeg" : "video/mp4";
}

function getExtension(fileName: string) {
  return extname(fileName).toLowerCase();
}

function encodePublicPath(segments: string[]) {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function titleFromFileName(fileName: string) {
  return parse(fileName)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
