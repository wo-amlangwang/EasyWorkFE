<template>
    <div v-show="!props.projeckId">
        <!-- 零页 -->
        <el-empty description="" />
    </div>
    <div v-show="props.projeckId" class="task-box">
        <div class="task-list" v-for="(item, index) in taskList" :key="index">
            <h3>
                {{ item.title }}
            </h3>
            <Box :key="index" :accept="item.access" :onDrop="() => ({
                name: `${item.status}`,
                allowedDropEffect: 'move',
            })">
                <Item v-for="(task, idx) in item.task" :key="task.id" :id="task.id" :title="task.name"
                    :person="task.assignee" @click="taskId = task.id; drawerTask = true" :end="item.handle">
                </Item>
            </Box>
        </div>
        <div class="project-info">
            <div class="head">
                <h2><a style="color: #cccccc; margin-right: .2em;">
                        {{ '#' + projeckInfo.id }}</a>项目详情
                    <el-button text :icon="Delete" @click="deleteProject" />
                </h2>
            </div>
            <div class="body">
                <div class="item">
                    <h3>
                        项目名
                        <el-button text :icon="Edit" @click="editProjectName" />
                    </h3>
                    <a>
                        {{ projeckInfo.name }}
                    </a>
                </div>
                <div class="item">
                    <h3>创建者</h3>
                    <span>{{ projeckInfo.master }}</span>
                </div>
                <div class="item">
                    <h3>创建时间</h3>
                    <a>{{ projeckInfo.create_time }}</a>
                </div>
                <div class="item">
                    <h3>
                        说明
                        <el-button text :icon="Edit" @click="editProjectDetails" />
                    </h3>
                    <p>{{ projeckInfo.details }}</p>
                </div>
                <div class="item">
                    <h3>
                        项目成员
                    </h3>
                    <Tags :tags="projectMember" :addTag="() => { dialogAddMember = true }" :del-tag="delTag"
                        :showAddBtn='true' style="margin-left: 5px;" />
                </div>
                <el-button style="width: 100%;" @click="dialogNewTask = true">
                    创建任务
                </el-button>
            </div>
        </div>
    </div>

    <!-- 事项详情 -->
    <TaskInfoComponents :show="drawerTask" :task-id="taskId" :onClose="taskInfoDrawClose" />
    <!-- 新建任务 -->
    <el-dialog v-model="dialogNewTask" title="新建任务" width="30%" class="dialog-card">
        <div>
            <div class="dialog-item">
                任务标题:
                <el-input v-model="newTaskInfo.name" placeholder="请输入任务名" />
            </div>
            <div class="dialog-item">
                任务说明:
                <el-input type="textarea" :resize="'none'" :rows="4" v-model="newTaskInfo.details"
                    placeholder="请输入任务内容" />
            </div>
            <div class="dialog-item">
                截至时间:
                <el-date-picker v-model="newTaskInfo.deadline" type="datetime" placeholder="截止时间"
                    :shortcuts="shortcuts" />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogNewTask = false">取消</el-button>
                <el-button type="primary" @click="dialogNewTask = false; createTask()">创建</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 添加成员 -->
    <AddMember :show="dialogAddMember" :cancel="() => { dialogAddMember = false; }" :done="projectAddMembers" />
</template>
<script setup lang="ts">
import lodash from 'lodash';
import { watch, ref } from 'vue';
import Item from '@/components/Item.vue';
import Box from '@/components/Box.vue';
import Tags from '@/components/Tags/Tags.vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import type tag from "@/components/Tags/Tags-Type";
import type { TaskInfo, TimeLine, ProjectInfo, UserInfo } from '@/utils/Model';
import EasyWorkAPI from '@/utils/EasyWorkAPI';
import { ElMessage } from 'element-plus'
import AddMember from '../../components/AddMember.vue';
import NewTask from '../../components/NewTask.vue';
import TaskInfoComponents from '../../components/TaskInfo.vue';
// 事项列表
interface TaskList {
    title: string
    access: string[]
    handle: (item: any, monitor: any) => void
    task: TaskInfo[],
    status: number
}

interface DropResult {
    allowedDropEffect: string
    dropEffect: string
    name: string
}

const props = defineProps<{
    projeckId: string // 事项ID
    projectChange: (projectId: string, type: number) => void
}>()

