import type TrackPoint from "../../interfaces/TrackPoint";
import { useEffect, useRef } from "react";
import TileUtils from "../../utility/tile_utils";
import PathMap from "../../renderer/map/pathmap";
import ImageUtils from "../../utility/image_utils";

let normalized_heightmap: ImageData;
let pointmap: ImageData;
let context: CanvasRenderingContext2D | null;
const temp_canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
const temp_context: OffscreenCanvasRenderingContext2D = temp_canvas.getContext('2d', { willReadFrequently: true })!;

interface Props {
    heightmap: ImageData,
    points: TrackPoint[],
    onInput: (point: TrackPoint) => void,
}

export default function MapPointPlacer({heightmap, onInput, points}: Props) {
    const canvas_ref = useRef<HTMLCanvasElement>(null);

    function click_handler(event: any) {
        syncResolution(canvas_ref.current!);
        const canvas = canvas_ref.current!;

        const image_ratio = normalized_heightmap.width / normalized_heightmap.height;
        const canvas_ratio = canvas.width / canvas.height;
        let draw_width, draw_height, offset_x = 0, offset_y = 0;
        if (image_ratio > canvas_ratio) {
            draw_width = canvas.width;
            draw_height = canvas.width / image_ratio;
            offset_y = (canvas.height - draw_height) / 2;
        } else {
            draw_height = canvas.height;
            draw_width = canvas.height * image_ratio;
            offset_x = (canvas.width - draw_width) / 2;
        }

        const rect = canvas.getBoundingClientRect();
        let x = 1.0 - (event.clientX - (offset_x + rect.x)) / (draw_width);
        let y = (event.clientY - (offset_y + rect.y)) / (draw_height);
        x = Math.min(Math.max(x, 0.0), 1.0);
        y = Math.min(Math.max(y, 0.0), 1.0);
        const z = TileUtils.decodeHeight(ImageUtils.get(heightmap, (1.0 - x) * heightmap.width, y * heightmap.height)) - 32768;
        const point: TrackPoint = {x: x, y: y, z: z};
        onInput(point)
    }
 
    useEffect(() => {
        normalized_heightmap = TileUtils.generateNormalizedHeightmap(heightmap);
        pointmap = PathMap.generatePathmap(points, heightmap.width, heightmap.height);

        context = canvas_ref.current!.getContext('2d');    
        if (!context)
            throw new Error("Failed to get rendering context");
        
        function refreshCanvas() {
            drawMap(context!, canvas_ref.current!, normalized_heightmap, pointmap);
        }
        canvas_ref.current!.addEventListener("resize", refreshCanvas);
        window.addEventListener("resize", refreshCanvas);
        refreshCanvas()

        return () => {
            window.removeEventListener("resize", refreshCanvas);
        }
    }, []);

    useEffect(() => {
        pointmap = PathMap.generatePathmap(points, heightmap.width, heightmap.height);
        drawMap(context!, canvas_ref.current!, normalized_heightmap, pointmap);
    }, [points])

    return (
        <canvas 
            ref={canvas_ref} 
            className="-map-point-placer" 
            style={{
                width: "100%",
                height: "100%",
            }} 
            onClick={(event) => {click_handler(event)}}
        ></canvas>
    );
}

function drawMap(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: ImageData, overlay: ImageData): void {
    syncResolution(canvas);

    temp_canvas.width = background.width;
    temp_canvas.height = background.height;

    const image_ratio = background.width / background.height;
    const canvas_ratio = canvas.width / canvas.height;
  
    let draw_width, draw_height, offset_x = 0, offset_y = 0;
    if (image_ratio > canvas_ratio) {
        draw_width = canvas.width;
        draw_height = canvas.width / image_ratio;
        offset_y = (canvas.height - draw_height) / 2;
    } else {
        draw_height = canvas.height;
        draw_width = canvas.height * image_ratio;
        offset_x = (canvas.width - draw_width) / 2;
    }

    temp_context!.putImageData(background, 0, 0);
    context.drawImage(temp_canvas, offset_x, offset_y, draw_height, draw_width);

    temp_context!.putImageData(overlay, 0, 0);
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(temp_canvas, offset_x, offset_y, draw_height, draw_width);
    context.restore();
}

function syncResolution(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    canvas.height = rect.height;
    canvas.width = rect.width;
}