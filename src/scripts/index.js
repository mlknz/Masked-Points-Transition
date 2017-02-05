if (module.hot) {
    module.hot.accept();
}

import Points from './points';

const initGlContext = require('./webgldetection');

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

        this.points = new Points(gl);

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
            this.points.resize();
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    animate() {
        self.resize();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        time = (new Date()).getTime();
        time = (time - Math.floor(time / 1000000) * 1000000) / 1000;

        gl.useProgram(self.points.shaderProgram);
        self.points.update(time);
        self.points.render();

        requestAnimationFrame(self.animate);
    }

    makeImageRequest(addr) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', addr, true);
        xhr.responseType = 'arraybuffer';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.onImageReceive(xhr.response);
            }
        };
        xhr.send();
    }

    onImageReceive(response) {
        console.log(response);
    }
}

window.app = new App();
