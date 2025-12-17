import Button from "../general/Button";

export default function ButtonSignIn() {
    return (
        <Button link="/login">
            <i className="fa fa-sign-in fa-lg"></i>
            <p>Prijava</p>
        </Button>
    );
}