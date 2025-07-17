import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { ServiceAuth } from '../services/Auth';
import { ServiceUser } from '../services/Users';
import type { credentialsType, UserType } from '../utils/Credentials';

export interface AuthContextType {
  token: string;
  user: UserType | null;
  setUser: (user: UserType) => void;
  login: (credentials: credentialsType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>(() => {
    const storedToken = localStorage.getItem("authToken");
    return storedToken || "";
  });

  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      getUserLogged();
    }
  }, [token]);

  const login = async (creds: credentialsType) => {
    try {
      const response = await ServiceAuth.login(creds);
      if (response.status === 200 && response.data) {
        localStorage.setItem("authToken", response.data);
        setToken(response.data);
        getUserLogged();
      } else {
        console.error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const getUserLogged = async () => {
    try {
      const dataUser = await ServiceUser.getUserById();
      if (dataUser.data) {
        localStorage.setItem("user", JSON.stringify(dataUser.data));
        setUser(dataUser.data);
      } else {
        console.error("Failed to fetch user data after login");
      }
    } catch (error) {
      console.error("getUserLogged error:", error);
    }
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
