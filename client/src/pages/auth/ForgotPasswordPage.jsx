// src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import FormInput from '../../components/common/FormInput';
import ActionButton from '../../components/common/ActionButton';
import { requestPasswordReset } from '../../lib/api';

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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email address is invalid.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await requestPasswordReset(email);
            setIsEmailSent(true);
        } catch (err) {
            setError('Failed to send reset email. Please check the address and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEmailSent) {
        return (
            <AuthPageWrapper>
                <Logo />
                <div className="mt-12 text-center">
                    <h2 className="text-4xl font-semibold text-white">Check Your Inbox</h2>
                    <p className="text-white/80 mt-4 max-w-lg mx-auto">
                        A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email.
                    </p>
                    <Link to="/login" className="text-[#36B083] font-bold mt-8 inline-block">
                        &larr; Back to Login
                    </Link>
                </div>
            </AuthPageWrapper>
        );
    }

    return (
        <AuthPageWrapper>
            <Logo />
            <div className="mt-12">
                <h2 className="text-4xl font-semibold text-white">Forgot Password?</h2>
                <p className="text-white/80 mt-2">No problem! Enter your email to receive a reset link.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-lg">
                <FormInput label="Email Address" type="email" name="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
                <div className="pt-4">
                    <ActionButton text="Send Reset Link" type="submit" disabled={isSubmitting} />
                </div>
            </form>
        </AuthPageWrapper>
    );
}