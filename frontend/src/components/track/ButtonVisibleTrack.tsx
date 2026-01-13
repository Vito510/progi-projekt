import Button from "../general/Button";
import { useState } from "react";

interface Props {
    id: number;
}

export default function ButtonVisibleTrack({ id }: Props) {
    // ili prvo ucitaj je li vec visible
    const [isVisible, setIsVisible] = useState(false);

    const handleVisible = () => {
        // dodaj api da posalje visible ili ne ovisno o tome kakvo je trenutno stanje
        if (isVisible) {
            setIsVisible(false);
            console.log("Sakrio sam");
        } else {
            setIsVisible(true);
            console.log("Ucinio vidljivim")
        }
    };

    return (
        <Button type={`${isVisible ? 'secondary' : 'quaternary'}`} onClick={handleVisible}>
            <i className={`fa ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            <p>Vidljivost</p>
        </Button>
    );
}