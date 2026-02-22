import type { ShoppingItem } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';

/**
 * 生成纯文本格式的购物清单
 */
export function generateTextList(
  listName: string,
  items: ShoppingItem[]
): string {
  const lines: string[] = [`📋 ${listName}`, ''];

  // 按类别分组
  const groupedItems = new Map<string, ShoppingItem[]>();
  items.forEach((item) => {
    const cat = INGREDIENT_CATEGORIES.find((c) => c.id === item.category);
    const categoryName = cat ? `${cat.icon} ${cat.name}` : '📦 其他';
    const categoryItems = groupedItems.get(categoryName) || [];
    categoryItems.push(item);
    groupedItems.set(categoryName, categoryItems);
  });

  groupedItems.forEach((categoryItems, categoryName) => {
    lines.push(categoryName);
    categoryItems.forEach((item) => {
      const checkbox = item.checked ? '✅' : '⬜';
      lines.push(`${checkbox} ${item.name}${item.quantity ? ` - ${item.quantity}` : ''}`);
    });
    lines.push('');
  });

  return lines.join('\n');
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
