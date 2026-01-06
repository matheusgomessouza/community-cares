import { StyleSheet, View, Text } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as interfaces from "@interfaces/index";
import { ComponentProps } from "react";

export function FrequentlyAskedQuestionCardComponent({
  questionLabel,
  questionAnswer,
  iconName = "help",
}: interfaces.FrequentlyAskedQuestionProps) {
  return (
    <View style={styles.answerContainer}>
      <View style={styles.icon}>
        <Icon name={iconName as ComponentProps<typeof Icon>['name']} size={32} color="#C76E16" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.answerLabel}>{questionLabel}</Text>
        <Text style={styles.answerText}>{questionAnswer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  answerContainer: {
    backgroundColor: "#EBCFB2",
    width: "100%",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  answerLabel: {
    color: "#C76E16",
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#333",
    lineHeight: 18,
  },
});
