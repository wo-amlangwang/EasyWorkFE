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
const router = useRouter()

// 设置默认显示的路由
if (router.currentRoute.value.fullPath === '/')
    router.push('/login')


</script>
<style>
.rigth-content {
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

@keyframes move {

    /* 动画初始状态，和结束状态 */
    0%,
    100% {
        /* 以屏幕长的一边计算，控制它们的大小 */
        background-size:
            130vmax 130vmax,
            80vmax 80vmax,
            90vmax 90vmax,
            110vmax 110vmax,
            90vmax 90vmax;

        /* 设置位置 */
        background-position:
            -80Vmax -80vmax,
            60Vmax -30vmax,
            10Vmax 10vmax,
            -30Vmax -10vmax,
            50Vmax 50vmax;
    }

    25% {
        background-size:
            100vmax 100vmax,
            90vmax 90vmax,
            100vmax 100vmax,
            90vmax 90vmax,
            60vmax 60vmax;

        /* 设置位置 */
        background-position:
            -60Vmax -60vmax,
            50Vmax -40vmax,
            0Vmax 10vmax,
            -40Vmax -20vmax,
            40Vmax 40vmax;
    }

    50% {
        background-size:
            90vmax 90vmax,
            100vmax 100vmax,
            80vmax 80vmax,
            90vmax 90vmax,
            60vmax 60vmax;

        /* 设置位置 */
        background-position:
            -70Vmax -70vmax,
            40Vmax -40vmax,
            0Vmax 10vmax,
            -50Vmax -30vmax,
            30Vmax 30vmax;
    }

    75% {
        background-size:
            80vmax 80vmax,
            70vmax 70vmax,
            80vmax 80vmax,
            70vmax 70vmax,
            50vmax 50vmax;

        /* 设置位置 */
        background-position:
            -60Vmax -60vmax,
            60Vmax -30vmax,
            10Vmax 10vmax,
            -40Vmax -40vmax,
            50Vmax 50vmax;
    }
}
</style>