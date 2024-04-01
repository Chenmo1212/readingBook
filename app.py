import re

from flask import Flask, abort, render_template, redirect, url_for
import os
import json
import random

app = Flask(__name__)

# Define the directory where articles are stored
ARTICLES_DIR = 'articles'


def clean_filename(filename):
    # Characters not allowed in Windows file names
    invalid_chars = r'<>:"/\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    # Further remove non-printing characters and other possible problem characters
    filename = re.sub(r'[^.\w\s-]', '', filename)
    # Remove spaces from both sides and make sure the filename is not empty
    filename = filename.strip()
    # If the file name is empty (or contains only illegal characters), provide a default value
    if not filename:
        filename = "default_filename"
    return filename


def load_random_article(articles_dir):
    # Get all json files
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
        abort(404)  # If the article does not exist, a 404 error is returned


if __name__ == '__main__':
    app.run(debug=True)
