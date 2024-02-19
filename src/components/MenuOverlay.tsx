import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UsabilityContext from "../contexts/usability";

export default function MenuOverlayComponent() {
  const { setShowMenu } = useContext(UsabilityContext);

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Filter by</Text>
        <Icon
          name="close"
          size={32}
          color="#ffff"
          onPress={() => setShowMenu(false)}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          width: "100%",
          marginTop: "auto",
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Shrikhand_400Regular",
            fontSize: 16
          }}
        >
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 16,
    zIndex: 51,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    marginTop: 48
  },
  headerLabel: {
    color: "#ffff",
    fontSize: 32,
    fontFamily: "Shrikhand_400Regular",
  },
});
