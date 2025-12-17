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
          length={track.length}
          stars={track.stars}
          visibility={track.visibility}
          id={index}
          owner="Naziv vlasnika"
          date={new Date(2022, 11, 24, 10, 33, 30, 0)}
        />
      ))}
    </ul>
  );
}
