import { StyleSheet, View, Text } from "react-native";
import * as interfaces from "@interfaces/index";

export function FrequentlyAskedQuestionCardComponent({
  questionLabel,
  questionAnswer,
}: interfaces.FrequentlyAskedQuestionProps) {
  return (
    <View style={styles.answerContainer}>
      <View style={styles.icon}>
        <Text style={styles.symbol}>?</Text>
      </View>
      <View>
        <Text style={styles.answerLabel}>{questionLabel}</Text>
        <Text style={styles.answerText}>{questionAnswer}</Text>
      </View>
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
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 40,
  },
  answerLabel: {
    color: "#C76E16",
    fontSize: 12,
    fontFamily: "Montserrat_700Bold"
  },
  answerText: {
    flexWrap: "wrap",
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
    width: "75%",
    textAlign: "justify",
    color: "#9E5811",
  },
});
