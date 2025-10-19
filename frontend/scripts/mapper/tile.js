import * as Vector from './utility/vector.js';
import * as Image from './utility/image.js';

const max_tiles = 4;
// const tile_size = 1.0;
const pixel_size = 30.91;
const tile_resolution = 3601;
const elevation_offset = 32768;

export function isValidTileSet(min_lon, min_lat, max_lon, max_lat) {
    if (Math.abs(min_lon) > 180 || Math.abs(min_lat) > 90 || Math.abs(max_lon) > 180 || Math.abs(max_lat) > 90)
        return false;
    if (max_lon < min_lon)
        [min_lon, max_lon] = [max_lon, min_lon];
    if (max_lat < min_lat)
        [min_lat, max_lat] = [max_lat, min_lat];

    const width_tiles = Math.ceil(max_lon) - Math.floor(min_lon);
    const height_tiles = Math.ceil(max_lat) - Math.floor(min_lat);
    return (width_tiles * height_tiles) <= max_tiles;
}

function encodeHeight(height) {
    const r = (height >> 8) & 0xFF;
    const g = height & 0xFF;
    const b = 0;
    const a = 255;
    return Vector.vec(r, g, b, a);
}

function decodeHeight(color) {
    return color.x * 256.0 + color.y;
}

function getUrl(lat, lon) {
    const lat_hemisphere = (lat >= 0) ? 'N' : 'S';
    const lon_hemisphere = (lon >= 0) ? 'E' : 'W';
    
    const lat_tile = Math.abs(Math.floor(lat));
    const lon_tile = Math.abs(Math.floor(lon));

    const url = `https://s3.amazonaws.com/elevation-tiles-prod/skadi/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}${lon_hemisphere}${lon_tile.toString().padStart(3, '0')}.hgt.gz`
    return url;
}

export async function fetchTile(lat, lon) {
    console.log("Fetching: ", lat, lon);
    const url = getUrl(lat, lon);
    const compressed_data = await (await fetch(url)).arrayBuffer();
    const decompressed_data = pako.inflate(new Uint8Array(compressed_data));
    const data_view = new DataView(decompressed_data.buffer);
    const image = new ImageData(tile_resolution, tile_resolution);

    for (let y = 0; y < tile_resolution; y++) {
        for (let x = 0; x < tile_resolution; x++) {
            const offset = (y * tile_resolution + x) * 2;
            const height = data_view.getInt16(offset, false) + elevation_offset;
            if (height == 0)
                height = elevation_offset;
            const pixel = encodeHeight(height);
            Image.setPixel(image, Vector.vec(x, tile_resolution - 1 - y), pixel);
        }
    }
    
    return image;
}

async function getTileSet(min_lon, min_lat, max_lon, max_lat) {
    if (!isValidTileSet(min_lon, min_lat, max_lon, max_lat))
        throw Error("Invalid coordinates or maximum ammount of tiles exceeded!");

    let counter = 0;
    let tiles = [];
    for (let y = Math.floor(min_lat); y < Math.ceil(max_lat); y++) {
        let tile_row = [];
        for (let x = Math.floor(min_lon); x < Math.ceil(max_lon); x++) {
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

function combineTiles(tiles) {
    const width = tiles[0].length * tile_resolution;
    const height = tiles.length * tile_resolution;
    const image = new ImageData(width, height);

    for (let tile_y = 0; tile_y < tiles.length; tile_y++) {
        for (let tile_x = 0; tile_x < tiles[0].length; tile_x++) {
            for (let pixel_x = 0; pixel_x < tile_resolution; pixel_x++) {
                for (let pixel_y = 0; pixel_y < tile_resolution; pixel_y++) {
                    const coordinate = Vector.vec(pixel_x + tile_x * tile_resolution, pixel_y + tile_y * tile_resolution);
                    const value = Image.getPixel(tiles[tile_y][tile_x], Vector.vec(pixel_x, pixel_y));
                    if (value === undefined || value === NaN)
                        throw new Error("Undefined pixel");
                    Image.setPixel(image, coordinate, value);
                }
            }
        }
    }

    return image;
}

export async function getData(min_lon, min_lat, max_lon, max_lat) {
    const image = await fetchTile(min_lat, min_lon);
    // const tiles = await getTileSet(min_lon, min_lat, max_lon, max_lat);
    // const image = combineTiles(tiles);
    // ... calc
    // const cropped = Image.crop(combined, min_lon, min_lat, max_lon, max_lat);
    // const resized = Image.resize(cropped, 256, 256);

    let min = Infinity;
    let max = -Infinity;
    Image.iterate(image, (value, uv) => {
        const height = decodeHeight(value);
        min = Math.min(min, height);
        max = Math.max(max, height);
    });

    return {
        image: image,
        min: min,
        max: max,
        range: (max - min) / pixel_size,
        multiplier: 1.0 / pixel_size,
        offset: -min,
    }
}

