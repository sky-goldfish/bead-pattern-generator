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
   * @param {number} sharpness 锐化强度 (0-100, 0=不锐化, 100=最强)
   * @returns {{ pixelData: Uint8ClampedArray, width: number, height: number, previewCanvas: HTMLCanvasElement }}
   */
  pixelate(img, width, height, maintainAspectRatio = true, sharpness = 0) {
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
    let pixelData = this._ctx.getImageData(0, 0, targetW, targetH).data;

    // 第二步：边缘锐化（Unsharp Mask）
    if (sharpness > 0) {
      pixelData = this.sharpen(pixelData, targetW, targetH, sharpness);
    }

    // 创建预览 canvas (放大后的像素化图像)
    const previewCanvas = document.createElement('canvas');
    const previewCtx = previewCanvas.getContext('2d');
    const scale = Math.max(1, Math.floor(512 / Math.max(targetW, targetH)));
    previewCanvas.width = targetW * scale;
    previewCanvas.height = targetH * scale;

    // 将处理后的像素数据写回 canvas
    const imgData = new ImageData(new Uint8ClampedArray(pixelData), targetW, targetH);
    this._canvas.width = targetW;
    this._canvas.height = targetH;
    this._ctx.putImageData(imgData, 0, 0);

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
   * Unsharp Mask 边缘锐化
   * 原理: result = original + amount * (original - blurred)
   * 通过增强原图与模糊图之间的差异来突出边缘
   *
   * @param {Uint8ClampedArray} pixelData RGBA 像素数据
   * @param {number} width 图片宽度
   * @param {number} height 图片高度
   * @param {number} strength 锐化强度 (0-100)
   * @returns {Uint8ClampedArray} 锐化后的像素数据
   */
  sharpen(pixelData, width, height, strength) {
    // strength 0-100 映射到 amount 0.0-1.5
    const amount = (strength / 100) * 1.5;
    const result = new Uint8ClampedArray(pixelData.length);

    // 先创建高斯模糊版本 (3x3 卷积核)
    const blurred = new Float32Array(pixelData.length);
    const kernel = [
      1/16, 2/16, 1/16,
      2/16, 4/16, 2/16,
      1/16, 2/16, 1/16,
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const sx = Math.min(width - 1, Math.max(0, x + kx));
            const sy = Math.min(height - 1, Math.max(0, y + ky));
            const idx = (sy * width + sx) * 4;
            const ki = (ky + 1) * 3 + (kx + 1);
            r += pixelData[idx]     * kernel[ki];
            g += pixelData[idx + 1] * kernel[ki];
            b += pixelData[idx + 2] * kernel[ki];
          }
        }
        const idx = (y * width + x) * 4;
        blurred[idx]     = r;
        blurred[idx + 1] = g;
        blurred[idx + 2] = b;
        blurred[idx + 3] = pixelData[idx + 3];
      }
    }

    // Unsharp Mask: result = original + amount * (original - blurred)
    for (let i = 0; i < pixelData.length; i += 4) {
      result[i]     = Math.max(0, Math.min(255, Math.round(pixelData[i]     + amount * (pixelData[i]     - blurred[i]))));
      result[i + 1] = Math.max(0, Math.min(255, Math.round(pixelData[i + 1] + amount * (pixelData[i + 1] - blurred[i + 1]))));
      result[i + 2] = Math.max(0, Math.min(255, Math.round(pixelData[i + 2] + amount * (pixelData[i + 2] - blurred[i + 2]))));
      result[i + 3] = pixelData[i + 3]; // alpha 不变
    }

    return result;
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
