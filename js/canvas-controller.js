'use strict';

var gElCanvas;
var gCtx;
var gCanvasImg;
var gActiveLayer;
var gTrkMode;
var gIcons;

function initCanvas() {
    _createIcons();
    _renderCanvasPanel();
    gElCanvas = document.querySelector('canvas');
    const elCanvasPlace = document.querySelector('.canvas-place');
    gElCanvas.width = elCanvasPlace.offsetWidth
    gElCanvas.height = elCanvasPlace.offsetHeight
    gCtx = gElCanvas.getContext("2d");
}

function _createIcons() {
    gIcons = {};
    const saveIcon = (img, title) => gIcons[title] = img;
    loadImg('./img/icons/rotate.png', saveIcon, 'rotate');
    loadImg('./img/icons/scale.png', saveIcon, 'scale');
}

function _renderCanvasPanel() {
    const stickers = getStickers();
    let strHtml = '';
    stickers.forEach((sticker, idx) => strHtml += `<img data-index="${idx}" onclick="onClickSticker(this)" src="${sticker}">`)
    const elStickers = document.querySelector('.control-panel .stickers');
    elStickers.innerHTML = strHtml;
}

function setNewCanvas(img, isStorage = false) {
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
        gActiveLayer.offset.y += size / 2;
        renderCanvas();
    }
}

