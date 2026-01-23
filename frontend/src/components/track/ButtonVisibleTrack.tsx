import type Track from "../../interfaces/Track";
import Button from "../general/Button";
import { useState } from "react";

interface Props {
    track: Track;
}

export default function ButtonVisibleTrack({ track }: Props) {
    const [isVisible, setIsVisible] = useState(track.visibility === "Public");

    const handleVisible = () => {
        if (isVisible) {
            setIsVisible(false);
            track.visibility = "Private";
        } else {
            setIsVisible(true);
            track.visibility = "Public";
        }
    };

    return (
        <>
            {isVisible ?
                <Button type="quaternary" onClick={handleVisible}>
                    <i className={`fa fa-eye`}></i>
                    <p>Vidljivost</p>
                </Button>
                :
                <Button type="secondary" onClick={handleVisible}>
                    <i className={`fa fa-eye-slash`}></i>
                    <p>Vidljivost</p>
                </Button>
            }
        </>
    );
}