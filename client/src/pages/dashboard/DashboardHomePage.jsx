import React, { useState, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls, Environment,
    ContactShadows, Stars
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// Skill-Based Platform Icons
import {
    Plus, Search, Bell, Award, Users, Star, Briefcase, DollarSign, UserCheck, Clock
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { mockProjects, mockTasks, mockTimeline, mockNotifications } from '../../api/mockData.js';

// Main Dashboard Component
export default function DashboardHomePage() {
    const { currentUser } = useAuth();
    const user = currentUser || { name: 'Guest', role: 'Collaborator' };
    const navigate = useNavigate();

    const [projects, setProjects] = useState(mockProjects);
    const [tasks, setTasks] = useState(mockTasks);
    const [skillVerifications, setSkillVerifications] = useState([
        { id: 1, skill: 'React', status: 'Pending' },
        { id: 2, skill: 'Node.js', status: 'Verified' },
    ]);
    const [timeline, setTimeline] = useState(mockTimeline);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [metrics, setMetrics] = useState({
        skillsVerified: { current: 12, target: 20, growth: 5, trend: 'up' },
        projectsActive: { current: 4, target: 5, growth: 1, trend: 'up' },
        endorsements: { current: 32, target: 50, growth: 10, trend: 'up' },
        collaborators: { current: 8, target: 10, growth: 2, trend: 'down' },
    });
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Alice', role: 'Designer' },
        { id: 2, name: 'Bob', role: 'Frontend' },
    ]);

    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const projectNameToIdMap = useMemo(() => 
        new Map(projects.map(p => [p.name, p.id])),
        [projects]
    );

    const handleTaskUpdate = (taskId, completed) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, completed } : task
        ));
    };

    const unreadNotifications = notifications.filter(n => n.unread).length;

    const floatingActions = [
        { icon: Plus, label: 'New Project', color: 'bg-gradient-to-r from-green-500 to-emerald-400 text-black' },
        { icon: Award, label: 'Verify Skills', color: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' },
        { icon: Users, label: 'Find Collaborators', color: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white', path: '/dashboard/discover' },
        { icon: Star, label: 'Give Endorsement', color: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' }
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Content Overlay */}
            <div className="relative z-10 p-6">
                {/* Enhanced Header */}
                <motion.div
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
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}