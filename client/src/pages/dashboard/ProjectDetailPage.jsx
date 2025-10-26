import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';

// Assuming mock data is available or fetched from an API
const mockProjects = [
    { id: 1, name: "AI-Powered Web App", description: "A web application leveraging machine learning to provide personalized user experiences.", progress: 78, status: "Active", members: [{name: 'Sarah Chen'}, {name: 'David Kumar'}], budget: 25000, deadline: "2025-12-15", requiredSkills: ["React", "Python", "Machine Learning", "UI/UX"], skillsVerified: 85, type: "Full-Stack Development" },
    { id: 2, name: "Mobile E-commerce Platform", description: "A cross-platform mobile app for a seamless shopping experience.", progress: 45, status: "Recruiting", members: [{name: 'Alex Morgan'}], budget: 18000, deadline: "2025-11-30", requiredSkills: ["React Native", "Node.js", "MongoDB", "Payment APIs"], skillsVerified: 60, type: "Mobile Development" },
    { id: 3, name: "Blockchain Voting System", description: "A decentralized and secure voting system built on blockchain technology.", progress: 92, status: "Active", members: [{name: 'Lisa Rodriguez'}, {name: 'Sarah Chen'}], budget: 42000, deadline: "2025-10-20", requiredSkills: ["Solidity", "Web3", "Smart Contracts", "Security"], skillsVerified: 95, type: "Blockchain" },
    { id: 4, name: "Data Analytics Dashboard", description: "An interactive dashboard for visualizing complex business intelligence data.", progress: 60, status: "Active", members: [{name: 'David Kumar'}], budget: 30000, deadline: "2025-11-01", requiredSkills: ["D3.js", "PostgreSQL", "ETL"], skillsVerified: 75, type: "Data Science" },
];

const mockTasks = [
    { id: 1, text: "Design user authentication system", completed: false, project_id: 1 },
    { id: 2, text: "Implement machine learning model", completed: true, project_id: 1 },
    { id: 3, text: "Set up smart contract deployment", completed: false, project_id: 3 },
];

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const project = mockProjects.find(p => p.id === parseInt(projectId));
    const tasks = mockTasks.filter(t => t.project_id === parseInt(projectId));

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Project Not Found</h1>
                <button
                    onClick={() => navigate('/dashboard/projects')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <button
                    onClick={() => navigate('/dashboard/projects')}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Projects
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">{project.name}</h1>
                    <div className={`px-4 py-2 text-sm rounded-full font-semibold ${project.status === 'Active' ? 'text-green-400 bg-green-900/30' : 'text-orange-400 bg-orange-900/30'}`}>
                        {project.status}
                    </div>
                </div>
                <p className="text-gray-400 mt-2 max-w-3xl">{project.description}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                {/* Left Column: Details & Members */}
                <motion.div className="lg:col-span-1 space-y-8" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    {/* Project Details */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Project Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Budget</span> <span><DollarSign className="w-4 h-4 inline mr-1 text-green-500" />${project.budget.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Deadline</span> <span><Calendar className="w-4 h-4 inline mr-1 text-green-500" />{project.deadline}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Type</span> <span>{project.type}</span></div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5 mt-6">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <p className="text-right text-xs text-gray-400 mt-2">{project.progress}% Complete</p>
                    </div>

                    {/* Team Members */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Team Members ({project.members.length})</h3>
                        <div className="space-y-3">
                            {project.members.map(member => (
                                <div key={member.name} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold text-sm">
                                        {member.name.split(' ').map(w => w[0]).join('')}
                                    </div>
                                    <span className="text-sm">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Tasks */}
                <motion.div className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-2xl p-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <h3 className="text-xl font-bold mb-4">Project Tasks</h3>
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-4 p-3 bg-gray-800/60 rounded-lg">
                                {task.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                )}
                                <p className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</p>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No tasks assigned to this project yet.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}