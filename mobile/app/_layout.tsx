import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Font from 'expo-font';
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
  // On web, start as true to skip SSR blocking. On native, start false.
  const [webFontsLoaded, setWebFontsLoaded] = useState(
    Platform.OS === 'web' ? false : true
  );

  const [nativeFontsLoaded, error] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    DMSans_400Regular,
    SpaceMono_400Regular,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, load fonts client-side only
      Font.loadAsync({
        SpaceGrotesk_700Bold,
        SpaceGrotesk_400Regular,
        SpaceGrotesk_500Medium,
        DMSans_400Regular,
        SpaceMono_400Regular,
      }).then(() => setWebFontsLoaded(true));
    }
  }, []);

  const isLoaded = Platform.OS === 'web' ? webFontsLoaded : nativeFontsLoaded;

  useEffect(() => {
    if (isLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, error]);

  if (!isLoaded && !error) {
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
