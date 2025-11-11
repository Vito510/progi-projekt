import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../general/Button";
import Header from "../general/Header";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import './LoginSuccessPage.css';
import { Link } from "react-router-dom";

export default function LoginSuccessPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  let card: ReactNode;
  if (loading) {
    card = (
      <div className="card">
          <header>
            <h1>Učitavanje...</h1>
          </header>
      </div>
    );
  } else {
    card = (
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
    );
  }

  return (
    <>
      <Header></Header>
      <main className="login-success-page">
          {card}
      </main>
    </>
  );
}