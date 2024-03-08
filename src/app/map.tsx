import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../../src/components/MenuOverlay";
import UsabilityContext from "../contexts/usability";

export default function MapScreen() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);

  return (
    <View style={styles.container}>
      {showFilter && <MenuOverlayComponent />}
      <View
        style={{
          zIndex: 50,
          width: "80%",
          height: 56,
          backgroundColor: "#FFFF",
          borderRadius: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 32,
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Icon
          name="account"
          size={24}
          color="#EB841A"
          onPress={() => {
            router.navigate("profile");
          }}
        />
        <Text style={{
          fontFamily: "Montserrat_700Bold",
          color: "#EB841A"
        }}>Community Cares</Text>
        <Icon
          name="magnify"
          size={24}
          color="#EB841A"
          onPress={() => {
            setShowFilter(true);
          }}
        />
      </View>
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
