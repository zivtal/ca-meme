'use strict';

var gKeywords;
var gKeywordsMap;
var gKeySelected;

function initGrid() {
    createKeywords();
    renderGrid();
}

function createKeywords(imgs = getImgs()) {
    const keywords = [];
    gKeywordsMap = {};
    imgs.forEach(img => {
        img.keywords.forEach(keyword => {
            if (!keywords.includes(keyword)) keywords.push(keyword);
            gKeywordsMap[keyword] = (!gKeywordsMap[keyword]) ? 1 : gKeywordsMap[keyword] + 1;
        })
    });
    gKeywords = keywords;
}

function renderGrid(keyword) {
    if (keyword) gKeywords.forEach(kw => {
        if (keyword === kw.substr(0, keyword.length) && kw !== gKeySelected) keyword = kw;
    });
    gKeySelected = (keyword) ? keyword : null;
    const imgs = (!keyword) ? getImgs() : getImgs(keyword);
    if (!imgs.length) return;
    const elGrid = document.querySelector('.grid-content');
    if (imgs.length < 3) elGrid.style = 'grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));';
    elGrid.innerHTML = '';
    imgs.forEach(function (img) { loadImg(img.url, createThumbSize, img.id) });
    let strHtml = '';
    gKeywords.forEach(keyword => strHtml += `<span style="font-size:${Math.min(16 + gKeywordsMap[keyword], 48)}px" onclick="onKeywordClick(this)">${keyword}</span>`);
    const elKeywords = document.querySelector('.grid-control .keywords');
    elKeywords.innerHTML = strHtml;
    pageToggle('gallery');
}

function onImgClick(el) {
    initCanvas(el.dataset['image']);
}

function onKeywordClick(el) {
    const keyword = el.innerText;
    gKeywordsMap[keyword]++;
    el.style = `font-size:${Math.min(16 + gKeywordsMap[keyword], 48)}px`;
    if (keyword === gKeySelected) return;
    renderGrid(keyword);
}

function onKeywordSearch(el) {
    const keyword = el.value;
    renderGrid(keyword);
}

function onClickClear() {
    renderGrid();
}

function createThumbSize(img, id) {
    const height = (img.height > img.width) ? 100 : 100 * (img.height / img.width);
    const width = (img.width > img.height) ? 100 : 100 * (img.width / img.height);
    const columnSpan = Math.floor(width / 10);
    const rowSpan = Math.floor(height / 10);
    const elGrid = document.querySelector('.grid-content');
    elGrid.innerHTML += `<img data-image="${id}" onclick="onImgClick(this)" src="${img.src}" style="grid-column: span ${columnSpan};grid-row: span ${rowSpan}">`;
}