<template>
    <el-dialog v-model="show" title="添加成员" width="30%" class="dialog-card">
        <el-select v-model="value" multiple filterable remote reserve-keyword placeholder="请输入用户名"
            :remote-method="remoteMethod" :loading="loading" style="width: 100%;">
            <el-option v-for="item in options" :key="item.id" :value="item.id + ': ' + item.nickname" />
        </el-select>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="add()">添加</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { UserInfo } from '@/utils/Model';
import EasyWorkAPI from '@/utils/EasyWorkAPI';
const options = ref<UserInfo[]>([])
const loading = ref(false)
const value = ref<string[]>([])

const props = defineProps<{
    show: boolean,
    cancel: () => void,
    done: (value: string[]) => void,
}>()

const add = () => {
    props.done(value.value)
    value.value = []
}
const remoteMethod = (query: string) => {
    if (query) {
        loading.value = true;
        console.log('remoteMethod')
        // 自带限流器 不用担心请求过多
        EasyWorkAPI.user.search(query).then(res => {
            options.value = res;
            loading.value = false
        })
    } else {
        options.value = []
    }
}
</script>