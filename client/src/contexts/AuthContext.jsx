import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, ensureSeedData, sanitizeUser, createDefaultSettings } from "../lib/api";

export const AuthContext = createContext(null);

const readJson = (key, fallback) => {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getUsers = () => readJson(STORAGE_KEYS.users, []);
const saveUsers = (users) => writeJson(STORAGE_KEYS.users, users);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ensureSeedData();
    setCurrentUser(readJson(STORAGE_KEYS.currentUser, null));
    setIsLoading(false);

    const syncCurrentUser = () => {
      setCurrentUser(readJson(STORAGE_KEYS.currentUser, null));
    };

    window.addEventListener("skill-collab:user-updated", syncCurrentUser);
    return () => {
      window.removeEventListener("skill-collab:user-updated", syncCurrentUser);
    };
  }, []);

  const login = async (email, password) => {
    const user = getUsers().find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const safeUser = sanitizeUser(user);
    writeJson(STORAGE_KEYS.currentUser, safeUser);
    setCurrentUser(safeUser);
    return safeUser;
  };

  const signup = async (email, password, name) => {
    const users = getUsers();
    const existing = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const userId = `user-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newUser = {
      $id: userId,
      id: userId,
      userId,
      name,
      fullName: name,
      email,
      password,
      role: "Product Builder",
      status: "online",
      topSkills: [],
      skillsVerified: 0,
      endorsements: 0,
      githubScore: 0,
      profilePicture: "",
      bio: "",
      createdAt: timestamp,
      $createdAt: timestamp,
    };

    users.push(newUser);
    saveUsers(users);

    const settingsMap = readJson(STORAGE_KEYS.settings, {});
    settingsMap[userId] = createDefaultSettings(newUser);
    writeJson(STORAGE_KEYS.settings, settingsMap);

    const safeUser = sanitizeUser(newUser);
    writeJson(STORAGE_KEYS.currentUser, safeUser);
    setCurrentUser(safeUser);
    return safeUser;
  };

  const logout = async () => {
    window.localStorage.removeItem(STORAGE_KEYS.currentUser);
    setCurrentUser(null);
  };

  const authContextValue = {
    user: currentUser,
    currentUser,
    isLoading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