// 是否展示事项详情面板
const drawerTask = ref(false)
const dialogNewTask = ref(false)
const dialogAddMember = ref(false)

const taskId = ref(0)

// 项目用户列表
const projectMember = ref<tag[]>([])

// 项目详情
const projeckInfo = ref<ProjectInfo>({
    id: 0,
    name: '',
    details: '',
    master: '',
    create_time: '',
    deleted: 0
});
const shortcuts = [
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '明天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '一周后',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            return date
        },
    },
    {
        text: '一个月后',
        value: () => {
            const date = new Date()
            date.setMonth(date.getMonth() + 1)
            return date
        },
    },
]
// 新建任务信息
const newTaskInfo = ref<TaskInfo>({
    id: 0,
    name: '',
    details: '',
    priority: 0,
    type: 0,
    create_user: '',
    create_time: '',
    update_user: '',
    update_time: '',
    deadline: '',
    assignee: [],
    status: 0,
    task_comment: '',
    deleted: 0,
    time_line: []
})

// 处理拖放
const handleDrop = (item: any, monitor: any) => {
    const dropResult = monitor.getDropResult() as DropResult
    console.log(item, dropResult, dropResult.name);
    taskList.value[taskMap.get(item.name)].task.forEach(task => {
        if (task.id == item.name && taskMap.has(item.name)) {
            taskList.value[Number(dropResult.name)].task.push(task);
            taskList.value[taskMap.get(item.name)].task
                .splice(taskList.value[taskMap.get(item.name)]
                    .task.indexOf(task), 1);
            taskMap.set(item.name, dropResult.name);
            EasyWorkAPI.task.updateStatus(Number(props.projeckId), item.name, Number(dropResult.name));
        }
    })
}

const loading = ref(false)
const taskInfo = ref<TaskInfo>({
    id: 0,
    name: '',
    details: '',
    type: 0,
    create_user: '',
    update_user: '',
    priority: 0,
    create_time: '',
    update_time: '',
    deadline: '',
    assignee: [],
    status: 0,
    task_comment: '',
    deleted: 0,
    time_line: []
})

const tags = ref<tag[]>([])
const content = ref(''), percentage = ref(0)

const taskList = ref<TaskList[]>([
    {
        title: '未开始',
        access: ['item'],
        handle: handleDrop,
        task: [],
        status: 0
    },
    {
        title: '进行中',
        access: ['item'],
        handle: handleDrop,
        task: [],
        status: 1
    },
    {
        title: '已完成',
        access: ['item'],
        handle: handleDrop,
        task: [],
        status: 2
    }
]);

const taskMap = new Map();
// 事项时间轴demo
// taskTimeLine.value = [
//     {
//         type: 1,
//         time: "2018/4/12 20:46",
//         details: "张三 创建了任务"
//     },
//     {
//         type: 2,
//         time: "2018/4/12 20:46",
//         details: "李四: 该需求需要进一步评估"
//     }
// ]

// 新建任务
const createTask = () => {
    newTaskInfo.value.assignee = ['' + localStorage.getItem('username')]
    EasyWorkAPI.task.craete(Number(props.projeckId), newTaskInfo.value).then(res => {
        ElMessage.success('创建成功')
        taskList.value[0].task.push(newTaskInfo.value);
        taskMap.set(res, 0);
    }).catch(res => {
        ElMessage.error('创建失败: ' + res)
    })
}

// 修改项目说明
const editProjectDetails = () => {
    ElMessageBox.prompt('请输入项目说明', '项目说明', {
        inputType: 'textarea',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: projeckInfo.value.details,
    }).then(({ value }) => {
        console.log(value)
        projeckInfo.value.details = value;
        return EasyWorkAPI.project.update(projeckInfo.value.id, projeckInfo.value.name, value);
    }).then(res => {
        ElMessage.success(res)
    }).catch(res => {
        if (res != 'cancel') {
            ElMessage.error(res)
        }
        console.log(res)
    })
};


const projectAddMembers = (value: string[]) => {
    console.log(value);
    dialogAddMember.value = false;
    let addTask: Promise<string>[] = [];
    value.forEach(item => {
        addTask.push(EasyWorkAPI.project.addMember(projeckInfo.value.id, Number(item.split(':')[0])));
    })
    Promise.all(addTask).then(res => {
        refreshProjectMember();
        ElMessage.success('添加成功')
    }
    ).catch(res => {
        ElMessage.error(res)
    })
}

