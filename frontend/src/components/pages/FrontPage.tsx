import './FrontPage.css';
import type TrackDescriptor from '../../interfaces/Track';
import TrackList from '../track/TrackList';
import AppFooter from '../general/AppFooter';
import AppHeader from '../general/AppHeader';
import ButtonProfile from '../profile/ButtonProfile';
import ButtonSignIn from '../profile/ButtonSignIn';
import { useAuth } from '../../context/AuthContext';
import ButtonNewTrack from '../track/ButtonNewTrack';

export default function FrontPage() {
    const auth = useAuth();

    let route: TrackDescriptor = {
        name: "Naziv staze",
        longitude: 45.79,
        latitude: 15.96,
        length: 13,
        stars: 101,
        visibility: 'Private'
    }
    let tracks: [TrackDescriptor] = [route];
    for (let i=0; i<10; i++)
        tracks.push(route);

    return (
        <>
            <AppHeader>
                <ButtonNewTrack></ButtonNewTrack>
                {auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}
            </AppHeader>
            <main className='-front-page'>
                <div className="banner"></div>
                <h1>Najbolje staze</h1>
                <TrackList tracks={tracks}/>
            </main>
            <AppFooter/>
        </>
    );
};