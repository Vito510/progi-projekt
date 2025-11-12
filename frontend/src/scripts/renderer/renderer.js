import WebGLManager from './gpu.js'
import GUIManager from './gui.js'
import Camera from '../utility/camera.js';
import * as Vector from '../utility/vector.js';

export default class Renderer {
    static async initialize(canvas, params) {
        const gpu = await WebGLManager.initialize(canvas, params);
        return new Renderer(gpu, canvas);
    }
    

    constructor(gpu, canvas) {
        this.gpu = gpu;
        this.camera = new Camera(canvas, Vector.vec(this.gpu.height_texture.width * 0.75), Vector.vec(180.0, 90.0), 0.5, 5.0, 0.5, false, true);
        this.camera.updateOrbit();
        this.gui = new GUIManager(canvas, this.gpu, this.camera);
        this.animation_id;
        this.gpu.synchronize();

        window.addEventListener("beforeunload", () => {
            this.destroy();
        })
    }

    update() {
        this.camera.update();
        this.gpu.uniforms.camera_rotation = this.camera.getRotationMatrix();
        this.gpu.uniforms.camera_position = this.camera.position;
        this.gpu.uniforms.fov = this.camera.fov;
    }

    render() {
        this.gpu.render();
    }

    destroy() {
        this.gpu.destroy();
    }
}