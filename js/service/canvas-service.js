'use strict';

var gKeywords;

var gImgNextId;
var gImgs;

var gMeme = {
    imgId: null,
    lines: [{
        font: {
            size: 48,
            color: 'black',
        },
        offset: {
            x: 0,
            y: 48,
        },
        text: 'Drag me!',
        align: 'center',
    }],
    emoji: [{
        offset: {
            x: 0,
            y: 0,
        },
        url: null,
    }],
    img: null,
}

function initCanvasModel() {
    gImgNextId = 0;
    gImgs = addImgs();
    gKeywords = createKeywords();
    // checks
    // console.log(gImgs);
    // console.log(gKeywords);
}

function createKeywords(imgs = gImgs) {
    const keywords = [];
    imgs.forEach(img => {
        img.keywords.forEach(keyword => {
            if (!keywords.includes(keyword)) keywords.push(keyword);
        })
    });
    return keywords;
}

function addImgs() {
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

function addImg(filename, ...keywords) {
    return {
        id: gImgNextId++,
        url: './img/meme/' + filename,
        keywords,
    };
}


function getNewLine(height) {
    let y;

    switch (gMeme.lines.length) {
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
            y = 48 * (gMeme.lines.length + 1);
            break;
    }

    if ((!gMeme.lines.length) || gMeme.lines[gMeme.lines.length - 1].text) {
        gMeme.lines.push({
            font: {
                size: 48,
                color: 'black',
            },
            offset: {
                x: 0,
                y,
            },
            text: 'new line',
            align: 'center',
        });
    }
    return gMeme.lines[gMeme.lines.length - 1];
}

function setImg(img) {
    gMeme.img = img;
}

function getImg(idx) {
    if (!idx) return gMeme.img;
    return gImgs[idx].url;
}

function getMeme() {
    return gMeme;
}

function getImgs() {
    return gImgs;
}

function getTextLine(pos) {
    const line = gMeme.lines.find(line => {
        return (
            line.offset.y - line.font.size <= pos.y
            && pos.y <= line.offset.y
        );
    });
    console.log(line);
    return line;
}

function removeTextLine(line) {
    const idx = gMeme.lines.findIndex(item => item === line);
    // console.log(idx);
    return gMeme.lines.splice(idx, 1);
}
