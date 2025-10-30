import * as Vector from '../utility/vector.js';

export function getPixel(image, xy) {
    const x = Math.floor(xy.x);
    const y = Math.floor(xy.y);
    const r = image.data[(x * image.width + y) * 4];
    const g = image.data[(x * image.width + y) * 4 + 1];
    const b = image.data[(x * image.width + y) * 4 + 2];
    const a = image.data[(x * image.width + y) * 4 + 3];
    return Vector.vec(r, g, b, a);
}

export function setPixel(image, xy, value) {
    const x = Math.floor(xy.x);
    const y = Math.floor(xy.y);
    image.data[(x * image.width + y) * 4] = value.x;
    image.data[(x * image.width + y) * 4 + 1] = value.y;
    image.data[(x * image.width + y) * 4 + 2] = value.z;
    image.data[(x * image.width + y) * 4 + 3] = value.w;
}

export function iterate(image, set = (value, xy) => pixel) {
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const xy = Vector.vec(x, y);
            const input = getPixel(image, xy);
            const output = set(input, xy);
            if (output !== undefined)
                setPixel(image, xy, output);
        }
    }
}

export function crop(image, min_xy, max_xy) {
    if (max_xy.x < min_xy.x)
        [min_xy.x, max_xy.x] = [max_xy.x, min_xy.x];
    if (max_xy.y < min_xy.y)
        [min_xy.y, max_xy.y] = [max_xy.y, min_xy.y];
    const width = max_xy.x - min_xy.x;
    const height = max_xy.y - min_xy.y;
    const new_image = new ImageData(width, height);

    iterate(image, (value, xy) => {
        if (!(xy.x > max_xy.x || xy.x < min_xy.x || xy.y > max_xy.y || xy.y < min_xy.y)) {
            const coordinate = Vector.vec(xy.x - min_xy.x, xy.y - min_xy.y);
            setPixel(new_image, coordinate, value);
        }
        return undefined;
    });

    return new_image;
}

export function sample(image, xy) {
    const min = Vector.vec(Math.floor(xy.x), Math.floor(xy.y));
    const max = Vector.vec(Math.floor(xy.x) + 1, Math.floor(xy.y) + 1);
    const factor = Vector.vec(xy.x % 1.0, xy.y % 1.0);

    const top_left = getPixel(image, Vector.vec(min.x, min.y));
    const top_right = getPixel(image, Vector.vec(max.x, min.y));
    const bottom_left = getPixel(image, Vector.vec(min.x, max.y));
    const bottom_right = getPixel(image, Vector.vec(max.x, max.y));

    const value = Vector.mix(Vector.mix(top_left, top_right, factor.x), Vector.mix(bottom_left, bottom_right, factor.x), factor.y);
    return value;
}

export function resize(image, width, height) {
    const new_image = new ImageData(width, height);

    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {
    //         // const offset = (x * data.width + y) * 4;
    //         const pixel = sample(image, Vector.vec(x, y));
    //         setPixel(new_image, Vector.vec(x, y), pixel);
    //         // data[offset] = pixel.x;
    //         // data[offset + 1] = pixel.y;
    //         // data[offset + 2] = pixel.z;
    //         // data[offset + 3] = pixel.w;
    //     }
    // }

    let counter = 0;
    iterate(new_image, (value, xy) => {
        counter++;
        const coordinate = Vector.vec(xy.x / new_image.width * image.width, xy.y / new_image.height * image.height);
        // return sample(image, coordinate);
        // return Vector.vec(xy.x / width * 255, xy.y / height * 255, 0, 255);
        return Vector.vec(255, 255, 0, 255);
    });

    console.log(counter);
    console.log(width * height);

    return new_image;
}