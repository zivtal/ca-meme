'use strict';

var gElCanvas;
var gCtx;
var gCanvasImg;
var gActiveLayer;
var gTrkMode;
var gIcons;

function initCanvas(img) {
    createIcons();
    renderCanvasPanel();
    pageToggle('editor');
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext("2d");
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
    setEvents(gElCanvas);
    loadImg(getImg(img), onLoadComplete);
}

function createIcons() {
    gIcons = {};
    const saveIcon = (img, title) => gIcons[title] = img;
    loadImg('./img/icons/rotate.png', saveIcon, 'rotate');
    loadImg('./img/icons/scale.png', saveIcon, 'scale');
}

function renderCanvasPanel() {
    const stickers = getStickers();
    let strHtml = '';
    stickers.forEach((sticker, idx) => strHtml += `<img data-index="${idx}" onclick="onClickSticker(this)" src="${sticker}">`)
    const elStickers = document.querySelector('.control-panel .stickers');
    elStickers.innerHTML = strHtml;
}

function onChangeText(el) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.text = el.value;
        renderCanvas();
    }
}

function onAlignClick(align) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        setTextAlign(gActiveLayer, align);
        renderCanvas();
    }
}

function onFontSizeClick(size) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.font.size += size;
        renderCanvas();
    }
}

function onChangeColor(el) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.font.color = el.value;
        renderCanvas();
    }
}

function onChangeStroke(el) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.font.stroke = el.value;
        renderCanvas();
    }
}

function onChangeFont(el) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.font.family = el.value;
        renderCanvas();
    }
}

function onSwitchClick() {
    const lines = getTextLines();
    const elInput = document.querySelector('.control-panel .textinput');
    if (lines.length > 0) {
        elInput.removeAttribute('disabled');
        if (gActiveLayer && lines.includes(gActiveLayer)) {
            let idx = lines.indexOf(gActiveLayer);
            idx = (idx < lines.length - 1) ? idx + 1 : 0;
            gActiveLayer = lines[idx];
        } else if (lines.length > 0) {
            gActiveLayer = lines[0];
        }
        elInput.value = gActiveLayer.text;
    } else {
        elInput.value = '';
        elInput.setAttribute('disabled', '');
    }
    renderCanvas();
}

function onRemoveClick() {
    if (gActiveLayer) {
        if (gActiveLayer.type === 'text') {
            const elInput = document.querySelector('.control-panel .textinput');
            elInput.value = '';
            elInput.setAttribute('disabled', '');
        }
        removeCanvasItem(gActiveLayer);
        gActiveLayer = null;
    }
    renderCanvas();
}

function onAddClick() {
    gActiveLayer = getNewLine(gElCanvas.height, 'new line');
    const elInput = document.querySelector('.control-panel .textinput');
    elInput.value = gActiveLayer.text;
    elInput.removeAttribute('disabled');
    renderCanvas();
}

function onClickSticker(el) {
    const elInput = document.querySelector('.control-panel .textinput');
    elInput.setAttribute('disabled', '');
    elInput.value = '';
    const idx = el.dataset['index'];
    const sticker = getSticker(idx);
    const draw = function (img, arg) {
        const size = arg.splice(0, 1)[0];
        const height = (img.height > img.width) ? size : size * (img.height / img.width);
        const width = (img.width > img.height) ? size : size * (img.width / img.height);
        const x = gElCanvas.width / 2 - width / 2;
        const y = gElCanvas.height / 2 - height / 2;
        drawImg(addCanvasImage(img, x, y, width, height))
    };
    loadImg(sticker, draw, 100);
}

function onUploadClick(ev) {
    loadImgFromFile(ev, onLoadComplete);
}

function onDownloadClick(el) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    el.href = imgContent
}

function onLoadComplete(img) {
    setImg(img);
    resizeCanvas();
    renderCanvas();
}

