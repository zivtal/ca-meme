'use strict';

function initGrid() {
    renderGrid();
}

function renderGrid(imgs = getImgs()) {
    var strHtml = '';
    imgs.forEach((img, idx) => strHtml += `<img data-image="${idx}" onclick="onImgClick(this)" src="${img.url}">`);
    const elGrid = document.querySelector('.grid-container');
    elGrid.innerHTML = strHtml;
    pageToggle('gallery');
}

function onImgClick(el) {
    initCanvas(el.dataset['image']);
}