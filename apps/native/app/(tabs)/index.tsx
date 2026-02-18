import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Button, Card, Chip, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const primary = useThemeColor("accent");

  const enrolledQuery = useQuery(trpc.course.getEnrolled.queryOptions());
  const continueQuery = useQuery(
    trpc.course.getContinueLearning.queryOptions(),
  );

  const enrolled = enrolledQuery.data ?? [];
  const totalEnrolled = enrolled.length;
  const totalCompleted = enrolled.reduce((s, e) => s + e.completedItems, 0);
  const totalItems = enrolled.reduce((s, e) => s + e.totalItems, 0);
  const continueLearning = continueQuery.data;

  return (
    <Container className="p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground">
          Hi, {session?.user?.name ?? "Student"}
        </Text>
        <Text className="text-muted text-sm mt-1">
          Track your progress and continue learning.
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row gap-3 mb-6">
        <Card className="flex-1 p-3">
          <Text className="text-2xl font-bold text-foreground">
            {totalEnrolled}
          </Text>
          <Text className="text-muted text-xs">Courses</Text>
        </Card>
        <Card className="flex-1 p-3">
          <Text className="text-2xl font-bold text-foreground">
            {totalCompleted}
          </Text>
          <Text className="text-muted text-xs">Completed</Text>
        </Card>
        <Card className="flex-1 p-3">
          <Text className="text-2xl font-bold text-foreground">
            {totalItems > 0
              ? Math.round((totalCompleted / totalItems) * 100)
              : 0}
            %
          </Text>
          <Text className="text-muted text-xs">Progress</Text>
        </Card>
      </View>

      {/* Continue Learning */}
      {continueLearning && (
        <Card variant="secondary" className="mb-6 p-4">
          <Text className="text-muted text-xs uppercase tracking-wider mb-2">
            Continue Learning
          </Text>
          <Text className="text-foreground font-medium">
            {continueLearning.contentTitle}
          </Text>
          <Text className="text-muted text-sm mb-3">
            {continueLearning.courseTitle}
          </Text>
          <Link href={`/course/${continueLearning.courseId}`} asChild>
            <Button size="sm">
              <Ionicons name="play" size={14} color="white" />
              <Button.Label>Resume</Button.Label>
            </Button>
          </Link>
        </Card>
      )}

      {/* My Courses */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">
          My Courses
        </Text>
        <Link href="/(tabs)/my-courses" asChild>
          <Pressable>
            <Text className="text-primary text-sm">View all</Text>
          </Pressable>
        </Link>
      </View>

      {enrolled.length === 0 ? (
        <Card variant="secondary" className="p-8 items-center">
          <Ionicons name="book-outline" size={40} color={primary} />
          <Text className="text-foreground font-medium mt-4">
            No courses yet
          </Text>
          <Text className="text-muted text-sm mt-1 text-center">
            Browse and enroll in courses to start learning.
          </Text>
          <Link href="/(tabs)/courses" asChild>
            <Button className="mt-4">
              <Button.Label>Browse Courses</Button.Label>
            </Button>
          </Link>
        </Card>
      ) : (
        <View className="gap-3">
          {enrolled.slice(0, 3).map((course) => {
            const progress =
              course.totalItems > 0
                ? Math.round((course.completedItems / course.totalItems) * 100)
                : 0;

            return (
              <Link
                key={course.enrollmentId}
                href={`/course/${course.courseId}`}
                asChild
              >
                <Pressable>
                  <Card className="p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-3">
                        <Text
                          className="text-foreground font-medium"
                          numberOfLines={1}
                        >
                          {course.courseTitle}
                        </Text>
                        <Text className="text-muted text-xs mt-1">
                          {course.completedItems}/{course.totalItems} lessons
                        </Text>
                      </View>
                      <Chip
                        size="sm"
                        color={progress === 100 ? "success" : "accent"}
                      >
                        <Chip.Label>{progress}%</Chip.Label>
                      </Chip>
                    </View>
                    {/* Progress bar */}
                    <View className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <View
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  </Card>
                </Pressable>
              </Link>
            );
          })}
        </View>
      )}
    </Container>
  );
}
