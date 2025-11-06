import * as Matrix from "../utility/matrix.js";
import * as Vector from "../utility/vector.js";
import * as WebGL from "../utility/webgl.js";
import * as Image from "../utility/image.js";

export default class WebGLManager {
    static async initialize(canvas, params = {heightmap: undefined, range: 256, offset: -32768, multiplier: 0.03}) {
        const fragment_shader_code = await (await fetch('../shaders/fragment.glsl')).text();
        // const height_texture = await WebGL.Texture.load('/images/temp.png'); // height.jpg
        return new WebGLManager(canvas, fragment_shader_code, params);
    }

    constructor(canvas, fragment_shader_code, params) {
        this.canvas = canvas;
        this.vertex_buffer;
        this.vertex_location;
        this.uniform_buffer;
        this.program;
        this.base_render_size = {x: 2560, y: 1440};
        this.height_texture = new WebGL.Texture(params.heightmap.data, params.heightmap.width, params.heightmap.height);

        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl)
            throw new ReferenceError("This device or browser does not support WebGL2.");

        window.addEventListener("resize", () => {this.synchronize();});
        this.canvas.addEventListener("resize", () => {this.synchronize();});

        const temp_multiplier = 3;

        this.uniforms = {
            canvas_size: Vector.vec(this.base_render_size.x, this.base_render_size.y),
            buffer_size: Vector.vec(this.base_render_size.x, this.base_render_size.y),

            grid_size: Vector.vec(this.height_texture.width, this.height_texture.height, params.range * temp_multiplier),
            render_scale: 2,
            
            camera_rotation: Matrix.mat(1.0),
            camera_position: Vector.vec(0.0, -3.0, 0.0),
            fov: 1.0,

            grid_scale: 1.0,
            shading_mode: 1.0,
            padding_a: 0.0,
            padding_b: 0.0,
            
            height_offset: params.offset,
            height_multiplier: params.multiplier * temp_multiplier,
            height_gamma: 1.0,
            height_invert: 0.0,

            fade_blend: 0.0,
            voxel_blend: 0.0,
            grayscale_blend: 0.0,
            normals_epsilon: 1.0,
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
        this.gl.viewport(0, 0, this.uniforms.canvas_size.x / this.uniforms.render_scale, this.uniforms.canvas_size.y / this.uniforms.render_scale);

        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.vertex_location);
        this.height_texture.bind(this.gl);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    synchronize() {
        const width = Math.min(this.canvas.clientWidth, this.base_render_size.x);
        const height = Math.min(this.canvas.clientHeight, this.base_render_size.y);
        this.uniforms.canvas_size = Vector.vec(width, height);
        this.canvas.width = width / this.uniforms.render_scale;
        this.canvas.height = height / this.uniforms.render_scale;
    }

    reloadImage(image, height = 256) {
        this.height_texture.destroy(this.gl);
        this.height_texture = new WebGL.Texture(image.data, image.width, image.height);
        this.height_texture.setup(this.gl, "height_texture", this.program, 0, "LINEAR", "CLAMP_TO_EDGE");
        this.uniforms.grid_size.x = this.height_texture.width;
        this.uniforms.grid_size.y = this.height_texture.height;
        this.uniforms.grid_size.z = height;
    }

    async screenshot(file_name) {
        const buffer_width = Math.floor(this.uniforms.buffer_size.x);
        const buffer_height = Math.floor(this.uniforms.buffer_size.y);
        const render_width = Math.floor(this.uniforms.canvas_size.x / this.uniforms.render_scale);
        const render_height = Math.floor(this.uniforms.canvas_size.y / this.uniforms.render_scale);

        const color_buffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, color_buffer);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA8, buffer_width, buffer_height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        
        const frame_buffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,  frame_buffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, color_buffer, 0);
        
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.uniforms.canvas_size.x / this.uniforms.render_scale, this.uniforms.canvas_size.y / this.uniforms.render_scale);

        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.vertex_location);
        this.height_texture.bind(this.gl);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        const image = WebGL.textureToImage(this.gl, color_buffer, render_width, render_height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        Image.save(file_name, image);
    }
}

function packUniforms(data) {
    let array = [];
    for (const el in data) {
        if (Vector.test(data[el]))
            array.push(Vector.array(data[el]));
        else if (Matrix.test(data[el]))
            array.push(Matrix.array(data[el]));
        else
            array.push(data[el]);
    }
    return array.flat();
}