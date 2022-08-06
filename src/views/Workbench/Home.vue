<template>
    <div class="common-layout">
        <el-container>
            <el-container>
                <el-aside>
                    <el-menu class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen" @close="handleClose"
                        @select="handleSelect">
                        <div class="user">
                            <el-avatar @click="imageUrl = userInfo.user_pic; dialogUser = true" shape="square"
                                class="user-avatar" :size="32" :fit="'fill'" :src="userInfo.user_pic" />
                            <div class="user-info">
                                Hello, {{ userInfo.nickname }}
                            </div>
                        </div>

                        <el-menu-item v-for="(item, index) in projeckList" :key="index" :index="item.name">
                            <el-icon :size="20">
                                <Notebook />
                            </el-icon>
                            <template #title>{{ item.name }}</template>
                        </el-menu-item>
                        <el-menu-item :index="'newProjeck'">
                            <el-icon :size="20">
                                <Plus />
                            </el-icon>
                            <template #title> {{ '新建项目' }} </template>
                        </el-menu-item>
                        <el-menu-item :index="'quit'">
                            <el-icon :size="20">
                                <svg t="1659779113684" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="2271" width="720" height="720">
                                    <path
                                        d="M874.666667 855.744a19.093333 19.093333 0 0 1-19.136 18.922667H168.469333A19.2 19.2 0 0 1 149.333333 855.530667V168.469333A19.2 19.2 0 0 1 168.469333 149.333333h687.061334c10.581333 0 19.136 8.533333 19.136 18.922667V320h42.666666V168.256A61.717333 61.717333 0 0 0 855.530667 106.666667H168.469333A61.866667 61.866667 0 0 0 106.666667 168.469333v687.061334A61.866667 61.866667 0 0 0 168.469333 917.333333h687.061334A61.76 61.76 0 0 0 917.333333 855.744V704h-42.666666v151.744zM851.84 533.333333l-131.797333 131.754667a21.141333 21.141333 0 0 0 0.213333 29.973333 21.141333 21.141333 0 0 0 29.973333 0.192l165.589334-165.589333a20.821333 20.821333 0 0 0 6.122666-14.976 21.44 21.44 0 0 0-6.314666-14.997333l-168.533334-168.533334a21.141333 21.141333 0 0 0-29.952-0.213333 21.141333 21.141333 0 0 0 0.213334 29.973333L847.296 490.666667H469.333333v42.666666h382.506667z"
                                        fill="#3D3D3D" p-id="2272" />
                                </svg>
                            </el-icon>
                            <template #title>{{ '退出登录' }}</template>
                        </el-menu-item>

                        <div class="btn-control" style="float: inline-end; position: relative;">
                            <!-- <el-button :index="`newProjeck`" text @click="newProjeck"
                                style="flex: 1; padding-top: 20px; padding-bottom: 20px; margin-left: 0;">
                                <el-icon :size="20">
                                    <Plus />
                                </el-icon>
                            </el-button> -->
                            <el-button @click="isCollapse = !isCollapse" text
                                style="padding-top: 20px; padding-bottom: 20px; margin-left: 0;">
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
                        <TaskBoard :projeckId="projeckId" :projectChange="projectChange" />
                    </DndProvider>
                </el-main>
            </el-container>
        </el-container>
        <!-- 个人信息 -->
        <el-dialog v-model="dialogUser" title="个人信息" width="30%">
            <div>
                <div class="avatar-uploader dialog-item">
                    头像:
                    <el-upload action="" accept=".jpg, .png" :show-file-list="false" :on-change="getFile"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :auto-upload="false">
                        <el-avatar shape="square" class="user-avatar" :size="64" :fit="'fill'"
                            v-if="userInfo.user_pic !== ''" :src="imageUrl" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </div>
                <div class="dialog-item">
                    用户名:
                    <el-input v-model="userInfo.nickname" placeholder="Please input" />
                </div>
                <div class="dialog-item">
                    邮箱:
                    <el-input v-model="userInfo.email" placeholder="Please input" />
                </div>
                <div class="dialog-item">
                    旧密码:
                    <el-input type="password" show-password v-model="userInfo_oldPasswd" placeholder="Please input" />
                </div>
                <div class="dialog-item">
                    新密码:
                    <el-input type="password" show-password v-model="userInfo_passwd" placeholder="Please input" />
                </div>
                <div class="dialog-item">
                    确认新密码:
                    <el-input type="password" show-password v-model="userInfo_confirmPasswd"
                        placeholder="Please input" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogUser = false">取消</el-button>
                    <el-button type="primary" @click="dialogUser = false; saveUserInfo()">保存</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 新建项目 -->
        <el-dialog v-model="dialogNewProjeck" title="新建项目" width="30%">
            <div>
                <div class="dialog-item">
                    项目名:
                    <el-input v-model="newProjeck.name" placeholder="请输入项目名" />
                </div>
                <div class="dialog-item">
                    项目说明:
                    <el-input type="textarea" :resize="'none'" :rows="10" v-model="newProjeck.details"
                        placeholder="请输入事项内容" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogNewProjeck = false">取消</el-button>
                    <el-button type="primary" @click="dialogNewProjeck = false; createProject()">创建</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadFile, UploadFiles } from 'element-plus'
import EasyWorkAPI from "@/utils/EasyWorkAPI";
import type { UserInfo, ProjectInfo } from '@/utils/Model';
import { useRouter } from 'vue-router'
const router = useRouter()

