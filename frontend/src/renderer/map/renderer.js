import WebGLManager from './gpu.js'
import Camera from './camera.js';
import Vector2D from '../../utility/math/vector2d.js';
import Vector3D from '../../utility/math/vector3d.js';
import PathMap from './pathmap.js';
import RayCast from './raycast.js';

export default class Renderer {
    static async initialize(canvas, params) {
        const gpu = await WebGLManager.initialize(canvas, params);
        return new Renderer(gpu, canvas);
    }

    constructor(gpu, canvas) {
        this.gpu = gpu;
        this.camera = new Camera(canvas, new Vector3D(this.gpu.height_texture.width * 0.75), new Vector2D(180.0, 90.0), 0.5, 1.0, 0.5, false, true);
        // this.camera = new Camera(canvas, new Vector3D(this.gpu.height_texture.width * 0.75), new Vector2D(0.0, 0.0), 0.5, 1.0, 0.5, false, true);
        this.camera.updateOrbit();
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
            this.gpu.uniforms.render_scale = 0.5;
            this.gpu.uniforms.grid_scale = 0.5;
            this.gpu.synchronize();
        }
    }

    getPoint(coorinates) {
        // ImageUtils.save(RayCast.createDebugImage(new ImageData(this.gpu.height_texture.data, this.gpu.height_texture.width), uniforms));
        return RayCast.rayCast(
            new ImageData(this.gpu.height_texture.data, this.gpu.height_texture.width),
            coorinates,
            this.gpu.uniforms
        );
    }

    setPoints(points) {
        const path_image = PathMap.generatePathmap(points, this.gpu.height_texture.width, this.gpu.height_texture.height);
        this.gpu.path_texture.store(this.gpu.gl, path_image.data);
    } 

    adjustCanvas() {
        this.gpu.synchronize();
    }
}
