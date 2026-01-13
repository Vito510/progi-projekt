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
          index={index}
          name={track.name}
          length={10} // iskoristiti util funkciju za racunanje duljine #23
          stars={track.stars}
          visibility={track.visibility}
          id={index}
          owner={track.owner}
          date={track.date_created}
        />
      ))}
    </ul>
  );
}
