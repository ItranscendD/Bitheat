import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { 
  useFonts, 
  SpaceGrotesk_700Bold, 
  SpaceGrotesk_400Regular, 
  SpaceGrotesk_500Medium 
} from '@expo-google-fonts/space-grotesk';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/design/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    DMSans_400Regular,
    SpaceMono_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(chw)" options={{ headerShown: false }} />
        <Stack.Screen name="(guardian)" options={{ headerShown: false }} />
        <Stack.Screen name="(dev)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

