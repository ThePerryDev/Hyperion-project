import { createContext } from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  signin: (token: string, userId: string) => Promise<void>;
  signout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  signin: async () => {},
  signout: async () => {},
});
