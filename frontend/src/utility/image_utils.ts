const canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
const context: OffscreenCanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true })!;

export default class ImageUtils {

    static resize(image: ImageData, width: number, height: number, interpolation: 'nearest' | 'linear' = 'nearest'): ImageData {
        context.imageSmoothingEnabled = interpolation === 'linear';
        context.imageSmoothingQuality = 'high';
        
        const temp_canvas = new OffscreenCanvas(image.width, image.height);
        const temp_context = temp_canvas.getContext('2d')!;
        temp_context.putImageData(image, 0, 0);
        
        context.drawImage(temp_canvas, 0, 0, width, height);
        return context.getImageData(0, 0, width, height);
    }

    static crop(image: ImageData, x: number, y: number, width: number, height: number): ImageData {
        canvas.width = image.width;
        canvas.height = image.height;
        context.putImageData(image, 0, 0);
        return context.getImageData(x, y, width, height);
    }

    static stitch(images: ImageData[], axis: "vertical" | "horizontal" = "horizontal"): ImageData {
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

    static async load(url: string): Promise<ImageData> {
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

    static async save(image: ImageData, filename: string = 'image.png'): Promise<void> {
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
}