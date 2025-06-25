import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../types/User";
import { useApi } from "../hooks/useApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const validateUser = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);

        const validatedUser = await api.validateUser();
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateUser();
  }, []);

const signin = async (email: string, password: string) => {
  console.log("ReactNativeWebView disponível?", !!window.ReactNativeWebView);
  const userData = await api.signin(email, password);
  const storedToken = localStorage.getItem("authToken"); // token já salvo dentro do signin
  if (userData && storedToken) {
    setUser(userData);
    setToken(storedToken);
    console.log("Enviando token para o app nativo...");
    // Envia para WebView (se estiver rodando dentro do app)
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "SET_TOKEN",
        token: storedToken,
        userId: userData.id
      }));
      console.log("✅ Token enviado para WebView");
    } else {
      console.warn("⚠️ ReactNativeWebView não está disponível — usando navegador?");
    }

    return true;
  }
  return false;
};


  const signout = async () => {
    await api.signout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <AuthContext.Provider value={{ user, token, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
