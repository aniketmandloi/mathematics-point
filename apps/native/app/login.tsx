import { router } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";

export default function LoginScreen() {
  const { data: session } = authClient.useSession();

  // If user is logged in, go back
  if (session?.user) {
    router.back();
    return null;
  }

  return (
    <Container className="p-6">
      <View className="py-8 items-center">
        <View className="w-12 h-12 rounded-xl bg-primary items-center justify-center mb-4">
          <Text className="text-primary-foreground font-bold text-lg">M</Text>
        </View>
        <Text className="text-2xl font-bold text-foreground">
          Mathematics Point
        </Text>
        <Text className="text-muted text-sm mt-2 text-center">
          Sign in to access your courses and track your progress.
        </Text>
      </View>

      <SignIn />
      <View className="my-4" />
      <SignUp />
    </Container>
  );
}
