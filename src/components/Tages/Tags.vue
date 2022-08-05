<template>
    <div class="tags">
        <span class="item" v-for="(item, key) in tags" :key="key">
            {{ item.name }}
            <el-icon class="item-del" @click="delTagHandler(key)">
                <Close />
            </el-icon>
        </span>
        <el-icon class="item-add" @click="addTag">
            <Plus />
        </el-icon>
    </div>
</template>
<script setup lang="ts">
import { Plus, Close } from '@element-plus/icons-vue'
import type { tag } from './tags-type'

const props = defineProps<{ 
    tags: tag[], // 标签列表
    addTag: () => void // 添加标签回调函数
    delTag: (item: tag) => void // 删除标签回调函数
}>()

const addTag = props.addTag

// 删除标签处理函数
const delTagHandler = (item: number) => {
    props.delTag(props.tags[item])
}
</script>
<style>
.tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    margin: 0;
}

.tags .item {
    line-height: 1.5em;
    padding-left: 6px;
    padding-right: 7px;
    margin-right: 3px;
    background-color: #DDEBFF;
    border-radius: 4px;
    display: flex;
    align-items: center;
}

.tags .item-del:hover {
    color: red;
    transition: color .3s;
}

.tags .item-del {
    cursor: pointer;
    margin-left: 5px;
    color: #000;
    transition: color .3s;
}

.tags .item-add {
    cursor: pointer;
}
</style>