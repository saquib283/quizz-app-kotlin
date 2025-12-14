import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Edit, Trash2, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/Skeleton';

export default function PageList() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const { data } = await api.get('/pages');
            setPages(data.data || data);
        } catch (error) {
            console.error('Failed to fetch pages', error);
            toast.error('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id, currentStatus) => {
        try {
            await api.patch(`/pages/${id}/publish`, { is_published: !currentStatus });
            toast.success(currentStatus ? 'Page unpublished' : 'Page published');
            fetchPages();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/pages/${id}`);
            toast.success('Page deleted');
            fetchPages();
        } catch (error) {
            toast.error('Failed to delete page');
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Static Pages</h2>
                    <p className="text-gray-500 mt-1">Manage static content pages like About, Contact, etc.</p>
                </div>
                <Link to="create" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <span className="text-xl">+</span>
                    <span>Create New Page</span>
                </Link>
            </div>


            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Details</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {pages.map(page => (
                            <tr key={page.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{page.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-xs">{page.slug}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => togglePublish(page.id, page.is_published)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${page.is_published
                                            ? 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                    >
                                        {page.is_published ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        <span>{page.is_published ? 'Published' : 'Draft'}</span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`http://localhost:8000/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="View Public Page"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <Link to={`${page.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pages.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-20 text-center text-gray-400 bg-gray-50/30">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <FileText size={24} className="text-gray-300" />
                                        </div>
                                        <p>No pages found. Create a new one!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="md:hidden space-y-4">
                {pages.map(page => (
                    <div key={page.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 leading-snug">{page.title}</h3>
                                <p className="text-xs text-gray-400 mt-1 font-mono truncate max-w-[200px]">{page.slug}</p>
                            </div>
                            <button
                                onClick={() => togglePublish(page.id, page.is_published)}
                                className={`flex-shrink-0 p-1.5 rounded-full ${page.is_published ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                            >
                                {page.is_published ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            </button>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                            <a
                                href={`http://localhost:8000/${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Eye size={16} /> View
                            </a>
                            <Link to={`${page.id}/edit`} className="flex-1 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(page.id)}
                                className="flex-1 py-2 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
