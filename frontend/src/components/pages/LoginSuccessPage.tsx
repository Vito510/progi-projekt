import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../general/Button";
import AppHeader from "../general/AppHeader";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import './LoginSuccessPage.css';

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
      <main className="login-success-page">
        <div className="card">
          <header>
            <h1>Pozdrav, {user?.name}!</h1>
            <p>Uspješno ste se prijavili u aplikaciju.</p>
          </header>

          <section>
            <Link to={"/"}>
              <Button>
                <p>Glavna stranica</p>
                <i className="fa fa-home fa-lg"></i>
              </Button>
            </Link>
            <ButtonProfile></ButtonProfile>
            <ButtonSignOut></ButtonSignOut>
          </section>
        </div>
      </main>
    </>
  );
}