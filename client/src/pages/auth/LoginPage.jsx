import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setErrors({});
        
        console.log('🚀 Starting login process...');
        console.log('📝 Login email:', formData.email);
        
        try {
            const result = await login(formData.email, formData.password);
            
            console.log('📋 Login result:', result);
            
            if (result.success) {
                console.log('✅ Login successful!');
                navigate('/dashboard');
            } else {
                console.error('❌ Login failed:', result.error);
                setErrors({ submit: result.error });
            }
        } catch (error) {
            console.error('💥 Login error:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full mx-4"
            >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Unlock your Progress - Securely Access Your Project Hub</p>
                </div>

                {/* Form */}
                <motion.div
                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                    </form>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-green-400 hover:text-green-300 text-sm">
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Signup Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                            Create Account
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
