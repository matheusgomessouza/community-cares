import { Stack } from "expo-router";
import { useFonts, Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { UsabilityProvider } from "../contexts/usability";

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Shrikhand_400Regular,
    Montserrat_400Regular,
    Montserrat_700Bold
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UsabilityProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="signin" />
        <Stack.Screen name="map" />
      </Stack>
    </UsabilityProvider>
  );
}
