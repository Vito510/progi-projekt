const canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
const context: OffscreenCanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true })!;

export interface Pixel {
    r: number, 
    g: number,
    b: number,
    a: number,
}

export function get(image: ImageData, x: number, y: number): Pixel {
    const r = image.data[(x * image.width + y) * 4];
    const g = image.data[(x * image.width + y) * 4 + 1];
    const b = image.data[(x * image.width + y) * 4 + 2];
    const a = image.data[(x * image.width + y) * 4 + 3];
    return {r: r, g: g, b: b, a: a};
}

export function set(image: ImageData, x:number, y: number, value: Pixel): void {
    image.data[(x * image.width + y) * 4] = value.r;
    image.data[(x * image.width + y) * 4 + 1] = value.g;
    image.data[(x * image.width + y) * 4 + 2] = value.b;
    image.data[(x * image.width + y) * 4 + 3] = value.a;
}

export function iterate(image: ImageData, setter: (value: Pixel, x: number, y: number) => Pixel | undefined): void {
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const input = get(image, x, y);
            const output = setter(input, x, y);
            if (output !== undefined)
                set(image, x, y, output);
        }
    }
}

// export function resize(image: ImageData, width: number, height: number): ImageData {
//     canvas.width = width;
//     canvas.height = height;
//     context.putImageData(image, 0, 0);
//     return context.getImageData(0, 0, width, height);
// }

export function resize(image: ImageData, width: number, height: number, interpolation: 'nearest' | 'linear' = 'nearest'): ImageData {
    context.imageSmoothingEnabled = interpolation === 'linear';
    context.imageSmoothingQuality = 'high';
    
    const temp_canvas = new OffscreenCanvas(image.width, image.height);
    const temp_context = temp_canvas.getContext('2d')!;
    temp_context.putImageData(image, 0, 0);
    
    context.drawImage(temp_canvas, 0, 0, width, height);
    return context.getImageData(0, 0, width, height);
}


export function crop(image: ImageData, x: number, y: number, width: number, height: number): ImageData {
    canvas.width = width;
    canvas.height = height;
    context.putImageData(image, 0, 0);
    return context.getImageData(x, y, width, height);
}

export function stitch(images: ImageData[], axis: "vertical" | "horizontal" = "horizontal"): ImageData {
    let width: number;
    let height: number;

    if (axis == "horizontal") {
        width = images.reduce((sum, img) => sum + img.width, 0);
        height = Math.max(...images.map(img => img.height));

        canvas.width = width;
        canvas.height = height;
        
        let x = 0;
        images.forEach(img => {
            context.putImageData(img, x, 0);
            x += img.width;
        });
    } else {
        width = Math.max(...images.map(img => img.width));
        height = images.reduce((sum, img) => sum + img.height, 0);

        canvas.width = width;
        canvas.height = height;

        let y = 0;
        images.forEach(img => {
            context.putImageData(img, 0, y);
            y += img.height;
        });
    }
    
    return context.getImageData(0, 0, width, height);
}

export async function load(url: string): Promise<ImageData> {
    return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            resolve(context.getImageData(0, 0, image.width, image.height));
        };

        image.onerror = function() {
            throw new Error(`Failed to load image (${url})!`);
        };

        image.src = url;
    });
}

export async function save(image: ImageData, filename: string = 'image.png'): Promise<void> {
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(image, 0, 0);
    
    const blob = await canvas.convertToBlob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// export async function loadImage(url: string): Promise<ImageData | undefined> {
//     const promise = new Promise((resolve: (image: ImageData | undefined) => void, reject: () => void) => {
//         const image = new Image();
//         image.crossOrigin = 'Anonymous';

//         image.onload = function() {
//             // const canvas: OffscreenCanvas = new OffscreenCanvas(image.width, image.height);
//             // const canvas: HTMLCanvasElement = document.createElement('canvas');
//             canvas.width = image.width;
//             canvas.height = image.height;

//             // const context: OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d');
//             // if (typeof context === null)
//             //     throw new TypeError("Couldn't get CanvasRenderingContext2D!");
//             context?.drawImage(image, 0, 0);
            
//             const image_data = context?.getImageData(0, 0, canvas.width, canvas.height);
//             resolve(image_data);
//         };
        
//         image.onerror = function() {
//             reject();
//         };
        
//         image.src = url;
//     });

//     const image: ImageData | undefined = await promise
//         .then(image => image)
//         .catch(() => {throw new Error(`Failed to load image ${url}`);});
//     return image;
// }

// export async function saveImage(file_name: string, image: ImageData) {
//     const image_bitmap = await createImageBitmap(image);
    
//     // const canvas: OffscreenCanvas = new OffscreenCanvas(image.width, image.height);
//     // const canvas = document.createElement('canvas');
//     canvas.width = image.width;
//     canvas.height = image.height;

//     // const context: OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d');
//     // if (typeof context === null)
//     //     throw new TypeError("Couldn't get CanvasRenderingContext2D!");
//     context?.scale(1, -1);
//     context?.drawImage(image_bitmap, 0, -image.height);
    
//     canvas?.toBlob((blob) => {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = file_name;
//         a.click();
//         URL.revokeObjectURL(url);
//     }, 'image/png');
// }