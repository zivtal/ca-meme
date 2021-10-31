'use strict';

var gKeySelected;

function initGrid(mode) {
    switch (mode) {
        case 'storage':
            toggleHideElement('.grid-control', true);
            renderStorageGrid();
            break;
        case 'gallery':
            toggleHideElement('.grid-control', false);
            createKeywords();
            renderGalleryGrid();
            break;
    }
}

function renderGalleryGrid(keyword) {
    const keywords = getKeywords();
    const keywordsMap = getKeywordsMap();
    // filter selected keyword
    if (keyword) {
        const found = keywords.filter(key => keyword === key.substr(0, keyword.length));
        keyword = keywords.find(key => (keyword === key.substr(0, keyword.length) && key !== gKeySelected));
        if (found) {
            const elKeywordsDB = document.querySelector('#keywordsdb');
            elKeywordsDB.innerHTML = found.map(key => `<option value="${key}">`).join();
        }
    }
    // get image list
    const imgs = (!keyword) ? getImgs() : getImgs(keyword);
    if (!imgs.length) return;
    // Set header
    const elTitle = document.querySelector('.grid-container h1');
    elTitle.innerText = 'Gallery';
    // Set grid template mode
    const elGrid = document.querySelector('.grid-content');
    if (imgs.length < 4) { elGrid.style = 'grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));'; } else { elGrid.style = ''; }
    // Generate images
    elGrid.innerHTML = '';
    imgs.forEach(function (img) { loadImg(img.url, getThumb, img.id, false) });
    // Generate keywords
    let strHtml = '';
    keywords.forEach(keyword => strHtml += `<span style="font-size:${Math.min(16 + keywordsMap[keyword], 48)}px" onclick="onKeywordClick(this)">${keyword}</span>`);
    const elKeywords = document.querySelector('.grid-control .keywords');
    elKeywords.innerHTML = strHtml;
}

function renderStorageGrid() {
    let imgs = getStorageImgs();
    // Set header
    const elTitle = document.querySelector('.grid-container h1');
    const elGrid = document.querySelector('.grid-content');
    elGrid.innerHTML = '';
    if (!imgs || !imgs.length) {
        elTitle.innerText = 'Storage is empty';
        return;
    }
    elTitle.innerText = 'Storage';
    if (imgs.length < 4) { elGrid.style = 'grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));'; } else { elGrid.style = ''; }
    // Generate images
    imgs.forEach((img, idx) => { loadImg(img, getThumb, idx, true) });
}

function getThumb(img, id, isStorage) {
    const height = (img.height > img.width) ? 100 : 100 * (img.height / img.width);
    const width = (img.width > img.height) ? 100 : 100 * (img.width / img.height);
    const columnSpan = Math.floor(width / 10);
    const rowSpan = Math.floor(height / 10);
    const elGrid = document.querySelector('.grid-content');
    elGrid.innerHTML += `<img data-image="${id}" onclick="onImgClick(this${(isStorage) ? ',true' : ''})" src="${img.src}" style="grid-column: span ${columnSpan};grid-row: span ${rowSpan}">`;
}

function onImgClick(el, isStorage = false) {
    setNewCanvas(el.dataset['image'], isStorage);
}

function onKeywordClick(el) {
    const keyword = el.innerText;
    const keywordsMap = getKeywordsMap();
    keywordsMap[keyword]++;
    el.style = `font-size:${Math.min(16 + keywordsMap[keyword], 28)}px`;
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
