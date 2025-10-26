// DashboardHomePage.jsx - SKILL COLLABORATION PLATFORM WITH ENTERPRISE VISUALS
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT ROUTING HOOK
import { useAuth } from '../../contexts/AuthContext'; // <-- IMPORT useAuth
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Box, Sphere, Float, Environment,
    Plane, MeshDistortMaterial, Points,
    PointMaterial, Stars, Cloud
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Skill-Based Platform Icons
import {
    Plus, Search, Bell, LogOut, Settings, User,
    Activity, Zap, Target, Clock, Users, ArrowUp, ArrowDown, Play, Eye, Award, GitBranch, Code, BookOpen, UserCheck, Briefcase, Star, DollarSign
} from 'lucide-react';

// Skill-Based Collaboration Platform Mock Data
const mockProjects = [
    {
        id: 1,
        name: "AI-Powered Web App",
        progress: 78,
        status: "Active",
        members: 4,
        budget: 25000,
        deadline: "2025-12-15",
        requiredSkills: ["React", "Python", "Machine Learning", "UI/UX"],
        skillsVerified: 85,
        type: "Full-Stack Development",
        priority: "high",
        health: "excellent",
        tasks: 24
    },
    {
        id: 2,
        name: "Mobile E-commerce Platform",
        progress: 45,
        status: "Recruiting",
        members: 2,
        budget: 18000,
        deadline: "2025-11-30",
        requiredSkills: ["React Native", "Node.js", "MongoDB", "Payment APIs"],
        skillsVerified: 60,
        type: "Mobile Development",
        priority: "medium",
        health: "good",
        tasks: 18
    },
    {
        id: 3,
        name: "Blockchain Voting System",
        progress: 92,
        status: "Active",
        members: 6,
        budget: 42000,
        deadline: "2025-10-20",
        requiredSkills: ["Solidity", "Web3", "Smart Contracts", "Security"],
        skillsVerified: 95,
        type: "Blockchain",
        priority: "critical",
        health: "excellent",
        tasks: 32
    }
];

const mockTasks = [
    {
        id: 1,
        text: "Design user authentication system",
        completed: false,
        priority: "high",
        project: "AI-Powered Web App",
        skillRequired: "UI/UX Design",
        verificationLevel: "Expert",
        assignee: "Sarah Chen",
        endorsements: 12,
        hours: 40,
        category: "design"
    },
    {
        id: 2,
        text: "Implement machine learning model",
        completed: true,
        priority: "critical",
        project: "AI-Powered Web App",
        skillRequired: "Machine Learning",
        verificationLevel: "Advanced",
        assignee: "David Kumar",
        endorsements: 28,
        hours: 60,
        category: "development"
    },
    {
        id: 3,
        text: "Set up smart contract deployment",
        completed: false,
        priority: "medium",
        project: "Blockchain Voting System",
        skillRequired: "Solidity",
        verificationLevel: "Intermediate",
        assignee: "Alex Morgan",
        endorsements: 8,
        hours: 24,
        category: "blockchain"
    },
    {
        id: 4,
        text: "Security audit and penetration testing",
        completed: false,
        priority: "critical",
        project: "Blockchain Voting System",
        skillRequired: "Cybersecurity",
        verificationLevel: "Expert",
        assignee: "Lisa Rodriguez",
        endorsements: 34,
        hours: 32,
        category: "security"
    }
];

const mockTeamMembers = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Full-Stack Developer",
        status: "online",
        avatar: "SC",
        projects: 3,
        tasks: 8,
        skillsVerified: 12,
        githubScore: 98,
        endorsements: 45,
        topSkills: ["React", "Node.js", "Python"]
    },
    {
        id: 2,
        name: "David Kumar",
        role: "ML Engineer",
        status: "online",
        avatar: "DK",
        projects: 2,
        tasks: 5,
        skillsVerified: 8,
        githubScore: 95,
        endorsements: 28,
        topSkills: ["Python", "TensorFlow", "Data Science"]
    },
    {
        id: 3,
        name: "Alex Morgan",
        role: "Blockchain Developer",
        status: "away",
        avatar: "AM",
        projects: 1,
        tasks: 4,
        skillsVerified: 6,
        githubScore: 87,
        endorsements: 15,
        topSkills: ["Solidity", "Web3", "Smart Contracts"]
    },
    {
        id: 4,
        name: "Lisa Rodriguez",
        role: "Security Specialist",
        status: "online",
        avatar: "LR",
        projects: 2,
        tasks: 6,
        skillsVerified: 10,
        githubScore: 92,
        endorsements: 34,
        topSkills: ["Cybersecurity", "Penetration Testing", "Audit"]
    }
];

