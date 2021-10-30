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
    gImgs = createImgs();
    gMeme = createMeme();
    loadMemeFromStorage();
    gStickers = createStickers();
}

function loadMemeFromStorage() {
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

function saveMemeToStorage() {
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



function createStickers() {
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

function createMeme() {
    return {
        items: [],
        image: {
            data: null,
            url: null,
        },
        width: null,
        height: null,
    }
}

function clearCanvas() {
    gMeme = createMeme();
}

function createImgs() {
    return [
        addImg('2.jpg', 'dancing', 'women'),
        addImg('003.jpg', 'tramp', 'funny', 'politician'),
        addImg('004.jpg', 'dog', 'love', 'animals'),
        addImg('005.jpg', 'baby', 'dog', 'animals', 'love'),
        addImg('5.jpg', 'baby', 'funny', 'angry'),
        addImg('006.jpg', 'cat', 'animals', 'sleep', 'tired'),
        addImg('8.jpg', 'actor', 'celeb', 'famous'),
        addImg('9.jpg', 'baby', 'funny', 'laugh'),
        addImg('12.jpg', 'famous', 'television', 'israel'),
        addImg('19.jpg', 'famous', 'comedian', 'funny', 'israel'),
        addImg('Ancient-Aliens.jpg', 'famous', 'television'),
        addImg('drevil.jpg', 'actor', 'movies'),
        addImg('img2.jpg', 'baby', 'dancing', 'funny'),
        addImg('img4.jpg', 'tramp', 'funny', 'politician'),
        addImg('img5.jpg', 'baby', 'funny'),
        addImg('img6.jpg', 'dog', 'funny'),
        addImg('img11.jpg', 'barack obama', 'politician', 'laugh'),
        addImg('img12.jpg', 'love'),
        addImg('leo.jpg', 'leonardo dicaprio', 'actor', 'celeb', 'famous'),
        addImg('meme1.jpg', 'actor', 'celeb', 'famous'),
        addImg('One-Does-Not-Simply.jpg', 'actor', 'celeb', 'famous'),
        addImg('Oprah-You-Get-A.jpg', 'television', 'celeb', 'famous'),
        addImg('patrick.jpg', 'actor', 'celeb', 'famous'),
        addImg('putin.jpg', 'putin', 'politician'),
        addImg('X-Everywhere.jpg', 'movie', 'animation', 'kids'),
    ];
}

function setCanvasSize(width, height) {
    gMeme.width = width;
    gMeme.height = height;
}

function addImg(filename, ...keywords) {
    return {
        id: gImgNextId++,
        url: './img/meme/' + filename,
        keywords,
    };
}

function getNewLine(height = gMeme.height, text = 'new line') {
    let y;
    switch (gMeme.items.length) {
        case 0:
            y = 48;
            break;
        case 1:
            y = height / 2 - 48 / 2;
            break;
        case 3:
            y = height - 48;
            break;
        default:
            y = height / 2;
            break;
    }
    const lastItem = gMeme.items[gMeme.items.length - 1];
    if ((!gMeme.items.length) || lastItem.type !== 'text' || lastItem.text) {
        gMeme.items.push({
            id: gItemIdx++,
            type: 'text',
            offset: {
                x: gMeme.width / 2,
                y,
            },
            font: {
                size: 48,
                color: '#ffffff',
                stroke: '#000000',
                family: 'Impact',
            },
            mergin: 0,
            width: 0,
            text,
            align: 'center',
        });
    }
    return gMeme.items[gMeme.items.length - 1];
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

function addCanvasImage(img, url, x, y, xSize, ySize) {
    gMeme.items.push({
        id: gItemIdx++,
        type: 'image',
        offset: {
            x,
            y,
        },
        width: xSize,
        height: ySize,
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

function setImg(img, url = null) {
    gMeme.image.data = img;
    gMeme.image.url = (typeof url === 'string') ? url : getBase64Image(img);
}

function getImg(idx) {
    if (!idx) return gMeme.image.data;
    return gImgs[idx].url;
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
    const line = gMeme.items.find(item => {
        return (
            x >= item.left && x <= item.right &&
            y >= item.top && y <= item.bottom
        );
    });
    return line;
}

function setCanvasLineSize(line, width) {
    line.width = width + 20;
    line.height = line.font.size;
    line.left = line.offset.x - line.width / 2;
    line.right = line.offset.x + line.width;
    line.top = line.offset.y - line.height + 5;
    line.bottom = line.offset.y;
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

function resizeCanvasItem(item, x, y) {
    const ratio = item.height / item.width;
    item.width = Math.max(item.width + (x + y) / 100, 25);
    item.height = item.width * ratio;
    setCanvasImage(item);
}

function rotateCanvasItem(item, x, y) {
    item.degrees -= x / 1000;
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
    saveMemeToStorage();
    gMeme = gMemeStorage[gMeme.index];
}

function loadCanvas(idx) {
    gMeme = gMemeStorage[idx];
    return gMeme;
}

function removeCanvas() {
    const idx = gMemeStorage.findIndex(item => item === gMeme);
    gMemeStorage.splice(idx, 1);
    saveMemeToStorage();
}