import type TrackPoint from "../../interfaces/TrackPoint";
import { useEffect, useRef } from "react";
import TileUtils from "../../utility/tile_utils";
import PathMap from "../../renderer/map/pathmap";
import ImageUtils from "../../utility/image_utils";

let normalized_heightmap: ImageData;
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

    // console.log(heightmap.width, heightmap.height, heightmap.width / heightmap.height);

    function click_handler(event: any) {
        const rect = canvas_ref.current!.getBoundingClientRect();
        const x = 1.0 - (event.clientX - rect.x) / rect.width;
        const y = (event.clientY - rect.y) / rect.height;
        const z = TileUtils.decodeHeight(ImageUtils.get(heightmap, (1.0 - x) * heightmap.width, y * heightmap.height)) - 32768;
        const point: TrackPoint = {x: x, y: y, z: z};
        onInput(point)
    }
 
    useEffect(() => {
        normalized_heightmap = TileUtils.generateNormalizedHeightmap(heightmap);
        const pointmap = PathMap.generatePathmap(points, heightmap.width, heightmap.height);

        canvas_ref.current!.addEventListener("resize", () => {
            syncResolution(canvas_ref.current!);
            drawCanvas(context!, canvas_ref.current!, normalized_heightmap, pointmap);
        })
        
        context = canvas_ref.current!.getContext('2d');    
        if (!context)
            throw new Error("Failed to get rendering context");
        
        syncResolution(canvas_ref.current!);
        drawCanvas(context, canvas_ref.current!, normalized_heightmap, pointmap);
    }, []);

    useEffect(() => {
        syncResolution(canvas_ref.current!);
        const pointmap = PathMap.generatePathmap(points, heightmap.width, heightmap.height);
        drawCanvas(context!, canvas_ref.current!, normalized_heightmap, pointmap);
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

function drawCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: ImageData, overlay: ImageData): void {
    
    temp_canvas.width = background.width;
    temp_canvas.height = background.height;

    const imageRatio = background.width / background.height;
    const canvasRatio = canvas.width / canvas.height;
  
    let draw_width, draw_height, offset_x = 0, offset_y = 0;
    if (imageRatio > canvasRatio) {
        draw_width = canvas.width;
        draw_height = canvas.width / imageRatio;
        offset_y = (canvas.height - draw_height) / 2;
    } else {
        draw_height = canvas.height;
        draw_width = canvas.height * imageRatio;
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