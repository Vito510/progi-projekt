import './FrontPage.css';
import type Track from '../../interfaces/Track';
import TrackList from '../track/TrackList';
import AppFooter from '../general/AppFooter';
import AppHeader from '../general/AppHeader';
import ButtonProfile from '../profile/ButtonProfile';
import ButtonSignIn from '../profile/ButtonSignIn';
import { useAuth } from '../../context/AuthContext';
import ButtonNewTrack from '../track/ButtonNewTrack';
import ProfileSearch from '../profile/ProfileSearch';
import AppBody from '../general/AppBody';
import { useState } from "react";
import { useEffect } from "react";

export default function FrontPage() {
    const auth = useAuth();
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        fetch('/api/track/top')
            .then(res => res.json())
            .then(data => {
                const mapped: Track[] = data.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    owner: t.owner,
                    date_created: new Date(),
                    visibility: t.visibility === 'PUBLIC' ? 'Public' : 'Private',
                    stars: Number(t.stars),
                    min_lat: t.minLat ?? t.min_lat,
                    min_lon: t.minLon ?? t.min_lon,
                    max_lat: t.maxLat ?? t.max_lat,
                    max_lon: t.maxLon ?? t.max_lon,
                    points: [],
                    whitelist: [],
                }));
                setTracks(mapped);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <AppHeader>
                <ProfileSearch></ProfileSearch>
                <ButtonNewTrack></ButtonNewTrack>
                {auth.user?.authenticated ? <ButtonProfile></ButtonProfile> : <ButtonSignIn></ButtonSignIn>}
            </AppHeader>
            <AppBody width='thin'>
                <div className='-front-page'>
                    <div className="banner"></div>
                    <h1>Najbolje staze</h1>
                    <TrackList tracks={tracks}/>
                </div>
            </AppBody>
            <AppFooter/>
        </>
    );
};

// DEBUG
function getDebugTracks(): Track[] {
    let tracks: Track[] = [];
    for (let i=0; i<10; i++) {
        let track: Track = {
            name: (Math.random()).toFixed(Math.random() * 20),
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