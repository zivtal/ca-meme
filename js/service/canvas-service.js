'use strict';

var gImgNextId;
var gImgs;
var gMeme;
var gStickers;
var gItemIdx;

function initCanvasModel() {
    gItemIdx = 0;
    gImgNextId = 0;
    gImgs = createImgs();
    gMeme = createMeme();
    gStickers = createStickers();
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
        img: null,
        width: null,
        height: null,
    }
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

function addCanvasImage(image, x, y, xSize, ySize) {
    gMeme.items.push({
        id: gItemIdx++,
        type: 'image',
        offset: {
            x,
            y,
        },
        width: xSize,
        height: ySize,
        left: x,
        right: x + xSize,
        top: y,
        bottom: y + ySize,
        image,
    });
    return gMeme.items[gMeme.items.length - 1];
}

function setCanvasImage(item) {
    item.top = item.offset.y;
    item.bottom = item.offset.y + item.height;
    item.left = item.offset.x;
    item.right = item.offset.x + item.width;
}

function setImg(img) {
    gMeme.img = img;
}

function getImg(idx) {
    if (!idx) return gMeme.img;
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
    line.width = width + 10;
    line.height = line.font.size;
    line.left = line.offset.x - line.width / 2 - 5;
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