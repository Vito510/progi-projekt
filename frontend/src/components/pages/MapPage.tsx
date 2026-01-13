import "./MapPage.css";
import { useState, type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
// import ImageUtils from '../../utility/image_utils';
import TileUtils from "../../utility/tile_utils";
import type MapSelection from "../../interfaces/MapSelection";
import AppFooter from "../general/AppFooter";
import AppHeader from "../general/AppHeader";
import Map2D from "../map/Map2D";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignIn from "../profile/ButtonSignIn";
import Card from "../general/Card";
// import Button from "../general/Button";
import type Track from "../../interfaces/Track";
import TrackEditor from "../track/TrackEditor";
// import type TrackPoint from "../../interfaces/TrackPoint";
import AppBody from "../general/AppBody";

export default function MapPage() {
	const auth = useAuth();
	let [element, setElement] = useState<ReactNode>(
		<>
			<Map2D onInput={handler}/>
			{/* <Button onClick={dev_handler}>[DEBUG] Skip map</Button> */}
		</>
	);

	// DEBUG handler koji samo sprema sliku mape s prozora
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
					<code>{`Dohvaćanje ${TileUtils.getTileCount(selection)} regija/e`}</code>
					<br></br>
					<code>Moglo bi potrajati...</code>
				</section>
			</Card>
		));

		const params = await TileUtils.getData(selection);
		const track: Track = {
			name: "Naziv staze",
			stars: 101,
			visibility: 'Private',
			owner: "Naziv vlasnika",
			date_created: new Date(2018, 11, 24, 10, 33, 30, 0),
			id: 0,
			max_lat: 0,
			max_lon: 0,
			min_lat: 0,
			min_lon: 0,
			points: [],
			override: params,
        	whitelist: [],
		}
		setElement(<TrackEditor track={track}></TrackEditor>);
	}

	// async function dev_handler() { // DEBUG
	// 	const image = await ImageUtils.load("/images/temp3.png");
	// 	const params = TileUtils.getParams(image);
	// 	const points: TrackPoint[] = [];
	// 	for (let i=0; i<20; i++) {
	// 		points.push({
	// 			x: Math.random(),
	// 			y: Math.random(),
	// 			z: Math.random() * 100,
	// 		});
	// 	}
	// 	const track: Track = {
	// 		name: "Naziv staze",
	// 		stars: 101,
	// 		visibility: 'Private',
	// 		owner: "Naziv vlasnika",
	// 		date_created: new Date(2018, 11, 24, 10, 33, 30, 0),
	// 		id: 0,
	// 		max_lat: 0,
	// 		max_lon: 0,
	// 		min_lat: 0,
	// 		min_lon: 0,
	// 		points: points,
	// 		override: params,
    //     	whitelist: [],
	// 	}
	// 	setElement(<TrackEditor track={track}></TrackEditor>);
	// }

	return (
		<>
			<AppHeader>{auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}</AppHeader>
			<AppBody width="wide">
				<div className="-map-page">
					{element}
				</div>
			</AppBody>
			<AppFooter />
		</>
	);
}
