import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../general/AppHeader";
import Button from "../general/Button";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, login } = useAuth();

  return (
    <>
      <AppHeader />
      <main className="login-page">
          {user?.authenticated ? (
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Pozdrav, {user.name}!</h1>
                <p className="login-subtitle">Uspješno ste se prijavili u aplikaciju.</p>
              </div>
              <div className="login-body">
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
          ) : (
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Prijava</h1>
                <p className="login-subtitle">Prijavite se u svoji profil</p>
              </div>
              <div className="login-body">
                <button type="button" onClick={login} className="login-button">Login with Google</button>
              </div>
            </div>
          )}
      </main>
    </>
  );
}