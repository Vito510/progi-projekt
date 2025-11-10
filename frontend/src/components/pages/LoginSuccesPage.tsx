import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../general/Button";
import Header from "../general/Header";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import './LoginSuccessPage.css';

export default function LoginSuccessPage() {
  const { user } = useAuth();

  return (
    <>
      <Header/>
      <main className="login-success-page">
        <div className="card">
          <div className="text">
            <h1>Pozdrav, {user?.name}!</h1>
            <p>Uspješno ste se prijavili u aplikaciju.</p>
          </div>
          <div className="buttons">
            <Link to={"/"}>
              <Button>
                <p>Glavna stranica</p>
                <i className="fa fa-home fa-lg"></i>
              </Button>
            </Link>
            <ButtonProfile></ButtonProfile>
            <ButtonSignOut></ButtonSignOut>
          </div>
        </div>
      </main>
    </>
  );
}