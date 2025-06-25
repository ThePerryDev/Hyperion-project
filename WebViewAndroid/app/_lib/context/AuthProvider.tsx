import { ReactNode, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const savedToken = await SecureStore.getItemAsync("authToken");
      const savedUserId = await SecureStore.getItemAsync("userId");
      if (savedToken) setToken(savedToken);
      if (savedUserId) setUserId(savedUserId);
    };
    loadAuthData();
  }, []);

  const signin = async (token: string, userId: string) => {
    await SecureStore.setItemAsync("authToken", token);
    await SecureStore.setItemAsync("userId", userId);
    setToken(token);
    setUserId(userId);
  };

  const signout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
