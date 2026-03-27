/**
 * 拼豆色卡数据 + 颜色匹配算法
 * 支持 MARD (291色, 15个系列) 和 Perler (57色) 两大品牌
 *
 * MARD 数据来源: 豆豆工坊 (doudougongfang.com) + pixel-beads.com
 * Perler 数据来源: pixel-beads.com
 */

// ============================================================
// 色卡系列定义 - MARD 按色系分组
// ============================================================

const MARD_SERIES = [
  { id: 'A',  name: '黄/橙色系', color: '#f0d83a' },
  { id: 'B',  name: '绿色系',   color: '#39e158' },
  { id: 'C',  name: '蓝色系',   color: '#06aadf' },
  { id: 'D',  name: '紫/靛色系', color: '#9a35ad' },
  { id: 'E',  name: '粉色系',   color: '#e8649e' },
  { id: 'F',  name: '红色系',   color: '#f63d4b' },
  { id: 'G',  name: '棕/肤色系', color: '#da8c42' },
  { id: 'H',  name: '黑白灰系', color: '#878787' },
  { id: 'M',  name: '混合大地色', color: '#a68862' },
  { id: 'P',  name: '特殊色系P', color: '#8758a9' },
  { id: 'Q',  name: '特殊色系Q', color: '#c27563' },
  { id: 'R',  name: '特殊色系R', color: '#1d9b54' },
  { id: 'T',  name: '特殊色系T', color: '#42adcf' },
  { id: 'Y',  name: '特殊色系Y', color: '#fda951' },
  { id: 'ZG', name: '荧光色系',  color: '#64f343' },
];

// ============================================================
// MARD 完整色卡 - 291 色
// ============================================================

