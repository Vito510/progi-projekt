import './TrackEditor.css';
import type TrackPoint from "../../interfaces/TrackPoint";
import Button from "../general/Button";
import MapPointPlacer from "../map/MapPointPlacer";

interface Props {
    points: TrackPoint[],
    onInput: (points: TrackPoint[]) => void,
    heightmap: ImageData,
}

export default function TrackEditor({points, onInput, heightmap}: Props) {
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
            if (point.x === top.x && point.y === top.y && point.z === top.z) {
                onInput([...array]);
                return;
            }
        }
        array.push(point);
        const new_array = [...array];
        onInput(new_array);
    }

    return (
        <div className="-track-editor">
            <main>
                <MapPointPlacer heightmap={heightmap} points={points} onInput={(point) => {add(points, point)}}></MapPointPlacer>
            </main>
            <aside>
                <Button type="tertiary" onClick={() => {onInput([])}} wide>
                    <i className="fa fa-trash"></i>
                    <p>Izbriši sve točke</p>
                </Button>
                {points.map((value, index) => 
                    <li key={index}>
                        <em>{index+1}.</em>
                        <samp>{Math.round(value.z)}m</samp>
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

