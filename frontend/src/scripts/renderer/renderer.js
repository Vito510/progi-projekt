import WebGLManager from './gpu.js'
import GUIManager from './gui.js'
import Camera from '../utility/camera.js';
import * as Vector from '../utility/vector.js';

export default class Renderer {
    static async initialize(canvas) {
        const gpu = await WebGLManager.initialize(canvas);
        return new Renderer(gpu, canvas);
    }

    constructor(gpu, canvas) {
        this.gpu = gpu;
        this.camera = new Camera(canvas, Vector.vec(this.gpu.height_texture.width), Vector.vec(-135.0, 35.0), 0.5, 5.0, 0.5, false, true);
        this.gui = new GUIManager(canvas, this.gpu, this.camera);
        this.animation_id;

        this.gpu.uniforms.shading_mode = 1.0;
        this.gpu.uniforms.normals_epsilon = 2.0;
        this.gpu.uniforms.fade_blend = 0.0;
        this.gpu.uniforms.render_scale = 2.0;
        this.gpu.uniforms.grid_scale = 2.0; // 0.15
        this.gpu.uniforms.voxel_blend = 0.0;
        this.gpu.uniforms.height_offset = -32768.0;
        this.gpu.uniforms.height_multiplier = 0.03; // 0.15
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