import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  CardContainer: {
    width: 330,
    backgroundColor: "#d9d9d9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  CardImageContainer: {
    alignItems: "center",
    padding: 10,
  },
  CardImagePreview: {
    width: 250,
    height: 250,
    resizeMode: "cover",
    borderRadius: 4,
    marginBottom: 15,
  },
  CardDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"none",
    padding: 10,
    borderRadius: 6,
  },
  DataText: {
    fontWeight:"bold",
    padding: 5,
  },
  HeartIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  }
});

export default styles;