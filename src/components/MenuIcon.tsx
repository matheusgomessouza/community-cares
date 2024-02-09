import { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UsabilityContext from "../contexts/usability";

export default function MenuIconComponent() {
  const { setShowMenu } = useContext(UsabilityContext);

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => setShowMenu(true)}
    >
      <Icon name="menu" color="orange" size={32} />
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
