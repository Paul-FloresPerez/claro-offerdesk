"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  hero: "size-32 text-3xl lg:size-44 lg:text-4xl",
  podium: "size-20 text-xl sm:size-24 lg:size-32 lg:text-3xl",
  row: "size-11 text-sm sm:size-12",
  leader: "size-10 text-xs",
} as const;

export default function RankingAvatar({
  className,
  fullName,
  photoUrl,
  priority = false,
  size,
}: {
  className?: string;
  fullName: string;
  photoUrl: string | null;
  priority?: boolean;
  size: keyof typeof sizeClasses;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const shouldShowPhoto = photoUrl && failedUrl !== photoUrl;

  if (shouldShowPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={fullName}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setFailedUrl(photoUrl)}
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-white/20",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span
      aria-label={`Sin fotografía para ${fullName}`}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-primary font-black text-primary-foreground ring-1 ring-border",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(fullName)}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
