import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

import Logo from "../../assets/logo.svg";

export default function SignInScreen() {
  return (
    <LinearGradient
      colors={["#EB841A", "#FFFF"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.container}>
        <Logo style={styles.logo} width={285} height={265} />
        <Text style={styles.brandName}>Community Cares</Text>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.textSignButton}>Google</Text>
          <Icon name="google" size={16} color="#FFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.textSignButton}>Github</Text>
          <Icon name="github" size={16} color="#FFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 24,
    paddingTop: 64
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
  },
  logo: {
    marginBottom: 16,
  },
  brandName: {
    fontSize: 24,
    fontFamily: "Shrikhand_400Regular",
    color: "#FFFF",
    marginBottom: "auto",
  },
  signInButton: {
    backgroundColor: "#EB841A",
    height: 40,
    width: 250,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textSignButton: {
    color: "#FFFF",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginRight: 8,
  },
});
