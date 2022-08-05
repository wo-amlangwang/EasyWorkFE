import axios from "axios";
import type { UserInfo, ProjectInfo, TaskInfo, TimeLine } from '@/utils/Model';
import { rest } from "lodash";

const prefix = "api";

const user = {
    /**
     * 用户注册
     * 
     * @param name 用户名/昵称
     * @param email 邮箱
     * @param password 密码
     * @returns 成功返回字符串，失败返回错误原因
     */
    signup: function (name: string, email: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/api/reguser', {
                method: 'POST',
                data: {
                    username: name,
                    password: password
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 用户登录
     * 
     * @param username 用户名
     * @param password 密码
     * @param veify 验证码
     * @returns 登录结果
     */
    login: function (username: string, password: string, veify: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/api/login', {
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                },
            }).then(res => {
                console.log(res);
                if (res.data.status == 0) {
                    let token = res.data.token.substring(7, res.data.token.length);
                    localStorage.setItem('token', token);
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 更新昵称或邮箱
     * 
     * @param nickname 昵称
     * @param email 邮箱
     * @returns 
     */
    updateNickNameAndEmail: function (nickname: string, email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/my/userinfo', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    nickname: nickname,
                    email: email
                }
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.message);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 获取用户信息
     * 
     * @returns 用户信息
     */
    getUserInfo: function (): Promise<UserInfo | string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/my/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status == 0) {
                    const ret: UserInfo = {
                        id: res.data.data.id,
                        username: res.data.data.username,
                        nickname: res.data.data.nickname,
                        email: res.data.data.email,
                        user_pic: res.data.data.user_pic
                    }
                    resolve(ret);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 修改密码
     * 
     * @param oldpwd 旧密码
     * @param newpwd 新密码
     * @param repwd 重复新密码
     * @returns 修改结果
     */
    updatePassword: function (oldpwd: string, newpwd: string, repwd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/my/updatepwd', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    oldPwd: oldpwd,
                    newPwd: newpwd,
                    rePwd: repwd
                }
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.message);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 修改头像
     * 
     * @param avatar 头像 图片base64
     * @returns 修改结果
     */
    updateAvatar: function (avatar: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/my/update/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    avatar: avatar
                }
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
};

const project = {
    /**
     * 创建项目
     * 
     * @param project_name 项目名称
     * @param project_details 项目说明
     */
    create: (project_name: string, project_details: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/create', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    project_name: project_name,
                    project_details: project_details
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 获取项目列表
     */
    getList: (): Promise<string | ProjectInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/projectlist', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status == 0) {
                    let ret: ProjectInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        ret.push({
                            id: item.id,
                            name: item.p_name,
                            details: '',
                            master: item.members,
                            create_time: '',
                            deleted: item.deleted,
                        })
                    });
                    resolve(ret);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 添加项目成员
     * 
     * @param projectname 项目名称
     * @param member 用户名
     */
    addMember: (projectname: string, member: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/addmember', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    projectname: projectname,
                    member: member
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * 删除项目
     * 
     * @param projectname 项目名称
     */
    delete: (projectname: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/deleteproject', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    project_name: projectname,
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 获取项目详情
     * 
     * @param projectname 项目名称
     */
    getInfo: (projectname: string): Promise<string | ProjectInfo> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/getproject', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status == 0) {
                    const ret: ProjectInfo = {
                        id: res.data.data.id,
                        name: res.data.data.p_name,
                        details: res.data.data.project_details,
                        master: res.data.data.create_user,
                        create_time: res.data.data.create_time,
                        deleted: res.data.data.deleted,
                    };
                    resolve(ret);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 更新项目说明
     * 
     * @param projectname 项目名称
     * @param project_details 项目说明
     */
    update: (projectname: string, project_details: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/updateproject', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {

                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 获取项目成员
     * 
     * @param projectname 项目名称
     */
    getMembers: (projectname: string): Promise<string | string[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/projectmemberlist', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status == 0) {
                    let members: string[] = new Array();
                    res.data.data.forEach((item: any) => {
                        members.push(item.members);
                    });
                    resolve(members);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 获取任务列表
     * 
     * @param projectname 项目名称
     */
    getTaskList: (projectname: string): Promise<string | TaskInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/projecttasklist', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    project_name: projectname,
                },
            }).then(res => {
                if (res.data.status == 0) {
                    let tasks: TaskInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        tasks.push({
                            id: item.id,
                            name: item.task_name,
                            project_name: item.project_name,
                            details: item.task_details,
                            type: item.type,
                            create_user: item.create_user,
                            create_time: item.create_time,
                            update_user: item.update_user,
                            update_time: item.update_time,
                            priority: item.priority,
                            deadline: item.deadline,
                            assignee: [item.members],
                            status: item.status,
                            task_comment: item.task_comment,
                            deleted: item.deleted,
                            time_line: new Array(),
                        });
                    });
                    resolve(tasks);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}

const task = {
    /**
     * 新建任务
     * 
     * @param info 任务信息
     */
    craete: (info: TaskInfo): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/create', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    task_name: info.name,
                    task_details: info.details,
                    project_name: info.project_name,
                    type: info.type,
                    priority: info.priority,
                    deadline: info.deadline,
                    assignee: info.assignee,
                    task_comment: info.task_comment
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 删除任务
     * 
     * @param id 任务id
     */
    delete: (id: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/deletetask', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    id: id,
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    
    /**
     * 获取特定类型的任务
     * 
     * @param projectname 项目名称
     * @param type 任务类型
     */
    getListByType: (projectname: string, type: number): Promise<string | TaskInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/tasktypelist/' + type, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    project_name: projectname,
                },
            }).then(res => {
                if (res.data.status == 0) {
                    let tasks: TaskInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        tasks.push({
                            id: item.id,
                            name: item.task_name,
                            project_name: item.project_name,
                            details: item.task_details,
                            type: item.type,
                            create_user: item.create_user,
                            create_time: item.create_time,
                            update_user: item.update_user,
                            update_time: item.update_time,
                            priority: item.priority,
                            deadline: item.deadline,
                            assignee: [item.members],
                            status: item.status,
                            task_comment: item.task_comment,
                            deleted: item.deleted,
                            time_line: new Array(),
                        });
                    });
                    resolve(tasks);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 修改任务状态
     * 
     * @param projectname 项目名称
     * @param id 任务ID
     * @param status 状态
     */
    updateStatus: (projectname: string, id: number, status: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/updatetaskstatus/' + status, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    project_name: projectname,
                    id: id,
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 获取任务详情
     * 
     * @param id 任务id
     */
    getInfo: (id: number): Promise<string | TaskInfo> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/gettask', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                data: {
                    id: id,
                },
            }).then(res => {
                if (res.data.status === 0) {
                    let item = res.data.data[0];
                    const ret: TaskInfo = {
                        id: item.id,
                        name: item.task_name,
                        project_name: item.project_name,
                        details: item.task_details,
                        type: item.type,
                        create_user: item.create_user,
                        create_time: item.create_time,
                        update_user: item.update_user,
                        update_time: item.update_time,
                        priority: item.priority,
                        deadline: item.deadline,
                        assignee: [item.assignee],
                        status: item.status,
                        task_comment: item.task_comment,
                        deleted: item.deleted,
                        time_line: new Array(),
                    }
                    resolve(ret);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}
const EasyWorkAPI = {
    user: user,
    project: project,
    task: task
}

export default EasyWorkAPI;