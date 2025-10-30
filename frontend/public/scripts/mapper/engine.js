import WebGLManager from './gpu.js'
import GUIManager from './gui.js'
import Camera from './utility/camera.js';
import * as Vector from './utility/vector.js';

class Engine {
    static async initialize() {
        const gpu = await WebGLManager.initialize(document.getElementById("canvas"));
        return new Engine(gpu);
    }

    constructor(gpu) {
        this.gpu = gpu;
        this.camera = new Camera(document.getElementById("canvas"), Vector.vec(this.gpu.height_texture.width), Vector.vec(-135.0, 35.0), 0.5, 5.0, 0.5, false, true);
        this.gui = new GUIManager(document.getElementById("canvas"), this.gpu, this.camera);

        this.gpu.uniforms.shading_mode = 1.0;
        this.gpu.uniforms.normals_epsilon = 2.0;
        this.gpu.uniforms.fade_blend = 0.0;
        this.gpu.uniforms.render_scale = 2.0;
        this.gpu.uniforms.grid_scale = 0.15;
        this.gpu.uniforms.voxel_blend = 0.0;
        this.gpu.uniforms.height_offset = -32768.0;
        this.gpu.uniforms.height_multiplier = 0.15;
        this.gpu.synchronize();
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
}

const engine = await Engine.initialize();
let animation_id = requestAnimationFrame(animate);

async function animate() {
    engine.update();
    engine.render();
    animation_id = requestAnimationFrame(animate);
}