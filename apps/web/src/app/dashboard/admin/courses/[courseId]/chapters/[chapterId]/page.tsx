"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Trash2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function ChapterContentPage() {
  const params = useParams<{ courseId: string; chapterId: string }>();
  const chapterId = Number(params.chapterId);
  const courseId = Number(params.courseId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addContentOpen, setAddContentOpen] = useState(false);

  const contentQuery = useQuery(
    trpc.content.listByChapter.queryOptions({ chapterId }),
  );

  const removeMut = useMutation(
    trpc.content.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.content.listByChapter.queryKey(),
        });
        toast.success("Content item removed");
      },
    }),
  );

  const addContentMut = useMutation(
    trpc.content.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.content.listByChapter.queryKey(),
        });
        setAddContentOpen(false);
        toast.success("Content item added");
      },
      onError: () => toast.error("Failed to add content"),
    }),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chapter Content</h1>
          <p className="text-sm text-muted-foreground">
            Manage videos and PDFs for this chapter
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/admin/courses/${courseId}`)}
        >
          Back to Course
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Items</CardTitle>
          <Dialog open={addContentOpen} onOpenChange={setAddContentOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Content Item</DialogTitle>
              </DialogHeader>
              <AddContentForm
                onSubmit={(vals) =>
                  addContentMut.mutate({
                    chapterId,
                    type: vals.type,
                    title: vals.title,
                    url: vals.url,
                    duration: vals.duration || undefined,
                    order: contentQuery.data?.length ?? 0,
                  })
                }
                isPending={addContentMut.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {contentQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : contentQuery.data?.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No content items yet. Add videos or PDFs to this chapter.
            </p>
          ) : (
            <div className="space-y-2">
              {contentQuery.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  {item.type === "video" ? (
                    <Video className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {item.url}
                    </p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                  {item.duration && (
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(item.duration / 60)}m
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Remove this content item?")) {
                        removeMut.mutate({ id: item.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddContentForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (vals: {
    type: "video" | "pdf";
    title: string;
    url: string;
    duration: number | undefined;
  }) => void;
  isPending: boolean;
}) {
  const [type, setType] = useState<"video" | "pdf">("video");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={type}
          onValueChange={(v) => setType(v as "video" | "pdf")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Introduction to Quadratic Equations"
        />
      </div>
      <div className="space-y-2">
        <Label>{type === "video" ? "YouTube URL" : "PDF URL"}</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            type === "video"
              ? "https://www.youtube.com/watch?v=..."
              : "https://storage.example.com/notes.pdf"
          }
        />
      </div>
      {type === "video" && (
        <div className="space-y-2">
          <Label>Duration (seconds, optional)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 600"
          />
        </div>
      )}
      <Button
        disabled={!title || !url || isPending}
        onClick={() =>
          onSubmit({
            type,
            title,
            url,
            duration: duration ? Number(duration) : undefined,
          })
        }
      >
        {isPending ? "Adding..." : "Add Content"}
      </Button>
    </div>
  );
}
