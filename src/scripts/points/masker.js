class Masker {
    constructor() {
    }

    generateVerticesWithoutMask(n) {
        const arr = new Array(3 * n);
        for (let i = 0; i < 3 * n; i += 3) {
            arr[i] = Math.random() * 10 - 5;
            arr[i + 1] = Math.random() * 10 - 5;
            arr[i + 2] = -Math.random() * 10 - 1; // [-1, -11]
        }
        return arr;
    }
}

export default Masker;
