import { Stack } from "expo-router";
import { useFonts, Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";
import {
  Montserrat_200ExtraLight,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { UsabilityProvider } from "@contexts/usability";
import { AuthenticationProvider } from "@contexts/authentication";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Shrikhand_400Regular,
    Montserrat_200ExtraLight,
    Montserrat_300Light_Italic,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
      <AuthenticationProvider>
        <UsabilityProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="signin" />
            <Stack.Screen name="map" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="faq" />
          </Stack>
        </UsabilityProvider>
      </AuthenticationProvider>
  );
}
