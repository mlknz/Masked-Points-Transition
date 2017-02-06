if (module.hot) {
    module.hot.accept();
}

const initGlContext = require('./webgldetection');
const GeometryBuilderWorker = require('worker!./geometryBuilderWorker/index.js');

import Points from './points';

let gl = null;
let canvas, width, height;
let time = 0;
const devicePixelRatio = window.devicePixelRatio || 1;
let self;

class App {
    constructor() {
        self = this;
        canvas = document.getElementById('canvas');
        gl = initGlContext(canvas);
        if (!gl) {
            document.body.innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
            return;
        }
        this.initGlState();

        // this.makeImageRequest('http://192.168.0.17:9000/assets/images/test4.pbm');
        // this.makeImageRequest('https://mlknz.github.io/Masked-Points-Transition/assets/images/test4.pbm');

        const worker = new GeometryBuilderWorker();
        worker.addEventListener('error', (e) => {
            console.warn('Error in webworker: ', e.data);
        }, false);

        worker.addEventListener('message', (e) => {
            if (e.data.geometries) {
                self.points = new Points(gl, e.data.geometries, 2500);
            }
        }, false);

        worker.postMessage({
            pointsCount: 2500,
            states: [
                {
                    type: 'box'
                },
                {
                    type: 'maskedBox',
                    imageUrl: 'https://mlknz.github.io/Masked-Points-Transition/assets/images/test4.pbm'
                }
            ]
        });

        this.animate();
    }

    initGlState() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        // gl.enable(gl.DEPTH_TEST);
    }

    resize() {
        width = Math.floor(canvas.clientWidth * devicePixelRatio);
        height = Math.floor(canvas.clientHeight * devicePixelRatio);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            if (this.points) this.points.resize();
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    animate() {
        self.resize();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        time = (new Date()).getTime();
        time = (time - Math.floor(time / 1000000) * 1000000) / 1000;

        if (self.points) {
            gl.useProgram(self.points.shaderProgram);
            self.points.update(time);
            self.points.render();
        }

        requestAnimationFrame(self.animate);
    }

}

window.app = new App();
