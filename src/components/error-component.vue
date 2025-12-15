<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import { useContext, useI18n } from '../composables'
import Icon from './icon.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  variant?: ErrorVariant
  showIcon?: boolean
  icon?: string | Component
  message?: string
}>(), {
  variant: 'vanilla',
  showIcon: true,
})

type ErrorVariant = 'vanilla' | 'image' | 'mermaid' | 'katex' | 'harden-image' | 'harden-link'

const { t } = useI18n()
const { icons } = useContext()

const messages = computed((): Record<ErrorVariant, string> => ({
  'vanilla': t('error.vanilla'),
  'image': t('error.image'),
  'mermaid': t('error.mermaid'),
  'katex': t('error.katex'),
  'harden-image': t('error.harden'),
  'harden-link': t('error.harden'),
}))

const icon = computed((): string | Component => {
  if (props.icon)
    return props.icon
  if (icons.value[props.variant])
    return props.variant
  const name = props.variant.replace('harden-', '')
  if (icons.value[name])
    return name
  return 'error'
})

const message = computed(() => props.message
  ? props.message
  : messages.value[props.variant!] || messages.value.vanilla)

const isHarden = computed(() => props.variant?.startsWith?.('harden-'))
</script>

<template>
  <span data-stream-markdown="error-component">
    <div v-if="showIcon" data-stream-markdown="error-component-icon">
      <Icon v-if="typeof icon === 'string'" :icon="icon" />
      <component :is="icon" v-else />
    </div>
    <slot v-if="isHarden" />
    [{{ message }}]
  </span>
</template>
