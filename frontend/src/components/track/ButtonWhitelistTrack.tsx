import Button from "../general/Button";
import List from '../general/List.js';
import Card from '../general/Card.js';
import Popup from '../general/Popup.js';
import { useState } from "react";
import type Track from "../../interfaces/Track.js";

interface Props {
    track: Track;
}

export default function ButtonWhitelistTrack({ track }: Props) {
    const [editList, setEditList] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [tempWhitelist, setTempWhitelist] = useState<string[]>([...track.whitelist]);

    const handleAddUser = () => {
        if (searchInput.trim() && !tempWhitelist.includes(searchInput.trim())) {
            setTempWhitelist([...tempWhitelist, searchInput.trim()]);
            setSearchInput("");
        }
    };

    const handleRemoveUser = (username: string) => {
        setTempWhitelist(tempWhitelist.filter(user => user !== username));
    };

    return (
        <>
            <Button type='secondary' onClick={() => {setEditList(true)}}>
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
                            <List type="column" gap="medium">
                                <div className="-profile-search">
                                    <input 
                                        type="text" 
                                        value={searchInput} 
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                                        placeholder="Unesi profil..."
                                    />
                                    <Button shape="round" type="primary" onClick={handleAddUser}>
                                        <i className="fa fa-user-plus fa-lg"></i>
                                    </Button>
                                </div>

                                {tempWhitelist.length === 0 ? 
                                    <em>Nema korisnika na whitelisti</em>
                                    : 
                                    <List type='column' gap='small'>
                                        {tempWhitelist.map((username, index) => (
                                            <div key={index}>
                                                <List type='row' gap='medium' align='center'>
                                                    <Button shape="round" type="tertiary" onClick={() => handleRemoveUser(username)}>
                                                        <i className="fa fa-user-times"></i>
                                                    </Button>
                                                    <p>{username}</p>
                                                </List>
                                            </div>
                                        ))}
                                    </List>
                                }
                                
                            </List>
                        </section>
                        <footer>
                            <List type='row' gap='medium' align='center'>
                                <Button type='secondary' onClick={() => {setTempWhitelist([...track.whitelist]); setEditList(false);}}>
                                    <i className='fa fa-times'></i>
                                    <p>Odustani</p>
                                </Button>
                                <Button type='primary' onClick={() => {track.whitelist = [...tempWhitelist]; setEditList(false);}}>
                                    <i className='fa fa-check'></i>
                                    <p>Potvrdi</p>
                                </Button>
                            </List>
                        </footer>
                    </Card>
                </Popup>
            }
        </>
    );
}