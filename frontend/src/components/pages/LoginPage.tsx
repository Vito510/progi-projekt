import { useAuth } from "../../context/AuthContext";
import Header from "../general/Header";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
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
              <h1>Welcome</h1>
              <p className="login-subtitle">Login with your Google account</p>
              <button onClick={login} className="oauth-btn">
                Login with Google
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}