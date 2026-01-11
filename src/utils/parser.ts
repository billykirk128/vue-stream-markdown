import type { ParsedNode } from '../types'

const MIDDLE_DOLLAR_PATTERN = /[^$]\$[^$]/
const START_DOLLAR_PATTERN = /^\$[^$]/
const END_DOLLAR_PATTERN = /[^$]\$$/

export function checkMathSyntax(content: string, singleDollarEnabled: boolean = false): boolean {
  const hasDoubleDollar = content.includes('$$')
  const hasSingleDollar
    = singleDollarEnabled
      && (MIDDLE_DOLLAR_PATTERN.test(content)
        || START_DOLLAR_PATTERN.test(content)
        || END_DOLLAR_PATTERN.test(content))
  return hasDoubleDollar || hasSingleDollar
}

export function findLastLeafNode(nodes: ParsedNode[]): ParsedNode | null {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    const nodeWithChildren = node as { children?: ParsedNode[] }
    if (nodeWithChildren.children && nodeWithChildren.children.length > 0) {
      const found = findLastLeafNode(nodeWithChildren.children)
      if (found)
        return found
      continue
    }
    return node ?? null
  }
  return null
}

export function findNodeParent(
  targetNode: ParsedNode,
  nodes: ParsedNode[],
  parent?: { children: ParsedNode[] },
): {
  parent: { children: ParsedNode[] }
  index: number
} | null {
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i] === targetNode && parent)
      return { parent, index: i }

    const node = nodes[i] as { children: ParsedNode[] }
    if (node.children) {
      const result = findNodeParent(
        targetNode,
        node.children,
        node,
      )
      if (result)
        return result
    }
  }
  return null
}
