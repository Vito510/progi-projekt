// import { useEffect } from "react";
import { useState, type ReactNode } from "react";
import type MapSelection from "../../interfaces/MapSelection";
import Footer from "../general/Footer";
import Header from "../general/Header";
import Map2D from "../map2d/Map2D";
import Map3D from "../map3d/Map3D";
import ButtonSignOut from "../profile/ButtonProfile";
import "./MapPage.css";
// import * as Image from '../../scripts/utility/image';
import * as Tile from '../../scripts/utility/tile';

export default function MapPage() {
  let [element, setElement] = useState<ReactNode>(<Map2D onInput={handler}/>);

  async function handler(selection: MapSelection) {
    console.info("Selection:", selection);
    
    // korištenje temp.png
    // console.info("Fetching disabled, using temp.png");
    // const image = await Image.load("/images/temp.png");
    // const params = Tile.getParams(image, 3601 / 512);
    
    // korištenje pravih podataka iz odabrane točke
    const params = await Tile.getData(selection);

    setElement(<Map3D params={params}></Map3D>);
  }

  return (
    <>
      <Header>
        <ButtonSignOut></ButtonSignOut>
      </Header>
      <main className="map-page">
        {element}
      </main>
      <Footer />
    </>
  );
}
