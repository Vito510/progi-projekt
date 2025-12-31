import type TerrainParameter from "../../interfaces/TerrainParameter";
import type TrackPoint from "../../interfaces/TrackPoint";

export default class Renderer {
    static async initialize(canvas: HTMLCanvasElement, params: TerrainParameter): Promise<Renderer>;
    destroy(): void;
    update(): void;
    render(): void;
    setQuality(quality: boolean): void;
    getPoint(coorinates: {x: number, y: number}): TrackPoint | null;
    setPoints(points: TrackPoint[]): void;
}