import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";

import { authClient } from "@/lib/auth-client";

export default function TabLayout() {
  const { data: session, isPending } = authClient.useSession();
  const foreground = useThemeColor("foreground");
  const background = useThemeColor("background");
  const primary = useThemeColor("accent");

  if (isPending) return null;

  if (!session?.user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: background },
        headerTintColor: foreground,
        headerTitleStyle: { fontWeight: "600", color: foreground },
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: background,
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: foreground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: "My Courses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
