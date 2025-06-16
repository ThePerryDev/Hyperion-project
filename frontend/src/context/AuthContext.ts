import { createContext } from "react";
import { User } from "../types/User";

// Correção no nome do tipo
export type AuthContextType = {
    user: User | null;
    token: string | null;
    signin: (email: string, password: string) => Promise<boolean>;
    signout: () => void;
}

// E também aqui:
export const AuthContext = createContext<AuthContextType>(null!);
