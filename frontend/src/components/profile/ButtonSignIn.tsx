import { Link } from "react-router-dom";
import Button from "../general/Button";

export default function ButtonSignIn() {
    return (
        <Link to={"/login"}>
            <Button>
                <i className="fa fa-sign-in fa-lg"></i>
                <p>Prijava</p>
            </Button>
        </Link>
    );
}