attribute vec3 position;
attribute vec3 newPosition;

uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

uniform float progress;

varying float dist;

void main() {

    vec3 pos = mix(position, newPosition, sin(progress)*0.5 + 0.5);
    dist = (-pos.z - 1.) / 10.; // [0, 1]

    gl_Position = perspectiveMatrix * viewMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(10.0, 5.0, dist);
}
