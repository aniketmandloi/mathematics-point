import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Button, Card, Chip, Spinner, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function MyCoursesScreen() {
  const primary = useThemeColor("accent");
  const enrolledQuery = useQuery(trpc.course.getEnrolled.queryOptions());

  const enrolled = enrolledQuery.data ?? [];

  return (
    <Container className="p-4">
      {enrolledQuery.isLoading ? (
        <View className="py-12 items-center">
          <Spinner size="lg" />
        </View>
      ) : enrolled.length === 0 ? (
        <View className="py-12 items-center">
          <Ionicons name="school-outline" size={40} color={primary} />
          <Text className="text-foreground font-medium mt-4">
            No enrolled courses
          </Text>
          <Text className="text-muted text-sm mt-1 text-center">
            Browse the course catalog and enroll to get started.
          </Text>
          <Link href="/(tabs)/courses" asChild>
            <Button className="mt-4">
              <Button.Label>Browse Courses</Button.Label>
            </Button>
          </Link>
        </View>
      ) : (
        <View className="gap-3">
          {enrolled.map((course) => {
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
                    <Text
                      className="text-foreground font-medium"
                      numberOfLines={1}
                    >
                      {course.courseTitle}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-muted text-xs">
                        {course.completedItems}/{course.totalItems} lessons
                      </Text>
                      <Chip
                        size="sm"
                        color={progress === 100 ? "success" : "accent"}
                      >
                        <Chip.Label>{progress}%</Chip.Label>
                      </Chip>
                    </View>
                    <View className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <View
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                    {course.courseClassLevel && (
                      <View className="flex-row gap-2 mt-2">
                        <Chip size="sm" variant="secondary">
                          <Chip.Label>{course.courseClassLevel}</Chip.Label>
                        </Chip>
                        {course.courseSubject && (
                          <Chip size="sm" variant="secondary">
                            <Chip.Label>{course.courseSubject}</Chip.Label>
                          </Chip>
                        )}
                      </View>
                    )}
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
