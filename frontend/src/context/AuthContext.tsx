import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginWithGoogle, type UserResponse } from "../api/AuthSerrvice";
import type { ReactNode } from "react";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(data => setUser(data.authenticated ? data : null))
      .finally(() => setLoading(false));
  }, []);

  const login = () => loginWithGoogle();

  const doLogout = () => {
    window.location.href = "/logout";
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}