
export default interface RouteDescriptor {
    name: string,
    longitude: number,
    latitude: number,
    length: number,
    stars: number,
    visibility: 'Private' | 'Public',
}

