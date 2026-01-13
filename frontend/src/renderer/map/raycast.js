import ImageUtils from "../../utility/image_utils";
import Matrix from "../../utility/math/matrix";
import Vector2D from "../../utility/math/vector2d";
import Vector3D from "../../utility/math/vector3d";
import Vector4D from "../../utility/math/vector4d";

export default class RayCast {
    
    static rayCast(heightmap, coordinates, uniforms, special = true) {
        const aspect_ratio = uniforms.canvas_size.y / uniforms.canvas_size.x;
        // console.log(coordinates);
        const centered_coordinates = Vector2D.mul(new Vector2D(coordinates.x, coordinates.y), new Vector2D(1.0, -aspect_ratio));

        const origin = Vector3D.add(Vector3D.mul(uniforms.camera_position, uniforms.grid_scale), Vector3D.mul(new Vector3D(0.5, 0.5, 0.0), Vector3D.mul(uniforms.grid_size, uniforms.grid_scale)));
        // let origin = uniforms.camera_position.copy();
        // origin = Vector3D.mul(origin, uniforms.grid_scale);
        // origin = Vector3D.add(origin, Vector3D.mul(uniforms.grid_size, Vector3D.mul(new Vector3D(0.5, 0.5, 0.0), uniforms.grid_scale)));
        
        const temp = (new Vector3D(centered_coordinates.x * uniforms.fov, 1.0, centered_coordinates.y * uniforms.fov)).norm();
        const direction = Matrix.mul(uniforms.camera_rotation, new Vector4D(temp.x, temp.y, temp.z, 1.0)).xyz().norm();
        
        // if (special) {
        //     console.log(uniforms.camera_rotation);
        //     console.log("origin", origin);
        //     console.log("coordinate", centered_coordinates);
        //     console.log("direction", direction);
        //     console.log("");
        // }

        const t = RayCast.#traverse(heightmap, uniforms, origin, direction);
        if (t < 0.0) 
            return null;
        const position = Vector3D.add(origin, Vector3D.mul(direction, t));
        position.z = RayCast.#getHeight(heightmap, uniforms, new Vector3D(position.x, position.y, 0.0));

        const x = position.x / heightmap.width;
        const y = position.y / heightmap.height;
        // const z = (position.z / (uniforms.grid_scale * uniforms.height_multiplier)) - uniforms.height_offset - 32768;
        const z = position.z;
        return new Vector3D(x, y, z);
    }

    static #traverse(heightmap, uniforms, origin, direction) {

        const bbox_t = RayCast.#intersect(origin, direction, new Vector3D(0.0, 0.0, 0.0), Vector3D.mul(uniforms.grid_size, uniforms.grid_scale));
        if (bbox_t.x > bbox_t.y)
            return -1.0;

        const inverse = Vector3D.div(new Vector3D(1.0, 1.0, 1.0), direction);
        let position = Vector3D.add(origin, Vector3D.mul(direction, bbox_t.x + 0.01)).floor();
        const march = inverse.sign();
        const delta = Vector3D.mul(inverse, march);
        const select = Vector3D.add(Vector3D.mul(march, 0.5), 0.5);
        const planes = Vector3D.add(position, select);
        const limit = Vector3D.mul(uniforms.grid_size, uniforms.grid_scale).floor();
        let t = Vector3D.mul(Vector3D.sub(planes, origin), inverse);

        // console.log("direction", direction);
        // console.log("inverse", inverse);
        // console.log("position", position);
        // console.log("march", march);
        // console.log("delta", delta);
        // console.log("select", select);
        // console.log("planes", planes);
        // console.log("limit", limit);
        // console.log("t", t);

        for (let iteration = 0; iteration < uniforms.max_steps; iteration++) {
            if (position.z <= RayCast.#getHeight(heightmap, uniforms, position))
                return Vector3D.sub(origin, position).len();

            if (t.x < t.y) {
                if (t.x < t.z) {
                    position.x += march.x;
                    if (position.x > limit.x || position.x < 0.0)
                    {
                        // console.log("a", position);
                        // console.log("h", RayCast.#getHeight(heightmap, uniforms, position));
                        return -1.0;
                    }
                    t.x += delta.x;
                } else {
                    position.z += march.z;
                    if (position.z > limit.z || position.z < 0.0)
                    {
                        // console.log("b", position);
                        // console.log("h", RayCast.#getHeight(heightmap, uniforms, position));
                        return -1.0;
                    }
                    t.z += delta.z;
                }
            } else {
                if (t.y < t.z) {
                    position.y += march.y;
                    if (position.y > limit.y || position.y < 0.0)
                    {
                        // console.log("c", position);
                        // console.log("h", RayCast.#getHeight(heightmap, uniforms, position));
                        return -1.0;
                    }
                    t.y += delta.y;
                } else {
                    position.z += march.z;
                    if (position.z > limit.z || position.z < 0.0)
                    {
                        // console.log("d", position);
                        // console.log("h", RayCast.#getHeight(heightmap, uniforms, position));
                        return -1.0;
                    }
                    t.z += delta.z;
                }
            }
        }
    }

    static #intersect(origin, direction, aabb_min, aabb_max) {
        const t = new Vector2D(0.0, Infinity);
        for (const key in aabb_min) {
            const t1 = (aabb_min[key] - origin[key]) / direction[key];
            const t2 = (aabb_max[key] - origin[key]) / direction[key];
            t.x = Math.max(t.x, Math.min(t1, t2));
            t.y = Math.min(t.y, Math.max(t1, t2));
        }
        return t;
    }

    static #getHeight(heightmap, uniforms, position) {
        const normalized = Vector2D.mul(Vector2D.sub(new Vector2D(1.0, 0.0), Vector2D.div(position.xy(), Vector2D.mul(uniforms.grid_size.xy(), uniforms.grid_scale))), new Vector2D(1.0, -1.0));
        const scaled = Vector2D.mul(normalized, new Vector2D(heightmap.width, heightmap.height));
        const data = ImageUtils.get(heightmap, scaled.x, scaled.y);
        const height = (data.r * 256.0 + data.g);
        // console.log("coordinates", coordinates);
        // console.log("coordinates2", Vector2D.mul(coordinates, new Vector2D(heightmap.width, heightmap.height)));
        // console.log("heightmap", heightmap);
        // console.log("data", data);
        // console.log("height", height);
        // console.log("final", (height + uniforms.height_offset) * uniforms.height_multiplier * uniforms.grid_scale);
        return (height + uniforms.height_offset) * uniforms.height_multiplier * uniforms.grid_scale;
    }

    static createDebugImage(heightmap, uniforms, width = 100, height = 100) {
        let image = new ImageData(width, height);
        for (let x=0; x<width; x++) {
            for (let y=0; y<height; y++) {
                const coordinates = new Vector2D(((x / width) - 0.5) * 2.0, ((y / height) - 0.5) * 2.0);
                const point = RayCast.rayCast(heightmap, coordinates, uniforms, false);
                const result = 255 * (point ? 1 : 0);

                const offset = (x + width * y) * 4;
                image.data[offset + 0] = result;
                image.data[offset + 1] = result;
                image.data[offset + 2] = result;
                image.data[offset + 3] = 255;
            }
        }
        return image;
    }

}