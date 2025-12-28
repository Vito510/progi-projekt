import Vector2D from "../../utility/math/vector2d";
import Vector3D from "../../utility/math/vector3d";

export default function rayCast(heightmap, coordinates, uniforms) {
    // ...
}

function traverse(origin, direction) {
    // ...
}

function intersect(origin, direction, aabb_min, aabb_max) {
    const t = new Vector2D(0.0, Infinity);
    for (const key in aabb_min) {
        const t1 = Vector3D.div(Vector3D.sub(aabb_min[key], origin[key]) / direction[key]);
        const t2 = Vector3D.div(Vector3D.sub(aabb_max[key], origin[key]) / direction[key]);
        t.x = Math.max(t.x, Math.min(t1, t2));
        t.y = Math.min(t.y, Math.max(t1, t2));
    }
    return t;
}

function getHeight(position) {
    // ...
}