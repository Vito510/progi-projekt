import { useState, type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileInfo.css';
import List from '../general/List';
import Button from '../general/Button';
import Popup from '../general/Popup';
import Card from '../general/Card';

export default function ProfileInfo() {
    const auth = useAuth();
    const [popup, setPopup] = useState<ReactNode | null>(null);
    const same_profile: boolean = true // dodati provjeru jel trenutni profil koji se ucita naš profil ili tuđi
    const [error_message, setErrorMessage] = useState<string | null>(null);

    const input_handler = () => { // provjeri jel unesen dobar username
        setErrorMessage("Neispravno ime, pokušajte ponovno.");
    }

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
                            <input type="text" placeholder="Unesite korisničko ime"/>
                            <List type='row' gap='small' align='center'>
                                <Button type='primary' onClick={input_handler}>
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
                        <p>Jeste li sigurni da želite obrisati svoji profil?</p>
                        <List type='row' gap='small' align='center'>
                            <Button type='tertiary'>
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

    const profile_buttons = <>
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

    return (
        <div className="-profile-info">
            <h2>{auth.user?.name ? auth.user.name : "Naziv profila"}</h2>
            <p>{auth.user?.email ? auth.user.email : "email.adresa@email.com"}</p>
            {same_profile && profile_buttons}
            {popup}
        </div>
    );
}