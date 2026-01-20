import { useState } from "react";
import type Track from "../../interfaces/Track";
import Button from "../general/Button";
import List from "../general/List";
import TrackCard from "./TrackCard";
import "./TrackList.css";

interface Props {
    tracks: Track[],
}

export default function TrackList({tracks}: Props) {
    const [sorted, setSorted] = useState<Track[]>(tracks);
    const [currentSort, setCurrentSort] = useState<String>("Unsorted");

    function ButtonNameSort() {
        if (currentSort === "NameAsc")
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => a.name.localeCompare(b.name))); setCurrentSort("NameDesc");}}>
                    <i className='fa fa-sort-desc'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
        else if (currentSort === "NameDesc") 
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => b.name.localeCompare(a.name))); setCurrentSort("NameAsc");}}>
                    <i className='fa fa-sort-asc'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
        else
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => b.name.localeCompare(a.name))); setCurrentSort("NameAsc");}}>
                    <i className='fa fa-sort'></i>
                    <i className='fa fa-font'></i>
                </Button>
            )
    }

    function ButtonStarSort() {
        if (currentSort === "StarAsc")
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => a.stars - b.stars)); setCurrentSort("StarDesc");}}>
                    <i className='fa fa-sort-desc'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
        else if (currentSort === "StarDesc") 
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => b.stars - a.stars)); setCurrentSort("StarAsc");}}>
                    <i className='fa fa-sort-asc'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
        else
            return (
                <Button onClick={() => {setSorted(tracks.slice().sort((a, b) => b.stars - a.stars)); setCurrentSort("StarAsc");}}>
                    <i className='fa fa-sort'></i>
                    <i className='fa fa-star'></i>
                </Button>
            )
    }

    return (
        <div className="-track-list">
            <header>
                <List type="row" gap='medium' align="center">
                    {ButtonNameSort()}
                    {ButtonStarSort()}
                </List>
            </header>
            <menu>
                {sorted.map((track, index) => (
                    <TrackCard key={index} track={track}/>
                ))}
                {sorted.length == 0 && 
                    <em>Nema staza</em>
                }
            </menu>
        </div>
    );
}
