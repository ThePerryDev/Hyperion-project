import { TouchableOpacity, View, Image } from 'react-native';
import { router } from 'expo-router';
import styles from './styles';

const MenuInferior = () => {
  return (
    <View style={styles.MenuInferior}>
      <TouchableOpacity onPress={() => router.push('/home')}>
        <Image source={require('../../../assets/map-unselected.png')} style={styles.logo} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/favoritos')}>
        <Image source={require('../../../assets/menu-unselected.png')} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuInferior;