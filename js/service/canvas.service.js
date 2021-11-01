'use strict';

var gImgNextId;
var gImgs;
var gMeme;
var gMemeStorage;
var gStickers;
var gItemIdx;

function initCanvasModel() {
    gItemIdx = 0;
    gImgNextId = 0;
    gMeme = _createMeme();
    gImgs = _createImgs();
    _loadMemeFromStorage();
    gStickers = _createStickers();
}

function _createImgs() {
    return [
        _createImg('2.jpg', 'dancing', 'women'),
        _createImg('003.jpg', 'tramp', 'funny', 'politician'),
        _createImg('004.jpg', 'dog', 'love', 'animals'),
        _createImg('005.jpg', 'baby', 'dog', 'animals', 'love'),
        _createImg('5.jpg', 'baby', 'funny', 'angry'),
        _createImg('006.jpg', 'cat', 'animals', 'sleep', 'tired'),
        _createImg('8.jpg', 'actor', 'celeb', 'famous'),
        _createImg('9.jpg', 'baby', 'funny', 'laugh'),
        _createImg('12.jpg', 'famous', 'television', 'israel'),
        _createImg('19.jpg', 'famous', 'comedian', 'funny', 'israel'),
        _createImg('Ancient-Aliens.jpg', 'famous', 'television'),
        _createImg('drevil.jpg', 'actor', 'movies'),
        _createImg('img2.jpg', 'baby', 'dancing', 'funny'),
        _createImg('img4.jpg', 'tramp', 'funny', 'politician'),
        _createImg('img5.jpg', 'baby', 'funny'),
        _createImg('img6.jpg', 'dog', 'funny'),
        _createImg('img11.jpg', 'barack obama', 'politician', 'laugh'),
        _createImg('img12.jpg', 'love'),
        _createImg('leo.jpg', 'leonardo dicaprio', 'actor', 'celeb', 'famous'),
        _createImg('meme1.jpg', 'actor', 'celeb', 'famous'),
        _createImg('One-Does-Not-Simply.jpg', 'actor', 'celeb', 'famous'),
        _createImg('Oprah-You-Get-A.jpg', 'television', 'celeb', 'famous'),
        _createImg('patrick.jpg', 'actor', 'celeb', 'famous'),
        _createImg('putin.jpg', 'putin', 'politician'),
        _createImg('X-Everywhere.jpg', 'movie', 'animation', 'kids'),
    ];
}

function _createImg(filename, ...keywords) {
    return {
        id: gImgNextId++,
        url: './img/meme/' + filename,
        keywords,
    };
}

function _createStickers() {
    return [
        './img/stickers/1.png',
        './img/stickers/2.png',
        './img/stickers/3.png',
        './img/stickers/4.png',
        './img/stickers/5.png',
        './img/stickers/6.png',
        './img/stickers/7.png',
        './img/stickers/8.png',
        './img/stickers/9.png',
        './img/stickers/10.png',
        './img/stickers/11.png',
        './img/stickers/12.png',
        './img/stickers/13.png',
        './img/stickers/14.png',
        './img/stickers/15.png',
    ];
}

function _createMeme() {
    return {
        image: {
            data: null,
            url: null,
        },
        width: null,
        height: null,
        ratio: 1,
        items: [],
    }
}

function _loadMemeFromStorage() {
    gMemeStorage = loadFromStorage('meme');
    if (!gMemeStorage || gMemeStorage.length === 0) {
        return;
    }
    gMemeStorage.forEach(canvas => {
        const img = new Image();
        img.onload = function () {
            canvas.image.data = img;
        }
        img.src = canvas.image.url;
        const imgs = canvas.items.filter(item => item.type === 'image');
        imgs.forEach(item => {
            const img = new Image();
            img.onload = function () {
                item.image.data = img;
            }
            img.src = item.image.url;
        });
    });
}

function _saveMemeToStorage() {
    let memeCopy = JSON.stringify(gMemeStorage);
    memeCopy = JSON.parse(memeCopy);
    memeCopy.forEach(canvas => {
        if (!canvas.image.url) canvas.image.url = getBase64Image(canvas.image.data);
        const imgs = canvas.items.filter(item => item.type === 'image');
        imgs.forEach(item => {
            if (!item.image.url) getBase64Image(item.image.data);
            item.image.data = null
        });
    });
    saveToStorage('meme', gMemeStorage);
}

