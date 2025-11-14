import { Link } from "react-router-dom";
import Button from "../general/Button";
import { useAuth } from "../../context/AuthContext";

export default function ButtonProfile() {
    const auth = useAuth();

    return (
        <Link to={"/profile"}>
            <Button>
                <i className="fa fa-user fa-lg"></i>
                <p>{auth.user?.authenticated ? auth.user.name : "Profil"}</p>
            </Button>
        </Link>
    );
}