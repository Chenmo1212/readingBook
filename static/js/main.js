const title = document.querySelector('.text-title');
const author = my$('text_author');
const content = document.querySelector('.text-content');
const num = my$('text_num');
const date = my$('text_date');
const favouriteBtn = my$('favourite');
const myFavouriteBtn = my$('myFavourite');
const randomArticleBtn = my$('randomArticle');
const loadingContainer = document.querySelector('.loading-container');
const heartBtn = document.querySelector('.heart');

function init() {
    if (typeof localStorage.bookmarkLists !== "undefined") {
        let bookmarkLists = JSON.parse(localStorage.bookmarkLists);
        bookmarkLists = bookmarkLists.filter(e => e.title === title.innerHTML);
        if (bookmarkLists.length) setBookmark('');
    }
}

init()
Toast.init();

/**
 * 点击事件
 */

favouriteBtn.onclick = function () {
    setBookmark('')
    let ifAdd = heartBtn.classList.contains('active');
    if (ifAdd) {
        let bookmarkLists = [];
        const digest = removePLabel(content.innerHTML).substring(0, 43) + "...";
        let temp = {
            title: title.innerHTML,
            author: author.innerHTML,
            content: content.innerHTML,
            date: date.innerHTML,
            wc: num.innerHTML,
            digest: digest,
            isFavourite: true,
            favouriteDate: getLocalTime(new Date().getTime())
        }
        // 本地获取数据
        if (typeof localStorage.bookmarkLists !== "undefined") {
            bookmarkLists = JSON.parse(localStorage.bookmarkLists)
        }
        bookmarkLists.push(temp)
        localStorage.setItem('bookmarkLists', JSON.stringify(bookmarkLists))
        Toast.show('收藏成功', 'success', null);
    } else {
        console.log("取消添加收藏");
        let bookmarkLists = JSON.parse(localStorage.bookmarkLists)
        bookmarkLists = bookmarkLists.filter(e => e.title !== title.innerHTML);
        localStorage.setItem('bookmarkLists', JSON.stringify(bookmarkLists))
        Toast.show('收藏取消', 'success', null);
    }
}
myFavouriteBtn.onclick = function () {
    localStorage.setItem('currData', JSON.stringify({
        title: title.innerHTML,
        author: author.innerHTML,
        content: content.innerHTML,
        num: num.innerHTML,
        date: date.innerHTML
    }))
    window.location.href = '/bookmark'
}
randomArticleBtn.onclick = function () {
    localStorage.removeItem("currData");
    setBookmark('inactive')
    window.location.href = '/'
}

/**
 * 黑夜模式
 */

let darkMode = localStorage.getItem("darkMode");
let obj = document.querySelector('.mode');
let obj_box = document.querySelector('.dark_mode');

function enableDarkMode() {
    darkMode = 'enabled';
    localStorage.setItem("darkMode", "enabled");
    document.documentElement.style.setProperty('--color-font', '#fdfdfd');
    document.documentElement.style.setProperty('--color-background', '#404040');
    document.documentElement.classList.toggle('dark');
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
    document.documentElement.classList.toggle('dark');
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
 * 书签
 */
function setBookmark(type) {
    if (type === 'inactive') {
        if (heartBtn.classList.contains('active')) {
            heartBtn.classList.toggle('active')
        }
        return
    }
    heartBtn.classList.toggle('active')
}

/**
 * 二维码海报
 */

function toGetSharePost() {
    loadingContainer.style.display = 'block'

    const sharingUrl = `http://${window.location.host}/article/${title.innerHTML}`;
    const title_ = document.querySelector('.share-article-title')
    const author_ = document.querySelector('.share-article-author')
    const desc_ = document.querySelector('.share-article-desc')

    title_.innerText = title.innerHTML
    author_.innerText = author.innerHTML
    desc_.innerHTML = removePLabel(content.innerHTML);

    my$('sharing').style.display = 'block'
    splitContent(desc_.innerHTML, desc_, 2, 5);
    getSharingPost(sharingUrl)
}

function closeSharePost() {
    my$('sharing').style.display = 'none';
    my$('htmlDiv').style.opacity = '1';
    my$('img').setAttribute('src', '');
    my$('qrcodeCanvas').innerHTML = "";
    document.querySelector('.button').classList.remove('loading');
    document.querySelector('.button').classList.remove('complete');
}

// 判断移动端还是PC端
if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    // 移动端
    document.querySelector('.button').style.display = 'none'
    document.querySelector('.download-tip').style.display = 'block'
} else {
    document.querySelector('.button').style.display = 'flex'
    document.querySelector('.download-tip').style.display = 'none'
}

//文档高度
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

function backTop() {
    //点击事件
    if (cancelScroll === false) {
        time = setInterval(function () {
            let osTop = document.documentElement.scrollTop || document.body.scrollTop;
            let ispeed = Math.floor(-osTop / 10);
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
