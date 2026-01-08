import { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MenuIcon from "react-native-vector-icons/MaterialIcons";
import UsabilityContext from "../contexts/usability";

export function MenuIconComponent() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);

  return (
    <TouchableOpacity
      accessibilityLabel="press-to-show-filter"
      testID="press-to-show-filter"
      accessibilityRole="button"
      style={styles.buttonContainer}
      onPress={() => setShowFilter(!showFilter)}
    >
      <MenuIcon name="menu" color="orange" size={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 16,
    marginRight: 16,
    zIndex: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    padding: 8,
  },
});
