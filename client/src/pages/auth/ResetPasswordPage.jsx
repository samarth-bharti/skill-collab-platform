// src/pages/auth/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import FormInput from '../../components/common/FormInput';
import ActionButton from '../../components/common/ActionButton';
import { confirmPasswordReset } from '../../lib/api';

const AuthPageWrapper = ({ children }) => (
    <div className="w-full lg:w-1/2 p-8 md:p-12">
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="mr-2">&larr;</span> Back to Landing Page
            </Link>
        </div>
        <div className="mt-16">{children}</div>
    </div>
);

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [userId, setUserId] = useState(null);
    const [secret, setSecret] = useState(null);

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        const secretParam = searchParams.get('secret');

        if (userIdParam && secretParam) {
            setUserId(userIdParam);
            setSecret(secretParam);
        } else {
            setErrors({ general: "Invalid or expired reset link. Please try again." });
        }
    }, [searchParams]);

    const validate = () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        return newErrors;
    };
    
    const handleChange = (e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value}));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            setErrors({});
            try {
                await confirmPasswordReset(userId, secret, formData.password);
                setIsSuccess(true);
            } catch (error) {
                setErrors({ general: "Failed to reset password. The link may have expired." });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isSuccess) {
        return (
            <AuthPageWrapper>
                <Logo />
                <div className="mt-12 text-center">
                    <h2 className="text-4xl font-semibold text-white">Password Updated!</h2>
                    <p className="text-white/80 mt-4">You can now log in with your new password.</p>
                    <ActionButton text="Proceed to Login" onClick={() => navigate('/login')} containerClassName="mt-8"/>
                </div>
            </AuthPageWrapper>
        );
    }

    return (
        <AuthPageWrapper>
            <Logo />
            <div className="mt-12">
                <h2 className="text-4xl font-semibold text-white">Create New Password</h2>
                <p className="text-white/80 mt-2">Choose a new, secure password.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-lg">
                <FormInput label="New Password" name="password" type="password" placeholder="Enter new password" value={formData.password} onChange={handleChange} error={errors.password} />
                <FormInput label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter new password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                
                {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

                <div className="pt-4">
                    <ActionButton text="Reset Password" type="submit" disabled={isSubmitting || !userId || !secret} />
                </div>
            </form>
        </AuthPageWrapper>
    );
}