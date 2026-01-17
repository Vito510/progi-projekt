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

export default function ProfilePage() {
    const { name: paramName } = useParams<{ name: string }>();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortType, setSortType] = useState<"name" | "stars" | null>(null);
   
    const name = paramName ?? "name";

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch(`/api/profile/${name}/tracks`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: Track[] = await res.json();
                setTracks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [name]);

    const sortByName = (tracks: Track[]) => {
        return tracks.slice().sort((a, b) => a.name.localeCompare(b.name));
    };

    const sortByStars = (tracks: Track[]) => {
        return tracks.slice().sort((a, b) => b.stars - a.stars);
    };

const sortedTracks =
    sortType === "name"
        ? sortByName(tracks)
        : sortType === "stars"
        ? sortByStars(tracks)
        : tracks;


    // TEMP stvaranje rute za debug
    /*let route: Track = {
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
        whitelist: [],
    }
    let tracks: Track[] = [];
    for (let i=0; i<10; i++)
        tracks.push(route);*/


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
                    <menu className="profile-sort-menu">
                    <button onClick={() => setSortType("name")}>
                        Sortiraj po imenu
                    </button>

                    <button onClick={() => setSortType("stars")}>
                        Sortiraj po zvjezdicama
                    </button>
                </menu>

                    <menu>
                        <h1>Korisničke staze</h1>
                        <TrackList tracks={sortedTracks}/>
                    </menu>
                </div>
            </AppBody>
            <AppFooter/>
        </>
    );
}