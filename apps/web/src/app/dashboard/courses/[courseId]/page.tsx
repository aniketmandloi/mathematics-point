"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import ChapterSidebar from "@/components/course/chapter-sidebar";
import PdfViewer from "@/components/course/pdf-viewer";
import VideoPlayer from "@/components/course/video-player";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function CoursePlayerPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const queryClient = useQueryClient();

  const courseQuery = useQuery(
    trpc.course.getEnrolledById.queryOptions({ courseId }),
  );

  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const updateProgressMut = useMutation(
    trpc.content.updateProgress.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getEnrolledById.queryKey(),
        });
      },
    }),
  );

  const markCompleteMut = useMutation(
    trpc.content.markComplete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getEnrolledById.queryKey(),
        });
        toast.success("Marked as complete!");
      },
    }),
  );

  // Flatten all content items for navigation
  const allItems = useMemo(() => {
    if (!courseQuery.data?.chapters) return [];
    return courseQuery.data.chapters.flatMap((ch) =>
      ch.contentItems.map((item) => ({ ...item, chapterTitle: ch.title })),
    );
  }, [courseQuery.data]);

  // Auto-select first item or the one with in-progress
  const effectiveActiveId = useMemo(() => {
    if (activeItemId) return activeItemId;
    // Find first incomplete item
    const firstIncomplete = allItems.find((item) => !item.progress?.completed);
    return firstIncomplete?.id ?? allItems[0]?.id ?? null;
  }, [activeItemId, allItems]);

  const activeItem = allItems.find((item) => item.id === effectiveActiveId);
  const activeIndex = allItems.findIndex(
    (item) => item.id === effectiveActiveId,
  );
  const prevItem = activeIndex > 0 ? allItems[activeIndex - 1] : null;
  const nextItem =
    activeIndex < allItems.length - 1 ? allItems[activeIndex + 1] : null;

  if (courseQuery.isLoading) {
    return (
      <div className="flex h-full">
        <div className="w-72 shrink-0 border-r">
          <Skeleton className="h-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="aspect-video w-full" />
        </div>
      </div>
    );
  }

  if (!courseQuery.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Not enrolled</h2>
          <p className="mt-2 text-muted-foreground">
            You are not enrolled in this course.
          </p>
        </div>
      </div>
    );
  }

  const course = courseQuery.data;
  const isCompleted = activeItem?.progress?.completed;

  return (
    <div className="flex h-[calc(100svh-4rem)]">
      {/* Sidebar */}
      <div className="hidden w-72 shrink-0 md:block">
        <ChapterSidebar
          chapters={course.chapters}
          activeItemId={effectiveActiveId}
          onSelectItem={(id) => setActiveItemId(id)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 p-6">
          {activeItem ? (
            <div className="mx-auto max-w-4xl space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {activeItem.chapterTitle}
                </p>
                <h2 className="text-xl font-bold">{activeItem.title}</h2>
              </div>

              {activeItem.type === "video" ? (
                <VideoPlayer
                  url={activeItem.url}
                  title={activeItem.title}
                  startPosition={activeItem.progress?.lastPosition ?? 0}
                  onProgress={(currentTime) => {
                    updateProgressMut.mutate({
                      contentItemId: activeItem.id,
                      watchedDuration: Math.floor(currentTime),
                      lastPosition: Math.floor(currentTime),
                    });
                  }}
                />
              ) : (
                <PdfViewer url={activeItem.url} title={activeItem.title} />
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        markCompleteMut.mutate({
                          contentItemId: activeItem.id,
                        })
                      }
                      disabled={markCompleteMut.isPending}
                    >
                      {markCompleteMut.isPending
                        ? "Marking..."
                        : "Mark as Complete"}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {prevItem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveItemId(prevItem.id)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  {nextItem && (
                    <Button
                      size="sm"
                      onClick={() => setActiveItemId(nextItem.id)}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              This course has no content yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
