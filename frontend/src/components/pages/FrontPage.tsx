import './FrontPage.css';
import type Track from '../../interfaces/Track';
import TrackList from '../track/TrackList';
import AppFooter from '../general/AppFooter';
import AppHeader from '../general/AppHeader';
import ButtonProfile from '../profile/ButtonProfile';
import ButtonNewTrack from '../track/ButtonNewTrack';
import ProfileSearch from '../profile/ProfileSearch';
import AppBody from '../general/AppBody';
import { useState } from "react";
import { useEffect } from "react";
import { ParseTrack } from '../../utility/TranslateTrack';

export default function FrontPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    useEffect(() => {
        fetch('/api/track/top')
            .then(res => res.json())
            .then(data => {
                const parsed: Track[] = data.map((d: any) => ParseTrack(d));
                setTracks(parsed);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <AppHeader>
                <ProfileSearch></ProfileSearch>
                <ButtonNewTrack></ButtonNewTrack>
                <ButtonProfile></ButtonProfile>
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
            id: i-1,
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