function getActiveLayer() {
    const elInput = document.querySelector('.control-panel .textinput');
    elInput.value = '';
    elInput.setAttribute('disabled', '');
    const item = getActiveItem(gTracking.offset.start.x, gTracking.offset.start.y);
    gActiveLayer = (item) ? item : null;
    if (gActiveLayer) {
        const elInput = document.querySelector('.control-panel .textinput');
        switch (gActiveLayer.type) {
            case 'text':
                elInput.value = (gActiveLayer) ? elInput.value = gActiveLayer.text : '';
                elInput.removeAttribute('disabled');
                const elFontStroke = document.querySelector('.control-panel .colorpicker.stroke');
                elFontStroke.value = gActiveLayer.font.stroke;
                const elFontColor = document.querySelector('.control-panel .colorpicker.font');
                elFontColor.value = gActiveLayer.font.color;
                break;
            case 'image':
                elInput.value = '';
                elInput.setAttribute('disabled', '');
                gTracking.shift = {
                    x: gActiveLayer.width / 2,
                    y: gActiveLayer.height / 2,
                }
                const isTouch = gTracking.isTouch();
                let clickOffsetX = (isTouch) ? gActiveLayer.right * 0.8 : gActiveLayer.right * 0.9;
                let clickOffsetY = (isTouch) ? gActiveLayer.bottom * 0.8 : gActiveLayer.bottom * 0.9;
                if ((gTracking.offset.start.x > clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'scale';
                clickOffsetX = (isTouch) ? gActiveLayer.left * 1.2 : gActiveLayer.left * 1.1;
                if ((gTracking.offset.start.x < clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'rotate';
                break;
        }
    }
}

function startTracking(ev) {
    gTracking.start(ev);
    document.body.style.cursor = 'grabbing';
    gTrkMode = 'move';
    getActiveLayer();
}

function moveTracking(ev) {
    gTracking.move(ev);
    if (gTracking.isActive && gActiveLayer) {
        // alert(JSON.stringify(gTracking.change()));
        const change = gTracking.change();
        console.log(gTrkMode);
        switch (gTrkMode) {
            case 'scale':
                resizeCanvasItem(gActiveLayer, change.x, change.y);
                break;
            case 'rotate':
                rotateCanvasItem(gActiveLayer, change.x, change.y);
                break;
            default:
                document.body.style.cursor = 'grab';
                gActiveLayer.offset = gTracking.offset.end;
                break;
        }
        renderCanvas();
    }
}

function endTracking() {
    gTracking.stop();
    document.body.style.cursor = 'default';
    renderCanvas();
}

function setEvents(el, isMouse = true, isTouch = true) {
    if (isMouse) {
        el.addEventListener('mousedown', startTracking);
        el.addEventListener('mousemove', moveTracking);
        el.addEventListener('mouseup', endTracking);
    }
    if (isTouch) {
        el.addEventListener('touchstart', startTracking);
        el.addEventListener('touchmove', moveTracking);
        el.addEventListener('touchend', endTracking);
    }
}

function resizeCanvas(img = getImg()) {
    const elCanvasPlace = document.querySelector('.canvas-place');
    const height = elCanvasPlace.offsetHeight;
    const width = elCanvasPlace.offsetWidth;
    if (height < 0 || width < 0) return;
    const ratio = img.width / img.height;
    const size = (height > width) ? width : height;
    gElCanvas.width = (height > width) ? size : size * ratio;
    gElCanvas.height = (height > width) ? size / ratio : size;
    gElCanvas.style.left = (10 + (width - 20 - gElCanvas.width) / 2) + 'px';
    setCanvasSize(gElCanvas.width, gElCanvas.height);
}

function renderCanvas(canvas = getMeme(), isExport = false) {
    if (!canvas.img) return;
    if (isExport) gActiveLayer = null;
    gCtx.drawImage(canvas.img, 0, 0, gElCanvas.width, gElCanvas.height);
    canvas.items.forEach(item => {
        switch (item.type) {
            case 'text':
                drawText(item)
                break;
            case 'image':
                drawImg(item);
                break;
        }
    });
    if (!isExport) {
        if (gActiveLayer) {
            switch (gActiveLayer.type) {
                case 'text':
                    markActiveLayer(gActiveLayer);
                    break;
                case 'image':
                    markActiveLayer(gActiveLayer);
                    break;
            }
        }
    }
}

function drawText(item) {
    gCtx.font = item.font.size + 'px ' + item.font.family;
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = item.font.stroke;
    gCtx.fillStyle = item.font.color;
    gCtx.textAlign = 'center';
    gCtx.fillText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    gCtx.strokeText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    setCanvasLineSize(item, gCtx.measureText(item.text).width);
}

function markActiveLayer(item) {
    gCtx.beginPath();
    switch (item.type) {
        case 'text':
            gCtx.rect(item.left, item.top, item.width, item.height);
            break;
        case 'image':
            gCtx.drawImage(gIcons.rotate, item.left, item.bottom - 15, 20, 20);
            gCtx.drawImage(gIcons.scale, item.right - 15, item.bottom - 15, 20, 20);
            break;
    }
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
}

function drawImg(item) {
    gCtx.save();
    if (item.degrees) {
        gCtx.translate(item.offset.x + item.width / 2, item.offset.y + item.height / 2);
        gCtx.rotate(item.degrees);
        gCtx.drawImage(item.image, -item.width / 2, -item.height / 2, item.width, item.height);
    } else {
        gCtx.drawImage(item.image, item.offset.x, item.offset.y, item.width, item.height);
    }
    gCtx.restore();
    setCanvasImage(item);
}
