# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**拼豆图纸生成器 (Bead Pattern Generator)** — 纯前端 Web 工具，将图片自动转换为拼豆 (Fuse Bead / Perler Bead) 图纸。零依赖、零构建步骤，浏览器直接打开 `index.html` 即可运行。

## Development

本项目无构建工具、无包管理器、无测试框架。开发方式：

- **运行**: 直接用浏览器打开 `index.html`，或使用任意本地 HTTP 服务器（如 `python3 -m http.server`）
- **调试**: 浏览器开发者工具，所有 JS 通过 `<script>` 标签顺序加载
- **无 lint/format 配置**

## Architecture

### 模块依赖关系

脚本加载顺序即依赖顺序（`index.html` 底部定义）：

```
color-match.js  →  色卡数据 + 颜色算法（被所有模块依赖，最先加载）
pixelation.js   →  图片加载 + 像素化 + Unsharp Mask 锐化
renderer.js     →  Canvas 网格绘制 + 完整导出页面渲染
export.js       →  PNG 下载 / TXT 清单 / 浏览器打印
app.js          →  主控制器 (IIFE)，协调所有模块，最后加载
```

### 全局类 API

所有类通过 `window` 全局暴露，`app.js` 中直接实例化使用：

| 类名 | 所在文件 | 核心方法 |
|------|----------|----------|
| `ColorMatcher` | color-match.js | `findClosest(r,g,b)`, `countColors(pixelData)` |
| `ColorUtils` | color-match.js | `rgbToLab(r,g,b)`, `deltaE(lab1,lab2)`（静态方法） |
| `ColorQuantizer` | color-match.js | `quantize(pixels, k)` K-Means 聚类 |
| `PixelationEngine` | pixelation.js | `loadImage(file)`, `pixelate(img, w, h, keepRatio)`, `recommendGridSize(img)` |
| `BeadRenderer` | renderer.js | `render(canvas, gridData, options)`, `renderFullPage(gridData, colorStats, options)` |
| `ExportManager` | export.js | `downloadPNG()`, `downloadColorList()`, `print()`（单例，内部持有渲染结果引用） |

### 数据流

1. 用户上传图片 → `PixelationEngine.loadImage()`
2. Canvas 缩放像素化 → `PixelationEngine.pixelate()`
3. 颜色匹配 → `ColorMatcher.findClosest()` CIE Lab Delta-E 匹配拼豆色卡（可选 K-Means 聚类限色）
4. 统计用量 → `ColorMatcher.countColors()`
5. 渲染图纸 → `BeadRenderer.render()` Canvas 绘制网格 + 色号
6. 导出 → `BeadRenderer.renderFullPage()` + `ExportManager`

### 核心算法

- **颜色匹配**: CIE Lab 色彩空间 + CIE76 Delta-E 色差，Lab 值预计算缓存到 Map
- **像素化**: Canvas 高质量缩放（`imageSmoothingEnabled`）+ 最近邻放大
- **颜色聚类**: K-Means，加权欧氏距离（R/G 通道权重更高），最多 20 次迭代

### 色卡数据

内置在 `color-match.js` 中：
- **MARD**: 291 色，15 个系列（A/B/C/D/E/F/G/H/M/P/Q/R/T/Y/ZG），豆豆工坊数据
- **Perler**: 57 色（标准 47 + 珠光 6 + 霓虹 4），pixel-beads.com 数据

### HTML ↔ JS 关键 ID 映射

`app.js` 的 IIFE 内通过 `$('#id')` 绑定 DOM 元素，修改 `index.html` 时需同步更新：

| DOM ID | 用途 | 关联操作 |
|--------|------|----------|
| `gridWidth` / `gridHeight` | 网格尺寸输入 | 锁定比例联动 |
| `keepRatio` | 宽高比锁定开关 | 修改一个维度自动计算另一个 |
| `showGridLines` / `showColorCodes` | 显示选项 | 控制渲染参数 |
| `colorLimitToggle` / `colorLimitCount` | K-Means 限色开关和数量 | 启用时先聚类再匹配 |
| `resultCanvas` | 图纸渲染目标 Canvas | `BeadRenderer.render()` 输出 |
| `colorStatsBody` | 颜色清单表格 | 动态生成 `<tr>` |

## Code Conventions

- **语言**: 所有注释和 UI 文本均为简体中文
- **模块化**: `app.js` 使用 IIFE 封装；其他模块通过全局类/对象暴露接口
- **CSS**: 使用 CSS 变量系统（`--primary`、`--card` 等），响应式断点 900px
- **Canvas 性能**: 使用 `willReadFrequently: true` 提示优化像素读取
