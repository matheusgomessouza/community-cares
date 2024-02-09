import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import MenuIconComponent from "./src/components/MenuIcon";
import { useContext } from "react";
import UsabilityContext, { UsabilityProvider } from "./src/contexts/usability";
import MenuOverlayComponent from "./src/components/MenuOverlay";
import { useFonts, Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Shrikhand_400Regular,
  });
  const { showMenu } = useContext(UsabilityContext);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UsabilityProvider>
      <View style={styles.container}>
        <MenuIconComponent />
        <MenuOverlayComponent />
        <MapView style={styles.map} />
      </View>
    </UsabilityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
