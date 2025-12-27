import Vector from "./vector";
import Vector2D from "./vector2d";
import Vector3D from "./vector3d";

export default class Vector4D extends Vector{
    x;
    y;
    z;
    w;

    constructor(x = 0, y = 0, z = 0, w = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    
    xy() {
        return new Vector2D(this.x, this.y);
    }

    xyz() {
        return new Vector3D(this.x, this.y, this.z);
    }

    copy() {
        return new Vector4D(this.x, this.y, this.z, this.w);
    }

    norm() {
        if (this.x == 0 && this.y == 0 && this.z == 0 && this.w == 0)
            return new Vector4D();
        else
            return Vector4D.div(this, len(this));
    }

    static mix(a, b, factor) {
        let result = new Vector2D();
        for (const key in result)
            result[key] = (a[key] * (1.0 - factor)) + (b[key] * factor);
        return result;
    }
    
    static add(...args) {
        let result = new Vector3D();
        for (let other of args) {
            if (other instanceof Vector3D) {
                result.x += other.x;
                result.y += other.y;
                result.z += other.z;
                result.w += other.w;
            }
            else {
                result.x += other;
                result.y += other;
                result.z += other;
                result.w += other;
            }
        }
        return result;        
    }

    static sub(a, ...b) {
        let result = a.copy();
        for (let other of b) {
            if (b instanceof Vector4D) {
                result.x -= other.x;
                result.y -= other.y;
                result.z -= other.z;
                result.w -= other.w;
            }
            else {
                result.x -= other;
                result.y -= other;
                result.z -= other;
                result.w -= other;
            }
        }
        return result;    
    }

    static mul(a, b) {
        let result = a.copy();
        if (b instanceof Vector4D) {
            result.x *= b.x;
            result.y *= b.y;
            result.z *= b.z;
            result.w *= b.w;
        } else {
            result.x *= b;
            result.y *= b;
            result.z *= b;
            result.w *= b;
        }
        return result;    
    }

    static div(a, b) {
        let result = a.copy();
        if (b instanceof Vector4D) {
            result.x /= b.x;
            result.y /= b.y;
            result.z /= b.z;
            result.w /= b.w;
        } else {
            result.x /= b;
            result.y /= b;
            result.x /= b;
            result.w /= b;
        }
        return result;
    }

}