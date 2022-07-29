<template>
    <div v-show="!props.projeckId">
        <!-- 零页 -->
        <el-empty description="description" />
    </div>
    <div v-show="props.projeckId" class="task-box">
        <div class="task-list" v-for="(item, index) in taskList" :key="index">
            <h3>
                {{ item.title }}
                <el-button text>
                    <el-icon>
                        <Edit />
                    </el-icon>
                </el-button>
                <el-button text style="float: right; position: relative;">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </h3>
            <Box :key="index" :accept="item.access" :onDrop="item.handle">
                <Item v-for="(task, idx) in item.task" :key="idx" :id="task.id" :title="task.title"
                    :person="task.person">
                </Item>
            </Box>
        </div>

        <div class="task-list list-add dashed" @click="addList()">
            <el-icon :size="40">
                <Plus />
            </el-icon>
        </div>
    </div>
</template>
<script setup lang="ts">
import lodash from 'lodash';
import { watch, ref, type Ref } from 'vue';
import Item from './Item.vue'
import Box from '../../components/Box.vue'
import { Plus, Edit } from '@element-plus/icons-vue'

const props = defineProps<{ projeckId: Ref }>()

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

const addList = () => {
    taskList.value.push({
        title: 'TODO',
        access: ['item'],
        handle: handleDrop,
        task: []
    });
}


const taskList = ref([
    {
        title: '未开始',
        access: ['item'],
        handle: handleDrop,
        task: [
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
    },
    {
        title: '进行中',
        access: ['item'],
        handle: handleDrop,
        task: []
    },
    {
        title: '已完成',
        access: ['item'],
        handle: handleDrop,
        task: []
    }
]);

watch(
    () => lodash.cloneDeep(props.projeckId),
    (state, prevState) => {
        taskList.value = [
            {
                title: '未开始',
                access: ['item'],
                handle: handleDrop,
                task: [
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
            },
            {
                title: '进行中',
                access: ['item'],
                handle: handleDrop,
                task: []
            },
            {
                title: '已完成',
                access: ['item'],
                handle: handleDrop,
                task: []
            }
        ]
        console.log(state, prevState)
    }
)

</script>
<style>
.task-box {
    display: flex;
    height: 100%;
}

h3 {
    padding: 5px;
}

.task-list {
    display: flex;
    flex-direction: column;
    min-height: 3em;
    height: 100%;
    width: 320px;
    padding: 1px 13px 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.1);
    margin-right: 15px;
}

.task-list.list-add {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px dashed #ccc;
    background-color: #eee;
}

/* 鼠标进入 */
.task-list.list-add:hover {
    cursor: pointer;
}
</style>