import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../types/User";
import { useApi } from "../hooks/useApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const api = useApi();

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const validatedUser = await api.validateUser();
        if (validatedUser) {
          setUser(validatedUser);
        }
      }
    };

    validateUser();
  }, []);

  const signin = async (email: string, password: string) => {
    const userData = await api.signin(email, password);
    if (userData) {
      setUser(userData);
      return true;
    }
    return false;
  };

  const signout = () => {
    api.signout();
    setUser(null);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
