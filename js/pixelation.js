/**
 * 图片像素化处理模块
 * 将上传的图片缩小为指定网格尺寸，并提取每个像素的颜色
 */

class PixelationEngine {
  constructor() {
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * 加载图片文件
   * @param {File} file
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图片加载失败'));
      };
      img.src = url;
    });
  }

  /**
   * 像素化处理核心
   * 通过 Canvas 缩放实现高质量像素化
   * @param {HTMLImageElement} img
   * @param {number} width 目标宽度 (格子数)
   * @param {number} height 目标高度 (格子数)
   * @param {boolean} maintainAspectRatio 是否保持宽高比
   * @returns {{ pixelData: Uint8ClampedArray, width: number, height: number, previewCanvas: HTMLCanvasElement }}
   */
  pixelate(img, width, height, maintainAspectRatio = true) {
    let targetW = width;
    let targetH = height;

    if (maintainAspectRatio) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const gridRatio = targetW / targetH;

      if (imgRatio > gridRatio) {
        // 图片更宽，以宽度为准
        targetH = Math.round(targetW / imgRatio);
      } else {
        // 图片更高，以高度为准
        targetW = Math.round(targetH * imgRatio);
      }
      // 确保最小尺寸
      targetW = Math.max(1, targetW);
      targetH = Math.max(1, targetH);
    }

    // 第一步：将图片绘制到目标小尺寸 (像素化关键步骤)
    this._canvas.width = targetW;
    this._canvas.height = targetH;

    // 使用 imageSmoothingEnabled = true 获得平滑缩放
    this._ctx.imageSmoothingEnabled = true;
    this._ctx.imageSmoothingQuality = 'high';
    this._ctx.drawImage(img, 0, 0, targetW, targetH);

    // 提取像素数据
    const pixelData = this._ctx.getImageData(0, 0, targetW, targetH).data;

    // 创建预览 canvas (放大后的像素化图像)
    const previewCanvas = document.createElement('canvas');
    const previewCtx = previewCanvas.getContext('2d');
    const scale = Math.max(1, Math.floor(512 / Math.max(targetW, targetH)));
    previewCanvas.width = targetW * scale;
    previewCanvas.height = targetH * scale;

    // 关闭平滑，让像素块清晰
    previewCtx.imageSmoothingEnabled = false;
    previewCtx.drawImage(this._canvas, 0, 0, previewCanvas.width, previewCanvas.height);

    return {
      pixelData,
      width: targetW,
      height: targetH,
      previewCanvas,
      originalWidth: img.naturalWidth,
      originalHeight: img.naturalHeight,
    };
  }

  /**
   * 分析图片的颜色分布，用于智能推荐网格大小
   * @param {HTMLImageElement} img
   * @returns {{ width: number, height: number, minPixels: number }}
   */
  recommendGridSize(img) {
    const pixels = img.naturalWidth * img.naturalHeight;

    // 简单规则：总像素越少，格子可以越少
    let recommendedPixels;
    if (pixels < 50000) {
      recommendedPixels = 800;     // 小图 → 小图纸
    } else if (pixels < 200000) {
      recommendedPixels = 1500;    // 中图
    } else if (pixels < 1000000) {
      recommendedPixels = 2500;    // 大图
    } else {
      recommendedPixels = 4000;    // 超大图
    }

    const ratio = img.naturalWidth / img.naturalHeight;
    let w = Math.round(Math.sqrt(recommendedPixels * ratio));
    let h = Math.round(w / ratio);

    // 确保合理范围
    w = Math.max(10, Math.min(200, w));
    h = Math.max(10, Math.min(200, h));

    return { width: w, height: h, totalPixels: w * h };
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PixelationEngine;
}
