import Button from "../general/Button";
import { useAuth } from "../../context/AuthContext";

export default function ButtonProfile() {
    const auth = useAuth();
    return (
        <>
            {auth.user?.authenticated ?
                <Button link={`/profile/${auth.user?.name}`}>
                    <i className="fa fa-user fa-lg"></i>
                    <p>{auth.user?.authenticated ? auth.user.name : "Profil"}</p>
                </Button>
                :
                <Button link="/login">
                    <i className="fa fa-sign-in fa-lg"></i>
                    <p>Prijava</p>
                </Button>
            }
        </>
    );
}