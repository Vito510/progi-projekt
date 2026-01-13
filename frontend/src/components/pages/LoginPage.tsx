import { useAuth } from "../../context/AuthContext";
import AppBody from "../general/AppBody";
import AppHeader from "../general/AppHeader";
import Button from "../general/Button";
import Card from "../general/Card";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <>
      <AppHeader />
      <AppBody centered noFooter>
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
      </AppBody>
    </>
  );
}