const MARD_PALETTE = [
  // ========== A 系列 - 黄/橙色系 (26色) ==========
  { code: 'A1',  hex: '#faf5cd', r: 250, g: 245, b: 205 },
  { code: 'A2',  hex: '#fcfed6', r: 252, g: 254, b: 214 },
  { code: 'A3',  hex: '#fcff92', r: 252, g: 255, b: 146 },
  { code: 'A4',  hex: '#f7ec5c', r: 247, g: 236, b: 92 },
  { code: 'A5',  hex: '#f0d83a', r: 240, g: 216, b: 58 },
  { code: 'A6',  hex: '#fda951', r: 253, g: 169, b: 81 },
  { code: 'A7',  hex: '#fa8c4f', r: 250, g: 140, b: 79 },
  { code: 'A8',  hex: '#fbda4d', r: 251, g: 218, b: 77 },
  { code: 'A9',  hex: '#f79d5f', r: 247, g: 157, b: 95 },
  { code: 'A10', hex: '#f47e38', r: 244, g: 126, b: 56 },
  { code: 'A11', hex: '#fedb99', r: 254, g: 219, b: 153 },
  { code: 'A12', hex: '#fda276', r: 253, g: 162, b: 118 },
  { code: 'A13', hex: '#fec667', r: 254, g: 198, b: 103 },
  { code: 'A14', hex: '#f75842', r: 247, g: 88,  b: 66 },
  { code: 'A15', hex: '#fbf65e', r: 251, g: 246, b: 94 },
  { code: 'A16', hex: '#feff97', r: 254, g: 255, b: 151 },
  { code: 'A17', hex: '#fde173', r: 253, g: 225, b: 115 },
  { code: 'A18', hex: '#fcbf80', r: 252, g: 191, b: 128 },
  { code: 'A19', hex: '#fd7e77', r: 253, g: 126, b: 119 },
  { code: 'A20', hex: '#f9d666', r: 249, g: 214, b: 102 },
  { code: 'A21', hex: '#fae393', r: 250, g: 227, b: 147 },
  { code: 'A22', hex: '#edf878', r: 237, g: 248, b: 120 },
  { code: 'A23', hex: '#e4c8ba', r: 228, g: 200, b: 186 },
  { code: 'A24', hex: '#f3f6a9', r: 243, g: 246, b: 169 },
  { code: 'A25', hex: '#fdf785', r: 253, g: 247, b: 133 },
  { code: 'A26', hex: '#ffc734', r: 255, g: 199, b: 52 },

  // ========== B 系列 - 绿色系 (32色) ==========
  { code: 'B1',  hex: '#dff13b', r: 223, g: 241, b: 59 },
  { code: 'B2',  hex: '#64f343', r: 100, g: 243, b: 67 },
  { code: 'B3',  hex: '#a1f586', r: 161, g: 245, b: 134 },
  { code: 'B4',  hex: '#5fdf34', r: 95,  g: 223, b: 52 },
  { code: 'B5',  hex: '#39e158', r: 57,  g: 225, b: 88 },
  { code: 'B6',  hex: '#64e0a4', r: 100, g: 224, b: 164 },
  { code: 'B7',  hex: '#3eae7c', r: 62,  g: 174, b: 124 },
  { code: 'B8',  hex: '#1d9b54', r: 29,  g: 155, b: 84 },
  { code: 'B9',  hex: '#2a5037', r: 42,  g: 80,  b: 55 },
  { code: 'B10', hex: '#9ad1ba', r: 154, g: 209, b: 186 },
  { code: 'B11', hex: '#627032', r: 98,  g: 112, b: 50 },
  { code: 'B12', hex: '#1a6e3d', r: 26,  g: 110, b: 61 },
  { code: 'B13', hex: '#c8e87d', r: 200, g: 232, b: 125 },
  { code: 'B14', hex: '#abe84f', r: 171, g: 232, b: 79 },
  { code: 'B15', hex: '#305335', r: 48,  g: 83,  b: 53 },
  { code: 'B16', hex: '#c0ed9c', r: 192, g: 237, b: 156 },
  { code: 'B17', hex: '#9eb33e', r: 158, g: 179, b: 62 },
  { code: 'B18', hex: '#e6ed4f', r: 230, g: 237, b: 79 },
  { code: 'B19', hex: '#26b78e', r: 38,  g: 183, b: 142 },
  { code: 'B20', hex: '#cbeccf', r: 203, g: 236, b: 207 },
  { code: 'B21', hex: '#18616a', r: 24,  g: 97,  b: 106 },
  { code: 'B22', hex: '#0a4241', r: 10,  g: 66,  b: 65 },
  { code: 'B23', hex: '#343b1a', r: 52,  g: 59,  b: 26 },
  { code: 'B24', hex: '#e8faa6', r: 232, g: 250, b: 166 },
  { code: 'B25', hex: '#4e846d', r: 78,  g: 132, b: 109 },
  { code: 'B26', hex: '#907c35', r: 144, g: 124, b: 53 },
  { code: 'B27', hex: '#d0e0af', r: 208, g: 224, b: 175 },
  { code: 'B28', hex: '#9ee5bb', r: 158, g: 229, b: 187 },
  { code: 'B29', hex: '#c6df5f', r: 198, g: 223, b: 95 },
  { code: 'B30', hex: '#e3fbb1', r: 227, g: 251, b: 177 },
  { code: 'B31', hex: '#b4e691', r: 180, g: 230, b: 145 },
  { code: 'B32', hex: '#92ad60', r: 146, g: 173, b: 96 },

  // ========== C 系列 - 蓝色系 (29色) ==========
  { code: 'C1',  hex: '#f0fee4', r: 240, g: 254, b: 228 },
  { code: 'C2',  hex: '#abf8fe', r: 171, g: 248, b: 254 },
  { code: 'C3',  hex: '#a2e0f7', r: 162, g: 224, b: 247 },
  { code: 'C4',  hex: '#44cdfb', r: 68,  g: 205, b: 251 },
  { code: 'C5',  hex: '#06aadf', r: 6,   g: 170, b: 223 },
  { code: 'C6',  hex: '#54a7e9', r: 84,  g: 167, b: 233 },
  { code: 'C7',  hex: '#3977ca', r: 57,  g: 119, b: 202 },
  { code: 'C8',  hex: '#0f52bd', r: 15,  g: 82,  b: 189 },
  { code: 'C9',  hex: '#3349c3', r: 51,  g: 73,  b: 195 },
  { code: 'C10', hex: '#3cbce3', r: 60,  g: 188, b: 227 },
  { code: 'C11', hex: '#2aded3', r: 42,  g: 222, b: 211 },
  { code: 'C12', hex: '#1e334e', r: 30,  g: 51,  b: 78 },
  { code: 'C13', hex: '#cde7fe', r: 205, g: 231, b: 254 },
  { code: 'C14', hex: '#d5fcf7', r: 213, g: 252, b: 247 },
  { code: 'C15', hex: '#21c5c4', r: 33,  g: 197, b: 196 },
  { code: 'C16', hex: '#1858a2', r: 24,  g: 88,  b: 162 },
  { code: 'C17', hex: '#02d1f3', r: 2,   g: 209, b: 243 },
  { code: 'C18', hex: '#213244', r: 33,  g: 50,  b: 68 },
  { code: 'C19', hex: '#18869d', r: 24,  g: 134, b: 157 },
  { code: 'C20', hex: '#1a70a9', r: 26,  g: 112, b: 169 },
  { code: 'C21', hex: '#bcddfc', r: 188, g: 221, b: 252 },
  { code: 'C22', hex: '#6bb1bb', r: 107, g: 177, b: 187 },
  { code: 'C23', hex: '#c8e2fd', r: 200, g: 226, b: 253 },
  { code: 'C24', hex: '#7ec5f9', r: 126, g: 197, b: 249 },
  { code: 'C25', hex: '#a9e8e0', r: 169, g: 232, b: 224 },
  { code: 'C26', hex: '#42adcf', r: 66,  g: 173, b: 207 },
  { code: 'C27', hex: '#d0def9', r: 208, g: 222, b: 249 },
  { code: 'C28', hex: '#bdcee8', r: 189, g: 206, b: 232 },
  { code: 'C29', hex: '#364a89', r: 54,  g: 74,  b: 137 },

  // ========== D 系列 - 紫/靛色系 (26色) ==========
  { code: 'D1',  hex: '#acb7ef', r: 172, g: 183, b: 239 },
  { code: 'D2',  hex: '#868dd3', r: 134, g: 141, b: 211 },
  { code: 'D3',  hex: '#3554af', r: 53,  g: 84,  b: 175 },
  { code: 'D4',  hex: '#162d7b', r: 22,  g: 45,  b: 123 },
  { code: 'D5',  hex: '#b34ec6', r: 179, g: 78,  b: 198 },
  { code: 'D6',  hex: '#b37bdc', r: 179, g: 123, b: 220 },
  { code: 'D7',  hex: '#8758a9', r: 135, g: 88,  b: 169 },
  { code: 'D8',  hex: '#e3d2fe', r: 227, g: 210, b: 254 },
  { code: 'D9',  hex: '#d5b9f4', r: 213, g: 185, b: 244 },
  { code: 'D10', hex: '#301a49', r: 48,  g: 26,  b: 73 },
  { code: 'D11', hex: '#beb9e2', r: 190, g: 185, b: 226 },
  { code: 'D12', hex: '#dc99ce', r: 220, g: 153, b: 206 },
  { code: 'D13', hex: '#b5038d', r: 181, g: 3,   b: 141 },
  { code: 'D14', hex: '#862993', r: 134, g: 41,  b: 147 },
  { code: 'D15', hex: '#2f1f8c', r: 47,  g: 31,  b: 140 },
  { code: 'D16', hex: '#e2e4f0', r: 226, g: 228, b: 240 },
  { code: 'D17', hex: '#c7d3f9', r: 199, g: 211, b: 249 },
  { code: 'D18', hex: '#9a64b8', r: 154, g: 100, b: 184 },
  { code: 'D19', hex: '#d8c2d9', r: 216, g: 194, b: 217 },
  { code: 'D20', hex: '#9a35ad', r: 154, g: 53,  b: 173 },
  { code: 'D21', hex: '#940595', r: 148, g: 5,   b: 149 },
  { code: 'D22', hex: '#38389a', r: 56,  g: 56,  b: 154 },
  { code: 'D23', hex: '#eadbf8', r: 234, g: 219, b: 248 },
  { code: 'D24', hex: '#768ae1', r: 118, g: 138, b: 225 },
  { code: 'D25', hex: '#4950c2', r: 73,  g: 80,  b: 194 },
  { code: 'D26', hex: '#d6c6eb', r: 214, g: 198, b: 235 },

  // ========== E 系列 - 粉色系 (24色) ==========
  { code: 'E1',  hex: '#f6d4cb', r: 246, g: 212, b: 203 },
  { code: 'E2',  hex: '#fcc1dd', r: 252, g: 193, b: 221 },
  { code: 'E3',  hex: '#f6bde8', r: 246, g: 189, b: 232 },
  { code: 'E4',  hex: '#e8649e', r: 232, g: 100, b: 158 },
  { code: 'E5',  hex: '#f0569f', r: 240, g: 86,  b: 159 },
  { code: 'E6',  hex: '#eb4172', r: 235, g: 65,  b: 114 },
  { code: 'E7',  hex: '#c53674', r: 197, g: 54,  b: 116 },
  { code: 'E8',  hex: '#fddbe9', r: 253, g: 219, b: 233 },
  { code: 'E9',  hex: '#e376c7', r: 227, g: 118, b: 199 },
  { code: 'E10', hex: '#d13b95', r: 209, g: 59,  b: 149 },
  { code: 'E11', hex: '#f7dad4', r: 247, g: 218, b: 212 },
  { code: 'E12', hex: '#f693bf', r: 246, g: 147, b: 191 },
  { code: 'E13', hex: '#b5026a', r: 181, g: 2,   b: 106 },
  { code: 'E14', hex: '#fad4bf', r: 250, g: 212, b: 191 },
  { code: 'E15', hex: '#f5c9ca', r: 245, g: 201, b: 202 },
  { code: 'E16', hex: '#fbf4ec', r: 251, g: 244, b: 236 },
  { code: 'E17', hex: '#f7e3ec', r: 247, g: 227, b: 236 },
  { code: 'E18', hex: '#f9c8db', r: 249, g: 200, b: 219 },
  { code: 'E19', hex: '#f6bbd1', r: 246, g: 187, b: 209 },
  { code: 'E20', hex: '#d7c6ce', r: 215, g: 198, b: 206 },
  { code: 'E21', hex: '#c09da4', r: 192, g: 157, b: 164 },
  { code: 'E22', hex: '#b38c9f', r: 179, g: 140, b: 159 },
  { code: 'E23', hex: '#937d8a', r: 147, g: 125, b: 138 },
  { code: 'E24', hex: '#debee5', r: 222, g: 190, b: 229 },

  // ========== F 系列 - 红色系 (25色) ==========
  { code: 'F1',  hex: '#fe9381', r: 254, g: 147, b: 129 },
  { code: 'F2',  hex: '#f63d4b', r: 246, g: 61,  b: 75 },
  { code: 'F3',  hex: '#ee4e3e', r: 238, g: 78,  b: 62 },
  { code: 'F4',  hex: '#fb2a40', r: 251, g: 42,  b: 64 },
  { code: 'F5',  hex: '#e10328', r: 225, g: 3,   b: 40 },
  { code: 'F6',  hex: '#913635', r: 145, g: 54,  b: 53 },
  { code: 'F7',  hex: '#911932', r: 145, g: 25,  b: 50 },
  { code: 'F8',  hex: '#bb0126', r: 187, g: 1,   b: 38 },
  { code: 'F9',  hex: '#e0677a', r: 224, g: 103, b: 122 },
  { code: 'F10', hex: '#874628', r: 135, g: 70,  b: 40 },
  { code: 'F11', hex: '#592323', r: 89,  g: 35,  b: 35 },
  { code: 'F12', hex: '#f3536b', r: 243, g: 83,  b: 107 },
  { code: 'F13', hex: '#f45c45', r: 244, g: 92,  b: 69 },
  { code: 'F14', hex: '#fcadb2', r: 252, g: 173, b: 178 },
  { code: 'F15', hex: '#d50527', r: 213, g: 5,   b: 39 },
  { code: 'F16', hex: '#f8c0a9', r: 248, g: 192, b: 169 },
  { code: 'F17', hex: '#e89b7d', r: 232, g: 155, b: 125 },
  { code: 'F18', hex: '#d07f4a', r: 208, g: 127, b: 74 },
  { code: 'F19', hex: '#be454a', r: 190, g: 69,  b: 74 },
  { code: 'F20', hex: '#c69495', r: 198, g: 148, b: 149 },
  { code: 'F21', hex: '#f2b8c6', r: 242, g: 184, b: 198 },
  { code: 'F22', hex: '#f7c3d0', r: 247, g: 195, b: 208 },
  { code: 'F23', hex: '#ed806c', r: 237, g: 128, b: 108 },
  { code: 'F24', hex: '#e09daf', r: 224, g: 157, b: 175 },
  { code: 'F25', hex: '#e84854', r: 232, g: 72,  b: 84 },

  // ========== G 系列 - 棕/肤色系 (21色) ==========
  { code: 'G1',  hex: '#ffe4d3', r: 255, g: 228, b: 211 },
  { code: 'G2',  hex: '#fcc6ac', r: 252, g: 198, b: 172 },
  { code: 'G3',  hex: '#f1c4a5', r: 241, g: 196, b: 165 },
  { code: 'G4',  hex: '#dcb387', r: 220, g: 179, b: 135 },
  { code: 'G5',  hex: '#e7b34e', r: 231, g: 179, b: 78 },
  { code: 'G6',  hex: '#e3a014', r: 227, g: 160, b: 20 },
  { code: 'G7',  hex: '#985c3a', r: 152, g: 92,  b: 58 },
  { code: 'G8',  hex: '#713d2f', r: 113, g: 61,  b: 47 },
  { code: 'G9',  hex: '#e4b685', r: 228, g: 182, b: 133 },
  { code: 'G10', hex: '#da8c42', r: 218, g: 140, b: 66 },
  { code: 'G11', hex: '#dac898', r: 218, g: 200, b: 152 },
  { code: 'G12', hex: '#fec993', r: 254, g: 201, b: 147 },
  { code: 'G13', hex: '#b2714b', r: 178, g: 113, b: 75 },
  { code: 'G14', hex: '#8b684c', r: 139, g: 104, b: 76 },
  { code: 'G15', hex: '#f6f8e3', r: 246, g: 248, b: 227 },
  { code: 'G16', hex: '#f2d8c1', r: 242, g: 216, b: 193 },
  { code: 'G17', hex: '#77544e', r: 119, g: 84,  b: 78 },
  { code: 'G18', hex: '#ffe3d5', r: 255, g: 227, b: 213 },
  { code: 'G19', hex: '#dd7d41', r: 221, g: 125, b: 65 },
  { code: 'G20', hex: '#a5452f', r: 165, g: 69,  b: 47 },
  { code: 'G21', hex: '#b38561', r: 179, g: 133, b: 97 },

  // ========== H 系列 - 黑白灰系 (23色) ==========
  { code: 'H1',  hex: '#ffffff', r: 255, g: 255, b: 255 },
  { code: 'H2',  hex: '#fbfbfb', r: 251, g: 251, b: 251 },
  { code: 'H3',  hex: '#b4b4b4', r: 180, g: 180, b: 180 },
  { code: 'H4',  hex: '#878787', r: 135, g: 135, b: 135 },
  { code: 'H5',  hex: '#464648', r: 70,  g: 70,  b: 72 },
  { code: 'H6',  hex: '#2c2c2c', r: 44,  g: 44,  b: 44 },
  { code: 'H7',  hex: '#010101', r: 1,   g: 1,   b: 1 },
  { code: 'H8',  hex: '#e7d6dc', r: 231, g: 214, b: 220 },
  { code: 'H9',  hex: '#efedee', r: 239, g: 237, b: 238 },
  { code: 'H10', hex: '#ebebeb', r: 235, g: 235, b: 235 },
  { code: 'H11', hex: '#cdcdcd', r: 205, g: 205, b: 205 },
  { code: 'H12', hex: '#fdf6ee', r: 253, g: 246, b: 238 },
  { code: 'H13', hex: '#f4edf1', r: 244, g: 237, b: 241 },
  { code: 'H14', hex: '#ced7d4', r: 206, g: 215, b: 212 },
  { code: 'H15', hex: '#9aa6a6', r: 154, g: 166, b: 166 },
  { code: 'H16', hex: '#1b1213', r: 27,  g: 18,  b: 19 },
  { code: 'H17', hex: '#f0eeef', r: 240, g: 238, b: 239 },
  { code: 'H18', hex: '#fcfff6', r: 252, g: 255, b: 246 },
  { code: 'H19', hex: '#f2eee5', r: 242, g: 238, b: 229 },
  { code: 'H20', hex: '#96a09f', r: 150, g: 160, b: 159 },
  { code: 'H21', hex: '#f8fbe6', r: 248, g: 251, b: 230 },
  { code: 'H22', hex: '#cacad2', r: 202, g: 202, b: 210 },
  { code: 'H23', hex: '#9b9c94', r: 155, g: 156, b: 148 },

  // ========== M 系列 - 混合大地色系 (15色) ==========
  { code: 'M1',  hex: '#bbc6b6', r: 187, g: 198, b: 182 },
  { code: 'M2',  hex: '#909994', r: 144, g: 153, b: 148 },
  { code: 'M3',  hex: '#697e81', r: 105, g: 126, b: 129 },
  { code: 'M4',  hex: '#e0d4bc', r: 224, g: 212, b: 188 },
  { code: 'M5',  hex: '#d1ccaf', r: 209, g: 204, b: 175 },
  { code: 'M6',  hex: '#b0aa86', r: 176, g: 170, b: 134 },
  { code: 'M7',  hex: '#b0a796', r: 176, g: 167, b: 150 },
  { code: 'M8',  hex: '#ae8082', r: 174, g: 128, b: 130 },
  { code: 'M9',  hex: '#a68862', r: 166, g: 136, b: 98 },
  { code: 'M10', hex: '#c4b3bb', r: 196, g: 179, b: 187 },
  { code: 'M11', hex: '#9d7693', r: 157, g: 118, b: 147 },
  { code: 'M12', hex: '#644b51', r: 100, g: 75,  b: 81 },
  { code: 'M13', hex: '#c79266', r: 199, g: 146, b: 102 },
  { code: 'M14', hex: '#c27563', r: 194, g: 117, b: 99 },
  { code: 'M15', hex: '#747d7a', r: 116, g: 125, b: 122 },

  // ========== P 系列 - 特殊色系P (23色) ==========
  { code: 'P1',  hex: '#FAF4C8', r: 250, g: 244, b: 200 },
  { code: 'P2',  hex: '#FDD338', r: 253, g: 211, b: 56 },
  { code: 'P3',  hex: '#F9A31B', r: 249, g: 163, b: 27 },
  { code: 'P4',  hex: '#F57C20', r: 245, g: 124, b: 32 },
  { code: 'P5',  hex: '#E53935', r: 229, g: 57,  b: 53 },
  { code: 'P6',  hex: '#8E24AA', r: 142, g: 36,  b: 170 },
  { code: 'P7',  hex: '#5E35B1', r: 94,  g: 53,  b: 177 },
  { code: 'P8',  hex: '#1E88E5', r: 30,  g: 136, b: 229 },
  { code: 'P9',  hex: '#039BE5', r: 3,   g: 155, b: 229 },
  { code: 'P10', hex: '#00ACC1', r: 0,   g: 172, b: 193 },
  { code: 'P11', hex: '#00897B', r: 0,   g: 137, b: 123 },
  { code: 'P12', hex: '#43A047', r: 67,  g: 160, b: 71 },
  { code: 'P13', hex: '#7CB342', r: 124, g: 179, b: 66 },
  { code: 'P14', hex: '#C0CA33', r: 192, g: 202, b: 51 },
  { code: 'P15', hex: '#F9A825', r: 249, g: 168, b: 37 },
  { code: 'P16', hex: '#FF8F00', r: 255, g: 143, b: 0 },
  { code: 'P17', hex: '#FFB300', r: 255, g: 179, b: 0 },
  { code: 'P18', hex: '#F4511E', r: 244, g: 81,  b: 30 },
  { code: 'P19', hex: '#D81B60', r: 216, g: 27,  b: 96 },
  { code: 'P20', hex: '#880E4F', r: 136, g: 14,  b: 79 },
  { code: 'P21', hex: '#4E342E', r: 78,  g: 52,  b: 46 },
  { code: 'P22', hex: '#37474F', r: 55,  g: 71,  b: 79 },
  { code: 'P23', hex: '#F5F5F5', r: 245, g: 245, b: 245 },

  // ========== Q 系列 - 特殊色系Q (5色) ==========
  { code: 'Q1',  hex: '#FFD54F', r: 255, g: 213, b: 79 },
  { code: 'Q2',  hex: '#FF8A65', r: 255, g: 138, b: 101 },
  { code: 'Q3',  hex: '#CE93D8', r: 206, g: 147, b: 216 },
  { code: 'Q4',  hex: '#4FC3F7', r: 79,  g: 195, b: 247 },
  { code: 'Q5',  hex: '#A5D6A7', r: 165, g: 214, b: 167 },

  // ========== R 系列 - 特殊色系R (28色) ==========
  { code: 'R1',  hex: '#F44336', r: 244, g: 67,  b: 54 },
  { code: 'R2',  hex: '#E91E63', r: 233, g: 30,  b: 99 },
  { code: 'R3',  hex: '#9C27B0', r: 156, g: 39,  b: 176 },
  { code: 'R4',  hex: '#673AB7', r: 103, g: 58,  b: 183 },
  { code: 'R5',  hex: '#3F51B5', r: 63,  g: 81,  b: 181 },
  { code: 'R6',  hex: '#2196F3', r: 33,  g: 150, b: 243 },
  { code: 'R7',  hex: '#00BCD4', r: 0,   g: 188, b: 212 },
  { code: 'R8',  hex: '#009688', r: 0,   g: 150, b: 136 },
  { code: 'R9',  hex: '#4CAF50', r: 76,  g: 175, b: 80 },
  { code: 'R10', hex: '#8BC34A', r: 139, g: 195, b: 74 },
  { code: 'R11', hex: '#CDDC39', r: 205, g: 220, b: 57 },
  { code: 'R12', hex: '#FFEB3B', r: 255, g: 235, b: 59 },
  { code: 'R13', hex: '#FFC107', r: 255, g: 193, b: 7 },
  { code: 'R14', hex: '#FF9800', r: 255, g: 152, b: 0 },
  { code: 'R15', hex: '#FF5722', r: 255, g: 87,  b: 34 },
  { code: 'R16', hex: '#795548', r: 121, g: 85,  b: 72 },
  { code: 'R17', hex: '#607D8B', r: 96,  g: 125, b: 139 },
  { code: 'R18', hex: '#BDBDBD', r: 189, g: 189, b: 189 },
  { code: 'R19', hex: '#9E9E9E', r: 158, g: 158, b: 158 },
  { code: 'R20', hex: '#757575', r: 117, g: 117, b: 117 },
  { code: 'R21', hex: '#616161', r: 97,  g: 97,  b: 97 },
  { code: 'R22', hex: '#424242', r: 66,  g: 66,  b: 66 },
  { code: 'R23', hex: '#212121', r: 33,  g: 33,  b: 33 },
  { code: 'R24', hex: '#FFCDD2', r: 255, g: 205, b: 210 },
  { code: 'R25', hex: '#C8E6C9', r: 200, g: 230, b: 201 },
  { code: 'R26', hex: '#BBDEFB', r: 187, g: 222, b: 251 },
  { code: 'R27', hex: '#FFF9C4', r: 255, g: 249, b: 196 },
  { code: 'R28', hex: '#FFE0B2', r: 255, g: 224, b: 178 },

  // ========== T 系列 - 特殊色系T (1色) ==========
  { code: 'T1',  hex: '#E0E0E0', r: 224, g: 224, b: 224 },

  // ========== Y 系列 - 特殊色系Y (5色) ==========
  { code: 'Y1',  hex: '#FFF176', r: 255, g: 241, b: 118 },
  { code: 'Y2',  hex: '#FFCC80', r: 255, g: 204, b: 128 },
  { code: 'Y3',  hex: '#EF9A9A', r: 239, g: 154, b: 154 },
  { code: 'Y4',  hex: '#90CAF9', r: 144, g: 202, b: 249 },
  { code: 'Y5',  hex: '#A5D6A7', r: 165, g: 214, b: 167 },

  // ========== ZG 系列 - 荧光色系 (8色) ==========
  { code: 'ZG1', hex: '#76FF03', r: 118, g: 255, b: 3 },
  { code: 'ZG2', hex: '#00E676', r: 0,   g: 230, b: 118 },
  { code: 'ZG3', hex: '#18FFFF', r: 24,  g: 255, b: 255 },
  { code: 'ZG4', hex: '#651FFF', r: 101, g: 31,  b: 255 },
  { code: 'ZG5', hex: '#FF4081', r: 255, g: 64,  b: 129 },
  { code: 'ZG6', hex: '#FFD740', r: 255, g: 215, b: 64 },
  { code: 'ZG7', hex: '#FF6E40', r: 255, g: 110, b: 64 },
  { code: 'ZG8', hex: '#FFAB40', r: 255, g: 171, b: 64 },
];

