import type TrackPoint from "../../interfaces/TrackPoint";

const canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
const context: OffscreenCanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true })!;

export default function generatePathmap(points: TrackPoint[], width: number, height: number) {
    canvas.width = width;
    canvas.height = height;

    fillCanvas("#00000000");

    const outline = 15;
    const line = 5;
    const point = 20;
    drawPoints(points, (point + outline) * 0.5, "#000000");
    drawLines(points, line + outline, "#000000");
    drawPoints(points, point * 0.5, "#70ADA2");
    drawLines(points, line, "#70ADA2");

    return context.getImageData(0, 0, width, height);
}

function drawPoints(points: TrackPoint[], radius: number, color: string) {
    if (points.length === 0)
        return;
    
    for (const point of points)
        drawCircle(radius, point.x * context.canvas.width, point.y * context.canvas.height, color);
}

function drawLines(points: TrackPoint[], thickness: number, color: string) {
    if (points.length === 0)
        return;

    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.lineCap = "round";

    for (let index=0; index<(points.length-1); index++) {
        context.beginPath();
        context.moveTo(points[index].x * context.canvas.width, points[index].y * context.canvas.height);
        context.lineTo(points[index + 1].x * context.canvas.width, points[index + 1].y * context.canvas.height);
        context.stroke();
    } 
}

function drawCircle(radius: number, x: number, y: number, color: string): void {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
}

function fillCanvas(color: string): void {
    context.fillStyle = color;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
}