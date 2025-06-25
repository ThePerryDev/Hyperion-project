import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";

interface PreviewCardProps {
  id: string;
  bbox: string;
  data: string;
  thumbnail: string;
  isFavorito?: boolean;
  onToggleFavorite?: () => void;
}

const PreviewCard = ({
  id,
  bbox,
  data,
  thumbnail,
  isFavorito = false,
  onToggleFavorite,
}: PreviewCardProps) => {
  return (
    <View style={styles.CardContainer}>
      <TouchableOpacity
        style={styles.HeartIconContainer}
        onPress={onToggleFavorite}
        disabled={!onToggleFavorite} // evita clique se não for passado
      >
        <Icon name="heart" size={24} color={isFavorito ? "#fe5000" : "#CCCCCC"} />
      </TouchableOpacity>

      <View style={styles.CardImageContainer}>
        <Image source={{ uri: thumbnail }} style={styles.CardImagePreview} />
      </View>

      <View style={styles.CardDataContainer}>
        <Text style={styles.DataText}>ID: {id}</Text>
        <Text style={styles.DataText}>BBox: {bbox}</Text>
        <Text style={styles.DataText}>Data: {data}</Text>
      </View>
    </View>
  );
};

export default PreviewCard;