// ============================================================
// Perler 色卡 - 57 色
// 数据来源: pixel-beads.com/perler-bead-color-chart
// ============================================================

const PERLER_PALETTE = [
  // 标准实色 (47色)
  { code: 'P01', hex: '#F1F1F1', r: 241, g: 241, b: 241 },
  { code: 'P02', hex: '#FDD835', r: 253, g: 216, b: 53 },
  { code: 'P03', hex: '#ECD800', r: 236, g: 216, b: 0 },
  { code: 'P04', hex: '#FF9100', r: 255, g: 145, b: 0 },
  { code: 'P05', hex: '#F01820', r: 240, g: 24,  b: 32 },
  { code: 'P06', hex: '#FF6D00', r: 255, g: 109, b: 0 },
  { code: 'P07', hex: '#FFAB00', r: 255, g: 171, b: 0 },
  { code: 'P08', hex: '#2B3F87', r: 43,  g: 63,  b: 135 },
  { code: 'P09', hex: '#3D5AFE', r: 61,  g: 90, b: 254 },
  { code: 'P10', hex: '#1C753E', r: 28,  g: 117, b: 62 },
  { code: 'P11', hex: '#43A047', r: 67,  g: 160, b: 71 },
  { code: 'P12', hex: '#7B1FA2', r: 123, g: 31,  b: 162 },
  { code: 'P13', hex: '#AD1457', r: 173, g: 20,  b: 87 },
  { code: 'P14', hex: '#00ACC1', r: 0,   g: 172, b: 193 },
  { code: 'P15', hex: '#0D47A1', r: 13,  g: 71,  b: 161 },
  { code: 'P16', hex: '#C62828', r: 198, g: 40,  b: 40 },
  { code: 'P17', hex: '#E65100', r: 230, g: 81,  b: 0 },
  { code: 'P18', hex: '#2E2F32', r: 46,  g: 47,  b: 50 },
  { code: 'P19', hex: '#FF80AB', r: 255, g: 128, b: 171 },
  { code: 'P20', hex: '#C2185B', r: 194, g: 24,  b: 91 },
  { code: 'P21', hex: '#00BCD4', r: 0,   g: 188, b: 212 },
  { code: 'P22', hex: '#66BB6A', r: 102, g: 187, b: 106 },
  { code: 'P23', hex: '#81C784', r: 129, g: 199, b: 132 },
  { code: 'P24', hex: '#FFC107', r: 255, g: 193, b: 7 },
  { code: 'P25', hex: '#FFB74D', r: 255, g: 183, b: 77 },
  { code: 'P26', hex: '#FFF176', r: 255, g: 241, b: 118 },
  { code: 'P27', hex: '#E0E0E0', r: 224, g: 224, b: 224 },
  { code: 'P28', hex: '#9E9E9E', r: 158, g: 158, b: 158 },
  { code: 'P29', hex: '#546E7A', r: 84,  g: 110, b: 122 },
  { code: 'P30', hex: '#795548', r: 121, g: 85,  b: 72 },
  { code: 'P31', hex: '#A1887F', r: 161, g: 136, b: 127 },
  { code: 'P32', hex: '#D7CCC8', r: 215, g: 204, b: 200 },
  { code: 'P33', hex: '#4DB6AC', r: 77,  g: 182, b: 172 },
  { code: 'P34', hex: '#4FC3F7', r: 79,  g: 195, b: 247 },
  { code: 'P35', hex: '#64B5F6', r: 100, g: 181, b: 246 },
  { code: 'P36', hex: '#5C6BC0', r: 92,  g: 107, b: 192 },
  { code: 'P37', hex: '#CE93D8', r: 206, g: 147, b: 216 },
  { code: 'P38', hex: '#F48FB1', r: 244, g: 143, b: 177 },
  { code: 'P39', hex: '#AED581', r: 174, g: 213, b: 129 },
  { code: 'P40', hex: '#8D6E63', r: 141, g: 110, b: 99 },
  { code: 'P41', hex: '#F44336', r: 244, g: 67,  b: 54 },
  { code: 'P42', hex: '#880E4F', r: 136, g: 14,  b: 79 },
  { code: 'P43', hex: '#004D40', r: 0,   g: 77,  b: 64 },
  { code: 'P44', hex: '#D84315', r: 216, g: 67,  b: 21 },
  { code: 'P45', hex: '#FF5722', r: 255, g: 87,  b: 34 },
  { code: 'P46', hex: '#6A1B9A', r: 106, g: 27,  b: 154 },
  { code: 'P47', hex: '#311B92', r: 49,  g: 27,  b: 146 },

  // 珠光色 (6色)
  { code: 'P48', hex: '#F8BBD0', r: 248, g: 187, b: 208 },
  { code: 'P49', hex: '#CE93D8', r: 206, g: 147, b: 216 },
  { code: 'P50', hex: '#90CAF9', r: 144, g: 202, b: 249 },
  { code: 'P51', hex: '#80DEEA', r: 128, g: 222, b: 234 },
  { code: 'P52', hex: '#A5D6A7', r: 165, g: 214, b: 167 },
  { code: 'P53', hex: '#FFF59D', r: 255, g: 245, b: 157 },

  // 霓虹色 (4色)
  { code: 'P54', hex: '#76FF03', r: 118, g: 255, b: 3 },
  { code: 'P55', hex: '#00E5FF', r: 0,   g: 229, b: 255 },
  { code: 'P56', hex: '#FF1744', r: 255, g: 23,  b: 68 },
  { code: 'P57', hex: '#F50057', r: 245, g: 0,   b: 87 },
];

