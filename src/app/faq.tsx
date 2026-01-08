import { router } from "expo-router";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import {SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import { FrequentlyAskedQuestionCardComponent } from "@components/FrequentlyAskedQuestionCardComponent";

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
      <ScrollView style={styles.questionScroll} scrollEnabled showsVerticalScrollIndicator={false}>
        <FrequentlyAskedQuestionCardComponent
          iconName="help"
          questionLabel="How do I find food locations?"
          questionAnswer="Use the map or list view to discover nearby free food giveaways."
        />
        <FrequentlyAskedQuestionCardComponent
          iconName="heart"
          questionLabel="Can I contribute food?"
          questionAnswer="Yes! Use the 'Give' feature to share details about your giveaway."
        />
        <FrequentlyAskedQuestionCardComponent
          iconName="cog"
          questionLabel="Is this app free?"
          questionAnswer="Absolutely. Community Cares is completely free for everyone."
        />
        <FrequentlyAskedQuestionCardComponent
          iconName="web"
          questionLabel="What is the global statistic?"
          questionAnswer="According to the UN, an estimated 150 million people are homeless worldwide. (Source: ONU)"
        />
        <FrequentlyAskedQuestionCardComponent
          iconName="poll"
          questionLabel="Why is this important?"
          questionAnswer="Helping these individuals provides basic human needs and dignity."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  brandName: {
    fontFamily: "Shrikhand_400Regular",
    color: "#C76E16",
    fontSize: 24,
  },
  subtitle: {
    fontFamily: "Montserrat_300Light_Italic",
    fontSize: 14,
    color: "#9F9B9B",
    marginTop: 4,
  },
  questionScroll: { marginTop: 20, width: "100%" },
});
