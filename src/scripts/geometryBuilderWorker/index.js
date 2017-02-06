import MaskParser from './maskParser.js';

self.maskParser = new MaskParser();

self.startCreation = function(states) {
    console.log(states, self.maskParser);
};

self.addEventListener('message', (e) => {
    if (e.data.states) self.startCreation(e.data.states);
}, false);

self.addEventListener('error', (e) => {
    self.postMessage(e, 'error in webworker');
}, false);
