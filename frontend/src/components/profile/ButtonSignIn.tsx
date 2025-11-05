import { Link } from "react-router-dom";
import Button from "../general/Button";

export default function ButtonSignIn() {
    return (
        <Link to={"/login"}>
            <Button>
                <p>Prijava</p>
                <i className="fa fa-sign-in fa-lg"></i>
            </Button>
        </Link>
    );
}