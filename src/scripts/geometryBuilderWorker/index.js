import ImageParser from './imageParser.js';
import PosGenerator from './posGenerator.js';

self.imageParser = new ImageParser();
self.posGenerator = new PosGenerator();

self.unprocessedStatesAmount = 1;
self.pointsCount = 1;

self.result = {
    geometries: []
};

self.exit = function() {
    const buffersToTransfer = new Array(self.result.geometries.length);
    for (let i = 0; i < self.result.geometries.length; i++) {
        buffersToTransfer[i] = self.result.geometries[i].buffer;
    }

    self.postMessage(self.result, buffersToTransfer);
};

self.shuffleArray = function(a) {
    let i, t, j;
    for (i = a.length - 1; i > 0; i -= 1) {
        t = a[i];
        j = Math.floor(Math.random() * (i + 1));
        a[i] = a[j];
        a[j] = t;
    }
};

self.addSectorsDataToImage = function(image) {
    image.sectors = [];
    for (let i = 0; i < image.data.length; i++) {
        if (image.data[i]) image.sectors.push(i);
    }
    self.shuffleArray(image.sectors);
};

self.makeImageRequest = function(params, geomInd) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', params.imageUrl, true);
    xhr.responseType = 'arraybuffer';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const image = self.imageParser.parsePBMBinaryImage(xhr.response);
            self.addSectorsDataToImage(image);
            self.result.geometries[geomInd] = self.posGenerator.generateMaskedBoxVertices(self.pointsCount, params, image);

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
        case 'rawData':
            self.result.geometries[i] = new Float32Array(states[i].data);
            break;
        case 'box':
            self.result.geometries[i] = self.posGenerator.generateBoxVertices(self.pointsCount, states[i]);
            break;
        case 'maskedBoxFromImage':
            if (!states[i].imageUrl) throw new Error('Masked Points Transition: State with \'maskedBoxFromImage\' type should have \'imageUrl\' field');
            self.unprocessedStatesAmount += 1;
            self.makeImageRequest(states[i], i);
            break;
        case 'maskedBoxFromMatrix':
            const image = {
                data: states[i].matrix || [],
                width: states[i].matrixWidth || 1,
                height: states[i].matrixHeight || 1
            };
            self.addSectorsDataToImage(image);
            self.result.geometries[i] = self.posGenerator.generateMaskedBoxVertices(self.pointsCount, states[i], image);
            break;
        default:
            throw new Error('Masked Points Transition: Unknown points state type. Should be box / maskedBoxFromImage / maskedBoxFromMatrix / rawData.');
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
