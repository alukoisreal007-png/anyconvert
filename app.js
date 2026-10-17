/* ==========================================================================
   AnyConvert Studio - Main JavaScript Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const SERVER_URL = 'http://localhost:8888';

  let currentProgressInterval = null;
  let currentAbortController = null;

  const state = {
    activeTab: 'tab-docx2pdf',
    selectedPlatform: 'tiktok',
    docxFile: null,
    img2PdfFiles: [],
    ppt2wordFile: null,
    ppt2pdfFile: null,
    imgFile: null,
    pdfMergeFiles: [],
    mediaFile: null,
    fetchedVidData: null,
    mediaRecorder: null,
    recordedChunks: [],
    recStartTime: null,
    recTimerInterval: null
  };

  const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    pageTitle: document.getElementById('page-title'),
    pageDesc: document.getElementById('page-desc'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),

    // Video Downloader
    platformBtns: document.querySelectorAll('.platform-btn'),
    inputVidUrl: document.getElementById('input-vid-url'),
    btnPasteUrl: document.getElementById('btn-paste-url'),
    btnFetchVid: document.getElementById('btn-fetch-vid'),
    vidErrorMsg: document.getElementById('vid-error-msg'),
    vidProgressContainer: document.getElementById('vid-progress-container'),
    vidProgressStatus: document.getElementById('vid-progress-status'),
    vidProgressPercent: document.getElementById('vid-progress-percent'),
    vidProgressFill: document.getElementById('vid-progress-fill'),
    vidProgressSpeed: document.getElementById('vid-progress-speed'),
    vidProgressEta: document.getElementById('vid-progress-eta'),
    btnCancelVidDl: document.getElementById('btn-cancel-vid-dl'),
    vidQualityPreset: document.getElementById('vid-quality-preset'),
    resultVidCard: document.getElementById('result-vid-card'),
    vidThumbImg: document.getElementById('vid-thumb-img'),
    vidDuration: document.getElementById('vid-duration'),
    vidPlatformTag: document.getElementById('vid-platform-tag'),
    vidTitleText: document.getElementById('vid-title-text'),
    vidAuthorText: document.getElementById('vid-author-text'),
    vidQualityInfo: document.getElementById('vid-quality-info'),
    vidFormatInfo: document.getElementById('vid-format-info'),
    btnDlVidDirect: document.getElementById('btn-dl-vid-direct'),
    btnDlVidAudio: document.getElementById('btn-dl-vid-audio'),
    btnDlVidThumb: document.getElementById('btn-dl-vid-thumb'),

    // DOCX 2 PDF
    inputDocx: document.getElementById('input-docx'),
    previewDocxList: document.getElementById('preview-docx-list'),
    btnConvertDocx2Pdf: document.getElementById('btn-convert-docx2pdf'),
    resultDocx2Pdf: document.getElementById('result-docx2pdf'),
    btnDlDocx2Pdf: document.getElementById('btn-dl-docx2pdf'),
    btnPrevDocx2Pdf: document.getElementById('btn-prev-docx2pdf'),
    docx2pdfFilename: document.getElementById('docx2pdf-filename'),

    // Images 2 PDF (Batch)
    inputImg2Pdf: document.getElementById('input-img2pdf'),
    previewImg2PdfGrid: document.getElementById('preview-img2pdf-grid'),
    btnConvertImg2Pdf: document.getElementById('btn-convert-img2pdf'),
    img2PdfCount: document.getElementById('img2pdf-count'),
    resultImg2Pdf: document.getElementById('result-img2pdf'),
    btnDlImg2Pdf: document.getElementById('btn-dl-img2pdf'),
    btnPrevImg2Pdf: document.getElementById('btn-prev-img2pdf'),
    img2pdfFilename: document.getElementById('img2pdf-filename'),

    // Screen Recorder & Editor Lab
    recVideoPreview: document.getElementById('rec-video-preview'),
    recOverlay: document.getElementById('rec-overlay'),
    recActiveDashboard: document.getElementById('rec-active-dashboard'),
    recTimer: document.getElementById('rec-timer'),
    btnStartRec: document.getElementById('btn-start-rec'),
    btnStopRec: document.getElementById('btn-stop-rec'),
    recDownloads: document.getElementById('rec-downloads'),
    recFps: document.getElementById('rec-fps'),
    recAudioSource: document.getElementById('rec-audio-source'),
    recFormat: document.getElementById('rec-format'),
    recAutoOpenEditor: document.getElementById('rec-auto-open-editor'),
    
    // Mode Switcher
    pillModeRecord: document.getElementById('pill-mode-record'),
    pillModeEditor: document.getElementById('pill-mode-editor'),
    editorClipBadge: document.getElementById('editor-clip-badge'),
    viewScreenRecorder: document.getElementById('view-screen-recorder'),
    viewEditorLab: document.getElementById('view-editor-lab'),
    inputEditorVideo: document.getElementById('input-editor-video'),
    inputEditorVideoBtn: document.getElementById('input-editor-video-btn'),

    // Editor Lab Core
    editorVideoFilename: document.getElementById('editor-video-filename'),
    editorVideoSpecs: document.getElementById('editor-video-specs'),
    btnEditorResetEdits: document.getElementById('btn-editor-reset-edits'),
    editorStageWrapper: document.getElementById('editor-stage-wrapper'),
    editorVideoSource: document.getElementById('editor-video-source'),
    editorCropCanvas: document.getElementById('editor-crop-canvas'),
    editorCropBox: document.getElementById('editor-crop-box'),
    cropAspectBadge: document.getElementById('crop-aspect-badge'),
    currentCropDisplay: document.getElementById('current-crop-display'),
    
    // Stage Toolbar (Screen Studio & CleanShot X)
    btnModeCropAdjust: document.getElementById('btn-mode-crop-adjust'),
    btnModeCropView: document.getElementById('btn-mode-crop-view'),
    btnCropResetTop: document.getElementById('btn-crop-reset-top'),
    stageAspectChips: document.querySelectorAll('.stage-aspect-chip'),

    // Transport & Playback
    btnEditorStepBack: document.getElementById('btn-editor-step-back'),
    btnEditorPlayPause: document.getElementById('btn-editor-play-pause'),
    editorPlayIcon: document.getElementById('editor-play-icon'),
    btnEditorStepFwd: document.getElementById('btn-editor-step-fwd'),
    btnEditorPreviewLoop: document.getElementById('btn-editor-preview-loop'),
    editorTimeCurrent: document.getElementById('editor-time-current'),
    editorTimeTotal: document.getElementById('editor-time-total'),
    btnEditorMute: document.getElementById('btn-editor-mute'),
    editorVolIcon: document.getElementById('editor-vol-icon'),

    // Direct Transport Trimming Actions
    btnTransportTrimIn: document.getElementById('btn-transport-trim-in'),
    btnTransportTrimOut: document.getElementById('btn-transport-trim-out'),
    btnTransportSplit: document.getElementById('btn-transport-split'),

    // Timeline & Trimming
    timelineTicks0: document.getElementById('timeline-tick-0'),
    timelineTicks50: document.getElementById('timeline-tick-50'),
    timelineTicks100: document.getElementById('timeline-tick-100'),
    timelineTrimBadge: document.getElementById('timeline-trim-badge'),
    timelineTrackWrapper: document.getElementById('timeline-track-wrapper'),
    timelineTrimHighlight: document.getElementById('timeline-trim-highlight'),
    timelineCutLeft: document.getElementById('timeline-cut-left'),
    timelineCutRight: document.getElementById('timeline-cut-right'),
    timelineSplitMarkers: document.getElementById('timeline-split-markers'),
    timelinePlayheadNeedle: document.getElementById('timeline-playhead-needle'),
    timelineHoverNeedle: document.getElementById('timeline-hover-needle'),
    timelineHoverTooltip: document.getElementById('timeline-hover-tooltip'),
    handleTrimIn: document.getElementById('handle-trim-in'),
    handleTrimOut: document.getElementById('handle-trim-out'),
    inputTrimStart: document.getElementById('input-trim-start'),
    inputTrimEnd: document.getElementById('input-trim-end'),
    btnSetInNow: document.getElementById('btn-set-in-now'),
    btnSetOutNow: document.getElementById('btn-set-out-now'),
    btnPreviewSelection: document.getElementById('btn-preview-selection'),
    btnResetTrim: document.getElementById('btn-reset-trim'),
    trimDurationDisplay: document.getElementById('trim-duration-display'),

    // Splitter & Segments
    btnSplitAtPlayhead: document.getElementById('btn-split-at-playhead'),
    editorSegmentsList: document.getElementById('editor-segments-list'),

    // Crop Presets
    cropPresetBtns: document.querySelectorAll('.crop-presets-grid .btn-preset'),

    // Export Deck
    exportResolution: document.getElementById('export-resolution'),
    exportFps: document.getElementById('export-fps'),
    exportFormat: document.getElementById('export-format'),
    exportBitrate: document.getElementById('export-bitrate'),
    btnExportVideo: document.getElementById('btn-export-video'),
    exportProgressPanel: document.getElementById('export-progress-panel'),
    exportProgressStatus: document.getElementById('export-progress-status'),
    exportProgressPercent: document.getElementById('export-progress-percent'),
    exportBarFill: document.getElementById('export-bar-fill'),
    exportFrameCount: document.getElementById('export-frame-count'),
    btnCancelExport: document.getElementById('btn-cancel-export'),
    exportResultBox: document.getElementById('export-result-box'),
    exportResultName: document.getElementById('export-result-name'),
    exportResultSize: document.getElementById('export-result-size'),
    exportResultDownloadLink: document.getElementById('export-result-download-link'),

    // PPT 2 Word
    inputPpt2Word: document.getElementById('input-ppt2word'),
    previewPpt2WordList: document.getElementById('preview-ppt2word-list'),
    btnConvertPpt2Word: document.getElementById('btn-convert-ppt2word'),
    resultPpt2Word: document.getElementById('result-ppt2word'),
    btnDlPpt2Word: document.getElementById('btn-dl-ppt2word'),
    ppt2wordFilename: document.getElementById('ppt2word-filename'),

    // PPT 2 PDF
    inputPpt2Pdf: document.getElementById('input-ppt2pdf'),
    previewPpt2PdfList: document.getElementById('preview-ppt2pdf-list'),
    btnConvertPpt2Pdf: document.getElementById('btn-convert-ppt2pdf'),
    resultPpt2Pdf: document.getElementById('result-ppt2pdf'),
    btnDlPpt2Pdf: document.getElementById('btn-dl-ppt2pdf'),
    btnPrevPpt2Pdf: document.getElementById('btn-prev-ppt2pdf'),
    ppt2pdfFilename: document.getElementById('ppt2pdf-filename'),

    // Image Compressor
    inputImgOpt: document.getElementById('input-imgopt'),
    imgOptEditor: document.getElementById('img-opt-editor'),
    imgOrigPreview: document.getElementById('img-orig-preview'),
    imgOptPreview: document.getElementById('img-opt-preview'),
    imgOrigSize: document.getElementById('img-orig-size'),
    imgOptSize: document.getElementById('img-opt-size'),
    imgSavingBadge: document.getElementById('img-saving-badge'),
    sliderImgQuality: document.getElementById('slider-img-quality'),
    sliderImgScale: document.getElementById('slider-img-scale'),
    valImgQuality: document.getElementById('val-img-quality'),
    valImgScale: document.getElementById('val-img-scale'),
    imgTargetFormat: document.getElementById('img-target-format'),
    btnSaveImg: document.getElementById('btn-save-img'),

    // PDF Merge
    inputPdfMerge: document.getElementById('input-pdfmerge'),
    pdfMergeList: document.getElementById('pdf-merge-list'),
    btnMergePdfs: document.getElementById('btn-merge-pdfs'),
    resultPdfMerge: document.getElementById('result-pdfmerge'),
    btnDlPdfMerge: document.getElementById('btn-dl-pdfmerge'),
    pdfmergeFilename: document.getElementById('pdfmerge-filename'),

    // Audio Extractor
    inputMediaExt: document.getElementById('input-mediaext'),
    mediaextPreviewList: document.getElementById('mediaext-preview-list'),
    btnProcessMedia: document.getElementById('btn-process-media'),
    resultMediaExt: document.getElementById('result-mediaext'),
    btnDlMediaExt: document.getElementById('btn-dl-mediaext'),
    mediaextFilename: document.getElementById('mediaext-filename')
  };

  const tabInfo = {
    'tab-docx2pdf': { title: 'DOCX to PDF Converter', desc: 'Convert Word documents (.docx) into vector PDF files.' },
    'tab-img2pdf': { title: 'Batch Images to PDF Converter', desc: 'Convert and combine image files (JPG, PNG, WEBP, BMP) into a single PDF.' },
    'tab-screenrec': { title: 'Screen Recorder (MP4)', desc: 'Record your full computer desktop screen (Win + G style) to MP4 video with audio.' },
    'tab-ppt2word': { title: 'PowerPoint to Word Converter', desc: 'Transform presentations (.pptx) into organized Word documents.' },
    'tab-ppt2pdf': { title: 'PowerPoint to PDF Converter', desc: 'Convert slide decks (.pptx) directly into presentation PDFs.' },
    'tab-imgopt': { title: 'Image Compressor', desc: 'Compress JPEG, PNG & WebP images up to 90% smaller.' },
    'tab-pdfmerge': { title: 'PDF Merger', desc: 'Combine multiple PDF files into one single document.' },
    'tab-mediaext': { title: 'Audio Extractor', desc: 'Extract background audio tracks from video files.' },
    'tab-viddownload': { title: 'Video Link Downloader', desc: 'Download HD videos & cover thumbnails directly from TikTok, Facebook, Pinterest, and YouTube.' },
    'tab-reddit-ideas': { title: 'Market Foundry', desc: 'Auto-discover validated digital product blueprints, tools, templates, and automations from Reddit, Hacker News, Dev.to, GitHub, and Stack Overflow.' }
  };

  // Tab Switcher
  elements.navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      elements.navItems.forEach(i => i.classList.remove('active'));
      elements.tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add('active');

      if (tabInfo[tabId]) {
        elements.pageTitle.textContent = tabInfo[tabId].title;
        elements.pageDesc.textContent = tabInfo[tabId].desc;
      }
      state.activeTab = tabId;
    });
  });

  elements.btnThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    elements.btnThemeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // ==========================================================================
  // Platform Selector Widgets & yt-dlp Engine API Integration
  // ==========================================================================
  elements.platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.platformBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedPlatform = btn.dataset.platform;
      
      elements.vidErrorMsg.classList.add('hidden');
      elements.vidErrorMsg.innerHTML = '';
      elements.vidProgressContainer.classList.add('hidden');
    });
  });

  // Red Cancel Process Button Event Handler
  if (elements.btnCancelVidDl) {
    elements.btnCancelVidDl.addEventListener('click', () => {
      if (currentProgressInterval) {
        clearInterval(currentProgressInterval);
        currentProgressInterval = null;
      }
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      elements.vidProgressContainer.classList.add('hidden');
      elements.btnDlVidDirect.disabled = false;
      elements.btnDlVidDirect.innerHTML = '<i class="fa-solid fa-download"></i> Download Video MP4';
      elements.btnDlVidAudio.disabled = false;
      elements.btnDlVidAudio.innerHTML = '<i class="fa-solid fa-music"></i> Save Audio (MP3)';
      elements.btnFetchVid.disabled = false;
      elements.btnFetchVid.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Fetch Video & Cover';
      showVidError('<i class="fa-solid fa-ban"></i> Process cancelled by user.');
    });
  }

  elements.btnPasteUrl.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        elements.inputVidUrl.value = text.trim();
        elements.vidErrorMsg.classList.add('hidden');
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  });

  elements.btnFetchVid.addEventListener('click', async () => {
    const rawUrl = elements.inputVidUrl.value.trim();
    const url = rawUrl.toLowerCase();
    elements.vidErrorMsg.classList.add('hidden');
    elements.vidErrorMsg.innerHTML = '';
    elements.vidProgressContainer.classList.add('hidden');

    if (!url) {
      showVidError(`Kindly paste a ${getPlatformName(state.selectedPlatform)} video link. Won't process.`);
      return;
    }

    const platform = state.selectedPlatform;
    let isValid = false;

    if (platform === 'tiktok' && url.includes('tiktok.com')) isValid = true;
    else if (platform === 'facebook' && (url.includes('facebook.com') || url.includes('fb.watch'))) isValid = true;
    else if (platform === 'pinterest' && (url.includes('pinterest.com') || url.includes('pin.it'))) isValid = true;
    else if (platform === 'youtube' && (url.includes('youtube.com') || url.includes('youtu.be'))) isValid = true;

    if (!isValid) {
      const platformTitle = getPlatformName(platform);
      showVidError(`<i class="fa-solid fa-triangle-exclamation"></i> Kindly paste a ${platformTitle} video link. Won't process.`);
      return;
    }

    elements.btnFetchVid.disabled = true;
    elements.btnFetchVid.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Extracting Video & Cover (yt-dlp)...';

    currentAbortController = new AbortController();

    try {
      const resp = await fetch(`${SERVER_URL}/api/extract_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawUrl, platform: platform }),
        signal: currentAbortController.signal
      });

      const info = await resp.json();
      if (!resp.ok || info.error) {
        throw new Error(info.error || 'Failed to extract video details.');
      }

      state.fetchedVidData = info;

      elements.vidThumbImg.src = info.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400';
      elements.vidTitleText.textContent = info.title;
      elements.vidAuthorText.textContent = `Creator: ${info.author}`;
      elements.vidDuration.textContent = info.duration;
      elements.vidPlatformTag.innerHTML = getPlatformIcon(platform) + ' ' + getPlatformName(platform);
      elements.vidQualityInfo.innerHTML = `<i class="fa-solid fa-film"></i> 1080p HD (yt-dlp)`;
      elements.vidFormatInfo.textContent = 'MP4 Video File';

      elements.resultVidCard.classList.remove('hidden');

      elements.btnDlVidDirect.onclick = async () => {
        elements.btnDlVidDirect.disabled = true;
        elements.btnDlVidDirect.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading MP4 File...';
        try {
          await executeYtDlpDownload(rawUrl, platform, 'mp4_hd', info.video_id);
        } catch (dErr) {
          if (dErr.name !== 'AbortError') showVidError('Download failed: ' + dErr.message);
        } finally {
          elements.btnDlVidDirect.disabled = false;
          elements.btnDlVidDirect.innerHTML = '<i class="fa-solid fa-download"></i> Download Video MP4';
        }
      };

      elements.btnDlVidAudio.onclick = async () => {
        elements.btnDlVidAudio.disabled = true;
        elements.btnDlVidAudio.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Extracting Audio MP3...';
        try {
          await executeYtDlpDownload(rawUrl, platform, 'mp3_audio', info.video_id);
        } catch (dErr) {
          if (dErr.name !== 'AbortError') showVidError('Audio extraction failed: ' + dErr.message);
        } finally {
          elements.btnDlVidAudio.disabled = false;
          elements.btnDlVidAudio.innerHTML = '<i class="fa-solid fa-music"></i> Save Audio (MP3)';
        }
      };

      elements.btnDlVidThumb.onclick = async () => {
        if (!state.fetchedVidData || !state.fetchedVidData.thumbnail) return;
        try {
          elements.btnDlVidThumb.disabled = true;
          elements.btnDlVidThumb.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading Cover Image...';
          
          const tResp = await fetch(state.fetchedVidData.thumbnail);
          const tBlob = await tResp.blob();
          const tUrl = URL.createObjectURL(tBlob);
          
          const a = document.createElement('a');
          a.href = tUrl;
          const cleanTitle = (state.fetchedVidData.title || 'video_cover').replace(/[^a-z0-9]/gi, '_').toLowerCase();
          a.download = `${cleanTitle}_cover.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (tErr) {
          const a = document.createElement('a');
          a.href = state.fetchedVidData.thumbnail;
          a.target = '_blank';
          a.download = 'video_cover.jpg';
          a.click();
        } finally {
          elements.btnDlVidThumb.disabled = false;
          elements.btnDlVidThumb.innerHTML = '<i class="fa-solid fa-image"></i> Save Cover / Thumbnail (HD)';
        }
      };

    } catch (err) {
      if (err.name !== 'AbortError') {
        showVidError('Could not fetch video: ' + err.message + '\nMake sure the local server is running.');
      }
    } finally {
      elements.btnFetchVid.disabled = false;
      elements.btnFetchVid.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Fetch Video & Cover';
    }
  });

  async function executeYtDlpDownload(url, platform, preset, taskId) {
    elements.vidProgressContainer.classList.remove('hidden');
    elements.vidProgressFill.style.width = '0%';
    elements.vidProgressPercent.textContent = '0%';
    elements.vidProgressStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing yt-dlp download stream...';
    elements.vidProgressSpeed.innerHTML = '<i class="fa-solid fa-bolt"></i> Speed: Calculating...';
    elements.vidProgressEta.innerHTML = '<i class="fa-regular fa-clock"></i> ETA: --:--';

    currentProgressInterval = setInterval(async () => {
      try {
        const pResp = await fetch(`${SERVER_URL}/api/progress?task_id=${encodeURIComponent(taskId || 'current')}`);
        if (pResp.ok) {
          const pData = await pResp.json();
          elements.vidProgressPercent.textContent = `${pData.percent}%`;
          elements.vidProgressFill.style.width = `${pData.percent}%`;
          elements.vidProgressSpeed.innerHTML = `<i class="fa-solid fa-bolt"></i> Speed: ${pData.speed || '1.5 MB/s'}`;
          elements.vidProgressEta.innerHTML = `<i class="fa-regular fa-clock"></i> ETA: ${pData.eta || '00:05'}`;
          
          if (pData.percent >= 100) {
            elements.vidProgressStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--accent-success);"></i> Download Complete!';
            clearInterval(currentProgressInterval);
            currentProgressInterval = null;
          }
        }
      } catch (e) { console.warn('Progress poll note:', e); }
    }, 300);

    currentAbortController = new AbortController();

    try {
      const resp = await fetch(`${SERVER_URL}/api/download_video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url, platform: platform, preset: preset, task_id: taskId }),
        signal: currentAbortController.signal
      });

      const resData = await resp.json();
      if (!resp.ok || !resData.success) {
        throw new Error(resData.error || 'Server could not download video.');
      }

      elements.vidProgressFill.style.width = '100%';
      elements.vidProgressPercent.textContent = '100%';
      elements.vidProgressStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--accent-success);"></i> Saved to Downloads Folder!';

      const a = document.createElement('a');
      a.href = resData.download_url;
      a.download = resData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } finally {
      if (currentProgressInterval) {
        clearInterval(currentProgressInterval);
        currentProgressInterval = null;
      }
    }
  }

  function showVidError(msg) {
    elements.vidErrorMsg.innerHTML = msg;
    elements.vidErrorMsg.classList.remove('hidden');
  }

  function getPlatformName(platformKey) {
    const names = { tiktok: 'TikTok', facebook: 'Facebook', pinterest: 'Pinterest', youtube: 'YouTube' };
    return names[platformKey] || 'valid';
  }

  function getPlatformIcon(platform) {
    const icons = {
      tiktok: '<i class="fa-brands fa-tiktok"></i>',
      facebook: '<i class="fa-brands fa-facebook" style="color:#1877f2;"></i>',
      pinterest: '<i class="fa-brands fa-pinterest" style="color:#e60023;"></i>',
      youtube: '<i class="fa-brands fa-youtube" style="color:#ff0000;"></i>'
    };
    return icons[platform] || '<i class="fa-solid fa-video"></i>';
  }

  // 1. DOCX to PDF Engine
  elements.inputDocx.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.docxFile = e.target.files[0];
      elements.previewDocxList.innerHTML = `
        <div class="file-item">
          <div class="file-info">
            <i class="fa-solid fa-file-word icon-word"></i>
            <div>
              <strong>${state.docxFile.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(state.docxFile.size)}</div>
            </div>
          </div>
          <i class="fa-solid fa-circle-check" style="color: var(--accent-success);"></i>
        </div>
      `;
      elements.btnConvertDocx2Pdf.disabled = false;
    }
  });

  elements.btnConvertDocx2Pdf.addEventListener('click', async () => {
    if (!state.docxFile) return;

    elements.btnConvertDocx2Pdf.disabled = true;
    elements.btnConvertDocx2Pdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Converting...';

    try {
      const arrayBuffer = await state.docxFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;

      const container = document.createElement('div');
      container.style.width = '794px';
      container.style.padding = '36px 44px';
      container.style.fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      container.style.lineHeight = '1.7';
      container.style.color = '#1e293b';
      container.style.background = '#ffffff';
      container.innerHTML = htmlContent;

      container.querySelectorAll('h1, h2, h3, tr, table, img').forEach(el => {
        el.style.pageBreakInside = 'avoid';
        el.style.breakInside = 'avoid';
      });

      document.body.appendChild(container);

      const orientation = document.getElementById('docx-orientation').value;
      const margin = parseInt(document.getElementById('docx-margin').value);

      const opt = {
        margin: margin,
        filename: state.docxFile.name.replace(/\.[^/.]+$/, '') + '_anyconvert.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: orientation },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
      container.remove();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      elements.resultDocx2Pdf.classList.remove('hidden');
      elements.docx2pdfFilename.textContent = opt.filename;

      elements.btnDlDocx2Pdf.onclick = () => {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = opt.filename;
        a.click();
      };

      elements.btnPrevDocx2Pdf.onclick = () => {
        window.open(pdfUrl, '_blank');
      };

    } catch (err) {
      alert('Conversion Error: ' + err.message);
    } finally {
      elements.btnConvertDocx2Pdf.disabled = false;
      elements.btnConvertDocx2Pdf.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Convert to PDF';
    }
  });

  // 2. Batch Images to PDF Converter Engine
  elements.inputImg2Pdf.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      state.img2PdfFiles.push(...newFiles);
      renderImg2PdfGrid();
    }
  });

  function renderImg2PdfGrid() {
    elements.previewImg2PdfGrid.innerHTML = '';
    elements.img2PdfCount.textContent = state.img2PdfFiles.length;
    elements.btnConvertImg2Pdf.disabled = state.img2PdfFiles.length === 0;

    state.img2PdfFiles.forEach((file, index) => {
      const card = document.createElement('div');
      card.className = 'img-grid-card';

      const img = document.createElement('img');
      img.alt = file.name;
      const reader = new FileReader();
      reader.onload = (ev) => { img.src = ev.target.result; };
      reader.readAsDataURL(file);

      const name = document.createElement('div');
      name.className = 'img-name';
      name.textContent = `${index + 1}. ${file.name}`;

      const btnRemove = document.createElement('button');
      btnRemove.className = 'btn-remove-img';
      btnRemove.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      btnRemove.title = 'Remove Image';
      btnRemove.onclick = (e) => {
        e.stopPropagation();
        state.img2PdfFiles.splice(index, 1);
        renderImg2PdfGrid();
      };

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(btnRemove);
      elements.previewImg2PdfGrid.appendChild(card);
    });
  }

  elements.btnConvertImg2Pdf.addEventListener('click', async () => {
    if (state.img2PdfFiles.length === 0) return;

    elements.btnConvertImg2Pdf.disabled = true;
    elements.btnConvertImg2Pdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Converting Images to PDF...';

    try {
      const pdfDoc = await PDFLib.PDFDocument.create();
      const orientationSetting = document.getElementById('img2pdf-orientation').value;
      const margin = parseInt(document.getElementById('img2pdf-margin').value);

      for (const file of state.img2PdfFiles) {
        const dataUrl = await readFileAsDataURL(file);
        const imageElement = await loadImageElement(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageElement, 0, 0);

        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const jpegBytes = dataURLToUint8Array(jpegDataUrl);

        const embeddedImg = await pdfDoc.embedJpg(jpegBytes);
        const imgWidth = embeddedImg.width;
        const imgHeight = embeddedImg.height;

        let pageWidth, pageHeight;

        if (orientationSetting === 'portrait') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (orientationSetting === 'landscape') {
          pageWidth = 841.89;
          pageHeight = 595.28;
        } else {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        const x = margin + (availWidth - drawWidth) / 2;
        const y = margin + (availHeight - drawHeight) / 2;

        page.drawImage(embeddedImg, {
          x: x,
          y: y,
          width: drawWidth,
          height: drawHeight
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      const outName = `AnyConvert_Images_${state.img2PdfFiles.length}_Pages.pdf`;

      elements.resultImg2Pdf.classList.remove('hidden');
      elements.img2pdfFilename.textContent = outName;

      elements.btnDlImg2Pdf.onclick = () => {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = outName;
        a.click();
      };

      elements.btnPrevImg2Pdf.onclick = () => {
        window.open(pdfUrl, '_blank');
      };

    } catch (err) {
      alert('Images to PDF Conversion Error: ' + err.message);
    } finally {
      elements.btnConvertImg2Pdf.disabled = false;
      elements.btnConvertImg2Pdf.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Convert Images to PDF (${state.img2PdfFiles.length})`;
    }
  });

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function dataURLToUint8Array(dataURL) {
    const base64 = dataURL.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // ==========================================================================
  // 3. SCREEN RECORDER & TINY WEIGHT VIDEO EDITOR LAB ENGINE
  // ==========================================================================

  const editorState = {
    blob: null,
    url: null,
    filename: 'recording.mp4',
    duration: 0,
    videoWidth: 0,
    videoHeight: 0,
    trimIn: 0,
    trimOut: 0,
    cropPreset: 'full', // 'full', '16:9', '9:16', '1:1', '4:3', 'custom'
    cropRect: { x: 0, y: 0, w: 1, h: 1 }, // normalized 0..1
    cropViewMode: 'adjust', // 'adjust' (framing with 8 handles) or 'removed' (cropped part removed)
    segments: [], // [{ id, start, end, enabled }]
    isPlaying: false,
    isLooping: false,
    isMuted: false,
    isExporting: false,
    exportCancelled: false
  };

  let recActiveStreams = {
    displayStream: null,
    micStream: null,
    audioContext: null
  };

  // --- Mode Switcher Tabs ---
  function switchRecorderMode(mode) {
    if (mode === 'editor') {
      state.activeTab = 'tab-screenrec';
      elements.pillModeEditor.classList.add('active');
      elements.pillModeRecord.classList.remove('active');
      elements.viewEditorLab.classList.remove('hidden');
      elements.viewScreenRecorder.classList.add('hidden');
      setTimeout(updateCropOverlayPosition, 50);
    } else {
      elements.pillModeRecord.classList.add('active');
      elements.pillModeEditor.classList.remove('active');
      elements.viewScreenRecorder.classList.remove('hidden');
      elements.viewEditorLab.classList.add('hidden');
      if (elements.editorVideoSource) {
        elements.editorVideoSource.pause();
      }
    }
  }

  if (elements.pillModeRecord && elements.pillModeEditor) {
    elements.pillModeRecord.addEventListener('click', () => switchRecorderMode('record'));
    elements.pillModeEditor.addEventListener('click', () => switchRecorderMode('editor'));
  }

  // --- Open Video File Handlers ---
  function handleVideoFileSelect(file) {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please select a valid video file (.mp4, .webm, .mov, etc.)');
      return;
    }
    loadVideoIntoEditor(file, file.name);
  }

  if (elements.inputEditorVideo) {
    elements.inputEditorVideo.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleVideoFileSelect(e.target.files[0]);
      }
    });
  }

  if (elements.inputEditorVideoBtn) {
    elements.inputEditorVideoBtn.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleVideoFileSelect(e.target.files[0]);
      }
    });
  }

  // --- Optimal Safe MIME Type Selector ---
  function getOptimalRecorderMimeType(preferredExt = 'mp4', hasAudio = true) {
    const mp4Audio = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=h264,aac',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm'
    ];
    const mp4VideoOnly = [
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4;codecs=avc1',
      'video/mp4;codecs=h264',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm;codecs=h264',
      'video/webm'
    ];
    const webmAudio = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4'
    ];
    const webmVideoOnly = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm;codecs=h264',
      'video/webm',
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4'
    ];

    const candidates = preferredExt === 'mp4' 
      ? (hasAudio ? mp4Audio : mp4VideoOnly)
      : (hasAudio ? webmAudio : webmVideoOnly);

    if (window.MediaRecorder && typeof MediaRecorder.isTypeSupported === 'function') {
      for (const mime of candidates) {
        if (MediaRecorder.isTypeSupported(mime)) {
          return mime;
        }
      }
    }
    return '';
  }

  // --- Screen Recorder Engine ---
  elements.btnStartRec.addEventListener('click', async () => {
    try {
      const audioPref = elements.recAudioSource ? elements.recAudioSource.value : 'none';
      const fps = parseInt(elements.recFps.value) || 30;

      // 1. Configure Display Constraints
      const displayConstraints = {
        video: { 
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always',
          frameRate: fps 
        },
        audio: (audioPref === 'system_mic' || audioPref === 'system_only'),
        systemAudio: (audioPref === 'system_mic' || audioPref === 'system_only') ? 'include' : 'exclude',
        selfBrowserSurface: 'exclude',
        surfaceSwitching: 'include',
        monitorTypeSurfaces: 'include'
      };

      let displayStream = null;
      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints);
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'AbortError') return; // User closed picker
        if (displayConstraints.audio) {
          console.warn('getDisplayMedia with audio failed, retrying video only:', err);
          try {
            displayStream = await navigator.mediaDevices.getDisplayMedia({
              video: displayConstraints.video,
              audio: false
            });
          } catch (retryErr) {
            if (retryErr.name === 'NotAllowedError' || retryErr.name === 'AbortError') return;
            throw retryErr;
          }
        } else {
          throw err;
        }
      }

      recActiveStreams.displayStream = displayStream;

      let audioTracks = [];
      let audioCtx = null;

      // 2. Microphone Capture & Safe Audio Mixing (Never blocks recording on failure)
      if (audioPref === 'system_mic' || audioPref === 'mic_only') {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ 
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
          });
          recActiveStreams.micStream = micStream;
          const micTracks = micStream.getAudioTracks();
          const sysTracks = displayStream.getAudioTracks();

          if (audioPref === 'system_mic' && sysTracks.length > 0 && micTracks.length > 0) {
            // Mix System Audio + Mic into a SINGLE track using AudioContext
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            recActiveStreams.audioContext = audioCtx;
            const dest = audioCtx.createMediaStreamDestination();
            const sysSource = audioCtx.createMediaStreamSource(new MediaStream(sysTracks));
            const micSource = audioCtx.createMediaStreamSource(new MediaStream(micTracks));
            sysSource.connect(dest);
            micSource.connect(dest);
            audioTracks = dest.stream.getAudioTracks();
          } else if (micTracks.length > 0) {
            audioTracks = micTracks;
          } else if (sysTracks.length > 0) {
            audioTracks = sysTracks;
          }
        } catch (mErr) {
          console.warn('Microphone permission denied or unavailable, continuing silently:', mErr);
          audioTracks = displayStream.getAudioTracks();
        }
      } else if (audioPref === 'system_only') {
        audioTracks = displayStream.getAudioTracks();
      } else {
        // audioPref === 'none' -> Zero audio tracks (Pure silent screen recording)
        audioTracks = [];
      }

      // 3. Assemble Combined MediaStream
      const videoTrack = displayStream.getVideoTracks()[0];
      const combinedTracks = [videoTrack];
      const hasAudio = audioTracks.length > 0;
      if (hasAudio) {
        combinedTracks.push(audioTracks[0]);
      }
      const combinedStream = new MediaStream(combinedTracks);

      elements.recOverlay.classList.add('hidden');
      elements.recVideoPreview.classList.add('hidden');
      elements.recVideoPreview.srcObject = null;
      elements.recActiveDashboard.classList.remove('hidden');

      // 4. Safe Multi-Tier MediaRecorder Initialization
      const formatPref = elements.recFormat ? elements.recFormat.value : 'video/mp4';
      const isMp4 = formatPref.includes('mp4');
      const optimalMime = getOptimalRecorderMimeType(isMp4 ? 'mp4' : 'webm', hasAudio);

      state.recordedChunks = [];
      let recorder = null;

      const candidates = [];
      if (optimalMime) candidates.push(optimalMime);
      if (isMp4) {
        if (!hasAudio) {
          candidates.push('video/mp4;codecs=avc1.42E01E');
          candidates.push('video/mp4');
        } else {
          candidates.push('video/mp4');
        }
      }
      if (!hasAudio) {
        candidates.push('video/webm;codecs=vp9');
        candidates.push('video/webm');
      } else {
        candidates.push('video/webm;codecs=vp9,opus');
        candidates.push('video/webm');
      }
      candidates.push(''); // fallback to browser default

      for (const mime of candidates) {
        try {
          const opts = (mime && MediaRecorder.isTypeSupported(mime)) ? { mimeType: mime, videoBitsPerSecond: 10000000 } : {};
          recorder = new MediaRecorder(combinedStream, opts);
          if (recorder) break;
        } catch (e1) {
          try {
            const opts = (mime && MediaRecorder.isTypeSupported(mime)) ? { mimeType: mime } : {};
            recorder = new MediaRecorder(combinedStream, opts);
            if (recorder) break;
          } catch (e2) {}
        }
      }

      if (!recorder) {
        recorder = new MediaRecorder(combinedStream);
      }

      state.mediaRecorder = recorder;

      state.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          state.recordedChunks.push(event.data);
        }
      };

      state.mediaRecorder.onstop = () => {
        cleanupRecordingStreams();

        const mime = (state.mediaRecorder && state.mediaRecorder.mimeType) || (isMp4 ? 'video/mp4' : 'video/webm');
        const blob = new Blob(state.recordedChunks, { type: mime });
        const videoUrl = URL.createObjectURL(blob);
        const ext = mime.includes('webm') ? 'webm' : 'mp4';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `AnyConvert_Recording_${timestamp}.${ext}`;
        const recordedDurSec = state.recStartTime ? Math.max(0.1, (Date.now() - state.recStartTime) / 1000) : 0;

        elements.recActiveDashboard.classList.add('hidden');
        elements.recVideoPreview.srcObject = null;
        elements.recVideoPreview.src = videoUrl;
        elements.recVideoPreview.classList.remove('hidden');

        // Recording History Card
        const card = document.createElement('div');
        card.className = 'file-item';
        card.style.marginTop = '12px';
        card.innerHTML = `
          <div class="file-info">
            <i class="fa-solid fa-file-video icon-rec"></i>
            <div>
              <strong>${fileName}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(blob.size)} • ${ext.toUpperCase()} • ${formatTime(recordedDurSec)}</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-secondary btn-sm btn-open-in-editor" style="text-decoration:none;">
              <i class="fa-solid fa-scissors"></i> Open in Editor Lab
            </button>
            <a href="${videoUrl}" download="${fileName}" class="btn-success btn-sm" style="text-decoration:none;">
              <i class="fa-solid fa-download"></i> Save ${ext.toUpperCase()}
            </a>
          </div>
        `;

        card.querySelector('.btn-open-in-editor').addEventListener('click', () => {
          loadVideoIntoEditor(blob, fileName, recordedDurSec);
        });

        elements.recDownloads.prepend(card);

        clearInterval(state.recTimerInterval);
        elements.recTimer.textContent = '00:00:00';

        elements.btnStartRec.classList.remove('hidden');
        elements.btnStopRec.classList.add('hidden');
        elements.btnStopRec.disabled = true;

        // Auto-open in Editor Lab if enabled
        const autoOpen = elements.recAutoOpenEditor ? elements.recAutoOpenEditor.checked : true;
        if (autoOpen) {
          loadVideoIntoEditor(blob, fileName, recordedDurSec);
        }
      };

      videoTrack.onended = () => {
        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
          state.mediaRecorder.stop();
        }
      };

      try {
        state.mediaRecorder.start(1000);
      } catch (startErr) {
        console.warn('Initial MediaRecorder start failed, retrying default:', startErr);
        state.mediaRecorder = new MediaRecorder(combinedStream);
        state.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) state.recordedChunks.push(event.data);
        };
        state.mediaRecorder.onstop = state.mediaRecorder.onstop;
        state.mediaRecorder.start(1000);
      }

      state.recStartTime = Date.now();
      state.recTimerInterval = setInterval(updateTimer, 1000);

      elements.btnStartRec.classList.add('hidden');
      elements.btnStopRec.classList.remove('hidden');
      elements.btnStopRec.disabled = false;

    } catch (err) {
      console.error('Screen recording error:', err);
      alert('Screen Recorder Error: ' + err.message);
      cleanupRecordingStreams();
    }
  });

  function cleanupRecordingStreams() {
    if (recActiveStreams.audioContext) {
      try { recActiveStreams.audioContext.close(); } catch (e) {}
      recActiveStreams.audioContext = null;
    }
    if (recActiveStreams.micStream) {
      try {
        const tracks = recActiveStreams.micStream.getTracks ? recActiveStreams.micStream.getTracks() : (recActiveStreams.micStream.getAudioTracks ? recActiveStreams.micStream.getAudioTracks() : []);
        tracks.forEach(t => { try { t.stop(); } catch (e) {} });
      } catch (e) {}
      recActiveStreams.micStream = null;
    }
    if (recActiveStreams.displayStream) {
      try {
        const tracks = recActiveStreams.displayStream.getTracks ? recActiveStreams.displayStream.getTracks() : (recActiveStreams.displayStream.getVideoTracks ? recActiveStreams.displayStream.getVideoTracks() : []);
        tracks.forEach(t => { try { t.stop(); } catch (e) {} });
      } catch (e) {}
      recActiveStreams.displayStream = null;
    }
  }

  elements.btnStopRec.addEventListener('click', () => {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
    }
  });

  function updateTimer() {
    const elapsedSec = Math.floor((Date.now() - state.recStartTime) / 1000);
    const hrs = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
    const secs = String(elapsedSec % 60).padStart(2, '0');
    elements.recTimer.textContent = `${hrs}:${mins}:${secs}`;
  }

  // ==========================================================================
  // TINY WEIGHT VIDEO EDITOR LAB (TRIM, CROP, SPLIT, HIGH-RES EXPORT)
  // ==========================================================================

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00.00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }

  function loadVideoIntoEditor(blobOrFile, filename, fallbackDurationSec = 0) {
    if (!blobOrFile) return;

    if (editorState.url) {
      try { URL.revokeObjectURL(editorState.url); } catch (e) {}
    }

    editorState.blob = blobOrFile;
    editorState.filename = filename || 'recording.mp4';
    editorState.url = URL.createObjectURL(blobOrFile);

    elements.editorVideoFilename.textContent = editorState.filename;
    if (elements.editorClipBadge) elements.editorClipBadge.style.display = 'inline-block';

    // Ensure the Screen Recorder / Editor tab pane is activated
    const screenRecNav = document.querySelector('.nav-item[data-tab="tab-screenrec"]');
    if (screenRecNav && !screenRecNav.classList.contains('active') && typeof screenRecNav.click === 'function') {
      screenRecNav.click();
    }

    // Switch view to Editor Lab immediately so the stage is visible
    switchRecorderMode('editor');

    const video = elements.editorVideoSource;
    video.pause();
    video.preload = 'auto';
    video.playsInline = true;

    let isInitialized = false;

    const setupEditorWithDuration = (dur) => {
      if (isInitialized) return;
      isInitialized = true;

      const safeDur = (dur && dur !== Infinity && !isNaN(dur) && dur > 0)
        ? dur
        : (fallbackDurationSec > 0 ? fallbackDurationSec : 1);

      editorState.duration = safeDur;
      editorState.videoWidth = video.videoWidth || 1920;
      editorState.videoHeight = video.videoHeight || 1080;
      editorState.trimIn = 0;
      editorState.trimOut = safeDur;
      editorState.cropPreset = 'full';
      editorState.cropRect = { x: 0, y: 0, w: 1, h: 1 };
      editorState.cropViewMode = 'adjust';
      editorState.segments = [{ id: 1, start: 0, end: safeDur, enabled: true }];

      // Update Specs Readout
      elements.editorVideoSpecs.textContent = `${editorState.videoWidth}x${editorState.videoHeight} • ${formatTime(safeDur)}`;
      elements.editorTimeTotal.textContent = formatTime(safeDur);
      elements.editorTimeCurrent.textContent = '00:00.00';

      // Update Timeline Ticks
      elements.timelineTicks0.textContent = '00:00.00';
      if (elements.timelineTicks50) elements.timelineTicks50.textContent = formatTime(safeDur / 2);
      elements.timelineTicks100.textContent = formatTime(safeDur);

      // Update Trim Inputs
      elements.inputTrimStart.value = '0.0';
      elements.inputTrimStart.max = String(safeDur);
      elements.inputTrimEnd.value = safeDur.toFixed(1);
      elements.inputTrimEnd.max = String(safeDur);
      elements.trimDurationDisplay.textContent = `Duration: ${formatTime(safeDur)}`;

      // Reset Crop Presets UI
      syncAspectPresetsUI('full');
      elements.currentCropDisplay.textContent = 'Full (No Crop)';
      elements.editorCropBox.classList.add('hidden');
      elements.editorCropCanvas.classList.add('hidden');
      video.style.opacity = '1';
      video.style.display = 'block';

      switchCropViewMode('adjust');
      renderSegmentsList();
      updateTimelineUI();
      updateCropOverlayPosition();

      // Nudge currentTime to 0.001 to force Chromium to decode and paint the first frame on screen
      try {
        video.currentTime = 0.001;
      } catch (e) {}
    };

    video.onloadedmetadata = () => {
      let dur = video.duration;
      if (!dur || dur === Infinity || isNaN(dur) || dur <= 0) {
        if (fallbackDurationSec > 0) {
          setupEditorWithDuration(fallbackDurationSec);
        } else {
          // Probe Chromium duration via end seek
          const probeHandler = () => {
            video.removeEventListener('timeupdate', probeHandler);
            video.removeEventListener('seeked', probeHandler);
            const discovered = video.duration;
            const validDur = (discovered && discovered !== Infinity && !isNaN(discovered) && discovered > 0)
              ? discovered
              : (video.currentTime > 0 ? video.currentTime : 1);
            setupEditorWithDuration(validDur);
            try { video.currentTime = 0.001; } catch (e) {}
          };
          video.addEventListener('timeupdate', probeHandler, { once: true });
          video.addEventListener('seeked', probeHandler, { once: true });
          try {
            video.currentTime = 1e10;
          } catch (e) {
            setupEditorWithDuration(fallbackDurationSec || 1);
          }
        }
      } else {
        setupEditorWithDuration(dur);
      }
    };

    video.onerror = (e) => {
      console.warn('Editor video decoding note:', video.error, e);
      if (!isInitialized && fallbackDurationSec > 0) {
        setupEditorWithDuration(fallbackDurationSec);
      }
    };

    // Safety timeout: if metadata event is delayed, initialize with fallbackDurationSec
    setTimeout(() => {
      if (!isInitialized && fallbackDurationSec > 0) {
        setupEditorWithDuration(fallbackDurationSec);
      }
    }, 400);

    video.src = editorState.url;
    video.load();
  }

  // --- Transport & Playback Controls ---
  elements.btnEditorPlayPause.addEventListener('click', toggleEditorPlay);
  elements.editorVideoSource.addEventListener('click', toggleEditorPlay);

  function toggleEditorPlay() {
    if (elements.editorVideoSource.paused) {
      if (elements.editorVideoSource.currentTime >= editorState.trimOut || elements.editorVideoSource.currentTime < editorState.trimIn) {
        elements.editorVideoSource.currentTime = editorState.trimIn;
      }
      elements.editorVideoSource.play();
      editorState.isPlaying = true;
      elements.editorPlayIcon.className = 'fa-solid fa-pause';
      if (editorState.cropViewMode === 'removed') {
        startCropViewRenderLoop();
      }
    } else {
      elements.editorVideoSource.pause();
      editorState.isPlaying = false;
      elements.editorPlayIcon.className = 'fa-solid fa-play';
    }
  }

  elements.editorVideoSource.addEventListener('timeupdate', () => {
    const cur = elements.editorVideoSource.currentTime;
    elements.editorTimeCurrent.textContent = formatTime(cur);

    // Boundary check for trimmed range
    if (cur >= editorState.trimOut) {
      if (editorState.isLooping) {
        elements.editorVideoSource.currentTime = editorState.trimIn;
      } else {
        elements.editorVideoSource.pause();
        elements.editorVideoSource.currentTime = editorState.trimOut;
        editorState.isPlaying = false;
        elements.editorPlayIcon.className = 'fa-solid fa-play';
      }
    }

    updatePlayheadNeedle(cur);
    if (editorState.cropViewMode === 'removed') {
      renderCroppedViewFrame();
    }
  });

  elements.editorVideoSource.addEventListener('seeked', () => {
    if (editorState.cropViewMode === 'removed') {
      renderCroppedViewFrame();
    }
  });

  elements.editorVideoSource.addEventListener('ended', () => {
    editorState.isPlaying = false;
    elements.editorPlayIcon.className = 'fa-solid fa-play';
  });

  elements.btnEditorStepBack.addEventListener('click', () => {
    elements.editorVideoSource.currentTime = Math.max(0, elements.editorVideoSource.currentTime - 1);
  });

  elements.btnEditorStepFwd.addEventListener('click', () => {
    elements.editorVideoSource.currentTime = Math.min(editorState.duration, elements.editorVideoSource.currentTime + 1);
  });

  elements.btnEditorPreviewLoop.addEventListener('click', () => {
    editorState.isLooping = !editorState.isLooping;
    elements.btnEditorPreviewLoop.classList.toggle('active', editorState.isLooping);
    if (editorState.isLooping) {
      elements.editorVideoSource.currentTime = editorState.trimIn;
      elements.editorVideoSource.play();
    }
  });

  elements.btnEditorMute.addEventListener('click', () => {
    editorState.isMuted = !editorState.isMuted;
    elements.editorVideoSource.muted = editorState.isMuted;
    elements.editorVolIcon.className = editorState.isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
  });

  // --- Direct Scrubber & Trimming on Playback Track ---
  elements.timelineTrackWrapper.addEventListener('click', (e) => {
    if (!editorState.duration) return;
    const rect = elements.timelineTrackWrapper.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * editorState.duration;
    elements.editorVideoSource.currentTime = targetTime;
  });

  // Live Hover Needle & Time Tooltip
  if (elements.timelineHoverNeedle && elements.timelineHoverTooltip) {
    elements.timelineTrackWrapper.addEventListener('mousemove', (e) => {
      if (!editorState.duration) return;
      const rect = elements.timelineTrackWrapper.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const hoverTime = ratio * editorState.duration;

      elements.timelineHoverNeedle.classList.remove('hidden');
      elements.timelineHoverTooltip.classList.remove('hidden');

      const pct = ratio * 100;
      elements.timelineHoverNeedle.style.left = `${pct}%`;
      elements.timelineHoverTooltip.style.left = `${pct}%`;
      elements.timelineHoverTooltip.textContent = formatTime(hoverTime);
    });

    elements.timelineTrackWrapper.addEventListener('mouseleave', () => {
      elements.timelineHoverNeedle.classList.add('hidden');
      elements.timelineHoverTooltip.classList.add('hidden');
    });
  }

  function updatePlayheadNeedle(curTime) {
    if (!editorState.duration) return;
    const pct = (curTime / editorState.duration) * 100;
    elements.timelinePlayheadNeedle.style.left = `${pct}%`;
  }

  function updateTimelineUI() {
    if (!editorState.duration) return;
    const inPct = (editorState.trimIn / editorState.duration) * 100;
    const outPct = (editorState.trimOut / editorState.duration) * 100;

    // Position Draggable Trim Handles
    elements.handleTrimIn.style.left = `${inPct}%`;
    elements.handleTrimOut.style.left = `${outPct}%`;

    // Highlight Active Kept Range
    elements.timelineTrimHighlight.style.left = `${inPct}%`;
    elements.timelineTrimHighlight.style.width = `${Math.max(0, outPct - inPct)}%`;

    // Dim Trimmed-Out Portions with Cut Stripes
    if (elements.timelineCutLeft) {
      elements.timelineCutLeft.style.width = `${inPct}%`;
    }
    if (elements.timelineCutRight) {
      elements.timelineCutRight.style.width = `${Math.max(0, 100 - outPct)}%`;
    }

    // Active Kept Duration Readouts
    const dur = Math.max(0, editorState.trimOut - editorState.trimIn);
    if (elements.timelineTrimBadge) {
      elements.timelineTrimBadge.innerHTML = `<i class="fa-solid fa-scissors"></i> Trimmed: ${formatTime(dur)}`;
    }
    elements.trimDurationDisplay.textContent = `Duration: ${formatTime(dur)}`;
  }

  // --- Draggable Trim Handles (In and Out) ---
  let activeDraggingTrimHandle = null;

  function onTrimHandleMouseDown(handleType, e) {
    e.preventDefault();
    e.stopPropagation();
    activeDraggingTrimHandle = handleType;
    window.addEventListener('mousemove', onTrimHandleMouseMove);
    window.addEventListener('mouseup', onTrimHandleMouseUp);
  }

  function onTrimHandleMouseMove(e) {
    if (!activeDraggingTrimHandle || !editorState.duration) return;
    const rect = elements.timelineTrackWrapper.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = ratio * editorState.duration;

    if (activeDraggingTrimHandle === 'in') {
      editorState.trimIn = Math.min(time, editorState.trimOut - 0.2);
      elements.inputTrimStart.value = editorState.trimIn.toFixed(1);
      elements.editorVideoSource.currentTime = editorState.trimIn;
    } else if (activeDraggingTrimHandle === 'out') {
      editorState.trimOut = Math.max(time, editorState.trimIn + 0.2);
      elements.inputTrimEnd.value = editorState.trimOut.toFixed(1);
      elements.editorVideoSource.currentTime = editorState.trimOut;
    }
    updateTimelineUI();
  }

  function onTrimHandleMouseUp() {
    activeDraggingTrimHandle = null;
    window.removeEventListener('mousemove', onTrimHandleMouseMove);
    window.removeEventListener('mouseup', onTrimHandleMouseUp);
  }

  elements.handleTrimIn.addEventListener('mousedown', (e) => onTrimHandleMouseDown('in', e));
  elements.handleTrimOut.addEventListener('mousedown', (e) => onTrimHandleMouseDown('out', e));

  // --- Direct One-Click Playback Menu Trimming Handlers ---
  function setTrimInAtCurrentPlayhead() {
    if (!editorState.duration) return;
    const cur = elements.editorVideoSource.currentTime;
    editorState.trimIn = Math.min(cur, editorState.trimOut - 0.2);
    elements.inputTrimStart.value = editorState.trimIn.toFixed(1);
    updateTimelineUI();
  }

  function setTrimOutAtCurrentPlayhead() {
    if (!editorState.duration) return;
    const cur = elements.editorVideoSource.currentTime;
    editorState.trimOut = Math.max(cur, editorState.trimIn + 0.2);
    elements.inputTrimEnd.value = editorState.trimOut.toFixed(1);
    updateTimelineUI();
  }

  if (elements.btnTransportTrimIn) {
    elements.btnTransportTrimIn.addEventListener('click', setTrimInAtCurrentPlayhead);
  }
  if (elements.btnTransportTrimOut) {
    elements.btnTransportTrimOut.addEventListener('click', setTrimOutAtCurrentPlayhead);
  }
  if (elements.btnTransportSplit) {
    elements.btnTransportSplit.addEventListener('click', () => splitClipAtPlayhead());
  }

  // Numeric Inputs & Extra Trim Actions
  elements.inputTrimStart.addEventListener('input', () => {
    const val = parseFloat(elements.inputTrimStart.value) || 0;
    editorState.trimIn = Math.max(0, Math.min(val, editorState.trimOut - 0.2));
    updateTimelineUI();
  });

  elements.inputTrimEnd.addEventListener('input', () => {
    const val = parseFloat(elements.inputTrimEnd.value) || editorState.duration;
    editorState.trimOut = Math.min(editorState.duration, Math.max(val, editorState.trimIn + 0.2));
    updateTimelineUI();
  });

  elements.btnSetInNow.addEventListener('click', setTrimInAtCurrentPlayhead);
  elements.btnSetOutNow.addEventListener('click', setTrimOutAtCurrentPlayhead);

  elements.btnPreviewSelection.addEventListener('click', () => {
    elements.editorVideoSource.currentTime = editorState.trimIn;
    elements.editorVideoSource.play();
  });

  elements.btnResetTrim.addEventListener('click', () => {
    editorState.trimIn = 0;
    editorState.trimOut = editorState.duration;
    elements.inputTrimStart.value = '0.0';
    elements.inputTrimEnd.value = editorState.duration.toFixed(1);
    updateTimelineUI();
  });

  // --- Multi-Aspect Cropping & Presets ---
  function syncAspectPresetsUI(preset) {
    elements.cropPresetBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.crop === preset);
    });
    if (elements.stageAspectChips) {
      elements.stageAspectChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.crop === preset);
      });
    }
  }

  elements.cropPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => setCropPreset(btn.dataset.crop));
  });

  if (elements.stageAspectChips) {
    elements.stageAspectChips.forEach(chip => {
      chip.addEventListener('click', () => setCropPreset(chip.dataset.crop));
    });
  }

  if (elements.btnCropResetTop) {
    elements.btnCropResetTop.addEventListener('click', () => setCropPreset('full'));
  }

  function setCropPreset(preset) {
    editorState.cropPreset = preset;
    syncAspectPresetsUI(preset);

    const vw = editorState.videoWidth || 1920;
    const vh = editorState.videoHeight || 1080;
    const videoAspect = vw / vh;

    let targetAspect = videoAspect;
    if (preset === '16:9') targetAspect = 16 / 9;
    else if (preset === '9:16') targetAspect = 9 / 16;
    else if (preset === '1:1') targetAspect = 1;
    else if (preset === '4:3') targetAspect = 4 / 3;

    if (preset === 'full') {
      editorState.cropRect = { x: 0, y: 0, w: 1, h: 1 };
      elements.currentCropDisplay.textContent = 'Full (No Crop)';
      elements.editorCropBox.classList.add('hidden');
    } else {
      let w = 1;
      let h = 1;
      if (targetAspect > videoAspect) {
        w = 1;
        h = videoAspect / targetAspect;
      } else {
        h = 1;
        w = targetAspect / videoAspect;
      }
      editorState.cropRect = {
        x: (1 - w) / 2,
        y: (1 - h) / 2,
        w: w,
        h: h
      };
      const pxW = Math.round(w * vw);
      const pxH = Math.round(h * vh);
      elements.currentCropDisplay.textContent = `${preset.toUpperCase()} (${pxW}x${pxH})`;
      elements.cropAspectBadge.textContent = preset.toUpperCase();
      if (editorState.cropViewMode === 'adjust') {
        elements.editorCropBox.classList.remove('hidden');
      }
    }

    updateCropOverlayPosition();
    if (editorState.cropViewMode === 'removed') {
      renderCroppedViewFrame();
    }
  }

  // --- Interactive Crop Frame (8 Handles + Move Box) ---
  function getRenderedVideoRect() {
    const stage = elements.editorStageWrapper;
    const video = elements.editorVideoSource;
    if (!stage || !video || !video.videoWidth) return { left: 0, top: 0, width: 360, height: 360 };

    const stageRect = stage.getBoundingClientRect();
    const stageW = stageRect.width;
    const stageH = stageRect.height;
    const vidAspect = video.videoWidth / video.videoHeight;
    const stageAspect = stageW / stageH;

    let renderW, renderH, renderX, renderY;
    if (vidAspect > stageAspect) {
      renderW = stageW;
      renderH = stageW / vidAspect;
      renderX = 0;
      renderY = (stageH - renderH) / 2;
    } else {
      renderH = stageH;
      renderW = stageH * vidAspect;
      renderX = (stageW - renderW) / 2;
      renderY = 0;
    }

    return { left: renderX, top: renderY, width: renderW, height: renderH };
  }

  function updateCropOverlayPosition() {
    if (editorState.cropPreset === 'full' || editorState.cropViewMode === 'removed') {
      elements.editorCropBox.classList.add('hidden');
      return;
    }

    const vRect = getRenderedVideoRect();
    const crop = editorState.cropRect;

    const boxX = vRect.left + (crop.x * vRect.width);
    const boxY = vRect.top + (crop.y * vRect.height);
    const boxW = Math.max(20, crop.w * vRect.width);
    const boxH = Math.max(20, crop.h * vRect.height);

    elements.editorCropBox.style.left = `${boxX}px`;
    elements.editorCropBox.style.top = `${boxY}px`;
    elements.editorCropBox.style.width = `${boxW}px`;
    elements.editorCropBox.style.height = `${boxH}px`;
    elements.editorCropBox.classList.remove('hidden');

    const vw = editorState.videoWidth || 1920;
    const vh = editorState.videoHeight || 1080;
    const pxW = Math.round(crop.w * vw);
    const pxH = Math.round(crop.h * vh);
    elements.cropAspectBadge.textContent = `${pxW}×${pxH}`;
  }

  window.addEventListener('resize', () => {
    updateCropOverlayPosition();
    if (editorState.cropViewMode === 'removed') {
      renderCroppedViewFrame();
    }
  });

  // Direct 8-Handle Resizing and Box Dragging
  let isDraggingCrop = false;
  let dragHandleType = null; // 'nw', 'ne', 'se', 'sw', 'n', 's', 'w', 'e', or 'box'
  let cropDragStartPos = { x: 0, y: 0 };
  let cropDragStartRect = { x: 0, y: 0, w: 1, h: 1 };

  elements.editorCropBox.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const handleEl = e.target.closest('.crop-handle');
    dragHandleType = handleEl ? handleEl.dataset.handle : 'box';
    isDraggingCrop = true;
    cropDragStartPos = { x: e.clientX, y: e.clientY };
    cropDragStartRect = { ...editorState.cropRect };

    window.addEventListener('mousemove', onCropBoxMouseMove);
    window.addEventListener('mouseup', onCropBoxMouseUp);
  });

  function onCropBoxMouseMove(e) {
    if (!isDraggingCrop) return;
    const vRect = getRenderedVideoRect();
    if (vRect.width <= 0 || vRect.height <= 0) return;

    const dx = (e.clientX - cropDragStartPos.x) / vRect.width;
    const dy = (e.clientY - cropDragStartPos.y) / vRect.height;
    const minW = 0.05;
    const minH = 0.05;

    let { x, y, w, h } = cropDragStartRect;

    if (dragHandleType === 'box') {
      // Pan / Reposition box
      x = Math.max(0, Math.min(1 - w, x + dx));
      y = Math.max(0, Math.min(1 - h, y + dy));
    } else {
      // 8-Direction Handle Resizing: Enlarge, Tighten, Widen
      if (dragHandleType.includes('e')) {
        // East: widen / tighten right edge
        w = Math.max(minW, Math.min(1 - x, w + dx));
      }
      if (dragHandleType.includes('w')) {
        // West: widen / tighten left edge
        const maxDx = w - minW;
        const clampedDx = Math.max(-x, Math.min(maxDx, dx));
        x += clampedDx;
        w -= clampedDx;
      }
      if (dragHandleType.includes('s')) {
        // South: enlarge / tighten bottom edge
        h = Math.max(minH, Math.min(1 - y, h + dy));
      }
      if (dragHandleType.includes('n')) {
        // North: enlarge / tighten top edge
        const maxDy = h - minH;
        const clampedDy = Math.max(-y, Math.min(maxDy, dy));
        y += clampedDy;
        h -= clampedDy;
      }

      // If user resizes with cursor, set to custom box
      editorState.cropPreset = 'custom';
      syncAspectPresetsUI('custom');
      elements.currentCropDisplay.textContent = `Custom (${Math.round(w * editorState.videoWidth)}x${Math.round(h * editorState.videoHeight)})`;
    }

    editorState.cropRect = {
      x: Math.max(0, Math.min(1 - minW, x)),
      y: Math.max(0, Math.min(1 - minH, y)),
      w: Math.max(minW, Math.min(1 - x, w)),
      h: Math.max(minH, Math.min(1 - y, h))
    };

    updateCropOverlayPosition();
  }

  function onCropBoxMouseUp() {
    isDraggingCrop = false;
    dragHandleType = null;
    window.removeEventListener('mousemove', onCropBoxMouseMove);
    window.removeEventListener('mouseup', onCropBoxMouseUp);
  }

  // --- "Crop View (Removed)" & "Crop Frame Adjust" Mode Switcher ---
  function switchCropViewMode(mode) {
    editorState.cropViewMode = mode;
    if (elements.btnModeCropAdjust && elements.btnModeCropView) {
      elements.btnModeCropAdjust.classList.toggle('active', mode === 'adjust');
      elements.btnModeCropView.classList.toggle('active', mode === 'removed');
    }

    if (mode === 'removed') {
      // Cropped-out part is removed from the view!
      elements.editorCropBox.classList.add('hidden');
      elements.editorCropCanvas.classList.remove('hidden');
      elements.editorVideoSource.style.opacity = '0'; // Keep playing in background
      renderCroppedViewFrame();
      if (!elements.editorVideoSource.paused) {
        startCropViewRenderLoop();
      }
    } else {
      // Frame adjust mode: Full video with 8-handle crop frame and dimmed mask
      elements.editorCropCanvas.classList.add('hidden');
      elements.editorVideoSource.style.opacity = '1';
      if (editorState.cropPreset !== 'full') {
        elements.editorCropBox.classList.remove('hidden');
      }
      updateCropOverlayPosition();
    }
  }

  if (elements.btnModeCropAdjust) {
    elements.btnModeCropAdjust.addEventListener('click', () => switchCropViewMode('adjust'));
  }
  if (elements.btnModeCropView) {
    elements.btnModeCropView.addEventListener('click', () => switchCropViewMode('removed'));
  }

  // Render Cropped-Out View Frame (Canvas displays only the cropped portion)
  function renderCroppedViewFrame() {
    if (!elements.editorCropCanvas || !elements.editorVideoSource) return;
    const canvas = elements.editorCropCanvas;
    const ctx = canvas.getContext('2d');
    const vw = elements.editorVideoSource.videoWidth || 1920;
    const vh = elements.editorVideoSource.videoHeight || 1080;
    const crop = editorState.cropRect;

    const sx = Math.max(0, crop.x * vw);
    const sy = Math.max(0, crop.y * vh);
    const sw = Math.max(1, crop.w * vw);
    const sh = Math.max(1, crop.h * vh);

    const stageRect = elements.editorStageWrapper.getBoundingClientRect();
    const stageAspect = stageRect.width / stageRect.height;
    const cropAspect = sw / sh;

    let cw, ch;
    if (cropAspect > stageAspect) {
      cw = stageRect.width;
      ch = stageRect.width / cropAspect;
    } else {
      ch = stageRect.height;
      cw = stageRect.height * cropAspect;
    }

    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas.style.width = `${Math.round(cw)}px`;
    canvas.style.height = `${Math.round(ch)}px`;
    canvas.style.position = 'absolute';
    canvas.style.left = `${Math.round((stageRect.width - cw) / 2)}px`;
    canvas.style.top = `${Math.round((stageRect.height - ch) / 2)}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(elements.editorVideoSource, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }

  let cropViewAnimationId = null;
  function startCropViewRenderLoop() {
    if (cropViewAnimationId) cancelAnimationFrame(cropViewAnimationId);
    function loop() {
      if (editorState.cropViewMode === 'removed' && !elements.editorVideoSource.paused) {
        renderCroppedViewFrame();
        cropViewAnimationId = requestAnimationFrame(loop);
      }
    }
    cropViewAnimationId = requestAnimationFrame(loop);
  }

  // --- Splitting & Multi-Segment Splicer ---
  function splitClipAtPlayhead() {
    if (!editorState.duration) return;
    const cur = elements.editorVideoSource.currentTime;
    if (cur <= 0.1 || cur >= editorState.duration - 0.1) return;

    const segIdx = editorState.segments.findIndex(s => s.enabled && cur > s.start + 0.1 && cur < s.end - 0.1);
    if (segIdx === -1) {
      alert('Cannot split outside of an active clip segment or too close to existing boundaries.');
      return;
    }

    const origSeg = editorState.segments[segIdx];
    const newSeg1 = { id: Date.now(), start: origSeg.start, end: cur, enabled: true };
    const newSeg2 = { id: Date.now() + 1, start: cur, end: origSeg.end, enabled: true };

    editorState.segments.splice(segIdx, 1, newSeg1, newSeg2);
    renderSegmentsList();
    renderSplitMarkers();
  }

  elements.btnSplitAtPlayhead.addEventListener('click', splitClipAtPlayhead);

  function renderSplitMarkers() {
    elements.timelineSplitMarkers.innerHTML = '';
    if (!editorState.duration || editorState.segments.length <= 1) return;

    for (let i = 0; i < editorState.segments.length - 1; i++) {
      const seg = editorState.segments[i];
      const tick = document.createElement('div');
      tick.className = 'split-marker-tick';
      tick.style.left = `${(seg.end / editorState.duration) * 100}%`;
      elements.timelineSplitMarkers.appendChild(tick);
    }
  }

  function renderSegmentsList() {
    elements.editorSegmentsList.innerHTML = '';
    const activeSegs = editorState.segments.filter(s => s.enabled);

    if (activeSegs.length === 0) {
      elements.editorSegmentsList.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:6px;">No active clips remaining. Reset edits to restore.</div>';
      return;
    }

    activeSegs.forEach((seg, index) => {
      const card = document.createElement('div');
      card.className = 'segment-card';
      card.dataset.segId = String(seg.id);
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="seg-badge">Clip ${index + 1}</span>
          <span class="seg-time">${formatTime(seg.start)} → ${formatTime(seg.end)}</span>
        </div>
        <div class="seg-actions">
          <button type="button" class="btn-icon btn-icon-xs btn-preview-seg" title="Preview Clip">
            <i class="fa-solid fa-play"></i>
          </button>
          ${activeSegs.length > 1 ? `
            <button type="button" class="btn-icon btn-icon-xs btn-delete-seg" style="color:var(--accent-danger);" title="Cut/Delete Clip">
              <i class="fa-solid fa-trash"></i>
            </button>
          ` : ''}
        </div>
      `;

      card.querySelector('.btn-preview-seg').addEventListener('click', () => {
        elements.editorVideoSource.currentTime = seg.start;
        elements.editorVideoSource.play();
      });

      const delBtn = card.querySelector('.btn-delete-seg');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          seg.enabled = false;
          renderSegmentsList();
          renderSplitMarkers();
        });
      }

      elements.editorSegmentsList.appendChild(card);
    });
  }

  // --- Reset All Edits ---
  elements.btnEditorResetEdits.addEventListener('click', () => {
    if (!editorState.duration) return;
    editorState.trimIn = 0;
    editorState.trimOut = editorState.duration;
    editorState.cropPreset = 'full';
    editorState.cropRect = { x: 0, y: 0, w: 1, h: 1 };
    editorState.cropViewMode = 'adjust';
    editorState.segments = [{ id: 1, start: 0, end: editorState.duration, enabled: true }];

    elements.inputTrimStart.value = '0.0';
    elements.inputTrimEnd.value = editorState.duration.toFixed(1);
    syncAspectPresetsUI('full');
    elements.currentCropDisplay.textContent = 'Full (No Crop)';
    elements.editorCropBox.classList.add('hidden');
    elements.editorCropCanvas.classList.add('hidden');
    elements.editorVideoSource.style.opacity = '1';

    switchCropViewMode('adjust');
    renderSegmentsList();
    renderSplitMarkers();
    updateTimelineUI();
    updateCropOverlayPosition();
  });

  // --- Screen Studio Keyboard Shortcuts Engine ---
  window.addEventListener('keydown', (e) => {
    // Ignore when typing inside input fields
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    // Only active when on Screen Recorder & Editor tab
    if (state.activeTab !== 'tab-screenrec') return;
    if (!elements.viewEditorLab || elements.viewEditorLab.classList.contains('hidden')) return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleEditorPlay();
    } else if (e.code === 'KeyI') {
      e.preventDefault();
      setTrimInAtCurrentPlayhead();
    } else if (e.code === 'KeyO') {
      e.preventDefault();
      setTrimOutAtCurrentPlayhead();
    } else if (e.code === 'KeyC') {
      e.preventDefault();
      splitClipAtPlayhead();
    } else if (e.code === 'KeyX') {
      e.preventDefault();
      switchCropViewMode('adjust');
    } else if (e.code === 'KeyV') {
      e.preventDefault();
      switchCropViewMode('removed');
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      elements.editorVideoSource.currentTime = Math.max(0, elements.editorVideoSource.currentTime - 1);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      elements.editorVideoSource.currentTime = Math.min(editorState.duration, elements.editorVideoSource.currentTime + 1);
    } else if (e.code === 'KeyL') {
      e.preventDefault();
      editorState.isLooping = !editorState.isLooping;
      elements.btnEditorPreviewLoop.classList.toggle('active', editorState.isLooping);
    } else if (e.code === 'KeyM') {
      e.preventDefault();
      editorState.isMuted = !editorState.isMuted;
      elements.editorVideoSource.muted = editorState.isMuted;
      elements.editorVolIcon.className = editorState.isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }
  });

  // --- High-Resolution Multi-Rate Video Export Engine ---
  elements.btnExportVideo.addEventListener('click', async () => {
    if (!editorState.blob && !editorState.url) {
      alert('Please load or record a video first.');
      return;
    }

    if (editorState.isExporting) return;
    editorState.isExporting = true;
    editorState.exportCancelled = false;

    // Show Progress Panel
    elements.exportProgressPanel.classList.remove('hidden');
    elements.exportResultBox.classList.add('hidden');
    elements.btnExportVideo.disabled = true;
    elements.exportBarFill.style.width = '0%';
    elements.exportProgressPercent.textContent = '0%';
    elements.exportProgressStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing High-Res Render Engine...';

    const resolutionPref = elements.exportResolution.value; // 'source', '1080p', '720p', '4k'
    const targetFps = parseInt(elements.exportFps.value) || 30;
    const formatPref = elements.exportFormat.value; // 'mp4' or 'webm'
    const bitrate = parseInt(elements.exportBitrate.value) || 16000000;

    // Calculate Pixel Dimensions for Export Canvas
    const vw = editorState.videoWidth || 1920;
    const vh = editorState.videoHeight || 1080;
    const crop = editorState.cropRect;
    const cropPixelW = Math.round(crop.w * vw);
    const cropPixelH = Math.round(crop.h * vh);
    const cropAspect = cropPixelW / cropPixelH;

    let targetW = cropPixelW;
    let targetH = cropPixelH;

    if (resolutionPref === '1080p') {
      if (cropAspect >= 1) {
        targetW = 1920;
        targetH = Math.round(1920 / cropAspect);
      } else {
        targetH = 1080;
        targetW = Math.round(1080 * cropAspect);
      }
    } else if (resolutionPref === '720p') {
      if (cropAspect >= 1) {
        targetW = 1280;
        targetH = Math.round(1280 / cropAspect);
      } else {
        targetH = 720;
        targetW = Math.round(720 * cropAspect);
      }
    } else if (resolutionPref === '4k') {
      if (cropAspect >= 1) {
        targetW = 3840;
        targetH = Math.round(3840 / cropAspect);
      } else {
        targetH = 2160;
        targetW = Math.round(2160 * cropAspect);
      }
    }

    // Ensure even dimensions for video codecs
    targetW = targetW % 2 === 0 ? targetW : targetW + 1;
    targetH = targetH % 2 === 0 ? targetH : targetH + 1;

    // Collect Active Time Segments
    let renderSegments = editorState.segments.filter(s => s.enabled);
    if (renderSegments.length === 0) {
      renderSegments = [{ start: editorState.trimIn, end: editorState.trimOut }];
    } else if (renderSegments.length === 1 && renderSegments[0].start === 0 && renderSegments[0].end === editorState.duration) {
      // Use Trim Points if single unmodified segment
      renderSegments = [{ start: editorState.trimIn, end: editorState.trimOut }];
    }

    const totalRenderDuration = renderSegments.reduce((acc, s) => acc + (s.end - s.start), 0);
    const totalFrames = Math.max(1, Math.round(totalRenderDuration * targetFps));

    try {
      // Setup Offscreen Render Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Setup MediaStream from Canvas + Audio bridge
      const canvasStream = canvas.captureStream(targetFps);

      // Route Audio from Source Video Element (reusable to avoid InvalidStateError)
      try {
        if (!editorState.exportAudioCtx) {
          editorState.exportAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
          editorState.exportSourceNode = editorState.exportAudioCtx.createMediaElementSource(elements.editorVideoSource);
          editorState.exportSourceNode.connect(editorState.exportAudioCtx.destination);
        }
        const destNode = editorState.exportAudioCtx.createMediaStreamDestination();
        editorState.exportSourceNode.connect(destNode);
        destNode.stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
      } catch (aErr) {
        console.warn('Export audio routing fallback:', aErr);
      }

      // Safe MediaRecorder for Export
      const hasExportAudio = canvasStream.getAudioTracks().length > 0;
      const isExportMp4 = formatPref === 'mp4';
      const optimalMime = getOptimalRecorderMimeType(isExportMp4 ? 'mp4' : 'webm', hasExportAudio);
      const exportChunks = [];
      let exportRecorder = null;

      const exportCandidates = [];
      if (optimalMime) exportCandidates.push(optimalMime);
      if (isExportMp4) {
        exportCandidates.push('video/mp4');
      }
      exportCandidates.push(hasExportAudio ? 'video/webm;codecs=vp9,opus' : 'video/webm;codecs=vp9');
      exportCandidates.push('video/webm');
      exportCandidates.push('');

      for (const m of exportCandidates) {
        try {
          const opts = (m && MediaRecorder.isTypeSupported(m)) 
            ? { mimeType: m, videoBitsPerSecond: bitrate } 
            : { videoBitsPerSecond: bitrate };
          exportRecorder = new MediaRecorder(canvasStream, opts);
          if (exportRecorder) break;
        } catch (e1) {
          try {
            const opts = (m && MediaRecorder.isTypeSupported(m)) ? { mimeType: m } : {};
            exportRecorder = new MediaRecorder(canvasStream, opts);
            if (exportRecorder) break;
          } catch (e2) {}
        }
      }

      if (!exportRecorder) {
        exportRecorder = new MediaRecorder(canvasStream);
      }

      exportRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) exportChunks.push(e.data);
      };

      const exportPromise = new Promise((resolve) => {
        exportRecorder.onstop = () => {
          const finalMime = exportRecorder.mimeType || 'video/mp4';
          const exportedBlob = new Blob(exportChunks, { type: finalMime });
          resolve(exportedBlob);
        };
      });

      exportRecorder.start();

      // Cancel button handler
      elements.btnCancelExport.onclick = () => {
        editorState.exportCancelled = true;
      };

      // Source Crop Pixel Coordinates
      const sx = crop.x * vw;
      const sy = crop.y * vh;
      const sw = crop.w * vw;
      const sh = crop.h * vh;

      let renderedFrames = 0;

      // Sequential Segment Render Loop
      for (const seg of renderSegments) {
        if (editorState.exportCancelled) break;

        elements.editorVideoSource.currentTime = seg.start;
        await new Promise(r => elements.editorVideoSource.onseeked = r);

        const segDuration = seg.end - seg.start;
        const segFrames = Math.round(segDuration * targetFps);
        const frameInterval = 1 / targetFps;

        for (let f = 0; f < segFrames; f++) {
          if (editorState.exportCancelled) break;

          const frameTime = seg.start + (f * frameInterval);
          elements.editorVideoSource.currentTime = Math.min(seg.end, frameTime);
          await new Promise(r => elements.editorVideoSource.onseeked = r);

          // Draw Cropped Region to High-Res Target Canvas
          ctx.drawImage(elements.editorVideoSource, sx, sy, sw, sh, 0, 0, targetW, targetH);

          renderedFrames++;
          const pct = Math.min(99, Math.round((renderedFrames / totalFrames) * 100));
          elements.exportBarFill.style.width = `${pct}%`;
          elements.exportProgressPercent.textContent = `${pct}%`;
          elements.exportFrameCount.textContent = `Frame ${renderedFrames} / ${totalFrames} (${targetW}x${targetH})`;
          elements.exportProgressStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Rendering segment (${formatTime(frameTime)})...`;

          // Small yield for smooth UI updates
          await new Promise(r => setTimeout(r, 4));
        }
      }

      if (editorState.exportCancelled) {
        exportRecorder.stop();
        elements.exportProgressPanel.classList.add('hidden');
        elements.btnExportVideo.disabled = false;
        editorState.isExporting = false;
        alert('Export was cancelled.');
        return;
      }

      // Finish Recording & Compile Output Blob
      elements.exportProgressStatus.innerHTML = '<i class="fa-solid fa-check"></i> Encoding output stream...';
      elements.exportBarFill.style.width = '100%';
      elements.exportProgressPercent.textContent = '100%';

      exportRecorder.stop();
      const finalBlob = await exportPromise;

      const ext = (exportRecorder.mimeType && exportRecorder.mimeType.includes('webm')) ? 'webm' : 'mp4';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const outputFileName = `AnyConvert_Edited_${timestamp}.${ext}`;
      const downloadUrl = URL.createObjectURL(finalBlob);

      // Present Download Card
      elements.exportProgressPanel.classList.add('hidden');
      elements.exportResultBox.classList.remove('hidden');
      elements.exportResultName.textContent = outputFileName;
      elements.exportResultSize.textContent = `${formatBytes(finalBlob.size)} • ${targetW}x${targetH} @ ${targetFps}fps`;
      elements.exportResultDownloadLink.href = downloadUrl;
      elements.exportResultDownloadLink.download = outputFileName;

      // Auto-trigger instant download
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = outputFileName;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

    } catch (exportErr) {
      console.error('Export error:', exportErr);
      alert('Export failed: ' + exportErr.message);
      elements.exportProgressPanel.classList.add('hidden');
    } finally {
      elements.btnExportVideo.disabled = false;
      editorState.isExporting = false;
    }
  });

  // 4. PPT to Word (.docx) Engine
  elements.inputPpt2Word.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.ppt2wordFile = e.target.files[0];
      elements.previewPpt2WordList.innerHTML = `
        <div class="file-item">
          <div class="file-info">
            <i class="fa-solid fa-file-powerpoint icon-ppt"></i>
            <div>
              <strong>${state.ppt2wordFile.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(state.ppt2wordFile.size)}</div>
            </div>
          </div>
          <i class="fa-solid fa-circle-check" style="color: var(--accent-success);"></i>
        </div>
      `;
      elements.btnConvertPpt2Word.disabled = false;
    }
  });

  // Helper: Extract all slides from PPTX archive cleanly via JSZip
  async function extractPptxData(file) {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Slide files are ppt/slides/slide1.xml, slide2.xml, etc.
    const slideNames = Object.keys(zip.files)
      .filter(name => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/i)[1], 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/i)[1], 10);
        return numA - numB;
      });

    if (slideNames.length === 0) {
      Object.keys(zip.files).forEach(name => {
        if (name.includes('slide') && name.endsWith('.xml') && !name.includes('slideLayout') && !name.includes('slideMaster')) {
          slideNames.push(name);
        }
      });
    }

    const decodeXml = (str) => {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
    };

    const slides = [];
    for (let i = 0; i < slideNames.length; i++) {
      const xml = await zip.file(slideNames[i]).async('text');
      const paragraphMatches = xml.match(/<a:p[\s\S]*?<\/a:p>/g) || [];
      const lines = [];

      for (const pXml of paragraphMatches) {
        const tMatches = (pXml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [])
          .map(t => decodeXml(t.replace(/<\/?[^>]+(>|$)/g, '')).trim());
        const combined = tMatches.join('');
        if (combined.length > 0) {
          lines.push(combined);
        }
      }

      const title = lines[0] || `Slide ${i + 1}`;
      const bullets = lines.length > 1 ? lines.slice(1) : [];

      slides.push({
        slideNumber: i + 1,
        title: title,
        bullets: bullets,
        allLines: lines
      });
    }

    return slides;
  }

  elements.btnConvertPpt2Word.addEventListener('click', async () => {
    if (!state.ppt2wordFile) return;

    elements.btnConvertPpt2Word.disabled = true;
    elements.btnConvertPpt2Word.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Extracting Presentation...';

    try {
      const slides = await extractPptxData(state.ppt2wordFile);
      const { Document, Packer, Paragraph, HeadingLevel, TextRun, PageBreak } = window.docx;

      const baseName = state.ppt2wordFile.name.replace(/\.[^/.]+$/, '');
      const docParagraphs = [
        new Paragraph({
          text: `Presentation: ${baseName}`,
          heading: HeadingLevel.TITLE
        }),
        new Paragraph({
          text: `Extracted on ${new Date().toLocaleDateString()} • ${slides.length} Slides`,
          heading: HeadingLevel.SUBTITLE
        }),
        new Paragraph({
          children: [new PageBreak()]
        })
      ];

      if (slides.length === 0) {
        docParagraphs.push(new Paragraph({
          children: [new TextRun({ text: "No textual slide content detected in presentation.", italics: true })]
        }));
      } else {
        slides.forEach((slide, idx) => {
          docParagraphs.push(new Paragraph({
            text: `Slide ${slide.slideNumber}: ${slide.title}`,
            heading: HeadingLevel.HEADING_1
          }));

          if (slide.bullets.length > 0) {
            slide.bullets.forEach(bullet => {
              docParagraphs.push(new Paragraph({
                children: [
                  new TextRun({ text: '•  ', bold: true }),
                  new TextRun({ text: bullet })
                ]
              }));
            });
          } else {
            docParagraphs.push(new Paragraph({
              children: [new TextRun({ text: "(No sub-bullets on this slide)", italics: true, color: "718096" })]
            }));
          }

          if (idx < slides.length - 1) {
            docParagraphs.push(new Paragraph({
              children: [new PageBreak()]
            }));
          }
        });
      }

      const doc = new Document({ sections: [{ children: docParagraphs }] });
      const blob = await Packer.toBlob(doc);
      const docxUrl = URL.createObjectURL(blob);
      const outName = baseName + '_anyconvert.docx';

      elements.resultPpt2Word.classList.remove('hidden');
      elements.ppt2wordFilename.textContent = outName;

      elements.btnDlPpt2Word.onclick = () => {
        const a = document.createElement('a');
        a.href = docxUrl;
        a.download = outName;
        a.click();
      };

    } catch (err) {
      alert('PPT Extraction Error: ' + err.message);
    } finally {
      elements.btnConvertPpt2Word.disabled = false;
      elements.btnConvertPpt2Word.innerHTML = '<i class="fa-solid fa-file-word"></i> Extract & Create Word Doc';
    }
  });

  // 5. PPT to PDF Engine
  elements.inputPpt2Pdf.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.ppt2pdfFile = e.target.files[0];
      elements.previewPpt2PdfList.innerHTML = `
        <div class="file-item">
          <div class="file-info">
            <i class="fa-solid fa-file-powerpoint icon-ppt"></i>
            <div>
              <strong>${state.ppt2pdfFile.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(state.ppt2pdfFile.size)}</div>
            </div>
          </div>
          <i class="fa-solid fa-circle-check" style="color: var(--accent-success);"></i>
        </div>
      `;
      elements.btnConvertPpt2Pdf.disabled = false;
    }
  });

  elements.btnConvertPpt2Pdf.addEventListener('click', async () => {
    if (!state.ppt2pdfFile) return;

    elements.btnConvertPpt2Pdf.disabled = true;
    elements.btnConvertPpt2Pdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Presentation PDF...';

    try {
      const slides = await extractPptxData(state.ppt2pdfFile);
      const totalSlides = slides.length;
      const baseName = state.ppt2pdfFile.name.replace(/\.[^/.]+$/, '');

      const container = document.createElement('div');
      container.style.width = '1000px';
      container.style.background = '#ffffff';

      let slidesHtml = '';

      if (totalSlides === 0) {
        slidesHtml = `
          <div class="slide-deck-page" style="width: 960px; min-height: 540px; padding: 48px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; font-family: 'Outfit', sans-serif;">
            <h1 style="color: #0f172a; margin-bottom: 12px;">${baseName}</h1>
            <p style="color: #64748b; font-size: 16px;">No text content found in slides.</p>
          </div>
        `;
      } else {
        slides.forEach((slide, idx) => {
          const isLast = idx === totalSlides - 1;
          const pageBreakStyle = isLast ? '' : 'page-break-after: always; break-after: page;';

          let bulletsMarkup = '';
          if (slide.bullets.length > 0) {
            bulletsMarkup = slide.bullets.map(b => `
              <div style="display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 16px; line-height: 1.6; color: #334155;">
                <span style="color: #6366f1; margin-right: 12px; font-size: 18px; line-height: 1;">•</span>
                <div>${b}</div>
              </div>
            `).join('');
          } else {
            bulletsMarkup = `<p style="font-style: italic; color: #94a3b8; font-size: 15px;">(Slide contains graphical visual elements or title only)</p>`;
          }

          slidesHtml += `
            <div class="slide-deck-page" style="${pageBreakStyle} width: 960px; min-height: 540px; box-sizing: border-box; padding: 48px 56px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 24px;">
                  <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.05em; color: #6366f1; text-transform: uppercase;">Slide ${idx + 1} of ${totalSlides}</span>
                  <span style="font-size: 12px; color: #94a3b8;">${baseName}</span>
                </div>
                <h2 style="font-size: 26px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 22px; line-height: 1.3;">${slide.title}</h2>
                <div style="margin-top: 8px;">
                  ${bulletsMarkup}
                </div>
              </div>
              <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; margin-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
                <span>AnyConvert Presentation Studio</span>
                <span>Page ${idx + 1} of ${totalSlides}</span>
              </div>
            </div>
          `;
        });
      }

      container.innerHTML = slidesHtml;
      document.body.appendChild(container);

      const outName = baseName + '_anyconvert.pdf';
      const opt = {
        margin: 10,
        filename: outName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
      container.remove();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      elements.resultPpt2Pdf.classList.remove('hidden');
      elements.ppt2pdfFilename.textContent = outName;

      elements.btnDlPpt2Pdf.onclick = () => {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = outName;
        a.click();
      };

      if (elements.btnPrevPpt2Pdf) {
        elements.btnPrevPpt2Pdf.onclick = () => {
          window.open(pdfUrl, '_blank');
        };
      }

    } catch (err) {
      alert('PPT to PDF Error: ' + err.message);
    } finally {
      elements.btnConvertPpt2Pdf.disabled = false;
      elements.btnConvertPpt2Pdf.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Convert PPT to PDF';
    }
  });

  // 6. Image Compressor
  elements.inputImgOpt.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.imgFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        elements.imgOrigPreview.src = event.target.result;
        elements.imgOrigSize.textContent = formatBytes(state.imgFile.size);
        elements.imgOptEditor.classList.remove('hidden');
        processImageCompression();
      };
      reader.readAsDataURL(state.imgFile);
    }
  });

  elements.sliderImgQuality.addEventListener('input', () => {
    elements.valImgQuality.textContent = `${elements.sliderImgQuality.value}%`;
    processImageCompression();
  });

  elements.sliderImgScale.addEventListener('input', () => {
    const scale = elements.sliderImgScale.value;
    elements.valImgScale.textContent = scale === '100' ? 'Original (100%)' : `${scale}%`;
    processImageCompression();
  });

  elements.imgTargetFormat.addEventListener('change', processImageCompression);

  function processImageCompression() {
    if (!state.imgFile || !elements.imgOrigPreview.src) return;

    const img = new Image();
    img.src = elements.imgOrigPreview.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scalePercent = parseInt(elements.sliderImgScale.value) / 100;
      const targetWidth = Math.round(img.width * scalePercent);
      const targetHeight = Math.round(img.height * scalePercent);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const format = elements.imgTargetFormat.value;
      const quality = parseInt(elements.sliderImgQuality.value) / 100;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const optUrl = URL.createObjectURL(blob);
        elements.imgOptPreview.src = optUrl;
        elements.imgOptSize.textContent = formatBytes(blob.size);

        const saving = Math.round(((state.imgFile.size - blob.size) / state.imgFile.size) * 100);
        elements.imgSavingBadge.textContent = saving >= 0 ? `-${saving}% Saved` : `+${Math.abs(saving)}% Larger`;
        elements.imgSavingBadge.style.color = saving >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)';

        elements.btnSaveImg.onclick = () => {
          const extMap = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };
          const ext = extMap[format] || 'jpg';
          const a = document.createElement('a');
          a.href = optUrl;
          a.download = state.imgFile.name.replace(/\.[^/.]+$/, '') + `_anyconvert.${ext}`;
          a.click();
        };
      }, format, quality);
    };
  }

  // 7. PDF Merger
  elements.inputPdfMerge.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.pdfMergeFiles = Array.from(e.target.files);
      elements.pdfMergeList.innerHTML = state.pdfMergeFiles.map(file => `
        <div class="file-item">
          <div class="file-info">
            <i class="fa-solid fa-file-pdf icon-pdf"></i>
            <div>
              <strong>${file.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(file.size)}</div>
            </div>
          </div>
          <i class="fa-solid fa-check" style="color: var(--accent-success);"></i>
        </div>
      `).join('');
      elements.btnMergePdfs.disabled = state.pdfMergeFiles.length < 2;
    }
  });

  elements.btnMergePdfs.addEventListener('click', async () => {
    if (state.pdfMergeFiles.length < 2) return;

    elements.btnMergePdfs.disabled = true;
    elements.btnMergePdfs.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging PDFs...';

    try {
      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const file of state.pdfMergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      elements.resultPdfMerge.classList.remove('hidden');
      elements.pdfmergeFilename.textContent = 'merged_anyconvert.pdf';

      elements.btnDlPdfMerge.onclick = () => {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'merged_anyconvert.pdf';
        a.click();
      };

    } catch (err) {
      alert('PDF Merge Error: ' + err.message);
    } finally {
      elements.btnMergePdfs.disabled = false;
      elements.btnMergePdfs.innerHTML = '<i class="fa-solid fa-layer-group"></i> Merge PDFs Together';
    }
  });

  // 8. Audio Extractor
  elements.inputMediaExt.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      state.mediaFile = e.target.files[0];
      elements.mediaextPreviewList.innerHTML = `
        <div class="file-item">
          <div class="file-info">
            <i class="fa-solid fa-file-video icon-media"></i>
            <div>
              <strong>${state.mediaFile.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${formatBytes(state.mediaFile.size)}</div>
            </div>
          </div>
          <i class="fa-solid fa-circle-check" style="color: var(--accent-success);"></i>
        </div>
      `;
      elements.btnProcessMedia.disabled = false;
    }
  });

  elements.btnProcessMedia.addEventListener('click', async () => {
    if (!state.mediaFile) return;

    elements.btnProcessMedia.disabled = true;
    elements.btnProcessMedia.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Extracting Audio Track...';

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await state.mediaFile.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
      const audioUrl = URL.createObjectURL(wavBlob);
      const outName = state.mediaFile.name.replace(/\.[^/.]+$/, '') + '_audio.wav';

      elements.resultMediaExt.classList.remove('hidden');
      elements.mediaextFilename.textContent = outName;

      elements.btnDlMediaExt.onclick = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = outName;
        a.click();
      };

    } catch (err) {
      alert('Audio Extraction Error: ' + err.message);
    } finally {
      elements.btnProcessMedia.disabled = false;
      elements.btnProcessMedia.innerHTML = '<i class="fa-solid fa-gear"></i> Extract Audio Track';
    }
  });

  function bufferToWave(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (offset < len) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  // =========================================================================
  // 9. Reddit Idea Scraper + Gemini AI Analysis
  // =========================================================================
  (function initRedditScraper() {
    const btnScrape        = document.getElementById('btn-reddit-scrape');
    const nicheEl          = document.getElementById('idea-niche');
    const platformFilterEl = document.getElementById('idea-platform-filter');
    const limitEl          = document.getElementById('reddit-limit');
    const statusEl         = document.getElementById('reddit-status');
    const statusText       = document.getElementById('reddit-status-text');
    const resultsHdr       = document.getElementById('reddit-results-header');
    const resultCount      = document.getElementById('reddit-result-count');
    const grid             = document.getElementById('reddit-results-grid');
    const btnCsv           = document.getElementById('btn-reddit-csv');
    const btnAnalyse       = document.getElementById('btn-reddit-analyse');
    const chips            = document.querySelectorAll('#reddit-keyword-chips .chip');
    const typeChips        = document.querySelectorAll('#product-type-chips .type-chip');
    const reportEl         = document.getElementById('gemini-report');
    const reportBody       = document.getElementById('gemini-report-body');
    const btnCloseRpt      = document.getElementById('btn-close-report');

    let allPosts   = [];
    let activeKw   = '';
    let activeType = 'all';
    let activePlatform = 'all';
    let geminiMap  = {};   // postId -> { score, category, category_label, price_idea, idea, reason }
    const nicheIterationMap = {}; // Tracks page offsets per niche for fresh non-repetitive results

    // --- High-Demand Pain Point Query Matrix (Dynamic Multi-Query Pools) ---
    const NICHE_QUERIES = {
      all: {
        reddit: ['wish tool', 'looking for alternative', 'pain point workflow', 'repetitive task automate', 'why is there no software for'],
        hn: ['wish existed', 'ask hn tool', 'show hn side project', 'pain point workflow', 'annoying manual process', 'alternative to tool'],
        github: ['feature request tool', 'automation workflow cli', 'spreadsheet integration', 'template boilerplate generator'],
        devTag: ['discuss', 'productivity', 'showdev', 'webdev', 'beginners', 'tools', 'help'],
        so: ['automate', 'python script automation', 'excel sheet formula', 'api webhook workflow']
      },
      digital_products: {
        reddit: ['Notion template tool', 'digital product idea', 'workflow checklist spreadsheet', 'gumroad product template', 'tracker template Notion'],
        hn: ['digital product template', 'Notion system productivity', 'automated spreadsheet formula', 'gumroad workflow micro saas', 'I wish there was a template'],
        github: ['template checklist system', 'automation spreadsheet workflow', 'generator boilerplate tool', 'notion integration export'],
        devTag: ['productivity', 'webdev', 'showdev', 'javascript', 'tools'],
        so: ['automate sheet', 'excel python script', 'notion api workflow', 'google sheet automation']
      },
      parenting_burnout: {
        reddit: ['parenting burnout overwhelm', 'chore chart tracker app', 'family schedule chaos', 'meal plan mental load', 'kids routine checklist'],
        hn: ['burnout work balance', 'family schedule system', 'parenting daily routine tool', 'mental load organization', 'time management parents'],
        github: ['family calendar tracker', 'chore management system', 'daily habit routine tracker', 'family budget meal planner'],
        devTag: ['productivity', 'lifestyle', 'wellness', 'management'],
        so: ['schedule automation', 'calendar sync script', 'notification reminder bot', 'family tracking']
      },
      moms_newborn: {
        reddit: ['baby sleep newborn routine', 'feeding tracker log', 'postpartum recovery checklist', 'first time mom schedule', 'pumping bottle log'],
        hn: ['baby sleep tracking', 'pediatric log automation', 'newborn routine tracker', 'family health record vault'],
        github: ['baby tracker feeding', 'sleep logging application', 'health log diary', 'baby milestones checklist'],
        devTag: ['productivity', 'health', 'beginners'],
        so: ['timer tracking', 'logging database schema', 'date math calculation', 'baby tracker']
      },
      young_adults: {
        reddit: ['feeling lost career 20s', 'budgeting 20s template', 'first apartment move checklist', 'interview prep tracker', 'quarter life crisis reset'],
        hn: ['career direction 20s', 'personal finance system', 'career pivot playbook', 'resume tracker template', 'goal setting framework'],
        github: ['resume portfolio template', 'personal finance spreadsheet', 'job application tracker', 'habit building dashboard'],
        devTag: ['career', 'discuss', 'productivity', 'learning'],
        so: ['python automation', 'job scraping script', 'resume parser', 'finance spreadsheet']
      },
      emergency_health: {
        reddit: ['emergency vault allergy checklist', 'medical history tracker family', 'ice documents in case of emergency', 'caregiver log sheet', 'vital records binder'],
        hn: ['family emergency document', 'encrypted medical records vault', 'disaster preparedness checklist', 'legacy passwords vault'],
        github: ['health symptom tracker', 'emergency contact manager', 'encrypted personal vault', 'medical history log'],
        devTag: ['security', 'privacy', 'health', 'productivity'],
        so: ['encrypted vault', 'secure document storage', 'pdf generator template', 'emergency backup']
      },
      b2b: {
        reddit: ['invoicing CRM client headache', 'freelance proposal template', 'client onboarding checklist', 'contract signing workflow', 'late payment reminder automation'],
        hn: ['invoicing CRM micro saas', 'client onboarding automation', 'b2b billing pain points', 'contract automation tool', 'freelancer bottlenecks'],
        github: ['billing integration stripe', 'client portal dashboard', 'invoice generator pdf', 'crm lightweight pipeline'],
        devTag: ['productivity', 'business', 'showdev', 'saas'],
        so: ['invoice automation', 'stripe webhook handling', 'pdf receipt generator', 'crm api sync']
      },
      dev: {
        reddit: ['developer tool CLI boilerplate', 'git merge conflict headache', 'docker local setup slow', 'env variables sync team', 'api documentation generator'],
        hn: ['developer tool CLI', 'developer friction points', 'i made a tool for developers', 'local dev environment setup', 'command line automation'],
        github: ['linter boilerplate generator', 'developer productivity cli', 'code generator template', 'git automation tool'],
        devTag: ['devjournal', 'showdev', 'webdev', 'productivity', 'tooling'],
        so: ['cli tool node', 'bash automation script', 'git hook workflow', 'compiler build tool']
      },
      solopreneur: {
        reddit: ['micro saas side project idea', 'gumroad launch strategy', 'stripe payment integration boilerplate', 'indie hacker launch checklist', 'first 100 users tactics'],
        hn: ['micro saas side project', 'show hn indie project', 'side business automation', 'bootstrapped tool profitable', 'impulse buy digital product'],
        github: ['starter kit saas boilerplate', 'gumroad webhook handler', 'nextjs landing page template', 'micro saas starter'],
        devTag: ['showdev', 'saas', 'indiehackers', 'startup'],
        so: ['stripe webhook node', 'authentication boilerplate', 'database migration script', 'payment gateway']
      },
      productivity: {
        reddit: ['productivity workflow bottleneck', 'second brain notion system', 'daily task priority matrix', 'time blocking calendar tool', 'inbox zero automation'],
        hn: ['productivity workflow system', 'note taking system friction', 'task manager simple', 'markdown notes daily planner', 'speeding up daily workflow'],
        github: ['tracker markdown notes', 'kanban board local storage', 'pomodoro focus timer app', 'daily journal template'],
        devTag: ['productivity', 'discuss', 'javascript', 'tools'],
        so: ['excel formula vlookup automate', 'google apps script calendar', 'notion api integration', 'markdown parser']
      },
      ecommerce: {
        reddit: ['ecommerce shopify product research', 'abandoned cart recovery email', 'inventory sync multi platform', 'ugc video ads script template', 'supplier price tracker'],
        hn: ['ecommerce shopify tools', 'inventory tracking api', 'headless commerce micro tools', 'ecommerce automation scripts'],
        github: ['inventory api shopify', 'price alert scraper', 'ecommerce catalog generator', 'product feed xml builder'],
        devTag: ['webdev', 'ecommerce', 'showdev'],
        so: ['shopify api webhook', 'stripe payment intent', 'inventory sync script', 'order fulfillment api']
      }
    };

    const STORAGE_KEY = 'anyconvert_gemini_key';
    btnCloseRpt.addEventListener('click', () => reportEl.classList.add('hidden'));

    // --- Platform Dropdown Live Filter ---
    if (platformFilterEl) {
      platformFilterEl.addEventListener('change', () => {
        activePlatform = platformFilterEl.value || 'all';
        renderGrid(filterPosts(allPosts, activeKw, activeType, activePlatform));
      });
    }

    // --- Product Type / Format Filter Chips ---
    typeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        typeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeType = chip.dataset.type || 'all';
        renderGrid(filterPosts(allPosts, activeKw, activeType, activePlatform));
      });
    });

    // --- Keyword filter chips ---
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeKw = chip.dataset.kw;

        if (activeKw === 'digital_products' && nicheEl) {
          nicheEl.value = 'digital_products';
          btnScrape.click();
          return;
        } else if (activeKw === 'burnout' && nicheEl) {
          nicheEl.value = 'parenting_burnout';
          btnScrape.click();
          return;
        } else if (activeKw === 'parenting' && nicheEl) {
          nicheEl.value = 'parenting_burnout';
          btnScrape.click();
          return;
        } else if (activeKw === 'career' && nicheEl) {
          nicheEl.value = 'young_adults';
          btnScrape.click();
          return;
        }

        renderGrid(filterPosts(allPosts, activeKw, activeType, activePlatform));
      });
    });

    // --- Instant Local Product Blueprint Synthesizer ---
    function synthesizeLocalBlueprints(posts) {
      posts.forEach(p => {
        if (geminiMap[p.id]) return;
        const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
        let cat = 'tool';
        let catLabel = '🛠️ Micro-SaaS';
        let price = '$19/mo';
        let productName = '';
        let blueprintDesc = '';

        // Clean raw title
        let rawClean = p.title
          .replace(/^(ask hn:|show hn:|i wish there was a|why is there no|feature request:?|request:?)/i, '')
          .replace(/\[.*?\]/g, '')
          .trim();
        if (!rawClean) rawClean = 'Automated Workflow Solution';

        // Categorize & Blueprint naming logic (Clean professional labels)
        if (/sheet|excel|template|notion|tracker|table|dashboard|spreadsheet/.test(text)) {
          cat = 'template';
          catLabel = 'Template & Tracker';
          price = '$29 one-off';
          productName = `${rawClean.slice(0, 48)} Hub`;
          blueprintDesc = `A pre-built dashboard & automation sheet with formulas and reporting widgets solving this workflow bottleneck.`;
        } else if (/ebook|e-book|epub|kindle|gumroad book|notion book|written guide|digital book|online course|mini course|video course|udemy|cohort/.test(text)) {
          cat = 'ebook';
          catLabel = 'eBook & Course';
          price = '$19 one-off';
          productName = `${rawClean.slice(0, 48)}: The Complete Guide`;
          blueprintDesc = `A practical eBook or short online course walking readers through solving this problem step-by-step, with real examples and templates included.`;
        } else if (/guide|course|book|cheat sheet|checklist|prompt|tutorial|sop/.test(text)) {
          cat = 'guide';
          catLabel = 'Playbook & SOP';
          price = '$19 one-off';
          productName = `${rawClean.slice(0, 48)} Playbook`;
          blueprintDesc = `A step-by-step PDF execution guide, checklist, and prompt pack to solve this exact problem without trial & error.`;
        } else if (/automation|zapier|make|n8n|webhook|cron|script|workflow|bot/.test(text)) {
          cat = 'automation';
          catLabel = 'Auto-Script & Bot';
          price = '$39 one-off';
          productName = `${rawClean.slice(0, 48)} Automation`;
          blueprintDesc = `A turnkey webhook recipe / background Python or Node script that completely automates this repetitive manual task.`;
        } else {
          cat = 'tool';
          catLabel = 'Micro-Tool & CLI';
          price = '$24/mo';
          productName = `${rawClean.slice(0, 48)} Pro`;
          blueprintDesc = `A lightweight web app or desktop micro-utility that solves this pain point in 1 click.`;
        }

        // Realistic engagement-based score — NOT AI rated, just a community signal estimate
        const totalEngagement = (p.score || 0) + (p.num_comments || 0) * 2;
        let score = 4;                         // default: low signal
        if (totalEngagement > 500) score = 7;
        else if (totalEngagement > 150) score = 6;
        else if (totalEngagement > 50)  score = 5;
        else if (totalEngagement > 10)  score = 4;
        else                            score = 3;

        geminiMap[p.id] = {
          id: p.id,
          score: score,
          isLocalEstimate: true,               // flag so the card can show "est." label
          category: cat,
          category_label: catLabel,
          price_idea: price,
          product_name: productName,
          idea: blueprintDesc,
          target_customer: `${p.platform.toUpperCase()} creators & developers facing this workflow friction`,
          emotional_trigger: 'Instant relief from manual, repetitive workflow exhaustion',
          impulse_hook: 'Stop wasting hours on manual setup — solve this in 60 seconds',
          fulfillment: null,
          reason: `Community signal: ${p.score} upvotes and ${p.num_comments} replies.`
        };
      });
    }

    // --- Automated Multi-Platform Scraping with Fresh Dynamic Pagination ---
    btnScrape.addEventListener('click', async () => {
      const niche = (nicheEl ? nicheEl.value : 'all') || 'all';
      activePlatform = (platformFilterEl ? platformFilterEl.value : 'all') || 'all';
      const totalLimit = parseInt(limitEl ? limitEl.value : '60', 10) || 60;
      const perSourceLimit = Math.max(15, Math.ceil(totalLimit / 3));

      // Advance pagination / query iteration counter for this niche
      nicheIterationMap[niche] = (nicheIterationMap[niche] || 0) + 1;
      const currentIteration = nicheIterationMap[niche];
      const pageIndex = (currentIteration - 1) % 6; // 0, 1, 2, 3, 4, 5

      const queries = NICHE_QUERIES[niche] || NICHE_QUERIES.all;

      // Select dynamic query phrase & sort order for this batch
      const hnQueryList = Array.isArray(queries.hn) ? queries.hn : [queries.hn];
      const ghQueryList = Array.isArray(queries.github) ? queries.github : [queries.github];
      const devTagList  = Array.isArray(queries.devTag) ? queries.devTag : [queries.devTag];
      const soQueryList  = Array.isArray(queries.so) ? queries.so : [queries.so];
      const rdQueryList  = Array.isArray(queries.reddit) ? queries.reddit : [queries.reddit];

      const selectedHnQuery = hnQueryList[(currentIteration - 1) % hnQueryList.length];
      const selectedGhQuery = ghQueryList[(currentIteration - 1) % ghQueryList.length];
      const selectedDevTag  = devTagList[(currentIteration - 1) % devTagList.length];
      const selectedSoQuery = soQueryList[(currentIteration - 1) % soQueryList.length];
      const selectedRdQuery = rdQueryList[(currentIteration - 1) % rdQueryList.length];

      grid.innerHTML = '';
      geminiMap = {};
      reportEl.classList.add('hidden');
      resultsHdr.classList.add('hidden');
      statusEl.classList.remove('hidden');
      statusText.textContent = `Market Foundry: Mining fresh ${niche.toUpperCase()} complaints from Hacker News, GitHub, Dev.to & Stack Overflow (Batch #${currentIteration})…`;
      btnScrape.disabled = true;

      try {
        const fetchPromises = [];
        const cacheBuster = Date.now();

        // Helper to fetch JSON with automatic CORS proxy fallback
        async function fetchJsonWithCorsFallback(targetUrl) {
          // 1. Try local Python server proxy
          try {
            const localProxyUrl = `http://localhost:8888/api/proxy?url=${encodeURIComponent(targetUrl)}`;
            const res = await fetch(localProxyUrl, { signal: AbortSignal.timeout(3000) });
            if (res.ok) return await res.json();
          } catch (_) {}

          // 2. Try direct fetch
          try {
            const res = await fetch(targetUrl, {
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(4000)
            });
            if (res.ok) return await res.json();
          } catch (_) {}

          // 3. Fallback to public CORS proxy
          try {
            const publicProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            const res = await fetch(publicProxyUrl, { signal: AbortSignal.timeout(5000) });
            if (res.ok) return await res.json();
          } catch (_) {}

          return null;
        }

        // 1. Hacker News Fetcher (Dynamic page offset & query rotation)
        if (activePlatform === 'all' || activePlatform === 'hackernews') {
          const hnEndpoint = currentIteration % 2 === 0 ? 'search_by_date' : 'search';
          const hnTags = currentIteration % 3 === 0 ? '(story,show_hn)' : '(story,ask_hn)';
          fetchPromises.push(
            fetch(`https://hn.algolia.com/api/v1/${hnEndpoint}?query=${encodeURIComponent(selectedHnQuery)}&tags=${hnTags}&page=${pageIndex}&hitsPerPage=${perSourceLimit}&_t=${cacheBuster}`, {
              headers: { 'Accept': 'application/json' }
            })
            .then(r => r.ok ? r.json() : { hits: [] })
            .then(data => (data?.hits || []).map(hit => {
              const rawBody = hit.story_text || hit.comment_text || '';
              const cleanBody = rawBody.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
              const tags = hit._tags || [];
              let flair = 'Hacker News';
              if (tags.includes('ask_hn')) flair = 'Ask HN';
              else if (tags.includes('show_hn')) flair = 'Show HN';

              return {
                id: String(hit.objectID),
                title: hit.title || 'Untitled Discussion',
                selftext: cleanBody,
                score: hit.points || 0,
                num_comments: hit.num_comments || 0,
                author: hit.author || 'hn_user',
                link_flair_text: flair,
                thumbnail: '',
                fullUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
                platform: 'hackernews'
              };
            }))
            .catch(() => [])
          );
        }

        // 2. GitHub Issues Fetcher (Dynamic sort rotation & page cycling)
        if (activePlatform === 'all' || activePlatform === 'github') {
          const ghSorts = ['reactions', 'comments', 'updated', 'created'];
          const ghSort = ghSorts[currentIteration % ghSorts.length];
          const ghPage = pageIndex + 1;
          const ghQuery = `${selectedGhQuery} is:issue is:open`;
          fetchPromises.push(
            fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(ghQuery)}&sort=${ghSort}&order=desc&page=${ghPage}&per_page=${perSourceLimit}&_t=${cacheBuster}`, {
              headers: { 'Accept': 'application/vnd.github.v3+json' }
            })
            .then(r => r.ok ? r.json() : { items: [] })
            .then(data => (data?.items || []).map(item => {
              const cleanBody = (item.body || '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
              const labelTag = (item.labels && item.labels.length > 0) ? item.labels[0].name : 'Feature Request';
              const reactionCount = item.reactions ? (item.reactions.total_count || item.reactions['+1'] || 0) : 0;

              return {
                id: String(item.id),
                title: item.title || 'Untitled Feature Request',
                selftext: cleanBody,
                score: reactionCount || item.comments || 0,
                num_comments: item.comments || 0,
                author: item.user?.login || 'developer',
                link_flair_text: labelTag,
                thumbnail: item.user?.avatar_url || '',
                fullUrl: item.html_url,
                platform: 'github'
              };
            }))
            .catch(() => [])
          );
        }

        // 3. Dev.to Community Fetcher (Dynamic tag & page cycling)
        if (activePlatform === 'all' || activePlatform === 'devto') {
          const devPage = pageIndex + 1;
          fetchPromises.push(
            fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(selectedDevTag)}&page=${devPage}&per_page=${perSourceLimit}&_t=${cacheBuster}`)
            .then(r => r.ok ? r.json() : [])
            .then(articles => (Array.isArray(articles) ? articles : []).map(a => {
              return {
                id: String(a.id),
                title: a.title || 'Developer Discussion',
                selftext: (a.description || '').replace(/\r?\n/g, ' ').trim(),
                score: a.public_reactions_count || 0,
                num_comments: a.comments_count || 0,
                author: a.user?.username || 'dev_author',
                link_flair_text: a.tag_list?.[0] ? `#${a.tag_list[0]}` : 'Dev.to',
                thumbnail: a.cover_image || a.user?.profile_image || '',
                fullUrl: a.url,
                platform: 'devto'
              };
            }))
            .catch(() => [])
          );
        }

        // 4. Stack Overflow Fetcher (Dynamic sort rotation & page cycling)
        if (activePlatform === 'all' || activePlatform === 'stackoverflow') {
          const soSorts = ['votes', 'activity', 'creation'];
          const soSort = soSorts[currentIteration % soSorts.length];
          const soPage = pageIndex + 1;
          fetchPromises.push(
            fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=${soSort}&q=${encodeURIComponent(selectedSoQuery)}&site=stackoverflow&page=${soPage}&pagesize=${perSourceLimit}&_t=${cacheBuster}`)
            .then(r => r.ok ? r.json() : { items: [] })
            .then(data => (data?.items || []).map(q => {
              const tagLabel = q.tags?.[0] ? `[${q.tags[0]}]` : 'StackOverflow';
              return {
                id: String(q.question_id),
                title: q.title || 'Automation Question',
                selftext: `Viewed ${q.view_count || 0} times by developers looking for a solution.`,
                score: q.score || 0,
                num_comments: q.answer_count || 0,
                author: q.owner?.display_name || 'developer',
                link_flair_text: tagLabel,
                thumbnail: '',
                fullUrl: q.link,
                platform: 'stackoverflow'
              };
            }))
            .catch(() => [])
          );
        }

        // 5. Reddit Fetcher (Dynamic sort & time window cycling)
        if (activePlatform === 'reddit') {
          const rdSorts = ['top&t=month', 'top&t=year', 'relevance', 'new', 'hot'];
          const rdSort = rdSorts[currentIteration % rdSorts.length];
          const rdUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(selectedRdQuery)}&sort=${rdSort}&limit=${perSourceLimit}&raw_json=1&_t=${cacheBuster}`;
          fetchPromises.push(
            fetchJsonWithCorsFallback(rdUrl)
            .then(data => (data?.data?.children || []).map(c => {
              const p = c.data;
              return {
                id: String(p.id),
                title: p.title || 'Untitled Problem',
                selftext: (p.selftext || '').replace(/\r?\n/g, ' ').trim(),
                score: p.score || 0,
                num_comments: p.num_comments || 0,
                author: p.author || 'reddit_user',
                link_flair_text: p.subreddit_name_prefixed || p.link_flair_text || 'Reddit',
                thumbnail: p.thumbnail,
                fullUrl: `https://reddit.com${p.permalink}`,
                platform: 'reddit'
              };
            }))
            .catch(() => [])
          );
        }

        const results = await Promise.allSettled(fetchPromises);
        const sourceArrays = results.map(r => r.status === 'fulfilled' ? r.value : []);

        // Interleave posts across platforms for a rich balanced feed
        allPosts = [];
        const maxLen = Math.max(...sourceArrays.map(arr => arr.length), 0);
        for (let i = 0; i < maxLen; i++) {
          sourceArrays.forEach(arr => {
            if (arr[i]) allPosts.push(arr[i]);
          });
        }

        // Instant local blueprint synthesis so every card has a product concept immediately!
        synthesizeLocalBlueprints(allPosts);

        // Sort posts so high‑score (7+) ideas appear first
        allPosts.sort((a, b) => {
          const sa = (geminiMap[a.id] && geminiMap[a.id].score) || 0;
          const sb = (geminiMap[b.id] && geminiMap[b.id].score) || 0;
          return sb - sa;
        });

        statusEl.classList.add('hidden');
        renderGrid(filterPosts(allPosts, activeKw, activeType, activePlatform));

        // Auto-trigger Gemini analysis if key is available (config.js or localStorage)
        const apiKey = getApiKey();
        if (apiKey && allPosts.length > 0) {
          triggerGeminiAnalysis(apiKey, niche);
        }

      } catch (err) {
        statusEl.classList.add('hidden');
        grid.innerHTML = `<div class="reddit-error"><i class="fa-solid fa-triangle-exclamation"></i> ${err.message}. Check your internet connection.</div>`;
      } finally {
        btnScrape.disabled = false;
      }
    });

    // --- Helper: read key from config.js first, then localStorage ---
    function getApiKey() {
      return (window.ANYCONVERT_CONFIG && window.ANYCONVERT_CONFIG.GEMINI_KEY)
        || localStorage.getItem(STORAGE_KEY)
        || null;
    }

    // --- Gemini Analysis Handler ---
    btnAnalyse.addEventListener('click', () => {
      let apiKey = getApiKey();
      if (!apiKey) {
        apiKey = prompt('Paste your Gemini API key (saved locally for future sessions):');
        if (apiKey && apiKey.trim()) {
          localStorage.setItem(STORAGE_KEY, apiKey.trim());
        } else {
          return;
        }
      }
      const niche = (nicheEl ? nicheEl.value : 'all') || 'all';
      triggerGeminiAnalysis(apiKey.trim(), niche);
    });

    async function triggerGeminiAnalysis(apiKey, niche = 'all') {
      const visible = filterPosts(allPosts, activeKw, activeType, activePlatform);
      if (!visible.length) return;

      btnAnalyse.disabled = true;
      btnAnalyse.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analysing Pain Points…';
      reportEl.classList.add('hidden');

      // Feed posts with full title + body snippet for rich context
      const postList = visible.slice(0, 25).map((p, i) => {
        const snippet = (p.selftext || '').slice(0, 200).replace(/\n/g, ' ').trim();
        return `[${i + 1}] ID:${p.id} | Platform:${p.platform.toUpperCase()} | ⬆${p.score} upvotes | 💬${p.num_comments} replies
Title: "${p.title}"${snippet ? '\nContext: ' + snippet : ''}`;
      }).join('\n\n');

      const geminiPrompt = `You are an elite digital consumer psychologist, viral copywriter, and indie hacker product architect. Your superpower is looking at real people complaining online, diagnosing their deep emotional pain (fear of looking unprofessional, exhaustion from manual grind, anxiety over lost revenue), and transforming it into an irresistible $19–$39 impulse-buy digital product with a viral hook.

You will receive ${visible.slice(0, 25).length} real community posts. For each post:

1. DIAGNOSE THE EMOTIONAL PAIN: What is the underlying feeling? (e.g. "Exhaustion from manual data entry", "Fear of client scope disputes", "Desire to skip 40 hours of setup")
2. CRAFT AN IRRESISTIBLE IMPULSE HOOK: A punchy 1-line headline that makes them want to buy immediately
3. DEFINE THE PRODUCT & PRICING: High-converting format & frictionless impulse price ($19, $27, $37, or $49)
4. 5-STEP ACTION ROADMAP: How to build and ship it in 48 hours

Return a JSON array where EACH item contains:
- "id": the post ID exactly as given
- "score": integer 1–10 (commercial impulse-buy viability)
- "category": one of ["tool", "template", "guide", "ebook", "automation"]
- "category_label": clean text label without emojis (e.g. "Micro-SaaS Tool", "Notion System", "Playbook", "eBook", "Automation Bot")
- "product_name": crisp professional product name WITHOUT any emojis or stickers (e.g. "ScopeGuard Pro", "FlowSync Automation")
- "price_idea": frictionless impulse price (e.g. "$19", "$27", "$37 one-off", "$19/mo")
- "target_customer": exactly WHO this is for in 1 line (e.g. "Freelance designers tired of client revision disputes")
- "emotional_trigger": the psychological trigger that causes the impulse buy (e.g. "Eliminates anxiety of unpaid scope creep")
- "impulse_hook": 1-sentence viral hook to sell this on Twitter/Reddit/Gumroad
- "idea": ONE sentence value proposition — how it gives instant relief in under 5 minutes
- "fulfillment": a JSON array of exactly 5 short action steps to build and ship it
- "reason": ONE sentence — why people in this community would buy it on impulse

NOTE: Do NOT include any emojis, emoticons, or sticker icons anywhere in the output.

After the JSON array, write ---REPORT--- then provide:

## Top 5 High-Converting Impulse Products (${niche} niche)
For each: **[Product Name]** — [emotional hook & value] | Price: [price] | Emotional Trigger: [why it sells on impulse]

## Buyer Psychology & Market Opportunity
[3 sentences: the dominant psychological frustration across these communities, and how to position yourself as the immediate relief provider]

## Fastest $1,000 Impulse Win
[Name the single fastest product to build and sell this weekend, and why buyers will purchase without hesitation]

Posts to analyse:
${postList}`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
            })
          }
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API error ${res.status}`);
        }

        const data = await res.json();
        const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON array out of response
        const jsonMatch   = raw.match(/\[[\s\S]*?\]/);
        const reportParts = raw.split('---REPORT---');

        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            parsed.forEach(item => { geminiMap[item.id] = item; });
            renderGrid(filterPosts(allPosts, activeKw, activeType, activePlatform));
          } catch (_) { /* silently ignore */ }
        }

        // Render the market report
        const reportText = reportParts[1] || raw.replace(jsonMatch?.[0] || '', '');
        reportBody.innerHTML = reportText.trim()
          .replace(/^## (.+)$/gm, '<h3>$1</h3>')
          .replace(/^### (.+)$/gm, '<h4 style="color:#a5b4fc;margin:10px 0 4px">$1</h4>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/^(\d+)\. /gm, '<br><strong style="color:#818cf8">$1.</strong> ')
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>');
        reportEl.classList.remove('hidden');

      } catch (err) {
        alert('Gemini error: ' + err.message);
      } finally {
        btnAnalyse.disabled = false;
        btnAnalyse.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyse with Gemini';
      }
    }

    // --- Helpers ---
    function filterPosts(posts, kw, type = 'all', platform = 'all') {
      let filtered = posts;

      if (platform && platform !== 'all') {
        filtered = filtered.filter(p => p.platform === platform);
      }

      if (kw) {
        if (kw === 'digital_products') {
          // Show items representing high-value digital product opportunities
          filtered = filtered.filter(p => {
            const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
            return /tool|template|sheet|guide|book|tracker|app|automation|script|notion|saas|system|workflow|course|kit|os|checklist/.test(text);
          });
        } else if (kw === 'burnout') {
          filtered = filtered.filter(p => {
            const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
            return /burnout|overwhelm|exhaust|stress|struggle|time|manual|hours|hard|frustrat|balance|tired/.test(text);
          });
        } else if (kw === 'parenting') {
          filtered = filtered.filter(p => {
            const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
            return /parent|kid|family|baby|mom|dad|child|home|life|sleep|routine|school/.test(text);
          });
        } else if (kw === 'career') {
          filtered = filtered.filter(p => {
            const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
            return /career|job|20s|lost|remote|resume|hire|interview|direction|start|money|salary/.test(text);
          });
        } else {
          const q = kw.toLowerCase();
          filtered = filtered.filter(p =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.selftext || '').toLowerCase().includes(q)
          );
        }
      }

      if (type && type !== 'all') {
        filtered = filtered.filter(p => {
          const ai = geminiMap[p.id];
          if (ai && ai.category) {
            return ai.category.toLowerCase() === type.toLowerCase();
          }

          // Fallback keyword heuristic if AI analysis hasn't run yet
          const text = ((p.title || '') + ' ' + (p.selftext || '')).toLowerCase();
          if (type === 'tool') return /tool|app|software|cli|saas|extension|bot|script|plugin/.test(text);
          if (type === 'template') return /template|sheet|excel|notion|figma|dashboard|tracker|table/.test(text);
          if (type === 'ebook') return /ebook|e-book|epub|kindle|online course|mini course|video course|cohort|digital book/.test(text);
          if (type === 'guide') return /guide|cheat sheet|tutorial|prompt|checklist|playbook|sop/.test(text);
          if (type === 'automation') return /automation|zapier|make|n8n|webhook|cron|workflow|auto/.test(text);
          return true;
        });
      }

      return filtered;
    }

    function renderGrid(posts) {
      grid.innerHTML = '';
      if (!posts.length) {
        grid.innerHTML = `<div class="reddit-empty"><i class="fa-solid fa-ghost"></i><p>No posts match this filter. Try selecting "All Ideas" or clear the keyword.</p></div>`;
        resultsHdr.classList.add('hidden');
        return;
      }

      resultCount.textContent = `${posts.length} idea${posts.length !== 1 ? 's' : ''} found`;
      resultsHdr.classList.remove('hidden');

      posts.forEach(post => {
        const score    = post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score;
        const comments = post.num_comments >= 1000 ? `${(post.num_comments / 1000).toFixed(1)}k` : post.num_comments;
        
        let flairClass = 'reddit-flair';
        let flairIcon = '<i class="fa-brands fa-reddit-alien"></i>';
        let buttonLabel = '<i class="fa-solid fa-external-link-alt"></i> Open Post';

        if (post.platform === 'hackernews') {
          flairClass = 'reddit-flair hn-flair';
          flairIcon = '<i class="fa-brands fa-y-combinator"></i>';
        } else if (post.platform === 'github') {
          flairClass = 'reddit-flair github-flair';
          flairIcon = '<i class="fa-brands fa-github"></i>';
        } else if (post.platform === 'devto') {
          flairClass = 'reddit-flair devto-flair';
          flairIcon = '<i class="fa-brands fa-dev"></i>';
        } else if (post.platform === 'stackoverflow') {
          flairClass = 'reddit-flair so-flair';
          flairIcon = '<i class="fa-brands fa-stack-overflow"></i>';
        }

        const ai = geminiMap[post.id] || {
          score: 4,
          isLocalEstimate: true,
          category_label: 'Micro-Product',
          price_idea: null,
          product_name: post.title,
          idea: 'Run "Analyse with Gemini" to get a full product blueprint and execution roadmap for this idea.',
          target_customer: null,
          fulfillment: null
        };

        // Badge label: show "est." when local heuristic, real score when Gemini has analysed
        const demandBadge = ai.isLocalEstimate
          ? `<div class="gemini-badge score-${Math.min(Math.round(ai.score / 2), 5)}" title="Estimated from community upvotes & replies — not AI rated yet">
               <i class="fa-solid fa-chart-bar"></i> ~${ai.score}/10 Signal
             </div>`
          : `<div class="gemini-badge score-${Math.min(Math.round(ai.score / 2), 5)}" title="Rated by Gemini AI">
               <i class="fa-solid fa-wand-magic-sparkles"></i> ${ai.score}/10 AI Score
             </div>`;

        // Build fulfillment steps HTML (only when Gemini has returned them)
        const fulfillmentHTML = (Array.isArray(ai.fulfillment) && ai.fulfillment.length)
          ? `<div class="fulfillment-box">
               <span class="community-proof-label"><i class="fa-solid fa-rocket"></i> 5-Step Build & Ship Roadmap</span>
               <ol class="fulfillment-steps">
                 ${ai.fulfillment.map(step => `<li>${step}</li>`).join('')}
               </ol>
             </div>`
          : '';

        const targetHTML = ai.target_customer
          ? `<div class="target-customer-tag"><i class="fa-solid fa-crosshairs"></i> <strong>For:</strong> ${ai.target_customer}</div>`
          : '';

        const hookHTML = ai.emotional_trigger
          ? `<div class="emotional-hook-box"><i class="fa-solid fa-heart-pulse"></i> <strong>Trigger:</strong> ${ai.emotional_trigger}</div>`
          : '';

        const card = document.createElement('div');
        card.className = 'reddit-card';
        card.dataset.postId = post.id;
        card.innerHTML = `
          <!-- Top Ribbon -->
          <div class="reddit-card-top">
            <div class="idea-badge-group">
              <span class="format-badge">${ai.category_label || 'Micro-Product'}</span>
              ${ai.price_idea ? `<span class="price-tag"><i class="fa-solid fa-tag"></i> ${ai.price_idea}</span>` : ''}
            </div>
            ${demandBadge}
          </div>

          <!-- Product Opportunity Name -->
          <h4 class="reddit-card-title">
            ${ai.product_name || post.title}
          </h4>

          <!-- Actionable Value Proposition Box -->
          <div class="gemini-idea">
            <div class="gemini-idea-text">
              <span>${ai.idea}</span>
            </div>
          </div>

          ${hookHTML}
          ${targetHTML}
          ${fulfillmentHTML}

          <!-- Community Validation Quote -->
          <div class="community-proof-box">
            <span class="community-proof-label"><i class="fa-solid fa-quote-left"></i> Verified Community Pain Point</span>
            <p class="reddit-card-body">"${post.title}"</p>
          </div>

          <!-- Meta Row -->
          <div class="reddit-card-meta-row">
            <span class="${flairClass}">${flairIcon} ${post.link_flair_text || post.platform}</span>
            <div class="reddit-card-meta">
              <span><i class="fa-solid fa-arrow-up"></i> ${score}</span>
              <span><i class="fa-regular fa-comment"></i> ${comments}</span>
              <span><i class="fa-solid fa-user"></i> ${post.author}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="reddit-card-actions">
            <button class="btn-plan-idea" data-post-id="${post.id}">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Plan with AI
            </button>
            <a href="${post.fullUrl}" target="_blank" rel="noopener noreferrer">
              ${buttonLabel}
            </a>
            <button class="btn-copy-idea" data-text="${encodeURIComponent(ai.idea || post.title)}">
              <i class="fa-regular fa-copy"></i> Copy Concept
            </button>
          </div>
        `;

        card.querySelector('.btn-copy-idea').addEventListener('click', function () {
          navigator.clipboard.writeText(decodeURIComponent(this.dataset.text));
          this.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => { this.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Concept'; }, 1800);
        });

        card.querySelector('.btn-plan-idea').addEventListener('click', function () {
          openDeepPlanModal(post);
        });

        grid.appendChild(card);
      });
    }

    // --- Deep Idea Planner Modal Logic ---
    const planModal = document.getElementById('idea-plan-modal');
    const planModalTitle = document.getElementById('plan-modal-title');
    const planModalBody = document.getElementById('plan-modal-body');
    const btnClosePlanModal = document.getElementById('btn-close-plan-modal');
    const btnCopyFullPlan = document.getElementById('btn-copy-full-plan');
    const btnDownloadPlanMd = document.getElementById('btn-download-plan-md');
    let currentRawPlanMarkdown = '';
    let currentPlanIdeaTitle = '';

    if (btnClosePlanModal) {
      btnClosePlanModal.addEventListener('click', () => {
        planModal.classList.add('hidden');
      });
    }

    if (planModal) {
      planModal.addEventListener('click', (e) => {
        if (e.target === planModal) planModal.classList.add('hidden');
      });
    }

    if (btnCopyFullPlan) {
      btnCopyFullPlan.addEventListener('click', () => {
        if (!currentRawPlanMarkdown) return;
        navigator.clipboard.writeText(currentRawPlanMarkdown);
        btnCopyFullPlan.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          btnCopyFullPlan.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Blueprint';
        }, 1800);
      });
    }

    if (btnDownloadPlanMd) {
      btnDownloadPlanMd.addEventListener('click', () => {
        if (!currentRawPlanMarkdown) return;
        const blob = new Blob([currentRawPlanMarkdown], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const safeName = (currentPlanIdeaTitle || 'product_blueprint').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${safeName}_build_plan.md`;
        a.click();
      });
    }

    async function openDeepPlanModal(post) {
      const apiKey = getApiKey();
      if (!apiKey) {
        alert('Please add your Gemini API key in config.js or click "Analyse with Gemini" to set it.');
        return;
      }

      const ai = geminiMap[post.id] || {};
      const prodName = ai.product_name || post.title;
      currentPlanIdeaTitle = prodName;
      planModalTitle.textContent = prodName;
      planModalBody.innerHTML = `
        <div style="text-align:center; padding: 40px 20px;">
          <i class="fa-solid fa-wand-magic-sparkles fa-spin" style="font-size: 32px; color: #818cf8; margin-bottom: 16px;"></i>
          <h4 style="color:#f8fafc; font-size:16px; margin:0 0 8px;">Mining Community Comments & Refining Problem...</h4>
          <p style="color:#94a3b8; font-size:13px; margin:0;">Fetching live community replies, analyzing real user frustrations, and architecting the tailored digital product solution.</p>
        </div>
      `;
      if (planModal) planModal.classList.remove('hidden');

      // Reset tabs to Blueprint
      const modalTabs = document.querySelectorAll('.modal-tab');
      const modalTabViews = document.querySelectorAll('.modal-tab-view');
      modalTabs.forEach(t => t.classList.remove('active'));
      modalTabViews.forEach(v => v.classList.remove('active'));
      const defaultTab = document.querySelector('.modal-tab[data-tab="blueprint"]');
      const defaultView = document.getElementById('modal-tab-blueprint');
      if (defaultTab) defaultTab.classList.add('active');
      if (defaultView) defaultView.classList.add('active');

      activePlanContext = {
        post: post,
        planMarkdown: '',
        chatHistory: []
      };
      if (planChatMessagesEl) {
        planChatMessagesEl.innerHTML = `
          <div class="chat-msg chat-msg-ai">
            <div class="chat-bubble">I have analyzed this problem and drafted your execution plan. How can I help you refine this? You can click any 1-click prompt above or type your own question!</div>
          </div>
        `;
      }
      if (planChatInputEl) planChatInputEl.value = '';

      // 1. Fetch live comment tree for this post based on platform
      let extractedComments = [];
      try {
        if (post.platform === 'hackernews') {
          const hnId = post.id.replace('hn_', '');
          const r = await fetch(`https://hn.algolia.com/api/v1/items/${hnId}`, { signal: AbortSignal.timeout(4000) });
          if (r.ok) {
            const data = await r.json();
            extractedComments = (data.children || []).slice(0, 7).map(c => (c.text || '').replace(/<[^>]*>?/gm, ' ').slice(0, 240).trim()).filter(Boolean);
          }
        } else if (post.platform === 'devto') {
          const devId = post.id.replace('dev_', '');
          const r = await fetch(`https://dev.to/api/comments?a_id=${devId}`, { signal: AbortSignal.timeout(4000) });
          if (r.ok) {
            const data = await r.json();
            extractedComments = (Array.isArray(data) ? data : []).slice(0, 7).map(c => (c.body_html || '').replace(/<[^>]*>?/gm, ' ').slice(0, 240).trim()).filter(Boolean);
          }
        } else if (post.platform === 'stackoverflow') {
          const soId = post.id.replace('so_', '');
          const r = await fetch(`https://api.stackexchange.com/2.3/questions/${soId}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=5`, { signal: AbortSignal.timeout(4000) });
          if (r.ok) {
            const data = await r.json();
            extractedComments = (data.items || []).map(a => (a.body || '').replace(/<[^>]*>?/gm, ' ').slice(0, 240).trim()).filter(Boolean);
          }
        }
      } catch (_) {
        // Gracefully continue with available post context if comments timeout
      }

      const commentsBlock = extractedComments.length > 0
        ? extractedComments.map((c, i) => `[Comment ${i + 1}]: "${c}"`).join('\n')
        : 'No direct replies available. Analyze the core post context and surrounding domain problems.';

      const planPrompt = `You are a world-class consumer psychologist, direct-response copywriter, and indie product architect. Your superpower is decoding the DEEP UNCONSCIOUS EMOTIONAL DRIVERS behind community complaints and translating them into high-converting $19–$39 impulse-buy digital products with irresistible viral hooks.

YOUR MISSION:
1. DECODE THE BUYER'S EMOTIONAL STATE:
   Analyze the original post AND the community comments below. Identify what they are terrified of, exhausted by, or desperately craving (status, relief, speed, peace of mind).

2. REFINE THE TRUE PROBLEM STATEMENT:
   State the exact core frustration that creates instant buying urgency.

3. ARCHITECT THE "INSTANT RELIEF" SOLUTION:
   Design a specific digital product (${ai.category_label || 'Digital Product'}) that delivers immediate satisfaction in under 5 minutes after purchase.

4. CRAFT VIRAL IMPULSE COPY:
   Write high-converting, emotion-driven headlines and community launch hooks.

THREAD DETAILS:
- Platform: ${post.platform.toUpperCase()}
- Original Post Title: "${post.title}"
- Original Post Context: "${(post.selftext || '').slice(0, 350)}"
- Format Filter: ${ai.category_label || 'Digital Product'}
- Target Price: ${ai.price_idea || '$29'}

LIVE COMMUNITY COMMENTS EXTRACTED FROM THREAD:
${commentsBlock}

FORMAT YOUR RESPONSE IN CLEAN GITHUB MARKDOWN WITHOUT ANY EMOJIS OR STICKERS WITH THESE EXACT SECTIONS:

# 1. Buyer Psychology and Emotional Diagnosis
- **The Acute Frustration / Anxiety:** [What makes them stressed, angry, or exhausted right now]
- **The Secret Emotional Desire:** [What feeling or identity they are desperately craving — e.g. feeling like a pro, getting weekends back, zero client friction]
- **The Impulse Buy Trigger:** [Why someone will buy this in 10 seconds without thinking twice]

# 2. The 3-Second Viral Impulse Hook
- **Scroll-Stopping Headline:** [High-converting viral headline for Gumroad / Twitter / Landing Page]
- **Sub-Hook & Value Promise:** [1 sentence punchy hook promising instant relief in under 5 minutes]
- **The Emotional Reframe:** [How this turns a painful chore into a 1-click victory]

# 3. Before vs After Transformation Matrix
- **Before (The Painful Reality):** [Detailed picture of their chaotic, stressful, manual routine]
- **After (The Relieved State):** [Detailed picture of how fast, calm, and automated their life becomes after buying]

# 4. MVP Feature Scope (Value Delivered in Under 5 Minutes)
- **Core Instant-Win Feature 1:** [Direct relief feature]
- **Core Instant-Win Feature 2:** [Direct relief feature]
- **Core Instant-Win Feature 3:** [Direct relief feature]
- **Non-Goals (DO NOT build in V1):** [What to cut so you can launch in 48 hours]

# 5. Recommended Tech Stack (Fastest Path to Ship)
- **No-Code / Low-Code Path:** [Tools to build with zero code, e.g. Bubble, Make, Notion, Airtable]
- **Full-Code Path:** [Lightweight modern stack, e.g. Next.js, Supabase, Tailwind, Stripe]
- **Hosting & Database:** [Free / low-cost tier recommendation]

# 6. Frictionless Impulse Pricing Strategy
- **Recommended Price Point:** [e.g. $19, $27, or $37 one-off impulse pricing]
- **Checkout & Instant Delivery:** [Gumroad, Lemon Squeezy, or Stripe Checkout setup]
- **No-Brainer Offer Upsell:** [Templates, VIP prompts, or pro scripts pack]

# 7. Emotional Launch Script for Communities
- **Target Infiltration Channels:** [Exact subreddits, Discord servers, and forums where this target audience hangs out]
- **High-Converting Launch Hook:** [A proven 2-sentence hook you can post in this exact community to get early buyers without sounding like spam]
- **Cold Outreach Strategy:** [Where to find the first 10 paying customers]

# 8. Step-by-Step 7-Day Fast-Track Build Schedule
- **Day 1: Setup & Data Model:** [What to do]
- **Day 2-3: Core Feature Implementation:** [What to do]
- **Day 4: Landing Page & Checkout:** [What to do]
- **Day 5: Testing & Polish:** [What to do]
- **Day 6: Soft Launch to Warm Leads:** [What to do]
- **Day 7: Public Launch on Product Hunt & Communities:** [What to do]`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: planPrompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
            })
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API error ${res.status}`);
        }

        const data = await res.json();
        const rawMarkdown = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        currentRawPlanMarkdown = rawMarkdown;

        // Render Markdown into styled HTML cards
        const renderedHTML = rawMarkdown
          .replace(/^# (.+)$/gm, '<h3 style="color:#f8fafc;font-size:16px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;margin:20px 0 10px;display:flex;align-items:center;gap:8px;">$1</h3>')
          .replace(/^## (.+)$/gm, '<h4 style="color:#a5b4fc;font-size:14px;margin:14px 0 6px;">$1</h4>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/^- (.+)$/gm, '<li style="margin-bottom:6px;line-height:1.6;">$1</li>')
          .replace(/\n\n/g, '<br>')
          .replace(/<li>/g, '<ul style="margin:4px 0 8px 18px;padding:0;"><li>')
          .replace(/<\/li>/g, '</li></ul>');

        planModalBody.innerHTML = `
          <div class="plan-rendered-content" style="display:flex;flex-direction:column;gap:12px;">
            ${renderedHTML}
          </div>
        `;

        if (activePlanContext) {
          activePlanContext.planMarkdown = rawMarkdown;
        }
      } catch (err) {
        const isQuota = (err.message || '').includes('429') || (err.message || '').toLowerCase().includes('quota') || (err.message || '').toLowerCase().includes('resource');
        if (isQuota) {
          planModalBody.innerHTML = `
            <div class="reddit-error" style="padding:28px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
              <i class="fa-solid fa-hourglass-half" style="font-size:32px; color:#f59e0b;"></i>
              <h4 style="color:#f8fafc; font-size:16px; margin:0;">Gemini Rate Limit (Quota Exceeded)</h4>
              <p style="color:#94a3b8; font-size:13px; max-width:480px; margin:0; line-height:1.6;">
                Google Gemini free tier limits requests per minute. You can either <strong>wait 30–60 seconds</strong> for it to reset automatically, or click below to enter a new API key.
              </p>
              <div style="display:flex; gap:10px; margin-top:8px;">
                <button id="btn-retry-plan-modal" class="btn-secondary btn-sm"><i class="fa-solid fa-rotate-right"></i> Retry in 30s</button>
                <button id="btn-update-key-plan" class="btn-primary btn-sm"><i class="fa-solid fa-key"></i> Enter New Key</button>
              </div>
            </div>
          `;
          const btnRetry = document.getElementById('btn-retry-plan-modal');
          const btnNewKey = document.getElementById('btn-update-key-plan');
          if (btnRetry) btnRetry.addEventListener('click', () => openDeepPlanModal(post));
          if (btnNewKey) {
            btnNewKey.addEventListener('click', () => {
              const newKey = prompt('Enter your new Gemini API Key:');
              if (newKey && newKey.trim()) {
                localStorage.setItem(STORAGE_KEY, newKey.trim());
                openDeepPlanModal(post);
              }
            });
          }
        } else {
          planModalBody.innerHTML = `
            <div class="reddit-error" style="padding:20px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <p>Failed to generate execution plan: ${err.message}</p>
            </div>
          `;
        }
      }
    }

    // --- Interactive AI Co-Pilot Chat Inside Blueprint Modal ---
    let activePlanContext = { post: null, planMarkdown: '', chatHistory: [] };
    const planChatMessagesEl = document.getElementById('plan-chat-messages');
    const planChatInputEl = document.getElementById('plan-chat-input');
    const btnSendPlanChat = document.getElementById('btn-send-plan-chat');

    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    async function handleSendPlanChat() {
      if (!planChatInputEl || !planChatMessagesEl) return;
      const text = (planChatInputEl.value || '').trim();
      if (!text) return;
      const apiKey = getApiKey();
      if (!apiKey) {
        alert('Gemini API key is required to chat with AI.');
        return;
      }

      // Append user message
      planChatInputEl.value = '';
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg chat-msg-user';
      userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
      planChatMessagesEl.appendChild(userMsg);

      // Append typing indicator
      const typingMsg = document.createElement('div');
      typingMsg.className = 'chat-msg chat-msg-ai';
      typingMsg.id = 'plan-chat-typing';
      typingMsg.innerHTML = `<div class="chat-bubble"><i class="fa-solid fa-spinner fa-spin"></i> Strategizing...</div>`;
      planChatMessagesEl.appendChild(typingMsg);
      planChatMessagesEl.scrollTop = planChatMessagesEl.scrollHeight;

      // Add to history
      activePlanContext.chatHistory.push({ role: 'user', content: text });

      const postContext = activePlanContext.post
        ? `Original Problem: "${activePlanContext.post.title}" (${activePlanContext.post.platform})\nBlueprint Summary: ${(activePlanContext.planMarkdown || '').slice(0, 1400)}`
        : 'Digital Product Strategy';

      const promptText = `You are an elite digital product co-pilot, copywriter, and software architect assisting a founder.

