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

console.log(props)

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
  <div
    :ref="drop"
    role="Box"
    class="box"
    :id="`box-${key}`"
  >
    {{
      isActive
        ? 'Release to drop'
        : `This dustbin accepts: ${accept.join(', ')}`
    }}

    <p v-if="lastDroppedItem">
      Last dropped: {{ JSON.stringify(lastDroppedItem) }}
    </p>
  </div>
</template>

<style>
.box {
    overflow: hidden;
    clear: both;
    /* 红色边框 */
    border: 1px solid red;
    width: 300px;
    height: 300px;
    margin: 24px;
}
</style>