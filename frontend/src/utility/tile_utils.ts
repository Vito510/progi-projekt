import type Selection from '../interfaces/MapSelection.js';
import type Pixel from '../interfaces/Pixel.js';
import type TerrainParameter from '../interfaces/TerrainParameter.js';
import ImageUtil from './image_utils.js';
import pako from 'pako';

const elevation_offset = 32768;
const tile_resolution = 3601;
const display_resolution = 512;
const pixel_size = 30.91;
const max_tiles = 4;

export default class TileUtils {

    static isValidSelection({min_latitude, min_longitude, max_latitude, max_longitude}: Selection): boolean {
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

    static getTileCount(selection: Selection): number {
        const width_tiles = Math.ceil(selection.max_longitude) - Math.floor(selection.min_longitude);
        const height_tiles = Math.ceil(selection.max_latitude) - Math.floor(selection.min_latitude);
        return width_tiles * height_tiles;
    }

    static encodeHeight(height: number): Pixel {
        const r = (height >> 8) & 0xFF;
        const g = height & 0xFF;
        const b = 0;
        const a = 255;
        return {r: r, g: g, b: b, a: a};
    }

    static decodeHeight(color: Pixel): number {
        return color.r * 256.0 + color.g;
    }

    static #getUrl(latitude: number, longitude: number): string {
        const lat_hemisphere = (latitude >= 0) ? 'N' : 'S';
        const lon_hemisphere = (longitude >= 0) ? 'E' : 'W';
        
        const lat_tile = Math.abs(Math.floor(latitude));
        const lon_tile = Math.abs(Math.floor(longitude));

        const url = `https://s3.amazonaws.com/elevation-tiles-prod/skadi/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}/${lat_hemisphere}${lat_tile.toString().padStart(2, '0')}${lon_hemisphere}${lon_tile.toString().padStart(3, '0')}.hgt.gz`
        return url;
    }

    static async #fetchTile(longitude: number, latitude: number): Promise<ImageData> {
        // console.log("Fetching: ", latitude, longitude);
        const url = TileUtils.#getUrl(latitude, longitude);
        const compressed_data = await (await fetch(url)).arrayBuffer();
        const decompressed_data = pako.inflate(new Uint8Array(compressed_data));
        const data_view = new DataView(decompressed_data.buffer);
        const image = new ImageData(tile_resolution, tile_resolution);

        for (let y = 0; y < tile_resolution; y++) {
            for (let x = 0; x < tile_resolution; x++) {
                const offset = (x + tile_resolution * y) * 2;
                let height = data_view.getInt16(offset, false) + elevation_offset;
                if (height == 0)
                    height = elevation_offset;
                const pixel = TileUtils.encodeHeight(height);
                image.data[(x + image.width * y) * 4] = pixel.r;
                image.data[(x + image.width * y) * 4 + 1] = pixel.g;
                image.data[(x + image.width * y) * 4 + 2] = pixel.b;
                image.data[(x + image.width * y) * 4 + 3] = pixel.a;
            }
        }
        
        return image;
    }

    static async #getTileSet(selection: Selection): Promise<ImageData[][]> {
        if (!TileUtils.isValidSelection(selection))
            throw Error("Invalid coordinates or maximum ammount of tiles exceeded!");

        let counter = 0;
        let tiles = [];
        for (let y = Math.floor(selection.min_latitude); y < Math.ceil(selection.max_latitude); y++) {
            let tile_row = [];
            for (let x = Math.floor(selection.min_longitude); x < Math.ceil(selection.max_longitude); x++) {
                if (counter > max_tiles)
                    throw new Error("Maximum ammount of tiles exceeded!");
                const tile = await TileUtils.#fetchTile(x, y);
                tile_row.push(tile);
                counter += 1;
            }
            tiles.unshift(tile_row);
        }

        return tiles;
    }

    static #combineTiles(tiles: ImageData[][]): ImageData {
        const horizontal: ImageData[] = tiles.map((images) => ImageUtil.stitch(images, "horizontal"));
        const vertical: ImageData = ImageUtil.stitch(horizontal, "vertical");
        return vertical;
    }

    static #cropToSelection(image: ImageData, selection: Selection): ImageData {
        const x = (selection.min_longitude - Math.floor(selection.min_longitude)) * tile_resolution;
        const y = (selection.min_latitude - Math.floor(selection.min_latitude)) * tile_resolution;
        const width = (selection.max_longitude - Math.floor(selection.min_longitude)) * tile_resolution - x;
        const height = (selection.max_latitude - Math.floor(selection.min_latitude)) * tile_resolution - y;
        const cropped = ImageUtil.crop(image, x, (image.height - y) - height, width, height);
        return cropped;
    }

    static getParams(image: ImageData, scale : number = 1.0): TerrainParameter {
        let min = Infinity;
        let max = -Infinity;

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const r = image.data[(x + image.width * y) * 4];
                const g = image.data[(x + image.width * y) * 4 + 1];
                const pixel: Pixel = {r, g, b: 0.0, a: 0.0};
                const height = TileUtils.decodeHeight(pixel);
                min = Math.min(min, height);
                max = Math.max(max, height);
            }
        }

        if (Number.isNaN(min) || Number.isNaN(max))
            throw TypeError("Failed to parse height data.");

        return {
            heightmap: image,
            range: (max - min) / (pixel_size * scale) * 1.2, // ARBITRARY
            multiplier: 1.0 / (pixel_size * scale),
            offset: -min,
        }
    }

    static async getData(selection: Selection): Promise<TerrainParameter> {
        if (selection.max_longitude < selection.min_longitude)
            [selection.min_longitude, selection.max_longitude] = [selection.max_longitude, selection.min_longitude];
        if (selection.max_latitude < selection.min_latitude)
            [selection.min_latitude, selection.max_latitude] = [selection.max_latitude, selection.min_latitude];

        const tiles = await TileUtils.#getTileSet(selection);
        let combined = TileUtils.#combineTiles(tiles);
        let cropped = combined;
        if (selection.min_latitude != selection.max_latitude && selection.min_longitude != selection.max_longitude)
            cropped = TileUtils.#cropToSelection(combined, selection);
        const resize_factor = Math.min(cropped.width, cropped.height) / display_resolution;
        const resized = ImageUtil.resize(cropped, cropped.width / resize_factor * 0.8, cropped.height / resize_factor); // ARBITRARY
        
        return TileUtils.getParams(resized, resize_factor);
    }
}