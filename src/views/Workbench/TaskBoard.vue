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
                    :person="task.person" @click="itemClick(task.id)">
                </Item>
            </Box>
        </div>

        <div class="task-list list-add dashed" @click="addList()">
            <el-icon :size="40">
                <Plus />
            </el-icon>
        </div>
    </div>

    <!-- 事项详情 -->
    <el-drawer v-model="drawerTask" :title="'#' + taskInfo?.id" :size="'45%'" :direction="'rtl'"
        :before-close="handleClose" style="max-width: 35vw;">
        <div class="task-detail">
            <div class="task-detail-title">
                <h3 style="padding-left: 0;">{{ taskInfo ? taskInfo.title : '任务标题' }}</h3>
            </div>
            <div class="task-detail-person">
                <h4>责任人:</h4>
                <Tags :tags="taskInfo ? taskInfo.person : []" :addTag="addTag" style="margin-left: 5px;" />
            </div>
            <div class="task-detail-content">
                <h4>事项内容:</h4>
                <el-input type="textarea" :resize="'none'" :rows="10" v-model="content" placeholder="请输入事项内容" />
            </div>
            <div class="task-detail-time">
                <h4>事项时间:</h4>
                <div class="demo-date-picker">
                    <div class="block">
                        <el-date-picker v-model="time" type="daterange" range-separator=""
                            start-placeholder="Start date" end-placeholder="End date" :size="'default'" />
                    </div>
                </div>
            </div>
            <el-timeline class="task-timeline">
                <el-timeline-item v-for="(item, key) in taskTimeLine" :timestamp="item.time" placement="top">
                    <el-card>
                        {{ item.content}}
                    </el-card>
                </el-timeline-item>
                <!-- <el-timeline-item timestamp="2018/4/12" placement="top">
                    <el-card>
                        <h4>Update Github template</h4>
                        <p>Tom committed 2018/4/12 20:46</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/3" placement="top">
                    <el-card>
                        <h4>Update Github template</h4>
                        <p>Tom committed 2018/4/3 20:46</p>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2018/4/2" placement="top">
                    <el-card>
                        <h4>Update Github template</h4>
                        <p>Tom committed 2018/4/2 20:46</p>
                    </el-card>
                </el-timeline-item> -->
            </el-timeline>
            <div class="task-detail-content">
                <h4>评论</h4>
                <el-input type="textarea" :resize="'none'" :rows="10" v-model="content" placeholder="请输入评论内容" />
                <el-button class="btn task-save">
                    发送
                </el-button>
            </div>
        </div>

    </el-drawer>

</template>
<script setup lang="ts">
import lodash from 'lodash';
import { watch, ref, type Ref } from 'vue';
import Item from '../../components/Item.vue'
import Box from '../../components/Box.vue'
import Tags from '../../components/Tags.vue'
import { Plus, Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{ projeckId: Ref }>()
const drawerTask = ref(false)
const droppedBoxNames = ref<string[]>([])

interface tag {
    id: number
    name: string
}

interface ListItem {
    value: string
    label: string
}
interface TaskInfo {
    title: string
    person: tag[]
    content: string
    time: string
    id: number
    status: number
}
interface TaskTimeLine {
    type: number
    time: string
    content: string
}

const list = ref<ListItem[]>([])
const persons = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)
const taskInfo = ref<TaskInfo>()
const taskTimeLine = ref<TaskTimeLine[]>([])

taskInfo.value = {
    title: '开发用户管理后端',
    person: [{
        id: 1,
        name: '张三'
    }, {
        id: 2,
        name: '李四'
    }, {
        id: 3,
        name: '王五'
    }],
    content: '',
    time: '',
    id: 15,
    status: 0
}

taskTimeLine.value = [
    {
        type: 1,
        time: "2018/4/12 20:46",
        content: "张三 创建了任务"
    },
    {
        type: 2,
        time: "2018/4/12 20:46",
        content: "李四: 该需求需要进一步评估"
    }
]

const addTag = () => {
    console.log(123);
    ElMessageBox.prompt('请输入用户名/ID', '添加责任人', {
        inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/,
        inputErrorMessage: '用户名/ID只能为1-10位中文、英文、数字'
    }).then(({ value }) => {
        if (value) {
            taskInfo.value?.person.push({
                id: taskInfo.value?.person.length + 1,
                name: value
            })
        }
    })
}

const remoteMethod = (query: string) => {
    if (query) {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            persons.value = list.value.filter((item) => {
                return item.label.toLowerCase().includes(query.toLowerCase())
            })
        }, 200)
    } else {
        persons.value = []
    }
}

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



const title = ref(''), content = ref(''), person = ref(''), time = ref('')

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure you want to close this?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

const itemClick = (id: number) => {
    console.log(id)
    title.value = '事项详情' + id
    drawerTask.value = true
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
.el-timeline {
    padding-left: 0;
}

.task-box {
    display: flex;
    height: 100%;
}

h3 {
    padding: 5px;
}

.el-drawer__header {
    margin-bottom: 0;
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

.task-list.list-add:hover {
    cursor: pointer;
}

.task-detail {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.task-detail>* {
    padding-bottom: 10px;
}

.btn.task-save {
    /* position: relative; */
    margin-top: 10px;
    float: right;
}

.task-detail .task-timeline {
    max-height: 35vh;
    overflow: auto;
}

.task-detail .task-detail-person {
    display: flex;

}
</style>