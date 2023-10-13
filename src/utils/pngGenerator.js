export const generateImage = (json) => {
    const canvas = document.createElement('canvas');
    canvas.width = json.width;
    canvas.height = json.height;
    const ctx = canvas.getContext('2d');

    json.pages.forEach((page) => {
        // Set background color
        ctx.fillStyle = page.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        page.children.forEach((child) => {
            switch (child.type) {
                case 'text':
                    // Set text styles
                    ctx.font = `${child.fontSize}px ${child.fontFamily}`;
                    ctx.fillStyle = child.fill;
                    ctx.strokeStyle = child.stroke;
                    ctx.lineWidth = child.strokeWidth;
                    ctx.textAlign = child.align;
                    ctx.textBaseline = 'middle';

                    // Draw text
                    ctx.save();
                    ctx.translate(child.x + child.width / 2, child.y + child.height / 2);
                    ctx.rotate((child.rotation * Math.PI) / 180);
                    ctx.fillText(child.text, 0, 0);
                    if (child.strokeWidth > 0) {
                        ctx.strokeText(child.text, 0, 0);
                    }
                    ctx.restore();
                    break;

                case 'image':
                    // Load image
                    const img = new Image();
                    img.src = child.src;

                    // Draw image
                    ctx.save();
                    ctx.translate(child.x, child.y);
                    ctx.rotate((child.rotation * Math.PI) / 180);
                    ctx.drawImage(
                        img,
                        child.cropX * img.width,
                        child.cropY * img.height,
                        child.cropWidth * img.width,
                        child.cropHeight * img.height,
                        0,
                        0,
                        child.width,
                        child.height
                    );
                    ctx.restore();
                    break;

                case 'svg':
                    // Load SVG
                    const svg = new Blob([atob(child.src.split(',')[1])], {
                        type: 'image/svg+xml',
                    });
                    const url = URL.createObjectURL(svg);

                    // Draw SVG
                    const img2 = new Image();
                    img2.onload = () => {
                        ctx.save();
                        ctx.translate(child.x, child.y);
                        ctx.rotate((child.rotation * Math.PI) / 180);
                        ctx.drawImage(img2, 0, 0, child.width, child.height);
                        ctx.restore();
                        URL.revokeObjectURL(url);
                    };
                    img2.src = url;
                    break;
            }
        });
    });

    // Convert canvas to image
    const img = new Image();
    img.src = canvas.toDataURL();
    return img.src;
};

// const json = {
//     width: 400,
//     height: 400,
//     pages: [
//         {
//             background: '#ffffff',
//             children: [
//                 {
//                     type: 'text',
//                     text: 'Hello, world!',
//                     x: 200,
//                     y: 200,
//                     width: 200,
//                     height: 50,
//                     fontSize: 24,
//                     fontFamily: 'Arial',
//                     fill: '#000000',
//                     stroke: '#ffffff',
//                     strokeWidth: 2,
//                     align: 'center',
//                     rotation: 0,
//                 },
//             ],
//         },
//     ],
// };

// const img = generateImage(json);

