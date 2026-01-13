import "./Map2D.css";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type MapSelection from "../../interfaces/MapSelection";
import Leaflet from "leaflet";
import TileUtils from "../../utility/tile_utils";
import html2canvas from "html2canvas";
import Card from "../general/Card";

interface Props {
	// onInput: (selection: MapSelection) => void | Promise<void>;
	onInput: (selection: MapSelection, mapImage?: ImageData) => void | Promise<void>;
}

export default function Map2D({ onInput }: Props) {
	useEffect(() => {
		// Initialize map
		const map = Leaflet.map("map", {
			center: [45, 16],
			zoom: 6,
		});

		const baseMaps = {
			OpenStreetMap: Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}),

			Satelite: Leaflet.tileLayer("https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png", {
				maxZoom: 19,
				attribution: "&copy; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
			}),

			"National Geographic": Leaflet.tileLayer("https://server.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", {
				maxZoom: 12,
				attribution: "&copy;  National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.",
			}),
		};

		const layerControl = Leaflet.control.layers(baseMaps).addTo(map);
		baseMaps["OpenStreetMap"].addTo(map);

		// dodavanje watercolor layera
		const watercolor = Leaflet.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg", {
			maxZoom: 16,
			attribution:
				'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
		});
		layerControl.addBaseLayer(watercolor, "<span style='color: red'>Watercolor</span>");

		const coordButton = Leaflet.Control.extend({
			options: { position: "topright" }, // position of the button
			onAdd: function (map: any) {
				const container = Leaflet.DomUtil.create("button", "coord-button");
				container.textContent = "Pre veliko područje (zumirajte)";
				container.disabled = true;

				// Prevent map dragging when clicking the button
				Leaflet.DomEvent.disableClickPropagation(container);

				// get selection from current view
				const getSelection = () => {
					const bounds = map.getBounds();
					const selection: MapSelection = {
						min_latitude: bounds.getSouth(),
						min_longitude: bounds.getWest(),
						max_latitude: bounds.getNorth(),
						max_longitude: bounds.getEast(),
					};
					return selection;
				};

				// Update button enabled/disabled on zoom
				const updateButtonState = () => {
					// const valid = map.getZoom() >= 11;
					const valid = TileUtils.isValidSelection(getSelection());
					container.disabled = !valid;
					container.textContent = valid ? "Odaberi područje" : "Pre veliko područje (zumirajte)";
				};

				map.on("zoom", updateButtonState);
				map.on("drag", updateButtonState);

				container.onclick = async () => {
					const selection = getSelection();
					// onInput(selection); // Trigger the prop callback

					// ovdje uzima sliku cijelog prozora
					try {
						// Capture the map element
						const mapElement = document.getElementById("map");
						if (!mapElement) {
							console.error("Map element not found");
							onInput(selection);
							return;
						}

						const canvas = await html2canvas(mapElement, {
							useCORS: true,
							allowTaint: true,
							logging: false,
						});

						// Extract ImageData from canvas
						const ctx = canvas.getContext("2d");
						if (ctx) {
							const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
							onInput(selection, imageData);
						} else {
							console.error("Could not get canvas context");
							onInput(selection);
						}
					} catch (err) {
						console.error("Error capturing map:", err);
						onInput(selection);
					}
				};

				return container;
			},
		});

		map.addControl(new coordButton());

		return () => {
			map.remove();
		};
	}, [onInput]);

	return (
		<div className="-map-2d">
			<Card>
				<header>
					<em>
						Odabirete površinu navigacijom karte i klikom na gumb. Prozor karte označava cijelu odabranu površinu.
					</em>
				</header>
				<div id="map"></div>
			</Card>
		</div>
	);
}
