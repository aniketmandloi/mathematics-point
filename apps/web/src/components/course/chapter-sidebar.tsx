"use client";

import { CheckCircle2, Circle, FileText, Video } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentItemWithProgress {
  id: number;
  title: string;
  type: "video" | "pdf";
  order: number;
  progress: { completed: boolean; lastPosition: number | null } | null;
}

interface ChapterData {
  id: number;
  title: string;
  order: number;
  contentItems: ContentItemWithProgress[];
}

interface ChapterSidebarProps {
  chapters: ChapterData[];
  activeItemId: number | null;
  onSelectItem: (itemId: number) => void;
}

export default function ChapterSidebar({
  chapters,
  activeItemId,
  onSelectItem,
}: ChapterSidebarProps) {
  const totalItems = chapters.reduce(
    (sum, ch) => sum + ch.contentItems.length,
    0,
  );
  const completedItems = chapters.reduce(
    (sum, ch) =>
      sum + ch.contentItems.filter((item) => item.progress?.completed).length,
    0,
  );
  const progressPercent =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b p-4">
        <p className="text-sm font-medium">Course Progress</p>
        <Progress value={progressPercent} className="mt-2" />
        <p className="mt-1 text-xs text-muted-foreground">
          {completedItems} / {totalItems} completed
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chapters.map((ch) => (
            <div key={ch.id} className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {ch.title}
              </p>
              <div className="space-y-0.5">
                {ch.contentItems.map((item) => {
                  const isActive = item.id === activeItemId;
                  const isCompleted = item.progress?.completed;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      {item.type === "video" ? (
                        <Video className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
