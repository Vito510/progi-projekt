import Button from "../general/Button";
import { useState } from "react";

interface Props {
    id: number;
}

export default function ButtonLikeTrack({ id }: Props) {
    // ili prvo ucitaj je li vec likeano
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        // dodaj api da posalje like ili ne ovisno o tome kakvo je trenutno stanje
        if (isLiked) {
            setIsLiked(false);
            console.log("Odlajkao sam");
        } else {
            setIsLiked(true);
            console.log("Lajkao sam")
        }
    };

    return (
        <>
            {isLiked ?
                <Button type="quaternary" onClick={handleLike}>
                    <i className="fa fa-star"></i>
                    <p>Ocjenjeno</p>
                </Button>
                :
                <Button type="secondary" onClick={handleLike}>
                    <i className="fa fa-star"></i>
                    <p>Ocjeni</p>
                </Button>
            }
        </>
    );
}