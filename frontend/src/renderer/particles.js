import WebGL from './webgl_utils.js'

export default class Particles {
    constructor() {
        this.gl

        this.pointPositionBuffer = []
        this.pointVelocityBuffer
        this.lineBuffer

        this.pointProgram
        this.lineProgram
    }

    load(canvas) {

        this.gl = canvas.getContext('webgl2', { 
            alpha: true,
            antialias: true,
            depth: true,
            preserveDrawingBuffer: false
        });
        if (!this.gl) {
            // throw new ReferenceError('Your browser does not support WebGL2. Please try a modern browser like Chrome, Firefox, or Edge.');
            return;
        }
        
        const resizeCanvas = () => {
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;
            
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                this.gl.viewport(0, 0, displayWidth, displayHeight);
            }
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        const vertexShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 aPosition;
            in vec3 aVelocity;

            out vec3 oPosition;
            
            uniform float uSize;
            uniform vec3 uColor;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform float uSpeed;
            
            void main() {
                vec3 position = aPosition + aVelocity * uSpeed;
                position.x = mod(position.x + 1.0, 2.0) - 1.0;
                position.y = mod(position.y + 1.0, 2.0) - 1.0;
                position.z = mod(position.z + 1.0, 2.0) - 1.0;
                
                oPosition = position;
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(position, 1.0);
                float size_factor = mix(0.25, 1.0, (1.0 - length(gl_Position.xyz - vec3(0.0, 0.0, 1.0)) / 2.0));
                gl_PointSize = uSize * size_factor;
            }
        `;
        
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            
            out vec4 fragColor;
            uniform float uSize;
            uniform vec3 uColor;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float distance = length(coord);

                if (distance > 0.5) {
                    discard;
                }

                float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
                fragColor = vec4(uColor, alpha);
            }
        `;
        
        const lineVertexShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 aPosition;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
            }
        `;
        
        const lineFragmentShaderSource = `#version 300 es
            precision highp float;
            
            out vec4 fragColor;
            uniform vec3 uColor;
            
