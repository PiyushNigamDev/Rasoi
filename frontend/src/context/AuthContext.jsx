import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("rasoi_user") || localStorage.getItem("cloud_kitchen_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("rasoi_token") || localStorage.getItem("cloud_kitchen_token") || null;
  });

  // Save user + token
  useEffect(() => {
    if (user) {
      localStorage.setItem("rasoi_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("rasoi_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("rasoi_token", token);
    } else {
      localStorage.removeItem("rasoi_token");
    }
  }, [token]);

  // Call this after successful login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken || null);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rasoi_user");
    localStorage.removeItem("rasoi_token");
    localStorage.removeItem("cloud_kitchen_user");
    localStorage.removeItem("cloud_kitchen_token");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}