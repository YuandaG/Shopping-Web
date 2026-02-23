# Shopping Web - 购物清单管理应用

> 当前版本: v1.5.0 | 最后更新: 2026-02-23

## 项目概述

一个可以托管在 GitHub Pages 的购物清单管理网站，支持：
- 自定义菜谱管理（CRUD + 图片）
- 从菜谱自动生成购物清单（智能合并）
- GitHub Gist 云端同步（多人协作）
- 导出到 Apple Reminders（通过 iOS 快捷指令）
- 中英双语 + 深色模式
- PWA 离线支持

**在线地址**: https://yuandag.github.io/Shopping-Web/

---

## 技术栈

| 层面 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React + TypeScript | 18.x |
| 构建工具 | Vite | 7.x |
| 样式方案 | Tailwind CSS | 4.x |
| 状态管理 | Zustand | 4.x |
| 路由 | React Router | 6.x |
| PWA | vite-plugin-pwa | 0.x |
| 部署平台 | GitHub Pages | - |

---

## 项目结构

```
Shopping-Web/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ExportButton.tsx     # 导出按钮
│   │   ├── GitHubGuide.tsx      # GitHub 设置向导
│   │   ├── IngredientMergeManager.tsx  # 食材合并管理
│   │   ├── Navigation.tsx       # 底部导航栏（移动端）
│   │   ├── RecipeCard.tsx       # 菜谱卡片（含图片）
│   │   ├── RecipeForm.tsx       # 菜谱表单（含图片上传）
│   │   ├── ShortcutGuide.tsx    # 快捷指令设置指南
│   │   ├── Sidebar.tsx          # 侧边栏导航（桌面端）
│   │   ├── ShoppingItem.tsx     # 购物清单项
│   │   └── UpdateNotification.tsx  # PWA 更新提示
│   │
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx             # 首页
│   │   ├── Recipes.tsx          # 菜谱列表
│   │   ├── Settings.tsx         # 设置页
│   │   └── ShoppingList.tsx     # 购物清单
│   │
│   ├── hooks/               # 自定义 Hooks
│   │   └── useGist.ts           # GitHub Gist API 操作
│   │
│   ├── store/               # 状态管理
│   │   └── useStore.ts          # Zustand store（含持久化）
│   │
│   ├── utils/               # 工具函数
│   │   ├── exportToReminders.ts # 导出到 Reminders
│   │   └── ingredientMerge.ts   # 食材合并算法
│   │
│   ├── i18n/                # 国际化
│   │   ├── context.tsx          # 语言 Provider
│   │   ├── translations.ts      # 翻译文件
│   │   └── index.ts             # 导出
│   │
│   ├── theme/               # 主题
│   │   ├── ThemeContext.tsx     # 主题 Provider
│   │   └── index.ts             # 导出
│   │
│   ├── types/               # TypeScript 类型
│   │   └── index.ts             # 所有类型定义
│   │
│   ├── constants.ts         # 常量定义（版本号等）
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
│
├── public/
│   ├── pwa-192x192.svg      # PWA 图标
│   └── pwa-512x512.svg      # PWA 图标
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 部署
│
├── README.md                # 项目简介
├── PROJECT.md               # 本文档
└── VERSIONS.md              # 版本历史
```

---

## 核心功能

### 1. 菜谱管理
- 创建/编辑/删除菜谱
- **菜谱图片** - 支持 URL 或本地上传（Base64，最大 2MB）
- 食材分类（肉类、蔬菜、海鲜、调味料等 11 类）
- 菜谱搜索和标签筛选
- 收藏/置顶功能

### 2. 购物清单
- 从菜谱添加食材到清单（自动聚合相同食材）
- **智能合并** - 检测相似名称，支持手动合并
- 手动添加独立购物项
- 勾选已购买项
- 按类别分组显示
- 历史清单记录

### 3. 云端同步 (GitHub Gist)
- 使用 Personal Access Token 认证
- 多人共享同一 Gist ID
- 加载/保存数据到云端
- 新手设置向导

