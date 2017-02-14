if (module.hot) {
    module.hot.accept();
}

const initGlContext = require('./webgldetection');
const GeometryBuilderWorker = require('worker-loader?inline=only!./geometryBuilderWorker/index.js');
import Points from './points';

const readyEvent = new Event('maskedPointsReady');
const devicePixelRatio = window.devicePixelRatio || 1;

let self, settings, canvas, width, height, gl = null;

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
            console.warn('Error at Masked Points: Unable to initialize WebGL. Your browser may not support it.');
            return;
        }
        this._initGlState();

        const worker = new GeometryBuilderWorker();
        worker.addEventListener('error', (e) => {
            console.warn('Error in webworker: ', e.data);
        }, false);

        worker.addEventListener('message', (e) => {
            if (e.data.geometries) {
                self.points = new Points(gl, mouseListenerContainer, e.data.geometries, settings);
                document.dispatchEvent(readyEvent);
            }
        }, false);

        worker.postMessage(settings);
    }

    _initGlState() {
        const c = settings.backgroundColor;
        gl.clearColor(c[0], c[1], c[2], 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        // gl.enable(gl.DEPTH_TEST);
    }

    _resize() {
        width = Math.floor(canvas.clientWidth * devicePixelRatio);
        height = Math.floor(canvas.clientHeight * devicePixelRatio);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            if (this.points) this.points.resize();
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    render() {
        self._resize();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (self.points) self.points.render();
    }

    updateCamera(time) {
        if (self.points) self.points.updateCamera(time);
    }

    setBlendStates(i, j) {
        self.points.setPositionIndices(i, j);
    }

    updateBlendProgress(t) {
        if (self.points) self.points.updateProgress(t);
    }

}

window.maskedPoints = {};
window.maskedPoints.init = (s) => {
    return new App(s);
};
