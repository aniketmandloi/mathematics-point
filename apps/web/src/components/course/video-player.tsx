"use client";

import { useCallback, useEffect, useRef } from "react";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

interface VideoPlayerProps {
  url: string;
  title: string;
  startPosition?: number;
  onProgress?: (currentTime: number) => void;
}

export default function VideoPlayer({
  url,
  title,
  startPosition = 0,
  onProgress,
}: VideoPlayerProps) {
  const videoId = extractYouTubeId(url);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Poll for progress using postMessage (YouTube IFrame API fallback)
  // For a more robust solution, integrate the YouTube IFrame Player API
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">Invalid video URL</p>
      </div>
    );
  }

  const startParam =
    startPosition > 0 ? `&start=${Math.floor(startPosition)}` : "";

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${startParam}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
