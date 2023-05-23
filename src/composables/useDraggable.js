import { ref, toRef, onMounted, onUnmounted, nextTick } from 'vue'

export const useDraggable = (_target, _handle) => {
//   if (!(unref(_target) instanceof HTMLElement)) throw TypeError('_target must inherit from HTMLElement')

  const currentDroppable = ref(null)
  const target = toRef(_target)

  function onMouseDown (event) {
    console.log('useDraggable.onMouseDown')
    const shiftX = event.clientX - target.value.getBoundingClientRect().left
    const shiftY = event.clientY - target.value.getBoundingClientRect().top

    target.value.style.position = 'absolute'
    target.value.style.zIndex = 1000
    document.body.append(target.value)

    moveAt(event.pageX, event.pageY)

    function moveAt (pageX, pageY) {
      target.value.style.left = pageX - shiftX + 'px'
      target.value.style.top = pageY - shiftY + 'px'
    }

    function onMouseMove (event) {
      moveAt(event.pageX, event.pageY)

      target.value.hidden = true
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
      target.value.hidden = false

      if (!elemBelow) return

      const droppableBelow = elemBelow.closest('.droppable')
      if (currentDroppable.value !== droppableBelow) {
        if (currentDroppable.value) {
          leaveDroppable(currentDroppable.value)
        }
        currentDroppable.value = droppableBelow
        if (currentDroppable.value) {
          enterDroppable(currentDroppable.value)
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)

    target.value.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove)
      target.value.onmouseup = null
      target.value.style.position = 'static'
    }
  }

  function onDragStart () {
    console.log('onDragStart')
    return false
  }
  onMounted(() => {
    nextTick(() => {
      console.log('useDraggable.onMounted', target.value)
      if (!target.value) return
      target.value.style.cursor = 'move'
      target.value.addEventListener('mousedown', onMouseDown)
      target.value.addEventListener('dragstart', onDragStart)
    })
  })

  onUnmounted(() => {
    if (!target.value) return
    target.value.style.cursor = 'initial'
    target.value.removeEventListener('onmousedown', onMouseDown)
    target.value.removeEventListener('ondragstart', onDragStart)
  })

  function enterDroppable (elem) {
    elem.style.background = 'pink'
  }

  function leaveDroppable (elem) {
    elem.style.background = ''
  }

  return {

  }
}
