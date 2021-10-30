'use strict';

function loadImg(url, func, ...arg) {
    var img = new Image();
    img.onload = () => func(img, ...arg);
    img.src = url;
    return img;
}

function getBase64Image(img, pixels = 300) {
    if (typeof img !== 'object') return img;
    const canvas = document.createElement("canvas");
    console.log('k');
    const ratio = img.width / img.height;
    const width = (img.width > img.height) ? pixels : pixels * ratio;
    const height = (img.width < img.height) ? pixels : pixels / ratio;
    console.log(width, height);
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}

