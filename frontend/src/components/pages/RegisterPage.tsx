import { useEffect, useState } from "react";
import AppHeader from "../general/AppHeader";
import './RegisterPage.css';
import Button from "../general/Button";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      console.log("Found user token:", token);
      sessionStorage.setItem("authToken", token);
    }
  }, []);

  const handleConfirm = async () => {
    setError("");
    if (!username.trim()) {
      setError("Molimo unesite korisničko ime.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/check-username?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.exists) {
        setError("Korisničko ime već postoji. Odaberite drugo.");
      } else {
        // You can proceed with registration or navigation here
        console.log("Kreiram novi profil")
        const res = await fetch(`/create-user?username=${encodeURIComponent(username)}`, { 
          credentials: "include", 
          headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}` } 
        }); 
        if (!res.ok) {
          throw new Error("Server error");
        }

        window.location.href = "/"
        

      }
    } catch (err) {
      console.error("Error checking username:", err);
      setError("Došlo je do pogreške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="-register-page">
        <div className="card">
          <header>
            <h1>Pozdrav,</h1>
          </header>

          <section>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Odaberite korisničko ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="dark-button"
              />
            {error && <p className="error-text">{error}</p>}
            </div>

            <Button
              onClick={handleConfirm}
            >
              {loading ? "Provjera..." : "Potvrdi"}
            </Button>

          </section>
        </div>
      </main>
    </>
  );
}
