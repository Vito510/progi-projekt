import ImageUtils from "../image_utils.js";
import Formats from "./webgl_formats.js";
import WebGL from "./webgl_utils.js";

export default class Texture {
    static async load(url) {
        const image = await ImageUtils.load(url);
        return new Texture(image.data, image.width, image.height);
    }

    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
        this.texture;
        this.binding;
        this.location;
    }

    destroy(gl) {
        gl.deleteTexture(this.texture);
    }

    setup(gl, name, program, binding, filter, wrap_mode) {
        this.binding = 0x84C0 + binding;
        this.location = gl.getUniformLocation(program, name);
        this.texture = WebGL.createTexture(gl, this.width, this.height, "RGBA8", filter, wrap_mode, this.data);

        gl.useProgram(program);
        gl.uniform1i(this.location, binding);
    }

    bind(gl) {
        gl.activeTexture(this.binding);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    store(gl, data) {
        const format = "RGBA8";
        gl.texImage2D(gl.TEXTURE_2D, 0, gl[format], this.width, this.height, 0, gl[Formats[format].channels], gl[Formats[format].type], data);
    } 
}