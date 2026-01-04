#version 300 es
precision highp float;

layout(std140) uniform UniformBlock {
    vec2 canvas_size;
    vec2 buffer_size;

    vec3 grid_size;
    float render_scale;

    mat4 camera_rotation;
    vec3 camera_position;
    float fov;

    float grid_scale;
    float height_offset;
    float height_multiplier;
    float normals_epsilon;

    float max_steps;
} uniforms;

struct Ray {
    vec3 origin;
    vec3 direction;
    vec3 inverse;
};
struct Data {
    vec3 position;
    bool collided;
    int marches;
};

uniform sampler2D height_texture;
uniform sampler2D path_texture;
in vec2 texture_coordinates;
out vec4 output_color;

vec3 traverse(Ray ray);
vec2 intersect(Ray ray, vec3 p_min, vec3 p_max);
vec3 getNormal(vec3 position, float epsilon);
float getHeight(vec3 position);
vec3 rayPlaneIntersection(vec3 ray_origin, vec3 ray_direction, vec3 plane_point, vec3 plane_normal);

void main() {
    float aspect_ratio = uniforms.canvas_size.y / uniforms.canvas_size.x;
    vec2 centered_coordinates = (texture_coordinates - 0.5) * 2.0 * vec2(1.0, aspect_ratio);
    
    Ray camera_ray;
    camera_ray.origin = uniforms.camera_position;
    camera_ray.origin *= uniforms.grid_scale;
    camera_ray.origin += uniforms.grid_size * vec3(0.5, 0.5, 0.0) * uniforms.grid_scale;
    camera_ray.direction = (uniforms.camera_rotation * vec4(normalize(vec3(centered_coordinates.x * uniforms.fov, 1.0, centered_coordinates.y * uniforms.fov)), 1.0)).xyz;
    camera_ray.inverse = 1.0 / camera_ray.direction;

    // float t = traverse(camera_ray);
    vec3 position = traverse(camera_ray);
    if (position.x != -1.0) {
        // vec3 position = camera_ray.origin + camera_ray.direction * t;
        vec3 normal = getNormal(position, uniforms.normals_epsilon);
        vec3 sun = normalize(vec3(1.0, 0.5, 0.0));
        float diffuse = dot(normal, sun) * 0.5 + 0.5;
        
        vec3 limit = floor(uniforms.grid_size * uniforms.grid_scale);
        float padding = 3.0 * uniforms.grid_scale;
        float border = float((position.x < (limit.x - padding)) && (position.x > padding) && (position.y < (limit.y - padding)) && (position.y > padding));

        vec4 path = texture(path_texture, position.xy / uniforms.grid_size.xy / uniforms.grid_scale);

        float height = mix(0.0, 1.5, position.z / (uniforms.grid_size.z * uniforms.grid_scale));

        output_color = vec4(mix(vec3(diffuse * border * height), path.xyz, path.w), 1.0);
    } else {
        vec3 point = rayPlaneIntersection(camera_ray.origin, camera_ray.direction, vec3(0.0), vec3(0.0, 0.0, 1.0));
        if (point.z != 0.0) {
            float grid_scale = 32.0;
            float grid_thickness = 2.0;
            float grid_distance = 1536.0;

            float grid = float(mod(point.x, grid_scale * uniforms.grid_scale) < grid_thickness * uniforms.grid_scale || mod(point.y, grid_scale * uniforms.grid_scale) < grid_thickness * uniforms.grid_scale);
            float dist = 1.0 - clamp(length(camera_ray.origin - point) / (grid_distance * uniforms.grid_scale), 0.0, 1.0);
            output_color = vec4(vec3(grid * dist * 0.5), grid * dist);
        }
        else {
            output_color = vec4(0.0);
        }
    }
}

vec3 traverse(Ray ray) {

    vec2 bbox_t = intersect(ray, vec3(0.0), uniforms.grid_size * uniforms.grid_scale);
    if (bbox_t.x > bbox_t.y)
        return vec3(-1.0);

    vec3 position = floor(ray.origin + ray.direction * (bbox_t.x + 0.01));
    vec3 march = sign(ray.inverse);
    vec3 delta = (ray.inverse) * march;
    vec3 select = march * 0.5 + 0.5;
    vec3 planes = position + select;
    vec3 limit = floor(uniforms.grid_size * uniforms.grid_scale);
    vec3 t = (planes - ray.origin) * ray.inverse;

    int axis;
    int steps = int(uniforms.max_steps);
    for (int i = 0; i < steps; i++) {
        if (t.x < t.y) {
            if (t.x < t.z) {
                position.x += march.x;
                t.x += delta.x;
                axis = 0;
            } else {
                position.z += march.z;
                t.z += delta.z;
                axis = 2;
            }
        } else {
            if (t.y < t.z) {
                position.y += march.y;
                t.y += delta.y;
                axis = 1;
            } else {
                position.z += march.z;
                t.z += delta.z;
                axis = 2;
            }
        }

        if (position.z <= getHeight(position)) {
            vec3 mask = vec3(0.0);
            mask[axis] = 1.0;
            return ray.origin + ray.direction * (dot(t, mask) - dot(delta, mask) + 0.01);
        }

        if (position.x > limit.x || position.x < 0.0 || position.y > limit.y || position.y < 0.0 || position.z > limit.z || position.z < 0.0)
            return vec3(-1.0);
    }
}

