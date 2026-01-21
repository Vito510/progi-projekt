import "./NewMapPage.css";
import { useState, type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import ImageUtils from '../../utility/image_utils';
import TileUtils from "../../utility/tile_utils";
import type MapSelection from "../../interfaces/MapSelection";
import AppFooter from "../general/AppFooter";
import AppHeader from "../general/AppHeader";
import MapSelector from "../map/MapSelector";
import ButtonProfile from "../profile/ButtonProfile";
import ButtonSignIn from "../profile/ButtonSignIn";
import Button from "../general/Button";
import type Track from "../../interfaces/Track";
import TrackEditor from "../track/TrackEditor";
import type TrackPoint from "../../interfaces/TrackPoint";
import AppBody from "../general/AppBody";
import Card from "../general/Card";
import List from "../general/List";

export default function MapPage() {
	const auth = useAuth();
	let [element, setElement] = useState<ReactNode>(
		<>
			<Card>
				<header>
					<List type="column" gap="small">
						<List align="center" justify="space-between" expand>
							<h2>Stvaranje nove rute</h2>
							<Button type="tertiary" shape="noshape" link="/">
								<i className="fa fa-times-circle fa-2x"></i>
							</Button>
						</List>
						<em>Odabirete površinu navigacijom karte i klikom na gumb. Prozor karte označava cijelu odabranu površinu.</em>
						<Button onClick={async () => {setElement(<TrackEditor track={await getDevTrack()}></TrackEditor>);}}>
							<samp><i className="fa fa-code"></i> [DEBUG]</samp>
							<p>Skip map</p>
						</Button>
					</List>
				</header>
				<section>
					<MapSelector onInput={handler}/>
				</section>
			</Card>
		</>
	);

	// DEBUG handler koji samo sprema sliku mape s prozora
	// async function handler(selection: MapSelection, mapImage?: ImageData) {
	// 	if (mapImage) Image.save(mapImage, "mapImage");
	// }

	async function handler(selection: MapSelection) {
		const track: Track = {
			name: "Naziv staze",
			stars: 0,
			visibility: 'Private',
			owner: "Naziv vlasnika", // postaviti na naziv korisnika
			date_created: new Date(2018, 11, 24, 10, 33, 30, 0), // postaviti na trenutni datum
			id: 0,
			max_lat: selection.max_latitude,
			max_lon: selection.max_longitude,
			min_lat: selection.min_latitude,
			min_lon: selection.min_longitude,
			points: [],
			override: null,
        	whitelist: ["petar", "grašo"], // trebalo bi biti prazno
		}
		setElement(<TrackEditor track={track}></TrackEditor>);
	}

	return (
		<>
			<AppHeader>{auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}</AppHeader>
			<AppBody width="wide">
				<div className="-new-map-page">
					{element}
				</div>
			</AppBody>
			<AppFooter />
		</>
	);
}

// DEBUG
async function getDevTrack(): Promise<Track> {
	const image = await ImageUtils.load("/images/temp3.png");
	const params = TileUtils.getParams(image);
	const points: TrackPoint[] = [];
	for (let i=0; i<20; i++) {
		points.push({
			x: Math.random(),
			y: Math.random(),
			z: Math.random() * 100,
		});
	}
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
		points: points,
		override: params,
		whitelist: [],
	}
	return track;
}