/**
 * 拼豆网格渲染模块
 * 在 Canvas 上绘制拼豆网格图纸，支持显示色号和预览
 */

class BeadRenderer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * 渲染拼豆图纸
   * 使用独立临时画布，避免与 renderFullPage 共享 canvas 导致状态冲突
   * @param {Object} options
   * @param {Array} options.matchedColors - 匹配后的颜色数组 [{ code, hex, r, g, b }]
   * @param {number} options.width - 网格宽度
   * @param {number} options.height - 网格高度
   * @param {number} options.cellSize - 每个格子的像素大小
   * @param {boolean} options.showGridLines - 是否显示网格线
   * @param {boolean} options.showColorCodes - 是否显示色号
   * @param {string} options.backgroundColor - 背景色
   * @returns {HTMLCanvasElement}
   */
  render(options) {
    const {
      matchedColors,
      width,
      height,
      cellSize = 20,
      showGridLines = true,
      showColorCodes = false,
      backgroundColor = '#ffffff',
    } = options;

    // 使用独立临时画布，不污染 this.canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 计算画布尺寸
    const canvasWidth = width * cellSize;
    const canvasHeight = height * cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 清空并填充背景
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制每个拼豆格子
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const color = matchedColors[index];
        const px = x * cellSize;
        const py = y * cellSize;

        // 跳过背景透明格子
        if (color.isBg) continue;

        // 填充颜色
        ctx.fillStyle = color.hex;
        ctx.fillRect(px, py, cellSize, cellSize);

        // 显示色号（格子足够大时）
        if (showColorCodes && cellSize >= 15) {
          ctx.fillStyle = this._getContrastColor(color.r, color.g, color.b);
          ctx.font = `${Math.max(8, cellSize / 3)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(color.code, px + cellSize / 2, py + cellSize / 2);
        }
      }
    }

    // 绘制网格线
    if (showGridLines) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvasHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvasWidth, y * cellSize);
        ctx.stroke();
      }
    }

    return canvas;
  }

  /**
   * 渲染带边框和标题的完整图纸
   * @param {Object} options - 同 render()
   * @param {string} options.title - 图纸标题
   * @param {Array} options.colorStats - 颜色统计 [{ code, hex, count, percentage }]
   * @returns {HTMLCanvasElement}
   */
  renderFullPage(options) {
    const { matchedColors, width, height, cellSize = 15, title = '拼豆图纸', colorStats = [] } = options;

    const padding = 40;
    const titleHeight = 50;
    const statsWidth = 200;
    const statsPadding = 20;

    const gridCanvasWidth = width * cellSize;
    const gridCanvasHeight = height * cellSize;

    // 计算总画布尺寸
    const totalWidth = padding * 2 + gridCanvasWidth + (colorStats.length > 0 ? statsWidth + statsPadding : 0);
    const totalHeight = padding * 2 + titleHeight + gridCanvasHeight;

    this.canvas.width = totalWidth;
    this.canvas.height = totalHeight;

    // 白色背景
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, totalWidth, totalHeight);

    // 标题
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(title, padding, padding);

    // 网格尺寸信息
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#666';
    this.ctx.fillText(`${width} × ${height} 格 | 共 ${width * height} 颗拼豆`, padding, padding + 30);

    // 渲染网格
    const gridCanvas = this.render({ ...options, cellSize });
    this.ctx.drawImage(gridCanvas, padding, padding + titleHeight);

    // 右侧颜色统计
    if (colorStats.length > 0) {
      const statsX = padding + gridCanvasWidth + statsPadding;
      const statsY = padding + titleHeight;

      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText('颜色清单', statsX, statsY);

      this.ctx.font = '12px Arial';
      let offsetY = 25;

      colorStats.slice(0, 20).forEach((stat, i) => {
        const y = statsY + offsetY + i * 20;

        // 色块
        this.ctx.fillStyle = stat.hex;
        this.ctx.fillRect(statsX, y, 16, 16);
        this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        this.ctx.strokeRect(statsX, y, 16, 16);

        // 文字
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${stat.code} × ${stat.count}`, statsX + 22, y + 12);
      });

      if (colorStats.length > 20) {
        this.ctx.fillStyle = '#999';
        this.ctx.fillText(`... 还有 ${colorStats.length - 20} 种颜色`, statsX, statsY + offsetY + 20 * 20);
      }
    }

    return this.canvas;
  }

  /**
   * 计算对比色（用于在色块上显示文字）
   */
  _getContrastColor(r, g, b) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
  }

  /**
   * 获取当前画布的 DataURL
   */
  toDataURL(format = 'image/png', quality = 1.0) {
    return this.canvas.toDataURL(format, quality);
  }

  /**
   * 下载当前画布为图片
   */
  download(filename = 'bead-pattern.png', format = 'image/png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.toDataURL(format);
    link.click();
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BeadRenderer;
}
