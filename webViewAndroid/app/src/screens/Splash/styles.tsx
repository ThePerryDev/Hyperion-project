import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#121212"
  },
  imagecontainer: {
    alignItems: "center",
    padding:10,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});

export default styles;