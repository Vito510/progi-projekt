import type MapSelectionDescriptor from "../../interfaces/MapSelectionDescriptor";
import './Map2D.css';

interface Props {
    onInput: (selection: MapSelectionDescriptor) => void
}

export default function Map2D({onInput}: Props) {
    const temp: MapSelectionDescriptor = {
        latitude: 45.0,
        longitude: 15.0,
    }

    return (
        <div className="map-2d card" onClick={() => {onInput(temp)}}>
            <img src="/vectors/earth.svg" alt="" />
        </div>
    );

}