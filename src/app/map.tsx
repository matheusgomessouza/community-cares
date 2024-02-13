import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import MenuIconComponent from "../../src/components/MenuIcon";
import MenuOverlayComponent from "../../src/components/MenuOverlay";
import { useContext } from "react";
import UsabilityContext from "../contexts/usability";

export default function MapScreen() {
  const { showMenu } = useContext(UsabilityContext);

  return (
    <View style={styles.container}>
      <MenuIconComponent />
      {showMenu && <MenuOverlayComponent />}
      <MapView style={styles.map} />
    </View>
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