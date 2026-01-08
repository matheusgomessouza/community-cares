import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import CloseIcon from "react-native-vector-icons/MaterialIcons";
import Checkbox from "expo-checkbox";

import UsabilityContext from "../contexts/usability";

export function FilterComponent() {
  const { setShowFilter, foreignUser, selectedFilters, setSelectedFilters } =
    useContext(UsabilityContext);

  const filterOptions = [
    {
      title: "Community kitchen",
      br_title: "Cozinha comunitária",
      type: "community-kitchen",
    },
    {
      title: "Solidarity kitchen",
      br_title: "Cozinha solidária",
      type: "solidarity-kitchen",
    },
    {
      title: "Shelter",
      br_title: "Abrigo",
      type: "shelter",
    },
    {
      title: "Hospital",
      br_title: "Hospital",
      type: "hospital",
    },
  ];

  const toggleFilter = (type: string) => {
    if (selectedFilters.includes(type)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== type));
    } else {
      setSelectedFilters([...selectedFilters, type]);
    }
  };

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
            value={selectedFilters.includes(item.type)}
            onValueChange={() => toggleFilter(item.type)}
            color={selectedFilters.includes(item.type) ? "#C76E16" : undefined}
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
});
