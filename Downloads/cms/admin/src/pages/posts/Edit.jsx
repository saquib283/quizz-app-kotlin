import { useParams } from 'react-router-dom';
import PostForm from './PostForm';
export default function Edit() {
    const { id } = useParams();
    return <PostForm id={id} />;
}
