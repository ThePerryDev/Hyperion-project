import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  MenuInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#121212",
    height: 100,
  },

  logo: {
    width: 50,
    height: 50,
  },
});

export default styles;