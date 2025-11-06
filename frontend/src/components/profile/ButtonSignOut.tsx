import { Link } from "react-router-dom";
import Button from "../general/Button";

export default function ButtonSignOut() {
    return (
        <Link to={"/"}>
            <Button>
                <p>Odjava</p>
                <i className="fa fa-sign-out fa-lg"></i>
            </Button>
        </Link>
    );
}