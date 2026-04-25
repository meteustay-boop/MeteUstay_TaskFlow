// Fractional indexing utilities for maintaining order

const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const BASE = CHARSET.length

/**
 * Generate a position string between two positions
 */
export function generatePosition(before?: string, after?: string): string {
  if (!before && !after) {
    return "n" // Middle of alphabet
  }

  if (!before) {
    // Insert at the beginning
    const firstChar = after!.charAt(0)
    const idx = CHARSET.indexOf(firstChar)
    if (idx > 0) {
      return CHARSET.charAt(Math.floor(idx / 2))
    }
    return CHARSET.charAt(0) + "n"
  }

  if (!after) {
    // Insert at the end
    const lastChar = before.charAt(before.length - 1)
    const idx = CHARSET.indexOf(lastChar)
    if (idx < BASE - 1) {
      return before.slice(0, -1) + CHARSET.charAt(Math.floor((idx + BASE) / 2))
    }
    return before + "n"
  }

  // Insert between two positions
  let result = ""
  let i = 0

  while (true) {
    const beforeChar = i < before.length ? before.charAt(i) : CHARSET.charAt(0)
    const afterChar = i < after.length ? after.charAt(i) : CHARSET.charAt(BASE - 1)

    const beforeIdx = CHARSET.indexOf(beforeChar)
    const afterIdx = CHARSET.indexOf(afterChar)

    if (beforeIdx < afterIdx - 1) {
      // There's room between
      result += CHARSET.charAt(Math.floor((beforeIdx + afterIdx) / 2))
      return result
    } else if (beforeIdx === afterIdx) {
      result += beforeChar
      i++
    } else {
      // beforeIdx >= afterIdx - 1, need to go deeper
      result += beforeChar
      i++
      // Continue to next level
      const nextAfterIdx = i < after.length ? CHARSET.indexOf(after.charAt(i)) : BASE - 1
      if (nextAfterIdx > 0) {
        result += CHARSET.charAt(Math.floor(nextAfterIdx / 2))
        return result
      }
      result += CHARSET.charAt(Math.floor((BASE - 1) / 2))
      return result
    }
  }
}

/**
 * Sort items by their position field
 */
export function sortByPosition<T extends { position: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position.localeCompare(b.position))
}
