import type TerrainParameter from "../../interfaces/TerrainParameter";

export default class Renderer {
    static async initialize(canvas: HTMLCanvasElement, params: TerrainParameter): Promise<Renderer>;
    destroy(): void;
    update(): void;
    render(): void;
}