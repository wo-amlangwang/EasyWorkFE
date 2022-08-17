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
                    :person="task.assignee" @click="taskId=task.id; drawerTask = true" :end="item.handle">
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
                    <!-- <Tags :tags="projectMember" :addTag="() => { dialogAddMember = true }" :del-tag="delTag"
                        :showAddBtn='true' style="margin-left: 5px;" /> -->
                    <el-tag
                        v-for="tag in projectMember"
                        :key="tag"
                        class="tag-m3"
                        closable
                        :disable-transitions="false"
                        @close="delTag(tag)"
                    >
                        {{ tag.nickname }}
                    </el-tag>
                    <el-button class="tag-m3" size="small" @click="() => { dialogAddMember = true }">
                        添加成员
                    </el-button>
                </div>
                <el-button style="width: 100%;" @click="dialogNewTask = true">
                    创建任务
                </el-button>
            </div>
        </div>
    </div>

    <!-- 事项详情 -->
    <TaskInfoComponents :show="drawerTask" :taskId="taskId" :onClose="taskInfoDrawClose" :members="projectMember" />
    <!-- 新建任务 -->
    <NewTaskComponents :show="dialogNewTask" :onClose="newTaskInfoDrawClose" :create="createTask" />
    <!-- 添加成员 -->
    <AddMember :show="dialogAddMember" :cancel="() => { dialogAddMember = false; }" :done="projectAddMembers" />
</template>
<script setup lang="ts">
import lodash from 'lodash';
import { watch, ref } from 'vue';
import Item from '@/components/Item.vue';
import Box from '@/components/Box.vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import type { TaskInfo, ProjectInfo, UserInfo } from '@/utils/Model';
import EasyWorkAPI from '@/utils/EasyWorkAPI';
import { ElMessage } from 'element-plus'
import AddMember from './AddMember.vue';
import TaskInfoComponents from './TaskInfo.vue';
import NewTaskComponents from './NewTask.vue';

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
const inputAddTagVisible = ref(false)

const taskId = ref(0)

// 项目用户列表
const projectMember = ref<UserInfo[]>([])

// 项目详情
const projeckInfo = ref<ProjectInfo>({
    id: 0,
    name: '',
    details: '',
    master: '',
    create_time: '',
    deleted: 0
});


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

// 新建任务
const createTask = (info: TaskInfo) => {
    info.assignee = ['' + localStorage.getItem('username')]
    EasyWorkAPI.task.craete(Number(props.projeckId), info).then(res => {
        ElMessage.success('创建成功')
        info.id = res
        taskList.value[0].task.push(info);
        taskMap.set(res, 0);
    }).catch(res => {
        ElMessage.error('创建失败: ' + res)
    })
    dialogNewTask.value = false;
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
        projectMember.value = res
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

// 删除负责人回调事件
const delTag = (item: any) => {
    console.log(item);
}

// 关闭事项详情弹窗确认 可以在这里做保存操作
const taskInfoDrawClose = (done: () => void) => {
    drawerTask.value = false;
    done();
}

// 关闭新建任务弹窗确认 可以在这里做保存操作
const newTaskInfoDrawClose = (done: () => void) => {
    dialogNewTask.value = false;
    done();
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
            console.log(res)
            projectMember.value = res
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

.tag-m3 {
    margin: 3px;
    margin-left: 0;
}
</style>