declare module "*.png" {
  const value: any;
  export default value;
}

declare module "react-native-vector-icons/FontAwesome" {
  import { Icon } from "react-native-vector-icons/Icon";
  export default Icon;
}

declare module '@react-navigation/native-stack' {
  export type NativeStackNavigationProp<
    ParamList,
    RouteName extends keyof ParamList = string
  > = any;
}

declare module '@react-navigation/native' {
  export type RouteProp<
    ParamList,
    RouteName extends keyof ParamList = string
  > = {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };
}