import type Track from '../interfaces/Track.tsx';

export function ParseTrack(data: any): Track {
    return {
        id: data.id,
        name: data.name,
        owner: data.ownerName,
        date_created: new Date(data.dateCreated),
        visibility: data.visibility === "PRIVATE" ? "Private" : "Public",
        stars: data.numOfStars,
        max_lat: data.maxLat,
        max_lon: data.maxLon,
        min_lat: data.minLat,
        min_lon: data.minLon,
        whitelist: data.whitelist,
        points: data.points,
    }
}

export function WriteTrack(track: Track): any {
    return {
        id: track.id,
        name: track.name,
        ownerName: track.name,
        dateCreated: track.date_created,
        visibility: track.visibility === "Private" ? "PRIVATE" : "PUBLIC",
        numOfStars: track.stars,
        maxLat: track.max_lat,
        maxLon: track.max_lon,
        minLat: track.min_lat,
        minLon: track.min_lon,
        whitelist: track.whitelist,
        points: track.points,
    }
}