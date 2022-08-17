<template>
    <div :ref="drag" role="Item" :id="`item-${id}`" class="task-item">
        <el-space class="title">
            <a>{{ title }}</a>
            <a src="#">责任人：{{ person.join() }}</a>
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

const props = defineProps<{
    id: number,  // 事项ID
    title: string,  // 事项标题
    person: string[],  // 事项负责人
    end: (item: any, monitor: any) => void // 被拖放的回调函数
}>()


// 注册拖动相关的hook
const [collect, drag] = useDrag(() => ({
    type: 'item',
    item: { name: props.id },
    end: props.end,
    collect: monitor => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
    }),
}))

const { isDragging } = toRefs(collect)
</script>

<style>
.task-item {
    background-color: #fff;
    width: 100%;
    cursor: move;
    display: flex;
    flex-direction: column;
    padding: 1px 13px 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1);
}

.task-item .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>