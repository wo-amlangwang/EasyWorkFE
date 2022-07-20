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
      component: () => import("../views/Workbench.vue"),
    }
  ],
});

export default router;
