import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { router } from 'expo-router';
import styles from './styles';
import MenuInferior from '../../components/MenuInferior/MenuInferior';

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <Image source={require('../../../assets/logo_hyperion.png')} style={styles.image} />
      </View>
    </View>
  );
};

export default SplashScreen;