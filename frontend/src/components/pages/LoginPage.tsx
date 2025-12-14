import { useAuth } from "../../context/AuthContext";
import AppHeader from "../general/AppHeader";
import Button from "../general/Button";
import Card from "../general/Card";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <>
      <AppHeader />
      <main className="-login-page">
        <Card>
          <header>
            <h2>Prijava</h2>
            <em>Prijavite se u svoji profil</em>
          </header>
          <section>
            <Button onClick={login} type="primary">
              Login with Google
            </Button>
          </section>
        </Card>
      </main>
    </>
  );
}