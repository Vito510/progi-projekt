import './FrontPage.css';
import type Track from '../../interfaces/Track';
import TrackList from '../track/TrackList';
import AppFooter from '../general/AppFooter';
import AppHeader from '../general/AppHeader';
import ButtonProfile from '../profile/ButtonProfile';
import ButtonSignIn from '../profile/ButtonSignIn';
import { useAuth } from '../../context/AuthContext';
import ButtonNewTrack from '../track/ButtonNewTrack';

export default function FrontPage() {
    const auth = useAuth();


    // TEMP stvaranje rute za debug
    let route: Track = {
        name: "Naziv staze",
        stars: 101,
        visibility: 'Private',
        owner: "Naziv vlasnika",
        date_created: new Date(2018, 11, 24, 10, 33, 30, 0),
        id: 0,
        max_lat: 0,
        max_lon: 0,
        min_lat: 0,
        min_lon: 0,
        points: [],
    }
    let tracks: [Track] = [route];
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