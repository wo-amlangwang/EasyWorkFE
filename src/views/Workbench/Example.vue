<script lang="ts" setup>
import { useDrag, useDrop } from 'vue3-dnd'
import { computed, unref } from 'vue'
import Item from './Item.vue'
import Box from './Box.vue'
import { ref } from 'vue'

const droppedBoxNames = ref<string[]>([])

const handleDrop = (item: any, monitor: any) => {
    console.log(item, monitor)
    const dropResult = monitor.getDropResult() as any
    if (dropResult) {
        droppedBoxNames.value.push(dropResult.name)
    }
    // const { name } = item
    // droppedBoxNames.value.push(name)
    // console.log(name)
    // this.appendChild(document.getElementById('item-' + name))
}


const items = [
    {
        title: '测试1',
        person: 'Sonui',
        id: 11
    },
    {
        title: '测试2',
        person: 'Sonui',
        id: 12
    }
]

const boxes = [
    {
        accepts: ['item'],
    },
    {
        accepts: ['item'],
    }
]

</script>

<template>
    <Box v-for="(box, index) in boxes" :key="index" :accept="box.accepts"
        :onDrop="handleDrop" :index="index"></Box>

    <Item v-for="(item, index) in items" :title="item.title" :person="item.person" 
        :id="item.id"></Item>

</template>