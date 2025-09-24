// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const loggedInUser = await account.get();
    setUser(loggedInUser);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const signup = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  };

  const checkUserStatus = async () => {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
