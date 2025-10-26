// src/pages/profile/EditProfile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileForm from '../../components/profile/ProfileForm';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';

export default function EditProfile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // This would be fetched from your backend
    const currentProfile = {
        name: currentUser?.name || '',
        role: 'Full-Stack Developer', // This should come from the user's profile
        bio: 'Passionate about building beautiful and functional web applications.',
        skills: ['React', 'Node.js', 'Appwrite'],
        github: 'https://github.com/your-username',
        linkedin: 'https://linkedin.com/in/your-username',
        twitter: 'https://twitter.com/your-username',
    };

    const handleSaveProfile = (profile) => {
        console.log('Updating profile:', profile);
        // Here you would typically save the updated profile to your backend
        navigate('/dashboard/settings');
    };

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl mx-auto"
            >
                <h2 className="text-4xl font-bold text-white mb-4">Edit Your Profile</h2>
                <p className="text-gray-400 mb-8">Keep your profile up-to-date to attract collaborators.</p>
                <ProfileForm profile={currentProfile} onSave={handleSaveProfile} />
            </motion.div>
        </DashboardLayout>
    );
}
