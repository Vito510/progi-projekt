import Button from "../general/Button";
import { useAuth } from "../../context/AuthContext";

export default function ButtonSignOut() {
    const auth = useAuth();

    return (
        <Button onClick={auth?.logout}>
            <p>Odjava</p>
            <i className="fa fa-sign-out fa-lg"></i>
        </Button>
    );
}