const mockSkillVerifications = [
    { skill: "React", level: "Expert", verified: true, method: "GitHub Analysis", score: 95 },
    { skill: "Python", level: "Advanced", verified: true, method: "Coding Challenge", score: 88 },
    { skill: "Machine Learning", level: "Intermediate", verified: true, method: "Peer Endorsement", score: 82 },
    { skill: "UI/UX Design", level: "Advanced", verified: false, method: "Portfolio Review", score: 0 },
    { skill: "Blockchain", level: "Beginner", verified: true, method: "Quiz Assessment", score: 75 }
];

const mockTimeline = [
    { id: 1, user: "Sarah Chen", action: "endorsed skill", target: "React Development", time: "15 min ago", type: "endorsement", avatar: "SC" },
    { id: 2, user: "David Kumar", action: "completed verification for", target: "Machine Learning Advanced", time: "1 hour ago", type: "verification", avatar: "DK" },
    { id: 3, user: "Lisa Rodriguez", action: "joined collaboration on", target: "Blockchain Voting System", time: "2 hours ago", type: "collaboration", avatar: "LR" },
    { id: 4, user: "Alex Morgan", action: "submitted portfolio for", target: "Solidity Expert Review", time: "4 hours ago", type: "portfolio", avatar: "AM" }
];

const mockNotifications = [
    {
        id: 1,
        text: 'New skill endorsement received for React development',
        time: '5 min ago',
        unread: true,
        type: 'endorsement'
    },
    {
        id: 2,
        text: 'Project "AI Web App" milestone completed',
        time: '1 hour ago',
        unread: true,
        type: 'project'
    },
    {
        id: 3,
        text: 'New collaboration request from Blockchain team',
        time: '2 hours ago',
        unread: false,
        type: 'collaboration'
    },
    {
        id: 4,
        text: 'Skill verification completed: Python Advanced',
        time: '3 hours ago',
        unread: false,
        type: 'verification'
    }
];

// Platform Metrics - Skill-focused
const mockMetrics = {
    skillsVerified: { current: 24, target: 30, growth: 12.5, trend: [18, 20, 22, 23, 24] },
    projectsActive: { current: 8, target: 10, growth: 25.0, trend: [6, 6, 7, 7, 8] },
    endorsements: { current: 156, target: 200, growth: 18.3, trend: [120, 130, 145, 150, 156] },
    collaborators: { current: 47, target: 60, growth: 15.2, trend: [35, 38, 42, 45, 47] }
};

// Advanced 3D Background with Skill-themed Elements
function Advanced3DBackground() {
    const meshRef = useRef();
    const particlesRef = useRef();
    const waveRef = useRef();
    
    // Create floating particles with skill theme
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        // Green skill-themed colors
        colors[i * 3] = 0.1 + Math.random() * 0.2;     // Red
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // Green
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.3; // Blue
    }
    
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        
        // Animate skill nodes
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
            meshRef.current.rotation.y += 0.005;
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.5;
        }
        
        // Animate collaboration network
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.0008;
            particlesRef.current.rotation.x += 0.0003;
        }
        
        // Animate skill waves
        if (waveRef.current) {
            waveRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
            waveRef.current.position.y = Math.sin(time * 0.8) * 2;
        }
    });
    
    return (
        <group>
            {/* Skill Network Nodes */}
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <Box ref={meshRef} position={[-20, 0, -20]} args={[4, 4, 4]}>
                    <MeshDistortMaterial
                        color="#10b981"
                        transparent
                        opacity={0.1}
                        distort={0.3}
                        speed={2}
                        wireframe
                    />
                </Box>
            </Float>
            
            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.8}>
                <Sphere position={[20, 5, -15]} args={[3]}>
                    <MeshDistortMaterial
                        color="#22c55e"
                        transparent
                        opacity={0.08}
                        distort={0.4}
                        speed={1.5}
                        wireframe
                    />
                </Sphere>
            </Float>
            
            {/* Collaboration Network Particles */}
            <Points ref={particlesRef} positions={positions} colors={colors}>
                <PointMaterial
                    size={0.03}
                    sizeAttenuation
                    transparent
                    opacity={0.4}
                    vertexColors
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            
            {/* Skill Waves */}
            <Plane ref={waveRef} position={[0, -30, -40]} args={[100, 100, 32, 32]}>
                <MeshDistortMaterial
                    color="#059669"
                    transparent
                    opacity={0.05}
                    distort={0.5}
                    speed={1}
                    wireframe
                />
            </Plane>
            
            {/* Collaboration Starfield */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
            
            {/* Skill Clouds */}
            <Cloud position={[-30, 15, -25]} speed={0.4} opacity={0.03} width={10} depth={1.5} />
            <Cloud position={[25, 20, -30]} speed={0.3} opacity={0.04} width={15} depth={2} />
        </group>
    );
}

