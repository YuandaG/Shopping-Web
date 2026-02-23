import type { IngredientMerge } from '../types';

/**
 * Get the canonical name for an ingredient, applying merge rules
 */
export function getCanonicalName(name: string, merges: IngredientMerge[]): string {
  const lowerName = name.toLowerCase().trim();

  for (const merge of merges) {
    // Check if the name matches the canonical name
    if (merge.canonicalName.toLowerCase() === lowerName) {
      return merge.canonicalName;
    }
    // Check if the name matches any source name
    for (const source of merge.sourceNames) {
      if (source.toLowerCase() === lowerName) {
        return merge.canonicalName;
      }
    }
  }

  return name;
}

/**
 * Calculate similarity between two strings (Levenshtein distance based)
 */
export function calculateSimilarity(a: string, b: string): number {
  const str1 = a.toLowerCase().trim();
  const str2 = b.toLowerCase().trim();

  if (str1 === str2) return 1;

  // Check if one contains the other
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.8;
  }

  // Levenshtein distance
  const matrix: number[][] = [];

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[str1.length][str2.length];
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

/**
 * Find similar ingredients that might need merging
 */
export function findSimilarIngredients(
  names: string[],
  merges: IngredientMerge[],
  threshold: number = 0.7
): { name1: string; name2: string; similarity: number }[] {
  const similarPairs: { name1: string; name2: string; similarity: number }[] = [];
  const uniqueNames = [...new Set(names.map((n) => n.toLowerCase().trim()))];

  // Get all names that are already merged
  const mergedNames = new Set<string>();
  merges.forEach((m) => {
    mergedNames.add(m.canonicalName.toLowerCase());
    m.sourceNames.forEach((s) => mergedNames.add(s.toLowerCase()));
  });

  for (let i = 0; i < uniqueNames.length; i++) {
    for (let j = i + 1; j < uniqueNames.length; j++) {
      // Skip if both are already in merge rules
      if (mergedNames.has(uniqueNames[i]) && mergedNames.has(uniqueNames[j])) {
        continue;
      }

      const similarity = calculateSimilarity(uniqueNames[i], uniqueNames[j]);
      if (similarity >= threshold && similarity < 1) {
        similarPairs.push({
          name1: uniqueNames[i],
          name2: uniqueNames[j],
          similarity,
        });
      }
    }
  }

  return similarPairs.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Create a new merge rule
 */
export function createMerge(canonicalName: string, sourceNames: string[]): IngredientMerge {
  return {
    canonicalName,
    sourceNames: sourceNames.filter((n) => n.toLowerCase() !== canonicalName.toLowerCase()),
  };
}
