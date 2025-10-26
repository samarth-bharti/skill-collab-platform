// src/pages/auth/SignUpPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Make sure this import path points to your AuthContext file
import { useAuth } from '../../contexts/AuthContext'; 

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            // Appwrite's default minimum is 8 characters
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- THIS IS THE CORRECTED PART ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            // The signup function will throw an error if it fails
            await signup(formData.email, formData.password, formData.fullName);
            
            // If we get to this line, the signup was successful
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard'); // Redirect after 2 seconds
            }, 2000);

        } catch (error) {
            // The error from AuthContext will be caught here
            setErrors({ submit: error.message || "An unknown error occurred." });
        } finally {
            setLoading(false);
        }
    };
    // --- END OF CORRECTION ---


    // The rest of your component's JSX remains exactly the same.
    // It's already set up correctly to handle the success and error states.
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full mx-4 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-green-500/20"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                        <p className="text-gray-400 mb-4">Welcome to Skill Collab Platform</p>
                        <p className="text-sm text-green-400">Redirecting to dashboard...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full mx-4"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Empower your projects, Simplify your Success!</p>
                </div>

                <motion.div
                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    errors.fullName 
                                        ? 'border-red-500 focus:ring-red-500/50' 
                                        : 'border-green-500/20 focus:ring-green-500/50'
                                }`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    errors.email 
                                        ? 'border-red-500 focus:ring-red-500/50' 
                                        : 'border-green-500/20 focus:ring-green-500/50'
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    errors.password 
                                        ? 'border-red-500 focus:ring-red-500/50' 
                                        : 'border-green-500/20 focus:ring-green-500/50'
                                }`}
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    errors.confirmPassword 
                                        ? 'border-red-500 focus:ring-red-500/50' 
                                        : 'border-green-500/20 focus:ring-green-500/50'
                                }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                                <p className="text-red-400 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}