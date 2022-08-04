# 目录及文件说明

## assets

静态资源文件

## components

组件目录

### Box.vue

事项列表盒子组件

### Item.vue

事项组件

### Tags.vue

标签组件

## router

用于存放路由配置文件

### index.ts

访问路径关联文件配置

## utils

用于存放工具类文件

### EasyWorkAPI.ts

后端接口文件, 统一包装为Promise返回

### Model.ts

模型文件, 用于规范接口返回的数据实体模型

## views

视图目录

### Home.vue

首页文件, 作为登录注册页面容器

关联路由 `/` 及子路由 `/login` 及 `/signup`

访问后跳转直接至子路由 `/login`

访问后检查是否已经登录, 如果已经登录则跳转至工作台

### Login.vue

登录页面文件

关联子路由 `/login`

### Signup.vue

注册页面文件

关联子路由 `/signup`

### PasswordReset

存放忘记密码页面相关文件

#### Home.vue

重置密码相关页面容器

#### Email.vue

重置密码邮箱验证页面

#### SetPassword.vue

设置新密码页面

### Workbench

工作台相关文件

#### Home.vue

工作台页面容器

#### TaskBoard.vue

任务看板页面