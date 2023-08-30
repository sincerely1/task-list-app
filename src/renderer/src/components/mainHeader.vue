// eslint-disable-next-line prettier/prettier
<template>
  <div class="header">
    <el-dropdown trigger="click" @command="handleDateRange" @visible-change="changeArrow">
      <button class="el-dropdown-link">
        {{ todoStore.filter }}
        <el-icon v-show="!arrowup" :color="arrowColor" @mouseover="arrowHover" @mouseleave="arrowOut">
          <arrow-down />
        </el-icon>
        <el-icon v-show="arrowup">
          <arrow-up />
        </el-icon>
      </button>
      <template #dropdown>
        <div class="dateRange">
          <el-dropdown-menu>
            <el-dropdown-item command="所有" class="dropdown-item">所有</el-dropdown-item>
            <el-dropdown-item command="今天" class="dropdown-item">今天</el-dropdown-item>
            <el-dropdown-item command="明天" class="dropdown-item">明天</el-dropdown-item>
            <el-dropdown-item command="最近七天" class="dropdown-item">最近七天</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </template>
    </el-dropdown>

    <el-dropdown trigger="click">
      <button class="el-dropdown-link">
        <el-icon size="40px" color="grey">
          <Setting />
        </el-icon>
      </button>
      <template #dropdown>
        <div class="setting">
          <el-dropdown-menu>
            <el-dropdown-item class="dropdown-item" @click="openSetting">设置</el-dropdown-item>
            <el-dropdown-item class="dropdown-item" @click="hideWindow">隐藏窗口</el-dropdown-item>
            <el-dropdown-item class="dropdown-item" @click="quitApp">退出</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
import { ArrowDown, ArrowUp, Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { todos } from "@renderer/stores/config";
const todoStore = todos()
const arrowColor = ref<string>('black')
const arrowup = ref<boolean>(false)

const openSetting = () => {
  let data = JSON.stringify({
    opacity: todoStore.opacity, hideHaddo: todoStore.hideHaddo,
    hideWhenEdge: todoStore.hideWhenEdge
  })
  localStorage.setItem('settingPage',data)
  window.api.openSetting()

}
const hideWindow=function(){
  window.api.hideMainWindow()
}
const handleDateRange = (command: string) => {
  todoStore.setDateRange(command)

}
const changeArrow = () => {
  arrowup.value = !arrowup.value
}
const arrowHover = () => {
  arrowColor.value = '#7FB8FE'
}
const arrowOut = () => {
  arrowColor.value = 'black'
}
const quitApp=function(){
  window.api.quit()
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.dateRange :deep(.el-dropdown-menu) {
  width: 150px;
  box-shadow: none;
}

.dateRange :deep(.el-dropdown-menu__item) {
  font-size: 15px;
  color: black;
}

.dateRange :deep(.el-dropdown-menu__item):focus {
  color: rgb(127, 184, 254);
  background-color: rgb(232, 232, 232);
}

.setting :deep(.el-dropdown-menu__item) {
  font-size: 15px;
  color: black;
}

.setting :deep(.el-dropdown-menu__item):focus {
  color: rgb(127, 184, 254);
  background-color: rgb(232, 232, 232);
}

.setting :deep(.el-dropdown-menu) {
  width: 100px;
  box-shadow: none;
}


.el-dropdown-link {
  background-color: transparent;
  border: none;
  font-size: 35px;
  font-weight: 600;
}
</style>
