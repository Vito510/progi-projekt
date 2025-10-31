import { Link } from "react-router-dom";
import Button from "./Button";

export default function ButtonSignOut() {
    return (
        <Link to={"/profile"}>
            <Button>
                <p>Profile</p>
                <i className="fa fa-user fa-lg"></i>
            </Button>
        </Link>
    );
}