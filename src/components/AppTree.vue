<template>
  <div
    class="ml-5"
  >
    <VFor
      ref="reference"
      #default="{isExpanded, item, toggle, depth, setHandleElement, ...slotData}"
      :items="items"
      :children="children"
      :children-path="childrenPath"
      :key-prop="keyProp"
      :default-expanded-keys="defaultExpandedKeys"
      :default-expand-all="defaultExpandAll"
      :draggable="draggable"
      @drop="$emit('drop', ...$event)"
      @dragstart="$emit('dragstart', $event)"
    >
      <div
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
          <ChevronDown
            v-if="isExpanded"
            class="cursor-e-resize"
          />
          <ChevronRight
            v-else
            class="cursor-s-resize"
          />
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
            class="flex items-center gap-x-3 w-full"
            :class="isExpanded ? 'cursor-e-resize' : 'cursor-s-resize'"
            @click="toggle(item)"
          >
            <div
              class="flex items-center gap-x-1"
            >
              <ArrowsIcon
                v-if="draggable"
                :ref="setHandleElement"
                class="cursor-move"
              />
              <input
                v-model="checked[item[keyProp]]"
                type="checkbox"
                class="cursor-grab"
                @click.stop
              >
            </div>

            <span
              class="cursor-pointer"
              :class="!isExpanded ? 'text-red-500' : 'text-green-500'"
              @click.stop="checked[item[keyProp]] = !checked[item[keyProp]]"
            >
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
import { onMounted, ref, reactive } from 'vue'

const reference = ref()
const checked = reactive({})

defineEmits(['drop', 'dragstart'])

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
    type: Array,
    default: () => ([])
  },
  draggable: Boolean,
  defaultExpandAll: Boolean
})

onMounted(() => {
  Object.entries(reference.value.nodeMap).forEach(([_key]) => {
    checked[_key] = false
  })
})
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
