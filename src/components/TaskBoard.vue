<template>
    <div v-show="!props.projeckId">
        <!-- 零页 -->
        <h2>
            请选择一个项目
        </h2>
    </div>
    <el-row v-show="props.projeckId" :gutter="20" style="heigth:100vh;" justify="center">
        <el-col :span="7">
            <div class="task-list">
                <h2>未开始</h2>
            </div>

            <!-- <Box :key="1" :index="1" :accept="acceptedTypes" :onDrop="handleDrop">
                
            </Box> -->
        </el-col>
        <el-col :span="7">
            <div class="task-list">
                <h2>进行中</h2>
            </div>
            <!-- <Box :key="1" :accept="['item']" :onDrop="handleDrop" class="task-list">

            </Box> -->
        </el-col>
        <el-col :span="7">
            <div class="task-list">
                <h2>已完成</h2>
            </div>
            <!-- <Box :key="2" :accept="['item']" :onDrop="handleDrop" class="task-list">
              
            </Box> -->
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import lodash from 'lodash';
import { watch, ref, type Ref } from 'vue';
import Item from './Item.vue'
import Box from './Box.vue'

const acceptedTypes = ['item']
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


const props = defineProps<{ projeckId: Ref }>()

watch(
    () => lodash.cloneDeep(props.projeckId),
    (state, prevState) => {
        console.log(state, prevState)
    }
)
</script>
<style>
.task-list {
    margin-top: 20vh;
    min-height: 2em;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.1);
}
</style>