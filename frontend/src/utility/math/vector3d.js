import Vector from "./vector";
import Vector2D from "./vector2d";

export default class Vector3D extends Vector {
    x;
    y;
    z;

    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    xy() {
        return new Vector2D(this.x, this.y);
    }

    copy() {
        return new Vector3D(this.x, this.y, this.z);
    }

    norm() {
        if (this.x == 0 && this.y == 0 && this.z == 0)
            return new Vector3D();
        else
            return Vector3D.div(this, this.len());
    }

    floor() {
        let result = new Vector3D();
        for (const key in this)
            result[key] = Math.floor(this[key]);
        return result;
    }

    sign() {
        let result = new Vector3D();
        for (const key in this)
            result[key] = Math.sign(this[key]);
        return result;
    }
    
    static cross(a, b) {
        return vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }
    
    static add(...args) {
        let result = new Vector3D();
        for (let other of args) {
            if (other instanceof Vector3D) {
                result.x += other.x;
                result.y += other.y;
                result.z += other.z;
            }
            else {
                result.x += other;
                result.y += other;
                result.z += other;
            }
        }
        return result;        
    }

    static sub(a, ...b) {
        let result = a.copy();
        for (let other of b) {
            if (other instanceof Vector3D) {
                result.x -= other.x;
                result.y -= other.y;
                result.z -= other.z;
            }
            else {
                result.x -= other;
                result.y -= other;
                result.z -= other;
            }
        }
        return result;    
    }

    static mul(a, b) {
        let result = a.copy();
        if (b instanceof Vector3D) {
            result.x *= b.x;
            result.y *= b.y;
            result.z *= b.z;
        } else {
            result.x *= b;
            result.y *= b;
            result.z *= b;
        }
        return result;    
    }

    static div(a, b) {
        let result = a.copy();
        if (b instanceof Vector3D) {
            result.x /= b.x;
            result.y /= b.y;
            result.z /= b.z;
        } else {
            result.x /= b;
            result.y /= b;
            result.z /= b;
        }
        return result;
    }
}