// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
// Import the Appwrite account service we created
import { account } from "../lib/appwrite";
import { ID } from "appwrite";

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Check for a logged-in user on app load
  useEffect(() => {
    // This function runs once when the app loads
    async function checkUserSession() {
      try {
        // 'account.get()' checks if there is an active session
        const userAccount = await account.get();
        setCurrentUser(userAccount);
      } catch (error) {
        // No user session found
        setCurrentUser(null);
      } finally {
        // We're done loading
        setIsLoading(false);
      }
    }

    checkUserSession();
  }, []);

  // 4. Implement the login function
  const login = async (email, password) => {
    try {
      // Create a session using Appwrite
      await account.createEmailPasswordSession(email, password);
      // Get the user data and update state
      const userAccount = await account.get();
      setCurrentUser(userAccount);
      return userAccount;
    } catch (error) {
      console.error("Appwrite login error:", error);
      throw error; // Re-throw the error so the login page can catch it
    }
  };

  // 5. Implement the signup function
  const signup = async (email, password, name) => {
    try {
      // Create a new user account
      // Note: Appwrite uses ID.unique() to generate a safe, unique ID
      await account.create(ID.unique(), email, password, name);
      
      // After creating the account, log the user in
      const userAccount = await login(email, password);
      return userAccount;
    } catch (error) {
      console.error("Appwrite signup error:", error);
      throw error;
    }
  };

  // 6. Implement the logout function
  const logout = async () => {
    try {
      // Delete the current session
      await account.deleteSession("current");
      setCurrentUser(null);
    } catch (error) {
      console.error("Appwrite logout error:", error);
      throw error;
    }
  };

  // 7. Provide the context values to children
  const authContextValue = {
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

// 8. Create the custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}