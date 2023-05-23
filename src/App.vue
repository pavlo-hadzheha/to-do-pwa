<script setup>
import { reactive, ref } from 'vue'
import AppTree from './components/AppTree.vue'
import DragTest from './components/DragTest.vue'

const listVisible = ref(true)
const items = reactive([
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

</script>

<template>
  <button
    @click="listVisible = !listVisible"
  >
    Toggle
  </button> <br>
  <!-- <AppTodoList :items="items" /> -->
  <AppTree
    v-if="listVisible"
    :items="items"
    :children="true"
    :default-expanded-keys="[40201]"
  />
  <br>
  <br>
  <DragTest />
</template>
