import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Checkbox from "expo-checkbox";

import UsabilityContext from "../contexts/usability";

export default function MenuOverlayComponent() {
  const { setShowFilter } = useContext(UsabilityContext);
  const [isChecked, setChecked] = useState<boolean>();

  const filterOptions = [
    {
      title: "Food giveaway",
    },
    {
      title: "Food at low price",
    },
    {
      title: "Community shelter",
    },
    {
      title: "Hospital",
    },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Filter by</Text>
        <Icon
          name="close"
          size={32}
          color="#ffff"
          onPress={() => setShowFilter(false)}
        />
      </View>
      {filterOptions.map((item) => (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "orange" : undefined}
          />
          <Text style={{
            color: "white",
            fontFamily: "Montserrat_400Regular",
            
          }}>{item.title}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.searchButtonContainer}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
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
    marginTop: 48,
    marginBottom: 16
  },
  headerLabel: {
    color: "#ffff",
    fontSize: 32,
    fontFamily: "Shrikhand_400Regular",
  },
  checkbox: {
    marginBottom: 8 * 2,
  },
  searchButtonContainer: {
    backgroundColor: "orange",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: "50%",
    borderRadius: 10,
    marginTop: "auto",
    alignSelf: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontFamily: "Shrikhand_400Regular",
    fontSize: 16,
  },
});
