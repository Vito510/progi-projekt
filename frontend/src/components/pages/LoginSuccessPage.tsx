import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../general/AppHeader";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignOut from "../profile/ButtonSignOut";
import ButtonHome from "../profile/ButtonHome";
import Card from "../general/Card";
import AppBody from "../general/AppBody";
import List from "../general/List";

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
      <AppBody centered noFooter>
          <Card>
            <header>
              <h2>Pozdrav, {user?.name}!</h2>
              <em>Uspješno ste se prijavili u aplikaciju.</em>
            </header>
            <List type="row" gap="small" wrap>
              <ButtonHome></ButtonHome>
              <ButtonProfile></ButtonProfile>
              <ButtonSignOut></ButtonSignOut>
            </List>
          </Card>
      </AppBody>
    </>
  );
}