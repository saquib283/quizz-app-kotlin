import { Routes, Route } from 'react-router-dom';
import List from './pages/List';
import Create from './pages/Create';
import Edit from './pages/Edit';

export default function Pages() {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="create" element={<Create />} />
            <Route path=":id/edit" element={<Edit />} />
        </Routes>
    );
}