// Enhanced Skill Metric Card Component - Now accepts an onClick prop for navigation
const SkillMetricCard = ({ title, value, target, growth, trend, icon: Icon, color = "green-500", delay = 0, onClick }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    // --- FIX FOR TAILWIND ---
    // Tailwind needs full class names to be present, it cannot see string interpolation.
    const colorClasses = {
        "green-500": {
            border: "border-green-500",
            via: "via-green-500",
            from: "from-green-500/20",
            to: "to-green-500/10",
            border30: "border-green-500/30",
            text: "text-green-500",
            bgGradient: "from-green-500",
            bg: "bg-green-500",
            hoverBorder: "hover:borderColor-green-500"
        },
        "blue-500": {
            border: "border-blue-500",
            via: "via-blue-500",
            from: "from-blue-500/20",
            to: "to-blue-500/10",
            border30: "border-blue-500/30",
            text: "text-blue-500",
            bgGradient: "from-blue-500",
            bg: "bg-blue-500",
            hoverBorder: "hover:border-blue-500"
        },
        "yellow-500": {
            border: "border-yellow-500",
            via: "via-yellow-500",
            from: "from-yellow-500/20",
            to: "to-yellow-500/10",
            border30: "border-yellow-500/30",
            text: "text-yellow-500",
            bgGradient: "from-yellow-500",
            bg: "bg-yellow-500",
            hoverBorder: "hover:border-yellow-500"
        },
        "purple-500": {
            border: "border-purple-500",
            via: "via-purple-500",
            from: "from-purple-500/20",
            to: "to-purple-500/10",
            border30: "border-purple-500/30",
            text: "text-purple-500",
            bgGradient: "from-purple-500",
            bg: "bg-purple-500",
            hoverBorder: "hover:border-purple-500"
        }
    };

    // Safelist for Tailwind JIT compiler
    // border-green-500 via-green-500 from-green-500/20 to-green-500/10 border-green-500/30 text-green-500 from-green-500 bg-green-500 hover:border-green-500
    // border-blue-500 via-blue-500 from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-500 from-blue-500 bg-blue-500 hover:border-blue-500
    // border-yellow-500 via-yellow-500 from-yellow-500/20 to-yellow-500/10 border-yellow-500/30 text-yellow-500 from-yellow-500 bg-yellow-500 hover:border-yellow-500
    // border-purple-500 via-purple-500 from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-500 from-purple-500 bg-purple-500 hover:border-purple-500
    // to-emerald-400

    const currentColors = colorClasses[color] || colorClasses["green-500"];
    // --- END FIX ---


    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setAnimatedValue(prev => {
                    const diff = value - prev;
                    return diff > 1 ? prev + Math.ceil(diff / 10) : value;
                });
            }, 50);
            
            setTimeout(() => clearInterval(interval), 2000);
        }, delay * 100);
        
        return () => clearTimeout(timer);
    }, [value, delay]);
    
    const formatValue = (val) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toFixed(0);
    };
    
    const progressPercentage = Math.min((value / target) * 100, 100);
    
    return (
        <motion.div
            className={`bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            whileHover={{
                scale: 1.02,
                boxShadow: `0 20px 40px rgba(34, 197, 94, 0.2)`,
                borderColor: 'rgb(34 197 94)' 
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1 }}
            layout
        >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className={`border ${currentColors.border}`} />
                    ))}
                </div>
            </div>
            
            {/* Animated Background Glow */}
            <motion.div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${currentColors.via} to-transparent`}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${currentColors.from} ${currentColors.to} border ${currentColors.border30}`}>
                        <Icon className={`w-6 h-6 ${currentColors.text}`} />
                    </div>
                    <div className="text-right">
                        <div className={`text-xs ${currentColors.text} font-medium`}>
                            {growth >= 0 ? '+' : ''}{growth}%
                        </div>
                        <div className="flex items-center gap-1">
                            {growth >= 0 ?
                                <ArrowUp className={`w-3 h-3 ${currentColors.text}`} /> :
                                <ArrowDown className="w-3 h-3 text-red-400" />
                            }
                            <span className="text-xs text-gray-400">vs last week</span>
                        </div>
                    </div>
                </div>
                
                <div className="mb-4">
                    <motion.div
                        className="text-3xl font-bold text-white mb-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {formatValue(animatedValue)}
                    </motion.div>
                    <div className="text-gray-400 text-sm font-medium">{title}</div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Progress to Goal</span>
                        <span className="text-xs text-gray-400">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${currentColors.bgGradient} to-emerald-400 rounded-full`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 2, ease: "easeOut", delay: delay * 0.1 }}
                        />
                    </div>
                </div>
                
                {/* Mini Trend Chart */}
                <div className="flex items-end gap-1 h-8">
                    {trend.map((point, index) => (
                        <motion.div
                            key={index}
                            className={`${currentColors.bg} rounded-sm flex-1 opacity-70`}
                            initial={{ height: 0 }}
                            animate={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                            transition={{ duration: 1, delay: (delay * 0.1) + (index * 0.1) }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// Skill Verification Widget with Enterprise Styling
const SkillVerificationWidget = ({ skills }) => {
    const [filter, setFilter] = useState('all');
    
    const getSkillLevelColor = (level) => ({
        Expert: 'text-purple-400 bg-purple-900/30 border-purple-700',
        Advanced: 'text-blue-400 bg-blue-900/30 border-blue-700',
        Intermediate: 'text-green-400 bg-green-900/30 border-green-700',
        Beginner: 'text-orange-400 bg-orange-900/30 border-orange-700'
    })[level];
    
    const getVerificationIcon = (method) => ({
        'GitHub Analysis': GitBranch,
        'Coding Challenge': Code,
        'Peer Endorsement': Users,
        'Portfolio Review': BookOpen,
        'Quiz Assessment': Target
    })[method] || Activity;
    
    const filteredSkills = skills.filter(skill => {
        if (filter === 'all') return true;
        if (filter === 'verified') return skill.verified;
        if (filter === 'pending') return !skill.verified;
        return true;
    });
    
    return (
        <motion.div
            className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                        <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Skill Verification</h3>
                        <p className="text-xs text-gray-400">{skills.filter(s => s.verified).length} verified skills</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">All Skills</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                    </select>
                    
                    <motion.button
                        className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-medium hover:bg-green-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add Skill
                    </motion.button>
                </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                <AnimatePresence mode="popLayout">
                    {filteredSkills.map((skill, index) => {
                        const Icon = getVerificationIcon(skill.method);
                        return (
                            <motion.div
                                key={skill.skill}
                                className={`group p-4 rounded-xl border transition-all duration-200 ${
                                    skill.verified
                                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-green-500/30 hover:border-green-500/50'
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01, x: 5 }}
                                layout
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${skill.verified ? 'bg-green-500/20' : 'bg-gray-700/50'}`}>
                                        <Icon className={`w-4 h-4 ${skill.verified ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-white group-hover:text-green-400 transition-colors">
                                                {skill.skill}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getSkillLevelColor(skill.level)}`}>
                                                {skill.level}
                                            </span>
                                            {skill.verified && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <UserCheck className="w-3 h-3 text-green-500" />
                                                    <span className="text-xs text-green-500">Verified</span>
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {skill.method}
                                            </div>
                                            {skill.score > 0 && (
                                                <span className="text-green-500 font-medium">Score: {skill.score}/100</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!skill.verified && (
                                            <motion.button
                                                className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                title="Start Verification"
                                            >
                                                <Play className="w-3 h-3" />
                                            </motion.button>
                                        )}
                                        <motion.button
                                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            title="View Details"
                                        >
                                            <Eye className="w-3 h-3" />
                                        </motion.button>
                                    </div>
                                </div>
                                
                                {/* Skill progress bar */}
                                {skill.verified && skill.score > 0 && (
                                    <div className="mt-3 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${skill.score}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Enhanced Task Management with Skill Requirements - Now accepts navigate prop
const SkillTaskManagementWidget = ({ tasks, onTaskUpdate, navigate, projectNameToIdMap }) => {
    const [filter, setFilter] = useState('all');
    const [sortBy] = useState('priority');
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'high') return task.priority === 'high' || task.priority === 'critical';
        return true;
    });
    
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority') {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });
    
    const getPriorityColor = (priority) => ({
        critical: 'text-red-400 bg-red-900/30 border-red-700',
        high: 'text-orange-400 bg-orange-900/30 border-orange-700',
        medium: 'text-blue-400 bg-blue-900/30 border-blue-700',
        low: 'text-gray-400 bg-gray-700/30 border-gray-600'
    })[priority];
    
    const getVerificationColor = (level) => ({
        Expert: 'text-purple-400',
        Advanced: 'text-blue-400',
        Intermediate: 'text-green-400',
        Beginner: 'text-orange-400'
    })[level];
    
    const handleProjectClick = (projectName) => {
        const projectId = projectNameToIdMap.get(projectName);
        if (projectId) {
            navigate(`/dashboard/projects/${projectId}`);
        }
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                        <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Skill-Based Tasks</h3>
                        <p className="text-xs text-gray-400">{filteredTasks.filter(t => !t.completed).length} pending, {filteredTasks.filter(t => t.completed).length} completed</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="high">High Priority</option>
                    </select>
                    
                    <motion.button
                        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-green-500 transition-colors"
                        whileHover={{ scale: 1.05, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Settings className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                <AnimatePresence mode="popLayout">
                    {sortedTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            className={`group p-4 rounded-xl border transition-all duration-200 ${
                                task.completed
                                    ? 'bg-gray-900/50 border-gray-700'
                                    : 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 hover:border-green-500/50'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01, x: 5 }}
                            layout
                        >
                            <div className="flex items-start gap-3">
                                <motion.input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => onTaskUpdate(task.id, !task.completed)}
                                    className="mt-1 h-4 w-4 rounded-sm bg-gray-800 border-gray-600 text-green-500 focus:ring-green-500"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className={`font-medium transition-all ${
                                            task.completed
                                                ? 'line-through text-gray-500'
                                                : 'text-white group-hover:text-green-400'
                                        }`}>
                                            {task.text}
                                        </p>
                                        <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Award className="w-3 h-3" />
                                            <span className={getVerificationColor(task.verificationLevel)}>
                                                {task.skillRequired} ({task.verificationLevel})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {task.endorsements} endorsements
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {task.assignee}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {task.hours}h
                                        </div>
                                        <div 
                                            className="flex items-center gap-1 hover:text-green-400 cursor-pointer"
                                            onClick={() => handleProjectClick(task.project)}
                                        >
                                            <Briefcase className="w-3 h-3" />
                                            {task.project}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            {task.category}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                        className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        title="Request Skill Endorsement"
                                    >
                                        <UserCheck className="w-3 h-3" />
                                    </motion.button>
                                    <motion.button
                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        title="View Skill Requirements"
                                    >
                                        <Eye className="w-3 h-3" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Enhanced Team Activity Widget with Skill Focus - Now accepts navigate prop
const SkillTeamActivityWidget = ({ teamMembers, timeline, navigate, projectNameToIdMap }) => {
    const [activeTab, setActiveTab] = useState('activity');
    
    const getStatusColor = (status) => ({
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        offline: 'bg-gray-500'
    })[status];
    
    const getActivityIcon = (type) => ({
        endorsement: Star,
        verification: Award,
        collaboration: Users,
        portfolio: BookOpen
    })[type] || Activity;

    const handleActivityClick = (item) => {
        if (item.type === 'collaboration') {
            const projectId = projectNameToIdMap.get(item.target);
            if (projectId) {
                navigate(`/dashboard/projects/${projectId}`);
            }
        }
    };
    
    return (
        <motion.div
            className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            {/* Tab Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Skill Collaboration Hub</h3>
                </div>
                
                <div className="flex bg-gray-800 rounded-lg p-1">
                    {[
                        { key: 'activity', label: 'Activity', icon: Activity },
                        { key: 'members', label: 'Members', icon: Users }
                    ].map(tab => (
                        <motion.button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-green-500 text-black'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <tab.icon className="w-3 h-3" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            {/* Content */}
            <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                <AnimatePresence mode="wait">
                    {activeTab === 'activity' ? (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {timeline.map((item, index) => {
                                const Icon = getActivityIcon(item.type);
                                return (
                                    <motion.div
                                        key={item.id}
                                        className={`flex items-start gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors ${item.type === 'collaboration' ? 'cursor-pointer' : ''}`}
                                        onClick={() => handleActivityClick(item)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.01, x: 5 }}
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black text-xs font-bold">
                                                {item.avatar}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white">
                                                <span className="font-medium text-green-400">{item.user}</span>
                                                <span className="text-gray-300 mx-1">{item.action}</span>
                                                <span className="font-medium">{item.target}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Icon className="w-3 h-3 text-green-500" />
                                                <span className="text-xs text-gray-400">{item.time}</span>
                                                <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                                                    item.type === 'endorsement' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                                    item.type === 'verification' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                                                    item.type === 'collaboration' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                                                    'text-green-400 border-green-500/30 bg-green-500/10'
                                                }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {index === 0 && (
                                            <motion.div
                                                className="w-2 h-2 bg-green-500 rounded-full"
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="members"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, x: 5 }}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold">
                                            {member.avatar}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-black`} />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{member.name}</p>
                                        <p className="text-xs text-gray-400 mb-1">{member.role}</p>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {member.topSkills.slice(0, 2).map((skill, skillIndex) => (
                                                <span key={skillIndex} className="px-1 py-0.5 text-[10px] bg-green-900/30 text-green-400 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Award className="w-3 h-3" />
                                                {member.skillsVerified}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {member.endorsements}
                                            </div>
                                        </div>
                                        <div className="text-xs text-green-500 mt-1">GitHub: {member.githubScore}</div>
                                        <div className={`text-xs font-medium capitalize ${
                                            member.status === 'online' ? 'text-green-400' :
                                            member.status === 'away' ? 'text-yellow-400' : 'text-gray-400'
                                        }`}>
                                            {member.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Quick Actions Widget with Skill-focused Actions - Now accepts navigate prop
const SkillQuickActionsWidget = ({ navigate }) => {
    const actions = [
        { icon: Plus, label: 'New Project', color: 'from-green-500 to-emerald-400', shortcut: 'Ctrl+N' },
        { icon: Award, label: 'Verify Skill', color: 'from-purple-500 to-purple-400', shortcut: 'Ctrl+V' },
        { icon: Users, label: 'Find Collaborators', color: 'from-blue-500 to-cyan-400', shortcut: 'Ctrl+F', path: '/dashboard/discover' },
        { icon: Star, label: 'Give Endorsement', color: 'from-yellow-500 to-orange-400', shortcut: 'Ctrl+E' },
        { icon: BookOpen, label: 'Portfolio', color: 'from-indigo-500 to-purple-400', shortcut: 'Ctrl+P' },
        { icon: Settings, label: 'Settings', color: 'from-gray-600 to-gray-500', shortcut: 'Ctrl+,', path: '/dashboard/settings' }
    ];
    
    return (
        <motion.div
            className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl border border-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Skill Actions</h3>
                    <p className="text-xs text-gray-400">Quick access to platform features</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <motion.button
                        key={action.label}
                        onClick={() => action.path && navigate(action.path)}
                        className={`group relative p-4 rounded-xl bg-gradient-to-br ${action.color} text-black font-medium overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Background Animation */}
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                        />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <action.icon className="w-4 h-4" />
                                <span className="text-sm">{action.label}</span>
                            </div>
                            <div className="text-xs opacity-70">{action.shortcut}</div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

// Main Dashboard Component
export default function DashboardHomePage() {
    // --- START LOGOUT CHANGES ---
    const user = { id: 1, name: "Alex Johnson", role: "Full-Stack Developer" };
    
    const navigate = useNavigate(); // <-- 2. INITIALIZE NAVIGATE FUNCTION
    const { logout } = useAuth(); // <-- GET LOGOUT FUNCTION
    
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState(mockTasks);
    const headerRef = useRef(null);
    
    // <-- 3. Create a map for efficient Project Name -> ID lookup
    const projectNameToIdMap = useMemo(() => 
        new Map(mockProjects.map(p => [p.name, p.id])), 
        [mockProjects]
    );

    const handleTaskUpdate = (taskId, completed) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, completed } : task
        ));
    };

    // <-- ADD LOGOUT HANDLER
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Navigate to landing page after logout
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };
    // --- END LOGOUT CHANGES ---
    
    const unreadNotifications = mockNotifications.filter(n => n.unread).length;

    const floatingActions = [
        { icon: Plus, label: 'New Project', color: 'bg-gradient-to-r from-green-500 to-emerald-400 text-black' },
        { icon: Award, label: 'Verify Skills', color: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' },
        { icon: Users, label: 'Find Collaborators', color: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white', path: '/dashboard/discover' },
        { icon: Star, label: 'Give Endorsement', color: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' }
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Advanced 3D Background */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                    <Suspense fallback={null}>
                        <Advanced3DBackground />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 p-6">
                {/* Enhanced Header */}
                <motion.div
                    ref={headerRef}
                    className="mb-8"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className="bg-black/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <motion.h1
                                    className="text-6xl font-bold bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent mb-2"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Skill Collaboration Hub
                                </motion.h1>
                                <motion.p
                                    className="text-gray-400 text-lg"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    Welcome back, {user.name} • Showcase • Verify • Collaborate • Build
                                </motion.p>
                            </div>
                            
                            <motion.div
                                className="flex items-center gap-6"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <motion.input
                                        type="text"
                                        placeholder="Search skills, projects, collaborators..."
                                        className="pl-12 pr-6 py-4 w-96 bg-gray-900/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                                
                                <motion.button
                                    className="relative p-4 bg-gray-900/80 border border-gray-700 rounded-2xl hover:bg-gray-800 transition-all backdrop-blur-sm group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Bell className="w-6 h-6 text-gray-300 group-hover:text-green-500 transition-colors" />
                                    {unreadNotifications > 0 && (
                                        <motion.span
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {unreadNotifications}
                                        </motion.span>
                                    )}
                                </motion.button>
                                
                                {/* --- ADDED LOGOUT BUTTON --- */}
                                <motion.button
                                    onClick={handleLogout}
                                    className="relative p-4 bg-gray-900/80 border border-gray-700 rounded-2xl hover:bg-gray-800 transition-all backdrop-blur-sm group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Logout"
                                >
                                    <LogOut className="w-6 h-6 text-gray-300 group-hover:text-red-500 transition-colors" />
                                </motion.button>
                                {/* --- END OF LOGOUT BUTTON --- */}
                                
                                <motion.div
                                    className="flex items-center gap-3 bg-gray-900/80 border border-gray-700 rounded-2xl px-6 py-3 backdrop-blur-sm cursor-pointer"
                                    onClick={() => navigate('/dashboard/settings')} // <-- Navigate to settings
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-black font-bold">
                                        AJ
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{user.name}</div>
                                        <div className="text-gray-400 text-sm">{user.role}</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Skill-focused KPI Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <SkillMetricCard
                        title="Skills Verified"
                        value={mockMetrics.skillsVerified.current}
                        target={mockMetrics.skillsVerified.target}
                        growth={mockMetrics.skillsVerified.growth}
                        trend={mockMetrics.skillsVerified.trend}
                        icon={Award}
                        color="green-500"
                        delay={0}
                    />
                    <SkillMetricCard
                        title="Active Projects"
                        value={mockMetrics.projectsActive.current}
                        target={mockMetrics.projectsActive.target}
                        growth={mockMetrics.projectsActive.growth}
                        trend={mockMetrics.projectsActive.trend}
                        icon={Briefcase}
                        color="blue-500"
                        delay={1}
                        onClick={() => navigate('/dashboard/projects')} // <-- Navigate to projects page
                    />
                    <SkillMetricCard
                        title="Endorsements Received"
                        value={mockMetrics.endorsements.current}
                        target={mockMetrics.endorsements.target}
                        growth={mockMetrics.endorsements.growth}
                        trend={mockMetrics.endorsements.trend}
                        icon={Star}
                        color="yellow-500"
                        delay={2}
                    />
                    <SkillMetricCard
                        title="Active Collaborators"
                        value={mockMetrics.collaborators.current}
                        target={mockMetrics.collaborators.target}
                        growth={mockMetrics.collaborators.growth}
                        trend={mockMetrics.collaborators.trend}
                        icon={Users}
                        color="purple-500"
                        delay={3}
                        onClick={() => navigate('/dashboard/discover')} // <-- Navigate to discover page
                    />
                </div>
                
                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Left Section - Skills & Tasks */}
                    <div className="xl:col-span-4 space-y-6">
                        <SkillVerificationWidget skills={mockSkillVerifications} />
                        <SkillQuickActionsWidget navigate={navigate} />
                    </div>
                    
                    {/* Middle Section - Skill-Based Tasks & Projects */}
                    <div className="xl:col-span-5 space-y-6">
                        <SkillTaskManagementWidget tasks={tasks} onTaskUpdate={handleTaskUpdate} navigate={navigate} projectNameToIdMap={projectNameToIdMap} />
                        
                        {/* Skill-Based Project Overview */}
                        <motion.div
                            className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                                    <Briefcase className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Skill-Based Projects</h3>
                                    <p className="text-xs text-gray-400">{mockProjects.length} active collaborations</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {mockProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        className="group p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/projects/${project.id}`)} // <-- Navigate to project detail page
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 10 }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center text-black font-bold">
                                                    {project.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">
                                                        {project.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400">{project.type} • {project.members} collaborators</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-500">{project.progress}%</div>
                                                <div className="text-xs text-gray-400">Complete</div>
                                            </div>
                                        </div>
                                        
                                        {/* Required Skills Display */}
                                        <div className="mb-3">
                                            <div className="text-xs text-gray-400 mb-2">Required Skills:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {project.requiredSkills.map((skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className="px-2 py-1 text-xs bg-green-900/30 text-green-400 border border-green-700 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <DollarSign className="w-3 h-3" />
                                                ${(project.budget / 1000).toFixed(0)}K
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-green-500">
                                                <UserCheck className="w-3 h-3" />
                                                {project.skillsVerified}% verified
                                            </div>
                                            <div className={`px-2 py-1 text-xs rounded-full ${
                                                project.status === 'Active' ? 'text-green-400 bg-green-900/30' :
                                                'text-orange-400 bg-orange-900/30'
                                            }`}>
                                                {project.status}
                                            </div>
                                        </div>
                                        
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <motion.div
                                                className={`h-full rounded-full ${
                                                    project.progress > 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                                    project.progress > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                    'bg-gradient-to-r from-red-500 to-pink-500'
                                                }`}
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${project.progress}%` }}
                                                transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Right Section - Team & Activity */}
                    <div className="xl:col-span-3 space-y-6">
                        <SkillTeamActivityWidget teamMembers={mockTeamMembers} timeline={mockTimeline} navigate={navigate} projectNameToIdMap={projectNameToIdMap} />
                        
                        {/* Enhanced Notifications with Skill Focus */}
                        <motion.div
                            className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Platform Activity</h3>
                                    <p className="text-xs text-gray-400">{unreadNotifications} new updates</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                                <AnimatePresence>
                                    {mockNotifications.map((notification, index) => {
                                        const getNotificationColor = (type) => ({
                                            endorsement: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
                                            project: 'border-green-500/30 bg-green-500/10 text-green-400',
                                            collaboration: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
                                            verification: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                                        })[type] || 'border-gray-500/30 bg-gray-500/10 text-gray-400';
                                        
                                        return (
                                            <motion.div
                                                key={notification.id}
                                                className={`p-4 rounded-xl border transition-all duration-200 ${
                                                    notification.unread
                                                        ? 'border-green-500/30 bg-green-500/5'
                                                        : 'border-gray-700/50 bg-gray-800/30'
                                                }`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                                        notification.type === 'endorsement' ? 'bg-yellow-500' :
                                                        notification.type === 'project' ? 'bg-green-500' :
                                                        notification.type === 'verification' ? 'bg-purple-500' : 'bg-blue-500'
                                                    } ${notification.unread ? 'animate-pulse' : ''}`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-white font-medium mb-1">{notification.text}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {notification.time}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-[10px] rounded-full border font-medium ${getNotificationColor(notification.type)}`}>
                                                                {notification.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {notification.unread && (
                                                        <motion.div
                                                            className="w-1 h-1 bg-green-500 rounded-full"
                                                            animate={{ scale: [1, 1.5, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                        />
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Floating Skill-Based Quick Actions */}
                <AnimatePresence>
                    <div className="fixed bottom-8 right-8 z-50">
                        {quickActionsOpen && (
                            <motion.div
                                className="mb-6 space-y-3"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ duration: 0.3, type: "spring" }}
                            >
                                {floatingActions.map((action, index) => (
                                    <motion.button
                                        key={action.label}
                                        onClick={() => action.path && navigate(action.path)}
                                        className={`flex items-center gap-3 ${action.color} px-6 py-4 rounded-2xl shadow-2xl font-medium min-w-56 backdrop-blur-lg`}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, x: -10 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <action.icon className="w-5 h-5" />
                                        <span>{action.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                        
                        <motion.button
                            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-400 text-black rounded-3xl shadow-2xl flex items-center justify-center font-bold text-2xl backdrop-blur-lg border-2 border-green-300"
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 40px rgba(34, 197, 94, 0.6)",
                                rotate: quickActionsOpen ? 135 : 0
                            }}
                            whileTap={{ scale: 0.9 }}
                            animate={{
                                rotate: quickActionsOpen ? 45 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Plus className="w-8 h-8" />
                        </motion.button>
                    </div>
                </AnimatePresence>
            </div>
        </div>
        
    );
}