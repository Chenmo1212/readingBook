/**
 * 用原生 JS 封装一个 Toast 组件
 */
var Toast = {
    // 隐藏的 setTimeOut 引用
    hideTimeOut: null,
    /**
     * 初始化
     */
    init: function () {
        var toastNode = document.createElement('section');
        toastNode.innerHTML = '<i class="iconfont icon-success"></i><i class="iconfont icon-error"></i><span class="text">111</span>';
        toastNode.id = 'toastWaka'; // 设置id，一个页面有且仅有一个Toast
        toastNode.setAttribute('class', 'toast');   // 设置类名
        toastNode.style.display = 'none';   // 设置隐藏
        document.body.appendChild(toastNode);
    },
    /**
     * 显示Toast
     * @param text 文本内容
     * @param type 类型 success error
     * @param duration 持续时间
     */
    show: function (text, type, duration) {
        // 确保上一次的 TimeOut 已被清空
        if (this.hideTimeOut) {
            clearTimeout(this.hideTimeOut);
            this.hideTimeOut = null;
            // console.error('上一次的 TimeOut 还未走完!');
            // return;
        }
        if (!text) {
            console.error('text 不能为空!');
            return;
        }
        var domToastWaka = my$('toastWaka');
        // console.log('domToastWaka', domToastWaka);
        if (!domToastWaka) {
            console.error('toastWaka DOM 不存在!');
            return;
        }
        var domIconSuccess = domToastWaka.querySelector('.icon-success');   // 成功图标
        var domIconError = domToastWaka.querySelector('.icon-error');   // 错误图标
        var domToastText = domToastWaka.querySelector('.text');   // 文字
        domToastText.innerHTML = text || '';
        switch (type) {
            case 'success':
                domIconSuccess.style.display = 'inline-block';
                domIconError.style.display = 'none';
                break;
            case 'error':
                domIconSuccess.style.display = 'none';
                domIconError.style.display = 'inline-block';
                break;
            default:
                domIconSuccess.style.display = 'none';
                domIconError.style.display = 'none';
                break;
        }
        domToastWaka.style.display = 'block';
        // 不传的话默认2s
        var that = this;
        this.hideTimeOut = setTimeout(function () {
            domToastWaka.style.display = 'none';
            that.hideTimeOut = null;    // 置 TimeOut 引用为空
        }, duration || 2000);
    },
    /**
     * 隐藏 Toast
     */
    hide: function () {
        // 如果 TimeOut 存在
        if (this.hideTimeOut) {
            // 清空 TimeOut 引用
            clearTimeout(this.hideTimeOut);
            this.hideTimeOut = null;
        }
        var domToastWaka = my$('toastWaka');
        if (domToastWaka) {
            domToastWaka.style.display = 'none';
            document.body.removeChild(domToastWaka);
        }
    }
};
