import { View, Image } from "react-native";
import styles from "./styles";
import MenuInferior from "../../components/MenuInferior/MenuInferior";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useEffect } from "react";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "SplashScreen"
>;

type Props = {
  navigation: NavigationProps;
};

const SplashScreen : React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate("MenuFavoritosScreen");
        }, 2500);
    
        return () => clearTimeout(timer);
      }, [navigation]);
    
      return (
        <View style={styles.container}>
          <View style={styles.imagecontainer}>
            <Image
              source={require("../../../assets/adaptive-icon.png")}
              style={styles.image}
            />
          </View>
          <MenuInferior/>
        </View>
      );
}

export default SplashScreen;