import type TrackListDescriptor from "../../interfaces/TrackListDescriptor";
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
          latitude={track.latitude}
          longitude={track.longitude}
          length={track.length}
          stars={track.stars}
          visibility={track.visibility}
        />
      ))}
    </ul>
  );
}
