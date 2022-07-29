<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { computed, unref } from 'vue'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  accept: string[]
  lastDroppedItem?: any
  onDrop: (item: any, monitor: any) => void
  key: number
}>()

const [collect, drop] = useDrop({
  accept: props.accept,
  drop: props.onDrop,
  collect: (monitor: any) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
})

const { canDrop, isOver } = toRefs(collect)
const isActive = computed(() => unref(canDrop) && unref(isOver))
</script>

<template>
  <div :ref="drop" role="Box" class="box" :id="`box-${key}`">
    <slot></slot>
    <!-- {{
        isActive
          ? 'Release to drop'
          : `This dustbin accepts: ${accept.join(', ')}`
    }}

    <p v-if="lastDroppedItem">
      Last dropped: {{ JSON.stringify(lastDroppedItem) }}
    </p> -->
  </div>
</template>

<style>
.box {
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background-color: #F5F5F5;
}
</style>