import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  userName: null,
  token: null,
  role: null,
  isLoading: true,
  login: (_token, _name, _role) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("loggedInUser");
    const storedRole = localStorage.getItem("role");
    
    if (storedToken && storedName) {
      setToken(storedToken);
      setUserName(storedName);
      if (storedRole) setRole(storedRole);
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken, name, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("loggedInUser", name);
    if (newRole) localStorage.setItem("role", newRole);
    setToken(newToken);
    setUserName(name);
    setRole(newRole || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    setToken(null);
    setUserName(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && userName),
      userName,
      token,
      role,
      isLoading,
      login,
      logout,
    }),
    [token, userName, role, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


