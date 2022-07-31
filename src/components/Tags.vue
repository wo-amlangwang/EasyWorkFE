<template>
    <div class="tags">
        <span class="item" v-for="(item, key) in tags" :key="key">
            {{ item.name }}
            <el-icon class="item-del" @click="delTag(key)">
                <Close />
            </el-icon>
        </span>
        <el-icon class="item-add" @click="addTag">
            <Plus />
        </el-icon>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Close } from '@element-plus/icons-vue'

interface tag {
    id: number
    name: string
}

const props = defineProps<{ tags: tag[], addTag: () => void }>()
const tags = props.tags
const addTag = props.addTag


const delTag = (item: number) => {
    tags.splice(item, 1)
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