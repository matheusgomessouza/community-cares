import { StyleSheet, View, Text } from "react-native";

export function FrequentlyAskedQuestionCardComponent() {
  return (
    <View style={styles.answerContainer}>
      <View style={styles.icon}>
        <Text style={styles.symbol}>?</Text>
      </View>
      <Text style={styles.answerText}>
        It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was
        popularised in the 1960s with the release of Letraset sheets containing
        Lorem Ipsum passages, and more recently with desktop publishing software
        like Aldus PageMaker including versions of Lorem Ipsum.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 32,
    width: "100%",
    textAlign: "center",
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
  answerText: {
    flexWrap: "wrap",
    fontSize: 8,
    fontFamily: "Montserrat_400Regular",
    width: "75%",
    textAlign: "justify",
    color: "#9E5811",
  },
});
