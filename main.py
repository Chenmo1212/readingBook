import os
import re

import requests
from bs4 import BeautifulSoup
import json
import time
import hashlib


def get_content_hash(content):
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def load_existing_hashes(hash_file_path):
    if os.path.exists(hash_file_path):
        with open(hash_file_path, 'r') as file:
            return set(json.load(file))
    else:
        return set()


def save_hash(hash_file_path, content_hash):
    existing_hashes = load_existing_hashes(hash_file_path)
    existing_hashes.add(content_hash)
    with open(hash_file_path, 'w') as file:
        json.dump(list(existing_hashes), file)


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


def clean_text(text):
    """清洗文本，例如作者和日期"""
    return ' '.join(text.split())


def calculate_text_num(content):
    """计算去除HTML标签后的字符数"""
    soup = BeautifulSoup(content, "html.parser")
    text = soup.get_text()
    return len(text)


def scrape_data(url, existing_hashes):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            title = soup.select_one('.title').text.strip()
            author = clean_text(soup.select_one('.author').text.replace("作者", "").strip())
            date = clean_text(soup.select_one('.dates').text.replace("更新时间", "").strip())
            contents_div = soup.select_one('.contents')
            content_html = ''.join(str(item) for item in contents_div.contents)
            text_num = calculate_text_num(content_html)

            content_hash = get_content_hash(content_html)
            # 如果内容的哈希值已经存在，则返回None表示重复
            if content_hash in existing_hashes:
                print(title, "重复了")
                return None

            data = {
                'title': title,
                'author': author,
                'content': content_html,
                'text_num': text_num,
                'date': date,
                'content_hash': content_hash,  # 存储内容的哈希值
            }

            return data
        else:
            return None
    except Exception as error:
        print("An exception occurred:", error)


def main(url, num_requests, hash_file_path):
    existing_hashes = load_existing_hashes(hash_file_path)
    articles_dir = "articles"
    success = 0
    fail = 0

    if not os.path.exists(articles_dir):
        os.makedirs(articles_dir)

    for i in range(num_requests):
        data = scrape_data(url, existing_hashes)
        if data and data['content_hash'] not in existing_hashes:
            save_hash(hash_file_path, data['content_hash'])
            existing_hashes.add(data['content_hash'])
            file_name = f"{data['title'].replace(' ', '_')}.json"
            file_name = clean_filename(file_name)
            file_path = os.path.join(articles_dir, file_name)
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(data, file, ensure_ascii=False, indent=4)
            print("Success", file_name)
            success += 1
        else:
            fail += 1

        time.sleep(0.5)
    print("结果比例为", success, fail)


# 示例使用
url = "http://htwinkle.cn/article"
num_requests = 300
hash_file_path = "existing_hashes.json"
main(url, num_requests, hash_file_path)
