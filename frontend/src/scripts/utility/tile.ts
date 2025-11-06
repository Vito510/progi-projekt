import type MapSelectionDescriptor from '../../interfaces/MapSelection.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import * as Image from './image.js';
import pako from 'pako';

const elevation_offset = 32768;
const tile_resolution = 3601;
const display_resolution = 512;
// const save_resolution = 512;
const pixel_size = 30.91;
const max_tiles = 4;

export function isValidSelection({min_latitude, min_longitude, max_latitude, max_longitude}: MapSelectionDescriptor) {
    if (Math.abs(min_longitude) > 180 || Math.abs(min_latitude) > 90 || Math.abs(max_longitude) > 180 || Math.abs(max_latitude) > 90)
        return false;
    if (max_longitude < min_longitude)
        [min_longitude, max_longitude] = [max_longitude, min_longitude];
    if (max_latitude < min_latitude)
        [min_latitude, max_latitude] = [max_latitude, min_latitude];

    const width_tiles = Math.ceil(max_longitude) - Math.floor(min_longitude);
    const height_tiles = Math.ceil(max_latitude) - Math.floor(min_latitude);
    return (width_tiles * height_tiles) <= max_tiles;
}

function encodeHeight(height: number): Image.Pixel {
    const r = (height >> 8) & 0xFF;
    const g = height & 0xFF;
    const b = 0;
    const a = 255;
    return {r: r, g: g, b: b, a: a};
}

function decodeHeight(color: Image.Pixel): number {
    return color.r * 256.0 + color.g;
}

function getUrl(latitude: number, longitude: number) {
    const lat_hemisphere = (latitude >= 0) ? 'N' : 'S';
    const lon_hemisphere = (longitude >= 0) ? 'E' : 'W';
    
    const lat_tile = Math.abs(Math.floor(latitude));
    const lon_tile = Math.abs(Math.floor(longitude));

    const url = `https://s3.amazonaws.com/elevation-tiles-prod/skadi/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}${lon_hemisphere}${lon_tile.toString().padStart(3, '0')}.hgt.gz`
    return url;
}

export async function fetchTile(longitude: number, latitude: number) {
    console.log("Fetching: ", latitude, longitude);
    const url = getUrl(latitude, longitude);
    const compressed_data = await (await fetch(url)).arrayBuffer();
    const decompressed_data = pako.inflate(new Uint8Array(compressed_data));
    const data_view = new DataView(decompressed_data.buffer);
    const image = new ImageData(tile_resolution, tile_resolution);

    for (let y = 0; y < tile_resolution; y++) {
        for (let x = 0; x < tile_resolution; x++) {
            const offset = (x * tile_resolution + y) * 2;
            let height = data_view.getInt16(offset, false) + elevation_offset;
            if (height == 0)
                height = elevation_offset;
            const pixel = encodeHeight(height);
            Image.set(image, x, y, pixel)
        }
    }
    
    return image;
}

async function getTileSet(selection: MapSelectionDescriptor): Promise<ImageData[][]> {
    if (!isValidSelection(selection))
        throw Error("Invalid coordinates or maximum ammount of tiles exceeded!");

    let counter = 0;
    let tiles = [];
    for (let y = Math.floor(selection.min_latitude); y < Math.ceil(selection.max_latitude); y++) {
        let tile_row = [];
        for (let x = Math.floor(selection.min_longitude); x < Math.ceil(selection.max_longitude); x++) {
            if (counter > max_tiles)
                throw new Error("Maximum ammount of tiles exceeded!");
            const tile = await fetchTile(x, y);
            console.log("Pushing tile: ", tile);
            tile_row.push(tile);
            counter += 1;
        }
        console.log("Pushing row: ", tile_row);
        tiles.push(tile_row);
    }

    console.log("Tiles: ", tiles);
    return tiles;
}

function combineTiles(tiles: ImageData[][]): ImageData {
    const horizontal: ImageData[] = tiles.map((images) => Image.stitch(images, "horizontal"));
    const vertical: ImageData = Image.stitch(horizontal, "vertical");
    return vertical;
}

function cropToSelection(image: ImageData, selection: MapSelectionDescriptor): ImageData {
    console.log(selection);
    console.log(image.width, image.height);
    
    const x = (selection.min_longitude - Math.floor(selection.min_longitude)) * tile_resolution;
    const y = (selection.min_latitude - Math.floor(selection.min_latitude)) * tile_resolution;
    const width = (selection.max_longitude - Math.floor(selection.min_longitude)) * tile_resolution - x;
    const height = (selection.max_latitude - Math.floor(selection.min_latitude)) * tile_resolution - y;
    console.log(x, y, width, height);
    const cropped = Image.crop(image, x, y, width, height);
    return cropped;
}

export function getParams(image: ImageData, scale : number = 1.0): TerrainParameter {
    let min = Infinity;
    let max = -Infinity;
    Image.iterate(image, (value) => {
        const height = decodeHeight(value);
        min = Math.min(min, height);
        max = Math.max(max, height);
        return undefined;
    });

    return {
        heightmap: image,
        range: (max - min) / (pixel_size * scale),
        multiplier: 1.0 / (pixel_size * scale),
        offset: -min,
    }
}

export async function getData(selection: MapSelectionDescriptor) {
    if (selection.max_longitude < selection.min_longitude)
        [selection.min_longitude, selection.max_longitude] = [selection.max_longitude, selection.min_longitude];
    if (selection.max_latitude < selection.min_latitude)
        [selection.min_latitude, selection.max_latitude] = [selection.max_latitude, selection.min_latitude];

    const tiles = await getTileSet(selection);
    let combined = combineTiles(tiles);
    if (selection.min_latitude != selection.max_latitude && selection.min_longitude != selection.max_longitude)
        combined = cropToSelection(combined, selection);
    const resized = Image.resize(combined, display_resolution, display_resolution);
    const image = resized;

    return getParams(image, (combined.width / resized.width));
}

