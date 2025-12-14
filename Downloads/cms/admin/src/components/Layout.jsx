import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Image as ImageIcon, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/posts', label: 'Blog Posts', icon: BookOpen },
        { path: '/pages', label: 'Static Pages', icon: FileText },
        { path: '/media', label: 'Media Library', icon: ImageIcon },
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-20 flex items-center justify-between px-8 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
                            C
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            CMS Admin
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'} transition-colors`} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <div className="absolute right-0 h-6 w-1 bg-white/20 rounded-l-full"></div>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                        <span className="ml-3 font-medium">Sign Out</span>
                    </button>
                </div>
            </div>


            <div className="flex-1 flex flex-col w-full min-w-0 bg-gray-50 h-full overflow-hidden">

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            <span className="text-gray-900 hidden sm:inline">Dashboard</span>
                            <span className="mx-2 hidden sm:inline">/</span>
                            <span className="capitalize">{location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </button>
                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm ring-2 ring-blue-50">
                                {user?.name ? user.name[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </main>
            </div>
            <Toaster position="top-right" />
        </div>
    );
}
