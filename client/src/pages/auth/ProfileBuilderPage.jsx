import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../../layouts/AuthLayout';
import ProfileForm from '../../components/profile/ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import { createUserProfile } from '../../lib/api';

export default function ProfileBuilderPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async (profile) => {
        if (!currentUser) return;
        setSaving(true);
        try {
            await createUserProfile(currentUser.$id, profile);
            navigate('/dashboard');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <h2 className="text-4xl font-bold text-white mb-4">Build Your Profile</h2>
                <p className="text-gray-400 mb-8">Tell us more about yourself to get started.</p>
                <ProfileForm onSave={handleSaveProfile} saving={saving} />
            </motion.div>
        </AuthLayout>
    );
}
