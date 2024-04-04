function my$(id) {
    return document.getElementById(id)
}

// 将文本转换成省略号，html2canvas不支持省略号
function splitContent(text, box, maxRow, offset) {
    let re = /[^\x00-\xff]/g; // 匹配双字节字符
    let style = getComputedStyle(box, null);
    let ele = window.getComputedStyle(document.querySelector(".share-article-desc"))
    let w = parseInt(ele.width) - 20;
    let mSize = parseInt(style.fontSize);

    let count = Math.floor(w / mSize); // 一行可显示多少字
    let hasDouble = text.match(re);
    let len = hasDouble ? (hasDouble.length + text.length) / 2 : text.length / 2;
    let maxSize = count * maxRow; // 最多显示的文字个数
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

function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/ 年 | 月/g, "-")
        .replace(/日/g, " ")
        .replace(/上午/g, "  AM  ")
        .replace(/下午/g, "  PM  ");
}

const removePLabel = (str) => {
    return str.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1");
}



// 页面加载完以后加载字体文件
window.onload = function () {
    let xhr = new XMLHttpRequest(); // 定义一个异步对象
    xhr.open('GET', 'https://cdn.chenmo1212.cn/files/font/text.ttf', true); // 异步GET方式加载字体
    xhr.responseType = "arraybuffer"; //把异步获取类型改为arraybuffer二进制类型
    xhr.onload = function () {
        // 这里做了一个判断：如果浏览器支持FontFace方法执行
        // if (typeof FontFace != 'undefined') {
        //     let buffer = this.response;  //获取字体文件二进制码
        //     let myFonts = new FontFace('text', buffer);  // 通过二进制码实例化字体对象
        //     document.fonts.add(myFonts); // 将字体对象添加到页面中
        // } else {
        // 如果浏览器不支持FontFace方法，直接添加样式到页面
        let styles = document.createElement('style');
        styles.innerHTML = '@font-face{font-family:"text";src:url("https://cdn.chenmo1212.cn/files/font/text.ttf") format("truetype");font-display:swap;}';
        console.log(document.getElementsByTagName('head'));
        document.getElementsByTagName('head')[0].appendChild(styles);
        // }
    }
    xhr.send();
}
