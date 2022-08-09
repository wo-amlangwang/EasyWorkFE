<template>
    <div class="tags">
        <span class="tags-item" v-for="(item, key) in tags" :key="key">
            {{ item.name }}
            <el-icon class="tags-item-del" @click="delTag(item)" v-show="item.canDel">
                <Close />
            </el-icon>
        </span>
        <el-icon class="tags-item-add" @click="addTag()" v-show="showAddBtn">
            <Plus />
        </el-icon>
    </div>
</template>
<script setup lang="ts">
import { Plus, Close } from '@element-plus/icons-vue'
import type { tag } from './tags-type'

const props = defineProps<{
    tags: tag[], // 标签列表
    showAddBtn: boolean, // 是否显示添加按钮
    addTag: () => void // 添加标签回调函数
    delTag: (item: tag) => void // 删除标签回调函数
}>()

const addTag = props.addTag
const delTag = props.delTag
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

.tags .tags-item {
    line-height: 1.5em;
    margin: 3px;
    padding-left: 6px;
    padding-right: 7px;
    margin-right: 3px;
    background-color: #DDEBFF;
    border-radius: 4px;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tags .tags-item-del:hover {
    color: red;
    transition: color .3s;
}

.tags .tags-item-del {
    cursor: pointer;
    margin-left: 5px;
    color: #000;
    transition: color .3s;
}

.tags .tags-item-add {
    cursor: pointer;
}
</style>