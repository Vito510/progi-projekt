import { useState, type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileInfo.css';
import List from '../general/List';
import Button from '../general/Button';
import Popup from '../general/Popup';
import Card from '../general/Card';
import type User from '../../interfaces/User';

interface ProfileInfoProps {
    profile: User;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
    const auth = useAuth();
    const isOwnProfile = auth.user?.name === profile.name;

    
    const [popup, setPopup] = useState<ReactNode | null>(null);
    const [error_message, setErrorMessage] = useState<string | null>(null);
    const [newUsername, setNewUsername] = useState("");

    const save_handler = async () => {
        if (!isOwnProfile) return;

        if (!newUsername.trim()) {
            setErrorMessage("Unesite korisničko ime.");
            return;
        }

        try {
            const response = await fetch(`/api/profile/${profile.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`
                },
                body: JSON.stringify({ username: newUsername.trim() })
            });

            if (response.ok) {
                const data = await response.json();

                auth.setUser({
                    ...auth.user!,
                    name: data.username
                });

                close_popup();

                /*const updatedUser = await fetch('/api/profile/me', {
                    headers: di da {
                        'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`
                    }
                }).then(res => res.json());

                console.log('Profile updated', updatedUser);

                close_popup();*/
            } else if (response.status === 409) {
                setErrorMessage("Korisničko ime je zauzeto.");
            } else {
                setErrorMessage("Nešto je pošlo po zlu. Pokušajte ponovno.");
            }
        } catch (error) {
            console.error("Error editing profile:", error);
            setErrorMessage("Nešto je pošlo po zlu. Pokušajte ponovno.");
        }
    };


    const delete_handler = async () => {
        if (!isOwnProfile) return;

        try {
            const response = await fetch(`/api/profile/${profile.name}`, {
                method: 'DELETE',
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`,
                },
            });

            if (response.ok) {
                console.log('Profile deleted');

                // log out + redirect
                sessionStorage.removeItem("authToken");
                window.location.href = "/";
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };


    const close_popup = () => {
        setPopup(null)
    }

    const popup_edit_profile = () => {
        setPopup(
            <Popup>
                <Card>
                    <header>
                        <h2>Uređivanje profila</h2>
                        <em>Odaberite novo korisiničko ime za vaš profil.</em>
                    </header>
                    <List type='column' gap='medium'>
                        <List type='row' gap='large' align='center' wrap>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Unesite korisničko ime"
                            />
                            <List type='row' gap='small' align='center'>
                                <Button type='primary' onClick={save_handler}>
                                    <i className='fa fa-check'></i>
                                    Spremi
                                </Button>
                                <Button type='tertiary' onClick={close_popup}>
                                    <i className='fa fa-times'></i>
                                    Odustani
                                </Button>
                            </List>
                        </List>
                        {error_message && <p className='error'>{error_message}</p>}
                    </List>
                </Card>
            </Popup>
        );
    }

    const popup_delete_profile = () => {
        setPopup(
            <Popup>
                <Card>
                    <header>
                        <h2>Brisanje profila</h2>
                        <em>Ako obrišete profil, izbrisati će se sve vaše staze!</em>
                    </header>
                    <List type='row' gap='large' align='center' wrap>
                        <p>Jeste li sigurni da želite obrisati svoj profil?</p>
                        <List type='row' gap='small' align='center'>
                            <Button type='tertiary' onClick={delete_handler}>
                                <i className='fa fa-trash'></i>
                                Obriši
                            </Button>
                            <Button type='secondary' onClick={close_popup}>
                                <i className='fa fa-times'></i>
                                Odustani
                            </Button>
                        </List>
                    </List>
                </Card>
            </Popup>
        );
    }

    return (
        <div className="-profile-info">
            {/* <h2>{auth.user?.name ? auth.user.name : "Naziv profila"}</h2>
            <p>{auth.user?.email ? auth.user.email : "email.adresa@email.com"}</p> */}
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            {isOwnProfile && 
                <>
                    <List type='row' gap='small' wrap>
                        <Button onClick={popup_edit_profile}>
                            <i className='fa fa-cog'></i>
                            Uredi profil
                        </Button>
                        <Button onClick={popup_delete_profile}>
                            <i className='fa fa-trash'></i>
                            Izbriši profil
                        </Button>
                    </List>
                </>
            }
            {popup}
        </div>
    );
}