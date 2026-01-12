import Button from "../general/Button";
import type Track from "../../interfaces/Track";

interface Props {
    track: Track;
}

export default function ButtonSaveTrack({ track }: Props) {

    const handleSave = async () => {
        console.log("stvaram stazu " + track)
        try {
            const response = await fetch(`/api/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(track),
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