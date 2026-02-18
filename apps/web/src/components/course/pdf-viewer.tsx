"use client";

import { Download, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  url: string;
  title: string;
}

export default function PdfViewer({ url, title }: PdfViewerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in new tab
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={url} download>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border bg-muted">
        <iframe src={url} title={title} className="h-full w-full" />
      </div>
    </div>
  );
}