function _getTextPosition(type, size, height) {
    switch (gMeme.items.filter(item => item.type === type).length) {
        case 0:
            return size;
        case 1:
            return height / 2 + (size / 2);
        case 2:
            return height - 10;
        default:
            return height / 2;
    }
}

function getCanvasNewText(height = gMeme.height, text = 'new line') {
    const lastItem = gMeme.items[gMeme.items.length - 1];
    if ((!gMeme.items.length) || lastItem.type !== 'text' || lastItem.text) {
        gMeme.items.push({
            id: gItemIdx++,
            type: 'text',
            offset: {
                x: gMeme.width / 2,
                y: _getTextPosition('text', 48, height),
            },
            font: {
                size: 48,
                color: '#ffffff',
                stroke: '#000000',
                family: 'Impact',
            },
            opacity: 100,
            mergin: 0,
            width: 0,
            text,
            align: 'center',
        });
    }
    return gMeme.items[gMeme.items.length - 1];
}

function setTextLineSize(line, width) {
    line.width = width + 20;
    line.height = line.font.size;
    line.left = line.offset.x - line.width / 2;
    line.right = line.offset.x + line.width;
    line.top = line.offset.y - line.height + 5;
    line.bottom = line.offset.y;
}

function setTextAlign(item, align) {
    switch (align) {
        case 'left':
            item.offset.x = 10 + item.width / 2;
            break;
        case 'right':
            item.offset.x = gMeme.width - item.width / 2 - 10;
            break;
        case 'center':
            item.offset.x = gMeme.width / 2;
            break;
    }
}

function getCanvasNewImage(img, url, x, y, xSize, ySize) {
    gMeme.items.push({
        id: gItemIdx++,
        type: 'image',
        offset: {
            x,
            y,
        },
        width: xSize,
        height: ySize,
        opacity: 100,
        degrees: 0,
        left: x,
        right: x + xSize,
        top: y,
        bottom: y + ySize,
        image: {
            data: img,
            url: (url) ? url : getBase64Image(img),
        },
        ratio: ySize / gMeme.height,
    });
    return gMeme.items[gMeme.items.length - 1];
}

function setCanvasImage(item) {
    item.top = item.offset.y;
    item.bottom = item.offset.y + item.height;
    item.left = item.offset.x;
    item.right = item.offset.x + item.width;
    item.ratio = item.height / gMeme.height;
}

function clearCanvas() {
    gMeme = _createMeme();
}

function setCanvasSize(width, height) {
    const ratio = (gMeme.width) ? width / gMeme.width : 1;
    gMeme.width = width;
    gMeme.height = height;
    gMeme.items.forEach(item => {
        switch (item.type) {
            case 'text':
                item.font.size *= ratio;
                item.offset.x += (item.offset.x * ratio - item.offset.x);
                item.offset.y *= ratio;
                break;
            case 'image':
                item.width *= ratio;
                item.height *= ratio;
                item.offset.x *= ratio;
                item.offset.y *= ratio;
                break;
        }
    });
}

function setCanvasBackground(img, url = null) {
    gMeme.image.data = img;
    gMeme.image.url = (typeof url === 'string') ? url : getBase64Image(img);
}

function getCanvasBackground(idx) {
    if (!idx) return gMeme.image.data;
    return gImgs[idx].url;
}

function getLastLayer() {
    const items = gMeme.items;
    return items[items.length - 1];
}

function getImgs(...keywords) {
    const imgs = [];
    if (keywords && keywords.length) {
        gImgs.forEach(img => {
            for (let i = 0; i < keywords.length; i++) {
                const keyword = keywords[i];
                if (img.keywords.includes(keyword)) {
                    imgs.push(img);
                    break;
                }
            }
        });
    }
    return (keywords && keywords.length) ? imgs : gImgs;
}

function getStorageImgs() {
    const imgs = [];
    if (!gMemeStorage || gMemeStorage.length === 0) return;
    gMemeStorage.forEach(meme => imgs.push(meme.preview));
    return imgs;
}

function getMeme() {
    return gMeme;
}

function getStickers() {
    return gStickers;
}

function getSticker(idx) {
    return gStickers[idx];
}

