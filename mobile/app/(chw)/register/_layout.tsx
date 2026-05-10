import { Stack } from 'expo-router';
import { useTheme } from '@/design/theme';

export default function RegisterLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new-child" />
      <Stack.Screen name="link-guardian" />
      <Stack.Screen name="capture-photo" />
      <Stack.Screen name="generating" />
      <Stack.Screen name="qr-display" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
