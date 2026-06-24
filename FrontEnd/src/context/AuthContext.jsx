import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthCtx = createContext();

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rcas_token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("rcas_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("rcas_token", data.token);

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    setUser(data.user);

    return data.user;
  };

  const register = async (
    name,
    email,
    password,
    role
  ) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    localStorage.setItem("rcas_token", data.token);

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("rcas_token");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}