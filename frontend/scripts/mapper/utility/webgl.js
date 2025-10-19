import * as Loader from "./loader.js";

const formats = {
    R8: {channels: "RED", type: "UNSIGNED_BYTE", filterable: true},
    R8_SNORM: {channels: "RED", type: "BYTE", filterable: true},
    R16F: {channels: "RED", type: "FLOAT", filterable: true},
    R32F: {channels: "RED", type: "FLOAT", filterable: true},
    R8UI: {channels: "RED_INTEGER", type: "UNSIGNED_BYTE", filterable: false},
    R8I: {channels: "RED_INTEGER", type: "BYTE", filterable: false},
    R16UI: {channels: "RED_INTEGER", type: "UNSIGNED_SHORT", filterable: false},
    R16I: {channels: "RED_INTEGER", type: "SHORT", filterable: false},
    R32UI: {channels: "RED_INTEGER", type: "UNSIGNED_INT", filterable: false},
    R32I: {channels: "RED_INTEGER", type: "INT", filterable: false},
    RG8: {channels: "RG", type: "UNSIGNED_BYTE", filterable: true},
    RG8_SNORM: {channels: "RG", type: "BYTE", filterable: true},
    RG16F: {channels: "RG", type: "FLOAT", filterable: true},
    RG32F: {channels: "RG", type: "FLOAT", filterable: false},
    RG8UI: {channels: "RG_INTEGER", type: "UNSIGNED_BYTE", filterable: false},
    RG8I: {channels: "RG_INTEGER", type: "BYTE", filterable: false},
    RG16UI: {channels: "RG_INTEGER", type: "UNSIGNED_SHORT", filterable: false},
    RG16I: {channels: "RG_INTEGER", type: "SHORT", filterable: false},
    RG32UI: {channels: "RG_INTEGER", type: "UNSIGNED_INT", filterable: false},
    RG32I: {channels: "RG_INTEGER", type: "INT", filterable: false},
    RGB8: {channels: "RGB", type: "UNSIGNED_BYTE", filterable: true},
    SRGB8: {channels: "RGB", type: "UNSIGNED_BYTE", filterable: true},
    RGB565: {channels: "RGB", type: "UNSIGNED_BYTE", filterable: true},
    RGB8_SNORM: {channels: "RGB", type: "BYTE", filterable: true},
    R11F_G11F_B10F: {channels: "RGB", type: "FLOAT", filterable: true},
    RGB9_E5: {channels: "RGB", type: "FLOAT", filterable: true},
    RGB16F: {channels: "RGB", type: "FLOAT", filterable: true},
    RGB32F: {channels: "RGB", type: "FLOAT", filterable: false},
    RGB8UI: {channels: "RGB_INTEGER", type: "UNSIGNED_BYTE", filterable: false},
    RGB8I: {channels: "RGB_INTEGER", type: "BYTE", filterable: false},
    RGB16UI: {channels: "RGB_INTEGER", type: "UNSIGNED_SHORT", filterable: false},
    RGB16I: {channels: "RGB_INTEGER", type: "UNSIGNED_INT", filterable: false},
    RGB32UI: {channels: "RGB_INTEGER", type: "INT", filterable: false},
    RGB32I: {channels: "RGB_INTEGER", type: "UNSIGNED_BYTE", filterable: false},
    RGBA8: {channels: "RGBA", type: "UNSIGNED_BYTE", filterable: true},
    RSRGB8_ALPHA88: {channels: "RGBA", type: "BYTE", filterable: true},
    RGBA8_SNORM: {channels: "RGBA", type: "UNSIGNED_BYTE", filterable: true},
    RGB5_A1: {channels: "RGBA", type: "UNSIGNED_BYTE", filterable: true},
    RGBA4: {channels: "RGBA", type: "UNSIGNED_BYTE", filterable: true},
    RGB10_A2: {channels: "RGBA", type: "UNSIGNED_INT_2_10_10_10_REV", filterable: true},
    RGBA16F: {channels: "RGBA", type: "FLOAT", filterable: true},
    RGBA32F: {channels: "RGBA", type: "FLOAT", filterable: false},
    RGBA8UI: {channels: "RGBA_INTEGER", type: "UNSIGNED_BYTE", filterable: false},
    RGBA8I: {channels: "RGBA_INTEGER", type: "BYTE", filterable: false},
    RGBA10_A2UI: {channels: "RGBA_INTEGER", type: "UNSIGNED_INT_2_10_10_10_REV", filterable: false},
    RGBA16UI: {channels: "RGBA_INTEGER", type: "UNSIGNED_SHORT", filterable: false},
    RGBA16I: {channels: "RGBA_INTEGER", type: "SHORT", filterable: false},
    RGBA32UI: {channels: "RGBA_INTEGER", type: "UNSIGNED_INT", filterable: false},
    RGBA32I: {channels: "RGBA_INTEGER", type: "INT", filterable: false},
}

export function compileShader(gl, shader_code, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shader_code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error_message = gl.getShaderInfoLog(shader);
        throw new SyntaxError("Error in shader compiling:\n" + error_message);
    }
    return shader;
}

export function linkProgram(gl, vertex_shader, fragment_shader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error_message = gl.getProgramInfoLog(program);
        throw new Error("Error in program linking:\n" + error_message);
    }
    return program;
}

export function createProgram(gl, vertex_shader_code, fragment_shader_code) {
    const vertex_shader = compileShader(gl, vertex_shader_code, gl.VERTEX_SHADER);
    const fragment_shader = compileShader(gl, fragment_shader_code, gl.FRAGMENT_SHADER);
    const program = linkProgram(gl, vertex_shader, fragment_shader);
    gl.deleteShader(vertex_shader);
    gl.deleteShader(fragment_shader);
    return program;
}

export function setFeedbaclVaryings(gl, program, varyings, mode = "SEPARATE_ATTRIBS") {
    gl.transformFeedbackVaryings(program, varyings, gl[mode]);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error_message = gl.getProgramInfoLog(program);
        throw new Error("Error in program linking:\n" + error_message);
    }
}

export function createTexture(gl, width, height, format = "RGBA8", filter = "LINEAR", wrap_mode = "REPEAT", data = null) {
    if (formats[format].filterable == false && filter == "LINEAR")
        throw new Error(`Error in texture creation: Tried to set LINEAR filtering on a non filterable format (${format})`);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl[format], width, height, 0, gl[formats[format].channels], gl[formats[format].type], data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[(formats[format].filterable) ? "LINEAR" : "NEAREST"]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrap_mode]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrap_mode]);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

export function textureToImage(gl, texture, width, height) {
    const data = new Uint8ClampedArray(width * height * 4);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return new ImageData(data, width, height);
}

export class Texture {
    static async load(url) {
        const image = await Loader.loadImage(url);
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
        this.texture = createTexture(gl, this.width, this.height, "RGBA8", filter, wrap_mode, this.data);

        gl.useProgram(program);
        gl.uniform1i(this.location, binding);
    }

    bind(gl) {
        gl.activeTexture(this.binding);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    store(gl, data) {
        const format = "RGBA8";
        gl.texImage2D(gl.TEXTURE_2D, 0, gl[format], this.width, this.height, 0, gl[formats[format].channels], gl[formats[format].type], data);
    } 
}