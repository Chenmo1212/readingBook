// 要下载的图片的地址
let downloadImgUrl = ''

function generateQrcode(sharingUrl) {
    // 绘制二维码
    let qrcode = new QRCode(document.getElementById("qrcodeCanvas"), {
        width: 100,
        height: 100,
        colorDark: "#8492a6",
        colorLight: "#ffffff",
    });

    // 二维码内容
    qrcode.makeCode(sharingUrl)
}

function my$(id) {
    return document.getElementById(id)
}

function getSharingPost(sharingUrl) {

    // 生成二维码
    generateQrcode(sharingUrl)

    my$('sharing').style.display = 'block'
    let baseUrl = 'https://www.chenmo1212.cn/bingApi'
    let imgUrl = baseUrl + '/HPImageArchive.aspx?' + `format=js&idx=0&n=8&mkt=zh-CN`
    let img = my$("bgImg");

    // img.src = 'https://www.chenmo1212.cn/bingApi/th?id=OHR.VarandhaGhat_ZH-CN1268827595_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'
    // handleHtml2Canvas()

    fetch(imgUrl)
        .then(res => res.json())
        .then(res => {
            img.src = baseUrl + res.images[2].url;
            console.log(img.src);
            handleHtml2Canvas()
        })
}

// HTML转图片
function handleHtml2Canvas() {
    let canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 469;

    // 获取元素相对于视窗的偏移量
    let htmlDiv = my$("htmlDiv");
    let rect = my$('htmlDiv').getBoundingClientRect();
    console.log(rect)
    // 设置context位置, 值为相对于视窗的偏移量的负值, 实现图片复位
    let context = canvas.getContext("2d");
    context.translate(-(rect.left), -rect.top);
    console.log(canvas.getBoundingClientRect())

    // context.scale(2,2);
    html2canvas(htmlDiv, {
        canvas: canvas,
        background: '#fff',
        dpi: window.devicePixelRatio * 2,// window.devicePixelRatio是设备像素比
        scale: 2,
        onrendered: function (canvas) {
            let myImage = canvas.toDataURL("image/png");
            my$('img').setAttribute("crossOrigin", '')
            my$('img').setAttribute("src", myImage);
            htmlDiv.style.opacity = '0';
        }
    }).then(canvas => downloadImgUrl = canvas);
}

// 下载图片
function downloadImg(canvas) {
    let a = document.createElement('a');
    let dom = document.body.appendChild(canvas);
    dom.style.display = 'none';
    a.style.display = 'none';
    document.body.removeChild(dom);
    let blob = dataURLToBlob(dom.toDataURL('image/png'));
    a.setAttribute('href', URL.createObjectURL(blob));
    //这块是保存图片操作  可以设置保存的图片的信息
    a.setAttribute('download', '1.png');
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(blob);
    document.body.removeChild(a);
}

// 图片转换成base64
function dataURLToBlob(dataUrl) {
    let arr = dataUrl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
