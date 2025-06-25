// Para arquivos .png
declare module "*.png" {
  const value: string;
  export default value;
}

// Para o módulo de ícones
declare module "react-native-vector-icons/FontAwesome" {
  const Icon: any;
  export default Icon;
}
