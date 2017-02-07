if (module.hot) {
    module.hot.accept();
}

const initGlContext = require('./webgldetection');
const GeometryBuilderWorker = require('worker-loader?inline=only!./geometryBuilderWorker/index.js');

import Points from './points';

let gl = null;
let canvas, width, height;
let time = 0;
let self;
const devicePixelRatio = window.devicePixelRatio || 1;

const settings = {
    pointsCount: 1500,
    pointSizeMin: 5,
    pointSizeMax: 10,

    backgroundColor: [0, 0, 0, 1],
    pointsColor: [1, 1, 1],

    states: [
        {
            type: 'box',
            width: 10,
            height: 10,
            depth: 10,
            zDistance: 5
        },
        {
            type: 'box',
            width: 10,
            height: 10,
            depth: 10,
            zDistance: 5
        },
        {
            type: 'box',
            width: 50,
            height: 50,
            depth: 1,
            zDistance: -1
        },
        {
            type: 'maskedBoxFromImage',
            imageUrl: 'https://mlknz.github.io/Masked-Points-Transition/assets/images/test4.pbm',
            width: 10,
            height: 10,
            depth: 0.1,
            zDistance: 12
        },
        {
            type: 'maskedBoxFromMatrix',
            matrix: [1, 1, 1, 0, 0, 1, 1, 0, 1],
            matrixWidth: 3,
            matrixHeight: 3,
            width: 10,
            height: 10,
            depth: 0.1,
            zDistance: 12
        }
    ]
}; // 'http://192.168.0.17:9000/assets/images/test4.pbm'

class App { // todo: smooth camera
    constructor() {
        self = this;
        canvas = document.getElementById('canvas');
        gl = initGlContext(canvas);
        if (!gl) {
            document.body.innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
            return;
        }
        this.initGlState();

        const worker = new GeometryBuilderWorker();
        // const worker = new Worker(window.URL.createObjectURL(new Blob([
        //     workerScript
        // ])));
        worker.addEventListener('error', (e) => {
            console.warn('Error in webworker: ', e.data);
        }, false);

        worker.addEventListener('message', (e) => {
            if (e.data.geometries) {
                // todo: throw event
                self.points = new Points(gl, e.data.geometries, settings);
                self.points.setPositionIndices(4, 2);
            }
        }, false);

        worker.postMessage(settings);

        this.animate();
    }

    initGlState() {
        const c = settings.backgroundColor;
        gl.clearColor(c[0], c[1], c[2], c[3]);
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
            self.points.updateProgress(time);
            self.points.render();
        }

        requestAnimationFrame(self.animate);
    }

}

window.app = new App();
