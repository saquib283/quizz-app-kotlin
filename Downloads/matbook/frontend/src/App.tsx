import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { FormPage } from './pages/FormPage';
import { SubmissionsPage } from './pages/SubmissionPage';
import { LayoutDashboard, Plus, Hexagon } from 'lucide-react';
import clsx from 'clsx';

const queryClient = new QueryClient();

const NavBar = () => {
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-slate-900 text-white shadow-md"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        <Icon size={16} strokeWidth={2.5} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-900 p-1.5 rounded-lg text-white">
            <Hexagon size={20} fill="currentColor" className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">MatBook</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <NavLink to="/" icon={Plus} label="New Entry" />
          <NavLink to="/submissions" icon={LayoutDashboard} label="Dashboard" />
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
          <Toaster position="top-center" richColors theme="light" />
          <NavBar />
          <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 animate-in fade-in duration-500">
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;