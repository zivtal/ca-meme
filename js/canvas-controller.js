'use strict';

var gElCanvas;
var gCtx;
var gCanvasImg;
var gActiveLayer;
var gTrkMode;
var gIcons;

function initCanvas() {
    createIcons();
    renderCanvasPanel();
    gElCanvas = document.querySelector('canvas');
    const elCanvasPlace = document.querySelector('.canvas-place');
    gElCanvas.width = elCanvasPlace.offsetWidth
    gElCanvas.height = elCanvasPlace.offsetHeight
    gCtx = gElCanvas.getContext("2d");
}

function newCanvas(img, isStorage = false) {
    clearCanvas();
    clearActiveLayer();
    pageToggle('editor');
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    setEvents(gElCanvas);
    if (typeof img === 'object' && img.nodeName === 'IMG') {
        onLoadComplete(img, img.src);
    } else if (isStorage) {
        loadCanvas(img);
        resizeCanvas();
        renderCanvas();
        toggleHideElement('.remove-button', false);
    } else {
        const imgURL = getCanvasBackground(img);
        loadImg(imgURL, onLoadComplete, imgURL);
        toggleHideElement('.remove-button', true);
    }
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
    const meme = getMeme()
    const items = meme.items;
    if (items.length > 0) {
        if (gActiveLayer) {
            let idx = items.indexOf(gActiveLayer);
            idx = (idx < items.length - 1) ? idx + 1 : 0;
            getActiveLayer(items[idx]);
        } else {
            getActiveLayer(items[0]);
        }
    } else clearActiveLayer();
}

function onChangeOpacity(el) {
    if (gActiveLayer) {
        gActiveLayer.opacity = el.value;
        renderCanvas();
    }
}

function onRemoveClick() {
    const type = (gActiveLayer) ? gActiveLayer.type : null;
    if (!gActiveLayer) gActiveLayer = getLastLayer();
    removeCanvasItem(gActiveLayer);
    if (type === 'text') {
        onSwitchClick();
    } else clearActiveLayer();
}

function onAddClick() {
    gActiveLayer = addNewLine(gElCanvas.height, 'new line');
    getActiveLayer(gActiveLayer);
}

function onClickSticker(el) {
    const idx = el.dataset['index'];
    const url = getSticker(idx);
    const draw = function (img, ...arg) {
        const size = arg.splice(0, 1)[0];
        const height = (img.height > img.width) ? size : size * (img.height / img.width);
        const width = (img.width > img.height) ? size : size * (img.width / img.height);
        const x = gElCanvas.width / 2 - width / 2;
        const y = gElCanvas.height / 2 - height / 2;
        const sticker = addCanvasImage(img, url, x, y, width, height);
        drawSticker(sticker);
    };
    loadImg(url, draw, 100);
    renderCanvas();
}

function onClearCanvas() {
    initCanvasModel();
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
}

function onUploadClick(ev) {
    loadImgFromFile(ev, newCanvas);
}

function onDownloadClick(el) {
    const imgContent = gElCanvas.toDataURL('image/jpeg');
    el.href = imgContent;
}

function onSaveCanvas() {
    renderCanvas(true);
    const imgContent = gElCanvas.toDataURL('image/jpeg');
    saveCanvas(imgContent);
    pageToggle('storage');
}

function onRemoveCanvas() {
    removeCanvas();
    onClearCanvas();
    const imgs = getStorageImgs();
    if (!imgs || imgs.length === 0) {
        toggleHideElement('.storage-button', true);
        pageToggle('storage');
    } else {
        pageToggle('gallery');
    }
}

function onLoadComplete(img, url) {
    if (typeof url !== 'string') url = img.src;
    setCanvasBackground(img, url);
    resizeCanvas();
    renderCanvas();
}

