import { Routes, Route } from 'react-router-dom';
import List from './posts/List';
import Create from './posts/Create';
import Edit from './posts/Edit';

export default function Posts() {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="create" element={<Create />} />
            <Route path=":id/edit" element={<Edit />} />
        </Routes>
    );
}
