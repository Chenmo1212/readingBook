let title = document.querySelector('.text-title');
let author = document.getElementById('text_author');
let content = document.querySelector('.text-content');
let num = document.getElementById('text_num');
let date = document.getElementById('text_date');
let favourite = document.getElementById('favourite');
let myFavourite = document.getElementById('myFavourite');
let randomArticle = document.getElementById('randomArticle');
let data = ''
let button = document.querySelector('.bookmark');

function setArticleInfo(data) {
    title.innerHTML = data.title;
    author.innerHTML = data.author;
    content.innerHTML = data.content;
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
init()
function init(){
    let id = getUrlParam('c');
    if (getUrlParam('f') === 'bookmark'){
        data = JSON.parse(localStorage.bookmarkLists)[id];
        if(data !== undefined) {
            setArticleInfo(data)
            setBookmark(button);
            return
        }
    }
    if (typeof localStorage.currData !== "undefined"){
        data = JSON.parse(localStorage.currData)
        setArticleInfo(data);
        return
    }
    getNewArticle()
}

function getUrlParam(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return unescape(r[2])
    }
    return null;
}

/**
 * 点击事件
 */

favourite.onclick = function () {
    let ifAdd = !button.classList.contains('marked');
    if (ifAdd) {
        console.log("添加收藏");
        let bookmarkLists = []
        let temp = data;
        temp['isFavourite'] = true;
        let a = (new Date()).toLocaleDateString()//获取当前日期
        temp['favouriteDate'] = a.replace(/\//g, '-');
        // 本地获取数据
        if (typeof localStorage.bookmarkLists !== "undefined") {
            bookmarkLists = JSON.parse(localStorage.bookmarkLists)
        }
        bookmarkLists.push(temp)
        localStorage.setItem('bookmarkLists', JSON.stringify(bookmarkLists))
    } else {
        console.log("取消添加收藏");
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
    }
}
myFavourite.onclick = function () {
    localStorage.setItem('currData', JSON.stringify(data))
    window.location.href = './bookmark.html'
}
randomArticle.onclick = function () {
    getNewArticle()
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
 * 书签
 */
function setBookmark() {
    setBookmarkAnimation(button)
}
