import { View, Image, Text } from "react-native";
import styles from "./styles";

const PreviewCard = () => {
    return(
        <View style={styles.CardContainer}>
            <View style={styles.CardImageContainer}>
                <Image source={require("../../../assets/adaptive-icon.png")} style={styles.CardImagePreview}/>
            </View>
            <View style={styles.CardDataContainer}>
                <Text style={styles.DataText}>Id:</Text>
                <Text style={styles.DataText}>BBox</Text>
                <Text style={styles.DataText}>Data:</Text>
            </View>
        </View>
    );
}

export default PreviewCard;