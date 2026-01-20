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
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type User from '../../interfaces/User';


export default function ProfilePage() {
    const { name: paramName } = useParams<{ name: string }>();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   
    // const name = paramName ?? "name";
    // provjeri što raditi ako nije navedeno ime
    if (!paramName) {
        return <p>Nešto ne valja.</p>;
    }

    const name = paramName;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch profile info by username
                const profileRes = await fetch(`/api/profile/${name}`);
                if (!profileRes.ok) throw new Error(`HTTP error (fetching profile data) status: ${profileRes.status}`);
                const profileData = await profileRes.json();
                setProfile({
                    name: profileData.username,
                    email: profileData.email
                });


                const trackRes = await fetch(`/api/profile/${name}/tracks`);
                if (!trackRes.ok) throw new Error(`HTTP error! status (fetching profile tracks): ${trackRes.status}`);
                const data: Track[] = await trackRes.json();
                setTracks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [name]);

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
                                {profile && <ProfileInfo profile={profile}></ProfileInfo>}
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

// DEBUG
function getDebugTracks(): Track[] {
    let tracks: Track[] = [];
    for (let i=0; i<10; i++) {
        let track: Track = {
            name: (Math.random()).toFixed(Math.random() * 10),
            stars: Math.floor(Math.random() * 100),
            visibility: 'Private',
            owner: "Naziv vlasnika",
            date_created: new Date(2018, 11, 24, 10, 33, 30, 0),
            id: i,
            max_lat: 0,
            max_lon: 0,
            min_lat: 0,
            min_lon: 0,
            points: [],
            whitelist: [],
        }
        tracks.push(track);
    }
    return tracks;
}