export default class ImageParser {
    constructor() {}

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
