<template>
    <el-space wrap fill direction="vertical" :fill-ratio="60" style="width: 100%" v-loading.fullscreen.lock="loading">
        <el-input type="text" v-model="name" class="form-control" id="name" placeholder="用户名" />
        <el-input type="text" v-model="email" class="form-control" id="email" placeholder="邮箱" />
        <el-input show-password type="password" v-model="password" class="form-control" id="password"
            placeholder="密码" />
        <el-input show-password type="password" v-model="verifyPassword" class="form-control" id="verifyPassword"
            placeholder="再次输入密码" />
        <el-button class="btn" v-on:click="signup()">注册</el-button>
    </el-space>
</template>
<script setup lang="ts">
import router from '@/router';
import EasyWorkAPI from '@/utils/EasyWorkAPI';
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const name = ref(''), email = ref(''), verifyPassword = ref(''), password = ref(''), error = ref('');
let loading: boolean;

const signup = () => {
    loading = true;
    EasyWorkAPI.signup(name.value, email.value, password.value)
        .then((res: any) => {
            loading = false;
            ElMessageBox.alert(res.message, '提示', {
                type: 'success',
                confirmButtonText: '确定'
            }).then(() => {
                router.push('/login')
            })
        })
        .catch(error => {
            loading = false;
            console.log(error);
            ElMessageBox.alert(error, '提示', {
                type: 'error',
                confirmButtonText: '确定',
            })
        });
}
</script>
<style>
.column input {
    font-size: 1.2em;
    margin-top: 1rem;
}

.btn {
    font-size: 1.2em;
    margin-top: 1rem;
}
</style>