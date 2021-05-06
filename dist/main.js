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

GET('https://interface.meiriyiwen.com/article/random?dev=1', xhr => {
    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText).data
        // console.log(data)
        setArticleInfo(data)
    } else
        console.error("Failed to load messages")
})

var title = document.querySelector('.text-title');
var author = document.getElementById('text_author');
var content = document.querySelector('.text-content');
var num = document.getElementById('text_num');
var date = document.getElementById('text_date');
var next = document.getElementById('next');
var previous = document.getElementById('previous');
var data = ''

function setArticleInfo(data) {
    title.innerHTML = data.title;
    author.innerHTML = data.author;
    content.innerHTML = data.content;
    var str = data.wc.toString();
    var reg = /^(\d{4})(\d{2})(\d{2})$/;
    str = str.replace(reg, "$1-$2-$3");
    num.innerText = str
    // num.innerText = data.wc;
    date.innerText = data.date.curr;
}

next.onclick = function () {
    let baseUrl = 'https://interface.meiriyiwen.com/article/day?dev=1&date='
    GET(baseUrl + data.date.next, xhr => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText).data
            setArticleInfo(data)
        } else
            console.error("Failed to load messages")
    })
}
previous.onclick = function () {
    let baseUrl = 'https://interface.meiriyiwen.com/article/day?dev=1&date='
    GET(baseUrl + data.date.prev, xhr => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText).data
            setArticleInfo(data)
        } else
            console.error("Failed to load messages")
    })
}

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

// 页面加载完以后加载字体文件
window.onload = function(){
    let xhr = new XMLHttpRequest(); // 定义一个异步对象
    xhr.open('GET', './dist/text.ttf', true); // 异步GET方式加载字体
    xhr.responseType = "arraybuffer"; //把异步获取类型改为arraybuffer二进制类型
    xhr.onload = function(){
        // 这里做了一个判断：如果浏览器支持FontFace方法执行
        if(typeof FontFace != 'undefined'){
            var buffer = this.response;  //获取字体文件二进制码
            var myFonts = new FontFace('text', buffer);  // 通过二进制码实例化字体对象
            document.fonts.add(myFonts); // 将字体对象添加到页面中
        }else{
            // 如果浏览器不支持FontFace方法，直接添加样式到页面
            let styles = document.createElement('style');
            styles.innerHTML = '@font-face{font-family:"text";src:url("./dist/text.ttf") format("truetype");font-display:swap;}';
            console.log(document.getElementsByTagName('head'));
            document.getElementsByTagName('head')[0].appendChild(styles);
        }
    }
    xhr.send();
}
