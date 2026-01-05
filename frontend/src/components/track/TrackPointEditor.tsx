import { useEffect, useState, type ReactNode } from "react";
import type TrackPoint from "../../interfaces/TrackPoint";
import Button from "../general/Button";
import './TrackPointEditor.css';

interface Props {
    points: TrackPoint[],
    onInput: (points: TrackPoint[]) => void,
}

export default function TrackPointEditor({points, onInput = () => {}}: Props) {
    const [listElement, setListElement] = useState<ReactNode | null>(null);

    function swap(array: TrackPoint[], index: number, increment: number) {
        const index_a = index;
        let index_b = (index - increment) % array.length;
        if (index_b < 0)
            index_b = array.length + index_b;
        [array[index_a], array[index_b]] = [array[index_b], array[index_a]];
        const new_aray = [...array];
        onInput(new_aray);
    }

    function remove(array: TrackPoint[], index: number) {
        array.splice(index, 1)
        const new_array = [...array];
        onInput(new_array);
    }

    useEffect(() => {
        setListElement(
            <>
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
            </>
        );
    }, [points]);

    return (
        <div className="-track-point-editor">
            {listElement}
        </div>
    );
}

