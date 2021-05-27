// 页面加载完以后加载字体文件
window.onload = function () {
    let xhr = new XMLHttpRequest(); // 定义一个异步对象
    xhr.open('GET', './dist/text3.ttf', true); // 异步GET方式加载字体
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
        styles.innerHTML = '@font-face{font-family:"text";src:url("./dist/text3.ttf") format("truetype");font-display:swap;}';
        console.log(document.getElementsByTagName('head'));
        document.getElementsByTagName('head')[0].appendChild(styles);
        // }
    }
    xhr.send();
}