function loadImgFromFile(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function clearActiveLayer() {
    gActiveLayer = null;
    toggleDisableInput('.control-panel .textinput', true);
    toggleDisableInput('.control-panel .colorpicker.stroke', true);
    toggleDisableInput('.control-panel .colorpicker.font', true);
    toggleDisableInput('.control-panel .set-opacity', true, 100);
    toggleDisableInput('.control-panel .fontfamily', true, 'Impact');
    renderCanvas();
}

function getActiveLayer(layer) {
    if (layer) {
        gActiveLayer = layer;
    } else if (gTracking.offset.start) {
        gActiveLayer = getActiveItem(gTracking.offset.start.x, gTracking.offset.start.y);
    }
    if (gActiveLayer) {
        toggleDisableInput('.control-panel .set-opacity', false, gActiveLayer.opacity);
        switch (gActiveLayer.type) {
            case 'text':
                toggleDisableInput('.control-panel .textinput', false, gActiveLayer.text);
                toggleDisableInput('.control-panel .colorpicker.stroke', false, gActiveLayer.font.stroke);
                toggleDisableInput('.control-panel .colorpicker.font', false, gActiveLayer.font.color);
                toggleDisableInput('.control-panel .fontfamily', false, gActiveLayer.font.family);
                break;
            case 'image':
                toggleDisableInput('.control-panel .textinput', true);
                toggleDisableInput('.control-panel .colorpicker.stroke', true);
                toggleDisableInput('.control-panel .colorpicker.font', true);
                toggleDisableInput('.control-panel .fontfamily', true);
                gTracking.shift = {
                    x: gActiveLayer.width / 2,
                    y: gActiveLayer.height / 2,
                }
                const isTouch = gTracking.isTouch();
                let clickOffsetX = (isTouch) ? gActiveLayer.right * 0.9 : gActiveLayer.right * 0.95;
                let clickOffsetY = (isTouch) ? gActiveLayer.bottom * 0.85 : gActiveLayer.bottom * 0.90;
                if ((gTracking.offset.start.x > clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'scale';
                clickOffsetX = (isTouch) ? gActiveLayer.left * 1.2 : gActiveLayer.left * 1.25;
                if ((gTracking.offset.start.x < clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'rotate';
                break;
        }
    } else {
        toggleDisableInput('.control-panel .textinput', true);
        toggleDisableInput('.control-panel .colorpicker.stroke', true);
        toggleDisableInput('.control-panel .colorpicker.font', true);
    }
    renderCanvas();
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
        // console.log(gTrkMode);
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

function keyDown(ev) {
    ev.stopPropagation();
    if (ev.key.substr(0, 5) === 'Arrow') onChangePosition(ev.key.substr(5, 5));
}

function onChangePosition(direction) {
    if (gActiveLayer) {
        switch (direction.toLowerCase()) {
            case 'up':
                if (gActiveLayer.offset.y > -gActiveLayer.height * 0.8) gActiveLayer.offset.y--;
                renderCanvas()
                break;
            case 'down':
                if (gActiveLayer.offset.y < gElCanvas.height - gActiveLayer.height * 0.2) gActiveLayer.offset.y++;
                renderCanvas()
                break;
            case 'left':
                if (gActiveLayer.offset.x > -gActiveLayer.width * 0.8) gActiveLayer.offset.x--;
                renderCanvas()
                break;
            case 'right':
                if (gActiveLayer.offset.x < gElCanvas.width - gActiveLayer.width * 0.2) gActiveLayer.offset.x++;
                renderCanvas()
                break;
        }
    }
}

function setEvents(el, isMouse = true, isTouch = true, isKeyboard = true) {
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
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
    if (isKeyboard) {
        window.addEventListener('keydown', keyDown);
    };
}

function resizeCanvas(img = getCanvasBackground()) {
    const elCanvasPlace = document.querySelector('.canvas-place');
    const height = elCanvasPlace.offsetHeight;
    const width = elCanvasPlace.offsetWidth;
    if ((!height) || (!width) || (!img)) return;
    const ratio = img.width / img.height;
    const size = (height > width) ? width : height;
    gElCanvas.width = (height > width) ? size : size * ratio;
    gElCanvas.height = (height > width) ? size / ratio : size;
    gElCanvas.style.left = ((width - gElCanvas.width) / 2) + 'px';
    setCanvasSize(gElCanvas.width, gElCanvas.height);
}

function renderCanvas(isExport = false) {
    const meme = getMeme();
    if (meme.image.data) gCtx.drawImage(meme.image.data, 0, 0, gElCanvas.width, gElCanvas.height);
    gCtx.restore();
    meme.items.forEach(item => {
        switch (item.type) {
            case 'text':
                drawText(item)
                break;
            case 'image':
                drawSticker(item);
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
    gCtx.save();
    gCtx.font = item.font.size + 'px ' + item.font.family;
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = item.font.stroke;
    gCtx.fillStyle = item.font.color;
    gCtx.globalAlpha = item.opacity / 100;
    gCtx.textAlign = 'center';
    gCtx.fillText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    gCtx.strokeText(item.text, (item.offset.x) ? item.offset.x : gElCanvas.width / 2, item.offset.y);
    setCanvasLineSize(item, gCtx.measureText(item.text).width);
    gCtx.restore();
}

function markActiveLayer(item) {
    gCtx.save();
    gCtx.beginPath();
    gCtx.globalAlpha = 0.7;
    gCtx.lineWidth = 3;
    switch (item.type) {
        case 'text':
            gCtx.strokeStyle = 'red';
            gCtx.rect(item.left, item.top, item.width, item.height);
            break;
        case 'image':
            gCtx.strokeStyle = 'red';
            gCtx.rect(item.left - 10, item.top - 10, item.width + 20, item.height + 20);
            gCtx.drawImage(gIcons.rotate, item.left, item.bottom - 15, 20, 20);
            gCtx.drawImage(gIcons.scale, item.right - 20, item.bottom - 15, 20, 20);
            break;
    }
    gCtx.stroke();
    gCtx.restore();
}

function drawSticker(item) {
    gCtx.save();
    gCtx.globalAlpha = item.opacity / 100;
    if (item.degrees) {
        gCtx.translate(item.offset.x + item.width / 2, item.offset.y + item.height / 2);
        gCtx.rotate(item.degrees);
        gCtx.drawImage(item.image.data, -item.width / 2, -item.height / 2, item.width, item.height);
    } else {
        gCtx.drawImage(item.image.data, item.offset.x, item.offset.y, item.width, item.height);
    }
    gCtx.restore();
    setCanvasImage(item);
}
