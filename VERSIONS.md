# 版本历史

本文档记录 Shopping Web 的所有版本更新，方便快速回滚和了解功能演变。

---

## v1.5.0 (2026-02-23) - 当前版本

### 新增功能
- ✨ 桌面端响应式布局
- ✨ 侧边栏导航（桌面端）
- ✨ 菜谱页面网格布局（平板/桌面）
- ✨ 首页四栏统计卡片（桌面端）
- ✨ 设置页面两列布局（桌面端）

### 技术改进
- 新增 `src/components/Sidebar.tsx` 桌面侧边栏组件
- 使用 Tailwind 响应式断点 (sm/md/lg)
- 移动端保持底部导航，桌面端使用侧边栏

### Git Commit
```
c40ef09 Add desktop responsive layout (v1.5.0)
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

### Git Commit
```
（之前版本，未记录具体 commit）
```

---

## v1.1.0 (2026-02-19)

### 新增功能
- ✨ GitHub Gist 云端同步
- ✨ 多人协作共享
- ✨ Personal Access Token 认证

### Bug 修复
- 修复 "Bad credentials" 错误（Authorization header 格式）
- 修复 Token 加载后消失问题

### Git Commit
```
（之前版本，未记录具体 commit）
```

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

### Git Commit
```
（初始版本）
```

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
| v1.4.0 | d0e6a52 |
| v1.3.0 | f1d2900 |

---

## 下一版本计划 (v1.5.0)

- [ ] 食材智能合并（相似名称检测）
- [ ] 菜谱图片支持
- [ ] 深色模式切换
- [ ] PWA 离线支持
