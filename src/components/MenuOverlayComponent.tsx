import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CloseIcon from "react-native-vector-icons/MaterialIcons";
import Checkbox from "expo-checkbox";

import UsabilityContext from "../contexts/usability";

export function MenuOverlayComponent() {
  const { setShowFilter, foreignUser } = useContext(UsabilityContext);
  const [isChecked, setChecked] = useState<boolean>();

  const filterOptions = [
    {
      title: "Community kitchen",
      br_title: "Cozinha comunitária",
    },
    {
      title: "Solidarity kitchen",
      br_title: "Cozinha solidária",
    },
    {
      title: "Shelter",
      br_title: "Abrigo",
    },
    {
      title: "Hospital",
      br_title: "Hospital",
    },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>
          {foreignUser ? "Filter by" : "Filtrar por"}
        </Text>
        <CloseIcon
          name="close"
          size={32}
          color="#ffff"
          onPress={() => setShowFilter(false)}
        />
      </View>
      {filterOptions.map((item) => (
        <View
          key={item.title}
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
          <Text
            style={{
              color: "white",
              fontFamily: "Montserrat_400Regular",
            }}
          >
            {foreignUser ? item.title : item.br_title}
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.searchButtonContainer}>
        <Text style={styles.searchButtonText}>
          {foreignUser ? "Search" : "Procurar"}
        </Text>
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
    marginBottom: 16,
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
    marginBottom: 24,
    alignSelf: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontFamily: "Shrikhand_400Regular",
    fontSize: 16,
  },
});
