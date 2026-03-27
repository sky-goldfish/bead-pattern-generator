/**
 * 拼豆图纸生成器 - 主逻辑
 */

(function () {
  'use strict';

  // ========== 初始化模块 ==========
  const pixelEngine = new PixelationEngine();
  const colorMatcher = new ColorMatcher();
  const renderer = new BeadRenderer();

  // ========== DOM 元素 ==========
  const $ = (sel) => document.querySelector(sel);
  const uploadArea = $('#uploadArea');
  const fileInput = $('#fileInput');
  const previewContainer = $('#previewContainer');
  const originalPreview = $('#originalPreview');
  const imageSize = $('#imageSize');
  const imageDimensions = $('#imageDimensions');
  const gridWidthInput = $('#gridWidth');
  const gridHeightInput = $('#gridHeight');
  const keepRatioCheckbox = $('#keepRatio');
  const showGridLinesCheckbox = $('#showGridLines');
  const showColorCodesCheckbox = $('#showColorCodes');
  const generateBtn = $('#generateBtn');
  const progressOverlay = $('#progressOverlay');
  const progressText = $('#progressText');
  const emptyState = $('#emptyState');
  const resultContent = $('#resultContent');
  const patternCanvas = $('#patternCanvas');
  const colorList = $('#colorList');
  const statWidth = $('#statWidth');
  const statHeight = $('#statHeight');
  const statColors = $('#statColors');

  // 新增：颜色限制
  const limitColorsCheckbox = $('#limitColors');
  const maxColorGroup = $('#maxColorGroup');
  const maxColorsInput = $('#maxColors');

  // 新增：背景处理
  const removeBgCheckbox = $('#removeBg');
  const bgOptions = $('#bgOptions');
  const autoDetectBgBtn = $('#autoDetectBg');
  const bgColorPicker = $('#bgColorPicker');
  const bgPreview = $('#bgPreview');
  const bgSwatch = $('#bgSwatch');
  const bgHexLabel = $('#bgHex');
  const bgThresholdSlider = $('#bgThreshold');
  const thresholdValueLabel = $('#thresholdValue');
  const bgReplacementSelect = $('#bgReplacement');

  // 新增：品牌选择 & 系列筛选
  const mardSeriesSection = $('#mardSeriesSection');
  const seriesGrid = $('#seriesGrid');
  const colorCountLabel = $('#colorCountLabel');

  // 新增：边缘锐化
  const sharpenEnabledCheckbox = $('#sharpenEnabled');
  const sharpenOptionsDiv = $('#sharpenOptions');
  const sharpenStrengthSlider = $('#sharpenStrength');
  const sharpenValueLabel = $('#sharpenValue');

  // ========== 状态 ==========
  let currentImage = null;    // 当前加载的图片
  let matchedColors = null;   // 当前匹配结果
  let colorStats = null;      // 当前颜色统计
  let resultWidth = 0;        // 结果网格宽度
  let resultHeight = 0;       // 结果网格高度
  let detectedBgColor = null; // 检测到的背景色
  let pixelDataCache = null;  // 缓存像素数据用于背景检测

  // ========== 事件绑定 ==========

  // 上传区域点击
  uploadArea.addEventListener('click', () => fileInput.click());

  // 文件选择
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  // 拖拽
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // 保持宽高比
  keepRatioCheckbox.addEventListener('change', () => {
    if (keepRatioCheckbox.checked && currentImage) {
      const ratio = currentImage.naturalWidth / currentImage.naturalHeight;
      gridHeightInput.value = Math.round(gridWidthInput.value / ratio);
    }
  });

  gridWidthInput.addEventListener('input', () => {
    if (keepRatioCheckbox.checked && currentImage) {
      const ratio = currentImage.naturalWidth / currentImage.naturalHeight;
      gridHeightInput.value = Math.round(parseInt(gridWidthInput.value) / ratio) || 1;
    }
  });

  // 颜色限制开关
  limitColorsCheckbox.addEventListener('change', () => {
    if (limitColorsCheckbox.checked) {
      maxColorGroup.classList.add('enabled');
      maxColorGroup.style.opacity = '1';
      maxColorGroup.style.pointerEvents = 'auto';
    } else {
      maxColorGroup.classList.remove('enabled');
      maxColorGroup.style.opacity = '0.4';
      maxColorGroup.style.pointerEvents = 'none';
    }
  });

  // ========== 初始化：生成系列复选框 ==========
  function initSeriesGrid() {
    seriesGrid.innerHTML = MARD_SERIES.map(series => {
      const count = getMardSeriesCount(series.id);
      return `
        <label class="series-checkbox">
          <input type="checkbox" data-series="${series.id}">
          <span class="series-color" style="background: ${series.color}"></span>
          <span class="series-name" title="${series.name}">${series.id}</span>
          <span class="series-count">${count}</span>
        </label>
      `;
    }).join('');
  }
  initSeriesGrid();

  // 更新颜色计数显示
  function updateColorCount() {
    colorCountLabel.textContent = colorMatcher.getColorCount();
  }

  // ========== 品牌切换事件 ==========
  document.querySelectorAll('.brand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新按钮状态
      document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const brandId = btn.dataset.brand;
      colorMatcher.setBrand(brandId);

      // 显示/隐藏 MARD 系列筛选区域
      mardSeriesSection.style.display = (brandId === 'MARD') ? 'block' : 'none';

      updateColorCount();
    });
  });

  // ========== 系列筛选事件 ==========
  function collectSelectedSeries() {
    const checked = seriesGrid.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      colorMatcher.setSeriesFilter(null); // 全部
    } else {
      const ids = Array.from(checked).map(cb => cb.dataset.series);
      colorMatcher.setSeriesFilter(ids);
    }
    updateColorCount();
  }

  seriesGrid.addEventListener('change', collectSelectedSeries);

  // 全选/全不选按钮
  $('#selectAllSeries').addEventListener('click', () => {
    seriesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    collectSelectedSeries();
  });

  $('#deselectAllSeries').addEventListener('click', () => {
    seriesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    collectSelectedSeries();
  });

  // 颜色预设按钮（仅对 maxColors 有效）
  document.querySelectorAll('.color-presets .preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      maxColorsInput.value = btn.dataset.value;
    });
  });

  // 背景处理开关
  removeBgCheckbox.addEventListener('change', () => {
    if (removeBgCheckbox.checked) {
      bgOptions.style.display = 'flex';
    } else {
      bgOptions.style.display = 'none';
    }
  });

  // 自动检测背景
  autoDetectBgBtn.addEventListener('click', () => {
    if (!currentImage) {
      alert('请先上传图片');
      return;
    }
    detectBackground();
  });

  // 手动选择背景色
  bgColorPicker.addEventListener('input', () => {
    const hex = bgColorPicker.value;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    detectedBgColor = { r, g, b };
    updateBgPreview(r, g, b, hex);
  });

  // 阈值滑块
  bgThresholdSlider.addEventListener('input', () => {
    thresholdValueLabel.textContent = bgThresholdSlider.value;
  });

  // 边缘锐化开关
  sharpenEnabledCheckbox.addEventListener('change', () => {
    if (sharpenEnabledCheckbox.checked) {
      sharpenOptionsDiv.style.display = 'block';
    } else {
      sharpenOptionsDiv.style.display = 'none';
    }
  });

  // 锐化强度滑块
  sharpenStrengthSlider.addEventListener('input', () => {
    sharpenValueLabel.textContent = sharpenStrengthSlider.value;
  });

  // 生成按钮
  generateBtn.addEventListener('click', generate);

  // 标签切换
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      $(`#tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // 导出按钮
  $('#downloadPng').addEventListener('click', () => {
    const fullCanvas = renderer.renderFullPage({
      matchedColors,
      width: resultWidth,
      height: resultHeight,
      cellSize: 15,
      showGridLines: showGridLinesCheckbox.checked,
      showColorCodes: showColorCodesCheckbox.checked,
      title: '拼豆图纸',
      colorStats,
    });
    ExportManager.downloadPNG(fullCanvas, '拼豆图纸.png');
  });

  $('#downloadTxt').addEventListener('click', () => {
    if (colorStats) {
      const brandName = colorMatcher.getBrand() === 'MARD' ? 'MARD' : 'Perler';
      ExportManager.downloadColorList(colorStats, '拼豆颜色清单.txt', brandName);
    }
  });

  $('#printBtn').addEventListener('click', () => {
    const fullCanvas = renderer.renderFullPage({
      matchedColors,
      width: resultWidth,
      height: resultHeight,
      cellSize: 15,
      showGridLines: showGridLinesCheckbox.checked,
      showColorCodes: showColorCodesCheckbox.checked,
      title: '拼豆图纸',
      colorStats,
    });
    ExportManager.print(fullCanvas);
  });

  // ========== 核心函数 ==========

  /**
   * 处理文件上传
   */
  async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPG/PNG/WEBP)');
      return;
    }

    showProgress('正在加载图片...');

    try {
      currentImage = await pixelEngine.loadImage(file);

      // 显示预览
      originalPreview.src = currentImage.src;
      imageSize.textContent = formatFileSize(file.size);
      imageDimensions.textContent = `${currentImage.naturalWidth} × ${currentImage.naturalHeight}`;
      previewContainer.classList.add('show');

      // 智能推荐网格大小
      const recommended = pixelEngine.recommendGridSize(currentImage);
      gridWidthInput.value = recommended.width;
      gridHeightInput.value = recommended.height;

      // 重置背景检测结果
      detectedBgColor = null;
      pixelDataCache = null;

      generateBtn.disabled = false;
      hideProgress();
    } catch (err) {
      hideProgress();
      alert('图片加载失败，请重试');
      console.error(err);
    }
  }

  /**
   * 自动检测背景色
   */
  function detectBackground() {
    if (!currentImage) return;

    // 先做一次小尺寸像素化来获取像素数据
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    const detectW = Math.min(currentImage.naturalWidth, 100);
    const detectH = Math.round(detectW / (currentImage.naturalWidth / currentImage.naturalHeight));
    tmpCanvas.width = detectW;
    tmpCanvas.height = detectH;
    tmpCtx.drawImage(currentImage, 0, 0, detectW, detectH);
    const data = tmpCtx.getImageData(0, 0, detectW, detectH).data;

    detectedBgColor = BackgroundProcessor.detectBackground(data, detectW, detectH);
    const hex = rgbToHex(detectedBgColor.r, detectedBgColor.g, detectedBgColor.b);
    updateBgPreview(detectedBgColor.r, detectedBgColor.g, detectedBgColor.b, hex);
  }

  /**
   * 更新背景预览
   */
  function updateBgPreview(r, g, b, hex) {
    bgSwatch.style.background = hex;
    bgHexLabel.textContent = `${hex.toUpperCase()}  (RGB: ${r}, ${g}, ${b})`;
    bgPreview.style.display = 'flex';
  }

  /**
   * 生成拼豆图纸
   */
  async function generate() {
    if (!currentImage) return;

    const width = Math.max(1, Math.min(200, parseInt(gridWidthInput.value) || 50));
    const height = Math.max(1, Math.min(200, parseInt(gridHeightInput.value) || 50));

    showProgress('正在像素化处理...');
    await sleep(50);

    try {
      // 1. 像素化
      progressText.textContent = '正在像素化处理...';
      const sharpness = sharpenEnabledCheckbox.checked ? (parseInt(sharpenStrengthSlider.value) || 50) : 0;
      if (sharpness > 0) progressText.textContent = '正在像素化并锐化边缘...';
      const { pixelData, width: pw, height: ph } = pixelEngine.pixelate(
        currentImage, width, height, keepRatioCheckbox.checked, sharpness
      );
      resultWidth = pw;
      resultHeight = ph;
      await sleep(50);

      // 2. 背景处理（如果启用）
      let processedData = pixelData;
      if (removeBgCheckbox.checked && detectedBgColor) {
        progressText.textContent = '正在处理背景...';
        const threshold = parseInt(bgThresholdSlider.value) || 15;
        const replacement = bgReplacementSelect.value;
        processedData = BackgroundProcessor.processBackground(
          pixelData, detectedBgColor, threshold, replacement
        );
        await sleep(50);
      }

      // 3. 颜色匹配（可选 K-Means 限制）
      // 获取当前品牌的白色/透明占位色号
      const brand = BRANDS[colorMatcher.getBrand()];
      const whiteCode = colorMatcher.getBrand() === 'MARD' ? 'H1' : 'P01';
      const whiteMatch = { code: whiteCode, hex: '#ffffff', r: 255, g: 255, b: 255, distance: 0, isBg: true };

      if (limitColorsCheckbox.checked) {
        progressText.textContent = '正在聚类合并颜色...';
        const maxColors = Math.max(5, Math.min(30, parseInt(maxColorsInput.value) || 12));

        // 提取所有像素 RGB
        const allColors = [];
        for (let i = 0; i < processedData.length; i += 4) {
          if (processedData[i + 3] === 0) continue; // 跳过透明像素
          allColors.push({ r: processedData[i], g: processedData[i + 1], b: processedData[i + 2] });
        }

        // K-Means 聚类
        const centers = ColorQuantizer.kmeans(allColors, maxColors);

        // 用聚类中心替换后，再匹配色号
        matchedColors = [];
        for (let i = 0; i < processedData.length; i += 4) {
          if (processedData[i + 3] === 0) {
            matchedColors.push(whiteMatch);
            continue;
          }
          const original = { r: processedData[i], g: processedData[i + 1], b: processedData[i + 2] };
          const quantized = ColorQuantizer.quantize(original, centers);
          matchedColors.push(colorMatcher.findClosest(quantized.r, quantized.g, quantized.b));
        }
      } else {
        const brandName = colorMatcher.getBrand() === 'MARD' ? 'MARD' : 'Perler';
        progressText.textContent = `正在匹配 ${brandName} 色号...`;
        matchedColors = [];
        for (let i = 0; i < processedData.length; i += 4) {
          if (processedData[i + 3] === 0) {
            matchedColors.push(whiteMatch);
            continue;
          }
          matchedColors.push(colorMatcher.findClosest(processedData[i], processedData[i + 1], processedData[i + 2]));
        }
      }

      await sleep(50);

      // 4. 统计颜色
      progressText.textContent = '正在统计颜色用量...';
      colorStats = colorMatcher.countColors(matchedColors);
      await sleep(50);

      // 5. 渲染图纸
      progressText.textContent = '正在渲染图纸...';
      const cellSize = Math.max(8, Math.min(20, Math.floor(700 / Math.max(pw, ph))));

      const canvas = renderer.render({
        matchedColors,
        width: pw,
        height: ph,
        cellSize,
        showGridLines: showGridLinesCheckbox.checked,
        showColorCodes: showColorCodesCheckbox.checked,
      });

      patternCanvas.width = canvas.width;
      patternCanvas.height = canvas.height;
      patternCanvas.getContext('2d').drawImage(canvas, 0, 0);

      // 更新统计
      statWidth.textContent = pw;
      statHeight.textContent = ph;
      statColors.textContent = colorStats.length;

      // 更新颜色清单
      renderColorList(colorStats);

      // 显示结果
      emptyState.style.display = 'none';
      resultContent.classList.add('show');
      resultContent.classList.add('fade-in');
      document.querySelector('.tab-btn[data-tab="pattern"]').click();

      hideProgress();
    } catch (err) {
      hideProgress();
      alert('生成失败: ' + err.message);
      console.error(err);
    }
  }

  /**
   * 渲染颜色清单
   */
  function renderColorList(stats) {
    const totalCount = stats.reduce((sum, s) => sum + s.count, 0);
    const maxCount = stats[0]?.count || 1;

    colorList.innerHTML = stats.map((stat) => {
      const pct = ((stat.count / totalCount) * 100).toFixed(1);
      const barWidth = ((stat.count / maxCount) * 100).toFixed(1);
      return `
        <div class="color-item">
          <div class="color-swatch" style="background: ${stat.hex}"></div>
          <div class="color-info">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="color-code">${stat.code}</span>
              <span class="color-count">${stat.count} 颗 · ${pct}%</span>
            </div>
            <div class="color-bar">
              <div class="color-bar-fill" style="width: ${barWidth}%; background: ${stat.hex}"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ========== 工具函数 ==========

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  function showProgress(text) {
    progressText.textContent = text;
    progressOverlay.classList.add('show');
  }

  function hideProgress() {
    progressOverlay.classList.remove('show');
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

})();
