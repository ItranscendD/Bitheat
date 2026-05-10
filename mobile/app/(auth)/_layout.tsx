import { Stack } from 'expo-router';
import { useTheme } from '@/design/theme';

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="set-pin" />
      <Stack.Screen name="generating-did" />
      <Stack.Screen name="optional-sync" />
    </Stack>
  );
}
