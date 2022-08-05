<template>
<router-view/>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
// 跳转至邮箱验证页面
router.push({ name: 'password_reset_email' })
</script>
<style>
</style>