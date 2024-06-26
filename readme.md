# Fika Reading

## 简介

> 一个消磨时间片段的小说阅读网站。



### 创作初衷

中学时代总喜欢看各种短篇文章，拿到新课本亦或是新教辅第一件事定是翻阅全书的短篇小说。文章不长，很契合耐心不够的我。

后来耐心见长，也可以读长一些的书籍，便不知觉忽略了当初的喜好。快节奏的社会下，似乎催生了人的戾气，社交软件下满是戾气的文字无疑让人心生厌恶。

简单做了一个可以从现刊读物中随机选取一篇文章的网站，闲余时间还是看各位大作家的短文吧。



### 选名原因

- `FIKA` 一词來自瑞典，基本意思就是和家人朋友一起**喝茶吃点心和瞎扯淡**。



### 在线演示

- 在线演示：[Fika Reading](https://book.chenmo1212.cn/book?f=github)

![post.png](static%2Fimage%2Fpost.png)


## 技术栈

秉承极简风格，网址尽量少用不必用的东西。**能自己写的，绝不使用插件**。

**HTML部分**：`HTML` / `Canvas` / `SVG`

**CSS部分**：`CSS3` / `Flex`/ `CSS变量` / `引用外部字体`

**JavaScript部分**：`html2canvas.js`/ `qrcode.js`

**后端框架**： `Python` / `Flask`

### 特点

**响应式布局** / **黑暗模式** / **本地存储** / **二维码海报** / **文章收藏**



## 使用方法

1. 克隆本项目
```cmd
git clone https://github.com/Chenmo1212/readingBook.git
```

2. 进入项目目录
```cmd
cd readingBook
```

3. 使用`python3`创建虚拟环境并激活
```cmd
python3 -m venv venv

# Windows
source venv/Scripts/activate

# Linus
. venv/bin/activate
```

4. 安装项目所需依赖
```cmd
pip install -r requirements.txt
```

5. 运行flask程序
```cmd
flask run
```

- 觉得项目不错的话，务必赏个Star哦~