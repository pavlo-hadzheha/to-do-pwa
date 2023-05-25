<template>
  <div
    ref="el"
    :style="style"
    class="box"
  />
</template>

<script setup>
import { ref } from 'vue'

import { useDraggable } from '../composables/useDraggable'

const el = ref()

const { style } = useDraggable(el)
</script>

<style lang="scss" scoped>
.box {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: aquamarine;
    cursor: move;
}
</style>
