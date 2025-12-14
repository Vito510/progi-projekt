import './ProfilePage.css';
import type TrackDescriptor from '../../interfaces/Track';
import AppHeader from '../general/AppHeader';
import AppFooter from '../general/AppFooter';
import TrackList from '../track/TrackList';
import ButtonSignOut from '../profile/ButtonSignOut';
import TrackListStats from '../track/TrackListStats';
import ProfileInfo from '../profile/ProfileInfo';
import ButtonNewTrack from '../track/ButtonNewTrack';
import Card from '../general/Card';

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
            <AppHeader>
                <ButtonNewTrack></ButtonNewTrack>
                <ButtonSignOut></ButtonSignOut>
            </AppHeader>
            <main className='-profile-page'>
                <aside>
                    <Card>
                        <header>
                            <ProfileInfo></ProfileInfo>
                        </header>
                        <hr/>
                        <section>
                            <TrackListStats tracks={tracks}></TrackListStats>
                        </section>
                    </Card>
                </aside>
                <menu>
                    <h2>Korisničke staze</h2>
                    <TrackList tracks={tracks}/>
                </menu>
            </main>
            <AppFooter/>
        </>
    );
}