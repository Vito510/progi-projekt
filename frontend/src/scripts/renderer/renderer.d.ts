
export default class Renderer {
    static async initialize(canvas: HTMLElement): Promise<Renderer>;
    destroy(): void;
    update(): void;
    render(): void;
}