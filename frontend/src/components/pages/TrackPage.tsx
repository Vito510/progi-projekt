import "./NewTrackPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppFooter from "../general/AppFooter";
import AppHeader from "../general/AppHeader";
import ButtonProfile from "../profile/ButtonProfile";
import type Track from "../../interfaces/Track";
import TrackViewer from "../track/TrackViewer";
import AppBody from "../general/AppBody";
import Card from "../general/Card";

export default function TrackPage() {
    const { id } = useParams<{ id: string }>();

    const [track, setTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Neispravan ID staze.");
            setLoading(false);
            return;
        }

        const fetchTrack = async () => {
            try {
                const response = await fetch(`/api/track/${id}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`
                    }
                });


                if (!response.ok) {
                    throw new Error(`Greška pri dohvaćanju staze (${response.status})`);
                }

                const text = await response.text();


                if (!text) {
                    // backend returned null → empty body
                    throw new Error("Staza ne postoji ili nemate pristup.");
                }

                const data = JSON.parse(text);

                // mora jer backend i frontend imaju malo drukcije nazive varijabli
                const mappedTrack: Track = {
                    name: data.name,
                    stars: data.stars ?? 0,
                    visibility: data.visibility === "PRIVATE" ? "Private" : "Public",
                    owner: data.ownerName,
                    date_created: new Date(data.dateCreated),
                    id: data.id,
                    max_lat: data.maxLat,
                    max_lon: data.maxLon,
                    min_lat: data.minLat,
                    min_lon: data.minLon,
                    points: data.points ?? [],
                    override: null,
                    whitelist: data.whitelist ?? [],
                };

                setTrack(mappedTrack);

            } catch (err: any) {
                console.error("Error fetching track:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrack();
        
    }, [id]);

    if (loading) {
        return (
            <>
                <AppHeader>
                    <ButtonProfile />
                </AppHeader>
                <AppBody width="wide" padded>
                    <p>Učitavanje staze…</p>
                </AppBody>
                <AppFooter />
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppHeader>
                    <ButtonProfile />
                </AppHeader>
                <AppBody width="wide" padded>
                    <Card>
                        <h2>Staza nije dostupna</h2>
                        <p>{error}</p>
                    </Card>
                </AppBody>
                <AppFooter />
            </>
        );
    }

    return (
        <>
            <AppHeader>
                <ButtonProfile></ButtonProfile>
            </AppHeader>
            <AppBody width="wide" padded>
                {track ? <TrackViewer track={track}></TrackViewer> : "Backend ne radi"}
            </AppBody>
            <AppFooter />
        </>
    );
}