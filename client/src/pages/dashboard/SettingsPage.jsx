import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
    Float, Environment, Stars, Box, MeshDistortMaterial
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getUserSettings, updateUserSettings } from '../../lib/api';

// FIXED LUCIDE IMPORTS
import { 
    User, Shield, Bell, Palette, Award, Zap, ChevronRight, Mail, Github, Linkedin, Link, Search, Save, RefreshCw
} from 'lucide-react';

// Settings Categories
const settingsCategories = [
    {
        id: 'profile',
        title: 'Profile & Account',
        icon: User,
        color: 'from-blue-500 to-cyan-500',
        description: 'Manage your profile, personal information, and account settings'
    },
    {
        id: 'skills',
        title: 'Skills & Verification',
        icon: Award,
        color: 'from-green-500 to-emerald-500',
        description: 'Configure skill verification methods and manage endorsements'
    },
    {
        id: 'privacy',
        title: 'Privacy & Security',
        icon: Shield,
        color: 'from-purple-500 to-violet-500',
        description: 'Control your privacy settings and security preferences'
    },
    {
        id: 'notifications',
        title: 'Notifications',
        icon: Bell,
        color: 'from-orange-500 to-red-500',
        description: 'Customize notification preferences and communication settings'
    },
    {
        id: 'integrations',
        title: 'Integrations',
        icon: Zap,
        color: 'from-yellow-500 to-amber-500',
        description: 'Connect external accounts and manage third-party integrations'
    },
    {
        id: 'appearance',
        title: 'Appearance',
        icon: Palette,
        color: 'from-indigo-500 to-blue-500',
        description: 'Customize theme, layout, and visual preferences'
    }
];

// 3D Background Component
function SettingsBackground() {
    const meshRef = useRef();
    
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.003;
        }
    });
    
    return (
        <group>
            <Float speed={0.5} rotationIntensity={0.2}>
                <Box ref={meshRef} position={[-25, 0, -30]} args={[3, 3, 3]}>
                    <MeshDistortMaterial
                        color="#10b981"
                        transparent
                        opacity={0.08}
                        wireframe
                    />
                </Box>
            </Float>
            <Stars radius={60} depth={30} count={3000} />
        </group>
    );
}

// Category Card Component
const CategoryCard = ({ category, isActive, onClick, delay = 0 }) => {
    const Icon = category.icon;
    
    return (
        <motion.div
            className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                isActive 
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-green-500' 
                    : 'bg-gradient-to-br from-black to-gray-900 border-gray-800 hover:border-gray-700'
            }`}
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${isActive ? 'text-green-400' : 'text-white'}`}>
                            {category.title}
                        </h3>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-all ${
                            isActive ? 'rotate-90 text-green-500' : ''
                        }`} />
                    </div>
                </div>
                <p className="text-gray-400 text-sm">{category.description}</p>
            </div>
        </motion.div>
    );
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <label className="text-white font-medium cursor-pointer">{label}</label>
                {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
            </div>
            <motion.button
                className={`relative w-14 h-7 rounded-full transition-all duration-200 ${
                    enabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
                onClick={() => onChange(!enabled)}
                whileHover={{ scale: 1.05 }}
            >
                <motion.div
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{ x: enabled ? 32 : 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
            </motion.button>
        </div>
    );
};

// Settings Section Component
const SettingsSection = ({ title, children, icon: Icon }) => {
    return (
        <motion.div
            className="bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-gray-800 p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-3 mb-4">
                {Icon && (
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                        <Icon className="w-5 h-5 text-green-500" />
                    </div>
                )}
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="space-y-4">{children}</div>
        </motion.div>
    );
};

