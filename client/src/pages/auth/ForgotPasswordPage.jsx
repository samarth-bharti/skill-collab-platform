// src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../lib/api';
import Logo from '../../components/common/Logo';
import FormInput from '../../components/common/FormInput';
import ActionButton from '../../components/common/ActionButton';

const AuthPageWrapper = ({ children }) => (
  <div className="w-full lg:w-1/2 p-8 md:p-12">
    <div className="absolute top-4 left-4 md:top-8 md:left-8">
      <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center">
        <span className="mr-2">←</span> go back to login screen
      </Link>
    </div>
    <div className="mt-16">{children}</div>
  </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    
    try {
      await requestPasswordReset(email);
      setMessage('Recovery email sent! Please check your inbox.');
    } catch {
      setError('Failed to send recovery email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper>
      <Logo />
      <div className="mt-12">
        <h2 className="text-4xl font-semibold text-white">Forgot Password?</h2>
        <p className="text-white/80 mt-2">Reset your password and regain control!</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-lg">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-4">
          <ActionButton 
            text="Send Recovery Email" 
            type="submit" 
            disabled={isSubmitting || !email}
          />
        </div>
      </form>
    </AuthPageWrapper>
  );
}