function getActiveItem(x, y) {
    const item = gMeme.items.slice().reverse().find(item => {
        return (
            x >= item.left && x <= item.right &&
            y >= item.top && y <= item.bottom
        );
    });
    return item;
}

function removeCanvasItem(line) {
    const idx = gMeme.items.findIndex(item => item === line);
    return gMeme.items.splice(idx, 1);
}

function getCanvasItem(line) {
    return gMeme.items.findIndex(item => item === line);
}

function getSizeOfLines() {
    return gMeme.items.length;
}

function getTextLines() {
    return gMeme.items.filter(item => item.type === 'text');
}

function getCanvasItemByIndex(idx) {
    return gMeme.items[idx];
}

function resizeCanvasItem(item, size) {
    const ratio = item.height / item.width;
    item.width = Math.max(item.width + size, 25);
    item.height = item.width * ratio;
    item.offset.x -= size / 2;
    item.offset.y -= size / 2;
    setCanvasImage(item);
}

function rotateCanvasItem(item, deg) {
    item.degrees -= deg;
}

function saveCanvas(dataurl) {
    if (!gMeme) return;
    if (!gMemeStorage) gMemeStorage = [];
    gMeme.preview = dataurl;
    if (!gMeme.storage) {
        gMeme.storage = true;
        gMeme.index = gMemeStorage.length;
        gMemeStorage.push(gMeme);
    }
    _saveMemeToStorage();
    gMeme = gMemeStorage[gMeme.index];
}

function loadCanvas(idx) {
    gMeme = gMemeStorage[idx];
    return gMeme;
}

function removeCanvas() {
    const idx = gMemeStorage.findIndex(item => item === gMeme);
    gMemeStorage.splice(idx, 1);
    _saveMemeToStorage();
}

function exportCanvas(meme = getMeme(), ratio) {
    if (!ratio) ratio = meme.image.data.width / meme.width;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ratio && meme.image.data) {
        const imgSize = [meme.image.data.height, meme.image.data.width];
        const scaleSize = [meme.width * ratio, meme.height * ratio];
        ratio = Math.max(...scaleSize) < Math.max(...imgSize) ? ratio : Math.max(...imgSize) / Math.max(meme.width, meme.height);
        canvas.width = meme.width * ratio;
        canvas.height = meme.height * ratio;
        ctx.drawImage(meme.image.data, 0, 0, meme.width * ratio, meme.height * ratio);
    }
    meme.items.forEach(item => {
        switch (item.type) {
            case 'text':
                let itemText = JSON.stringify(item);
                itemText = JSON.parse(itemText);
                itemText.font.size *= ratio;
                itemText.offset.x += (item.offset.x * ratio - item.offset.x);
                itemText.offset.y *= ratio;
                drawText(itemText, ctx);
                break;
            case 'image':
                let imgEl = item.image.data;
                let itemImage = JSON.stringify(item);
                itemImage = JSON.parse(itemImage);
                itemImage.image.data = imgEl;
                itemImage.width *= ratio;
                itemImage.height *= ratio;
                itemImage.offset.x *= ratio;
                itemImage.offset.y *= ratio;
                drawSticker(itemImage, ctx);
                break;
        }
    });
    return canvas.toDataURL("image/png");
}

function drawText(item, context = gCtx) {
    context.save();
    context.font = `bold ${item.font.size}px ${item.font.family}`;
    // context.font = 'bold ' + item.font.size + 'px ' + item.font.family;
    context.lineWidth = item.font.size / 16;
    context.strokeStyle = item.font.stroke;
    context.fillStyle = item.font.color;
    context.globalAlpha = item.opacity / 100;
    context.textAlign = 'center';
    context.fillText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    context.strokeText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    setTextLineSize(item, context.measureText(item.text).width);
    context.restore();
}

function drawSticker(item, context = gCtx) {
    context.save();
    context.globalAlpha = item.opacity / 100;
    if (item.degrees) {
        context.translate(item.offset.x + item.width / 2, item.offset.y + item.height / 2);
        context.rotate(item.degrees);
        context.drawImage(item.image.data, -item.width / 2, -item.height / 2, item.width, item.height);
    } else {
        context.drawImage(item.image.data, item.offset.x, item.offset.y, item.width, item.height);
    }
    context.restore();
    setCanvasImage(item);
}
