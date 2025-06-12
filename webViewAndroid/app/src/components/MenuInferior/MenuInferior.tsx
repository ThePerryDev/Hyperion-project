import { TouchableOpacity, View, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const MenuInferior = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.MenuInferior}>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Image source={require("../../../assets/map-unselected.png")} style={styles.logo} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("MenuFavoritosScreen")}>
        <Image source={require("../../../assets/menu-unselected.png")} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuInferior;
