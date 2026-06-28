import { readdirSync } from "fs";
import { extname, join, parse } from "path";

export type TrainingMediaFile = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mediaType: "audio" | "video";
};

const trainingRoot = join(process.cwd(), "public", "capacitacion");

const mediaDirectories = {
  audio: {
    directory: join(trainingRoot, "audios"),
    publicSegments: ["capacitacion", "audios"],
    extensions: new Set<string>([".mp3", ".wav", ".m4a", ".ogg"]),
  },
  video: {
    directory: join(trainingRoot, "videos"),
    publicSegments: ["capacitacion", "videos"],
    extensions: new Set<string>([".mp4", ".webm", ".mov"]),
  },
} as const;

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

  try {
    return readdirSync(config.directory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name !== ".gitkeep")
      .filter((entry) => config.extensions.has(extname(entry.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }))
      .map((entry) => ({
        id: `${mediaType}-${entry.name}`,
        title: titleFromFileName(entry.name),
        fileName: entry.name,
        fileUrl: encodePublicPath([...config.publicSegments, entry.name]),
        mediaType,
      }));
  } catch {
    return [];
  }
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
