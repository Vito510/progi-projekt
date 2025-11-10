import './ProfilePage.css';
import type TrackDescriptor from '../../interfaces/TrackDescriptor';
import Header from '../general/Header';
import Footer from '../general/Footer';
import TrackList from '../track/TrackList';
import ButtonSignOut from '../profile/ButtonSignOut';
import TrackListStats from '../track/TrackListStats';
import ProfileInfo from '../profile/ProfileInfo';
import ButtonNewTrack from '../track/ButtonNewTrack';

export default function ProfilePage() {
        let track: TrackDescriptor = {
            name: "Naziv staze",
            longitude: 45.79,
            latitude: 15.96,
            length: 13,
            stars: 101,
            visibility: 'Private'
        }
        let tracks: TrackDescriptor[] = [];
        for (let i=0; i<10; i++)
            tracks.push(track);

    return (
        <>
            <Header>
                <ButtonNewTrack></ButtonNewTrack>
                <ButtonSignOut></ButtonSignOut>
            </Header>
            <main className='profile-page'>
                <aside>
                    <ProfileInfo></ProfileInfo>
                    <hr/>
                    <TrackListStats tracks={tracks}></TrackListStats>
                </aside>
                <menu>
                    <h1>Korisničke staze</h1>
                    <TrackList tracks={tracks}/>
                </menu>
            </main>
            <Footer/>
        </>
    );
}