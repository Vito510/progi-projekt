import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import { useState } from "react";

interface Props {
    id: number;
}

export default function ButtonWhitelistTrack({ id }: Props) {

    const [editList, setEditList] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [whitelist, setWhitelist] = useState<string[]>([]);
    const [tempWhitelist, setTempWhitelist] = useState<string[]>([]);

    const handleOpenWhitelist = async () => {
        try {

            //pozovi da saznaš trenutnu listu
            // const response = await fetch(``);
            
            // if (!response.ok) {
            //     throw new Error("fail");
            // }

            //const data = await response.json();
            //const fetchedWhitelist = data.whitelist || [];
            
            //setWhitelist(fetchedWhitelist);
            //setTempWhitelist([...fetchedWhitelist]);
            setEditList(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {}
    };

    const handleAddUser = () => {
        if (searchInput.trim() && !tempWhitelist.includes(searchInput.trim())) {
            setTempWhitelist([...tempWhitelist, searchInput.trim()]);
            setSearchInput("");
        }
    };

    const handleRemoveUser = (username: string) => {
        setTempWhitelist(tempWhitelist.filter(user => user !== username));
    };

    const handleUpdateWhitelist = async () => {
        try {

            //posalji u backend ili samo spremi u track pa će se prenijet kad se savea
            // const response = await fetch(``, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ whitelist: tempWhitelist }),
            // });

            // if (!response.ok) {
            //     throw new Error("Failed, not ok");
            // }

            console.log("Whitelist spremljena:", id);
            setWhitelist([...tempWhitelist]);
            setEditList(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCancel = () => {
        setTempWhitelist([...whitelist]); //vrati original
        setEditList(false);
    };

    return (
        <>
            <Button type='secondary' onClick={handleOpenWhitelist}>
                <i className='fa fa-list'></i>
                <p>Whitelist</p>
            </Button>
            {editList && 
                <Popup>
                    <Card>
                        <header>
                            <h2>Profili koji su whitelistani</h2>
                        </header>
                        <section>
                            <div className="-profile-search">
                                <input 
                                    type="text" 
                                    value={searchInput} 
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                                    placeholder="Unesi profil..."
                                />
                                <Button shape="round" type="primary" onClick={handleAddUser}>
                                    <i className="fa fa-plus fa-lg"></i>
                                </Button>
                            </div>

                            <Card>
                                {tempWhitelist.length === 0 ? 
                                    <>
                                        <p style={{ textAlign: 'center', color: '#666' }}>Nema korisnika na whitelisti</p>
                                    </>
                                    : 
                                    <>
                                        <List type='column' gap='small'>
                                            {tempWhitelist.map((username, index) => (
                                                <div key={index}>
                                                    <List type='row' gap='medium' align='center'>
                                                        <Card>
                                                            <p>{username}</p>
                                                        </Card>
                                                        <Button shape="round" type="tertiary" onClick={() => handleRemoveUser(username)}>
                                                            <i className="fa fa-user-times"></i>
                                                        </Button>
                                                    </List>
                                                </div>
                                            ))}
                                        </List>
                                    </>
                                }
                            </Card>


                            <List type='row' gap='medium' align='center'>
                                <Button type='secondary' onClick={handleCancel}>
                                    <i className='fa fa-times'></i>
                                    <p>Odustani</p>
                                </Button>
                                <Button type='primary' onClick={handleUpdateWhitelist}>
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