// ============================================================
// 品牌定义
// ============================================================

const BRANDS = {
  MARD: {
    id: 'MARD',
    name: 'MARD',
    fullName: 'MARD 拼豆色卡',
    description: '291 色 · 15 系列',
    palette: MARD_PALETTE,
    series: MARD_SERIES,
    hasSeries: true,
  },
  PERLER: {
    id: 'PERLER',
    name: 'Perler',
    fullName: 'Perler 拼豆色卡',
    description: '57 色 · 标准实色/珠光/霓虹',
    palette: PERLER_PALETTE,
    hasSeries: false,
  },
};

// ============================================================
// 工具函数
// ============================================================

/** 从色号提取系列前缀 */
function getSeriesFromCode(code) {
  // ZG 系列特殊处理（两位前缀）
  if (code.startsWith('ZG')) return 'ZG';
  // 提取字母前缀
  return code.replace(/\d+$/, '');
}

/** 获取 MARD 某系列的色号数量 */
function getMardSeriesCount(seriesId) {
  return MARD_PALETTE.filter(c => getSeriesFromCode(c.code) === seriesId).length;
}

// ============================================================
// CIE Lab 色彩空间转换工具
// 用于更精确的颜色匹配 (人眼感知加权)
// ============================================================

const ColorUtils = {
  /**
   * RGB → 线性 RGB (gamma 解码)
   */
  _srgbToLinear(c) {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  },

  /**
   * RGB → CIE XYZ
   */
  rgbToXyz(r, g, b) {
    const lr = this._srgbToLinear(r);
    const lg = this._srgbToLinear(g);
    const lb = this._srgbToLinear(b);
    return {
      x: 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb,
      y: 0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb,
      z: 0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb,
    };
  },

  /**
   * CIE XYZ → CIE Lab
   */
  xyzToLab(x, y, z) {
    // D65 白点
    const xn = 0.95047, yn = 1.00000, zn = 1.08883;
    const fx = x / xn, fy = y / yn, fz = z / zn;
    const f = (t) => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
    const L = 116 * f(fy) - 16;
    const a = 500 * (f(fx) - f(fy));
    const bVal = 200 * (f(fy) - f(fz));
    return { L, a, b: bVal };
  },

  /**
   * RGB → CIE Lab
   */
  rgbToLab(r, g, b) {
    const xyz = this.rgbToXyz(r, g, b);
    return this.xyzToLab(xyz.x, xyz.y, xyz.z);
  },

  /**
   * CIE76 ΔE (色差距离)
   * 值越小，人眼感知的颜色差异越小
   */
  deltaE(lab1, lab2) {
    return Math.sqrt(
      Math.pow(lab1.L - lab2.L, 2) +
      Math.pow(lab1.a - lab2.a, 2) +
      Math.pow(lab1.b - lab2.b, 2)
    );
  },

  /**
   * 加权欧氏距离 (兼顾 RGB 直观性和感知差异)
   * 权重参考人眼对红绿更敏感的特性
   */
  weightedRgbDistance(r1, g1, b1, r2, g2, b2) {
    const rmean = (r1 + r2) / 2;
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(
      (2 + rmean / 256) * dr * dr +
      4 * dg * dg +
      (2 + (255 - rmean) / 256) * db * db
    );
  },
};

