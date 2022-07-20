import axios from "axios";

let EasyWorkAPI = {
    signup: function(name: string, email: string, password: string): Promise<string> {
        // 休眠1秒，模拟网络延迟
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(JSON.stringify({
                        code: "500",
                        message: "网络错误"
                    }));
                //resolve("signup success");
            }, 2000);
        });
        // return new Promise((resolve, reject) => {
        //     axios('/v1/api/signup', {
        //         method: 'POST',
        //         data: {
        //             name: name,
        //             email: email,
        //             password: password
        //         }
        //     }).then(res => {
        //         if (res.data.success) {
        //             resolve(res.data.data);
        //         } else {
        //             reject(res.data.message);
        //         }
        //     }).catch(err => {
        //         reject(err);
        //     });
        // });
    },
    login: function(username: string, password: string, veify: string): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(JSON.stringify({
                        code: 0,
                        success: true,
                        message: "网络错误"
                    }));
            }, 2000);
        });
        // return new Promise((resolve, reject) => {
        //     axios('/v1/api/login', {
        //         method: 'POST',
        //         data: {
        //             username: username,
        //             password: password,
        //             veify: veify
        //         }
        //     }).then(res => {
        //         if (res.data.success) {
        //             resolve(res.data.token);
        //         } else {
        //             reject(res.data.message);
        //         }
        //     }).catch(err => {
        //         reject(err);
        //     });
        // });
    }
}

export default EasyWorkAPI;