
// TODO rename file
export async function loadImage(url) {
    const promise = new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';

        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            
            const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            resolve(image_data);
        };
        
        image.onerror = function() {
            reject();
        };
        
        image.src = url;
    });

    const image = await promise
        .then(image => image)
        .catch(() => {throw new Error(`Failed to load image ${url}`);});
    return image;
}

export async function saveImage(file_name, image) {
    const image_bitmap = await createImageBitmap(image);
    
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    context.scale(1, -1);
    context.drawImage(image_bitmap, 0, -image.height);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file_name;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}