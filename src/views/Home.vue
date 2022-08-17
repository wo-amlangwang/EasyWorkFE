<template>
    <el-row style="height: 100vh;" class="color-background">
        <div class="content rigth-content">
            <el-col class="hidden-xs-only " :span="18" style="background-color: rgba(0, 0, 0, 0);">
            </el-col>
            <el-col :span="6" class="card">
                <nav>
                    <router-link :to="{ name: 'login' }" active-class="active">登录</router-link>
                    <router-link :to="{ name: 'signup' }" active-class="active">注册</router-link>
                </nav>
                <router-view />
            </el-col>
        </div>
    </el-row>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import EasyWorkAPI from "../utils/EasyWorkAPI";

const router = useRouter()

if (router.currentRoute.value.fullPath === '/'){
    router.push('/login')
} else {
    EasyWorkAPI.user.getUserInfo()
    .then((res: any) => {
        router.push({ name: 'workbench' })
    })
    .catch(error => {
        // 设置默认显示的路由
    })
}

</script>
<style>
.rigth-content {
    background-color: #7c7c7c2f;
    display: flex;
    min-height: 100vh;
    width: 100%;
    text-shadow:
        0px 0px 1px rgba(255, 255, 255, .6),
        0px 0px 4px rgba(0, 0, 0, .05);
}

nav {
    font: 2.4em sans-serif;
    text-align: center;
    margin-bottom: 1rem;
}

nav .active {
    border-bottom: 2px solid #7f7f7f;
}

nav a {
    text-decoration: none;
    display: inline-block;
    color: #343434;
    padding: 0 15px;
}

.card {
    width: 100%;
    padding-top: 25vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

:root {
    font-size: 15px;
}
</style>