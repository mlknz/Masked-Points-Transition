import pointsVert from './points.vert';
import pointsFrag from './points.frag';

import {createMatrix4, lookAt, makePerspectiveMatrix, multiplyMatrices} from './glMatrixFunctions.js';

let viewPerspectiveMatrixUniform, progressUniform;
let dt, oldTime = 0;
let targetX = 0, targetY = 0, curX = 0, curY = 0, dx, dy, norm, speedMult;
let mouseInside = true, inertia = 1;
let vertexBuffer, vertexBuffer2, colorUniform;

class Points {
    constructor(gl, container, positions, settings) {
        this.gl = gl;
        this.n = settings.pointsCount || 1;
        this.camSpeed = settings.camera.speed || 0;
        this.camAmplitude = settings.camera.amplitude || 0;
        this.camNear = settings.camera.near || 1;
        this.camFar = settings.camera.far || 80;
        this.camFovY = settings.camera.fovy || 1;
        this.camInertiaMult = settings.camera.inertiaMult || 1;

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

        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(pos);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);

        gl.vertexAttribPointer(newPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(newPos);

        this.viewMatrix = createMatrix4();
        this.perpectiveMatrix = createMatrix4();
        this.viewPerspectiveMatrix = createMatrix4();

        this.eyePos = [0, 0, 0];
        this.eyeTargetPos = [0, 0, -settings.camera.targetDistance];
        this.up = [0, 1, 0];

        viewPerspectiveMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, 'viewPerspectiveMatrix');
        progressUniform = this.gl.getUniformLocation(this.shaderProgram, 'progress');

        gl.useProgram(this.shaderProgram);

        const pointSizeUniform = this.gl.getUniformLocation(this.shaderProgram, 'pointSizeMinMax');
        gl.uniform2f(pointSizeUniform, settings.pointSizeMinMax[0], settings.pointSizeMinMax[1]);

        const pointSizeDistUniform = this.gl.getUniformLocation(this.shaderProgram, 'pointSizeDistMinMax');
        gl.uniform2f(pointSizeDistUniform, settings.pointSizeDistMinMax[0], settings.pointSizeDistMinMax[1]);

        colorUniform = this.gl.getUniformLocation(this.shaderProgram, 'color');
        gl.uniform3f(colorUniform, settings.pointsColor[0], settings.pointsColor[1], settings.pointsColor[2]);

        this.resize();
        this.updateCamera(0);

        if (settings.camera.speed) {
            container.addEventListener('mousemove', e => {
                targetX = (e.clientX / window.innerWidth - 0.5) * this.camAmplitude;
                targetY = -(e.clientY / window.innerHeight - 0.5) * this.camAmplitude;
            });
            container.addEventListener('touchmove', e => {
                if (e.changedTouches && e.changedTouches[0]) {
                    targetX = (e.changedTouches[0].clientX / window.innerWidth - 0.5) * this.camAmplitude;
                    targetY = -(e.changedTouches[0].clientY / window.innerHeight - 0.5) * this.camAmplitude;
                }
            });
            container.addEventListener('mouseout', () => {
                mouseInside = false;
            });
            container.addEventListener('mouseleave', () => {
                mouseInside = false;
            });
            container.addEventListener('mouseenter', () => {
                mouseInside = true;
                inertia = 1;
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
        // this.gl.useProgram(this.shaderProgram);
        makePerspectiveMatrix(this.perpectiveMatrix, this.camFovY, window.innerWidth / window.innerHeight, this.camNear, this.camFar);
    }

    updateCamera(t) {
        dt = t - oldTime;
        oldTime = t;

        if (!isNaN(dt) && dt < 1) {
            dx = targetX - curX;
            dy = targetY - curY;
            if (Math.abs(dx) > 0.005 || Math.abs(dy) > 0.005) {
                norm = Math.sqrt(dx * dx + dy * dy);
                dx /= norm;
                dy /= norm;
                speedMult = Math.min(norm * 3, 1);

                curX += dx * dt * this.camSpeed * speedMult * inertia;
                curY += dy * dt * this.camSpeed * speedMult * inertia;
            }
            if (!mouseInside) inertia = Math.max(0, inertia - dt * this.camInertiaMult);

            this.eyePos[0] = curX;
            this.eyePos[1] = curY;

            lookAt(this.viewMatrix, this.eyePos, this.eyeTargetPos, this.up);

            multiplyMatrices(this.viewPerspectiveMatrix, this.perpectiveMatrix, this.viewMatrix);
            this.gl.uniformMatrix4fv(viewPerspectiveMatrixUniform, false, this.viewPerspectiveMatrix);
        }
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

    setColor(c) {
        this.gl.uniform3f(colorUniform, c[0], c[1], c[2]);
    }

    updateProgress(t) {
        this.gl.uniform1f(progressUniform, t);
    }

    render() {
        this.gl.drawArrays(this.gl.POINTS, 0, this.n);
    }
}

export default Points;
