import { router } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function FrequentlyAskedQuestionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Icon
          style={{ marginLeft: 0, marginRight: "auto" }}
          name="chevron-left"
          size={24}
          color="#C76E16"
          onPress={() => {
            router.navigate("profile");
          }}
        />

        <View style={{ marginRight: "auto", alignItems: "center" }}>
          <Text style={styles.brandName}>Community Cares</Text>
          <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        </View>
      </View>
      <ScrollView style={{ marginTop: 40, width: "100%" }} scrollEnabled>
        <View style={styles.answerContainer}>
          <View style={styles.icon}>
            <Text style={styles.symbol}>?</Text>
          </View>
          <Text
            style={{
              flexWrap: "wrap",
              fontSize: 8,
              fontFamily: "Montserrat_400Regular",
              width: "75%",
              textAlign: "justify",
              color: "#9E5811"
            }}
          >
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Text>
        </View>
        <View style={styles.answerContainer}>
          <View style={styles.icon}>
            <Text style={styles.symbol}>?</Text>
          </View>
          <Text
            style={{
              flexWrap: "wrap",
              fontSize: 8,
              fontFamily: "Montserrat_400Regular",
              width: "75%",
              textAlign: "justify",
              color: "#9E5811"
            }}
          >
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Text>
        </View>
        <View style={styles.answerContainer}>
          <View style={styles.icon}>
            <Text style={styles.symbol}>?</Text>
          </View>
          <Text
            style={{
              flexWrap: "wrap",
              fontSize: 8,
              fontFamily: "Montserrat_400Regular",
              width: "75%",
              textAlign: "justify",
              color: "#9E5811"
            }}
          >
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  brandName: {
    fontFamily: "Shrikhand_400Regular",
    color: "#C76E16",
    fontSize: 16,
  },
  subtitle: {
    fontFamily: "Montserrat_300Light_Italic",
    fontSize: 8,
  },
  icon: {
    backgroundColor: "#FFF",
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    color: "#C76E16",
    fontFamily: "Shrikhand_400Regular",
    fontSize: 24,
  },
  answerContainer: {
    backgroundColor: "rgba(199, 110, 22, 0.4)",
    width: "100%",
    borderRadius: 20,
    minHeight: 100,
    maxHeight: "auto",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 40,
  },
});
