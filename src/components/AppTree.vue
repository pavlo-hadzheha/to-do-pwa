<template>
  <div
    ref="el"
    class="ml-5 droppable"
  >
    <VFor
      ref="el"
      #default="{isExpanded, item, toggle, depth, setDraggableElement, ...slotData}"
      :items="items"
      :children="children"
      :children-path="childrenPath"
      :key-prop="keyProp"
      :default-expanded-keys="defaultExpandedKeys"
    >
      <div
        :ref="setDraggableElement"
        class="tree-node"
      >
        <div
          v-show="item[childrenPath]?.length"
          class="tree-node__toggler"
          :style="{
            marginLeft: `${10 * depth}px`,
          }"
          @click="toggle(item)"
        >
          <ChevronDown v-if="isExpanded" />
          <ChevronRight v-else />
        </div>
        <slot
          v-bind="slotData"
          :item="item"
          :isExpanded="isExpanded"
          :depth="depth"
        >
          <div
            :style="{
              marginLeft: `${10 * depth}px`,
            }"
            class="flex items-center gap-x-3"
          >
            <div class="flex items-center gap-x-1">
              <ArrowsIcon
                ref="handle"
                class="cursor-move"
              />
              <input
                type="checkbox"
                @click.stop
              >
            </div>

            <span :class="isExpanded ? 'text-red-500' : 'text-green-500'">
              {{ item.title }} ({{ !!isExpanded }})
            </span>
          </div>
        </slot>
      </div>
    </VFor>
  </div>
</template>

<script lang="js" setup>
import VFor from './VFor.vue'
import ChevronRight from './icons/ChevronRight.vue'
import ChevronDown from './icons/ChevronDown.vue'
import ArrowsIcon from './icons/ArrowsIcon.vue'

defineProps({
  items: {
    type: Array,
    default: () => ([])
  },
  children: Boolean,

  childrenPath: {
    type: String,
    default: 'children'
  },
  keyProp: {
    type: String,
    default: 'id'
  },
  defaultExpandedKeys: {
    type: [Object, Array],
    default: () => (new Set())
  }
})

// const el = ref()

// onMounted(() => {
//   console.log('onMounted', el.value)
// })
// useDraggable(el)
// const handle = ref < HTMLElement | null > (null)

// const { x, y, style } = useDraggable(el, {
//   preventDefault: true
// })

// function onDragStart (...data) {
//   console.log(...data)
// }
</script>

<style lang="scss" scoped>
.tree-node {
    @apply text-sm text-red-300 flex items-center gap-x-1;
    @apply select-none;
    @apply relative;

    &__toggler {
        @apply -left-[18px] top-[3px] absolute cursor-pointer;
    }
}
</style>
