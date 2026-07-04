import { readdirSync } from "fs";
import { extname, join, parse } from "path";

export type TrainingMediaFile = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  mediaType: "audio" | "video";
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
        fileName: entry.name,
        fileUrl: encodePublicPath([...config.publicSegments, entry.name]),
        mimeType: mimeTypes[getExtension(entry.name)] ?? "application/octet-stream",
        mediaType,
      }));
  } catch {
    return [];
  }
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
