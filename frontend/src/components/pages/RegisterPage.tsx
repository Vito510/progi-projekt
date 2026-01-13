import { useEffect, useState } from "react";
import AppHeader from "../general/AppHeader";
import './RegisterPage.css';
import Button from "../general/Button";
import Card from "../general/Card";
import AppBody from "../general/AppBody";
import List from "../general/List";

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
      <AppHeader/>
      <AppBody centered noFooter>
        <div className="-register-page">
          <Card>
            <header>
              <h2>Registracija</h2>
            </header>
            <section>
              <List type="column" gap="medium">
                <List type="row" gap="medium" wrap align="center">
                  <input
                    type="text"
                    placeholder="Odaberite korisničko ime"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Button onClick={handleConfirm}>
                    {loading ? "Provjera..." : "Potvrdi"}
                  </Button>
                </List>
                {error && <p className="error-text">{error}</p>}
              </List>
            </section>
          </Card>
        </div>
      </AppBody>
    </>
  );
}