### 4. 导出到 Reminders
- 方案一：复制到剪贴板 + 打开 Reminders
- 方案二（推荐）：iOS 快捷指令，每个物品单独可勾选
- 导出格式包含来源菜谱（如：西红柿 (2) -- 菜谱1, 菜谱2）

### 5. 国际化
- 中文 / 英文切换
- 快捷指令名称跟随语言
- 浏览器语言自动检测

### 6. 主题
- 浅色 / 深色 / 跟随系统
- 本地存储偏好

### 7. PWA
- 可安装到桌面
- 离线访问支持
- 更新提示横幅

---

## 数据结构

### Recipe (菜谱)
```typescript
interface Recipe {
  id: string;
  name: string;
  description?: string;
  image?: string;           // 图片 URL 或 Base64
  ingredients: Ingredient[];
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### Ingredient (食材)
```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: CategoryId;
}
```

### ShoppingList (购物清单)
```typescript
interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}
```

### ShoppingItem (购物项)
```typescript
interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: CategoryId;
  checked: boolean;
  fromRecipe?: string;      // 来源菜谱名称（逗号分隔）
  fromRecipeId?: string;    // 首个来源菜谱 ID
}
```

### AppSettings (设置)
```typescript
interface AppSettings {
  gistId?: string;          // GitHub Gist ID
  gistToken?: string;       // Personal Access Token
  lastSync?: number;        // 上次同步时间
  ingredientMerges: IngredientMerge[];  // 食材合并规则
}

interface IngredientMerge {
  canonicalName: string;    // 标准名称
  sourceNames: string[];    // 要合并的名称列表
}
```

---

## 关键实现细节

### Tailwind CSS 4 深色模式
```css
/* 使用自定义 variant */
@variant dark (&:where(.dark, .dark *));
```

### GitHub Gist API 认证
```typescript
// Authorization header 必须使用 "token" 而不是 "Bearer"
headers: {
  'Authorization': `token ${token}`,
  'Content-Type': 'application/json',
}
```

### Token 持久化
- `gistToken` 不导出到 Gist（每个用户保持自己的 token）
- `importData` 时保留本地 `gistToken`

### GitHub Pages 部署
- 使用 `HashRouter`（不是 BrowserRouter）
- Vite `base` 配置为仓库名

### PWA 更新机制
- `registerType: 'autoUpdate'`
- 自定义 `UpdateNotification` 组件提示用户刷新

---

## 常见问题与解决方案

### Q: 部署后页面空白？
A: 确保 `HashRouter` 和 `base` 配置正确

### Q: GitHub API 返回 "Bad credentials"？
A: Authorization header 使用 `token ${token}` 格式，不是 `Bearer`

### Q: Token 加载后消失？
A: `importData` 会覆盖 settings，需要保留本地 `gistToken`

### Q: Reminders URL scheme 无效？
A: 使用快捷指令方案代替直接 URL scheme

### Q: 深色模式不生效？
A: Tailwind CSS 4 需要在 CSS 中定义 `@variant dark`

---

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建
npm run preview
```

---

## 食材分类

| ID | 中文名 | English | Icon |
|----|--------|---------|------|
| meat | 肉类 | Meat | 🥩 |
| vegetable | 蔬菜 | Vegetable | 🥬 |
| seafood | 海鲜 | Seafood | 🦐 |
| condiment | 调味料 | Condiment | 🧂 |
| grain | 主食 | Grain | 🍚 |
| dairy | 乳制品 | Dairy | 🥛 |
| drink | 饮品 | Drink | 🥤 |
| fruit | 水果 | Fruit | 🍎 |
| frozen | 冷冻食品 | Frozen | 🧊 |
| snack | 零食 | Snack | 🍿 |
| other | 其他 | Other | 📦 |

---

## 相关文件

- [README.md](./README.md) - 项目简介
- [VERSIONS.md](./VERSIONS.md) - 版本历史
