import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import Placeholder from '../general/Placeholder.js';
import { useState } from "react";

interface Props {
    id: number;
}

export default function ButtonSaveTrack({ id }: Props) {

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const handleConfirmDelete = async () => {
        console.log("Brisem stazu " + id)
        try {
            const response = await fetch(`/api/track/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Nemrem obrisat");
            }

            console.log("Obrisao", id);
            
        } catch (error) {
            console.error("Error:", error);
            // Handle error (show error message)
        } finally {
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
                                <Button type='secondary' onClick={handleCancel}>
                                    <i className='fa fa-times'></i>
                                    <p>Odustani</p>
                                </Button>
                                <Button type='primary' onClick={handleConfirmDelete}>
                                    <i className='fa fa-check'></i>
                                    <p>Potvrdi</p>
                                </Button>
                            </List>
                        </section>
                    </Card>
                </Popup>
            }
        </>
    );
}