import './ProfilePage.css';
import type Track from '../../interfaces/Track';
import AppHeader from '../general/AppHeader';
import AppFooter from '../general/AppFooter';
import TrackList from '../track/TrackList';
import ButtonSignOut from '../profile/ButtonSignOut';
import TrackListStats from '../track/TrackListStats';
import ProfileInfo from '../profile/ProfileInfo';
import ButtonNewTrack from '../track/ButtonNewTrack';
import Card from '../general/Card';
import AppBody from '../general/AppBody';

export default function ProfilePage() {


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
    let tracks: Track[] = [];
    for (let i=0; i<10; i++)
        tracks.push(route);


    return (
        <>
            <AppHeader>
                <ButtonNewTrack></ButtonNewTrack>
                <ButtonSignOut></ButtonSignOut>
            </AppHeader>
            <AppBody width='thin'>
                <div className='-profile-page'>
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
                        <h1>Korisničke staze</h1>
                        <TrackList tracks={tracks}/>
                    </menu>
                </div>
            </AppBody>
            <AppFooter/>
        </>
    );
}