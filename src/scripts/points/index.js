import pointsVert from './points.vert';
import pointsFrag from './points.frag';

import Masker from './masker.js';

let x, y, viewMatrixUniform, perspectiveMatrixUniform, timeUniform;

const n = 500;

class Points {
    constructor(gl) {
        this.gl = gl;
        this.n = n;

        const masker = new Masker();

        const vertices = masker.generateVerticesWithoutMask(this.n);
        const vertices2 = masker.generateVerticesWithoutMask(this.n);

        const vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.concat(vertices2)), gl.STATIC_DRAW);

        // gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.shaderProgram = this.createShaderProgram(gl);

        // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        const pos = gl.getAttribLocation(this.shaderProgram, 'position');
        const newPos = gl.getAttribLocation(this.shaderProgram, 'newPosition');

        // to the currently bound VBO
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(newPos, 3, gl.FLOAT, false, 0, 4 * vertices.length);

        gl.enableVertexAttribArray(pos);
        gl.enableVertexAttribArray(newPos);

        this.viewMatrix = mat4.create();
        this.perpectiveMatrix = mat4.create();

        this.eyePos = vec3.fromValues(0, 0, 0);
        this.eyeTargetPos = vec3.fromValues(0, 0, -2);
        this.up = vec3.fromValues(0, 1, 0);

        perspectiveMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, 'perspectiveMatrix');
        viewMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, 'viewMatrix');
        timeUniform = this.gl.getUniformLocation(this.shaderProgram, 'time');

        gl.useProgram(this.shaderProgram);
        this.updateView({
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        });
        this.resize();

        document.addEventListener('mousemove', e => {
            this.updateView(e);
        });
    }

    resize() {
        this.gl.useProgram(this.shaderProgram);
        mat4.perspective(this.perpectiveMatrix, 1, window.innerWidth / window.innerHeight, 0.5, 21.1); // out, fovy, aspect, near, far

        this.gl.uniformMatrix4fv(perspectiveMatrixUniform, false, this.perpectiveMatrix);
    }

    updateView(e) {
        x = e.clientX / window.innerWidth;
        y = e.clientY / window.innerHeight;

        this.eyePos[0] = -(x - 0.5) * 0.3;
        this.eyePos[1] = +(y - 0.5) * 0.3;

        mat4.lookAt(this.viewMatrix, this.eyePos, this.eyeTargetPos, this.up);

        this.gl.uniformMatrix4fv(viewMatrixUniform, false, this.viewMatrix);
    }

    createShaderProgram(gl) {
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, pointsVert);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, pointsFrag);
        gl.compileShader(fragShader);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);

        return shaderProgram;
    }

    update(t) {
        this.gl.uniform1f(timeUniform, t);
    }

    render() {
        this.gl.drawArrays(this.gl.POINTS, 0, this.n);
    }
}

export default Points;
