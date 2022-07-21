import axios from "axios";

const EasyWorkAPI = {
    /**
     * 用户注册
     * 
     * @param name 用户名/昵称
     * @param email 邮箱
     * @param password 密码
     * @returns 成功返回字符串，失败返回错误原因
     */
    signup: function(name: string, email: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/api/reguser', {
                method: 'POST',
                data: {
                    username: name,
                    email: email,
                    password: password
                }
            }).then(res => {
                if (res.data.success) {
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
     * 用户登录
     * 
     * @param username 用户名
     * @param password 密码
     * @param veify 验证码
     * @returns 登录结果
     */
    login: function(username: string, password: string, veify: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/api/login', {
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                    veify: veify
                }
            }).then(res => {
                if (res.data.success) {
                    resolve(res.data.token);
                } else {
                    reject(res.data.message);
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
    updateUser: function(nickname: string, email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/my/userinfo', {
                method: 'POST',
                data: {
                    nickname: nickname,
                    email: email
                }
            }).then(res => {
                if (res.data.success) {
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
     * 获取用户信息
     * 
     * @returns 用户信息
     */
    getUser: function(): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/my/userinfo', {
                method: 'GET'
            }).then(res => {
                if (res.data.success) {
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
     * 修改密码
     * 
     * @param oldpwd 旧密码
     * @param newpwd 新密码
     * @param repwd 重复新密码
     * @returns 修改结果
     */
    updatePwd: function(oldpwd: string, newpwd: string, repwd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/my/updatepwd', {
                method: 'POST',
                data: {
                    oldPwd: oldpwd,
                    newPwd: newpwd,
                    rePwd: repwd
                }
            }).then(res => {
                if (res.data.success) {
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
     * 修改头像
     * 
     * @param avatar 头像 图片base64
     * @returns 修改结果
     */
    updateAvatar: function(avatar: string): Promise<string> {
        return new Promise((resolve, reject) => {
            axios('/my/update/avatar', {
                method: 'POST',
                data: {
                    avatar: avatar
                }
            }).then(res => {
                if (res.data.success) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}

export default EasyWorkAPI;