// 图片链接 更改用户头像时使用
const imageUrl = ref('')

// 项目ID 传递给事项看板
const projeckId = ref()

// 是否选择项目 未选中展示空页
const isCollapse = ref(false)

// 是否显示更改用户信息弹窗
const dialogUser = ref(false)

// 是否显示新建项目弹窗
const dialogNewProjeck = ref(false)

// 头像发生改动
let newAvatar = false;

// 用户信息初始化
const userInfo = ref<UserInfo>({
    id: 0,
    username: '',
    user_pic: '',
    nickname: '',
    email: ''
})

// 用户更改密码相关信息
const userInfo_passwd = ref(''), userInfo_confirmPasswd = ref(''), userInfo_oldPasswd = ref('')

// 项目列表
const projeckList = ref<ProjectInfo[]>([])

// 新建项目
const newProjeck = ref<ProjectInfo>({
    id: 0,
    name: '',
    details: '',
    deleted: 0,
    master: '',
    create_time: '',

})

// 项目发生变动
const projectChange = (projectId: string, type: number) => {
    console.log(projectId, type)
    switch (type) {
        case 1:
            // 删除
            projeckId.value = '';
            projeckList.value.forEach((item, index) => {
                if (item.name === projectId) {
                    projeckList.value.splice(index, 1)
                }
            })
            break;
        case 2:
            // 名称变动
            EasyWorkAPI.project.getList().then(res => {
                if (typeof res === 'object') {
                    projeckList.value = res
                }
            }).catch(err => {
                ElMessage.error(err)
            })
            break;
        default:
            break;
    }
}

// 获取用户信息用于展示
EasyWorkAPI.user.getUserInfo().then(res => {
    if (typeof res === 'object') {
        userInfo.value = res
    }
})

// 获取项目列表
EasyWorkAPI.project.getList().then(res => {
    if (typeof res === 'object') {
        projeckList.value = res
    }
}).catch(err => {
    ElMessage.error(err)
})

// 新建项目
const createProject = () => {
    EasyWorkAPI.project.create(newProjeck.value.name, newProjeck.value.details).then(res => {
        ElMessage.success(res);
        newProjeck.value.name = '';
        newProjeck.value.details = '';
        return EasyWorkAPI.project.getList();
    }).then(res => {
        if (typeof res === 'object') {
            projeckList.value = res
        }
    }).catch(err => {
        ElMessage.error(err)
    })
}

// 保存用户信息处理函数
const saveUserInfo = () => {
    let tl = [];
    // 检测是否更改密码
    if (userInfo_oldPasswd.value !== '' && userInfo_passwd.value !== '' && userInfo_confirmPasswd.value !== '') {
        if (userInfo_passwd.value !== userInfo_confirmPasswd.value) {
            ElMessage.error('两次密码不一致')
            return;
        } else {
            tl.push(EasyWorkAPI.user.updatePassword(
                userInfo_oldPasswd.value,
                userInfo_passwd.value,
                userInfo_confirmPasswd.value)
            );
        }
    }

    // 检测是否更改头像
    console.log(newAvatar)
    if (newAvatar) {
        tl.push(EasyWorkAPI.user.updateAvatar(imageUrl.value))
    }

    // 检测是否更改用户名和邮箱
    tl.push(EasyWorkAPI.user.updateNickNameAndEmail(userInfo.value.nickname, userInfo.value.email))
    console.log(tl)

    // 等待所有请求完成
    Promise.all(tl).then(res => {
        ElMessage.success('修改成功')
        newAvatar = false;
        EasyWorkAPI.user.getUserInfo().then(res => {
            if (typeof res === 'object') {
                userInfo.value = res
            }
        })
    }).catch(err => {
        ElMessage.error(err)
    })
}

// 处理选择项目，对事项看板传递项目ID进行切换
const handleSelect = (index: string) => {
    if (index === 'newProjeck') {
        console.log('新建')
        projeckId.value = ''
        dialogNewProjeck.value = true
    } else if (index === 'quit') {
        // 提示是否退出
        ElMessageBox.confirm(
            '确认退出？',
            '提示',
            {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }
        )
            .then(() => {
                localStorage.removeItem('token');
                router.push('/login')
            })
    } else {
        projeckId.value = index
        console.log(`选择了 ${projeckId.value}`)
    }
}

// 左栏伸缩处理
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
// 左栏伸缩处理
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

// 头像上传成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    console.log(response)
    console.log(uploadFile)
}

// 头像上传前处理
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

// 获取选中文件
const getFile = function (uploadFile: UploadFile, uploadFiles: UploadFiles) {
    getBase64(uploadFile.raw!).then(res => {
        console.log(res)
        if (userInfo.value) {
            imageUrl.value = res
            // userInfo.value.user_pic = res
            newAvatar = true;
        }
    });
}

// 获取base64
const getBase64 = function (file: any): Promise<string> {
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
/* .user .user-avatar {} */

.user {
    display: flex;
    overflow: hidden;
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

.dialog-card .dialog-item {
    margin-bottom: 10px;
}
/* 
.user .user-info {
    left: 42px;
    top: 44px;
    float: right;
    width: 100px;
    height: 100px;
    visibility: hidden;
    background-color: #000;
    position: fixed;
    border-radius: 4px;
    border: 1px solid #ccc; 
} */

.user .user-avatar:hover~.user-info {
    visibility: visible;
}

.user .user-avatar:hover {
    cursor: pointer;
}

.avatar-uploader {
    display: flex;
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