            void main() {
                fragColor = vec4(uColor, 1.0);
            }
        `;
        
        this.pointProgram = WebGL.createProgram(this.gl, vertexShaderSource, fragmentShaderSource);
        WebGL.setFeedbaclVaryings(this.gl, this.pointProgram, ["oPosition"]);
        this.lineProgram = WebGL.createProgram(this.gl, lineVertexShaderSource, lineFragmentShaderSource);
        
        const pointPositionLoc = this.gl.getAttribLocation(this.pointProgram, 'aPosition');
        const pointVelocityLoc = this.gl.getAttribLocation(this.pointProgram, 'aVelocity');
        
        const pointModelViewMatrixLoc = this.gl.getUniformLocation(this.pointProgram, 'uModelViewMatrix');
        const pointProjectionMatrixLoc = this.gl.getUniformLocation(this.pointProgram, 'uProjectionMatrix');
        const pointSpeedLoc = this.gl.getUniformLocation(this.pointProgram, 'uSpeed');
        const pointSizeLoc = this.gl.getUniformLocation(this.pointProgram, 'uSize');
        const pointColorLoc = this.gl.getUniformLocation(this.pointProgram, 'uColor');
        
        const linePositionLoc = this.gl.getAttribLocation(this.lineProgram, 'aPosition');
        const lineModelViewMatrixLoc = this.gl.getUniformLocation(this.lineProgram, 'uModelViewMatrix');
        const lineProjectionMatrixLoc = this.gl.getUniformLocation(this.lineProgram, 'uProjectionMatrix');
        const lineColorLoc = this.gl.getUniformLocation(this.lineProgram, 'uColor');
        
        let points = [];
        let velocities = [];
        
        let pointCount = 25;
        let speed = 0.0003;
        let mouseSensitivity = -0.1;
        
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        
        for (let i = 0; i < pointCount; i++) {
            const position = [
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 2.0
            ]
            points.push(position);
            if (i != 0 && i != pointCount-1)
                points.push(position);
            
            const velocity = [
                (Math.random() - 0.5),
                (Math.random() - 0.5),
                (Math.random() - 0.5)
            ]
            velocities.push(velocity);
            if (i != 0 && i != pointCount-1)
                velocities.push(velocity);
        }
        
        this.pointPositionBuffer[0] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer[0]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points.flat()), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.pointPositionBuffer[1] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer[1]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points.flat()), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        
        this.pointVelocityBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVelocityBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(velocities.flat()), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        
        this.lineBuffer = this.gl.createBuffer();
        
        function handleMouseMove(event) {
            const mouseNormalizedX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseNormalizedY = (event.clientY / window.innerHeight) * 2 - 1;
            targetRotationY = mouseNormalizedX * mouseSensitivity;
            targetRotationX = mouseNormalizedY * mouseSensitivity * 0.5;
        }
        
        function createProjectionMatrix(gl) {
            const fieldOfView = 60 * Math.PI / 180;
            const aspect = gl.canvas.width / gl.canvas.height;
            const zNear = 0.1;
            const zFar = 100.0;
            
            const f = 1.0 / Math.tan(fieldOfView / 2);
            const rangeInv = 1.0 / (zNear - zFar);
            
            return [
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (zNear + zFar) * rangeInv, -1,
                0, 0, zNear * zFar * rangeInv * 2, 0
            ];
        }
        
        function createModelViewMatrix() {
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;
            
            const cosX = Math.cos(currentRotationX);
            const sinX = Math.sin(currentRotationX);
            const cosY = Math.cos(currentRotationY);
            const sinY = Math.sin(currentRotationY);
            
            return [
                cosY, sinX * sinY, cosX * sinY, 0,
                0, cosX, -sinX, 0,
                -sinY, sinX * cosY, cosX * cosY, 0,
                0, 0, -1, 1
            ];
        }
        
        const drawPoints = (size = 1.0, colorR = 1.0, colorG = 1.0, colorB = 1.0) => {
            this.gl.useProgram(this.pointProgram);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer[0]);
            this.gl.enableVertexAttribArray(pointPositionLoc);
            this.gl.vertexAttribPointer(pointPositionLoc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVelocityBuffer);
            this.gl.enableVertexAttribArray(pointVelocityLoc);
            this.gl.vertexAttribPointer(pointVelocityLoc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            
            this.gl.uniformMatrix4fv(pointModelViewMatrixLoc, false, createModelViewMatrix());
            this.gl.uniformMatrix4fv(pointProjectionMatrixLoc, false, createProjectionMatrix(this.gl));
            this.gl.uniform1f(pointSpeedLoc, speed);
            this.gl.uniform1f(pointSizeLoc, size);
            this.gl.uniform3f(pointColorLoc, colorR, colorG, colorB);

            this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.pointPositionBuffer[1]);
            this.gl.beginTransformFeedback(this.gl.POINTS);
            this.gl.drawArrays(this.gl.POINTS, 0, points.length);
            this.gl.endTransformFeedback();
            this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
            
            [this.pointPositionBuffer[0], this.pointPositionBuffer[1]] = [this.pointPositionBuffer[1], this.pointPositionBuffer[0]];
        }
        
        const drawLines = (colorR = 1.0, colorG = 1.0, colorB = 1.0) => {
            this.gl.useProgram(this.lineProgram);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer[0]);
            this.gl.enableVertexAttribArray(linePositionLoc);
            this.gl.vertexAttribPointer(linePositionLoc, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            
            this.gl.uniformMatrix4fv(lineModelViewMatrixLoc, false, createModelViewMatrix());
            this.gl.uniformMatrix4fv(lineProjectionMatrixLoc, false, createProjectionMatrix(this.gl));
            this.gl.uniform3f(lineColorLoc, colorR, colorG, colorB);

            this.gl.drawArrays(this.gl.LINES, 0, points.length);
        }
        
        const render = () => {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            // drawPoints(25.0, 110 / 255.0, 176 / 255.0, 165 / 255.0);
            // drawLines(110 / 255.0, 176 / 255.0, 165 / 255.0);
            drawPoints(25.0, 1.0, 1.0, 1.0);
            drawLines(1.0, 1.0, 1.0);
            requestAnimationFrame(render);
        }
        
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        document.addEventListener('mousemove', handleMouseMove);
        requestAnimationFrame(render);
    }

    unload() {
        this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.gl.deleteBuffer(this.lineBuffer);
        this.gl.deleteBuffer(this.pointPositionBuffer[0]);
        this.gl.deleteBuffer(this.pointPositionBuffer[1]);
        this.gl.deleteBuffer(this.pointVelocityBuffer);

        this.gl.deleteProgram(this.lineProgram);
        this.gl.deleteProgram(this.pointProgram);
        this.gl = null;
    }
}
