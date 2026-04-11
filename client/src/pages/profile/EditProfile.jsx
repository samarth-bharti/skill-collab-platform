import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileForm from '../../components/profile/ProfileForm';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { createUserProfile, getUserProfile } from '../../lib/api';

export default function EditProfile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const loadProfile = async () => {
            try {
                const currentProfile = await getUserProfile(currentUser.$id);
                setProfile({
                    name: currentProfile.name || '',
                    role: currentProfile.role || 'Product Builder',
                    bio: currentProfile.bio || '',
                    skills: currentProfile.topSkills || [],
                    github: currentProfile.github || '',
                    linkedin: currentProfile.linkedin || '',
                    twitter: currentProfile.twitter || '',
                });
            } catch {
                setProfile({
                    name: currentUser?.name || '',
                    role: 'Product Builder',
                    bio: '',
                    skills: [],
                    github: '',
                    linkedin: '',
                    twitter: '',
                });
            }
        };
        loadProfile();
    }, [currentUser]);

    const handleSaveProfile = async (nextProfile) => {
        if (!currentUser) return;
        setSaving(true);
        try {
            await createUserProfile(currentUser.$id, nextProfile);
            navigate('/dashboard/settings');
        } finally {
            setSaving(false);
        }
    };

    if (!profile) {
        return <div className="p-8 text-center text-gray-400">Loading profile...</div>;
    }

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
                <ProfileForm profile={profile} onSave={handleSaveProfile} saving={saving} />
            </motion.div>
        </DashboardLayout>
    );
}
