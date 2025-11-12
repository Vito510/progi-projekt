// import { useEffect } from "react";
import { useState, type ReactNode } from "react";
import type MapSelection from "../../interfaces/MapSelection";
import AppFooter from "../general/AppFooter";
import AppHeader from "../general/AppHeader";
import Map2D from "../map/Map2D";
import Map3D from "../map/Map3D";
import MapLoading from "../map/MapLoading";
import "./MapPage.css";
// import * as Image from '../../scripts/utility/image';
import * as Tile from "../../scripts/utility/tile";
import { useAuth } from "../../context/AuthContext";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignIn from "../profile/ButtonSignIn";

export default function MapPage() {
	let [element, setElement] = useState<ReactNode>(<Map2D onInput={handler}/>);
	// const [element, setElement] = useState<ReactNode>(<MapLoading>{`Fetching 5 tiles...`}</MapLoading>);
	const auth = useAuth();

	async function handler(selection: MapSelection) {
		setElement(<MapLoading>{`Fetching ${Tile.getTileCount(selection)} tiles...`}</MapLoading>);
		// console.info("Selection:", selection);

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
			<AppHeader>
				{auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}
			</AppHeader>
			<main className="map-page">{element}</main>
			<AppFooter />
		</>
	);
}
