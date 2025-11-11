import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/AuthSerrvice";
import type { ReactNode } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(data => {
        if (data.authenticated) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    // Pokreće OAuth login flow
    window.location.href = "https://progi-projekt.onrender.com/auth/google";
  };

  const logout = () => {
    window.location.href = "https://progi-projekt.onrender.com/logout";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}