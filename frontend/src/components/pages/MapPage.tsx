// import { useEffect } from "react";
import { useState, type ReactNode } from "react";
import type MapSelection from "../../interfaces/MapSelection";
import Footer from "../general/Footer";
import Header from "../general/Header";
import Map2D from "../map2d/Map2D";
import Map3D from "../map3d/Map3D";
import "./MapPage.css";
// import * as Image from '../../scripts/utility/image';
import * as Tile from "../../scripts/utility/tile";
import { useAuth } from "../../context/AuthContext";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignIn from "../profile/ButtonSignIn";

export default function MapPage() {
	let [element, setElement] = useState<ReactNode>(<Map2D onInput={handler} />);
	const auth = useAuth();

	async function handler(selection: MapSelection) {
		// console.info("Selection:", selection);

		// korištenje temp.png
		// console.info("Fetching disabled, using temp.png");
		// const image = await Image.load("/images/temp.png");
		// const params = Tile.getParams(image, 3601 / 512);

		// korištenje pravih podataka iz odabrane točke
		const params = await Tile.getData(selection);
		// Image.save(params.heightmap, "test");

		setElement(<Map3D params={params}></Map3D>);
	}

	return (
		<>
			<Header>
				{auth.user ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}
			</Header>
			<main className="map-page">{element}</main>
			<Footer />
		</>
	);
}
