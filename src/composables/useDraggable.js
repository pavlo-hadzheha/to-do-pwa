import { ref, toRef, unref, onMounted, onUnmounted, nextTick } from 'vue'

export const useDraggable = (_target, _handle) => {
//   if (!(unref(_target) instanceof HTMLElement)) throw TypeError('_target must inherit from HTMLElement')

  const currentDroppable = ref(null)
  const target = toRef(_target)
  const handle = toRef(_handle)

  function onMouseDown (event) {
    console.log('useDraggable.onMouseDown', unref(handle))
    if (unref(handle) && event.target !== unref(handle)) return
    const shiftX = event.clientX - target.value.getBoundingClientRect().left
    const shiftY = event.clientY - target.value.getBoundingClientRect().top

    const copy = target.value.cloneNode(true)
    target.value.replaceWith(copy)
    document.body.append(target.value)
    target.value.style.position = 'absolute'
    target.value.style.opacity = 0.5
    target.value.style.zIndex = 1000
    console.log(target.value)

    // target.value.style.visibility = 'hidden'

    moveAt(event.pageX, event.pageY)

    function moveAt (pageX, pageY) {
      console.log('useDraggable.moveAt')

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
      copy.replaceWith(target.value)
      target.value.onmouseup = null
      target.value.style.position = 'static'
      target.value.style.opacity = 1
      leaveDroppable(currentDroppable.value)
      // target.value.style.visibility = 'visible'
    }
  }

  onMounted(() => {
    nextTick(() => {
      console.log('useDraggable.onMounted', handle.value)
      if (!target.value) return
      (unref(_handle) || target.value).style.cursor = 'move';
      (unref(_handle) || target.value).addEventListener('mousedown', onMouseDown)
    })
  })

  onUnmounted(() => {
    if (!target.value) return
    target.value.style.cursor = 'initial'
    target.value.removeEventListener('onmousedown', onMouseDown)
  })

  function enterDroppable (elem) {
    if (elem) {
      elem.style.background = 'lime'
    }
  }

  function leaveDroppable (elem) {
    if (elem) {
      elem.style.background = ''
    }
  }

  return {

  }
}
