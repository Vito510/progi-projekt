import Vector from "./vector";
import Vector3D from "./vector3d";

export default class Vector2D extends Vector {
    x;
    y;

    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    norm() {
        if (this.x == 0 && this.y == 0)
            return new Vector2D();
        else
            return Vector3D.div(this, len(this));
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
            if (other instanceof Vector2D) {
                result.x += other.x;
                result.y += other.y;
            }
            else {
                result.x += other;
                result.y += other;
            }
        }
        return result;        
    }

    static sub(a, ...b) {
        let result = a.copy();
        for (let other of b) {
            if (other instanceof Vector2D) {
                result.x -= other.x;
                result.y -= other.y;
            }
            else {
                result.x -= other;
                result.y -= other;
            }
        }
        return result;    
    }

    static mul(a, b) {
        let result = a.copy();
        if (b instanceof Vector2D) {
            result.x *= b.x;
            result.y *= b.y;
        } else {
            result.x *= b;
            result.y *= b;
        }
        return result;    
    }

    static div(a, b) {
        let result = a.copy();
        if (b instanceof Vector2D) {
            result.x /= b.x;
            result.y /= b.y;
        } else {
            result.x /= b;
            result.y /= b;
        }
        return result;
    }
}