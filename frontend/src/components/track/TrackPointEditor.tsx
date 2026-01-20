import { useRef, useState } from "react";
import type TrackPoint from "../../interfaces/TrackPoint";
import Button from "../general/Button";
import './TrackPointEditor.css';
import ImageUtils from "../../utility/image_utils";
import TileUtils from "../../utility/tile_utils";
import MapPointPlacer from "../map/MapPointPlacer";

interface Props {
    points: TrackPoint[],
    onInput: (points: TrackPoint[]) => void,
    onPreview: (point: TrackPoint | null) => void,
    heightmap: ImageData,
}

export default function TrackPointEditor({points, onInput, onPreview, heightmap}: Props) {
    const [usePreview, setUsePreview] = useState<boolean>(false);
    const input_x_ref = useRef<HTMLInputElement>(null);
    const input_y_ref = useRef<HTMLInputElement>(null);

    function swap(array: TrackPoint[], index: number, increment: number): void {
        const index_a = index;
        let index_b = (index - increment) % array.length;
        if (index_b < 0)
            index_b = array.length + index_b;
        [array[index_a], array[index_b]] = [array[index_b], array[index_a]];
        const new_aray = [...array];
        onInput(new_aray);
    }

    function remove(array: TrackPoint[], index: number): void {
        array.splice(index, 1)
        const new_array = [...array];
        onInput(new_array);
    }

    function add(array: TrackPoint[], point: TrackPoint): void {
        if (array.length > 0) {
            const top = array[array.length - 1];
            if (point.x === top.x && point.y === top.y && point.z === top.z)
                return;
        }
        array.push(point);
        const new_array = [...array];
        onInput(new_array);
    }

    function updatePreview(): void {
        if (usePreview)
            onPreview(getPoint())
        else
            onPreview(null)
    }

    function togglePreview(): void {
        if (!usePreview)
            onPreview(getPoint())
        else
            onPreview(null)
        setUsePreview(!usePreview);
    }

    function getPoint(): TrackPoint {
        const x = 1.0 - parseInt(input_x_ref.current!.value) / 100.0;
        const y = 1.0 - parseInt(input_y_ref.current!.value) / 100.0;
        const z = TileUtils.decodeHeight(ImageUtils.get(heightmap, (1.0 - x) * heightmap.width, y * heightmap.height)) - 32768;
        return {
            x: x,
            y: y,
            z: z,
        }
    }

    return (
        <div className="-track-point-editor">
            <main>
                <MapPointPlacer heightmap={heightmap} points={points} onInput={(point) => {add(points, point)}}></MapPointPlacer>
            </main>
            <aside>
                {points.map((value, index) => 
                    <li key={index}>
                        <samp>({value.x.toFixed(2)},{value.y.toFixed(2)},{Math.round(value.z)})</samp>
                        <Button shape="round" type="primary" onClick={() => swap(points, index, 1)}>
                            <i className="fa fa-chevron-up"></i>
                        </Button>
                        <Button shape="round" type="primary" onClick={() => swap(points, index, -1)}>
                            <i className="fa fa-chevron-down"></i>
                        </Button>
                        <Button shape="square" type="tertiary" onClick={() => remove(points, index)}>
                            <i className="fa fa-trash"></i>
                        </Button>
                    </li>)
                }
            </aside>
        </div>
    );
}

