import { useAuth } from "../../context/AuthContext";
import Header from "../general/Header";
import "./LoginPage.css";

export default function LoginPage() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <p>Loading...</p>;
    console.log("User:", user);
  if (user) {
    return (
      <>
        <Header />
        <div className="login-card">
          <h1>Welcome, {user.name}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="login-page">
        <div className="login-card">
          <h1>Welcome</h1>
          <p className="login-subtitle">Login with your Google account</p>
          <button onClick={login} className="oauth-btn">
            Login with Google
          </button>
        </div>
      </main>
    </>
  );
}