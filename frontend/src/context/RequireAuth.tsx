import { useContext, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { Login } from "../pages"

export default function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  
  // se não há usuário logado, manda pra página de login
  if (!auth.user) {
    return <Login />;
  }
  return children;
}