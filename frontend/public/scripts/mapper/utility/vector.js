    
export function vec(...args) {
    let result = {}
    const letters = "xyzw";
    args = args.flat();

    if (args === undefined || args === null)
        return {x: 0, y: 0, z: 0};
    else if (args.length > letters.length)
        throw new RangeError("Resulting vector is too big!");   
    else if (args.length == 1)
        result = {x: args[0], y: args[0], z: args[0]};
    else
        for (let i=0; i<args.length; i++)
            result[letters[i]] = args[i];

    return result;
}

export function copy(v) {
    let result = {};
    for (const el in v)
        result[el] = v[el];
    return result;
}

export function array(v) {
    return Object.values(v);
}

export function data(v) {
    return Float32Array(array(v));
}

export function test(v) {
    return (
        v !== null && typeof v === 'object' &&
        'x' in v && typeof v.x === 'number' &&
        'y' in v && typeof v.y === 'number'
    );
}

export function xyz(v) {
    return vec(v.x, v.y, v.z);
}

export function xy(v) {
    return vec(v.x, v.y);
}

export function dot(a, b) {
    let result = 0;
    for (const el in a)
        result += a[el] * b[el];
    return result;
}

export function len(v) {
    return Math.sqrt(dot(v, v));
}

export function norm(v) {
    if (v.x == 0 && v.y == 0 && v.z == 0)
        return vec(0.0);
    else
        return div(v, len(v));
}

export function mix(a, b, factor) {
    let result = {};
    for (const el in a) {
        const value = (a[el] * (1.0 - factor)) + (b[el] * factor);
        result[el] = value;
    }
    return result;
}

// TODO rewrite
export function add(...args) {
    let result = vec(0.0);
    for (let el of args) {
        if (test(el)) {
            result.x += el.x;
            result.y += el.y;
            result.z += el.z;
        }
        else {
            result.x += el;
            result.y += el;
            result.z += el;
        }
    }
    return result;        
    // let result = {};
    // for (const el in args[0])
    //     result[el] = 0.0;
    // for (const el in result) {
    //     for (const arg of args)
    //         if (test(arg))
    //             result[el] += arg[el];
    //         else
    //             result[el] += arg;
    // }
    // return result;
}

// TODO rewrite
export function sub(a, ...b) {
    let result = a;
    for (let el of b) {
        if (test(el)) {
            result.x -= el.x;
            result.y -= el.y;
            result.z -= el.z;
        }
        else {
            result.x -= el;
            result.y -= el;
            result.z -= el;
        }
    }
    return result;    
    // let result = a;
    // for (const el in a) {
    //     for (const arg of b)
    //         if (test(b))
    //             result[el] -= arg[el];
    //         else
    //             result[el] -= arg;
    // }
    // return result;
}

// TODO rewrite
export function mul(a, b) {
    let result = a;
    if (test(b)) {
        result.x *= b.x;
        result.y *= b.y;
        result.z *= b.z;
    } else {
        result.x *= b;
        result.y *= b;
        result.z *= b;
    }
    return result;    
    // let result = a;
    // for (const el in a) {
    //     if (test(b))
    //         result[el] *= b[el];
    //     else
    //         result[el] *= b;
    // }
    // return result;
}

// TODO rewrite
export function div(a, b) {
    let result = a;
    if (test(b)) {
        result.x /= b.x;
        result.y /= b.y;
        result.z /= b.z;
    } else {
        result.x /= b;
        result.y /= b;
        result.z /= b;
    }
    return result;
    // let result = a;
    // for (const el in a) {
    //     if (test(b))
    //         result[el] /= b[el];
    //     else
    //         result[el] /= b;
    // }
    // return result;
}

export function cross(a, b) {
    return vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

