if (module.hot) {
    module.hot.accept();
}

const initGlContext = require('./webgldetection');
const GeometryBuilderWorker = require('worker-loader?inline=only!./geometryBuilderWorker/index.js');

import Points from './points';

let gl = null;

let settings, canvas, width, height;
let time = 0;
let self;
const devicePixelRatio = window.devicePixelRatio || 1;

class App {
    constructor(settingsIn) {
        self = this;

        settings = settingsIn;
        canvas = settings.canvas;
        const mouseListenerContainer = settings.mouseListenerContainer || canvas;

        settings.canvas = null;
        settings.mouseListenerContainer = null;

        gl = initGlContext(canvas);
        if (!gl) {
            document.body.innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
            return;
        }
        this.initGlState();

        const worker = new GeometryBuilderWorker();
        worker.addEventListener('error', (e) => {
            console.warn('Error in webworker: ', e.data);
        }, false);

        worker.addEventListener('message', (e) => {
            if (e.data.geometries) {
                self.points = new Points(gl, mouseListenerContainer, e.data.geometries, settings);
                // todo: throw event
                self.points.setPositionIndices(3, 4);
            }
        }, false);

        worker.postMessage(settings);

        this.animate();
    }

    initGlState() {
        const c = settings.backgroundColor;
        gl.clearColor(c[0], c[1], c[2], 1);
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
            self.points.updateCamera(time);
            self.points.render();
        }

        requestAnimationFrame(self.animate);
    }

}

window.maskedPoints = {};
window.maskedPoints.init = (s) => {
    return new App(s);
};
