import { Ionicons } from "@expo/vector-icons";
import { Button, Card, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const primary = useThemeColor("accent");
  const user = session?.user;

  return (
    <Container className="p-4">
      {/* Avatar & name */}
      <View className="items-center py-6">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
          <Text className="text-primary text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-xl font-bold text-foreground">{user?.name}</Text>
        <Text className="text-muted text-sm mt-1">{user?.email}</Text>
      </View>

      {/* Info cards */}
      <View className="gap-3">
        <Card className="p-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="person-outline" size={20} color={primary} />
            <View className="flex-1">
              <Text className="text-muted text-xs">Role</Text>
              <Text className="text-foreground font-medium capitalize">
                {(user as any)?.role ?? "student"}
              </Text>
            </View>
          </View>
        </Card>

        {(user as any)?.classLevel && (
          <Card className="p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="school-outline" size={20} color={primary} />
              <View className="flex-1">
                <Text className="text-muted text-xs">Class Level</Text>
                <Text className="text-foreground font-medium">
                  {(user as any).classLevel}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {(user as any)?.targetExam && (
          <Card className="p-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="trophy-outline" size={20} color={primary} />
              <View className="flex-1">
                <Text className="text-muted text-xs">Target Exam</Text>
                <Text className="text-foreground font-medium">
                  {(user as any).targetExam}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Theme toggle */}
        <Card className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={primary}
              />
              <Text className="text-foreground font-medium">Theme</Text>
            </View>
            <ThemeToggle />
          </View>
        </Card>

        {/* Sign out */}
        <Button
          variant="danger"
          className="mt-4"
          onPress={() => {
            authClient.signOut();
            queryClient.invalidateQueries();
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Button.Label>Sign Out</Button.Label>
        </Button>
      </View>
    </Container>
  );
}
