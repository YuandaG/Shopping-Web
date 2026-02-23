# Shopping List Assistant - 购物清单助手

> 一个支持云端同步、多人协作的菜谱管理与购物清单应用

[![Deploy to GitHub Pages](https://github.com/YuandaGao/Shopping-Web/actions/workflows/deploy.yml/badge.svg)](https://github.com/YuandaGao/Shopping-Web/actions/workflows/deploy.yml)

**在线体验**: [https://yuandag.github.io/Shopping-Web/](https://yuandag.github.io/Shopping-Web/)

---

## 功能特性

- **菜谱管理** - 创建、编辑、删除菜谱，支持图片和标签
- **智能购物清单** - 从菜谱自动生成清单，相同食材自动合并
- **云端同步** - 通过 GitHub Gist 实现多人协作
- **导出到提醒事项** - 配合 iOS 快捷指令，逐项勾选
- **中英双语** - 完整的国际化支持
- **深色模式** - 支持浅色/深色/跟随系统
- **PWA 支持** - 可安装到桌面，支持离线访问

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | 前端框架 |
| Vite 7 | 构建工具 |
| Tailwind CSS 4 | 样式方案 |
| Zustand | 状态管理 |
| GitHub Gist API | 云端存储 |
| vite-plugin-pwa | PWA 支持 |

---

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

---

## 截图

### 移动端
- 底部导航栏
- 紧凑的卡片布局
- 触摸友好的交互

### 桌面端
- 侧边栏导航
- 网格布局展示
- 响应式设计

---

## 文档

- [PROJECT.md](./PROJECT.md) - 项目结构与开发指南
- [VERSIONS.md](./VERSIONS.md) - 版本历史

---

## License

MIT
