// import { useEffect } from "react";
import type MapSelectionDescriptor from "../../interfaces/MapSelectionDescriptor";
import Footer from "../general/Footer";
import Header from "../general/Header";
import Map2D from "../map2d/Map2D";
import ButtonSignOut from "../profile/ButtonProfile";
import "./MapPage.css";
// import * as Image from '../../utility/image';
// import * as Tile from '../../utility/tile';

export default function MapPage() {

  async function handler(selection: MapSelectionDescriptor) {
    console.log(selection);
    // const image = await Tile.fetchTile(selection.latitude, selection.longitude);
    // const data: any = await Tile.getData(selection);
    // console.log(data);
    // Image.save(data.image, "test.png");
  }

  return (
    <>
      <Header>
        <ButtonSignOut></ButtonSignOut>
      </Header>
      <main className="map-page">
        <Map2D onInput={handler}/>
      </main>
      <Footer />
    </>
  );
}
