// src/components/profile/ProfileForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Code, Link as LinkIcon, Save } from 'lucide-react';
import FormInput from '../common/FormInput';
import ActionButton from '../common/ActionButton';

export default function ProfileForm({ profile: initialProfile, onSave }) {
    const [profile, setProfile] = useState(initialProfile || {
        name: '',
        role: '',
        bio: '',
        skills: [],
        github: '',
        linkedin: '',
        twitter: '',
    });

    const [newSkill, setNewSkill] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(profile);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <FormInput
                icon={User}
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="e.g., Alex Johnson"
            />
            <FormInput
                icon={Briefcase}
                label="Role / Title"
                name="role"
                value={profile.role}
                onChange={handleChange}
                placeholder="e.g., Full-Stack Developer"
            />
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio / About</label>
                <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-gray-900/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all p-4"
                    placeholder="Tell us about yourself..."
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Skills</label>
                <div className="flex items-center gap-2 mb-2">
                    <FormInput
                        icon={Code}
                        label="Add Skill"
                        name="newSkill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g., React, Node.js"
                    />
                    <ActionButton onClick={handleAddSkill} text="Add" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                        <motion.div
                            key={skill}
                            className="flex items-center gap-2 bg-green-900/30 text-green-400 border border-green-700 rounded-full px-3 py-1 text-sm cursor-pointer"
                            onClick={() => handleRemoveSkill(skill)}
                            whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                        >
                            {skill}
                        </motion.div>
                    ))}
                </div>
            </div>
            <h3 className="text-lg font-bold text-white">Social Links</h3>
            <FormInput
                icon={LinkIcon}
                label="GitHub"
                name="github"
                value={profile.github}
                onChange={handleChange}
                placeholder="https://github.com/your-username"
            />
            <FormInput
                icon={LinkIcon}
                label="LinkedIn"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-username"
            />
            <FormInput
                icon={LinkIcon}
                label="Twitter"
                name="twitter"
                value={profile.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/your-username"
            />
            <div className="flex justify-end">
                <ActionButton
                    type="submit"
                    icon={Save}
                    text="Save Profile"
                    className="bg-gradient-to-r from-green-500 to-emerald-400 text-black"
                />
            </div>
        </motion.form>
    );
}
