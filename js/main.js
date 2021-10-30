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