<template>
  <template v-if="data?.length">
    <slot
      :item="data[0]"
      :depth="depth"
      :index="index"
      :isExpanded="data[0].expanded"
      :toggle="toggle"
    >
      <div @click="toggle(items[0])">{{ data[0].title }}</div>
    </slot>
    <template v-if="children && data[0].expanded">
      <VFor
        #default="slotData"
        :items="data[0][childrenPath]"
        :children="children"
        :children-path="childrenPath"
        :depth="depth + 1"
        :index="0"
      >
        <slot v-bind="slotData" />
      </VFor>
    </template>
    <VFor
      v-if="data.length"
      #default="slotData"
      :items="data.slice(1)"
      :children="children"
      :children-path="childrenPath"
      :depth="depth"
      :index="index + 1"
    >
      <slot v-bind="slotData" />
    </VFor>
  </template>
</template>

<script lang="js" setup>
import { onMounted, ref } from 'vue'
import { keyBy, cloneDeep } from 'lodash'

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
  defaultExpandedKeys: {
    type: Array,
    default: () => ([])
  },
  keyProp: {
    type: String,
    default: 'id'
  }
})

const data = ref([])
const nodeMap = ref(null)

function expandDefaultExpandedKeys () {
  props.defaultExpandedKeys.forEach(_defaultKey => {
    const node = nodeMap.value[_defaultKey]
    if (node) {
      const branchKeyChain = node.$key.split('-').map(_key => (typeof _defaultKey === 'number' ? Number(_key) : _key))
      branchKeyChain.forEach(_key => {
        nodeMap.value[_key].expanded = true
      })
    }
  })
}

function flatten (items) {
  return items.flatMap((item) => {
    return [
      item,
      ...(item[props.childrenPath] ? flatten(item[props.childrenPath]) : [])
    ]
  })
}

function addKeysToItems (items, parentKey = '') {
  return items.map(item => {
    const $key = parentKey ? `${parentKey}-${item[props.keyProp]}` : `${item[props.keyProp]}`

    if (item[props.childrenPath]) {
      item[props.childrenPath] = addKeysToItems(item[props.childrenPath], $key)
    }

    return {
      ...item,
      $key
    }
  })
}

function setBranchExpansionState (item, state) {
  item.expanded = state
  if (item[props.childrenPath]) {
    item[props.childrenPath].forEach(_child => setBranchExpansionState(_child, state))
  }
}

const toggle = (item) => {
  item.expanded = !item.expanded
  if (!item.expanded) {
    setBranchExpansionState(item, false)
  }
}

onMounted(async () => {
  data.value = addKeysToItems(cloneDeep(props.items))
  nodeMap.value = keyBy(flatten(data.value), props.keyProp)
  expandDefaultExpandedKeys()
})

</script>
