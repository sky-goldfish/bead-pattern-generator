/**
 * 导出 / 打印模块
 */

class ExportManager {
  /**
   * 导出为高清 PNG
   */
  static downloadPNG(canvas, filename = '拼豆图纸.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 导出颜色清单为文本文件
   */
  static downloadColorList(colorStats, filename = '拼豆颜色清单.txt', brandName = 'MARD') {
    let text = `=== ${brandName} 拼豆颜色清单 ===\n\n`;
    text += `总计: ${colorStats.reduce((s, c) => s + c.count, 0)} 颗\n`;
    text += `颜色种类: ${colorStats.length} 种\n\n`;
    text += '色号\t数量\t占比\t颜色\n';
    text += '─'.repeat(40) + '\n';

    colorStats.forEach(stat => {
      const bar = '█'.repeat(Math.round(parseFloat(stat.percentage) / 2));
      text += `${stat.code}\t${stat.count}\t${stat.percentage}%\t${bar}\n`;
    });

    text += '\n─'.repeat(40) + '\n';
    text += `色卡品牌: ${brandName}\n`;
    if (brandName === 'MARD') {
      text += '色号查询: https://www.doudougongfang.com/kb/beads/mard-palette\n';
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /**
   * 打印图纸 (调用浏览器打印)
   */
  static print(canvas) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以使用打印功能');
      return;
    }

    const imgData = canvas.toDataURL('image/png');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>拼豆图纸 - 打印</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #fff;
          }
          img {
            max-width: 100%;
            max-height: 95vh;
            object-fit: contain;
          }
          @media print {
            body { min-height: auto; background: #fff; }
            img { max-width: 100%; max-height: none; }
            /* 强制浏览器以彩色打印，保留背景色和填充色 */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" onload="window.print(); window.close();" />
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportManager;
}