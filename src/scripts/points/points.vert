attribute vec3 position;
attribute vec3 newPosition;

uniform mat4 viewPerspectiveMatrix;

uniform vec2 pointSizeMinMax;
uniform float progress;

varying float dist;

void main() {

    vec3 pos = mix(position, newPosition, sin(progress)*0.5 + 0.5);
    dist = 1. - (-pos.z - 1.) / 10.; // [0, 1]

    gl_Position = viewPerspectiveMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(pointSizeMinMax.y, pointSizeMinMax.x, dist);
}
