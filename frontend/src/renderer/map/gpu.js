import WebGL from "../../utility/webgl/webgl_utils.js";
import ImageUtils from "../../utility/image_utils.js";
import Matrix from "../../utility/math/matrix.js";
import Vector from "../../utility/math/vector.js";
import Vector3D from "../../utility/math/vector3d.js";
import Vector2D from "../../utility/math/vector2d.js";
import Texture from "../../utility/webgl/webgl_texture.js";

export default class WebGLManager {
    static async initialize(canvas, params = {heightmap: undefined, range: 256, offset: -32768, multiplier: 0.03}) {
        const fragment_shader_code = await (await fetch('./src/renderer/map/fragment.glsl')).text();
        return new WebGLManager(canvas, fragment_shader_code, params);
    }

    constructor(canvas, fragment_shader_code, params) {
        this.canvas = canvas;
        this.vertex_buffer;
        this.vertex_location;
        this.uniform_buffer;
        this.program;
        this.base_render_size = {x: 2560, y: 1440};
        this.height_texture = new Texture(params.heightmap.data, params.heightmap.width, params.heightmap.height);
        this.path_texture = new Texture(new Uint8ClampedArray(4 * this.height_texture.width * this.height_texture.height), this.height_texture.width, this.height_texture.height);

        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl)
            throw new ReferenceError("This device or browser does not support WebGL2.");

        window.addEventListener("resize", () => {this.synchronize();});
        this.canvas.addEventListener("resize", () => {this.synchronize();});

        this.uniforms = {
            canvas_size: new Vector2D(this.base_render_size.x, this.base_render_size.y),
            buffer_size: new Vector2D(this.base_render_size.x, this.base_render_size.y),

            grid_size: new Vector3D(this.height_texture.width, this.height_texture.height, params.range),
            render_scale: 1.0,
            
            camera_rotation: new Matrix(),
            camera_position: new Vector3D(),
            fov: 1.0,

            grid_scale: 1.0,
            height_offset: params.offset,
            height_multiplier: params.multiplier,
            normals_epsilon: 1.0,

            max_steps: 2048,
            padding_a: 0.0,
            padding_b: 0.0,
            padding_c: 0.0,
        };

        const vertices = new Float32Array([
            1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
            1.0, 1.0,
            -1.0, -1.0,
            -1.0, 1.0
        ]);

        this.vertex_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        const vertex_shader_code = `#version 300 es
            precision mediump float;
            in vec2 vertex_position;
            out vec2 texture_coordinates;

            void main() {
                texture_coordinates = vertex_position * 0.5 + 0.5;
                gl_Position = vec4(vertex_position, 0.0, 1.0);
            }
        `;

        this.program = WebGL.createProgram(this.gl, vertex_shader_code, fragment_shader_code);

        const uniform_binding_number = 1;
        const uniform_array = new Float32Array(packUniforms(this.uniforms));
        this.gl.uniformBlockBinding(this.program, this.gl.getUniformBlockIndex(this.program, "UniformBlock"), uniform_binding_number);

        this.uniform_buffer = this.gl.createBuffer();
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, uniform_binding_number, this.uniform_buffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, uniform_array.byteLength, this.gl.DYNAMIC_DRAW);

        this.vertex_location = this.gl.getAttribLocation(this.program, "vertex_position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        this.gl.vertexAttribPointer(this.vertex_location, 2, this.gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

        this.height_texture.setup(this.gl, "height_texture", this.program, 0, "LINEAR", "CLAMP_TO_EDGE");
        this.path_texture.setup(this.gl, "path_texture", this.program, 1, "LINEAR", "CLAMP_TO_EDGE")

        this.synchronize();
    }

    destroy() {
        this.gl.deleteBuffer(this.vertex_buffer);
        this.gl.deleteBuffer(this.uniform_buffer);
        this.gl.deleteProgram(this.program);
        this.height_texture.destroy(this.gl);
    }

    render() {
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.uniform_buffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, new Float32Array(packUniforms(this.uniforms)), this.gl.DYNAMIC_DRAW);

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.uniforms.canvas_size.x * this.uniforms.render_scale, this.uniforms.canvas_size.y * this.uniforms.render_scale);

        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.vertex_location);
        this.height_texture.bind(this.gl);
        this.path_texture.bind(this.gl);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    synchronize() {
        const width = Math.min(this.canvas.clientWidth, this.base_render_size.x);
        const height = Math.min(this.canvas.clientHeight, this.base_render_size.y);
        this.uniforms.canvas_size = new Vector2D(width, height);
        this.canvas.width = width * this.uniforms.render_scale;
        this.canvas.height = height * this.uniforms.render_scale;
    }
}

function packUniforms(data) {
    let array = [];
    for (const el in data) {
        const value = data[el]
        if (value instanceof Vector)
            array.push(value.array());
        else if (value instanceof Matrix)
            array.push(value.array());
        else
            array.push(value);
    }
    return array.flat();
}