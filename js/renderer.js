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
      edgeEnhance = false,
      edgeSensitivity = 5,
      edgeColor = '#222222',
      edgeWidth = 2,
      edgeData = null,       // 外部预计算的边缘数据
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

    // 边缘检测（仅在启用且未传入预计算数据时执行）
    let edges = edgeData;
    if (edgeEnhance && !edges) {
      edges = this.detectEdges(matchedColors, width, height, edgeSensitivity);
    }

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

    // 绘制边缘轮廓（在网格线之前绘制，使轮廓更突出）
    if (edgeEnhance && edges) {
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = edgeWidth;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          if (!edges[index]) continue;

          const color = matchedColors[index];
          if (color.isBg) continue;

          const px = x * cellSize;
          const py = y * cellSize;

          // 检查四条边是否需要绘制（只在与不同色邻居的边上画线）
          const idx = y * width + x;

          // 上边
          if (y === 0 || matchedColors[idx - width].code !== color.code || matchedColors[idx - width].isBg) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py);
            ctx.stroke();
          }
          // 下边
          if (y === height - 1 || matchedColors[idx + width].code !== color.code || matchedColors[idx + width].isBg) {
            ctx.beginPath();
            ctx.moveTo(px, py + cellSize);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.stroke();
          }
          // 左边
          if (x === 0 || matchedColors[idx - 1].code !== color.code || matchedColors[idx - 1].isBg) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + cellSize);
            ctx.stroke();
          }
          // 右边
          if (x === width - 1 || matchedColors[idx + 1].code !== color.code || matchedColors[idx + 1].isBg) {
            ctx.beginPath();
            ctx.moveTo(px + cellSize, py);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.stroke();
          }
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
   * 检测边缘格子
   * 对每个格子检查上下左右邻居的颜色，如果差异超过阈值则标记为边缘
   * @param {Array} matchedColors - 匹配后的颜色数组
   * @param {number} width - 网格宽度
   * @param {number} height - 网格高度
   * @param {number} sensitivity - 边缘灵敏度 (1-10, 默认5)
   * @returns {Uint8Array} 边缘标记矩阵 (1=边缘, 0=非边缘)
   */
  detectEdges(matchedColors, width, height, sensitivity = 5) {
    const edges = new Uint8Array(width * height);
    // 灵敏度映射到色差阈值: 灵敏度越高 → 阈值越低 → 更多边缘
    const threshold = 120 - sensitivity * 10; // 1→110(宽松), 10→20(极敏感)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const current = matchedColors[idx];

        // 检查四个方向的邻居
        const neighbors = [];
        if (x > 0)          neighbors.push(matchedColors[idx - 1]);       // 左
        if (x < width - 1)  neighbors.push(matchedColors[idx + 1]);       // 右
        if (y > 0)          neighbors.push(matchedColors[idx - width]);    // 上
        if (y < height - 1) neighbors.push(matchedColors[idx + width]);    // 下

        // 计算与邻居的最大色差
        let maxDiff = 0;
        for (const neighbor of neighbors) {
          // 跳过背景标记的格子
          if (current.isBg || neighbor.isBg) continue;

          const diff = Math.sqrt(
            Math.pow(current.r - neighbor.r, 2) +
            Math.pow(current.g - neighbor.g, 2) +
            Math.pow(current.b - neighbor.b, 2)
          );
          if (diff > maxDiff) maxDiff = diff;
        }

        if (maxDiff >= threshold) {
          edges[idx] = 1;
        }
      }
    }

    return edges;
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