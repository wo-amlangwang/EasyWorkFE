import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("../views/Login.vue"),
        },
        {
          path: "signup",
          name: "signup",
          component: () => import("../views/Signup.vue"),
        }
      ],
    },
    {
      path: "/workbench",
      name: "workbench",
      component: () => import("../views/Workbench/Home.vue"),
    },
    {
      path: "/password_reset",
      name: "password_reset",
      component: () => import("../views/PasswordReset/Home.vue"),
      children: [
        {
          path: "email",
          name: "password_reset_email",
          component: () => import("../views/PasswordReset/Email.vue"),
        },
        {
          path: "set_password",
          name: "password_reset_set_password",
          component: () => import("../views/PasswordReset/SetPassword.vue"),
        }
      ]
    }
  ],
});

export default router;
