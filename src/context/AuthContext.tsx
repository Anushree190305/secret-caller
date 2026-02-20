import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("netflix_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const signup = (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("netflix_users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }
    users.push({ name, email, password });
    localStorage.setItem("netflix_users", JSON.stringify(users));
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("netflix_users") || "[]");
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password" };
    const userData = { name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem("netflix_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("netflix_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
