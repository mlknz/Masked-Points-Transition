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

        // this.makeImageRequest('http://localhost:9000/assets/images/test4.pbm');
        this.makeImageRequest('https://mlknz.github.io/Masked-Points-Transition/assets/images/test4.pbm');

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

    makeImageRequest(addr) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', addr, true);
        xhr.responseType = 'arraybuffer';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const image = self.parsePBMBinaryImage(xhr.response);
                image.sectors = [];
                for (let i = 0; i < image.data.length; i++) {
                    if (image.data[i]) image.sectors.push(i);
                }

                // hardcode police
                self.points = new Points(gl, image);
            }
        };
        xhr.send();
    }

    parsePBMBinaryImage(response) {
        const data = new Uint8Array(response);
        const str = data.toString();

        const arrayOfUints = str.split(',');

        let rightHeader = false;
        let imageWidth = false;
        let imageHeight = false;

        let comment = false;

        let i, j;

        for (i = 0; i < arrayOfUints.length; i++) {
            if (arrayOfUints[i] === '10') { // new line
                comment = false;
            } else if (!comment) {
                if (arrayOfUints[i] === '35') comment = true; // #
                else if (!rightHeader) {
                    if (arrayOfUints[i] === '80' && arrayOfUints[i + 1] === '52') { // 'P4'
                        rightHeader = true;
                        i++;
                    } else throw new Error('Wrong image format. Should be PBM binary (with P4 header).');
                } else if (!imageWidth) {
                    imageWidth = 0;
                    imageHeight = 0;

                    let cur;
                    j = 0; // corrupted file case
                    while (arrayOfUints[i] !== '32') { // space
                        cur = parseInt(String.fromCharCode(arrayOfUints[i]), 10);
                        if (j > 4 || isNaN(cur)) {
                            throw new Error('Corrupted PBM image (image width / height data).');
                        }
                        imageWidth = imageWidth * 10 + cur;

                        i++;
                        j++;
                    }

                    if (arrayOfUints[i] === '32') i++; // 'if' is left here for readability

                    j = 0;
                    while (arrayOfUints[i] !== '10') { // new line
                        cur = parseInt(String.fromCharCode(arrayOfUints[i]), 10);
                        if (j > 4 || isNaN(cur)) {
                            throw new Error('Corrupted PBM image (image width / height data).');
                        }
                        imageHeight = imageHeight * 10 + cur;

                        i++;
                        j++;
                    }
                } else {
                    break; // iterator points to start of binary data
                }
            }
        }

        const startPos = i;
        const len = arrayOfUints.length - startPos;

        const image = new Array(imageWidth * imageHeight);

        let ld, curRowLength = 0;
        let curColumn = 0;

        for (i = 0; i < len; i++) {
            curRowLength += 8;
            let num = parseInt(arrayOfUints[i + startPos], 10);

            if (curRowLength < imageWidth) {
                for (j = 0; j < 8; j++) {
                    image[curColumn * imageWidth + curRowLength - j - 1] = num % 2; // reverse order
                    num = Math.floor(num / 2);
                }
            } else { // extra 0's for byte alignment at the end of row
                curRowLength -= 8;
                ld = imageWidth - curRowLength;
                for (j = 0; j < 8; j++) {
                    if (j >= 8 - ld) image[curColumn * imageWidth + curRowLength + 8 - j - 1] = num % 2; // reverse order
                    num = Math.floor(num / 2);
                }
                curRowLength = 0;
                curColumn++;
            }
        }

        return {
            data: image,
            width: imageWidth,
            height: imageHeight
        };
    }
}

window.app = new App();
