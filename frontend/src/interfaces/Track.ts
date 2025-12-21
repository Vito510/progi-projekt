import type TerrainParameter from "./TerrainParameter.ts";
import type TrackPoint from "./TrackPoint.ts";

export default interface Track {
    id: number,
    name: string,
    owner: string,
    date_created: Date,
    visibility: 'Private' | 'Public',
    stars: number,
    min_lat: number,
    min_lon: number,
    max_lat: number,
    max_lon: number,
    points: TrackPoint[],
    override?: TerrainParameter | null,
}

