<template>
    <el-drawer v-model="show" :title="'#' + taskId" :size="'45%'" :direction="'rtl'" :before-close="onClose"
        style="max-width: 35vw;">
        <div class="task-detail">
            <div class="task-detail-title">
                <h3 style="padding-left: 0;">事项标题:
                    <a>{{ taskInfo.name }}</a>
                    <!-- <el-button text :icon="Edit" @click="editTitleEvent" /> -->
                </h3>

            </div>
            <div class="task-detail-person">
                <h4>责任人:</h4>
                <!-- TODO -->
                <Tags :tags="tags" :addTag="() => { }" :showAddBtn="false" :del-tag="(item) => { }"
                    style="margin-left: 5px;" />
            </div>
            <div class="task-detail-content">
                <h4>事项内容:</h4>
                <el-input type="textarea" :resize="'none'" :rows="10" v-model="content" placeholder="请输入事项内容" />
            </div>
            <div class="task-detail-time">
                <h4>事项时间:</h4>
                <div>
                    <div style="width: 100%; display: flex;">
                        <el-date-picker style="flex: 1;" v-model="taskInfo.create_time" type="datetime"
                            placeholder="开始时间" :shortcuts="shortcuts" />
                        <el-date-picker style="flex: 1;" v-model="taskInfo.deadline" type="datetime" placeholder="结束时间"
                            :shortcuts="shortcuts" />
                    </div>

                    <el-progress :stroke-width="24" :percentage="percentage" :status="timeStatus">
                    </el-progress>
                </div>
            </div>
            <el-timeline class="task-timeline">
                <el-timeline-item v-for="(item, key) in taskTimeLine" :timestamp="item.time" placement="top">
                    <el-card>
                        {{ item.details }}
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <div class="task-detail-content">
                <h4>评论</h4>
                <el-input type="textarea" :resize="'none'" :rows="10" placeholder="请输入评论内容" />
                <el-button class="btn task-save">
                    发送
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import Tags from './Tags/Tags.vue';
import type tag from './Tags/Tags-Type';
import EasyWorkAPI from '@/utils/EasyWorkAPI';
import type { TaskInfo, TimeLine } from '@/utils/Model';
import { ElMessage, ElMessageBox } from 'element-plus';
import lodash from 'lodash';
import { watch, ref } from 'vue';
import { Edit } from '@element-plus/icons-vue';

const props = defineProps<{
    show: boolean, // 是否显示
    taskId: number, // 任务id
    onClose: (done: () => void) => void,
}>()

const edit_title = ref<HTMLInputElement | null>(null)
const editTitleEvent = () => {
    ElMessageBox.prompt('请输入任务名称', '更改任务名', {
        inputValue: taskInfo.value.name,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,60}$/,
        inputErrorMessage: '任务名称长度在1-60之间',
    }).then(({ value }) => {
        if (value) {
            // 
        }
    }).catch(() => {
        // cancel
    })

}
const editTitle = ref(false), title = ref('')
const content = ref<string>(''), percentage = ref(0)
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
const tags = ref<tag[]>([])
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

watch(
    () => lodash.cloneDeep(props.show),
    (state, prevState) => {
        if (state && props.taskId != 0) {
            EasyWorkAPI.task.getInfo(props.taskId).then((res: any) => {
                tags.value = res.assignee.map((item: any) => {
                    return {
                        id: 1,
                        name: item
                    }
                });
                content.value = res.details;
                taskInfo.value = res;

                // 计算时间进度
                let start = new Date(res.create_time),
                    now = new Date(),
                    end = new Date(res.deadline);
                let time = end.getTime() - start.getTime();
                let nowTime = now.getTime() - start.getTime();
                percentage.value = Math.floor(nowTime / time * 100);

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
    max-height: 35vh;
    overflow: auto;
}

.task-detail .task-detail-person {
    display: flex;

}

.task-detail .task-detail-time .time {}
</style>