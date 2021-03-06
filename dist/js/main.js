let title = document.querySelector('.text-title');
let author = document.getElementById('text_author');
let content = document.querySelector('.text-content');
let desc = '';
let num = document.getElementById('text_num');
let date = document.getElementById('text_date');
let favourite = document.getElementById('favourite');
let myFavourite = document.getElementById('myFavourite');
let randomArticle = document.getElementById('randomArticle');
let loadingContainer = document.querySelector('.loading-container');
let data = ''
let button = document.querySelector('.heart');

function setArticleInfo(data) {
    title.innerHTML = data.title;
    author.innerHTML = data.author;
    content.innerHTML = data.content;
    desc = data.digest;
    let str = data.wc.toString();
    let reg = /^(\d{4})(\d{2})(\d{2})$/;
    str = str.replace(reg, "$1-$2-$3");
    num.innerText = str
    // num.innerText = data.wc;
    date.innerText = data.date.curr;
}

function request(url, method, payload, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && callback)
            callback(xhr)
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(payload)
}

function GET(url, callback) {
    request(url, "GET", null, callback)
}

function POST(payload, callback) {
    request(url, "POST", payload, callback)
}

function getNewArticle() {
    GET('https://interface.meiriyiwen.com/article/random?dev=1', xhr => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText).data
            setArticleInfo(data)
        } else {
            console.error("Failed to load messages")
        }
    })
}

function getDateArticle(date) {
    GET('https://interface.meiriyiwen.com/article/day?dev=1&date=' + date, xhr => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText).data
            setArticleInfo(data)
        } else {
            console.error("Failed to load messages")
        }
    })
}

function init() {
    let id = getUrlParam('c');
    if (getUrlParam('f') === 'bookmark') {
        data = JSON.parse(localStorage.bookmarkLists)[id];
        if (data !== undefined) {
            setArticleInfo(data)
            setBookmark('');
            return
        }
    }
    if (getUrlParam('date') !== null) {
        getDateArticle(getUrlParam('date'))
        return
    }
    if (typeof localStorage.currData !== "undefined") {
        data = JSON.parse(localStorage.currData)
        setArticleInfo(data);
        if (typeof localStorage.bookmarkLists !== "undefined") {
            let bookmarkLists = JSON.parse(localStorage.bookmarkLists);
            bookmarkLists.forEach(e => {
                if (e.date.curr === data.date.curr) {
                    setBookmark('');
                }
            })
        }
        return
    }
    getNewArticle()
}

function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2])
    }
    return null;
}

function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/ ??? | ???/g, "-")
        .replace(/???/g, " ")
        .replace(/??????/g, "  AM  ")
        .replace(/??????/g, "  PM  ");
}

init()
Toast.init();

/**
 * ????????????
 */

favourite.onclick = function () {
    setBookmark('')
    let ifAdd = button.classList.contains('active');
    if (ifAdd) {
        console.log("????????????");
        let bookmarkLists = []
        let temp = data;
        temp['isFavourite'] = true;
        let a = new Date().getTime()
        temp['favouriteDate'] = getLocalTime(a);
        // ??????????????????
        if (typeof localStorage.bookmarkLists !== "undefined") {
            bookmarkLists = JSON.parse(localStorage.bookmarkLists)
        }
        bookmarkLists.push(temp)
        localStorage.setItem('bookmarkLists', JSON.stringify(bookmarkLists))
        Toast.show('????????????', 'success', null);
    } else {
        console.log("??????????????????");
        let bookmarkLists = JSON.parse(localStorage.bookmarkLists)
        let count = 0;
        bookmarkLists.forEach(item => {
            if (item.date.curr === data.date.curr) {
                bookmarkLists.splice(count, 1)
                localStorage.setItem('bookmarkLists', JSON.stringify(bookmarkLists))
                return true
            }
            count++
        })
        Toast.show('????????????', 'success', null);
    }
}
myFavourite.onclick = function () {
    localStorage.setItem('currData', JSON.stringify(data))
    window.location.href = './bookmark.html'
}
randomArticle.onclick = function () {
    setBookmark('inactive')
    getNewArticle();
    backTop()
}

/**
 * ????????????
 */

let darkMode = localStorage.getItem("darkMode");
let obj = document.querySelector('.mode');
let obj_box = document.querySelector('.dark_mode');

