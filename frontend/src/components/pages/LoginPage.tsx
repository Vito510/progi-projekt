import { useAuth } from "../../context/AuthContext";
import AppHeader from "../general/AppHeader";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <AppHeader />
      <main className="login-page">
        <div className="login-card">
          {user ? (
            <>
              <h1>Pozdrav, {user.name}!</h1>
              <p>Uspješno ste se prijavili u aplikaciju.</p>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <div className="login-text">
                <h1>Welcome</h1>
                <p className="login-subtitle">Login with your Google account</p>
              </div>
              <div className="login-button">
                <button onClick={login} className="oauth-btn">
                  Login with Google
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}