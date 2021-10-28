'use strict';

function loadImg(url, func, ...arg) {
    var img = new Image();
    img.onload = () => func(img, arg);
    img.src = url;
}

function loadImgFromFile(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        gImg = img
    }
    reader.readAsDataURL(ev.target.files[0])
}