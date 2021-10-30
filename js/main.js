'use strict';

function init() {
    initCanvasModel();
    initCanvas();
    pageToggle('gallery');
}

function pageToggle(page) {
    const elCanvas = document.querySelector('.meme-board');
    const elGrid = document.querySelector('.grid-container');
    if (page) {
        switch (page) {
            case 'gallery':
            case 'storage':
                initGrid(page);
                elCanvas.classList.add('hide');
                elGrid.classList.remove('hide');
                break;
            case 'editor':
                elGrid.classList.add('hide');
                elCanvas.classList.remove('hide');
                break;
        }
    } else {
        elCanvas.classList.toggle('hide');
        elGrid.classList.toggle('hide');
    }
}

function toggleHideElement(elSelector, isHide) {
    const el = document.querySelector(elSelector);
    if (isHide === null) {
        el.classList.toggle('hide');
    } else if (isHide) {
        el.classList.add('hide');
    } else {
        el.classList.remove('hide');
    }
}

function toggleDisableInput(elSelector, isDisabled, value) {
    const el = document.querySelector(elSelector);
    // if (!value && el.type === 'text') { el.value = '' } else { if (value) el.value = value };
    if (value) {
        switch (el.type) {
            case 'range':
                if (typeof value === 'number') el.value = value;
                break;
            default:
                el.value = value;
                break;
        }
    } else if (el.type === 'text') el.value = '';
    if (isDisabled === null) isDisabled = el.hasAttribute('disabled');
    if (isDisabled) {
        el.setAttribute('disabled', '');
    } else {
        el.removeAttribute('disabled');
    }
}