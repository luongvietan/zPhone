import os
import requests
from bs4 import BeautifulSoup

# URL của trang web chứa ảnh
url = "https://cellphones.com.vn/xiaomi-redmi-note-13-pro.html"

# Tạo thư mục để lưu ảnh
output_dir = "downloaded_images"
os.makedirs(output_dir, exist_ok=True)

# Gửi request đến URL
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

# Tìm tất cả thẻ ảnh
img_tags = soup.find_all("img")

# Tải xuống từng ảnh
for img in img_tags:
    img_url = img.get("src")
    if not img_url.startswith("http"):
        img_url = f"https://example.com{img_url}"  # Điều chỉnh nếu URL không đầy đủ

    filename = os.path.join(output_dir, os.path.basename(img_url))
    try:
        img_data = requests.get(img_url).content
        with open(filename, "wb") as f:
            f.write(img_data)
        print(f"Tải thành công: {filename}")
    except Exception as e:
        print(f"Lỗi khi tải {img_url}: {e}")
