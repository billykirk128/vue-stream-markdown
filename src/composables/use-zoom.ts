import { computed, ref } from 'vue'

export interface UseZoomOptions {
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  wheelSensitivity?: number
  initialZoom?: number
  initialTranslateX?: number
  initialTranslateY?: number
}

export interface ZoomPanState {
  zoom: number
  translateX: number
  translateY: number
}

export function useZoom(options: UseZoomOptions = {}) {
  const {
    minZoom = 0.5,
    maxZoom = 3,
    zoomStep = 0.1,
    wheelSensitivity = 0.01,
    initialZoom = 1,
    initialTranslateX = 0,
    initialTranslateY = 0,
  } = options

  const zoom = ref(initialZoom)
  const translateX = ref(initialTranslateX)
  const translateY = ref(initialTranslateY)
  const isDragging = ref(false)
  const dragStart = ref({ x: 0, y: 0 })

  const transformStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${zoom.value})`,
  }))

  function zoomIn() {
    if (zoom.value < maxZoom)
      zoom.value = Math.min(zoom.value + zoomStep, maxZoom)
  }

  function zoomOut() {
    if (zoom.value > minZoom)
      zoom.value = Math.max(zoom.value - zoomStep, minZoom)
  }

  function resetZoom() {
    zoom.value = initialZoom
    translateX.value = initialTranslateX
    translateY.value = initialTranslateY
  }

  function setZoom(value: number) {
    zoom.value = Math.min(Math.max(value, minZoom), maxZoom)
  }

  // Drag functionality
  function startDrag(e: PointerEvent) {
    isDragging.value = true
    dragStart.value = {
      x: e.clientX - translateX.value,
      y: e.clientY - translateY.value,
    }

    if (e.pointerType !== 'mouse') {
      if (e.target instanceof HTMLElement)
        e.target.setPointerCapture(e.pointerId)
    }
  }

  function onDrag(e: PointerEvent) {
    if (!isDragging.value)
      return

    translateX.value = e.clientX - dragStart.value.x
    translateY.value = e.clientY - dragStart.value.y
  }

  function stopDrag() {
    isDragging.value = false
  }

  // Wheel zoom with focal point
  function handleWheel(event: WheelEvent, containerElement: HTMLElement) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()

      const rect = containerElement.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const containerCenterX = rect.width / 2
      const containerCenterY = rect.height / 2
      const offsetX = mouseX - containerCenterX
      const offsetY = mouseY - containerCenterY
      const contentMouseX = (offsetX - translateX.value) / zoom.value
      const contentMouseY = (offsetY - translateY.value) / zoom.value
      const delta = -event.deltaY * wheelSensitivity
      const newZoom = Math.min(Math.max(zoom.value + delta, minZoom), maxZoom)

      if (newZoom !== zoom.value) {
        translateX.value = offsetX - contentMouseX * newZoom
        translateY.value = offsetY - contentMouseY * newZoom
        zoom.value = newZoom
      }
    }
  }

  // Get current state
  function getState(): ZoomPanState {
    return {
      zoom: zoom.value,
      translateX: translateX.value,
      translateY: translateY.value,
    }
  }

  // Set state
  function setState(state: Partial<ZoomPanState>) {
    if (state.zoom)
      zoom.value = Math.min(Math.max(state.zoom, minZoom), maxZoom)

    if (state.translateX)
      translateX.value = state.translateX

    if (state.translateY)
      translateY.value = state.translateY
  }

  return {
    zoom,
    translateX,
    translateY,
    isDragging,
    transformStyle,

    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    startDrag,
    onDrag,
    stopDrag,
    handleWheel,
    getState,
    setState,
  }
}
