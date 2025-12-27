import * as TouchListener from './touch.js';
import Matrix from '../../utility/math/matrix.js';
import Vector3D from '../../utility/math/vector3d.js';
import Vector2D from '../../utility/math/vector2d.js';
import Vector4D from '../../utility/math/vector4d.js';

export default class Camera {
    #key_states;

    constructor(
        canvas,
        position = new Vector3D(0.0), 
        rotation = new Vector2D(0.0, 0.0), 
        fov = 0.5, 
        speed = 0.05, 
        sensitivity = 0.2,
        free_mode = false,
        orbit_mode = false,
        orbit_anchor = new Vector3D(0.0, 0.0, 0.0)
    ) {
        this.position = position;
        this.rotation = rotation;
        this.fov = fov;
        this.speed = speed;
        this.sensitivity = sensitivity;

        this.free_mode = free_mode;
        this.orbit_mode = orbit_mode;
        this.orbit_anchor = orbit_anchor;
        this.enabled = true;
        this.#key_states = {};

        document.addEventListener('keydown', (event) => {
            if (event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd' || event.key == 'q' || event.key == 'e')
                this.#key_states[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            if (event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd' || event.key == 'q' || event.key == 'e')
                this.#key_states[event.key] = false;
        });

        canvas.addEventListener('mouseenter', () => {
            this.enabled = true;
        });

        canvas.addEventListener('mouseleave', () => {
            this.enabled = false;
        });

        canvas.addEventListener('mousedown', () => {
            const move_handler = (event) => {
                if (this.orbit_mode)
                    this.updateOrbit(event.movementX, event.movementY);
                else
                    this.updateRotation(-event.movementX, -event.movementY);
            };

            const exit_handler = () => {
                document.removeEventListener("mousemove", move_handler);
                document.removeEventListener("mouseup", exit_handler);
            };

            document.addEventListener("mousemove", move_handler);
            document.addEventListener("mouseup", exit_handler);
        });

        TouchListener.addTouchListener(canvas, (event) => {
            if (this.orbit_mode) 
                this.updateOrbit(event.drag_x, event.drag_y);
            else
                this.updateRotation(-event.drag_x, -event.drag_y);

            if (event.zoom != 0)
                this.position = Vector3D.add(this.position, Vector3D.mul(Matrix.rot2dir(this.rotation.x, -this.rotation.y), this.speed * event.zoom));
        });

        document.addEventListener('wheel', (event) => {
            if (this.enabled) {
                if (this.orbit_mode) {
                    const delta = (event.deltaY < 0) ? 1.0 / 1.1 : 1.1;
                    this.updateOrbit(0.0, 0.0, delta);
                } else {
                    if(event.deltaY < 0)
                        this.speed *= 1.25;
                    else
                        this.speed /= 1.25;
                }
            }
        });
    }

    getRotationMatrix() {
        let temp = Matrix.rotationMatrix(new Vector3D(0.0, 0.0, 1.0), Matrix.deg2rad(this.rotation.x));
        temp = Matrix.rotate(temp, Matrix.deg2rad(this.rotation.y), new Vector3D(1.0, 0.0, 0.0));
        return temp;
    }

    getLocalDirection() {
        let local_direction = new Vector3D(0.0);
        if (!!this.#key_states.w)
            local_direction = Vector3D.add(local_direction, new Vector3D(0.0, 1.0, 0.0));
        if (!!this.#key_states.s)
            local_direction = Vector3D.add(local_direction, new Vector3D(0.0, -1.0, 0.0));
        if (!!this.#key_states.a)
            local_direction = Vector3D.add(local_direction, new Vector3D(-1.0, 0.0, 0.0));
        if (!!this.#key_states.d)
            local_direction = Vector3D.add(local_direction, new Vector3D(1.0, 0.0, 0.0));
        if (!!this.#key_states.q)
            local_direction = Vector3D.add(local_direction, new Vector3D(0.0, 0.0, -1.0));
        if (!!this.#key_states.e)
            local_direction = Vector3D.add(local_direction, new Vector3D(0.0, 0.0, 1.0));

        return local_direction;
    }

    update() {
        if (this.enabled)
            this.updatePosition(this.getLocalDirection());
    }

    updatePosition(local_direction) {
        if (local_direction.len() == 0.0)
            return;

        if (!this.orbit_mode) {
            let forward, up, right;

            if (!this.free_mode) {
                const temp = Matrix.rotate(new Matrix(1.0), Matrix.deg2rad(this.rotation.x), new Vector3D(0.0, 0.0, -1.0));
                forward = (Matrix.mul(temp, new Vector4D(0.0, 1.0, 0.0, 0.0))).xyz();
                up = new Vector3D(0.0, 0.0, 1.0);
                right = Vector3D.cross(forward, up);
            } else {
                forward = Matrix.rot2dir(this.rotation.x, -this.rotation.y);
                up = Matrix.rot2dir(this.rotation.x, -this.rotation.y + 90);
                right = Vector3D.cross(forward, up);
            }

            this.position = Vector3D.add(
                this.position, 
                Vector3D.mul(forward, local_direction.y * this.speed), 
                Vector3D.mul(right, local_direction.x * this.speed), 
                Vector3D.mul(up, local_direction.z * this.speed)
            );
        } else {
            this.updateOrbit(-local_direction.x * this.speed, local_direction.z * this.speed, 1.0 + -0.003 * this.speed * local_direction.y);
        }
    }

    updateRotation(dh = 0.0, dv = 0.0) {
        this.rotation.x += dh * this.sensitivity * Math.min(this.fov, 1.0);
        this.rotation.y += dv * this.sensitivity * Math.min(this.fov, 1.0);
        this.rotation.x = this.rotation.x % 360.0;
        this.rotation.y = Math.max(Math.min(this.rotation.y, 90), -90);
    }

    updateOrbit(dh = 0.0, dv = 0.0, dz = 1.0) {
        const radius = (Vector3D.sub(this.position, this.orbit_anchor)).len() * dz;
        this.updateRotation(dh / this.sensitivity, dv / this.sensitivity);
        this.position = Vector3D.add(Vector3D.mul(Matrix.rot2dir(this.rotation.x, -this.rotation.y), -radius), this.orbit_anchor);
    }
}