// Profile Settings Component
const ProfileSettings = ({ settings, onSettingsChange }) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <SettingsSection title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">First Name</label>
                        <input
                            type="text"
                            value={settings.profile.personalInfo.firstName}
                            onChange={(e) => onSettingsChange('profile.personalInfo.firstName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                        <input
                            type="text"
                            value={settings.profile.personalInfo.lastName}
                            onChange={(e) => onSettingsChange('profile.personalInfo.lastName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                        type="email"
                        value={settings.profile.personalInfo.email}
                        onChange={(e) => onSettingsChange('profile.personalInfo.email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Bio</label>
                    <textarea
                        rows={4}
                        value={settings.profile.personalInfo.bio}
                        onChange={(e) => onSettingsChange('profile.personalInfo.bio', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                </div>
                <button 
                    onClick={() => navigate('/profile/edit')}
                    className="mt-4 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-medium transition-all"
                >
                    Edit Profile
                </button>
            </SettingsSection>
        </div>
    );
};

// Skills Settings Component  
const SkillsSettings = ({ settings, onSettingsChange }) => {
    return (
        <div className="space-y-6">
            <SettingsSection title="Skill Verification" icon={Award}>
                <ToggleSwitch
                    enabled={settings.skills.verification.autoGithubAnalysis}
                    onChange={(value) => onSettingsChange('skills.verification.autoGithubAnalysis', value)}
                    label="Automatic GitHub Analysis"
                    description="Automatically analyze your GitHub repositories to detect skills"
                />
                
                <ToggleSwitch
                    enabled={settings.skills.verification.allowPeerEndorsements}
                    onChange={(value) => onSettingsChange('skills.verification.allowPeerEndorsements', value)}
                    label="Allow Peer Endorsements"
                    description="Let other verified users endorse your skills"
                />
                
                <ToggleSwitch
                    enabled={settings.skills.verification.skillDecayEnabled}
                    onChange={(value) => onSettingsChange('skills.verification.skillDecayEnabled', value)}
                    label="Enable Skill Decay"
                    description="Skill confidence scores decrease over time if not refreshed"
                />
            </SettingsSection>
        </div>
    );
};

// Privacy Settings Component
const PrivacySettings = ({ settings, onSettingsChange }) => {
    return (
        <div className="space-y-6">
            <SettingsSection title="Account Security" icon={Shield}>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                        <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                    </div>
                    <button
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            settings.privacy.account.twoFactorEnabled
                                ? 'bg-green-500 text-black'
                                : 'bg-blue-500 text-white hover:bg-blue-400'
                        }`}
                    >
                        {settings.privacy.account.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
                    </button>
                </div>
                
                <ToggleSwitch
                    enabled={settings.privacy.account.loginAlerts}
                    onChange={(value) => onSettingsChange('privacy.account.loginAlerts', value)}
                    label="Login Alerts"
                    description="Get notified when someone logs into your account"
                />
            </SettingsSection>
        </div>
    );
};

// Notifications Settings Component
const NotificationsSettings = ({ settings, onSettingsChange }) => {
    return (
        <div className="space-y-6">
            <SettingsSection title="Push Notifications" icon={Bell}>
                <ToggleSwitch
                    enabled={settings.notifications.push.enabled}
                    onChange={(value) => onSettingsChange('notifications.push.enabled', value)}
                    label="Enable Push Notifications"
                    description="Receive notifications even when the app is closed"
                />
                
                <ToggleSwitch
                    enabled={settings.notifications.push.messages}
                    onChange={(value) => onSettingsChange('notifications.push.messages', value)}
                    label="Messages"
                    description="New direct messages and team chat messages"
                />
                
                <ToggleSwitch
                    enabled={settings.notifications.push.projectUpdates}
                    onChange={(value) => onSettingsChange('notifications.push.projectUpdates', value)}
                    label="Project Updates"
                    description="Task assignments and project milestones"
                />
            </SettingsSection>
            
            <SettingsSection title="Email Notifications" icon={Mail}>
                <ToggleSwitch
                    enabled={settings.notifications.email.enabled}
                    onChange={(value) => onSettingsChange('notifications.email.enabled', value)}
                    label="Enable Email Notifications"
                    description="Receive notifications via email"
                />
            </SettingsSection>
        </div>
    );
};

// Integration Card Component
const IntegrationCard = ({ integration, onToggle }) => {
    const getServiceIcon = (service) => {
        switch (service) {
            case 'GitHub': return Github;
            case 'LinkedIn': return Linkedin;
            default: return Link;
        }
    };
    
    const Icon = getServiceIcon(integration.service);
    
    return (
        <div className={`p-4 rounded-xl border transition-all ${
            integration.connected 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-800/50 border-gray-700'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                        integration.connected ? 'bg-green-500/20' : 'bg-gray-600/20'
                    }`}>
                        <Icon className={`w-5 h-5 ${
                            integration.connected ? 'text-green-500' : 'text-gray-400'
                        }`} />
                    </div>
                    <div>
                        <h4 className="font-medium text-white">{integration.service}</h4>
                        <p className="text-sm text-gray-400">
                            {integration.connected 
                                ? `@${integration.username}` 
                                : 'Not connected'
                            }
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => onToggle(integration.service)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        integration.connected
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500 text-black hover:bg-green-400'
                    }`}
                >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        </div>
    );
};

// Integrations Settings Component
const IntegrationsSettings = ({ settings, onSettingsChange }) => {
    const handleIntegrationToggle = (service) => {
        const newIntegrations = settings.integrations.connected.map(int => 
            int.service === service ? { ...int, connected: !int.connected } : int
        );
        onSettingsChange('integrations.connected', newIntegrations);
    };
    
    return (
        <div className="space-y-6">
            <SettingsSection title="Connected Accounts" icon={Link}>
                <div className="space-y-4">
                    {settings.integrations.connected.map((integration) => (
                        <IntegrationCard
                            key={integration.service}
                            integration={integration}
                            onToggle={handleIntegrationToggle}
                        />
                    ))}
                </div>
            </SettingsSection>
        </div>
    );
};

// Appearance Settings Component
const AppearanceSettings = ({ settings, onSettingsChange }) => {
    const themes = [
        { value: 'dark', label: 'Dark', preview: 'bg-gray-900' },
        { value: 'light', label: 'Light', preview: 'bg-white' },
        { value: 'auto', label: 'System', preview: 'bg-gradient-to-r from-gray-900 to-white' }
    ];
    
    const accentColors = [
        { value: 'green', label: 'Green', color: 'bg-green-500' },
        { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
        { value: 'purple', label: 'Purple', color: 'bg-purple-500' }
    ];
    
    return (
        <div className="space-y-6">
            <SettingsSection title="Theme" icon={Palette}>
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Color Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map(theme => (
                            <button
                                key={theme.value}
                                onClick={() => onSettingsChange('appearance.theme', theme.value)}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    settings.appearance.theme === theme.value
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                }`}
                            >
                                <div className={`w-full h-12 rounded-lg mb-2 ${theme.preview}`} />
                                <span className="text-sm text-white">{theme.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Accent Color</label>
                    <div className="flex gap-3">
                        {accentColors.map(color => (
                            <button
                                key={color.value}
                                onClick={() => onSettingsChange('appearance.accentColor', color.value)}
                                className={`w-12 h-12 rounded-full border-2 ${color.color} ${
                                    settings.appearance.accentColor === color.value
                                        ? 'border-white scale-110'
                                        : 'border-gray-600'
                                }`}
                                title={color.label}
                            />
                        ))}
                    </div>
                </div>
                
                <ToggleSwitch
                    enabled={settings.appearance.animations}
                    onChange={(value) => onSettingsChange('appearance.animations', value)}
                    label="Animations"
                    description="Enable smooth animations and transitions"
                />
            </SettingsSection>
        </div>
    );
};

const SettingsSkeleton = () => (
    <div className="flex gap-8 animate-pulse">
        <div className="w-80 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-2xl"></div>
            ))}
        </div>
        <div className="flex-1">
            <div className="bg-gray-800/50 rounded-2xl p-6">
                <div className="h-8 w-1/3 bg-gray-700 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-700 rounded-xl"></div>
                    <div className="h-10 bg-gray-700 rounded-xl"></div>
                    <div className="h-24 bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        </div>
    </div>
);

// Main Settings Page Component
export default function SettingsPage() {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('profile');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const loadSettings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const userSettings = await getUserSettings(user.$id);
            setSettings(userSettings);
        } catch (e) {
            console.error('Failed to load settings:', e);
            setError('Could not load your settings. Please try again.');
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);
    
    const handleSettingsChange = useCallback((path, value) => {
        const keys = path.split('.');
        setSettings(prevSettings => {
            const newSettings = JSON.parse(JSON.stringify(prevSettings));
            let current = newSettings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
        setHasUnsavedChanges(true);
    }, []);
    
    const handleSaveSettings = async () => {
        if (!user) return;
        try {
            await updateUserSettings(user.$id, settings);
            setHasUnsavedChanges(false);
        } catch (e) {
            console.error('Failed to save settings:', e);
            setError('Could not save your settings. Please try again.');
        }
    };
    
    const renderSettingsContent = () => {
        if (loading) return <SettingsSkeleton />;
        if (error) return <div className="text-center py-20 text-yellow-300"><p className="text-lg mb-4">{error}</p><button onClick={loadSettings} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center mx-auto"><RefreshCw className="w-4 h-4 mr-2" />Try Again</button></div>;
        if (!settings) return null;

        switch (activeCategory) {
            case 'profile':
                return <ProfileSettings settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'skills':
                return <SkillsSettings settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'privacy':
                return <PrivacySettings settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'notifications':
                return <NotificationsSettings settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'integrations':
                return <IntegrationsSettings settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'appearance':
                return <AppearanceSettings settings={settings} onSettingsChange={handleSettingsChange} />;
            default:
                return <div className="text-white">Settings content</div>;
        }
    };
    
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* 3D Background */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                    <Suspense fallback={null}>
                        <SettingsBackground />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="bg-black/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <motion.h1
                                    className="text-5xl font-bold bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent mb-2"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    Platform Settings
                                </motion.h1>
                                <motion.p
                                    className="text-gray-400 text-lg"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    Customize your collaboration experience
                                </motion.p>
                            </div>
                            
                            <motion.div
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search settings..."
                                        className="pl-10 pr-4 py-3 w-80 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                
                                <AnimatePresence>
                                    {hasUnsavedChanges && (
                                        <motion.button
                                            onClick={handleSaveSettings}
                                            className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-medium transition-all"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <Save className="w-4 h-4 inline mr-2" />
                                            Save Changes
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
                
                <div className="flex gap-8">
                    {/* Settings Categories */}
                    <div className="w-80 space-y-4">
                        {settingsCategories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                isActive={activeCategory === category.id}
                                onClick={() => setActiveCategory(category.id)}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                    
                    {/* Settings Content */}
                    <div className="flex-1">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
                        >
                            {renderSettingsContent()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
