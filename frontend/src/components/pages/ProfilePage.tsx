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
import ButtonProfile from '../profile/ButtonProfile';
import { useAuth } from '../../context/AuthContext';


export default function ProfilePage() {
    const { name: paramName } = useParams<{ name: string }>();
    const auth = useAuth(); // ne diraj ovo...MK
    const [tracks, setTracks] = useState<Track[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
   
    if (!paramName) {
        return <p>Nešto ne valja.</p>;
    }

    const name = paramName;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch profile info by username
                const profileRes = await fetch(`/api/profile/${name}`);
                if (!profileRes.ok) throw new Error(`${profileRes.status} HTTP error! (fetching profile data) status: ${profileRes.statusText}`);
                
                // const profileData = await profileRes.json();
                const text = await profileRes.text();

                if (!text /*profileData === null*/) {
                    // 200 OK, ali response je null
                    throw new Error("Korisnik ne postoji ili nije dopušten pristup");
                }

                const profileData = JSON.parse(text);

                setProfile({
                    name: profileData.username,
                    email: profileData.email
                });
                setIsOwnProfile(auth.user?.name === profileData.username);

                const trackRes = await fetch(`/api/profile/${name}/tracks`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("authToken") || ""}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!trackRes.ok) throw new Error(`${profileRes.status} HTTP error! (fetching profile tracks) status: ${profileRes.statusText}`);
                const data: Track[] = await trackRes.json();
                setTracks(data);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [name, auth.user]);

    if (loading) {
        return (
            <>
                <AppHeader />
                <AppBody width="thin">
                    <Card>
                        <p>Učitavanje profila...</p>
                    </Card>
                </AppBody>
                <AppFooter />
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppHeader />
                <AppBody width="thin">
                    <Card>
                        <h1>Profil nije pronađen</h1>
                        <p>{error}</p>
                    </Card>
                </AppBody>
                <AppFooter />
            </>
        );
    }
    return(
        <>
            <AppHeader>
                <ButtonNewTrack></ButtonNewTrack>
                {isOwnProfile ? <ButtonSignOut></ButtonSignOut> : <ButtonProfile></ButtonProfile>}
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