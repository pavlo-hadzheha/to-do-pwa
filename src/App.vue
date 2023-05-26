<script setup>
import { computed, reactive, ref } from 'vue'
import AppTree from './components/AppTree.vue'
import { flattenDeep } from './helpers'
import { keyBy, cloneDeep } from 'lodash'

const listVisible = ref(true)
const draggable = ref(true)
const items = ref([
  {
    id: 1,
    title: 'Grocery Shopping',
    description: 'Buy milk, bread, and eggs',

    children: [
      {
        id: 101,
        title: 'Buy vegetables',
        description: 'Buy tomatoes, lettuce, and onions'

      },
      {
        id: 102,
        title: 'Buy fruits',
        description: 'Buy apples, bananas, and oranges'
      }
    ]
  },
  {
    id: 2,
    title: 'Gym',
    description: 'Cardio for 30 mins and weight lifting'
  },
  {
    id: 3,
    title: 'Read a Book',
    description: "Read 2 chapters of 'The Great Gatsby'"
  },
  {
    id: 4,
    title: 'Clean the House',
    description: 'Clean the kitchen and the bathroom',
    children: [
      {
        id: 401,
        title: 'Clean the living room',
        description: 'Dust the furniture and vacuum the carpet'
      },
      {
        id: 402,
        title: 'Clean the bedroom',
        description: 'Change the bed sheets and organize the closet',

        children: [
          {
            id: 40201,
            title: 'Clean the living room (CHILD)',
            description: 'Dust the furniture and vacuum the carpet'
          },
          {
            id: 40202,
            title: 'Clean the bedroom (CHILD)',
            description: 'Change the bed sheets and organize the closet'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Cook Dinner',
    description: 'Cook spaghetti and meatballs for dinner'
  }
])

const itemsMap = ref(null)
initItemsMap()

function onDrop (_draggable, _droppable) {
  console.log('onDrop', _draggable, _droppable)
  const draggableKeyChain = _draggable.dataset.nodeKey.split('-')
  const droppableKeyChain = _droppable?.dataset.nodeKey?.split('-') || null
  const draggableKey = draggableKeyChain.at(-1)
  const draggableParentKey = draggableKeyChain.at(-2)
  const droppableKey = droppableKeyChain?.at(-1)

  if (draggableKeyChain.length < droppableKeyChain?.length) return
  if (draggableParentKey) {
    const draggableParentNode = itemsMap.value[draggableParentKey]
    draggableParentNode.children = draggableParentNode.children
      .filter(_child => _child.id !== draggableKey)
  } else {
    delete itemsMap.value[draggableKey]
  }
  const draggableNode = itemsMap.value[draggableKey]
  const droppableNode = itemsMap.value[droppableKey]
  console.log('droppableNode', droppableNode)
  if (!droppableNode.children) droppableNode.children = []
  droppableNode.children.push(cloneDeep(draggableNode))
  // setBranchExpansionState(droppableNode, true)
  items.value = Object.values(itemsMap.value).filter(_item => _item)
}

function initItemsMap () {
  itemsMap.value = keyBy(flattenDeep(items.value, 'children'), 'id')
}
</script>

<template>
  <div class="mb-6">
    <button
      class="button"
      @click="listVisible = !listVisible"
    >
      Toggle tree
    </button>
    <button
      class="button"
      @click="draggable = !draggable"
    >
      Toggle draggable
    </button>
  </div>

  <!-- <AppTodoList :items="items" /> -->
  <AppTree
    v-if="listVisible"
    :items="items"
    :children="true"
    class="p-2 pl-5 border-green-500 border-dashed border-[1.5px]"
    :default-expanded-keys="[4]"
    :default-expand-all="true"
    :draggable="draggable"
    @drop="onDrop"
  />
</template>
