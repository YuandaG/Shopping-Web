interface ParsedQuantity {
  value: number;
  unit: string;
}

/**
 * 解析数量字符串
 * 例如: "500g" -> { value: 500, unit: "g" }
 *       "2个" -> { value: 2, unit: "个" }
 */
export function parseQuantity(quantity: string): ParsedQuantity | null {
  const trimmed = quantity.trim();
  const match = trimmed.match(/^([\d.]+)\s*(.*)$/);

  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].trim();
    if (!isNaN(value)) {
      return { value, unit };
    }
  }

  return null;
}

/**
 * 格式化数量
 * 例如: { value: 800, unit: "g" } -> "800g"
 */
export function formatQuantity(parsed: ParsedQuantity): string {
  if (parsed.unit) {
    return `${parsed.value}${parsed.unit}`;
  }
  return `${parsed.value}`;
}

/**
 * 合并两个数量
 * 如果单位相同，则相加数值
 * 否则返回逗号分隔的原文
 */
export function mergeQuantities(q1: string, q2: string): string {
  const parsed1 = parseQuantity(q1);
  const parsed2 = parseQuantity(q2);

  if (parsed1 && parsed2 && parsed1.unit === parsed2.unit) {
    const total = parsed1.value + parsed2.value;
    return formatQuantity({ value: total, unit: parsed1.unit });
  }

  // 无法合并时保留原文
  return `${q1}, ${q2}`;
}

/**
 * 聚合食材列表
 * 将相同名称的食材合并
 */
export function aggregateIngredients<T extends { name: string; quantity: string }>(
  items: T[]
): T[] {
  const aggregated = new Map<string, T>();

  items.forEach((item) => {
    const key = item.name.toLowerCase().trim();

    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      (existing as any).quantity = mergeQuantities(existing.quantity, item.quantity);
    } else {
      aggregated.set(key, { ...item });
    }
  });

  return Array.from(aggregated.values());
}

/**
 * 查找相似的食材名称
 * 用于提示用户可能需要合并的食材
 */
export function findSimilarIngredients(
  items: Array<{ name: string }>,
  threshold: number = 0.7
): Array<{ item1: string; item2: string; similarity: number }> {
  const similarities: Array<{ item1: string; item2: string; similarity: number }> = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const sim = calculateSimilarity(items[i].name, items[j].name);
      if (sim >= threshold && sim < 1) {
        similarities.push({
          item1: items[i].name,
          item2: items[j].name,
          similarity: sim,
        });
      }
    }
  }

  return similarities.sort((a, b) => b.similarity - a.similarity);
}

/**
 * 计算两个字符串的相似度 (Jaccard 相似度)
 */
function calculateSimilarity(s1: string, s2: string): number {
  const str1 = s1.toLowerCase().trim();
  const str2 = s2.toLowerCase().trim();

  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;

  // 检查包含关系
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.9;
  }

  // 使用 bigram 计算 Jaccard 相似度
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);

  const intersection = bigrams1.filter((b) => bigrams2.includes(b));
  const union = [...new Set([...bigrams1, ...bigrams2])];

  return intersection.length / union.length;
}

function getBigrams(str: string): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.slice(i, i + 2));
  }
  return bigrams;
}
