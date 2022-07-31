<template>
    <div class="common-layout">
        <el-container>
            <el-container>
                <el-aside>
                    <el-menu class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen" @close="handleClose"
                        @select="handleSelect">
                        <div class="user">
                            <el-avatar @click="dialogUser = true" shape="square" class="user-avatar" :size="32"
                                :fit="'fill'" :src="'/src/assets/avatar.jpg'" />
                            <div class="user-info">
                            </div>
                        </div>

                        <el-menu-item v-for="(item, index) in projeckList" :key="index" :index="item.id">
                            <el-icon :size="20">
                                <Notebook />
                            </el-icon>
                            <template #title>{{ item.title }}</template>
                        </el-menu-item>

                        <div class="btn-control">

                            <el-button :index="`newProjeck`" text
                                style="flex: 1; padding-top: 20px; padding-bottom: 20px; margin-left: 0;">
                                <el-icon :size="20">
                                    <Plus />
                                </el-icon>
                            </el-button>
                            <el-button @click="isCollapse = !isCollapse" text
                                style="flex: 1; padding-top: 20px; padding-bottom: 20px; margin-left: 0;">
                                <el-icon :size="20">
                                    <DArrowRight v-if="isCollapse" />
                                    <DArrowLeft v-if="!isCollapse" />
                                </el-icon>
                            </el-button>
                        </div>

                    </el-menu>
                </el-aside>
                <el-main>
                    <DndProvider :backend="HTML5Backend">
                        <TaskBoard :projeckId="projeckId" />
                    </DndProvider>
                </el-main>
            </el-container>
        </el-container>
        <!-- 个人信息 -->
        <el-dialog v-model="dialogUser" title="个人信息" width="30%">
            <div>
                <div>
                    用户名:
                    <el-input v-model="userInfo_Name" placeholder="Please input" />
                </div>
                <div>
                    邮箱:
                    <el-input v-model="userInfo_email" placeholder="Please input" />
                </div>
                <div>
                    头像:
                    <el-upload class="avatar-uploader" action="" accept=".jpg, .png" :show-file-list="false"
                        :on-change="getFile" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                        :auto-upload="false">
                        <el-avatar shape="square" class="user-avatar" :size="32"
                            :fit="'fill'"  v-if="userInfo_avatar" :src="userInfo_avatar"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </div>
                <div>
                    密码:
                    <el-input type="password" show-password v-model="userInfo_passwd" placeholder="Please input" />
                </div>
                <div>
                    确认密码:
                    <el-input type="password" show-password v-model="userInfo_confirmPasswd"
                        placeholder="Please input" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogUser = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogUser = false">Confirm</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'vue3-dnd'
import { ref } from 'vue'
import { Plus, Notebook, DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import TaskBoard from '@/views/Workbench/TaskBoard.vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadFile, UploadFiles } from 'element-plus'

const imageUrl = ref('')
const projeckId = ref()
const isCollapse = ref(false)
const dialogUser = ref(false)
const userInfo_Name = ref(''),
    userInfo_email = ref(''),
    userInfo_avatar = ref(''),
    userInfo_passwd = ref(''),
    userInfo_confirmPasswd = ref('');

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

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    console.log(response)
    console.log(uploadFile)
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {

    getBase64(rawFile).then(res => {
        console.log(res)
    });
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const getFile = function (uploadFile: UploadFile, uploadFiles: UploadFiles) {
    getBase64(uploadFile.raw!).then(res => {
        console.log(res)
        userInfo_avatar.value = res
    });
}

const getBase64 = function (file: any): Promise<string>  {
    return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
            imgResult = reader.result ? reader.result.toString() : "";
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.onloadend = function () {
            resolve(imgResult);
        };
    });
}
</script>

<style>
.user .user-avatar {}

.user {
    display: flex;
    align-items: center;
    height: var(--el-menu-item-height);
    line-height: var(--el-menu-item-height);
    font-size: var(--el-menu-item-font-size);
    color: var(--el-menu-text-color);
    padding: 0 var(--el-menu-base-level-padding);
    margin-top: 10px;
    list-style: none;
    cursor: default;
    position: relative;
    transition: border-color var(--el-transition-duration), background-color var(--el-transition-duration), color var(--el-transition-duration);
    box-sizing: border-box;
    white-space: nowrap;
}

.user .user-info {
    /* left: 42px;
    top: 44px;
    float: right;
    width: 100px;
    height: 100px;
    visibility: hidden;
    background-color: #000;
    position: fixed;
    border-radius: 4px;
    border: 1px solid #ccc; */
}

.user .user-avatar:hover~.user-info {
    visibility: visible;
}

.user .user-avatar:hover {
    cursor: pointer;
}

.el-container,
.el-aside,
.common-layout {
    height: 100%;
}

.el-menu-vertical {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.el-menu-vertical button {
    width: 100%;
    margin: 0 auto;
}

.el-menu-vertical:not(.el-menu--collapse) button {
    width: 50%;
    margin: 0 auto;
    transition: border-color var(--el-transition-duration), background-color var(--el-transition-duration), color var(--el-transition-duration);
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 240px;
    min-height: 400px;
}

.el-row {
    height: 100%;
}

.el-aside {
    width: var(--el-aside-width, auto);
}
</style>
