import { useState } from "react";
import type Track from "../../interfaces/Track";
import Button from "../general/Button";
import List from "../general/List";
import TrackCard from "./TrackCard";
import "./TrackList.css";

interface Props {
    tracks: Track[],
}

type SortType =
    | "Unsorted"
    | "NameAsc"
    | "NameDesc"
    | "StarAsc"
    | "StarDesc";

export default function TrackList({tracks}: Props) {
    const [currentSort, setCurrentSort] = useState<SortType>("Unsorted");
    const [trackList, setTrackList] = useState<Track[]>(tracks);

    const updateTrackStars = (id: number, isLiked: boolean) => {
        setTrackList(prev =>
            prev.map(track =>
                track.id === id
                    ? { ...track, stars: track.stars + (isLiked ? 1 : -1) }
                    : track
            )
        );
    };

    const sortedTracks = (() => {
        const copy = trackList.slice();

        switch (currentSort) {
            case "NameAsc":
                return copy.sort((a, b) => a.name.localeCompare(b.name));
            case "NameDesc":
                return copy.sort((a, b) => b.name.localeCompare(a.name));
            case "StarAsc":
                return copy.sort((a, b) => a.stars - b.stars);
            case "StarDesc":
                return copy.sort((a, b) => b.stars - a.stars);
            default:
                return copy;
        }
    })();

    function ButtonNameSort() {
        if (currentSort === "NameAsc")
            return (
                <Button onClick={() => {setCurrentSort("NameDesc");}}>
                    <i className='fa fa-sort-desc'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
        else if (currentSort === "NameDesc") 
            return (
                <Button onClick={() => {setCurrentSort("NameAsc");}}>
                    <i className='fa fa-sort-asc'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
        else
            return (
                <Button onClick={() => {setCurrentSort("NameAsc");}}>
                    <i className='fa fa-sort'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
    }

    function ButtonStarSort() {
        if (currentSort === "StarAsc")
            return (
                <Button onClick={() => {setCurrentSort("StarDesc");}}>
                    <i className='fa fa-sort-desc'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
        else if (currentSort === "StarDesc") 
            return (
                <Button onClick={() => {setCurrentSort("StarAsc");}}>
                    <i className='fa fa-sort-asc'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
        else
            return (
                <Button onClick={() => {setCurrentSort("StarAsc");}}>
                    <i className='fa fa-sort'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
    }

    return (
        <div className="-track-list">
            {sortedTracks.length == 0 ?
                <em>Nema staza</em>
                :
                <>
                    <header>
                        <List type="row" gap='medium' align="center">
                            {ButtonNameSort()}
                            {ButtonStarSort()}
                        </List>
                    </header>
                    <menu>
                        {sortedTracks.map((track, index) => (
                            <TrackCard key={index} track={track} updateStars={updateTrackStars}/>
                        ))}
                    </menu>
                </>
            }
        </div>
    );
}
