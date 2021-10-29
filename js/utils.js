'use strict';

function loadImg(url, func, ...arg) {
    var img = new Image();
    img.onload = () => func(img, ...arg);
    img.src = url;
    return img;
}

function getBase64Image(img) {
    if (typeof img !== 'object') return img;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}

