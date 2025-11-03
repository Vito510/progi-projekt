import { Link } from "react-router-dom";
import Button from "../general/Button";

export default function ButtonSignOut() {
    return (
        <Link to={"/profile"}>
            <Button>
                <p>Profil</p>
                <i className="fa fa-user fa-lg"></i>
            </Button>
        </Link>
    );
}