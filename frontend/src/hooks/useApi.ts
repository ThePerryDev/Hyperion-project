import api from "../services/api";
import { User } from "../types/User";

export const useApi = () => ({
  validateUser: async (): Promise<User | null> => {
    try {
      const res = await api.get("/usuarios/me");
      return res.data as User;
    } catch (error) {
      console.error("❌ Token inválido ou expirado");
      return null;
    }
  },

  signin: async (email: string, password: string): Promise<User | null> => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // ⚠️ Nome esperado: username
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.data?.access_token) {
        localStorage.setItem("authToken", res.data.access_token);
        localStorage.setItem("authEmail", res.data.user.email);
        return res.data.user;
      }
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
    }

    return null;
  },

  signout: async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("⚠️ Falha ao chamar logout no backend:", err);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("authEmail");
  },
});