// 刷新项目成员
const refreshProjectMember = () => {
    let cd = projeckInfo.value.master === localStorage.getItem('username');
    EasyWorkAPI.project.getMembers(Number(props.projeckId)).then(res => {
        projectMember.value = res.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                canDel: cd
            }
        })
    }).catch(err => {
        ElMessage.error(err)
    })
};

// 修改项目名称
const editProjectName = () => {
    ElMessageBox.prompt('请输入项目名称', '项目名称', {
        inputType: 'text',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: projeckInfo.value.name,
    }).then(({ value }) => {
        projeckInfo.value.name = value;
        return EasyWorkAPI.project.update(projeckInfo.value.id, value, projeckInfo.value.details);
    }).then(res => {
        ElMessage.success(res)
        props.projectChange(projeckInfo.value.name, 2)
    }).catch(res => {
        if (res != 'cancel') {
            ElMessage.error(res)
        }
        console.log(res)
    })
};

// 删除项目
const deleteProject = () => {
    ElMessageBox.confirm('确定删除项目吗？', '删除项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(() => {
        return EasyWorkAPI.project.delete(Number(props.projeckId));
    }).then(res => {
        ElMessage.success(res)
        props.projectChange(projeckInfo.value.name, 1)
    }).catch(res => {
        if (res != 'cancel') {
            ElMessage.error(res)
        }
        console.log(res)
    })
}

// 点击事项弹出详情面板
const itemClick = (id: number) => {

}

// 删除负责人回调事件
const delTag = (item: any) => {
    console.log(item);
}

// 远程用户列表
const remoteMethod = (query: string) => {
    if (query) {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            // persons.value = list.value.filter((item) => {
            //     return item.label.toLowerCase().includes(query.toLowerCase())
            // })
        }, 200)
    } else {
        // persons.value = []
    }
}

// 关闭事项详情弹窗确认 可以在这里做保存操作
const taskInfoDrawClose = (done: () => void) => {
    done();
}


// 添加事项列表
const addList = () => {
    taskList.value.push({
        title: 'TODO',
        access: ['item'],
        handle: handleDrop,
        task: [],
        status: -1
    });
}

// 事项ID变化监视
watch(
    () => lodash.cloneDeep(props.projeckId),
    (state, prevState) => {
        // 事项详情
        taskMap.clear();
        taskList.value = [
            {
                title: '未开始',
                access: ['item'],
                handle: handleDrop,
                task: [],
                status: 0
            },
            {
                title: '进行中',
                access: ['item'],
                handle: handleDrop,
                task: [],
                status: 1
            },
            {
                title: '已完成',
                access: ['item'],
                handle: handleDrop,
                task: [],
                status: 2
            }
        ];
        let cd = false;
        EasyWorkAPI.project.getTaskList(Number(props.projeckId)).then(res => {
            res.forEach(item => {
                taskList.value[item.status].task
                    .push(item);
                taskMap.set(item.id, item.status);
            })
            return EasyWorkAPI.project.getInfo(Number(props.projeckId));
        }).then(res => {
            projeckInfo.value = res;
            cd = projeckInfo.value.master === localStorage.getItem('username');
            return EasyWorkAPI.project.getMembers(Number(props.projeckId));
        }).then(res => {
            projectMember.value = res.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    canDel: cd
                }
            })
        }).catch(err => {
            console.log(err)
        })
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

.project-info {
    width: 300px;
    padding: 10px;
    background-color: #fff;
    border-right: 1px solid #ebeef5;
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;

}

.project-info .head {
    padding: 10px 5px 0 5px;
}

.project-info .body {
    padding: 5px 5px 10px 5px;
}

.project-info .head h2 {
    padding-left: 0;
    font-size: 1em;
}

.project-info .item {
    margin-bottom: .5em;
}

.project-info .item h3 {
    padding-left: 0;
    padding-bottom: 0;
    font-size: 1.4em;
}

.dialog-item {
    margin-bottom: 10px;
}

h3 {
    padding: 5px;
}

.el-drawer__header {
    margin-bottom: 0;
}
</style>