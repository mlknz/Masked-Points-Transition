attribute vec3 position;
attribute vec3 newPosition;

uniform mat4 viewPerspectiveMatrix;

uniform vec2 pointSizeMinMax;
uniform vec2 pointSizeDistMinMax;
uniform float progress;

varying float dist;

void main() {
    vec3 pos = mix(position, newPosition, progress);
    dist = clamp((-pos.z - pointSizeDistMinMax.x) / pointSizeDistMinMax.y, 0., 1.);

    gl_Position = viewPerspectiveMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(pointSizeMinMax.y, pointSizeMinMax.x, dist);
}
