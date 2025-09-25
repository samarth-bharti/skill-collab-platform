// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Compass, MessageSquare, Settings, HelpCircle, User, LogOut } from 'lucide-react';

const navLinks = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Projects', path: '/dashboard/projects', icon: Briefcase },
    { name: 'Discover', path: '/dashboard/discover', icon: Compass },
    { name: 'Chat', path: '/dashboard/chat', icon: MessageSquare },
];

const bottomLinks = [
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Support', path: '/dashboard/support', icon: HelpCircle },
];

const SidebarLink = ({ link, isExpanded }) => {
    return (
        <li>
            <NavLink
                to={link.path}
                end={link.path === '/dashboard'}
                className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group relative ${
                        isActive
                            ? 'bg-gradient-to-r from-green-500/20 to-green-500/10 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full"
                            />
                        )}
                        <link.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-white'}`} />
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {link.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </NavLink>
        </li>
    );
};


export default function DashboardLayout() {
    // State to manage whether the sidebar is expanded or collapsed
    const [isExpanded, setIsExpanded] = useState(false);

    const sidebarVariants = {
        expanded: { width: '16rem' /* w-64 */ },
        collapsed: { width: '5rem' /* w-20 */ }
    };

    const mainVariants = {
        expanded: { marginLeft: '16rem' },
        collapsed: { marginLeft: '5rem' }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <motion.aside
                variants={sidebarVariants}
                initial="collapsed"
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className="bg-gradient-to-b from-black to-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between fixed h-full z-20"
            >
                <div>
                    {/* Logo/Header */}
                    <div className="flex items-center gap-3 mb-10 h-10">
                         <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-black" />
                        </div>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="text-xl font-bold text-white whitespace-nowrap"
                                >
                                    SkillHub
                                </motion.h1>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Links */}
                    <nav>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <SidebarLink key={link.name} link={link} isExpanded={isExpanded} />
                            ))}
                        </ul>
                        <div className="my-8 border-t border-gray-800" />
                        <ul className="space-y-3">
                            {bottomLinks.map((link) => (
                                <SidebarLink key={link.name} link={link} isExpanded={isExpanded} />
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Footer / User Profile Area */}
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold flex-shrink-0">
                                AJ
                            </div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        className="whitespace-nowrap"
                                    >
                                        <p className="font-semibold text-sm">Alex Johnson</p>
                                        <p className="text-xs text-gray-400">View Profile</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <AnimatePresence>
                           {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0" />
                                </motion.div>
                           )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.main
                variants={mainVariants}
                initial="collapsed"
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 overflow-y-auto"
            >
                {/* Outlet is where your page components like DashboardHomePage will be rendered */}
                <Outlet />
            </motion.main>
        </div>
    );
}