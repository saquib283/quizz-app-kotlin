import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SeoPreview from '../../components/SeoPreview';

export default function PostForm({ id }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        image: '',
        is_published: false,
        meta_description: '',
        category_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(!!id);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/posts/${id}`).then(({ data }) => {
                const post = data.data || data;
                setFormData({
                    title: post.title,
                    slug: post.slug || '',
                    content: post.content || '',
                    image: post.image || '',
                    is_published: !!post.is_published,
                    meta_description: post.meta_description || '',
                    category_id: post.category_id || ''
                });
                setLoading(false);
            }).catch(() => {
                toast.error('Failed to load post');
                navigate('/posts');
            });
        }

        // Fetch Categories
        api.get('/categories').then(({ data }) => setCategories(data)).catch(console.error);
    }, [id, navigate]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image: `/storage/${data.path}` }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/posts/${id}`, formData);
                toast.success('Post updated successfully');
            } else {
                await api.post('/posts', formData);
                toast.success('Post created successfully');
            }
            navigate('/posts');
        } catch (error) {
            toast.error('Failed to save: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{id ? 'Edit Post' : 'Create Post'}</h2>
                    <p className="text-gray-500 mt-1">Craft your content and optimize for SEO.</p>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate('/posts')} className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-all shadow-sm">
                        Cancel
                    </button>
                    <button type="submit" form="post-form" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        {id ? 'Save Changes' : 'Publish Post'}
                    </button>
                </div>
            </div>

            <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input
                                className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                placeholder="Enter an engaging title..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                            <div className="prose-editor-wrapper border border-gray-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={v => setFormData({ ...formData, content: v })}
                                    className="bg-white min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
                        <p className="text-xs text-gray-400 mb-3">A short summary for search engines and social previews.</p>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24 resize-none leading-relaxed"
                            value={formData.meta_description || ''}
                            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                            placeholder="Write a compelling summary..."
                        />
                    </div>
                </div>


                <div className="space-y-6">

                    <SeoPreview
                        title={formData.title}
                        description={formData.meta_description}
                        slug={formData.slug}
                    />

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Organization</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                value={formData.category_id || ''}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Publishing</h3>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                            <input
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="post-slug"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-gray-700">Visibility</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Featured Image</h3>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative">
                            {formData.image ? (
                                <div className="space-y-3">
                                    <img
                                        src={formData.image.startsWith('http') ? formData.image : `http://localhost:8000${formData.image}`}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-lg shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium bg-red-50 px-3 py-1.5 rounded-full"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div className="py-6">
                                    <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${formData.image ? 'hidden' : ''}`}
                            />
                            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><span className="text-blue-600 font-medium animate-pulse">Uploading...</span></div>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
