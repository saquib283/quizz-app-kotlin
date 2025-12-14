import { useParams } from 'react-router-dom';
import PageForm from './PageForm';
export default function Edit() {
    const { id } = useParams();
    return <PageForm id={id} />;
}
