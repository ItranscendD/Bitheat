import { Stack } from 'expo-router';
import { useTheme } from '@/design/theme';

export default function RecordsLayout() {
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
      <Stack.Screen name="scan" />
      <Stack.Screen name="search" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="add-service" />
      <Stack.Screen name="service-details" />
      <Stack.Screen name="confirm-service" />
    </Stack>
  );
}
