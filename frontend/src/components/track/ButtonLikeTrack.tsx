import type Track from "../../interfaces/Track";
import Button from "../general/Button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Props {
    track: Track;
}

export default function ButtonLikeTrack({ track }: Props) {
    // const { user } = useAuth(); //već je u TrackEditoru
    // const canLike = user?.authenticated && !(track.owner === user.name);
    const [isLiked, setIsLiked] = useState(false); // trebalo bi se nekako saznat je li ovaj korisnik od prije likeao

    const handleLike = () => {
        if (isLiked) {
            setIsLiked(false);
            track.stars-- // i/ili preko api poziva
            console.log("Odlajkao sam");
        } else {
            setIsLiked(true);
            track.stars++
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