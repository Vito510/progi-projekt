import WebGLManager from './gpu.js'
import Camera from './camera.js';
import Vector2D from './vector2d.js';
import Vector3D from './vector3d.js';
import Vector4D from './vector4d.js';

export default class Renderer {
    static async initialize(canvas, params) {
        const gpu = await WebGLManager.initialize(canvas, params);
        return new Renderer(gpu, canvas);
    }

    constructor(gpu, canvas) {
        this.gpu = gpu;
        this.camera = new Camera(canvas, new Vector3D(this.gpu.height_texture.width * 0.75), new Vector2D(180.0, 90.0), 0.5, 5.0, 0.5, false, true);
        this.camera.updateOrbit();
        this.animation_id;
        this.gpu.synchronize();

        window.addEventListener("beforeunload", () => {
            this.destroy();
        })
        
        document.addEventListener("keypress", (event) => {
            if (event.key == " ")
                this.camera.orbit_mode = !this.camera.orbit_mode;
        });
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

    setQuality(quality) {
        if (quality) {
            this.gpu.uniforms.render_scale = 1.0;
            this.gpu.uniforms.grid_scale = 1.0;
            this.gpu.synchronize();
        } else {
            this.gpu.uniforms.render_scale = 2.0;
            this.gpu.uniforms.grid_scale = 0.5;
            this.gpu.synchronize();
        }
    }

    rayCast(coorinates) {
        // this.gpi.uniforms.
        // return {
            // x: 0,
            // y: 0,
            // z: 0,
        // }
    }

    setPoints(points) {
        // this.gpu.path_texture = ...
    } 
}