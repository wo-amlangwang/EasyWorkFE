<template>
    <el-dialog v-model="show" title="新建任务" width="30%" class="dialog-card" :before-close="close">
        <div>
            <div class="dialog-item">
                任务标题:
                <el-input v-model="newTaskInfo.name" placeholder="请输入任务名" />
            </div>
            <div class="dialog-item">
                <label for="taskType">类型: </label>
                <el-select id="taskType" v-model="taskType" class="select-task-type" @change="taskTypeChange">
                    <el-option :value="'🟣任务'" :key="0" />
                    <el-option :value="'🔴缺陷'" :key="1" />
                    <el-option :value="'🔵功能'" :key="2" />
                    <el-option :value="'🟢测试'" :key="3" />
                </el-select>
                <label for="taskPriority">优先级: </label>
                <el-select id="taskPriority" v-model="taskPriority" class="select-task-type"
                    @change="taskPriorityChange">
                    <el-option :value="'🔴高级'" :key="0" />
                    <el-option :value="'🟠中级'" :key="1" />
                    <el-option :value="'⚪低级'" :key="2" />
                </el-select>
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
                <el-button @click="clear(); onClose(() => { })">取消</el-button>
                <el-button type="primary" @click="create(newTaskInfo); clear();">创建</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import type { TaskInfo } from '@/utils/Model';
import { List } from '@element-plus/icons-vue';
import { ref } from 'vue';

const props = defineProps<{
    show: boolean, // 是否显示
    onClose: (done: () => void) => void,
    create: (info: TaskInfo) => void,
}>()

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
const taskPriorityChange = (item: string) => {
    let value = 1;
    switch (item) {
        case '🔴高级':
            value = 2;
            break;
        case '🟠中级':
            value = 1;
            break;
        case '⚪低级':
            value = 0;
            break;
    }
    newTaskInfo.value.priority = value
}
const taskTypeChange = (item: string) => {
    let value = 0;
    switch (item) {
        case '🟣任务':
            value = 0;
            break;
        case '🔴缺陷':
            value = 1;
            break;
        case '🔵功能':
            value = 2;
            break;
        case '🟢测试':
            value = 3;
            break;
    }
    newTaskInfo.value.type = value
    console.log(taskType);
}
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
const taskType = ref(''), taskPriority = ref('')
const clear = () => {
    newTaskInfo.value = {
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
    }
    taskPriority.value = '';
    taskType.value = '';
}

const close = (done: () => void) => {
    console.log('close')
    done()
    clear();
    props.onClose(done);
}
</script>
<style>
</style>