import type { ShoppingItem } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';

/**
 * 格式化单个物品的文本，包含来源菜谱
 * 例如：西红柿 (2) -- 油焖鸡，番茄炒蛋
 */
function formatItemWithSource(item: ShoppingItem): string {
  let text = item.quantity ? `${item.name} (${item.quantity})` : item.name;
  if (item.fromRecipe) {
    text += ` -- ${item.fromRecipe}`;
  }
  return text;
}

/**
 * 生成购物清单文本（每行一个物品，方便粘贴到 Reminders）
 */
export function generateTextList(
  _listName: string,
  items: ShoppingItem[]
): string {
  const lines: string[] = [];

  // 只包含未勾选的物品
  const uncheckedItems = items.filter((item) => !item.checked);

  // 按类别分组
  const groupedItems = new Map<string, ShoppingItem[]>();
  uncheckedItems.forEach((item) => {
    const cat = INGREDIENT_CATEGORIES.find((c) => c.id === item.category);
    const categoryName = cat ? `${cat.icon} ${cat.name}` : '📦 其他';
    const categoryItems = groupedItems.get(categoryName) || [];
    categoryItems.push(item);
    groupedItems.set(categoryName, categoryItems);
  });

  groupedItems.forEach((categoryItems, categoryName) => {
    lines.push(`--- ${categoryName} ---`);
    categoryItems.forEach((item) => {
      lines.push(formatItemWithSource(item));
    });
    lines.push(''); // 空行分隔类别
  });

  return lines.join('\n');
}

/**
 * 生成用于 Reminders 的纯文本（不含类别标题，只有物品）
 */
export function generateRemindersText(items: ShoppingItem[]): string {
  const uncheckedItems = items.filter((item) => !item.checked);
  return uncheckedItems
    .map((item) => formatItemWithSource(item))
    .join('\n');
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * 打开 Apple Reminders 应用
 */
export function openRemindersApp(): void {
  window.location.href = 'reminders://';
}

/**
 * 使用 iOS 分享功能
 */
export async function shareToReminders(listName: string, items: ShoppingItem[]): Promise<boolean> {
  const text = `📋 ${listName}\n\n${generateRemindersText(items)}`;

  // 检查是否支持 Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: `购物清单: ${listName}`,
        text: text,
      });
      return true;
    } catch (err) {
      // 用户取消或分享失败
      console.log('Share cancelled or failed:', err);
      return false;
    }
  }
  return false;
}