function onChangeFontStyle(el, key) {
    if (gActiveLayer && gActiveLayer.type === 'text') {
        gActiveLayer.font[key] = el.value;
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
    gActiveLayer = getCanvasNewText(gElCanvas.height, '');
    getActiveLayer(gActiveLayer);
    const elInput = document.querySelector('.control-panel .textinput');
    elInput.placeholder = '';
    elInput.focus();
}

function onClickSticker(el) {
    clearActiveLayer();
    const idx = el.dataset['index'];
    const url = getSticker(idx);
    const draw = function (img, ...arg) {
        const size = arg.splice(0, 1)[0];
        const height = (img.height > img.width) ? size : size * (img.height / img.width);
        const width = (img.width > img.height) ? size : size * (img.width / img.height);
        const x = gElCanvas.width / 2 - width / 2;
        const y = gElCanvas.height / 2 - height / 2;
        const sticker = getCanvasNewImage(img, url, x, y, width, height);
        drawSticker(sticker);
    };
    loadImg(url, draw, 100);
    renderCanvas();
}

function onClearCanvas() {
    const meme = getMeme();
    meme.items = [];
    renderCanvas();
}

function onUploadClick(ev) {
    loadImgFromFile(ev, setNewCanvas);
}

function onDownloadClick(el) {
    el.href = exportCanvas();
}

function onSaveCanvas() {
    clearActiveLayer();
    renderCanvas();
    const preview = gElCanvas.toDataURL('image/jpeg');
    saveCanvas(preview);
    pageToggle('storage');
}

function onRemoveCanvas() {
    removeCanvas();
    onClearCanvas();
    pageToggle('storage');
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
    if (gActiveLayer && gActiveLayer.type === 'text' && !gActiveLayer.text) removeCanvasItem(gActiveLayer);
    gActiveLayer = null;
    setInputToggle();
    renderCanvas();
}

function setInputToggle() {
    const type = (gActiveLayer) ? gActiveLayer.type : null;
    const isText = (type === 'text');
    const isImage = (type === 'image');
    toggleDisableInput('.control-panel .textinput', (!isText), (isText) ? gActiveLayer.text : null, (!isText) ? 'Click button (+) to add new line' : null);
    toggleDisableInput('.control-panel .colorpicker.stroke', (!isText), (isText) ? gActiveLayer.font.stroke : null);
    toggleDisableInput('.control-panel .colorpicker.font', (!isText), (isText) ? gActiveLayer.font.color : null);
    toggleDisableInput('.control-panel .fontfamily', (!isText), (isText) ? gActiveLayer.font.family : 'Impact');
    toggleDisableInput('.control-panel .set-opacity', (!isText && !isImage), (isText || isImage) ? gActiveLayer.opacity : 100);
}

function getActiveLayer(layer) {
    const prevActive = gActiveLayer;
    if (layer) {
        gActiveLayer = layer;
    } else if (gTracking.offset.start) {
        gActiveLayer = getActiveItem(gTracking.offset.start.x, gTracking.offset.start.y);
    }
    if (gActiveLayer) {
        toggleDisableInput('.control-panel .set-opacity', false, gActiveLayer.opacity);
        if (gActiveLayer.type === 'image') {
            gTracking.shift = {
                x: gActiveLayer.width / 2,
                y: gActiveLayer.height / 2,
            }
            const isTouch = gTracking.isTouch();
            let clickOffsetY = (isTouch) ? gActiveLayer.bottom * 0.85 : gActiveLayer.bottom * 0.95;
            let clickOffsetX = (isTouch) ? gActiveLayer.right * 0.85 : gActiveLayer.right * 0.95;
            if ((gTracking.offset.start.x > clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'scale';
            clickOffsetX = (isTouch) ? gActiveLayer.left * 1.2 : gActiveLayer.left * 1.1;
            if ((gTracking.offset.start.x < clickOffsetX && gTracking.offset.start.y > clickOffsetY)) gTrkMode = 'rotate';
        }
    }
    if (prevActive && prevActive !== gActiveLayer && prevActive.type === 'text' && !prevActive.text) removeCanvasItem(prevActive);
    setInputToggle();
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
        const change = gTracking.change();
        switch (gTrkMode) {
            case 'scale':
                resizeCanvasItem(gActiveLayer, (change.x + change.y) / 100);
                break;
            case 'rotate':
                rotateCanvasItem(gActiveLayer, change.x / 1000);
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
    if (ev.key === 'Escape') clearActiveLayer();
    if (!gActiveLayer || document.activeElement.nodeName === 'INPUT') return;
    ev.stopPropagation();
    if (ev.key.substr(0, 5) === 'Arrow') onChangePosition(ev.key.substr(5, 5));
    switch (gActiveLayer.type) {
        case 'text':
            if (ev.key === '+' || ev.key === '-') onFontSizeClick((ev.key === '+') ? 2 : -2);
            break;
        case 'image':
            if (ev.key === '+' || ev.key === '-') resizeCanvasItem(gActiveLayer, (ev.key === '+') ? 1 : -1);
            renderCanvas();
            break;
    }
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
    const height = gElCanvas.parentElement.offsetHeight;
    const width = Math.min(gElCanvas.parentElement.offsetWidth, window.innerWidth);
    const ratio = img.width / img.height;
    gElCanvas.width = (height > width) ? width : height * ratio;
    gElCanvas.height = (height > width) ? width / ratio : height;
    // if (gElCanvas.width > window.innerWidth) gElCanvas.style.width = width - 10 + 'px';
    gElCanvas.style.marginInlineStart = Math.max((width - gElCanvas.width) / 2, 0) + 'px';
    setCanvasSize(gElCanvas.width, gElCanvas.height);
}

function renderCanvas() {
    const meme = getMeme();
    if (meme.image.data) gCtx.drawImage(meme.image.data, 0, 0, meme.width, meme.height);
    gCtx.restore();
    meme.items.forEach(item => {
        switch (item.type) {
            case 'text':
                drawText(item, gCtx);
                break;
            case 'image':
                drawSticker(item, gCtx);
                break;
        }
    });
    if (gActiveLayer) markActiveLayer(gActiveLayer);
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
            gCtx.drawImage(gIcons.rotate, item.left, item.bottom - 15, 20, 20);
            gCtx.drawImage(gIcons.scale, item.right - 20, item.bottom - 15, 20, 20);
            break;
    }
    gCtx.stroke();
    gCtx.restore();
}

