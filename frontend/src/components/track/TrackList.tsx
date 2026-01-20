import type Track from "../../interfaces/Track";
import TrackCard from "./TrackCard";
import "./TrackList.css";

interface Props {
  tracks: Track[],
}

export default function TrackList({tracks}: Props) {
  return (
    <ul className="-track-list">
      {tracks.map((track, index) => (
        <TrackCard
          key={index}
          track={track}
        />
      ))}
    </ul>
  );
}
