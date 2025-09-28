import { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../lib/appwrite';
import { getUserProfile, createUserProfile } from '../lib/api';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const loggedInUser = await account.get();
            setUser(loggedInUser);
            
            // Try to fetch user profile
            await fetchUserProfile(loggedInUser.$id);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, password, fullName) => {
        try {
            const newUser = await account.create(ID.unique(), email, password, fullName);
            console.log('User created:', newUser);
            
            // Login the user
            await login(email, password);
            
            // Create user profile in database
            try {
                await createUserProfile(newUser.$id, {
                    fullName,
                    email,
                    profilePicture: ''
                });
                console.log('User profile created successfully');
            } catch (profileError) {
                console.error('Error creating user profile:', profileError);
                // Don't fail signup if profile creation fails
            }
            
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setUserProfile(null);
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even if logout fails
            setUser(null);
            setUserProfile(null);
        }
    };

    const checkUserStatus = async () => {
        try {
            console.log('Checking user authentication status...');
            const loggedInUser = await account.get();
            console.log('User is authenticated:', loggedInUser);
            setUser(loggedInUser);
            
            // Try to fetch user profile
            await fetchUserProfile(loggedInUser.$id);
        } catch (error) {
            console.log('No authenticated user found:', error.message);
            setUser(null);
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            console.log('Fetching user profile for:', userId);
            const profile = await getUserProfile(userId);
            setUserProfile(profile);
            console.log('User profile loaded:', profile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Don't set userProfile to null here, just log the error
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const updatedProfile = await updateUserProfile(user.$id, profileData);
            setUserProfile(updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        isLoggedIn: !!user,
        login,
        logout,
        signup,
        updateProfile,
        fetchUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
