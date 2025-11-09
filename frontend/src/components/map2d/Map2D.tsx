import { useEffect } from "react";
import type MapSelection from "../../interfaces/MapSelection";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map2D.css";

interface Props {
	onInput: (selection: MapSelection) => void | Promise<void>;
}

export default function Map2D({ onInput }: Props) {
	useEffect(() => {
		// Initialize map
		const map = L.map("map", {
			center: [45, 16],
			zoom: 6,
		});

		const baseMaps = {
			OpenStreetMap: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}),

			Satelite: L.tileLayer("https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png", {
				maxZoom: 19,
				attribution: "&copy; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
			}),

			"National Geographic": L.tileLayer("https://server.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", {
				maxZoom: 12,
				attribution: "&copy;  National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.",
			}),
		};

		const layerControl = L.control.layers(baseMaps).addTo(map);
		baseMaps["OpenStreetMap"].addTo(map);

		// dodavanje watercolor layera
		const watercolor = L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg", {
			maxZoom: 16,
			attribution:
				'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
		});
		layerControl.addBaseLayer(watercolor, "<span style='color: red'>Watercolor</span>");

		const coordButton = L.Control.extend({
			options: { position: "topright" }, // position of the button
			onAdd: function (map: any) {
				const container = L.DomUtil.create("button", "coord-button");
				container.textContent = "Pre široko područje";
				container.disabled = true;

				// Prevent map dragging when clicking the button
				L.DomEvent.disableClickPropagation(container);

				// Update button enabled/disabled on zoom
				const updateButtonState = () => {
					const zoomedIn = map.getZoom() >= 11;
					container.disabled = !zoomedIn;
					container.textContent = zoomedIn ? "Označi područje" : "Pre široko područje";
				};

				map.on("zoom", updateButtonState);

				container.onclick = () => {
					const bounds = map.getBounds();
					const selection: MapSelection = {
						min_latitude: bounds.getSouth(),
						min_longitude: bounds.getWest(),
						max_latitude: bounds.getNorth(),
						max_longitude: bounds.getEast(),
					};
					onInput(selection); // Trigger the prop callback
				};

				return container;
			},
		});

		map.addControl(new coordButton());

		return () => {
			map.remove();
		};
	}, [onInput]);

	return <div id="map" className="map-2d" />;
}
