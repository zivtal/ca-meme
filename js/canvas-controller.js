'use strict';

var gElCanvas;
var gCtx;
var gCanvasImg;
var gActiveText;

function initCanvas(img) {
    pageToggle('editor');
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext("2d");
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
    setEvents(gElCanvas);
    loadImg(getImg(img));
}

function onChangeText(el) {
    if (gActiveText) gActiveText.text = el.value;
    renderCanvas();
}

function onAlignClick(align) {
    if (gActiveText) gActiveText.align = align;
    renderCanvas();
}

function onFontSizeClick(size) {
    if (gActiveText) gActiveText.font.size += size;
    renderCanvas();
}

function onRemoveClick() {
    if (gActiveText) {
        removeTextLine(gActiveText);
        const elInput = document.querySelector('.control-panel input');
        elInput.value = '';
    }
    renderCanvas();
}

function onAddClick() {
    gActiveText = getNewLine(gElCanvas.height);
    renderCanvas();
}

function startTracking(ev) {
    gTracking.start(ev);
    const line = getTextLine(gTracking.offset.start);
    const elInput = document.querySelector('.control-panel input');
    if (line) {
        gActiveText = line;
        elInput.value = gActiveText.text;
    } else {
        gActiveText = null;
        elInput.value = '';
    }
    document.body.style.cursor = 'grabbing';
}

function moveTracking(ev) {
    gTracking.move(ev);
    if (gTracking.isActive && gActiveText) {
        const change = gTracking.change();
        gActiveText.offset = gTracking.offset.end;
    }
    renderCanvas();
}

function endTracking() {
    gTracking.stop();
    document.body.style.cursor = 'default';
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
    const height = elCanvasPlace.offsetHeight - 50;
    const width = elCanvasPlace.offsetWidth - 50;
    const ratio = img.width / img.height;
    gElCanvas.width = (width / height > ratio) ? gElCanvas.width : width;
    gElCanvas.height = Math.min(gElCanvas.width / ratio, height);
    gElCanvas.style.top = ((height - gElCanvas.height) / 2) + 'px';
    gElCanvas.style.left = ((width - gElCanvas.width) / 2) + 'px';
}

function renderCanvas(canvas = getMeme()) {
    gCtx.drawImage(canvas.img, 0, 0, gElCanvas.width, gElCanvas.height);
    canvas.lines.forEach(line =>
        drawText(line)
    );
}

function loadImg(url) {
    var img = new Image();
    img.onload = () => onLoadComplete(img);
    img.src = url;
}

function onLoadComplete(img) {
    setImg(img);
    resizeCanvas();
    renderCanvas();
}

function drawText(line) {
    gCtx.font = line.font.size + 'px Impact';
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.textAlign = line.align;
    gCtx.fillText(line.text, (line.offset.x) ? line.offset.x : gElCanvas.width / 2, line.offset.y);
    gCtx.strokeText(line.text, (line.offset.x) ? line.offset.x : gElCanvas.width / 2, line.offset.y);
}

