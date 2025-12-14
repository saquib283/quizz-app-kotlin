import { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

export default function Media() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchMedia = async () => {
        try {
            const { data } = await api.get('/media');
            setFiles(data.data || data);
        } catch (error) {
            console.error('Failed to fetch media');
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMedia();
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            await api.delete(`/media/${id}`);
            fetchMedia();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Media Library</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map(file => (
                    <div key={file.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            {file.mime_type?.startsWith('image/') ? (
                                <img src={`${api.defaults.baseURL.replace('/api', '')}/storage/${file.path}`} alt={file.filename} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                                onClick={() => handleDelete(file.id)}
                                className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {file.filename}
                        </div>
                    </div>
                ))}
            </div>

            {files.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No media files found.
                </div>
            )}
        </div>
    );
}
