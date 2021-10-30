'use strict';

function loadImg(url, func, ...arg) {
    var img = new Image();
    img.onload = () => func(img, ...arg);
    img.src = url;
    return img;
}

function getBase64Image(img, pixels = 800) {
    if (typeof img !== 'object') return img;
    const canvas = document.createElement("canvas");
    const ratio = img.width / img.height;
    const width = (img.width > img.height) ? pixels : pixels * ratio;
    const height = (img.width < img.height) ? pixels : pixels / ratio;
    canvas.width = (pixels) ? width : img.width;
    canvas.height = (pixels) ? height : img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}

