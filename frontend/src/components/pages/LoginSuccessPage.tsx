import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../general/AppHeader";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import './LoginSuccessPage.css';
import ButtonHome from "../profile/ButtonHome";
import Card from "../general/Card";

export default function LoginSuccessPage() {
  const { user } = useAuth();
  
  useEffect(
    () => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
          console.log("Found user token:", token)
          sessionStorage.setItem("authToken", token);
        }
    }
  )

  return (
    <>
      <AppHeader/>
      <main className="-login-success-page">
        <Card>
          <header>
            <h2>Pozdrav, {user?.name}!</h2>
            <em>Uspješno ste se prijavili u aplikaciju.</em>
          </header>
          <section>
            <ButtonHome></ButtonHome>
            <ButtonProfile></ButtonProfile>
            <ButtonSignOut></ButtonSignOut>
          </section>
        </Card>
      </main>
    </>
  );
}