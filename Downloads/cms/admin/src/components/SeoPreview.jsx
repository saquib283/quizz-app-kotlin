export default function SeoPreview({ title, description, slug }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">G</span>
                Search Preview
            </h3>
            <div className="font-sans max-w-[600px]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                        W
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-800 leading-none">Your Website Name</span>
                        <span className="text-xs text-gray-500 leading-none mt-0.5">https://your-website.com › blog › {slug || 'your-slug'}</span>
                    </div>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">
                    {title || 'Your Page Title'}
                </h3>
                <p className="text-sm text-[#4d5156] mt-1 leading-normal line-clamp-2">
                    {description || 'Please provide a meta description to see how this page will look in search engine results. Keeps it under 160 characters for best results.'}
                </p>
            </div>
        </div>
    );
}
