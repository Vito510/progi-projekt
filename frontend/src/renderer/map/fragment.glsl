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

float traverse(Ray ray);
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

    float t = traverse(camera_ray);
    vec3 position = camera_ray.origin + camera_ray.direction * t;
    vec3 sun = normalize(vec3(1.0, 0.5, 0.0));
    if (t > 0.0) {
        vec3 normal = getNormal(position, uniforms.normals_epsilon);
        float diffuse = dot(normal, sun) * 0.5 + 0.5;
        float mask = float((position.x < (uniforms.grid_size.x - 3.0)) && (position.x > 3.0) && (position.y < (uniforms.grid_size.y - 3.0)) && (position.y > 3.0));
        vec4 path = texture(path_texture, position.xy / uniforms.grid_size.xy / uniforms.grid_scale);
        vec3 color = mix(vec3(diffuse * mask), path.xyz, path.w);
        output_color = vec4(color, 1.0);
    } else {
        output_color = vec4(0.0);
    }
}

float traverse(Ray ray) {

    vec2 bbox_t = intersect(ray, vec3(0.0), uniforms.grid_size * uniforms.grid_scale);
    if (bbox_t.x > bbox_t.y) {
        return -1.0;
    }

    vec3 position = floor(ray.origin + ray.direction * (bbox_t.x + 0.01));
    vec3 march = sign(ray.inverse);
    vec3 delta = (ray.inverse) * march;
    vec3 select = march * 0.5 + 0.5;
    vec3 planes = position + select;
    vec3 limit = floor(uniforms.grid_size * uniforms.grid_scale);
    vec3 t = (planes - ray.origin) * ray.inverse;

    const int max_steps = 2000;
    for (int i = 0; i < max_steps; i++) {
        if (position.z <= getHeight(position)) {
            return length(ray.origin - position);
        }

        if (t.x < t.y) {
            if (t.x < t.z) {
                position.x += march.x;
                if (position.x > limit.x || position.x < 0.0)
                    return -1.0;
                t.x += delta.x;
            } else {
                position.z += march.z;
                if (position.z > limit.z || position.z < 0.0)
                    return -1.0;
                t.z += delta.z;
            }
        } else {
            if (t.y < t.z) {
                position.y += march.y;
                if (position.y > limit.y || position.y < 0.0)
                    return -1.0;
                t.y += delta.y;
            } else {
                position.z += march.z;
                if (position.z > limit.z || position.z < 0.0)
                    return -1.0;
                t.z += delta.z;
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
