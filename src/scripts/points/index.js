import pointsVert from './points.vert';
import pointsFrag from './points.frag';

let viewPerspectiveMatrixUniform, progressUniform;
let dt, oldTime = 0;
let targetX = 0, targetY = 0, newX = 0, newY = 0, dx, dy;
let vertexBuffer, vertexBuffer2;

class Points {
    constructor(gl, positions, settings) {
        this.gl = gl;
        this.n = settings.pointsCount || 1;
        this.camSpeed = settings.camera.speed || 0;
        this.camAmplitude = settings.camera.amplitude || 0;
        this.camNear = settings.camera.near || 1;
        this.camFar = settings.camera.far || 80;
        this.camAspect = settings.camera.aspect || 1;

        this.positions = positions;

        vertexBuffer = gl.createBuffer();
        vertexBuffer2 = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, this.positions[0], gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);

        gl.bufferData(gl.ARRAY_BUFFER, this.positions[0], gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.shaderProgram = this.createShaderProgram(gl);

        const pos = gl.getAttribLocation(this.shaderProgram, 'position');
        const newPos = gl.getAttribLocation(this.shaderProgram, 'newPosition');

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0); // to the currently bound VBO
        gl.enableVertexAttribArray(pos);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);

        gl.vertexAttribPointer(newPos, 3, gl.FLOAT, false, 0, 0); // to the currently bound VBO
        gl.enableVertexAttribArray(newPos);

        this.viewMatrix = mat4.create();
        this.perpectiveMatrix = mat4.create();
        this.viewPerspectiveMatrix = mat4.create();

        this.eyePos = vec3.fromValues(0, 0, 0);
        this.eyeTargetPos = vec3.fromValues(0, 0, -settings.camera.targetDistance);
        this.up = vec3.fromValues(0, 1, 0);

        viewPerspectiveMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, 'viewPerspectiveMatrix');
        progressUniform = this.gl.getUniformLocation(this.shaderProgram, 'progress');

        gl.useProgram(this.shaderProgram);

        const pointSizeUniform = this.gl.getUniformLocation(this.shaderProgram, 'pointSizeMinMax');
        this.gl.uniform2f(pointSizeUniform, settings.pointSizeMin, settings.pointSizeMax);

        const colorUniform = this.gl.getUniformLocation(this.shaderProgram, 'color');
        this.gl.uniform3f(colorUniform, settings.pointsColor[0], settings.pointsColor[1], settings.pointsColor[2]);

        this.resize();

        if (settings.camera.speed) {
            document.addEventListener('mousemove', e => {
                targetX = (e.clientX / window.innerWidth - 0.5) * this.camAmplitude;
                targetY = -(e.clientY / window.innerHeight - 0.5) * this.camAmplitude;
            });
        }
    }

    setPositionIndices(ind0, ind1) {
        let i = ind0;
        let j = ind1;
        const gl = this.gl;

        if (!(this.positions[i] && this.positions[j])) {
            i = 0;
            j = 0;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, this.positions[i], gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);

        gl.bufferData(gl.ARRAY_BUFFER, this.positions[j], gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    resize() {
        this.gl.useProgram(this.shaderProgram);
        mat4.perspective(this.perpectiveMatrix, this.camAspect, window.innerWidth / window.innerHeight, this.camNear, this.camFar);
    }

    updateCamera(t) {
        dt = t - oldTime;
        oldTime = t;

        dx = targetX - this.eyePos[0];
        dy = targetY - this.eyePos[1];
        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
            const norm = Math.sqrt(dx * dx + dy * dy);
            dx /= norm;
            dy /= norm;

            newX = this.eyePos[0] + dx * dt * this.camSpeed;
            newY = this.eyePos[1] + dy * dt * this.camSpeed;
        }

        this.eyePos[0] = newX;
        this.eyePos[1] = newY;

        mat4.lookAt(this.viewMatrix, this.eyePos, this.eyeTargetPos, this.up);

        mat4.multiply(this.viewPerspectiveMatrix, this.viewMatrix, this.perpectiveMatrix);
        this.gl.uniformMatrix4fv(viewPerspectiveMatrixUniform, false, this.viewPerspectiveMatrix);
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

    updateProgress(t) {
        this.gl.uniform1f(progressUniform, t);
    }

    render() {
        this.gl.drawArrays(this.gl.POINTS, 0, this.n);
    }
}

export default Points;
