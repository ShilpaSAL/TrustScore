import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // Restore Login Session
  // ==========================================================

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("rcas_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const { data } = await api.get("/auth/me");

        setUser(data);
      } catch (error) {
        localStorage.removeItem("rcas_token");

        delete api.defaults.headers.common[
          "Authorization"
        ];

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ==========================================================
  // Login
  // ==========================================================

  const login = async (email, password) => {
    const { data } = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "rcas_token",
      data.token
    );

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    setUser(data.user);

    return data.user;
  };

  // ==========================================================
  // Register
  // ==========================================================

  const register = async (
    name,
    email,
    password,
    role
  ) => {
    const { data } = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        role,
      }
    );

    localStorage.setItem(
      "rcas_token",
      data.token
    );

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    setUser(data.user);

    return data.user;
  };

  // ==========================================================
  // Update User in Context
  // ==========================================================

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // ==========================================================
  // Logout
  // ==========================================================

  const logout = () => {
    localStorage.removeItem("rcas_token");

    delete api.defaults.headers.common[
      "Authorization"
    ];

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}