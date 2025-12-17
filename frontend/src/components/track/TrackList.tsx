import type TrackListDescriptor from "../../interfaces/TrackList";
import TrackCard from "./TrackCard";
import "./TrackList.css";

export default function TrackList({ tracks }: TrackListDescriptor) {
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
