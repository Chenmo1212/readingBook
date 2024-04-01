import re

from flask import Flask, abort, render_template, redirect, url_for
import os
import json
import random

app = Flask(__name__)

# 定义文章存储的目录
ARTICLES_DIR = 'articles'


def clean_filename(filename):
    # Windows文件名不允许的字符
    invalid_chars = r'<>:"/\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    # 进一步去除非打印字符等其他可能的问题字符
    filename = re.sub(r'[^.\w\s-]', '', filename)
    # 去除两边的空格，并确保文件名不为空
    filename = filename.strip()
    # 如果文件名为空（或者只包含了非法字符），提供一个默认值
    if not filename:
        filename = "default_filename"
    return filename


def load_random_article(articles_dir):
    # 获取所有json文件
    json_files = [f for f in os.listdir(articles_dir) if f.endswith('.json')]
    if not json_files:
        return None

    selected_file = random.choice(json_files)
    file_path = os.path.join(articles_dir, selected_file)

    with open(file_path, 'r', encoding='utf-8') as file:
        article = json.load(file)
    return article


def load_article(article_id):
    file_path = os.path.join(ARTICLES_DIR, f"{article_id}.json")
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as file:
        article = json.load(file)
    return article


@app.route('/')
def random_article():
    article = load_random_article(ARTICLES_DIR)
    if article:
        article_id = article['title']
        return redirect(url_for('article', article_id=article_id))
    else:
        return "No articles found."


@app.route('/bookmark')
def bookmark():
    return render_template('bookmark.html')


@app.route('/article/<article_id>')
def article(article_id):
    clean_article_id = clean_filename(article_id)
    article = load_article(clean_article_id)
    if article:
        return render_template('index.html', **article)
    else:
        abort(404)  # 如果文章不存在，返回404错误


if __name__ == '__main__':
    app.run(debug=True)