// ============================================================
// K-Means 颜色聚类器
// 用于限制颜色种类，合并相似颜色
// ============================================================

class ColorQuantizer {
  /**
   * K-Means 聚类
   * @param {Array<{r, g, b}>} colors 输入颜色数组
   * @param {number} k 目标颜色数
   * @param {number} maxIterations 最大迭代次数
   * @returns {Array<{r, g, b}>} 聚类中心颜色
   */
  static kmeans(colors, k, maxIterations = 20) {
    if (colors.length <= k) return colors;

    // 随机选择初始聚类中心
    const centers = [];
    const indices = new Set();
    while (indices.size < k) {
      indices.add(Math.floor(Math.random() * colors.length));
    }
    for (const i of indices) {
      centers.push({ ...colors[i] });
    }

    // 迭代优化
    for (let iter = 0; iter < maxIterations; iter++) {
      // 分配每个颜色到最近的中心
      const clusters = Array.from({ length: k }, () => []);
      for (const color of colors) {
        let minDist = Infinity;
        let bestIdx = 0;
        for (let i = 0; i < k; i++) {
          const dist = ColorUtils.weightedRgbDistance(
            color.r, color.g, color.b,
            centers[i].r, centers[i].g, centers[i].b
          );
          if (dist < minDist) {
            minDist = dist;
            bestIdx = i;
          }
        }
        clusters[bestIdx].push(color);
      }

      // 更新聚类中心
      let changed = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) continue;
        const avgR = clusters[i].reduce((s, c) => s + c.r, 0) / clusters[i].length;
        const avgG = clusters[i].reduce((s, c) => s + c.g, 0) / clusters[i].length;
        const avgB = clusters[i].reduce((s, c) => s + c.b, 0) / clusters[i].length;
        if (Math.abs(centers[i].r - avgR) > 0.5 ||
            Math.abs(centers[i].g - avgG) > 0.5 ||
            Math.abs(centers[i].b - avgB) > 0.5) {
          changed = true;
        }
        centers[i] = { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) };
      }

      if (!changed) break;
    }

    return centers;
  }

  /**
   * 将颜色量化到指定的聚类中心
   * @param {{r, g, b}} color 输入颜色
   * @param {Array<{r, g, b}>} centers 聚类中心
   * @returns {{r, g, b}} 最近的聚类中心
   */
  static quantize(color, centers) {
    let minDist = Infinity;
    let best = centers[0];
    for (const center of centers) {
      const dist = ColorUtils.weightedRgbDistance(
        color.r, color.g, color.b,
        center.r, center.g, center.b
      );
      if (dist < minDist) {
        minDist = dist;
        best = center;
      }
    }
    return best;
  }
}

