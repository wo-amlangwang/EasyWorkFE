<template>
<div style="display: flex;">
    <div class="box" id="box1" @drop="drop($event)" @dragover="allowDrop($event)">
        <div id="test1" draggable="true" @dragstart="drag($event)" style="cursor: move; display: flex; flex-direction: column; border: 1px solid blue; margin: 3px;">
            <el-space draggable="false">
                <a>测试</a>
                <a src="#">责任人：Sonui</a>
            </el-space>
            <el-space>
                <a>💡</a>
                <a>#11</a>
            </el-space>
        </div>
        <div id="test2" draggable="true" @dragstart="drag($event)" style="cursor: move; display: flex; flex-direction: column; border: 1px solid blue; margin: 3px;">
            <el-space draggable="false">
                <a>测试</a>
                <a src="#">责任人：Sonui</a>
            </el-space>
            <el-space>
                <a>💡</a>
                <a>#12</a>
            </el-space>
        </div>
    </div>
    <div class="box" id="box2" @drop="drop($event)" @dragover="allowDrop($event)">
    </div>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')

function allowDrop(ev:any) {
    if (ev.target.classList.contains('box')) {
        ev.preventDefault();
    }
}

function drag(ev:any) {
    console.log(ev);
    ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev:any) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");
    console.log(data);
    console.log(ev);
    ev.target.appendChild(document.getElementById(data));
}
</script>
<style>
.box {
    /* 红色边框 */
    border: 1px solid red;
    width: 300px;
    height: 300px;
    margin-right: 24px;
}
</style>