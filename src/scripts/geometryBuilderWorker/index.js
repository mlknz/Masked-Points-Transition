import ImageParser from './imageParser.js';

self.imageParser = new ImageParser();
self.unprocessedStatesAmount = 1;
self.pointsCount = 1;

self.result = {
    geometries: []
};

self.generateBoxVertices = function(k) {
    const arr = new Array(3 * k);
    for (let i = 0; i < 3 * k; i += 3) {
        arr[i] = Math.random() * 10 - 5;
        arr[i + 1] = Math.random() * 10 - 5;
        arr[i + 2] = -Math.random() * 10 - 1; // [-1, -11]
    }
    return arr;
};

self.exit = function() {
    const buffersToTransfer = new Array(self.result.geometries.length);
    for (let i = 0; i < self.result.geometries.length; i++) {
        buffersToTransfer[i] = self.result.geometries[i].buffer;
    }

    self.postMessage(self.result, buffersToTransfer);
};

self.generateMaskedBoxVertices = function(k, image) {
    const w = image.width;
    const h = image.height;
    const sectors = image.sectors;
    let sw;
    let sh;

    const arr = new Array(3 * k);
    let j;
    for (let i = 0; i < 3 * k; i += 3) {
        j = (i / 3) % sectors.length;
        sh = 1 - (Math.floor(sectors[j] / w) + Math.random()) / h;
        sw = (sectors[j] % w + Math.random()) / w;

        arr[i] = sw * 10 - 5;
        arr[i + 1] = sh * 10 - 5;
        arr[i + 2] = -8;
    }
    return arr;
};

self.makeImageRequest = function(addr) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', addr, true);
    xhr.responseType = 'arraybuffer';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const image = self.imageParser.parsePBMBinaryImage(xhr.response);
            image.sectors = [];
            for (let i = 0; i < image.data.length; i++) {
                if (image.data[i]) image.sectors.push(i);
            }

            const arr = self.generateMaskedBoxVertices(self.pointsCount, image);
            self.result.geometries.push(new Float32Array(arr));

            self.unprocessedStatesAmount -= 1;
            if (self.unprocessedStatesAmount < 1) self.exit();
        }
    };
    xhr.send();
};

self.startCreation = function(states, pointsCount) {
    self.pointsCount = pointsCount;
    self.unprocessedStatesAmount = 0;
    for (let i = 0; i < states.length; i++) {
        switch (states[i].type) {
        case 'maskedBox':
            if (!states[i].imageUrl) throw new Error('Masked Points Transition: State with \'maskedBox\' type should have \'imageUrl\' field');
            self.unprocessedStatesAmount += 1;
            self.makeImageRequest(states[i].imageUrl);
            break;
        case 'box':
            const arr = self.generateBoxVertices(self.pointsCount);
            self.result.geometries.push(new Float32Array(arr));
            break;
        case 'sphere':
            break;
        default:
            throw new Error('Masked Points Transition: Unknown points state type. Should be box / sphere / maskedBox.');
        }
    }

    if (self.unprocessedStatesAmount < 1) self.exit();
};

self.addEventListener('message', (e) => {
    if (e.data.states && e.data.pointsCount) self.startCreation(e.data.states, e.data.pointsCount);
}, false);

self.addEventListener('error', (e) => {
    self.postMessage(e, 'error in webworker');
}, false);
