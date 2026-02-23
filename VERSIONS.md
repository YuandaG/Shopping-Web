# 版本历史

本文档记录 Shopping Web 的所有版本更新，方便快速回滚和了解功能演变。

---

## v1.5.0 (2026-02-23) - 当前版本

### 新增功能
- ✨ **深色模式** - 浅色/深色/跟随系统切换
- ✨ **菜谱图片** - 支持 URL 或本地上传（Base64，最大 2MB）
- ✨ **PWA 离线支持** - 可安装到桌面，支持离线访问
- ✨ **智能食材合并** - 相似名称检测 + 手动合并规则
- ✨ **更新提示** - PWA 新版本自动提示刷新
- ✨ 桌面端响应式布局（侧边栏导航）
- ✨ 菜谱页面网格布局
- ✨ 悬停动效优化

### 技术改进
- 新增 `src/theme/` 主题模块
- 新增 `src/utils/ingredientMerge.ts` 食材合并算法
- 新增 `src/components/IngredientMergeManager.tsx`
- 新增 `src/components/UpdateNotification.tsx`
- 新增 `public/pwa-*.svg` PWA 图标
- 配置 `vite-plugin-pwa`
- Tailwind CSS 4 深色模式配置

### Git Commits
```
21cad64 Release v1.5.0: Dark mode, recipe images, PWA, and ingredient merging
42f282d Fix dark mode for Tailwind CSS 4
a43c503 Add PWA update notification banner
```

---

## v1.4.0 (2026-02-22)

### 新增功能
- ✨ 中英双语支持（i18n）
- ✨ 设置页面添加语言切换
- ✨ 快捷指令名称跟随语言（"购物清单" / "Shopping List"）
- ✨ 浏览器语言自动检测

### 技术改进
- 新增 `src/i18n/` 国际化模块
- 所有组件使用 `useLanguage()` hook
- 语言偏好存储在 localStorage

### Git Commit
```
d0e6a52 Add bilingual support (Chinese/English) with language selector
```

---

## v1.3.0 (2026-02-21)

### 新增功能
- ✨ 快捷指令设置指南（设置页面常驻入口）
- ✨ GitHub 设置向导（新手友好）
- ✨ 清单项快速删除按钮
- ✨ 同步操作确认对话框

### UI 改进
- 现代化圆角设计
- 更好的间距和布局
- 优化的阴影效果

### Git Commit
```
f1d2900 Add shortcut guide and improve UI
```

---

## v1.2.0 (2026-02-20)

### 新增功能
- ✨ 导出到 Apple Reminders
- ✨ iOS 快捷指令支持（逐项勾选）
- ✨ 复制到剪贴板功能

### Bug 修复
- 修复 Reminders URL scheme 无效问题
- 使用快捷指令替代直接 URL scheme

---

## v1.1.0 (2026-02-19)

### 新增功能
- ✨ GitHub Gist 云端同步
- ✨ 多人协作共享
- ✨ Personal Access Token 认证

### Bug 修复
- 修复 "Bad credentials" 错误（Authorization header 格式）
- 修复 Token 加载后消失问题

---

## v1.0.0 (2026-02-18)

### 核心功能
- ✨ 菜谱管理（CRUD）
- ✨ 食材分类（11 类）
- ✨ 购物清单生成
- ✨ 食材聚合（相同食材自动合并）
- ✨ 历史清单记录
- ✨ 本地数据备份（JSON 导入/导出）

### 技术栈
- React 18 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand（状态管理）
- GitHub Pages 部署

---

## 版本回滚指南

如果需要回滚到特定版本：

```bash
# 查看所有提交
git log --oneline

# 回滚到特定版本
git checkout <commit-hash>

# 或者创建新分支保留当前工作
git checkout -b rollback-v<version> <commit-hash>
```

### 版本 Commit Hash 参考

| 版本 | Commit Hash |
|------|-------------|
| v1.5.0 | 21cad64 |
| v1.4.0 | d0e6a52 |
| v1.3.0 | f1d2900 |

---

## 下一版本计划 (v1.6.0)

- [ ] 食材单位智能换算（500g + 300g = 800g）
- [ ] 菜谱步骤/做法支持
- [ ] 购物清单分享（生成链接）
- [ ] 更多 PWA 功能（推送通知）
