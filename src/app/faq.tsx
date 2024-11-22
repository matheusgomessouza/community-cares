import { router } from "expo-router";
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { FrequentlyAskedQuestionCardComponent } from "@components/FrequentlyAskedQuestionCard";

export default function FrequentlyAskedQuestionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          style={styles.backButton}
          name="chevron-left"
          size={24}
          color="#C76E16"
          onPress={() => {
            router.navigate("profile");
          }}
        />

        <View style={styles.headerText}>
          <Text style={styles.brandName}>Community Cares</Text>
          <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        </View>
      </View>
      <ScrollView style={styles.questionScroll} scrollEnabled>
        <FrequentlyAskedQuestionCardComponent
          questionLabel="Why should I write tests?"
          questionAnswer="Because increases reliability of your codebase"
        />
        <FrequentlyAskedQuestionCardComponent
          questionLabel="Why should I write tests?"
          questionAnswer="Because increases reliability of your codebase"
        />
        <FrequentlyAskedQuestionCardComponent
          questionLabel="Why should I write tests?"
          questionAnswer="Because increases reliability of your codebase"
        />
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
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  backButton: { marginLeft: 0, marginRight: "auto" },
  headerText: { marginRight: "auto", alignItems: "center" },
  brandName: {
    fontFamily: "Shrikhand_400Regular",
    color: "#C76E16",
    fontSize: 20,
  },
  subtitle: {
    fontFamily: "Montserrat_300Light_Italic",
    fontSize: 12,
    color: "#9F9B9B",
  },
  questionScroll: { marginTop: 40, width: "100%" },
});
