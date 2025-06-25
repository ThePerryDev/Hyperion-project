import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingTop: Constants.statusBarHeight,
    height: Constants.statusBarHeight + 60,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#121212",
    marginBottom:15,
  },
  HeaderLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  HeaderLogo: {
    width: 150,
    height: 40,
    resizeMode: "contain",
  },
});

export default styles;