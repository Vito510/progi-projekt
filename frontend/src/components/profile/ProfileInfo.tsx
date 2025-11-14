import { useAuth } from '../../context/AuthContext';
import './ProfileInfo.css';

export default function ProfileInfo() {
    const auth = useAuth();
    
    return (
        <ul className="-profile-info">
            <li>
                <h2>{auth.user ? auth.user.name : "Naziv profila"}</h2>
            </li>
            <li>
                <p>{auth.user ? auth.user.email : "email.adresa@email.com"}</p>
            </li>
        </ul>
    );
}