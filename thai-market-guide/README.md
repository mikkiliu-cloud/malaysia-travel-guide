# 泰国市集攻略 · Thai Market Atlas

一套杂志风格的泰国市集攻略，**每个城市一个独立页面**（纯静态，无需构建）。

[👉 打开首页](./index.html)

**6 座城市 · 26 个市集 · 10 个精华 · 9 种市集类型**

## 结构（每城一页）

| 页面 | 城市 | 市集数 |
|------|------|--------|
| [index.html](./index.html) | 首页 · 城市导航 + 全国地图 | — |
| [bangkok.html](./bangkok.html) | 曼谷 Bangkok | 12 |
| [chiangmai.html](./chiangmai.html) | 清迈 Chiang Mai | 5 |
| [phuket.html](./phuket.html) | 普吉 Phuket | 3 |
| [huahin.html](./huahin.html) | 华欣 Hua Hin | 3 |
| [pattaya.html](./pattaya.html) | 芭提雅 Pattaya | 2 |
| [ayutthaya.html](./ayutthaya.html) | 大城 Ayutthaya | 1 |

## 功能

- **每城一页** — 顶部导航 / 首页城市卡片 / 全国互动地图，点击进入各城分页
- **筛选 · 搜索 · 收藏** — 每页可按类型筛选、关键词搜索、❤️ 收藏（localStorage 全站共享）
- **市集卡片** — 营业时间、怎么去、必吃、避坑提示、💰 预算分级
- **主题路线** — 各城专属的市集串联路线
- **节庆日历 & 实用 Tips** — 集中在首页

## 文件

- `index.html` — 首页
- `bangkok.html` / `chiangmai.html` / … — 各城分页（极简模板，内容由脚本渲染）
- `styles.css` — 共享样式
- `data.js` — 全部市集与城市数据（单一数据源）
- `app.js` — 导航、卡片渲染、筛选、收藏逻辑

新增/修改市集只需编辑 `data.js`，所有页面自动更新。

## 使用

浏览器直接打开 `index.html` 即可。
