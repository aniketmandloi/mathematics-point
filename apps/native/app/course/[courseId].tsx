import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Chip,
  Spinner,
  useThemeColor,
  useToast,
} from "heroui-native";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

type ContentItemWithProgress = {
  id: number;
  chapterId: number;
  type: string;
  title: string;
  url: string | null;
  duration: number | null;
  order: number;
  progress: {
    completed: boolean;
    watchedDuration: number | null;
    lastPosition: number | null;
  } | null;
};

export default function CoursePlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = authClient.useSession();
  const primary = useThemeColor("accent");
  const success = useThemeColor("success");
  const foreground = useThemeColor("foreground");

  const id = Number(courseId);

  // Try to load as enrolled first
  const enrolledQuery = useQuery(
    trpc.course.getEnrolledById.queryOptions({ courseId: id }),
  );

  // If not enrolled, load public view
  const publicQuery = useQuery({
    ...trpc.course.getPublicById.queryOptions({ slug: String(id) }),
    enabled: enrolledQuery.data === null && !enrolledQuery.isLoading,
  });

  const enrollMut = useMutation(
    trpc.course.enroll.mutationOptions({
      onSuccess: () => {
        toast.show({ variant: "success", label: "Enrolled successfully!" });
        queryClient.invalidateQueries();
      },
      onError: (err) => {
        toast.show({ variant: "danger", label: err.message });
      },
    }),
  );

  const markCompleteMut = useMutation(
    trpc.content.markComplete.mutationOptions({
      onSuccess: () => {
        toast.show({ variant: "success", label: "Marked as complete!" });
        queryClient.invalidateQueries({
          queryKey: trpc.course.getEnrolledById.queryKey(),
        });
      },
    }),
  );

  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const enrolledCourse = enrolledQuery.data;

  // Flatten content items for navigation
  const allItems = useMemo(() => {
    if (!enrolledCourse?.chapters) return [];
    return enrolledCourse.chapters.flatMap((ch) =>
      ch.contentItems.map((item: ContentItemWithProgress) => ({
        ...item,
        chapterTitle: ch.title,
      })),
    );
  }, [enrolledCourse]);

  // Auto-select first incomplete item
  useMemo(() => {
    if (allItems.length > 0 && !activeItemId) {
      const firstIncomplete = allItems.find((i) => !i.progress?.completed);
      setActiveItemId(firstIncomplete?.id ?? allItems[0]!.id);
    }
  }, [allItems, activeItemId]);

  const activeItem = allItems.find((i) => i.id === activeItemId);
  const activeIndex = allItems.findIndex((i) => i.id === activeItemId);

  // Loading
  if (enrolledQuery.isLoading) {
    return (
      <Container isScrollable={false} className="items-center justify-center">
        <Spinner size="lg" />
      </Container>
    );
  }

  // Not enrolled — show preview
  if (!enrolledCourse) {
    return (
      <Container className="p-4">
        <Text className="text-xl font-bold text-foreground mb-2">
          Course Preview
        </Text>
        <Text className="text-muted text-sm mb-6">
          Enroll in this course to access the content.
        </Text>

        {session?.user ? (
          <Button
            onPress={() => enrollMut.mutate({ courseId: id })}
            isDisabled={enrollMut.isPending}
          >
            {enrollMut.isPending ? (
              <Spinner size="sm" color="default" />
            ) : (
              <Button.Label>Enroll for Free</Button.Label>
            )}
          </Button>
        ) : (
          <Text className="text-muted text-sm">
            Please sign in to enroll in courses.
          </Text>
        )}
      </Container>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Active content */}
      {activeItem && (
        <View className="p-4 border-b border-muted">
          <Text className="text-xs text-muted uppercase tracking-wider mb-1">
            {activeItem.chapterTitle}
          </Text>
          <Text className="text-lg font-semibold text-foreground">
            {activeItem.title}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Chip
              size="sm"
              variant="secondary"
              color={activeItem.type === "video" ? "accent" : "warning"}
            >
              <Chip.Label>
                {activeItem.type === "video" ? "Video" : "PDF"}
              </Chip.Label>
            </Chip>
            {activeItem.progress?.completed && (
              <Chip size="sm" color="success">
                <Chip.Label>Completed</Chip.Label>
              </Chip>
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3 mt-4">
            {activeItem.url && (
              <Button
                size="sm"
                onPress={() => Linking.openURL(activeItem.url!)}
              >
                <Ionicons
                  name={activeItem.type === "video" ? "play" : "document-text"}
                  size={14}
                  color="white"
                />
                <Button.Label>
                  {activeItem.type === "video" ? "Watch Video" : "Open PDF"}
                </Button.Label>
              </Button>
            )}
            {!activeItem.progress?.completed && (
              <Button
                size="sm"
                variant="outline"
                onPress={() =>
                  markCompleteMut.mutate({ contentItemId: activeItem.id })
                }
                isDisabled={markCompleteMut.isPending}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color={primary}
                />
                <Button.Label>Mark Complete</Button.Label>
              </Button>
            )}
          </View>

          {/* Navigation */}
          <View className="flex-row justify-between mt-4">
            <Pressable
              onPress={() => {
                if (activeIndex > 0)
                  setActiveItemId(allItems[activeIndex - 1]!.id);
              }}
              disabled={activeIndex <= 0}
              className="opacity-100 disabled:opacity-30"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="chevron-back" size={16} color={foreground} />
                <Text className="text-foreground text-sm">Previous</Text>
              </View>
            </Pressable>
            <Text className="text-muted text-sm">
              {activeIndex + 1} / {allItems.length}
            </Text>
            <Pressable
              onPress={() => {
                if (activeIndex < allItems.length - 1)
                  setActiveItemId(allItems[activeIndex + 1]!.id);
              }}
              disabled={activeIndex >= allItems.length - 1}
              className="opacity-100 disabled:opacity-30"
            >
              <View className="flex-row items-center gap-1">
                <Text className="text-foreground text-sm">Next</Text>
                <Ionicons name="chevron-forward" size={16} color={foreground} />
              </View>
            </Pressable>
          </View>
        </View>
      )}

      {/* Chapter list */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {enrolledCourse.chapters.map((chapter) => (
          <View key={chapter.id} className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              {chapter.title}
            </Text>
            <View className="gap-1">
              {chapter.contentItems.map((item: ContentItemWithProgress) => {
                const isActive = item.id === activeItemId;
                const isCompleted = item.progress?.completed;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setActiveItemId(item.id)}
                    className={`flex-row items-center gap-3 p-3 rounded-lg ${
                      isActive ? "bg-primary/10" : ""
                    }`}
                  >
                    <Ionicons
                      name={
                        isCompleted
                          ? "checkmark-circle"
                          : item.type === "video"
                            ? "play-circle-outline"
                            : "document-text-outline"
                      }
                      size={20}
                      color={
                        isCompleted ? success : isActive ? primary : foreground
                      }
                    />
                    <Text
                      className={`flex-1 text-sm ${
                        isActive
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {item.duration && (
                      <Text className="text-muted text-xs">
                        {Math.round(item.duration / 60)}m
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
