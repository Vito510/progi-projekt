import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import Placeholder from "../general/Placeholder.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    id: number;
}

export default function ButtonDeleteTrack({ id }: Props) {
    const navigate = useNavigate();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleConfirmDelete = async () => {
        console.log("Brisem stazu " + id)
        setLoading(true);

        try {
            const response = await fetch(`/api/track/${id}`, {
                method: 'DELETE',
                credentials: "include", 
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`
                },
            });

            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            console.log("Obrisao", id);
            navigate("/");
            
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error instanceof Error ? error.message : 'Nepoznata greška');
            
        } finally {
            setLoading(false);
            setDeleteConfirm(false);
        }
    };

    const handleCancel = () => {
        setDeleteConfirm(false);
    };

    return (
        <>
            <Button type="tertiary" onClick={() => setDeleteConfirm(true)}>
                <i className="fa fa-trash"></i>
                <p>Izbriši</p>
            </Button>

            {deleteConfirm && 
                <Popup>
                    <Card>
                        <header>
                            <h2>Želite li obrisati stazu?</h2>
                        </header>
                        <section>
                            <List type='row' gap='medium' align='center'>
                                <Button type='secondary' onClick={handleCancel} disabled={loading}>
                                    <i className='fa fa-times'></i>
                                    <p>Odustani</p>
                                </Button>
                                <Button type='primary' onClick={handleConfirmDelete} disabled={loading}>
                                    {loading ? (
                                        <i className="fa fa-spinner fa-pulse"></i>
                                    ) : (
                                        <i className='fa fa-check'></i>
                                    )}
                                    <p>{loading ? 'Brišem...' : 'Potvrdi'}</p>
                                </Button>
                            </List>
                        </section>
                    </Card>
                </Popup>
            }

            {errorMessage &&
                <Popup>
                    <Card>
                        <header>
                            <h2>Ne mogu obrisati stazu :(</h2>
                        </header>
                        <section>
                            <Placeholder>
                                <p>{errorMessage}</p>
                            </Placeholder>
                        </section>
                        <section>
                            <List type='row' gap='medium' align='center'>
                                <Button type='secondary' onClick={() => setErrorMessage(null)}>
                                    <i className='fa fa-times'></i>
                                    <p>OK</p>
                                </Button>
                            </List>
                        </section>
                    </Card>
                </Popup>
            }
        </>
    );
}