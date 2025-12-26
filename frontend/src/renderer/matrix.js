import Vector3D from "./vector3d";
import Vector4D from "./vector4d";

export default class Matrix {

    static mat(s = 1.0) {
        return [
            [s, 0, 0, 0],
            [0, s, 0, 0],
            [0, 0, s, 0],
            [0, 0, 0, s]
        ]
    }

    static array(mat) {
        return mat.flat();
    }

    static data(mat) {
        return Float32Array(array(mat));
    }

    static test(mat) {
        let test = (Array.isArray(mat) && mat.length == 4);
        if (!test)
            return test;
        for (const row of mat) {
            if (row.length != 4) {
                test = false;
                break;
            }
        }
        return test;
    }

    static rotate(mat, rad, axis) {
        return Matrix.mul(Matrix.rotationMatrix(axis, rad), mat);
    }

    static rotationMatrix(axis, rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const t = 1.0 - c;

        axis = axis.norm();
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        
        return [
            [t*x*x + c,   t*x*y - s*z, t*x*z + s*y, 0.0],
            [t*x*y + s*z, t*y*y + c,   t*y*z - s*x, 0.0],
            [t*x*z - s*y, t*y*z + s*x, t*z*z + c,   0.0],
            [0.0,         0.0,         0.0,         1.0]
        ];
    }

    static mul(a, b) {
        if (b instanceof Vector4D)
            return new Vector4D(
                a[0][0] * b.x + a[0][1] * b.y + a[0][2] * b.z + a[0][3] * b.w,
                a[1][0] * b.x + a[1][1] * b.y + a[1][2] * b.z + a[1][3] * b.w,
                a[2][0] * b.x + a[2][1] * b.y + a[2][2] * b.z + a[2][3] * b.w,
                a[3][0] * b.x + a[3][1] * b.y + a[3][2] * b.z + a[3][3] * b.w
            );
        else if (Matrix.test(b))
            return [
                [a[0][0]*b[0][0] + a[0][1]*b[1][0] + a[0][2]*b[2][0] + a[0][3]*b[3][0],
                a[0][0]*b[0][1] + a[0][1]*b[1][1] + a[0][2]*b[2][1] + a[0][3]*b[3][1],
                a[0][0]*b[0][2] + a[0][1]*b[1][2] + a[0][2]*b[2][2] + a[0][3]*b[3][2],
                a[0][0]*b[0][3] + a[0][1]*b[1][3] + a[0][2]*b[2][3] + a[0][3]*b[3][3]],
                
                [a[1][0]*b[0][0] + a[1][1]*b[1][0] + a[1][2]*b[2][0] + a[1][3]*b[3][0],
                a[1][0]*b[0][1] + a[1][1]*b[1][1] + a[1][2]*b[2][1] + a[1][3]*b[3][1],
                a[1][0]*b[0][2] + a[1][1]*b[1][2] + a[1][2]*b[2][2] + a[1][3]*b[3][2],
                a[1][0]*b[0][3] + a[1][1]*b[1][3] + a[1][2]*b[2][3] + a[1][3]*b[3][3]],
                
                [a[2][0]*b[0][0] + a[2][1]*b[1][0] + a[2][2]*b[2][0] + a[2][3]*b[3][0],
                a[2][0]*b[0][1] + a[2][1]*b[1][1] + a[2][2]*b[2][1] + a[2][3]*b[3][1],
                a[2][0]*b[0][2] + a[2][1]*b[1][2] + a[2][2]*b[2][2] + a[2][3]*b[3][2],
                a[2][0]*b[0][3] + a[2][1]*b[1][3] + a[2][2]*b[2][3] + a[2][3]*b[3][3]],
                
                [a[3][0]*b[0][0] + a[3][1]*b[1][0] + a[3][2]*b[2][0] + a[3][3]*b[3][0],
                a[3][0]*b[0][1] + a[3][1]*b[1][1] + a[3][2]*b[2][1] + a[3][3]*b[3][1],
                a[3][0]*b[0][2] + a[3][1]*b[1][2] + a[3][2]*b[2][2] + a[3][3]*b[3][2],
                a[3][0]*b[0][3] + a[3][1]*b[1][3] + a[3][2]*b[2][3] + a[3][3]*b[3][3]]
            ];
        else {
            throw new TypeError(`Invalid parameter type: ${typeof b}`);
        }
    }   

    static deg2rad(deg) {
        const pi = 3.14;
        return deg * pi / 180;
    }

    static rad2deg(rad) {
        const pi = 3.14;
        return rad * 180 / pi;
    }

    static rot2dir(horizontal, vertical) {
        let temp = Matrix.rotationMatrix(new Vector3D(1.0, 0.0, 0.0), Matrix.deg2rad(vertical));
        temp = Matrix.rotate(temp, Matrix.deg2rad(-horizontal), new Vector3D(0.0, 0.0, 1.0));
        return (Matrix.mul(temp, new Vector4D(0.0, 1.0, 0.0, 0.0))).xyz();
    }
}
