<script setup lang="ts">
import type { NodeRendererListProps, NodeType, ParsedNode } from '../types'
import { computed } from 'vue'
import { useContext } from '../composables'
import Markdown from './markdown.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<NodeRendererListProps>(), {
  nodes: () => [],
})

const { mode, enableAnimate } = useContext()

const enableTransition = computed(() => {
  if (typeof enableAnimate.value === 'boolean')
    return enableAnimate.value
  return mode.value === 'streaming'
})

const nodes = computed(() => props.nodes?.map((node, index) => ({
  node,
  index,
  key: getNodeKey(node, index),
})))

// exclude nodes that should not be transitioned
const excludeTransition: NodeType[] = ['code']

function getNodeComponent(node: ParsedNode) {
  return props.nodeRenderers[node.type] || Markdown
}

function getNodeBindings(node: ParsedNode) {
  return { ...props, node, nodes: undefined }
}

function getNodeKey(node: ParsedNode, index: number) {
  const nodeKey = `${props.nodeKey || 'stream-markdown'}-${node.type}`
  if (node.type === 'footnoteReference' || node.type === 'footnoteDefinition')
    return `${nodeKey}-${node.identifier}`
  return `${nodeKey}-${index}`
}
</script>

<template>
  <template v-for="item in nodes" :key="item.key">
    <Transition
      v-if="enableTransition && !excludeTransition.includes(item.node.type)"
      name="stream-markdown-typewriter"
      appear
    >
      <component
        :is="getNodeComponent(item.node)"
        v-bind="getNodeBindings(item.node)"
        :node-key="item.key"
      />
    </Transition>

    <component
      :is="getNodeComponent(item.node)"
      v-else
      v-bind="getNodeBindings(item.node)"
      :node-key="item.key"
    />
  </template>
</template>
