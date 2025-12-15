<script setup lang="ts">
import type { Placement } from '@floating-ui/dom'
import { toRefs } from 'vue'
import { useContext, useFloating } from '../composables'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  delay?: number | [number, number]
}>(), {
  trigger: 'hover',
  placement: 'top',
  delay: () => [100, 100],
})

const { placement, delay, trigger } = toRefs(props)

const { getContainer } = useContext()

const {
  referenceEl: _referenceEl,
  floatingEl: _floatingEl,
  open,
  appendTo,
  floatingStyle,
  show,
  hide,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onFloatingEnter,
  onFloatingLeave,
} = useFloating({
  placement,
  delay,
  trigger,
  getContainer,
})

defineExpose({ show, hide })
</script>

<template>
  <span
    v-bind="$attrs"
    ref="_referenceEl"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <slot />
  </span>

  <Teleport :to="appendTo">
    <div
      v-if="open"
      ref="_floatingEl"
      :style="floatingStyle"
      data-stream-markdown="tooltip"
      @mouseenter="onFloatingEnter"
      @mouseleave="onFloatingLeave"
    >
      <slot name="content">
        <pre data-stream-markdown="tooltip-overlay">{{ content }}</pre>
      </slot>
    </div>
  </Teleport>
</template>
