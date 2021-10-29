'use strict';

var gKeywords;
var gKeywordsMap;
var gKeySelected;

function initGrid(mode) {
    const elGrid = document.querySelector('.grid-container');
    const elControl = elGrid.querySelector('.grid-control')
    const elStorageBtn = document.querySelector('.storage-button');
    if (getStorageImgs().length === 0) {
        elStorageBtn.classList.add('hide');
    } else {
        elStorageBtn.classList.remove('hide');
    }
    switch (mode) {
        case 'storage':
            elControl.classList.add('hide');
            renderStorageGrid();
            break;
        case 'gallery':
            elControl.classList.remove('hide');
            createKeywords();
            renderGalleryGrid();
            break;
    }
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

function renderGalleryGrid(keyword) {
    // filter selected keyword
    if (keyword) gKeywords.forEach(kw => {
        if (keyword === kw.substr(0, keyword.length) && kw !== gKeySelected) keyword = kw;
    });
    gKeySelected = (keyword) ? keyword : null;
    // get image list
    const imgs = (!keyword) ? getImgs() : getImgs(keyword);
    if (!imgs.length) return;
    // Set grid template mode
    const elGrid = document.querySelector('.grid-content');
    if (imgs.length < 3) elGrid.style = 'grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));';
    // Generate images
    elGrid.innerHTML = '';
    imgs.forEach(function (img) { loadImg(img.url, createThumbSize, img.id, false) });
    // Generate keywords
    let strHtml = '';
    gKeywords.forEach(keyword => strHtml += `<span style="font-size:${Math.min(16 + gKeywordsMap[keyword], 48)}px" onclick="onKeywordClick(this)">${keyword}</span>`);
    const elKeywords = document.querySelector('.grid-control .keywords');
    elKeywords.innerHTML = strHtml;
}

function renderStorageGrid() {
    let imgs = getStorageImgs();
    if (!imgs.length) return;
    // Set grid template mode
    const elGrid = document.querySelector('.grid-content');
    if (imgs.length < 3) elGrid.style = 'grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));';
    // Generate images
    elGrid.innerHTML = '';
    imgs.forEach(function (img, idx) { loadImg(img, createThumbSize, idx, true) });
}

function onImgClick(el, isStorage = false) {
    initCanvas(el.dataset['image'], isStorage);
}

function onKeywordClick(el) {
    const keyword = el.innerText;
    gKeywordsMap[keyword]++;
    el.style = `font-size:${Math.min(16 + gKeywordsMap[keyword], 48)}px`;
    if (keyword === gKeySelected) return;
    renderGalleryGrid(keyword);
}

function onKeywordSearch(el) {
    const keyword = el.value;
    renderGalleryGrid(keyword);
}

function onClickClear() {
    const elSearch = document.querySelector('.searchinput');
    elSearch.value = '';
    renderGalleryGrid();
}

function createThumbSize(img, id, isStorage) {
    const height = (img.height > img.width) ? 100 : 100 * (img.height / img.width);
    const width = (img.width > img.height) ? 100 : 100 * (img.width / img.height);
    const columnSpan = Math.floor(width / 10);
    const rowSpan = Math.floor(height / 10);
    const elGrid = document.querySelector('.grid-content');
    elGrid.innerHTML += `<img data-image="${id}" onclick="onImgClick(this${(isStorage) ? ',true' : ''})" src="${img.src}" style="grid-column: span ${columnSpan};grid-row: span ${rowSpan}">`;
}