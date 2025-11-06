// import { useEffect } from "react";
import type MapSelectionDescriptor from "../../interfaces/MapSelectionDescriptor";
import Footer from "../general/Footer";
import Header from "../general/Header";
import Map2D from "../map2d/Map2D";
import ButtonSignOut from "../profile/ButtonProfile";
import "./MapPage.css";

export default function MapPage() {
  // useEffect(() => {
  //     const script = document.createElement("script");
  //     script.src = "/public/scripts/mapper/engine.js";
  //     script.defer = true;
  //     script.type = "module";
  //     document.body.appendChild(script);
  // }, [])

  return (
    <>
      <Header>
        <ButtonSignOut></ButtonSignOut>
      </Header>
      <main className="map-page">
        <Map2D
          onInput={(selection: MapSelectionDescriptor) => {
            console.log(selection);
          }}
        />
      </main>
      <Footer />
    </>
  );
}
