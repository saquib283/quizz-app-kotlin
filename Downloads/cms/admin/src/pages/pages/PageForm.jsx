import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PageForm({ id }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        is_published: false
    });
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            api.get(`/pages/${id}`).then(({ data }) => {
                const page = data.data || data;
                setFormData({
                    title: page.title,
                    slug: page.slug || '',
                    content: page.content || '',
                    is_published: !!page.is_published
                });
                setLoading(false);
            }).catch(() => {
                alert('Failed to load page');
                navigate('/pages');
            });
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/pages/${id}`, formData);
            } else {
                await api.post('/pages', formData);
            }
            navigate('/pages');
        } catch (error) {
            alert('Failed to save: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Edit Page' : 'Create New Page'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                            placeholder="Page Title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-20 resize-none"
                            value={formData.meta_description || ''}
                            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                            placeholder="Brief description for search engines..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="page-slug"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="h-64 mb-12">
                        <textarea
                            className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.is_published}
                        onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700Select">Publish immediately</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => navigate('/pages')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
                        {id ? 'Update Page' : 'Create Page'}
                    </button>
                </div>
            </form>
        </div>
    );
}
