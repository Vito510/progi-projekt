import { useAuth } from "../../context/AuthContext";
import Header from "../general/Header";
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <>
      <Header></Header>
      <main className="login-page">
        <div className="login-card">

          <div className="login-header">
            <h1 className="login-title">Prijava</h1>
            <p className="login-subtitle">Prijavite se u svoji profil</p>
          </div>

          <div className="login-body">
            <button type="button" onClick={login} className="login-button">Login with Google</button>
          </div>

        </div>
      </main>
    </>
  );
}