import Button from "../general/Button";
import type Track from "../../interfaces/Track";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import Placeholder from "../general/Placeholder.js";
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext.js";

interface Props {
    track: Track;
}

export default function ButtonSaveTrack({ track }: Props) {
    const auth = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        if (!auth.user?.authenticated) {
            setErrorMessage("Ne možete spremiti stazu ako niste ulogirani!");
            return;
        }

        const payload = {
            id: track.id,
            name: track.name,
            ownerName: track.owner,
            dateCreated: track.date_created,
            visibility: track.visibility=="Private" ? "PRIVATE" : "PUBLIC",
            //visibility: track.visibility=="Private" ? 1 : 0, // moze ili brojevi ili slova sve veliko
            minLat: track.min_lat,
            minLon: track.min_lon,
            maxLat: track.max_lat,
            maxLon: track.max_lon,
            whitelist: track.whitelist,
            points: track.points,
        }
        // console.log("stvaram stazu ", payload)
        setLoading(true);

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
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result === false) {
                throw new Error("Niste prijavljeni.");
            }

            console.log("Spremio stazu");
            setSuccess(true);
            setTimeout(() => {setSuccess(false);}, 2000);
        } catch (error) {
            // console.error("Error:", error);
            setErrorMessage(error instanceof Error ? error.message : 'Nepoznata greška');
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Button type="primary" onClick={handleSave} disabled={loading || success}>
                {loading ? (
                    <i className="fa fa-spinner fa-pulse"></i>
                ) : success ? (
                    <i className="fa fa-check"></i>
                ) : (
                    <i className="fa fa-save"></i>
                )}
                <p>{loading ? 'Spremam...' : success ? 'Spremljeno!' : 'Spremi'}</p>
            </Button>

            {errorMessage && 
                <Popup>
                    <Card>
                        <header>
                            <h2>Nije uspjelo spremanje staze</h2>
                        </header>
                        <section>
                            <Placeholder>
                                <p>{errorMessage}</p>
                            </Placeholder>
                        </section>
                        <footer>
                            <List type='row' gap='medium' align='center'>
                                <Button type='secondary' onClick={() => setErrorMessage(null)}>
                                    <i className='fa fa-times'></i>
                                    <p>OK</p>
                                </Button>
                            </List>
                        </footer>
                    </Card>
                </Popup>
            }
        </>
    );
}