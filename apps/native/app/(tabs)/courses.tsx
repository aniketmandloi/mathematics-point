import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  Card,
  Chip,
  Input,
  Spinner,
  TextField,
  useThemeColor,
} from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function CoursesScreen() {
  const [search, setSearch] = useState("");
  const foreground = useThemeColor("foreground");

  const coursesQuery = useQuery(
    trpc.course.listPublic.queryOptions({
      search: search || undefined,
      limit: 20,
      offset: 0,
    }),
  );

  const courses = coursesQuery.data?.courses ?? [];

  return (
    <Container className="p-4">
      {/* Search */}
      <TextField className="mb-4">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search courses..."
          autoCapitalize="none"
        />
      </TextField>

      {coursesQuery.isLoading ? (
        <View className="py-12 items-center">
          <Spinner size="lg" />
        </View>
      ) : courses.length === 0 ? (
        <View className="py-12 items-center">
          <Ionicons name="search-outline" size={40} color={foreground} />
          <Text className="text-foreground font-medium mt-4">
            No courses found
          </Text>
          <Text className="text-muted text-sm mt-1">
            Try a different search term.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/course/${course.id}`} asChild>
              <Pressable>
                <Card className="p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                      <Text
                        className="text-foreground font-medium"
                        numberOfLines={2}
                      >
                        {course.title}
                      </Text>
                      {course.description && (
                        <Text
                          className="text-muted text-sm mt-1"
                          numberOfLines={2}
                        >
                          {course.description}
                        </Text>
                      )}
                      <View className="flex-row gap-2 mt-2">
                        {course.classLevel && (
                          <Chip size="sm" variant="secondary">
                            <Chip.Label>{course.classLevel}</Chip.Label>
                          </Chip>
                        )}
                        {course.subject && (
                          <Chip size="sm" variant="secondary">
                            <Chip.Label>{course.subject}</Chip.Label>
                          </Chip>
                        )}
                      </View>
                    </View>
                    <Text className="text-foreground font-bold text-lg">
                      {course.pricingType === "free"
                        ? "Free"
                        : `₹${course.price}`}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </Container>
  );
}
