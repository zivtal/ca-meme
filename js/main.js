'use strict';

function init() {
    initCanvasModel();
    initCanvas();
    pageToggle('gallery');
}

function pageToggle(page) {
    if (page) {
        switch (page) {
            case 'gallery':
            case 'storage':
                initGrid(page);
                toggleHideElement('.canvas-container', true);
                toggleHideElement('.grid-container', false);
                break;
            case 'editor':
                toggleHideElement('.canvas-container', false);
                toggleHideElement('.grid-container', true);
                break;
        }
    } else {
        toggleHideElement('.canvas-container');
        toggleHideElement('.grid-container');
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

function toggleDisableInput(elSelector, isDisabled, value, placeholder) {
    const el = document.querySelector(elSelector);
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
    if (placeholder) el.placeholder = (placeholder) ? placeholder : '';
    if (isDisabled === null) isDisabled = el.hasAttribute('disabled');
    if (isDisabled) {
        el.setAttribute('disabled', '');
    } else {
        el.removeAttribute('disabled');
    }
}
