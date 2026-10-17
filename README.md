# AnyConvert Studio Pro 🚀

A high-performance, offline-first desktop application suite for multi-format document conversion, screen recording, presentation processing, and media optimization.

All document and image conversions run directly inside local device memory—ensuring complete privacy with zero server data leakage.

---

## 🌟 Key Features

1. **PowerPoint to PDF Converter (.pptx → .pdf)**
   - Full multi-slide pagination preserving every slide in the presentation.
   - Clean vector rendering with individual slide cards and custom slide numbers.
2. **PowerPoint to Word Converter (.pptx → .docx)**
   - Extracts slide titles, bullet points, and speaker notes directly into a structured Word document.
   - Preserves page breaks between slides.
3. **DOCX to PDF Converter (.docx → .pdf)**
   - Multi-page pagination preserving headings, tables, formatting, and images.
4. **Batch Images to PDF Converter (JPG, PNG, WebP → .pdf)**
   - Combine multiple photos into a single PDF with custom page orientation and margins.
5. **Screen Recorder to MP4**
   - High-definition desktop screen recording with system audio and microphone support.
   - Built-in video timeline trimmer, clip splicer, and MP4 export.
6. **Image Compressor & Optimizer**
   - Reduce JPEG, PNG, and WebP file sizes by up to 90% with side-by-side quality comparison.
7. **PDF Merger**
   - Combine multiple PDF documents into a single organized file.
8. **Audio Extractor**
   - Extract background audio tracks from video files into lossless audio.
9. **Video Link Downloader**
   - Direct downloader for online media links.
10. **Market Foundry**
    - Digital product opportunity discovery from Reddit, Hacker News, Dev.to, GitHub, and Stack Overflow.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for local server)
- Modern web browser (Microsoft Edge, Google Chrome, Brave, etc.)

### Launching AnyConvert
1. Clone the repository:
   ```bash
   git clone https://github.com/alukoisreal007-png/anyconvert.git
   cd anyconvert
   ```
2. Start the local server:
   - On Windows: Double-click `run.bat` or `Start_AnyConvert.vbs`
   - Or run via command line:
     ```bash
     python server.py
     ```
3. Open your browser and navigate to:
   ```
   http://127.0.0.1:8888
   ```

---

## 🧪 Automated Testing

AnyConvert includes a built-in verification suite:
```bash
python test_suite.py
```

---

## 🔒 Privacy & Security

- **100% Client-Side:** Office documents (.docx, .pptx), PDFs, and photos are converted locally in browser memory using offline vendor libraries (`jszip`, `pdf-lib`, `docx`, `html2pdf`).
- **No Cloud Uploads:** No company files, confidential slides, or personal recordings are ever transmitted to third-party cloud servers.

---

## 📄 License
MIT License. Feel free to use, modify, and distribute.
