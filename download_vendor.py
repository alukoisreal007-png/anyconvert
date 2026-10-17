import urllib.request
import os

LIB_DIR = r"C:\Users\user\Downloads\AnyConvert\lib"
os.makedirs(LIB_DIR, exist_ok=True)

urls = {
    "mammoth.browser.min.js": "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
    "html2pdf.bundle.min.js": "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
    "pdf-lib.min.js": "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js",
    "docx.umd.js": "https://cdn.jsdelivr.net/npm/docx@8.2.2/build/index.umd.js"
}

print("Downloading libraries for 100% Offline Support...")
headers = {'User-Agent': 'Mozilla/5.0'}

for filename, url in urls.items():
    dest_path = os.path.join(LIB_DIR, filename)
    print(f"Downloading {filename}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest_path, 'wb') as f:
            f.write(resp.read())
        print(f" Saved {filename} ({os.path.getsize(dest_path)} bytes)")
    except Exception as e:
        print(f" Could not download {filename}: {e}")

print("Offline library download process completed.")
