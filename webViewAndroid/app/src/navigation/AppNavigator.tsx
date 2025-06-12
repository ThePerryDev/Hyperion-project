import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/Home/HomeScreen";
import MenuFavoritosScreen from "../screens/MenuFavoritos/MenuFavoritosScreen";
import SplashScreen from "../screens/Splash/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MenuFavoritosScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MenuFavoritosScreen" component={MenuFavoritosScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}