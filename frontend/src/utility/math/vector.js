    
export default class Vector {

    constructor() {
    }

    array() {
        return Object.values(this);
    }

    data() {
        return Float32Array(this.array());
    }

    static dot(a, b) {
        let result = 0;
        for (const key in a)
            result += a[key] * b[key];
        return result;
    }

    len() {
        return Math.sqrt(Vector.dot(this, this));
    }
}
