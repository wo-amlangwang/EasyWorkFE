<template>
    <el-space wrap fill direction="vertical" 
        :fill-ratio="70" style="width: 100%" 
        v-loading.fullscreen.lock="loading">
        <el-input type="text" v-model="name" id="name" placeholder="用户名/邮箱" />
        <el-input type="password" v-model="password" id="password" show-password placeholder="密码" />
        <el-link 
            type="primary" 
            @click="router.push({name: 'password_reset'})"
            style="max-width: 5em; margin-left: auto;">
            忘记密码
        </el-link>
        <el-button class="btn" v-on:click="login()">登录</el-button>
    </el-space>
</template>

<script setup lang="ts">
import EasyWorkAPI from "../utils/EasyWorkAPI";
import router from "@/router";
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const name = ref(''), password = ref(''), veify = ref(''),
        loading = ref(false);

function login() {
    loading.value = true;
    EasyWorkAPI.login(name.value, password.value, '')
        .then(msg => {
            console.log(msg);
            let ret = JSON.parse(msg);
            loading.value = false;
            // 跳转至 "/workbench"
            if (ret.success) {
                console.log('登录成功');
                router.push({name: 'workbench'});
            } else {
                ElMessageBox.alert(ret.message, '登录失败', {
                    type: 'error',
                    confirmButtonText: '确定',
                });
            }
        })
        .catch(error => {
            console.log(13);
            loading.value = false;
            ElMessageBox.alert(error.message, '登录失败', {
                    type: 'error',
                    confirmButtonText: '确定',
            })
        });
}
</script>


<style>
.btn {
    font-size: 1.2em;
}
</style>