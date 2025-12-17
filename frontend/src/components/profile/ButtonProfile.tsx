import Button from "../general/Button";
import { useAuth } from "../../context/AuthContext";

export default function ButtonProfile() {
    const auth = useAuth();

    return (
        <Button link="/profile">
            <i className="fa fa-user fa-lg"></i>
            <p>{auth.user?.authenticated ? auth.user.name : "Profil"}</p>
        </Button>
    );
}