// ============================================================
// 背景处理器
// 用于检测和忽略背景色
// ============================================================

class BackgroundProcessor {
  /**
   * 自动检测背景色（取图片四角最常见的颜色）
   * @param {Uint8ClampedArray} pixelData RGBA 像素数据
   * @param {number} width 图片宽度
   * @param {number} height 图片高度
   * @returns {{r, g, b}} 检测到的背景色
   */
  static detectBackground(pixelData, width, height) {
    const sampleSize = 5; // 从角落采样区域大小
    const cornerColors = [];

    // 四角采样
    const corners = [
      { x: 0, y: 0 },                           // 左上
      { x: width - sampleSize, y: 0 },          // 右上
      { x: 0, y: height - sampleSize },         // 左下
      { x: width - sampleSize, y: height - sampleSize }, // 右下
    ];

    for (const corner of corners) {
      for (let dy = 0; dy < sampleSize; dy++) {
        for (let dx = 0; dx < sampleSize; dx++) {
          const idx = ((corner.y + dy) * width + (corner.x + dx)) * 4;
          cornerColors.push({
            r: pixelData[idx],
            g: pixelData[idx + 1],
            b: pixelData[idx + 2],
          });
        }
      }
    }

    // 取平均值作为背景色
    const avgR = Math.round(cornerColors.reduce((s, c) => s + c.r, 0) / cornerColors.length);
    const avgG = Math.round(cornerColors.reduce((s, c) => s + c.g, 0) / cornerColors.length);
    const avgB = Math.round(cornerColors.reduce((s, c) => s + c.b, 0) / cornerColors.length);

    return { r: avgR, g: avgG, b: avgB };
  }

