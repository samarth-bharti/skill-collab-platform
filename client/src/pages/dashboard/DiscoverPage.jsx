import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Award, Star, GitBranch, RefreshCw } from 'lucide-react';
import { getAllUsers } from '../../lib/api';

const SkeletonCard = () => (
    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 flex flex-col text-center items-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gray-700 mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded mb-4"></div>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            <div className="h-4 w-16 bg-gray-700 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-700 rounded-full"></div>
            <div className="h-4 w-12 bg-gray-700 rounded-full"></div>
        </div>
        <div className="w-full mt-auto pt-4 border-t border-gray-700 grid grid-cols-3 gap-2 text-xs">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
        </div>
    </div>
);

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const users = await getAllUsers();
            const mapped = users.map(u => ({
                id: u.$id,
                name: u.fullName || u.name || 'Unknown User',
                role: u.role || 'Developer',
                status: u.status || 'online',
                avatar: (u.fullName || u.name) ? (u.fullName || u.name).split(' ').map(n => n[0]).slice(0,2).join('') : 'U',
                skillsVerified: u.skillsVerified || 0,
                endorsements: u.endorsements || 0,
                topSkills: u.topSkills || [],
                githubScore: u.githubScore || 0
            }));
            setMembers(mapped);
        } catch (e) {
            console.error('Failed to load users from Appwrite:', e);
            setError('Could not load collaborators. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center mb-12"
            >
                <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h1 className="text-5xl font-bold">Discover Collaborators</h1>
                <p className="text-gray-400 mt-2">Find the right talent and skills for your next project.</p>
                <div className="relative mt-6 max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or skill..."
                        className="pl-12 pr-4 py-3 w-full bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {error && (
                <div className="text-center py-20 text-yellow-300">
                    <p className="text-lg mb-4">{error}</p>
                    <button onClick={loadUsers} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center mx-auto">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                    {filteredMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 flex flex-col text-center items-center hover:border-green-500/50 transition-colors"
                        >
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold text-3xl">
                                    {member.avatar}
                                </div>
                                <div className={`absolute bottom-1 right-1 w-4 h-4 ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full border-2 border-gray-900`} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">{member.role}</p>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {member.topSkills.slice(0,6).map(skill => (
                                    <span key={skill} className="px-2 py-1 text-xs bg-green-900/30 text-green-400 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="w-full mt-auto pt-4 border-t border-gray-700 grid grid-cols-3 gap-2 text-xs text-gray-400">
                                <div className="text-center">
                                    <Award className="w-4 h-4 mx-auto mb-1 text-green-500" />
                                    <p>{member.skillsVerified}</p>
                                    <p>Verified</p>
                                </div>
                                <div className="text-center">
                                    <Star className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                                    <p>{member.endorsements}</p>
                                    <p>Endorsed</p>
                                </div>
                                <div className="text-center">
                                    <GitBranch className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                                    <p>{member.githubScore}</p>
                                    <p>GH Score</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && !error && filteredMembers.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No collaborators found.</p>
                </div>
            )}
        </div>
    );
}