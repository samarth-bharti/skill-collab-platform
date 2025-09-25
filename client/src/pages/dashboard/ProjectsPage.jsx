import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Search, Filter, DollarSign, UserCheck, Grid, List } from 'lucide-react';

// Using the same mock data structure from your DashboardHomePage
const mockProjects = [
    { id: 1, name: "AI-Powered Web App", progress: 78, status: "Active", members: 4, budget: 25000, type: "Full-Stack Development", requiredSkills: ["React", "Python", "Machine Learning"], skillsVerified: 85 },
    { id: 2, name: "Mobile E-commerce Platform", progress: 45, status: "Recruiting", members: 2, budget: 18000, type: "Mobile Development", requiredSkills: ["React Native", "Node.js", "MongoDB"], skillsVerified: 60 },
    { id: 3, name: "Blockchain Voting System", progress: 92, status: "Active", members: 6, budget: 42000, type: "Blockchain", requiredSkills: ["Solidity", "Web3", "Security"], skillsVerified: 95 },
    { id: 4, name: "Data Analytics Dashboard", progress: 60, status: "Active", members: 3, budget: 30000, type: "Data Science", requiredSkills: ["D3.js", "PostgreSQL", "ETL"], skillsVerified: 75 },
];

const ProjectCard = ({ project, onClick }) => (
    <motion.div
        className="group p-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -5 }}
        layout
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center text-black font-bold text-lg">
                    {project.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                    <h4 className="font-bold text-white group-hover:text-green-400 transition-colors text-lg">
                        {project.name}
                    </h4>
                    <p className="text-xs text-gray-400">{project.type} • {project.members} collaborators</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold text-green-500">{project.progress}%</div>
                <div className="text-xs text-gray-400">Complete</div>
            </div>
        </div>

        <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Required Skills:</div>
            <div className="flex flex-wrap gap-2">
                {project.requiredSkills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs bg-green-900/30 text-green-400 border border-green-700/50 rounded-full">
                        {skill}
                    </span>
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-700 pt-4">
            <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Budget: ${(project.budget / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 text-green-500">
                <UserCheck className="w-3 h-3" /> {project.skillsVerified}% Skills Verified
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${project.status === 'Active' ? 'text-green-400 bg-green-900/30' : 'text-orange-400 bg-orange-900/30'}`}>
                {project.status}
            </div>
        </div>
    </motion.div>
);

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = mockProjects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex items-center justify-between mb-10"
            >
                <div className="flex items-center gap-4">
                    <Briefcase className="w-10 h-10 text-green-400" />
                    <div>
                        <h1 className="text-4xl font-bold">Projects</h1>
                        <p className="text-gray-400">Browse and manage all skill-based collaborations.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-10 pr-4 py-2 w-72 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-gray-900 border border-gray-700 rounded-lg hover:text-green-500">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                    >
                        <ProjectCard
                            project={project}
                            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                        />
                    </motion.div>
                ))}
            </div>
            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No projects found.</p>
                    <p>Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
}