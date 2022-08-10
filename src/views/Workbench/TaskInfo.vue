<template>
    <el-drawer v-model="show" :size="'45%'" :direction="'rtl'" :before-close="onClose" style="max-width: 35vw;">
        <div class="task-detail">
            <div class="task-detail-title">
                <h3>
                    <a class="id">{{ '#' + taskId }} </a>
                    {{ taskInfo.name }}
                </h3>
                <el-button text :icon="Edit" @click="editTitleEvent" />
            </div>
            <div>
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
            <div class="task-detail-person">
                <a style="margin-right: .5em; padding-top: 3px;">指派人: </a>
                <el-select v-model="assigneeValue" placeholder="请选择指派人" @change="upAssignee">
                    <el-option v-for="item in members" :key="item" :value="item.nickname" />
                </el-select>
            </div>
            <div class="task-detail-content">
                <h4>事项内容:</h4>
                <el-input type="textarea" :resize="'none'" :rows="10" v-model="content" placeholder="请输入事项内容" />
            </div>
            <div class="task-detail-time">
                <h4>事项时间:</h4>
                <div>
                    <div style="width: 100%; display: flex; margin-bottom: 10px;">
                        <el-date-picker style="flex: 1;" v-model="taskInfo.create_time" type="datetime"
                            placeholder="开始时间" :shortcuts="shortcuts" />
                        <el-date-picker style="flex: 1;" v-model="taskInfo.deadline" type="datetime" placeholder="结束时间"
                            :shortcuts="shortcuts" />
                    </div>

                    <el-progress :stroke-width="24" :percentage="percentage" :status="timeStatus">
                        {{ percentage }}%
                    </el-progress>
                </div>
            </div>
            <el-timeline class="task-timeline">
                <el-timeline-item v-for="(item, key) in taskTimeLine" :timestamp="item.time" placement="top">
                    <el-card>
                        <div class="header">
                            <a>{{ item.user }}</a>
                            {{ ' ' + (item.type === 2 ? '评论: ' : ':') }}
                            <span>{{ item.time }}</span>
                        </div>
                        <div class="body">
                            <p>{{ item.details }}</p>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <div class="task-detail-content">
                <h4>评论</h4>
                <el-input v-model="commentContent" type="textarea" :resize="'none'" :rows="10" placeholder="请输入评论内容" />
                <el-button class="btn task-save" @click="sendComment">
                    发送
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import EasyWorkAPI from '@/utils/EasyWorkAPI';
import type { TaskInfo, TimeLine, UserInfo } from '@/utils/Model';
import { ElMessage, ElMessageBox } from 'element-plus';
import lodash from 'lodash';
import { watch, ref } from 'vue';
import { Edit } from '@element-plus/icons-vue';

const props = defineProps<{
    show: boolean, // 是否显示
    taskId: number, // 任务id
    members: UserInfo[], // 成员列表
    onClose: (done: () => void) => void,
}>()
const commentContent = ref('')
const taskType = ref(''), taskPriority = ref('')

const editTitleEvent = () => {
    ElMessageBox.prompt('请输入任务名称', '更改任务名', {
        inputValue: taskInfo.value.name,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,60}$/,
        inputErrorMessage: '任务名称长度在1-60之间',
    }).then(({ value }) => {
        if (value) {
            taskInfo.value.name = value
            EasyWorkAPI.task.update(taskInfo.value).then(() => {
                ElMessage.success('修改成功')
            }).catch(() => {
                ElMessage.error('修改失败')
            })
        }
    }).catch(() => {
        ElMessage.info('取消修改')
    })
}

const sendComment = () => {
    if (!content) {
        ElMessage.error('请输入评论内容');
        return;
    }
    EasyWorkAPI.task.comment(taskInfo.value.id, commentContent.value).then(res => {
        let me = localStorage.getItem('username');
        me = me === null ? '匿名' : me;
        taskTimeLine.value.push({
            id: res,
            type: 2,
            user: me,
            time: new Date().toLocaleString(),
            details: commentContent.value
        })
        commentContent.value = '';
    }).catch(err => {
        ElMessage.error(err);
    })
}

const upAssignee = () => {
    console.log(123);
    taskInfo.value.assignee = [assigneeValue.value];
    EasyWorkAPI.task.update(taskInfo.value).then(res => {
        ElMessage.success('指派成功');
    }).catch(err => {
        ElMessage.error(err);
    })
}

const content = ref<string>(''), percentage = ref(0), assigneeValue = ref('')
const taskTimeLine = ref<TimeLine[]>([]), taskInfo = ref<TaskInfo>({
    id: 0,
    name: '加载失败',
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

const timeStatus = ref('')
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
    taskInfo.value.priority = value
    EasyWorkAPI.task.update(taskInfo.value).then(res => {
        ElMessage.success('更改优先级成功');
    }).catch(err => {
        ElMessage.error(err);
    })
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
    taskInfo.value.type = value
    EasyWorkAPI.task.update(taskInfo.value).then(res => {
        ElMessage.success('更改类型成功');
    }).catch(err => {
        ElMessage.error(err);
    })
}
const TaskType = ['🟣任务', '🔴缺陷', '🔵功能', '🟢测试']
const TaskPriority = ['⚪低级', '🟠中级', '🔴高级']
watch(
    () => lodash.cloneDeep(props.taskId),
    (state, prevState) => {
        if (state != 0) {
            EasyWorkAPI.task.getInfo(props.taskId).then(res => {
                content.value = res.details;
                taskInfo.value = res;
                // 计算时间进度
                let start = new Date(res.create_time),
                    now = new Date(),
                    end = new Date(res.deadline);
                let time = end.getTime() - start.getTime();
                let nowTime = now.getTime() - start.getTime();
                percentage.value = Math.floor(nowTime / time * 100);
                percentage.value = percentage.value > 100 ? 100 : percentage.value;
                if (taskInfo.value.status !== 2) {
                    if (percentage.value >= 100) {
                        timeStatus.value = 'exception';
                    } else if (percentage.value >= 75) {
                        timeStatus.value = 'exception';
                    } else if (percentage.value >= 50) {
                        timeStatus.value = 'warning';
                    } else {
                        timeStatus.value = '';
                    }
                } else {
                    timeStatus.value = 'success';
                }
                assigneeValue.value = taskInfo.value.assignee[0];
                taskPriority.value = TaskPriority[taskInfo.value.priority];
                taskType.value = TaskType[taskInfo.value.type];
                return EasyWorkAPI.task.getTimeLine(props.taskId);
            }).then(res => {
                taskTimeLine.value = res;
            }).catch((err: any) => {
                ElMessage.error(err)
            })
        }
    }
)
</script>

<style>
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
    overflow: auto;
}

.task-detail .task-detail-person {
    display: flex;
}

.task-timeline .header span {
    position: absolute;
    right: 0;
    color: #ccc;
}

.task-timeline .header a {
    color: #1890ff;
}

.task-detail-title h3 {
    display: inline;
}

.task-detail-title .id {
    color: #777;
    margin-right: .2em;
}

.type-select {
    width: 3em;
    height: 1.3em;
}

.el-input__wrapper {
    widows: 10em;
}

.select-task-type {
    width: 5em;
}

.select-task-type .el-input__suffix-inner {
    display: none;
}

.select-task-type .el-input__wrapper,
.select-task-type .el-select:hover,
.select-task-type .el-select .el-input.is-focus .el-input__wrapper .select-task-type .el-input__wrapper.is-focus {
    box-shadow: none;
}
</style>