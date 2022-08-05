import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 主页面 会直接跳转至login页面
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      children: [
        {
          // 登录页面
          path: "login",
          name: "login",
          component: () => import("../views/Login.vue"),
        },
        {
          // 注册页面
          path: "signup",
          name: "signup",
          component: () => import("../views/Signup.vue"),
        }
      ],
    },
    {
      // 工作台页面
      path: "/workbench",
      name: "workbench",
      component: () => import("../views/Workbench/Home.vue"),
    },
    {
      // 重置密码相关页面
      path: "/password_reset",
      name: "password_reset",
      component: () => import("../views/PasswordReset/Home.vue"),
      children: [
        {
          // 邮箱验证页面
          path: "email",
          name: "password_reset_email",
          component: () => import("../views/PasswordReset/Email.vue"),
        },
        {
          // 设置新密码页面
          path: "set_password",
          name: "password_reset_set_password",
          component: () => import("../views/PasswordReset/SetPassword.vue"),
        }
      ]
    }
  ],
});

export default router;
