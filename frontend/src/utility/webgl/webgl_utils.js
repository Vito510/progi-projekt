import Formats from "./webgl_formats.js";

export default class WebGLUtils {
    static compileShader(gl, shader_code, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shader_code);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error_message = gl.getShaderInfoLog(shader);
            throw new SyntaxError("Error in shader compiling:\n" + error_message);
        }
        return shader;
    }
    
    static linkProgram(gl, vertex_shader, fragment_shader) {
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
    
    static createProgram(gl, vertex_shader_code, fragment_shader_code) {
        const vertex_shader = WebGLUtils.compileShader(gl, vertex_shader_code, gl.VERTEX_SHADER);
        const fragment_shader = WebGLUtils.compileShader(gl, fragment_shader_code, gl.FRAGMENT_SHADER);
        const program = WebGLUtils.linkProgram(gl, vertex_shader, fragment_shader);
        gl.deleteShader(vertex_shader);
        gl.deleteShader(fragment_shader);
        return program;
    }
    
    static setFeedbaclVaryings(gl, program, varyings, mode = "SEPARATE_ATTRIBS") {
        gl.transformFeedbackVaryings(program, varyings, gl[mode]);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error_message = gl.getProgramInfoLog(program);
            throw new Error("Error in program linking:\n" + error_message);
        }
    }
    
    static createTexture(gl, width, height, format = "RGBA8", filter = "LINEAR", wrap_mode = "REPEAT", data = null) {
        if (Formats[format].filterable == false && filter == "LINEAR")
            throw new Error(`Error in texture creation: Tried to set LINEAR filtering on a non filterable format (${format})`);
    
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl[format], width, height, 0, gl[Formats[format].channels], gl[Formats[format].type], data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[(Formats[format].filterable) ? "LINEAR" : "NEAREST"]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrap_mode]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrap_mode]);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    
    static textureToImage(gl, texture, width, height) {
        const data = new Uint8ClampedArray(width * height * 4);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.bindTexture(gl.TEXTURE_2D, null);
    
        return new ImageData(data, width, height);
    }
}
