import { View, Image, ScrollView } from "react-native";
import styles from "./styles";
import Card from "../../components/Card/Card";
import MenuInferior from "../../components/MenuInferior/MenuInferior";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "MenuFavoritosScreen"
>;

type Props = {
  navigation: NavigationProps;
};

const MenuFavoritosScreen : React.FC<Props> = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Card/>
                <Card/>
            </ScrollView>
            <MenuInferior/>
        </View>
    );
}

export default MenuFavoritosScreen;