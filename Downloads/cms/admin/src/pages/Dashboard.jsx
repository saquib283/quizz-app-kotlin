import { FileText, Image as ImageIcon, BookOpen, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState({ posts: 0, pages: 0, media: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's matchin' today.</p>
                </div>
                <Link to="/posts/create" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                    <Plus size={18} />
                    <span>New Post</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Live</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Blog Posts</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '-' : stats.posts}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <FileText size={24} />
                        </div>
                        <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Static Pages</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '-' : stats.pages}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <ImageIcon size={24} />
                        </div>
                        <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-1 rounded-full">Assets</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Media Assets</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '-' : stats.media}</p>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/posts/create" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-blue-600">
                                    <Plus size={16} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">Write a new article</span>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link to="/media" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-amber-600">
                                    <ImageIcon size={16} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">Upload new images</span>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">System Status</h3>
                        <p className="text-blue-100 mb-6 text-sm">Everything is running smoothly. Your last backup was created 2 hours ago.</p>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                API Online
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                DB Connected
                            </div>
                        </div>
                    </div>

                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}
