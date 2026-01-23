import { useEffect, useRef, useState } from "react";
import Button from "../general/Button";
import type Track from "../../interfaces/Track";

interface Props {
    track: Track;
}

export default function ButtonCopyTrack({ track }: Props) {
    const [processing, setProcessing] = useState(false);
    const [failed, setFailed] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) 
                window.clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopyLink = async () => {
        const fullLink = `${window.location.origin}/track/${track.id}`; 

        try {
            if (track.id != -1) {
                await navigator.clipboard.writeText(fullLink);
                setProcessing(true);
                if (timeoutRef.current) 
                    window.clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => {setProcessing(false); setFailed(false)}, 1200);
            } else {
                setProcessing(true);
                setFailed(true);
                if (timeoutRef.current) 
                    window.clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => {setProcessing(false); setFailed(false)}, 1200);
            }
        } catch (err) {
            console.error("Ne mogu kopirati link:", err);
        }
    };

    return (
        <>
            {processing ? 
                <>
                    {failed ?
                        <Button type="quaternary" onClick={handleCopyLink} disabled>
                            <i className="fa fa-times"/>
                            <span>Spremi stazu</span>
                        </Button>
                    :
                        <Button type="secondary" onClick={handleCopyLink} disabled>
                            <i className="fa fa-check" />
                            <span>Kopirano</span>
                        </Button>
                    }
                </>
                :
                <Button type="secondary" onClick={handleCopyLink}>
                    <i className="fa fa-copy"/>
                    <span>Kopiraj link</span>
                </Button>
            }
        </>
    );
}
