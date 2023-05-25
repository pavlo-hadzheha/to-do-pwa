import { ref, toRef, unref, onMounted, onUnmounted, nextTick, reactive } from 'vue'

export const useDraggable = (_target, {
  _handle,
  _leaveDroppable,
  _enterDroppable,
  _droppableSelector,
  onDrop
} = {}) => {
  const currentDroppable = ref(null)
  const target = toRef(_target)
  const handle = toRef(_handle)

  const targetStyle = ref(null)
  const droppableSelector = _droppableSelector || '.droppable'

  function onMouseDown (event) {
    if (unref(handle) && event.target !== unref(handle)) return
    const shiftX = event.clientX - target.value.getBoundingClientRect().left
    const shiftY = event.clientY - target.value.getBoundingClientRect().top

    const copy = target.value.cloneNode(true)
    target.value.replaceWith(copy)
    document.body.append(target.value)
    targetStyle.value = {
      position: 'absolute',
      opacity: 0.5,
      zIndex: 9999
    }

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

      const droppableBelow = elemBelow.closest(typeof droppableSelector === 'function' ? droppableSelector() : droppableSelector)
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
      targetStyle.value = null
      leaveDroppable(currentDroppable.value)
      onDrop && onDrop(target.value, currentDroppable.value)
    }
    return false
  }

  onMounted(register)
  onUnmounted(unregister)

  function enterDroppable (elem) {
    if (elem) {
      if (_enterDroppable) _leaveDroppable()
      else elem.style.background = 'lime'
    }
  }

  function leaveDroppable (elem) {
    if (elem) {
      if (_leaveDroppable) _leaveDroppable()
      else elem.style.background = ''
    }
  }
  function unregister () {
    if (!target.value) return
    target.value.style.cursor = 'initial'
    target.value.removeEventListener('onmousedown', onMouseDown)
  }

  function register () {
    nextTick(() => {
      if (!target.value) return
      (unref(_handle) || target.value).style.cursor = 'move';
      (unref(_handle) || target.value).addEventListener('mousedown', onMouseDown)
    })
  }
  return reactive({
    style: targetStyle,
    register,
    unregister
  })
}
