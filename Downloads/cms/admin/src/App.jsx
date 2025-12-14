import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Pages from './pages/Pages';
import Media from './pages/Media';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="posts/*" element={<Posts />} />
                        <Route path="pages/*" element={<Pages />} />
                        <Route path="media" element={<Media />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
