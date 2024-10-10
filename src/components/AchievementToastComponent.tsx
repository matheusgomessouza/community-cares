import { View, Text, StyleSheet, Easing } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as interfaces from "../interfaces/index";
import { Platform } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

export default function AchievementToastComponent({
  achievementDescription,
  iconName,
}: interfaces.AchievementToastComponentProps) {
  return (
    <Animated.View
      style={styles.achievementComponentWrapper}
      entering={FadeInDown.duration(500)}
      exiting={FadeOutDown.duration(500)}
    >
      <View style={styles.achievementIconWrapper}>
        <Icon
          name={iconName}
          size={24}
          style={styles.achievementIcon}
          color="#FFF"
        />
      </View>
      <View style={styles.textInformation}>
        <Text style={styles.achievementHeadline}>Achievement unlocked</Text>
        <Text style={styles.achievementDescriptionText}>
          {achievementDescription}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  achievementComponentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: "#FFF",
    borderRadius: 50,
    width: "80%",
    height: 64,
    position: "absolute",
    bottom: 184,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  achievementIconWrapper: {
    backgroundColor: "#C76E16",
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementIcon: {},
  textInformation: {},
  achievementHeadline: {
    color: "#C76E16",
    fontFamily: "Shrikhand_400Regular",
  },
  achievementDescriptionText: {
    color: "#C76E16",
    fontSize: 12,
  },
});
