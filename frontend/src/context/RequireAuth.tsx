import { useContext, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Login } from "../pages";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aguarda o contexto validar o usuário (via useEffect do AuthProvider)
    const checkAuth = async () => {
      // Simples delay para aguardar o resultado da validação
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!auth.user) {
    return <Login />;
  }

  return children;
}
