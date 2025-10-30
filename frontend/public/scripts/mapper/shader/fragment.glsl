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
    float shading_mode;
    float padding_a;
    float padding_b;

    float height_offset;
    float height_multiplier;
    float height_gamma;
    float height_invert;

    float fade_blend;
    float voxel_blend;
    float grayscale_blend;
    float normals_epsilon;
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
in vec2 texture_coordinates;
out vec4 output_color;

vec4 traverse(Ray ray);
vec2 intersect(Ray ray, vec3 p_min, vec3 p_max);
vec3 getNormal(vec3 position, float epsilon);
float getHeight(vec3 position);

void main() {
    float aspect_ratio = uniforms.canvas_size.y / uniforms.canvas_size.x;
    vec2 centered_coordinates = (texture_coordinates - 0.5) * 2.0 * vec2(1.0, aspect_ratio);
    
    Ray camera_ray;
    camera_ray.origin = uniforms.camera_position;
    camera_ray.origin *= uniforms.grid_scale;
    camera_ray.origin += uniforms.grid_size * vec3(0.5, 0.5, 0.0) * uniforms.grid_scale;
    camera_ray.direction = (uniforms.camera_rotation * vec4(normalize(vec3(centered_coordinates.x * uniforms.fov, 1.0, centered_coordinates.y * uniforms.fov)), 1.0)).xyz;
    camera_ray.inverse = 1.0 / camera_ray.direction;

    vec4 r = traverse(camera_ray);
    vec3 position = camera_ray.origin + camera_ray.direction * r.w;
    vec3 sun = normalize(vec3(1.0, 0.5, 0.0));
    float voxel = mix(1.0, abs(dot(r.xyz, normalize(vec3(1.0, 0.5, 0.75)))), uniforms.voxel_blend);
    if (r.w > 0.0) {
        if (uniforms.shading_mode == 1.0) {
            float height = mix(1.0, position.z / (uniforms.grid_size.z * uniforms.height_multiplier * uniforms.grid_scale), uniforms.fade_blend);
            vec3 normal = getNormal(position, uniforms.normals_epsilon);
            float diffuse = dot(normal, sun) * 0.5 + 0.5;
            output_color = vec4(vec3(diffuse * height * voxel), 1.0);
        } else if (uniforms.shading_mode == 2.0) {
            vec3 normal = getNormal(position, uniforms.normals_epsilon) * 0.5 + 0.5;
            output_color = vec4(normal * voxel, 1.0);
        } else if (uniforms.shading_mode == 3.0) {
            vec3 color = texture(height_texture, (vec2(1.0, 0.0) - position.xy / (uniforms.grid_size.xy * uniforms.grid_scale)) * vec2(1.0, -1.0)).xyz;
            float value = (color.r + color.g + color.b) / 3.0;
            output_color = vec4(mix(color, vec3(value), uniforms.grayscale_blend) * voxel, 1.0);
        } else {
            float height = mix(1.0, position.z / (uniforms.grid_size.z * uniforms.height_multiplier * uniforms.grid_scale), uniforms.fade_blend);
            output_color = vec4(vec3(voxel * height), 1.0);
        }
    } else {
        output_color = vec4(0.0);
    }
}

vec4 traverse(Ray ray) {
    vec3 normal = vec3(0.0, 0.0, 1.0);

    vec2 bbox_t = intersect(ray, vec3(0.0), uniforms.grid_size * uniforms.grid_scale);
    if (bbox_t.x > bbox_t.y) {
        return vec4(normal, -1.0);
    }

    vec3 position = floor(ray.origin + ray.direction * (bbox_t.x + 0.01));
    vec3 march = sign(ray.inverse);
    vec3 delta = (ray.inverse) * march;
    vec3 select = march * 0.5 + 0.5;
    vec3 planes = position + select;
    vec3 limit = floor(uniforms.grid_size * uniforms.grid_scale);
    vec3 t = (planes - ray.origin) * ray.inverse;

    while (true) {
        if (position.z <= getHeight(position)) {
            return vec4(normal, length(ray.origin - position));
        }

        if (t.x < t.y) {
            if (t.x < t.z) {
                position.x += march.x;
                if (position.x > limit.x || position.x < 0.0)
                    return vec4(normal, -1.0);
                t.x += delta.x;
                normal = vec3(-march.x, 0.0, 0.0);
            } else {
                position.z += march.z;
                if (position.z > limit.z || position.z < 0.0)
                    return vec4(normal, -1.0);
                t.z += delta.z;
                normal = vec3(0.0, 0.0, -march.z);
            }
        } else {
            if (t.y < t.z) {
                position.y += march.y;
                if (position.y > limit.y || position.y < 0.0)
                    return vec4(normal, -1.0);
                t.y += delta.y;
                normal = vec3(0.0, -march.y, 0.0);
            } else {
                position.z += march.z;
                if (position.z > limit.z || position.z < 0.0)
                    return vec4(normal, -1.0);
                t.z += delta.z;
                normal = vec3(0.0, 0.0, -march.z);
            }
        }
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
    // float height = 256.0 * (data.r + data.g + data.b) / 3.0; // average
    // float height = (data.r * 256.0 + data.g + data.b / 256.0); // first
    float height = (data.r * 256.0 + data.g) * 256.0; // second
    if (uniforms.height_invert == 1.0)
        height = (uniforms.grid_size.z + 2.0) * uniforms.height_invert - height;
    return (height + uniforms.height_offset) * uniforms.height_multiplier * uniforms.grid_scale;
}

vec3 getNormal(vec3 position, float epsilon) {
    vec3 normal;
	normal.x = getHeight(position + vec3(epsilon, 0.0, 0.0)) - getHeight(position - vec3(epsilon, 0.0, 0.0));
	normal.y = getHeight(position + vec3(0.0, epsilon, 0.0)) - getHeight(position - vec3(0.0, epsilon, 0.0));
	normal.z = 2.0 * epsilon;
    return normalize(normal / vec3(2.0 * epsilon));
}
