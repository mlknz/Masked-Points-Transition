precision highp float;

uniform vec3 color;
varying float dist;

void main() {

    vec2 coord = gl_PointCoord - vec2(0.5);
    float inCircle = 1. - smoothstep(0.495, 0.500, length(coord));
    // if (length(coord) > 0.5) inCircle = 0.;

    if (inCircle < 0.95) discard;
    gl_FragColor.rgb = vec3(mix(0., 1. - dist, inCircle)) * color;

    gl_FragColor.a = mix(1., 1. - dist, inCircle);
}
