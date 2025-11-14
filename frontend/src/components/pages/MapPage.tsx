// import { useEffect } from "react";
import { useState, type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
// import * as Image from '../../scripts/utility/image';
import * as Tile from "../../utility/tile";
import type MapSelection from "../../interfaces/MapSelection";
import AppFooter from "../general/AppFooter";
import AppHeader from "../general/AppHeader";
import Map2D from "../map/Map2D";
import Map3D from "../map/Map3D";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignIn from "../profile/ButtonSignIn";
import "./MapPage.css";
import Card from "../general/Card";

export default function MapPage() {
	const auth = useAuth();
	let [element, setElement] = useState<ReactNode>(<Map2D onInput={handler}/>);

	// loading screen test
	// const [element, setElement] = useState<ReactNode>(
	// 	<Card>
	// 		<header style={{ fontSize: "1.5rem" }}>
	// 			<i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
	// 			<span> Učitavanje reljefa</span>
	// 		</header>
	// 		<section>
	// 			<code>{`Dohvaćanje 5 regija`}</code>
	// 			<br></br>
	// 			<code>Moglo bi potrajati...</code>
	// 		</section>
	// 	</Card>
	// );

	// handler koji samo sprema sliku mape s prozora
	// async function handler(selection: MapSelection, mapImage?: ImageData) {
	// 	if (mapImage) Image.save(mapImage, "mapImage");
	// }

	async function handler(selection: MapSelection) {
		setElement((
			<Card>
				<header style={{ fontSize: "1.5rem" }}>
					<i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
					<span>Učitavanje reljefa</span>
				</header>
				<section>
					<code>{`Dohvaćanje ${Tile.getTileCount(selection)} regija/e`}</code>
					<br></br>
					<code>Moglo bi potrajati...</code>
				</section>
			</Card>
		));
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
			<main className="-map-page">
				{element}
			</main>
			<AppFooter />
		</>
	);
}
