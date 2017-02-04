if (module.hot) {
    module.hot.accept();
}

import Points from './points';

const initGlContext = require('./webgldetection');

class App {
    constructor() {
        const canvas = document.getElementById('canvas');
        const gl = initGlContext(canvas);
        if (!gl) {
            document.body.innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
            return;
        }
        this.initGlState(gl);

        const points = new Points(gl);
        const devicePixelRatio = window.devicePixelRatio || 1;

        function resize() {
            const width = Math.floor(canvas.clientWidth * devicePixelRatio);
            const height = Math.floor(canvas.clientHeight * devicePixelRatio);

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                points.resize();
            }
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }

        let time = 0;

        function animate() {
            resize();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            time = (new Date()).getTime();
            time = (time - Math.floor(time / 1000000) * 1000000) / 1000;

            gl.useProgram(points.shaderProgram);
            points.update(time);
            points.render();

            requestAnimationFrame(animate);
        }

        animate();
    }

    initGlState(gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        // gl.enable(gl.DEPTH_TEST); // todo: might need to disable
    }
}

window.app = new App();
