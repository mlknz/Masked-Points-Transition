export default class PosGenerator {
    constructor() {}

    generateBoxVertices(k, params) {
        const boxW = params.width || 10;
        const boxH = params.height || 10;
        const boxDepth = params.depth || 10;
        const zDistance = params.zDistance || 5;

        const arr = new Array(3 * k);

        for (let i = 0; i < 3 * k; i += 3) {
            arr[i] = Math.random() * boxW - boxW / 2;
            arr[i + 1] = Math.random() * boxH - boxH / 2;
            arr[i + 2] = -(Math.random() * boxDepth - boxDepth / 2) - zDistance;
        }
        return new Float32Array(arr);
    }

    generateMaskedBoxVertices(k, params, image) {
        const boxW = params.width || 10;
        const boxH = params.height || 10;
        const boxDepth = params.depth || 10;
        const zDistance = params.zDistance || 5;

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

            arr[i] = sw * boxW - boxW / 2;
            arr[i + 1] = sh * boxH - boxH / 2;
            arr[i + 2] = -(Math.random() * boxDepth - boxDepth / 2) - zDistance;
        }
        return new Float32Array(arr);
    }

}
