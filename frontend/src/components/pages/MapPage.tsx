// import { useEffect } from "react";
import { useState } from "react";
import type MapSelectionDescriptor from "../../interfaces/MapSelectionDescriptor";
import Footer from "../general/Footer";
import Header from "../general/Header";
import Map2D from "../map2d/Map2D";
import Map3D from "../map3d/Map3D";
import ButtonSignOut from "../profile/ButtonProfile";
import "./MapPage.css";
// import * as Image from '../../scripts/utility/image';
// import * as Tile from '../../scripts/utility/tile';

export default function MapPage() {
  let [mode, setMode] = useState<Boolean>(false);

  async function handler(selection: MapSelectionDescriptor) {
    console.info("Selection:", selection);
    console.info("Fetching disabled, using temp.png");
    setMode(true);
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
        {
          mode ?
          <Map3D></Map3D>
          :
          <Map2D onInput={handler}/>
        }
      </main>
      <Footer />
    </>
  );
}
