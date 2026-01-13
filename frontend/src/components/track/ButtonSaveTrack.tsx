import Button from "../general/Button";
import type Track from "../../interfaces/Track";

interface Props {
    track: Track;
}

export default function ButtonSaveTrack({ track }: Props) {

    const handleSave = async () => {
        const payload = {
            id: track.id,
            name: track.name,
            owner: track.owner,
            date_created: track.date_created,
            visibility: track.visibility,
            min_lat: track.min_lat,
            min_lon: track.min_lon,
            max_lat: track.max_lat,
            max_lon: track.min_lon,
            whitelist: track.whitelist,
            points: track.points,
        }
        console.log("stvaram stazu " + JSON.stringify(payload))
        try {
            const response = await fetch(`/api/track`, {
                method: 'POST',
                credentials: "include", 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('nije uspio spremit');
            }

            console.log("Spremio stazu:", track.id);
            
        } catch (error) {
            console.error("Error:", error);
            // handler
        }

    };

    return (
        <Button type="primary" onClick={handleSave}>
            <i className="fa fa-save"></i>
            <p>Spremi</p>
        </Button>
    );
}