  /**
   * 检查颜色是否为背景色
   * @param {{r, g, b}} color 待检查颜色
   * @param {{r, g, b}} bgColor 背景色
   * @param {number} threshold 相似度阈值 (0-100)
   * @returns {boolean}
   */
  static isBackground(color, bgColor, threshold = 15) {
    const dist = ColorUtils.weightedRgbDistance(
      color.r, color.g, color.b,
      bgColor.r, bgColor.g, bgColor.b
    );
    // 将距离映射到 0-100 范围
    const normalizedDist = (dist / Math.sqrt(255*255*3)) * 100;
    return normalizedDist < threshold;
  }

  /**
   * 处理像素数据，将背景设为透明或白色
   * @param {Uint8ClampedArray} pixelData RGBA 像素数据
   * @param {{r, g, b}} bgColor 背景色
   * @param {number} threshold 阈值
   * @param {string} replacement 替换方式: 'transparent' | 'white' | 'custom'
   * @param {{r, g, b}} customColor 自定义替换色
   * @returns {Uint8ClampedArray} 处理后的像素数据
   */
  static processBackground(pixelData, bgColor, threshold = 15, replacement = 'transparent', customColor = null) {
    const result = new Uint8ClampedArray(pixelData.length);

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];

      if (this.isBackground({ r, g, b }, bgColor, threshold)) {
        // 背景处理
        if (replacement === 'transparent') {
          result[i] = 255;
          result[i + 1] = 255;
          result[i + 2] = 255;
          result[i + 3] = 0; // 透明
        } else if (replacement === 'white') {
          result[i] = 255;
          result[i + 1] = 255;
          result[i + 2] = 255;
          result[i + 3] = 255;
        } else if (replacement === 'custom' && customColor) {
          result[i] = customColor.r;
          result[i + 1] = customColor.g;
          result[i + 2] = customColor.b;
          result[i + 3] = 255;
        }
      } else {
        // 保留原色
        result[i] = r;
        result[i + 1] = g;
        result[i + 2] = b;
        result[i + 3] = pixelData[i + 3];
      }
    }

    return result;
  }
}

