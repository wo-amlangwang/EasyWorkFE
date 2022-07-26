<template>
    <el-row>
        <el-col :span="4">
            <div>
                <img src="">
            </div>
            <el-menu class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen" @close="handleClose"
                @select="handleSelect">
                <el-button @click="isCollapse = !isCollapse" text
                    style="width:100%; padding-top: 20px; padding-bottom: 20px;">
                    <el-icon :size="20">
                        <svg v-if="isCollapse" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                            data-v-78e17ca8="">
                            <path fill="currentColor"
                                d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z">
                            </path>
                        </svg>
                        <svg v-if="!isCollapse" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                            data-v-78e17ca8="">
                            <path fill="currentColor"
                                d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z">
                            </path>
                        </svg>
                    </el-icon>
                </el-button>
                <el-menu-item v-for="(item, index) in projeckList" :key="index" :index="item.id">
                    <el-icon :size="20">
                        <Notebook />
                    </el-icon>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
                <el-menu-item :index="`newProjeck`">
                    <el-icon :size="20">
                        <Plus />
                    </el-icon>
                    <template #title>新建</template>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="20">
            <TaskBoard :projeckId="projeckId" />
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
    Plus,
    Notebook,
} from '@element-plus/icons-vue'
import TaskBoard from '@/components/TaskBoard.vue'

const projeckId = ref()
const isCollapse = ref(false)
let projeckList = [
    {
        icon: 'el-icon-plus',
        title: 'Projeck 1',
        id: 'abc123',
    },
    {
        icon: 'el-icon-plus',
        title: 'Projeck 2',
        id: 'abc124',
    },
    {
        icon: 'el-icon-plus',
        title: 'Projeck 3',
        id: 'abc125',
    },
]

const handleSelect = (index: string, keyPath: string[]) => {
    console.log(index, keyPath)
    if (index === 'newProjeck') {
        console.log('新建')
        projeckId.value = ''
    } else {
        projeckId.value = index
        console.log(`选择了 ${projeckId.value}`)
    }
}

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical {
    height: 100vh;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
