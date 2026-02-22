import type { ShoppingItem } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';

/**
 * 生成 Apple Reminders URL Scheme
 * iOS 支持的格式：reminders://
 */
export function generateRemindersUrl(
  listName: string,
  items: ShoppingItem[]
): string {
  // 生成清单内容
  const lines: string[] = [];

  // 按类别分组
  const groupedItems = new Map<string, ShoppingItem[]>();
  items.forEach((item) => {
    const cat = INGREDIENT_CATEGORIES.find((c) => c.id === item.category);
    const categoryName = cat ? cat.name : '其他';
    const categoryItems = groupedItems.get(categoryName) || [];
    categoryItems.push(item);
    groupedItems.set(categoryName, categoryItems);
  });

  groupedItems.forEach((categoryItems, categoryName) => {
    lines.push(`【${categoryName}】`);
    categoryItems.forEach((item) => {
      if (!item.checked) {
        lines.push(`☐ ${item.name}${item.quantity ? ` ${item.quantity}` : ''}`);
      }
    });
  });

  const title = `购物清单: ${listName}`;
  const notesText = lines.join('\n');

  // 使用 reminders:// URL scheme (iOS 13+)
  // 格式：reminders://x-callback-url/create?title=xxx&notes=xxx
  const params = new URLSearchParams({
    'x-success': window.location.href,
    title: title,
    notes: notesText,
  });

  return `reminders://x-callback-url/create?${params.toString()}`;
}

/**
 * 导出购物清单到 Apple Reminders
 */
export function exportToReminders(
  listName: string,
  items: ShoppingItem[]
): boolean {
  const url = generateRemindersUrl(listName, items);

  // 使用 window.open 而不是 location.href
  const newWindow = window.open(url, '_self');

  // 如果无法打开，返回 false
  return newWindow !== null;
}

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
      const checkbox = item.checked ? '[x]' : '[ ]';
      lines.push(`  ${checkbox} ${item.name}${item.quantity ? ` - ${item.quantity}` : ''}`);
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