// ============================================================
// 颜色匹配器 (支持多品牌 + 系列筛选)
// 使用 CIE Lab ΔE 作为主要匹配标准，确保人眼感知准确
// ============================================================

class ColorMatcher {
  constructor() {
    /** 当前活跃的色卡 */
    this._activePalette = MARD_PALETTE;
    /** 当前品牌ID */
    this._activeBrand = 'MARD';
    /** 当前选中的 MARD 系列 (全部) */
    this._activeSeries = null; // null 表示全部
    /** Lab 缓存 */
    this._labCache = new Map();
    /** 缓存的色卡数组引用（用于 findClosest 遍历） */
    this._filteredPalette = MARD_PALETTE;

    // 预计算全量 Lab 缓存
    this._buildLabCache(MARD_PALETTE);
    this._buildLabCache(PERLER_PALETTE);
  }

  /**
   * 预计算色卡的 Lab 值
   * @private
   */
  _buildLabCache(palette) {
    for (const color of palette) {
      if (!this._labCache.has(color.code)) {
        this._labCache.set(color.code, ColorUtils.rgbToLab(color.r, color.g, color.b));
      }
    }
  }

  /**
   * 获取当前品牌配置
   * @returns {string} 品牌ID
   */
  getBrand() {
    return this._activeBrand;
  }

  /**
   * 获取当前选中的 MARD 系列列表
   * @returns {string[]|null} 系列ID数组，null表示全部
   */
  getActiveSeries() {
    return this._activeSeries;
  }

  /**
   * 切换品牌
   * @param {string} brandId 品牌ID ('MARD' | 'PERLER')
   */
  setBrand(brandId) {
    const brand = BRANDS[brandId];
    if (!brand) return;

    this._activeBrand = brandId;
    this._activePalette = brand.palette;
    this._activeSeries = null; // 切换品牌时重置系列选择
    this._rebuildFilteredPalette();
  }

  /**
   * 设置 MARD 系列筛选
   * @param {string[]|null} seriesIds 系列ID数组，null表示全部
   */
  setSeriesFilter(seriesIds) {
    if (this._activeBrand !== 'MARD') return;

    if (seriesIds === null || seriesIds.length === 0) {
      this._activeSeries = null;
    } else {
      this._activeSeries = seriesIds;
    }
    this._rebuildFilteredPalette();
  }

  /**
   * 重建过滤后的色卡
   * @private
   */
  _rebuildFilteredPalette() {
    if (this._activeBrand === 'MARD' && this._activeSeries) {
      const seriesSet = new Set(this._activeSeries);
      this._filteredPalette = this._activePalette.filter(c => seriesSet.has(getSeriesFromCode(c.code)));
    } else {
      this._filteredPalette = this._activePalette;
    }
  }

  /**
   * 获取当前过滤后的色卡
   * @returns {Array} 色卡数组
   */
  getFilteredPalette() {
    return this._filteredPalette;
  }

  /**
   * 获取当前色卡总数
   * @returns {number}
   */
  getColorCount() {
    return this._filteredPalette.length;
  }

  /**
   * 找到与给定 RGB 最匹配的色号
   * 使用 CIE Lab ΔE 双重校验确保准确
   * @param {number} r 0-255
   * @param {number} g 0-255
   * @param {number} b 0-255
   * @returns {{ code: string, hex: string, r: number, g: number, b: number, distance: number }}
   */
  findClosest(r, g, b) {
    let bestMatch = null;
    let bestDeltaE = Infinity;

    const targetLab = ColorUtils.rgbToLab(r, g, b);

    for (const color of this._filteredPalette) {
      const colorLab = this._labCache.get(color.code);
      const de = ColorUtils.deltaE(targetLab, colorLab);

      if (de < bestDeltaE) {
        bestDeltaE = de;
        bestMatch = { ...color, distance: de };
      }
    }

    return bestMatch;
  }

  /**
   * 批量匹配像素颜色
   * @param {Uint8ClampedArray} pixelData 图像数据 (RGBA)
   * @returns {Array<{ code, hex, distance }>}
   */
  matchPixels(pixelData) {
    const results = [];
    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      results.push(this.findClosest(r, g, b));
    }
    return results;
  }

  /**
   * 统计颜色用量
   * @param {Array<{ code, hex }>} matchedColors 匹配后的颜色数组
   * @returns {Array<{ code, hex, count, percentage }>} 按用量降序排列
   */
  countColors(matchedColors) {
    const counts = {};
    for (const color of matchedColors) {
      const key = color.code;
      if (!counts[key]) {
        counts[key] = { code: color.code, hex: color.hex, r: color.r, g: color.g, b: color.b, count: 0 };
      }
      counts[key].count++;
    }

    const total = matchedColors.length;
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        ...item,
        percentage: ((item.count / total) * 100).toFixed(1),
      }));
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MARD_PALETTE, PERLER_PALETTE, MARD_SERIES, BRANDS,
    ColorUtils, ColorMatcher, ColorQuantizer, BackgroundProcessor,
    getSeriesFromCode, getMardSeriesCount,
  };
}