CONTEXT OF THE DIGITAL PRODUCT:
${postContext}

CHAT HISTORY:
${activePlanContext.chatHistory.map(m => `${m.role === 'user' ? 'Founder' : 'AI'}: ${m.content}`).join('\n')}

FOUNDER'S LATEST QUESTION / REQUEST:
${text}

Provide an actionable, high-converting response. Deliver exact copy, database schemas, Notion property tables, pricing breakdown, or code scripts as requested. Keep your response clean, direct, and without any emojis or stickers.`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
            })
          }
        );

        typingMsg.remove();

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data = await res.json();
        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, could not generate a response.';
        activePlanContext.chatHistory.push({ role: 'model', content: aiReply });

        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg chat-msg-ai';
        const formattedReply = aiReply
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>');
        aiMsg.innerHTML = `<div class="chat-bubble">${formattedReply}</div>`;
        planChatMessagesEl.appendChild(aiMsg);
        planChatMessagesEl.scrollTop = planChatMessagesEl.scrollHeight;
      } catch (err) {
        typingMsg.remove();
        const errEl = document.createElement('div');
        errEl.className = 'chat-msg chat-msg-ai';
        errEl.innerHTML = `<div class="chat-bubble" style="color:#f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${err.message}</div>`;
        planChatMessagesEl.appendChild(errEl);
        planChatMessagesEl.scrollTop = planChatMessagesEl.scrollHeight;
      }
    }

    if (btnSendPlanChat && planChatInputEl) {
      btnSendPlanChat.addEventListener('click', handleSendPlanChat);
      planChatInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSendPlanChat();
        }
      });
    }

    // Modal Tab Navigation
    const modalTabs = document.querySelectorAll('.modal-tab');
    const modalTabViews = document.querySelectorAll('.modal-tab-view');
    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        modalTabs.forEach(t => t.classList.remove('active'));
        modalTabViews.forEach(v => v.classList.remove('active'));
        tab.classList.add('active');
        const viewEl = document.getElementById(`modal-tab-${target}`);
        if (viewEl) viewEl.classList.add('active');
      });
    });

    // Quick Prompt Action Chips
    const quickChips = document.querySelectorAll('.quick-chip');
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const promptText = chip.dataset.prompt;
        if (planChatInputEl && promptText) {
          planChatInputEl.value = promptText;
          handleSendPlanChat();
        }
      });
    });

    // --- Export CSV (includes Platform, Format, Price, Gemini score + idea) ---
    btnCsv.addEventListener('click', () => {
      const visible = filterPosts(allPosts, activeKw, activeType, activePlatform);
      if (!visible.length) return;
      const header = ['Platform', 'Format/Type', 'Suggested Price', 'Product Concept', 'Original Community Title', 'Upvotes/Points', 'Comments', 'Author', 'Demand Score', 'AI Blueprint', 'URL'];
      const rows   = visible.map(p => {
        const ai = geminiMap[p.id] || {};
        let platName = 'Reddit';
        if (p.platform === 'github') platName = 'GitHub';
        else if (p.platform === 'hackernews') platName = 'Hacker News';

        return [
          `"${platName}"`,
          `"${ai.category_label || ai.category || ''}"`,
          `"${ai.price_idea || ''}"`,
          `"${(ai.product_name || p.title || '').replace(/"/g, '""')}"`,
          `"${(p.title || '').replace(/"/g, '""')}"`,
          p.score,
          p.num_comments,
          `"${p.author}"`,
          ai.score ?? '',
          `"${(ai.idea || '').replace(/"/g, '""')}"`,
          `"${p.fullUrl}"`
        ];
      });
      const csv  = [header, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      const nichePrefix = nicheEl ? nicheEl.value : 'all';
      a.download = `ideas_${nichePrefix}_${activePlatform}_${activeType}_${Date.now()}.csv`;
      a.click();
    });
  })();

});
