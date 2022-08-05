<template>
    <div class="color-background" v-loading.fullscreen.lock="loading" style="display: flex; justify-content: center;">
        <div class="content content-center">
            <el-steps :active="active" finish-status="success" :align-center="true">
                <el-step title="验证邮箱" />
                <el-step title="设置密码" />
            </el-steps>
            <div style="margin-top: 30px;">
                <el-space wrap fill direction="vertical" :fill-ratio="80" style="width: 100%">
                    <el-input show-password type="password" v-model="password" class="form-control" id="password"
                        placeholder="密码" />
                    <el-input show-password type="password" v-model="verifyPassword" class="form-control"
                        id="verifyPassword" placeholder="再次输入密码" />
                    <el-button class="btn" v-on:click="setpassword()">设定密码</el-button>
                </el-space>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import "../../assets/reset_password.css";

const password = ref(''), verifyPassword = ref(''), loading = ref(false), active = ref(1);
const router = useRouter()

// 重设密码
const setpassword = function () {
    if (password.value !== verifyPassword.value) {
        alert('两次输入的密码不一致');
        return;
    }
    active.value = 2;
    loading.value = true;

    // TODO: 发送重设密码请求
    setTimeout(() => {
        loading.value = false;
        router.push({ name: 'login' })
    }, 1300);
}
</script>
<style>
</style>