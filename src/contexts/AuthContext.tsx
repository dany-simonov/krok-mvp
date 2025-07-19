/**
 * @fileoverview Authentication context for Krok MVP
 *
 * This context provides authentication state management throughout the application.
 * It handles user authentication, session management, and user data updates.
 * Currently implements a mock authentication system for development purposes.
 *
 * Features:
 * - User authentication state management
 * - Mock login/logout functionality
 * - User data persistence in localStorage
 * - User profile updates
 * - Automatic authentication for development
 *
 * @author Krok Development Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types/auth";

/**
 * Extended authentication context type that includes authentication methods
 */
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Authentication context for managing user authentication state
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Инициализация дефолтных пользователей при старте приложения
 */
export function ensureDefaultUsers() {
  const usersRaw = localStorage.getItem("app-users");
  let users: any[] = [];
  try {
    users = usersRaw ? JSON.parse(usersRaw) : [];
  } catch {
    users = [];
  }
  if (!usersRaw || !Array.isArray(users) || users.length === 0) {
    const defaultUsers = [
      {
        id: "1",
        name: "Администратор",
        email: "admin@krokos.com",
        password: "admin123",
        role: "admin",
      },
      {
        id: "2",
        name: "Редактор",
        email: "editor@krokos.com",
        password: "editor123",
        role: "editor",
      },
      {
        id: "3",
        name: "Наблюдатель",
        email: "viewer@krokos.com",
        password: "viewer123",
        role: "viewer",
      },
    ];
    localStorage.setItem("app-users", JSON.stringify(defaultUsers));
  }
}

/**
 * AuthProvider component
 *
 * Provides authentication context to the application. Manages user
 * authentication state, login/logout functionality, and user data updates.
 * Now uses only localStorage for user management.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Гарантируем наличие дефолтных пользователей
  ensureDefaultUsers();

  const [authState, setAuthState] = useState<AuthState>(() => {
    const userRaw = localStorage.getItem("user_data");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const token = localStorage.getItem("auth_token") || "";
    return {
      user,
      isAuthenticated: !!user,
      token,
    };
  });

  // login ищет пользователя в app-users
  const login = async (email: string, password: string): Promise<boolean> => {
    const usersRaw = localStorage.getItem("app-users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find(
      (u: any) => u.email === email && u.password === password
    );
    if (found) {
      setAuthState({
        user: found,
        isAuthenticated: true,
        token: "mock_jwt_token",
      });
      localStorage.setItem("auth_token", "mock_jwt_token");
      localStorage.setItem("user_data", JSON.stringify(found));
      return true;
    } else {
      return false;
    }
  };

  // logout просто очищает user_data и токен
  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, token: "" });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  // updateUser обновляет пользователя в app-users и user_data
  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      // Обновить пользователя в массиве app-users
      const usersRaw = localStorage.getItem("app-users");
      let users = usersRaw ? JSON.parse(usersRaw) : [];
      users = users.map((u: any) =>
        u.id === updatedUser.id ? updatedUser : u
      );
      localStorage.setItem("app-users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 *
 * Provides access to authentication state and methods throughout the application.
 * Must be used within an AuthProvider component.
 *
 * @returns AuthContextType - Authentication context value
 * @throws Error - If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
