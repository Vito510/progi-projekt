import './FrontPage.css';
import type TrackDescriptor from '../../interfaces/TrackDescriptor';
import TrackList from '../track/TrackList';
import Footer from '../general/Footer';
import Header from '../general/Header';
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
            <Header>
                <ButtonNewTrack></ButtonNewTrack>
                {auth.user ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}
            </Header>
            <main className='front-page'>
                <div className="banner"></div>
                <h1>Najbolje staze</h1>
                <TrackList tracks={tracks}/>
            </main>
            <Footer></Footer>
        </>
    );
};