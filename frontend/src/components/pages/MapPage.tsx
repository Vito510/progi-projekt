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

	// handler koji samo sprema sliku mape s prozora

	// async function handler(selection: MapSelection, mapImage?: ImageData) {
	// 	console.info("Selection:", selection);

	// 	// Save the map image if it exists
	// 	if (mapImage) {
	// 		// Create a canvas to convert ImageData to downloadable format
	// 		const canvas = document.createElement("canvas");
	// 		canvas.width = mapImage.width;
	// 		canvas.height = mapImage.height;
	// 		const ctx = canvas.getContext("2d");

	// 		if (ctx) {
	// 			ctx.putImageData(mapImage, 0, 0);

	// 			// Convert to blob and download
	// 			canvas.toBlob((blob) => {
	// 				if (blob) {
	// 					const url = URL.createObjectURL(blob);
	// 					const link = document.createElement("a");
	// 					link.href = url;
	// 					link.download = `map-capture-${Date.now()}.png`;
	// 					link.click();
	// 					URL.revokeObjectURL(url);
	// 				}
	// 			}, "image/png");
	// 		}
	// 	}
	// }

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
			<AppHeader>{auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}</AppHeader>
			<main className="map-page">{element}</main>
			<AppFooter />
		</>
	);
}
