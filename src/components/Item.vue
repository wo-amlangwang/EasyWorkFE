<template>
    <div :ref="drag" role="Item" :id="`item-${id}`" class="item">
        <el-space>
            <a>{{ title }}</a>
            <a src="#">责任人：{{ person }}</a>
        </el-space>
        <el-space>
            <a>💡</a>
            <a>#{{ id }}</a>
        </el-space>
    </div>
</template>

<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'

interface DropResult {
    name: string
}

const props = defineProps<{ id: number, title: string, person: string }>()


const [collect, drag] = useDrag(() => ({
    type: 'item',
    item: () => ({
        name: props.id,
    }),
    end: (item, monitor) => {
        // 加入到目标组件的数据中
        const dropResult = monitor.getDropResult() as DropResult

    },
    collect: monitor => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
    }),
}))

const { isDragging } = toRefs(collect)
</script>

<style lang="less" scoped>
.item {
    width: 200px;
    cursor: move;
    display: flex;
    flex-direction: column;
    border: 1px solid blue;
    margin: 3px;
}
</style>