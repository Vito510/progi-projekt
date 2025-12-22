import * as WebGL from '../renderer/webgl.js'

export default class Particles {
    constructor() {
        this.gl

        this.pointPositionBuffer
        this.pointVelocityBuffer
        this.pointSizeBuffer
        this.pointColorBuffer
        this.lineBuffer

        this.pointProgram
        this.lineProgram
    }

    load(canvas) {

        // WebGL2 context
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
        
        // Canvas size
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
        
        // Shaders
        const vertexShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 aPosition;
            in vec3 aVelocity; // useless
            in float aPointSize; // blank
            in vec3 aColor; // blank
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uMovementSpeed;
            
            void main() {
                // Add some subtle oscillation based on velocity and time
                // float oscillation = sin(uTime * 0.001 + aPosition.x * 10.0) * 0.02;
                
                // Calculate position with movement
                // vec3 position = aPosition + aVelocity * uTime * uMovementSpeed * 0.001;
                
                // Apply boundary wrapping
                // position.x = mod(position.x + 1.5, 3.0) - 1.5;
                // position.y = mod(position.y + 1.5, 3.0) - 1.5;
                // position.z = mod(position.z + 1.5, 3.0) - 1.5;
                
                // Add mouse influence
                // position.x += uMouse.x * 0.1;
                // position.y += uMouse.y * 0.1;
                
                // gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(position, 1.0);
                // gl_PointSize = aPointSize * (1.2 + oscillation) + 10.0;
                
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
                gl_PointSize = 20.0;
            }
        `;
        
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            
            out vec4 fragColor;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float distance = length(coord);

                if (distance > 0.5) {
                    discard;
                }

                float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
                fragColor = vec4(1.0, 1.0, 1.0, alpha);
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
            
            void main() {
                fragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;
        
        // Create shader programs
        this.pointProgram = WebGL.createProgram(this.gl, vertexShaderSource, fragmentShaderSource);
        this.lineProgram = WebGL.createProgram(this.gl, lineVertexShaderSource, lineFragmentShaderSource);
        
        // Get attribute and uniform locations for point program
        const pointPositionLoc = this.gl.getAttribLocation(this.pointProgram, 'aPosition');
        const pointVelocityLoc = this.gl.getAttribLocation(this.pointProgram, 'aVelocity');
        const pointSizeLoc = this.gl.getAttribLocation(this.pointProgram, 'aPointSize');
        const pointColorLoc = this.gl.getAttribLocation(this.pointProgram, 'aColor');
        
        const pointModelViewMatrixLoc = this.gl.getUniformLocation(this.pointProgram, 'uModelViewMatrix');
        const pointProjectionMatrixLoc = this.gl.getUniformLocation(this.pointProgram, 'uProjectionMatrix');
        const pointTimeLoc = this.gl.getUniformLocation(this.pointProgram, 'uTime');
        const pointMouseLoc = this.gl.getUniformLocation(this.pointProgram, 'uMouse');
        const pointMovementSpeedLoc = this.gl.getUniformLocation(this.pointProgram, 'uMovementSpeed');
        
        // Get attribute and uniform locations for line program
        const linePositionLoc = this.gl.getAttribLocation(this.lineProgram, 'aPosition');
        const lineModelViewMatrixLoc = this.gl.getUniformLocation(this.lineProgram, 'uModelViewMatrix');
        const lineProjectionMatrixLoc = this.gl.getUniformLocation(this.lineProgram, 'uProjectionMatrix');
        
        // Enable features
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        
        // Initialize points data
        let points = [];
        let velocities = [];
        let pointSizes = [];
        let colors = [];
        
        // Initialize control values
        let pointCount = 100;
        let connectionDistance = 0.6;
        let movementSpeed = 0.02;
        let mouseSensitivity = -0.1;
        
        // Mouse tracking for rotation and interaction
        let mouseX;
        let mouseY;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        let mouseNormalized = { x: 0, y: 0 };
        
        // Initialize points with more interesting distribution
        const initPoints = (count) => {
            points = [];
            velocities = [];
            pointSizes = [];
            colors = [];
            
            for (let i = 0; i < count; i++) {
                // Create more interesting distribution (sphere + noise)
                const angle1 = Math.random() * Math.PI * 2;
                const angle2 = Math.random() * Math.PI;
                const radius = 0.5 + Math.random() * 1.0;
                
                points.push([
                    Math.cos(angle1) * Math.sin(angle2) * radius,
                    Math.sin(angle1) * Math.sin(angle2) * radius,
                    Math.cos(angle2) * radius
                ]);
                
                // More interesting velocities
                velocities.push([
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                ]);
                
                // Varied point sizes
                pointSizes.push(2.0 + Math.random() * 5.0);
                
                // White colors (slight variations for depth perception)
                colors.push([
                    1.0, // R
                    1.0, // G
                    1.0  // B
                ]);
            }
            
            // Create WebGL buffers
            // createBuffers();
        }
        
        // Create buffers
        this.pointPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points.flat()), this.gl.STATIC_DRAW);
        
        this.pointVelocityBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVelocityBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(velocities.flat()), this.gl.STATIC_DRAW);
        
        this.pointSizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointSizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pointSizes), this.gl.STATIC_DRAW);
        
        this.pointColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors.flat()), this.gl.STATIC_DRAW);
        
        this.lineBuffer = this.gl.createBuffer();
        
        // Update point positions (GPU-based in shader, but we can still update CPU side for lines)
        const updatePointData = () => {
            // Update positions on CPU for line calculations
            for (let i = 0; i < points.length; i++) {
                points[i][0] += velocities[i][0] * movementSpeed;
                points[i][1] += velocities[i][1] * movementSpeed;
                points[i][2] += velocities[i][2] * movementSpeed;
                
                // Wrap around boundaries
                for (let j = 0; j < 3; j++) {
                    if (Math.abs(points[i][j]) > 1.5) {
                        points[i][j] = -Math.sign(points[i][j]) * 1.4;
                    }
                }
            }
            
            // Update position buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points.flat()), this.gl.DYNAMIC_DRAW);
        }
        
        // Create projection matrix
        const createProjectionMatrix = () => {
            const fieldOfView = 60 * Math.PI / 180;
            const aspect = this.gl.canvas.width / this.gl.canvas.height;
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
        
        // Create model-view matrix with rotation
        function createModelViewMatrix() {
            // Smooth interpolation to target rotation
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;
            
            const cosX = Math.cos(currentRotationX);
            const sinX = Math.sin(currentRotationX);
            const cosY = Math.cos(currentRotationY);
            const sinY = Math.sin(currentRotationY);
            
            // Combined rotation matrix
            return [
                cosY, sinX * sinY, cosX * sinY, 0,
                0, cosX, -sinX, 0,
                -sinY, sinX * cosY, cosX * cosY, 0,
                0, 0, -2, 1  // Camera at z = -5
            ];
        }
        
        // Generate lines between nearby points
        function generateLines() {
            const lines = [];
            
            // Use a spatial partitioning approach for better performance with many points
            for (let i = 0; i < points.length; i++) {
                // Only connect to some points to avoid O(n²) complexity
                const maxConnections = 2;
                let connections = 0;
                
                for (let j = i + 1; j < points.length && connections < maxConnections; j++) {
                    const dx = points[i][0] - points[j][0];
                    const dy = points[i][1] - points[j][1];
                    const dz = points[i][2] - points[j][2];
                    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                    
                    if (distance < connectionDistance) {
                        lines.push(points[i][0], points[i][1], points[i][2]);
                        lines.push(points[j][0], points[j][1], points[j][2]);
                        connections++;
                    }
                }
            }
            
            return lines;
        }
        
        // Draw points using WebGL2
        const drawPoints = (time) => {
            this.gl.useProgram(this.pointProgram);
            
            // Set up attribute pointers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointPositionBuffer);
            this.gl.enableVertexAttribArray(pointPositionLoc);
            this.gl.vertexAttribPointer(pointPositionLoc, 3, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVelocityBuffer);
            this.gl.enableVertexAttribArray(pointVelocityLoc);
            this.gl.vertexAttribPointer(pointVelocityLoc, 3, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointSizeBuffer);
            this.gl.enableVertexAttribArray(pointSizeLoc);
            this.gl.vertexAttribPointer(pointSizeLoc, 1, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointColorBuffer);
            this.gl.enableVertexAttribArray(pointColorLoc);
            this.gl.vertexAttribPointer(pointColorLoc, 3, this.gl.FLOAT, false, 0, 0);
            
            // Set uniforms
            this.gl.uniformMatrix4fv(pointModelViewMatrixLoc, false, createModelViewMatrix());
            this.gl.uniformMatrix4fv(pointProjectionMatrixLoc, false, createProjectionMatrix());
            this.gl.uniform1f(pointTimeLoc, time);
            this.gl.uniform2f(pointMouseLoc, mouseNormalized.x, mouseNormalized.y);
            this.gl.uniform1f(pointMovementSpeedLoc, movementSpeed);
            
            // Draw points
            this.gl.drawArrays(this.gl.POINTS, 0, points.length);
        }
        
        // Draw lines using WebGL2
        const drawLines = () => {
            const lines = generateLines();
            if (lines.length === 0) return;
            
            this.gl.useProgram(this.lineProgram);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lineBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(lines), this.gl.DYNAMIC_DRAW);
            
            // Set up attribute pointer
            this.gl.enableVertexAttribArray(linePositionLoc);
            this.gl.vertexAttribPointer(linePositionLoc, 3, this.gl.FLOAT, false, 0, 0);
            
            // Set uniforms
            this.gl.uniformMatrix4fv(lineModelViewMatrixLoc, false, createModelViewMatrix());
            this.gl.uniformMatrix4fv(lineProjectionMatrixLoc, false, createProjectionMatrix());
            
            // Draw lines
            this.gl.drawArrays(this.gl.LINES, 0, lines.length / 3);
        }
        
        const render = (time) => {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            updatePointData();
            drawLines();
            drawPoints(time);
            requestAnimationFrame(render);
        }
        
        // Mouse movement handler
        function handleMouseMove(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            
            // Normalize mouse coordinates to -1 to 1 range
            mouseNormalized.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseNormalized.y = (event.clientY / window.innerHeight) * 2 - 1;
            
            // Update target rotation based on mouse position
            targetRotationY = mouseNormalized.x * mouseSensitivity;
            targetRotationX = mouseNormalized.y * mouseSensitivity * 0.5;
        }
        
        initPoints(pointCount);
        document.addEventListener('mousemove', handleMouseMove);
        requestAnimationFrame(render);
    }

    unload() {
    }
}