function enableDarkMode() {
    darkMode = 'enabled';
    localStorage.setItem("darkMode", "enabled");
    document.documentElement.style.setProperty('--color-font', '#fdfdfd');
    document.documentElement.style.setProperty('--color-background', '#404040');
    obj_box.classList.toggle('dark');
    obj.classList.toggle('off');
    obj.classList.add('scaling');
    setTimeout(function () {
        obj.classList.remove('scaling');
    }, 520);
}

function disableDarkMode() {
    darkMode = null;
    localStorage.setItem("darkMode", null);
    document.documentElement.style.setProperty('--color-font', '#404040');
    document.documentElement.style.setProperty('--color-background', '#fdfdfd');
    obj_box.classList.toggle('dark');
    obj.classList.toggle('off');
    obj.classList.add('scaling');
    setTimeout(function () {
        obj.classList.remove('scaling');
    }, 520);
}

if (darkMode === "enabled") {
    enableDarkMode();
    obj_box.classList.add('dark')
} else {
    disableDarkMode();
    obj_box.classList.remove('dark')
}

// Listeners
const darkModeToggle = document.querySelector("#darkMode");
darkModeToggle.onclick = function () {
    if (darkMode === 'enabled') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

/**
 * ??????
 */
function setBookmark(type) {
    if (type === 'inactive') {
        if (button.classList.contains('active')) {
            button.classList.toggle('active')
        }
        return
    }
    button.classList.toggle('active')
}

/**
 * ???????????????
 */

function toGetSharePost() {
    // ??????loading
    loadingContainer.style.display = 'block'

    let id = date.innerText
    let sharingUrl = 'https://www.chenmo1212.cn/book?date=' + id;
    let title_ = document.querySelector('.share-article-title')
    let author_ = document.querySelector('.share-article-author')
    let desc_ = document.querySelector('.share-article-desc')

    title_.innerText = title.innerText
    author_.innerText = author.innerText

    my$('sharing').style.display = 'block'
    splitContent(desc, desc_, 2, 5);
    getSharingPost(sharingUrl)
}

// ??????????????????????????????html2canvas??????????????????
function splitContent(text, box, maxRow, offset) {
    let re = /[^\x00-\xff]/g; // ?????????????????????
    let style = getComputedStyle(box, null); // ?????????????????????
    let ele = window.getComputedStyle(document.querySelector(".share-article-desc"))
    let w = parseInt(ele.width) - 20;
    let mSize = parseInt(style.fontSize);

    let count = Math.floor(w / mSize); // ????????????????????????
    let hasDouble = text.match(re);
    let len = hasDouble ? (hasDouble.length + text.length) / 2 : text.length / 2;
    let maxSize = count * maxRow; // ???????????????????????????
    if (len > maxSize) {
        for (let i = maxSize; i < text.length; i++) {
            let mText = text.substr(0, i);
            let has = mText.match(re);
            let mLen = has ? (has.length + mText.length) / 2 : mText.length / 2;
            if (mLen >= maxSize - offset) {
                text = mText + '...';
                break;
            }
        }
    }
    box.innerHTML = text;
}

function closeSharePost() {
    my$('sharing').style.display = 'none';
    my$('htmlDiv').style.opacity = '1';
    my$('img').setAttribute('src', '');
    my$('qrcodeCanvas').innerHTML = "";
    document.querySelector('.button').classList.remove('loading');
    document.querySelector('.button').classList.remove('complete');
}

// ?????????????????????PC???
if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    // ?????????
    document.querySelector('.button').style.display = 'none'
    document.querySelector('.download-tip').style.display = 'block'
} else {
    document.querySelector('.button').style.display = 'flex'
    document.querySelector('.download-tip').style.display = 'none'
}

//????????????
let clientHeight = document.documentElement.clientHeight;
let time = null;
let isTop = true,
    cancelScroll = false;

window.onscroll = function () {
    if (!isTop) {
        clearInterval(time);
    }
    isTop = false;
}

function babckTop() {
    //????????????
    if (cancelScroll === false) {
        time = setInterval(function () {
            var osTop = document.documentElement.scrollTop || document.body.scrollTop;
            var ispeed = Math.floor(-osTop / 10);
            document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
            isTop = true;
            if (osTop === 0) {
                clearInterval(time);
            }
        }, 30);
    } else {
        clearInterval(time);
        cancelScroll = true;
    }
}
