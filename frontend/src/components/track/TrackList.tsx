import type Track from "../../interfaces/Track";
import TrackCard from "./TrackCard";
import "./TrackList.css";
import { generateChartData, calculateSlopeDistance } from './TrackUtils.js';

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
          length={calculateSlopeDistance(generateChartData(track))}
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
