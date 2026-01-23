import type Track from "../../interfaces/Track";
import Button from "../general/Button";
import { useState, useEffect } from "react";
//import { useAuth } from "../../context/AuthContext";

interface Props {
    track: Track;
    updateStars: (id: number, isLiked: boolean) => void;
}

export default function ButtonLikeTrack({ track, updateStars}: Props) {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIsLiked = async () => {
            try {
                const res = await fetch(`/api/track/${track.id}/star`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch like status");
                const liked: boolean = await res.json();
                if (liked !== null) {
                    setIsLiked(liked);
                }
            } catch (err) {
                console.error("Error fetching like status:", err);
                //setLoading(true); // kao hint da se ne može dohvatiti status
            }
        };

        fetchIsLiked();
    }, [track.id]);

    const handleLike = async () => {
        if (loading) return;
        setLoading(true);

        const newState = !isLiked; // samo toggla trenutno stanje
        setIsLiked(newState);
        updateStars(track.id, newState); //track.stars += newState ? 1 : -1;
        console.log(newState ? "pokusavam likeat" : "pokusavam odlikeat");

        try {
            const res = await fetch(`/api/track/${track.id}/star`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken") || ""}`
                },
                body: JSON.stringify(newState)
            });

            if (!res.ok) {
                throw new Error("Failed to update like status");
            }

            const updated: boolean | null = await res.json();
            if (updated === null) {
                console.error("Track not found or user not logged in");
                // revert local state
                setIsLiked(!newState);
                updateStars(track.id, !newState); //track.stars += newState ? -1 : 1;
            } else {
                setIsLiked(updated); // just to sync with backend
            }
        } catch (err) {
            console.error("Error updating like:", err);
            // revert local state
            setIsLiked(!newState);
            updateStars(track.id, !newState); //track.stars += newState ? -1 : 1;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type={isLiked ? "quaternary" : "secondary"}
            onClick={handleLike}
            disabled={loading}
        >
            <i className="fa fa-star"></i>
            <p>{loading ? "..." : isLiked ? "Ocjenjeno" : "Ocjeni"}</p>
        </Button>
    );
}