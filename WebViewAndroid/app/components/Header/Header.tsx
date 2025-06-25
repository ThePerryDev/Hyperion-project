import { View, Image, Text } from "react-native";
import styles from "./styles";

const Header = () => {
    return(
        <View style={styles.HeaderContainer}>
            <View style={styles.HeaderLogoContainer}>
                <Image source={require("../../../assets/logo_hyperion.png")} style={styles.HeaderLogo}/>
            </View>
        </View>
    );
}

export default Header;