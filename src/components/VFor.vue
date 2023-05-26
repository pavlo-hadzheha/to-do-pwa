<template>
  <template v-if="data?.length">
    <div
      :ref="setDraggableElement"
      class="droppable"
      :style="dragConfig.style"
      :data-node-key="data[0].$key"
    >
      <slot
        :item="data[0]"
        :depth="depth"
        :index="index"
        :isExpanded="data[0].expanded"
        :toggle="toggle"
        :setDraggableElement="setDraggableElement"
        :setHandleElement="setHandleElement"
        :draggable="draggable"
      >
        <div
          :style="{
            marginLeft: `${10 * depth}px`,
          }"
          @click="toggle(data[0])"
        >
          {{ data[0].title }}
        </div>
      </slot>
      <template v-if="children && data[0].expanded">
        <VFor
          #default="slotData"
          :items="data[0][childrenPath]"
          :children="children"
          :children-path="childrenPath"
          :depth="depth + 1"
          :index="0"
          :draggable="draggable"
          @drop="onDrop($event)"
          @dragstart="onDragstart"
        >
          <slot v-bind="slotData" />
        </VFor>
      </template>
    </div>
    <VFor
      v-if="data.length"
      #default="slotData"
      :items="data.slice(1)"
      :children="children"
      :children-path="childrenPath"
      :depth="depth"
      :index="index + 1"
      :draggable="draggable"
      @drop="oDrop($event)"
      @dragstart="onDragstart"
    >
      <slot v-bind="slotData" />
    </VFor>
  </template>
</template>

<script setup>
import { inject, onMounted, provide, ref, computed, watch } from 'vue'
import { keyBy, cloneDeep } from 'lodash'
import { useDraggable } from '../composables/useDraggable'
import { flattenDeep } from '../helpers'

const emit = defineEmits(['drop', 'dragstart'])

const props = defineProps({
  items: {
    type: Array,
    default: () => ([])
  },

  children: Boolean,
  childrenPath: {
    type: String,
    default: 'children'
  },

  depth: {
    type: Number,
    default: 0
  },
  index: {
    type: Number,
    default: 0
  },
  keyProp: {
    type: String,
    default: 'id'
  },

  defaultExpandedKeys: {
    type: Array,
    default: () => ([])
  },
  defaultExpandAll: Boolean,

  draggable: Boolean
})
const isFirstNode = props.depth === 0 && props.index === 0
const el = ref()
const handle = ref()

const data = ref([])

const rootNodeMap = !isFirstNode && inject('nodeMap')
const nodeMap = computed(() => (isFirstNode
  ? keyBy(flattenDeep(data.value, props.childrenPath), props.keyProp)
  : rootNodeMap.value))

const dragConfig = useDraggable(el, {
  // _droppableSelector: () => `.droppable[data-node-key]:not([data-node-key="${data.value[0].$key}"])`,
  _handle: handle,
  onDrop,
  onDragstart
})

function expandDefaultExpandedKeys () {
  if (!props.defaultExpandAll) {
    props.defaultExpandedKeys.forEach(_defaultKey => {
      const node = nodeMap.value[_defaultKey]
      if (node) {
        const branchKeyChain = node.$key.split('-').map(_key => (typeof _defaultKey === 'number' ? Number(_key) : _key))
        branchKeyChain.forEach(_key => {
          nodeMap.value[_key].expanded = true
        })
      }
    })
  } else {
    for (const _key in nodeMap.value) {
      nodeMap.value[_key].expanded = true
    }
  }
}

function addKeysToItems (items, parentKey = '') {
  return items.map(item => {
    const $key = parentKey ? `${parentKey}-${item[props.keyProp]}` : `${item[props.keyProp]}`

    if (item[props.childrenPath]) {
      item[props.childrenPath] = addKeysToItems(item[props.childrenPath], $key)
    }
    item.$key = $key
    return item
  })
}

function setBranchExpansionState (item, state) {
  item.expanded = state
  if (item[props.childrenPath]) {
    item[props.childrenPath].forEach(_child => setBranchExpansionState(_child, state))
  }
}

function setDraggableElement (_element) {
  el.value = _element instanceof HTMLElement ? _element : _element?.$el
}

function setHandleElement (_handle) {
  handle.value = _handle instanceof HTMLElement ? _handle : _handle?.$el
}

function toggle (item) {
  item.expanded = !item.expanded
  if (!item.expanded) {
    setBranchExpansionState(item, false)
  }
}

function onDrop ([_draggable, _droppable]) {
  emit('drop', [_draggable, _droppable])
}

function onDragstart (_draggable) {
  emit('dragstart', _draggable)
}

onMounted(async () => {
  data.value = props.items
  if (isFirstNode) {
    data.value = addKeysToItems(cloneDeep(data.value))
    expandDefaultExpandedKeys()
  }
})

if (isFirstNode) provide('nodeMap', nodeMap)

watch(() => props.draggable, _enabled => _enabled ? dragConfig.register() : dragConfig.unregister())

defineExpose({
  nodeMap,
  data
})

</script>
