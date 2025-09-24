import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Award, Star, GitBranch } from 'lucide-react';

const mockTeamMembers = [
    { id: 1, name: "Sarah Chen", role: "Full-Stack Developer", status: "online", avatar: "SC", skillsVerified: 12, endorsements: 45, topSkills: ["React", "Node.js", "Python"], githubScore: 98 },
    { id: 2, name: "David Kumar", role: "ML Engineer", status: "online", avatar: "DK", skillsVerified: 8, endorsements: 28, topSkills: ["Python", "TensorFlow", "Data Science"], githubScore: 95 },
    { id: 3, name: "Alex Morgan", role: "Blockchain Developer", status: "away", avatar: "AM", skillsVerified: 6, endorsements: 15, topSkills: ["Solidity", "Web3", "Smart Contracts"], githubScore: 87 },
    { id: 4, name: "Lisa Rodriguez", role: "Security Specialist", status: "online", avatar: "LR", skillsVerified: 10, endorsements: 34, topSkills: ["Cybersecurity", "Penetration Testing", "Audit"], githubScore: 92 },
];

const MemberCard = ({ member }) => {
    const getStatusColor = (status) => ({ online: 'bg-green-500', away: 'bg-yellow-500', offline: 'bg-gray-500' })[status];

    return (
        <motion.div
            className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 flex flex-col text-center items-center hover:border-green-500/50 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
        >
            <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold text-3xl">
                    {member.avatar}
                </div>
                <div className={`absolute bottom-1 right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-gray-900`} />
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{member.role}</p>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {member.topSkills.map(skill => (
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
    );
};

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = mockTeamMembers.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
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

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                    >
                        <MemberCard member={member} />
                    </motion.div>
                ))}
            </div>
            {filteredMembers.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No collaborators found.</p>
                </div>
            )}
        </div>
    );
}