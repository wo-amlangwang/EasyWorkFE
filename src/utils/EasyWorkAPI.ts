import axios from "axios";
import type { UserInfo, ProjectInfo, TaskInfo, TimeLine } from '@/utils/Model';

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
                    password: password,
                    email: email
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
                    let token = res.data.token;
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
                    'Authorization': '' + localStorage.getItem('token')
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
                    'Authorization': '' + localStorage.getItem('token')
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
                    'Authorization': '' + localStorage.getItem('token')
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
                    'Authorization': '' + localStorage.getItem('token')
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
    },

    /**
     * 查找用户
     * 
     * @param keyword 关键词
     * @return 用户列表
     */
    search: function(keyword: string): Promise<UserInfo[]> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/my/getlikeuser', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    likename: keyword
                }
            }).then(res => {
                if (res.data.status === 0) {
                    let users: UserInfo[] = new Array(res.data.data.length);
                    res.data.data.forEach((user: any, index: number) => {
                        users[index] = {
                            id: user.id,
                            username: '',
                            nickname: user.username,
                            email: '',
                            user_pic: user.user_pic
                        }
                    }),
                    resolve(users);
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
     * @returns 成功返回id, 失败返回错误信息
     */
    create: (project_name: string, project_details: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/create', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    project_name: project_name,
                    project_details: project_details
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.id);
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
                    'Authorization': '' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status == 0) {
                    let ret: ProjectInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        ret.push({
                            id: item.id,
                            name: item.project_name,
                            details: item.project_details,
                            master: item.master,
                            create_time: item.create_time,
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
     * @param pid 项目ID
     * @param uid 用户ID
     */
    addMember: (pid: number, uid: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/addmember', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    mid: uid,
                    pid: pid
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
     * @param pid 项目名称
     */
    delete: (pid: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/deleteproject', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    id: pid,
                },
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
     * 获取项目详情
     * 
     * @param pid 项目ID
     */
    getInfo: (pid: number): Promise<ProjectInfo> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/getproject', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    id: pid,
                }
            }).then(res => {
                if (res.data.status == 0) {
                    const ret: ProjectInfo = {
                        id: res.data.data.id,
                        name: res.data.data.project_name,
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
     * @param pid 项目ID
     * @param project_name 项目名称
     * @param project_details 项目说明
     */
    update: (pid: number, project_name: string, project_details: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/updateproject', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    id: pid,
                    project_name: project_name,
                    project_details: project_details
                },
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
     * 获取项目成员
     * 
     * @param pid 项目ID
     */
    getMembers: (pid: number): Promise<UserInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/projectmemberlist', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    id: pid,
                }
            }).then(res => {
                if (res.data.status == 0) {
                    let ret: UserInfo[] = new Array();
                    ret = res.data.data.map((item: any) => {
                        return {
                            id: item.id,
                            username: '',
                            nickname: item.name,
                            email: '',
                            user_pic: '',
                        }
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
     * 获取任务列表
     * 
     * @param pid 项目ID
     */
    getTaskList: (pid: number): Promise<TaskInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/project/projecttasklist', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    id: pid,
                },
            }).then(res => {
                if (res.data.status == 0) {
                    let tasks: TaskInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        tasks.push({
                            id: item.id,
                            name: item.task_name,
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
     * @param pid 项目ID
     * @param info 任务信息
     */
    craete: (pid: number, info: TaskInfo): Promise<string> => {
        const tn = new Date(info.deadline)
        const t = tn.getFullYear().toString().padStart(2, '0') + '-' +
            (tn.getMonth() + 1).toString().padStart(2, '0') + '-' +
            tn.getDate().toString().padStart(2, '0') + ' ' +
            tn.getHours().toString().padStart(2, '0') + ':' +
            tn.getMinutes().toString().padStart(2, '0') + ':' +
            tn.getSeconds().toString().padStart(2, '0');

        return new Promise((resolve, reject) => {
            axios(prefix + '/task/create', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    task_name: info.name,
                    task_details: info.details,
                    p_id: pid,
                    type: info.type,
                    priority: info.priority,
                    deadline: t,
                    assignee: info.assignee[0]
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.id);
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
                    'Authorization': '' + localStorage.getItem('token')
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
     * @param pid 项目ID
     * @param type 任务类型
     */
    getListByType: (pid: number, type: number): Promise<string | TaskInfo[]> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/tasktypelist/' + type, {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    p_id: pid,
                },
            }).then(res => {
                if (res.data.status == 0) {
                    let tasks: TaskInfo[] = new Array();
                    res.data.data.forEach((item: any) => {
                        tasks.push({
                            id: item.id,
                            name: item.task_name,
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
     * @param pid 项目ID
     * @param id 任务ID
     * @param status 状态
     */
    updateStatus: (pid: number, id: number, status: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/updatetaskstatus/' + status, {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    p_id: pid,
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
    getInfo: (id: number): Promise<TaskInfo> => {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/gettask', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
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
    },

    /**
     * 发表评论
     * 
     * @param tid 任务id
     * @param content 评论内容
     */
    comment: function(tid: number, content: string): Promise<number> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/comment', {
                method: 'POST',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                },
                data: {
                    tid: tid,
                    content: content,
                },
            }).then(res => {
                if (res.data.status === 0) {
                    resolve(res.data.id);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    /**
     * 获取任务时间线
     * 
     * @param tid 任务id
     */
    getTimeLine: function(tid: number): Promise<TimeLine[]> {
        return new Promise((resolve, reject) => {
            axios(prefix + '/task/timeline/' + tid, {
                method: 'GET',
                headers: {
                    'Authorization': '' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.data.status === 0) {
                    let ret: TimeLine[] = new Array();
                    const data = res.data.data;
                    // id: number // 时间线ID
                    // type: number // 事件类型
                    // user: string // 事件发生者
                    // time: string // 事件发生时间
                    // details: string // 事件详情
                    ret = data.map((item: any) => {
                        return {
                            id: item.time_line_id,
                            type: item.type,
                            user: item.nickname,
                            time: item.create_time,
                            details: item.content
                        }
                    });
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
