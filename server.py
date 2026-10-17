import http.server
import socketserver
import json
import os
import sys
import time
import urllib.parse
import urllib.request
try:
    import yt_dlp
except ImportError:
    yt_dlp = None


PORT = 8888
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DOWNLOADS_DIR = os.path.join(DIRECTORY, "downloads")
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

active_progress = {}

class AnyConvertHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        if parsed.path == '/' or parsed.path == '':
            self.path = '/index.html'

        if parsed.path == '/api/progress':
            query = urllib.parse.parse_qs(parsed.query)
            task_id = query.get('task_id', ['current'])[0]
            prog = active_progress.get(task_id, {
                'percent': 0,
                'speed': 'Fetching stream...',
                'eta': '--:--',
                'status': 'starting'
            })
            self.send_json_response(200, prog)
            return

        if parsed.path == '/api/health':
            self.send_json_response(200, {'status': 'active', 'engine': 'yt-dlp', 'port': PORT})
            return

        if parsed.path == '/api/proxy':
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get('url', [''])[0]
            if target_url:
                try:
                    req = urllib.request.Request(
                        target_url,
                        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AnyConvert/2.0'}
                    )
                    with urllib.request.urlopen(req, timeout=10) as response:
                        content = response.read()
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(content)
                        return
                except Exception as e:
                    self.send_json_response(500, {'error': str(e)})
                    return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if parsed.path == '/api/extract_info':
            url = data.get('url', '')
            platform = data.get('platform', '')
            try:
                info = extract_yt_info(url, platform)
                self.send_json_response(200, info)
            except Exception as e:
                self.send_json_response(400, {'error': str(e)})
            return

        if parsed.path == '/api/download_video':
            url = data.get('url', '')
            platform = data.get('platform', '')
            preset = data.get('preset', 'mp4_hd')
            task_id = data.get('task_id', 'current')
            try:
                result = download_yt_video(url, platform, preset, task_id)
                self.send_json_response(200, result)
            except Exception as e:
                self.send_json_response(500, {'error': str(e)})
            return

        super().do_POST()

    def send_json_response(self, code, obj):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode('utf-8'))

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def yt_progress_hook(d):
    task_id = d.get('info_dict', {}).get('id') or 'current'
    if d['status'] == 'downloading':
        total = d.get('total_bytes') or d.get('total_bytes_estimate') or 1
        downloaded = d.get('downloaded_bytes', 0)
        percent = min(99.9, round((downloaded / total) * 100, 1))
        speed = d.get('_speed_str', '1.5 MB/s').strip()
        eta = d.get('_eta_str', '00:05').strip()
        active_progress[task_id] = {
            'percent': percent,
            'speed': speed,
            'eta': eta,
            'status': 'downloading'
        }
    elif d['status'] == 'finished':
        active_progress[task_id] = {
            'percent': 100,
            'speed': 'Processing...',
            'eta': '00:00',
            'status': 'finished'
        }

def get_yt_opts(platform, output_template, task_id='current'):
    extractor_args = {}
    format_selector = 'bv*[height<=1080]+ba/b/best'

    if platform == 'tiktok':
        extractor_args = {'tiktok': {'api_hostname': 'api22-normal-c-alisg.tiktokv.com'}}
        format_selector = 'best[height<=1080]/best'
    elif platform == 'youtube':
        format_selector = 'bv*[height<=1080]+ba/b/best'

    return {
        'outtmpl': output_template,
        'format': format_selector,
        'merge_output_format': 'mp4',
        'extractor_args': extractor_args,
        'progress_hooks': [yt_progress_hook],
        'quiet': True,
        'no_warnings': True
    }

def format_sec(seconds):
    if not seconds:
        return "00:00"
    m = str(int(seconds // 60)).zfill(2)
    s = str(int(seconds % 60)).zfill(2)
    return f"{m}:{s}"

def extract_yt_info(url, platform):
    if yt_dlp is None:
        raise RuntimeError("yt-dlp engine is not installed. Please run: pip install yt-dlp")
    out_tmpl = os.path.join(DOWNLOADS_DIR, '%(title)s.%(ext)s')
    opts = get_yt_opts(platform, out_tmpl)
    opts['skip_download'] = True

    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        
        # Get the REAL highest-resolution original thumbnail from platform
        thumbnails = info.get('thumbnails') or []
        best_thumb = info.get('thumbnail')
        if thumbnails:
            sorted_thumbs = sorted(thumbnails, key=lambda x: (x.get('preference', 0) or 0, x.get('height', 0) or 0, x.get('width', 0) or 0), reverse=True)
            if sorted_thumbs and sorted_thumbs[0].get('url'):
                best_thumb = sorted_thumbs[0]['url']

        return {
            'video_id': info.get('id', 'current'),
            'title': info.get('title', 'Video Stream'),
            'author': info.get('uploader') or info.get('creator') or info.get('uploader_id') or 'Creator',
            'duration': format_sec(info.get('duration', 0)),
            'thumbnail': best_thumb or 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
            'platform': info.get('extractor_key', platform.capitalize())
        }

def download_yt_video(url, platform, preset, task_id='current'):
    if yt_dlp is None:
        raise RuntimeError("yt-dlp engine is not installed. Please run: pip install yt-dlp")
    timestamp = int(time.time() * 1000)
    out_file = os.path.join(DOWNLOADS_DIR, f"{platform}_{timestamp}.%(ext)s")
    opts = get_yt_opts(platform, out_file, task_id)

    if preset == 'mp3_audio':
        opts['format'] = 'bestaudio/best'

    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        
        if not os.path.exists(filename):
            base = os.path.splitext(filename)[0]
            if os.path.exists(base + '.mp4'):
                filename = base + '.mp4'
            elif os.path.exists(base + '.mkv'):
                filename = base + '.mkv'

        rel_path = os.path.relpath(filename, DIRECTORY).replace('\\', '/')
        return {
            'success': True,
            'filename': os.path.basename(filename),
            'download_url': f"http://localhost:{PORT}/{rel_path}"
        }

def run():
    os.chdir(DIRECTORY)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), AnyConvertHandler) as httpd:
        print("==================================================")
        print(f" AnyConvert yt-dlp Video Downloader Server running on http://localhost:{PORT}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            sys.exit(0)

if __name__ == "__main__":
    run()