vec2 intersect(Ray ray, vec3 p_min, vec3 p_max) {
    vec2 t = vec2(0.0, 1.0 / 0.0);
    for (int i = 0; i < 3; i++) {
        float t1 = (p_min[i] - ray.origin[i]) * ray.inverse[i];
        float t2 = (p_max[i] - ray.origin[i]) * ray.inverse[i];
        t.x = max(t.x, min(t1, t2));
        t.y = min(t.y, max(t1, t2));
    }
    return t;
}

float getHeight(vec3 position) {
    vec4 data = texture(height_texture, (vec2(1.0, 0.0) - position.xy / (uniforms.grid_size.xy * uniforms.grid_scale)) * vec2(1.0, -1.0));
    float height = (data.r * 256.0 + data.g) * 256.0;
    return (height + uniforms.height_offset) * uniforms.height_multiplier * uniforms.grid_scale;
}

vec3 getNormal(vec3 position, float epsilon) {
    vec3 normal;
	normal.x = getHeight(position + vec3(epsilon, 0.0, 0.0)) - getHeight(position - vec3(epsilon, 0.0, 0.0));
	normal.y = getHeight(position + vec3(0.0, epsilon, 0.0)) - getHeight(position - vec3(0.0, epsilon, 0.0));
	normal.z = 2.0 * epsilon;
    return normalize(normal / vec3(2.0 * epsilon));
}

vec3 rayPlaneIntersection(vec3 ray_origin, vec3 ray_direction, vec3 plane_point, vec3 plane_normal) {
    ray_direction = normalize(ray_direction);
    plane_normal = normalize(plane_normal);

    float d = dot(ray_direction, plane_normal);
    if (abs(d) < 1e-6)
        return vec3(0.0);

    float t = dot(plane_point - ray_origin, plane_normal) / d;
    if (t < 0.0)
        return vec3(0.0);

    return ray_origin + ray_direction * t;
}






// bool traversal(vec3 origin, vec3 dir, out vec3 color, inout uint steps) {
//     vec3 inv_dir = 1. / dir;
//     vec3 sgn_dir = sign(inv_dir);
//     inv_dir = clamp(inv_dir, vec3(-FLT_MAX), vec3(FLT_MAX));

//     vec3 t1 = -origin * inv_dir;
//     vec3 t2 = (vec3(pc.voxel_resolution) - origin) * inv_dir;

//     vec3 tmins = min(t1, t2);
//     vec3 tmaxs = max(t1, t2);

//     float tmin = 0;
//     float tmax = FLT_MAX;
//     for (int i = 0; i < 3; i++) {
//         tmin = max(tmin, tmins[i]);
//         tmax = min(tmax, tmaxs[i]);
//     }

//     if (tmin > tmax) {
//         return false;
//     }

//     uint stepped_axis;
//     if (tmins.x < tmins.y) {
//         if (tmins.x < tmins.z) {
//             stepped_axis = 0;
//         } else {
//             stepped_axis = 2;
//         }
//     } else {
//         if (tmins.y < tmins.z) {
//             stepped_axis = 1;
//         } else {
//             stepped_axis = 2;
//         }
//     }

//     origin += dir * tmin;
//     uvec3 coord = uvec3(clamp(floor(origin), vec3(0), vec3(pc.voxel_resolution - 1)));
//     vec3 t = (coord + 0.5 * (1 + sgn_dir) - origin) * inv_dir;

//     uvec3 ustep = uvec3(ivec3(sgn_dir));
//     vec3 delta = inv_dir * sgn_dir;

//     ivec3 texel_coord = ivec3(coord.x / 4, coord.y / 4, coord.z / 8);
//     uvec4 texel = imageLoad(voxelImage, texel_coord);
//     bool instantHit = bool(texel[coord.x % 4] >> ((coord.y % 4) + (coord.z % 8) * 4) & 1u);
//     if (!instantHit)
//     while (true) {
//         steps++;

//         if (t.x < t.y) {
//             if (t.x < t.z) {
//                 coord.x += ustep.x;
//                 t.x += delta.x;
//                 stepped_axis = 0;
//             } else {
//                 coord.z += ustep.z;
//                 t.z += delta.z;
//                 stepped_axis = 2;
//             }
//         } else {
//             if (t.y < t.z) {
//                 coord.y += ustep.y;
//                 t.y += delta.y;
//                 stepped_axis = 1;
//             } else {
//                 coord.z += ustep.z;
//                 t.z += delta.z;
//                 stepped_axis = 2;
//             }
//         }

//         if (any(greaterThanEqual(coord, uvec3(pc.voxel_resolution))))
//         return false;
//         if (readVoxel(coord, texel, texel_coord))
//         break;
//     }

//     vec3 mask = vec3(0);
//     mask[stepped_axis] = 1;
//     float t_inside = dot(t, mask) - dot(delta, mask);

//     switch (pc.render_mode) {
//         case COORD:
//         color = vec3(coord) / vec3(pc.voxel_resolution - 1);
//         break;
//         case NORMAL:
//         vec3 normal = -mask * sgn_dir;
//         color = max(normal.xyz, 0) - min(normal.yxz + normal.zyx, 0);
//         break;
//         case UV:
//         vec3 hit = origin + dir * t_inside;
//         vec3 local_hit = hit - coord;
//         vec2 uv;
//         if (stepped_axis == 0) {
//             uv = local_hit.yz;
//         } else if (stepped_axis == 1) {
//             uv = local_hit.xz;
//         } else {
//             uv = local_hit.xy;
//         }
//         color = vec3(uv, 0);
//         break;
//         case DEPTH:
//         float depth = (tmin + t_inside) * length(dir);
//         color = vec3(1 / (1 + depth / pc.voxel_resolution)) + vec3(0.3, 0.0, 0.7) / 256;
//         break;
//     }
//     return true;
// }