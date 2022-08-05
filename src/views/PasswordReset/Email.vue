<template>
    <div class="color-background" v-loading.fullscreen.lock="loading" style="display: flex; justify-content: center;">
        <div class="content content-center">
            <el-steps :active="active" finish-status="success" :align-center="true">
                <el-step title="验证邮箱" />
                <el-step title="设置密码" />
            </el-steps>
            <div style="margin-top: 30px;">
                <el-space wrap fill direction="vertical" :fill-ratio="80" style="width: 100%">
                    <el-input type="text" v-model="name" id="name" placeholder="用户名/邮箱" />
                    <el-button class="btn" v-on:click="verifyEmail()" style="width: 8em;">重置密码</el-button>
                </el-space>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import "../../assets/reset_password.css";
const name = ref(''), loading = ref(false), active = ref(0);
const router = useRouter()

// 验证邮箱
const verifyEmail = function () {
    if (name.value.length === 0) {
        alert('请输入用户名或邮箱')
        return
    }
    // 发送验证邮件
    loading.value = true
    /*
    * 伪代码
    * 发送验证邮件
    * EasyWorkAPI.verifyEmail(name.value).then(res => {
    *     loading.value = false
    *     if (res.code === 0) {
    *         alert('验证邮件已发送，请前往邮箱查收')
    *         router.push('/login')
    *     } else {
    *         alert(res.msg)
    *     }
    * })
    */

    // 开发调试
    router.push({ name: 'password_reset_set_password' })
}
</script>
<style>

</style>