import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Calendar, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { getProjectById, getTasksByProjectId } from '../../lib/api';

const SkeletonLoader = () => (
    <div className="min-h-screen bg-black text-white p-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-700 rounded mb-6"></div>
        <div className="h-12 w-3/4 bg-gray-700 rounded mb-2"></div>
        <div className="h-6 w-1/2 bg-gray-700 rounded mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                    <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                    <div className="h-6 w-1/3 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-700 rounded"></div>
                        <div className="h-8 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                <div className="h-6 w-1/4 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-12 bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProjectData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [projectData, tasksData] = await Promise.all([
                getProjectById(projectId),
                getTasksByProjectId(projectId)
            ]);
            setProject(projectData);
            setTasks(tasksData);
        } catch (e) {
            console.error('Failed to load project data:', e);
            setError('Could not load project details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadProjectData();
    }, [loadProjectData]);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">{error}</h1>
                <button
                    onClick={loadProjectData}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        );
    }

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