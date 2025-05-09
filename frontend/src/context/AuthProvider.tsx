import { useEffect, useState, ReactNode} from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../types/User";
import { useApi } from "../hooks/useApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  // salva o usuário logado. Quando não há usuário, salva nulo (igual quando começa)
  const [user, setUser] = useState<User | null>(null);
  const api = useApi();
  
  useEffect(() => {
    const validateUser = async () => {
      const email = localStorage.getItem("authEmail");
      if (email) {
        const data = await api.validateUser(email);
        if (data && data.isLogged) {
          setUser(data);
        }
      }
    };

    validateUser();
  }, []);

  //faz reaquisição para o BACKEND para ver se a autenticação funciona ou não
  const signin = async (email: string, password: string) => {
    const data = await api.signin(email, password);
    console.log(data)

    //Se há um usuário e ele está logado, então salva o usuário
    if (data && data.isLogged) {
      setUser(data);
      setLocalStorage(data);
      return true;
    }
    return false;
  };

  //zera o usuário
  const signout = async () => {
    let email = user?.email ? user?.email : "";
    await api.logout(email);
    setUser(null);
    localStorage.clear();
    window.location.reload();
  };

  const setLocalStorage = (user: User) => {
    localStorage.setItem("authEmail", user.email);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}