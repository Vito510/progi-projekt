import { useEffect, useState } from "react";
import "./LoginPage.css";
import type User from "../../interfaces/User";

export default function LoginPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch("/me", { credentials: "include" })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    const handleOAuthLogin = () => {
        window.location.href = "/auth/google";
    };

    if (user) {
        return (
            <div className="login-card">
                <h1>Welcome, {user.name}</h1>
                <button onClick={() => window.location.href = "/logout"}>Logout</button>
            </div>
        );
    }

    return (
        <main className="login-page">
            <div className="login-card">
                <h1>Welcome</h1>
                <p className="login-subtitle">Login with your Google account</p>
                <button onClick={handleOAuthLogin} className="oauth-btn">
                    Login with Google
                </button>
            </div>
        </main>
    );
}
