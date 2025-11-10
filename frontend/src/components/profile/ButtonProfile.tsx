import { Link } from "react-router-dom";
import Button from "../general/Button";
import { useAuth } from "../../context/AuthContext";

export default function ButtonSignOut() {
    const auth = useAuth();

    return (
        <Link to={"/profile"}>
            <Button>
                <p>{auth.user ? auth.user.name : "Profil"}</p>
                <i className="fa fa-user fa-lg"></i>
            </Button>
        </Link>
    );
}