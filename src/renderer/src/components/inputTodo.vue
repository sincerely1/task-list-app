<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="input">
    <el-input
      v-model="todo"
      size="large"
      placeholder="+添加任务，回车即可创建"
      @keyup.enter.native="addTodo"
    >
      <template #suffix>
        <el-icon class="settingCalender" size="35px" color="#79bbff" @click="pick_date">
          <Calendar />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>
<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { todos } from '@renderer/stores/config'
const todoStore = todos()
const todo = ref<string>('')
const useDateTime = ref<boolean>(false)
const addTodo = (): void => {
  const date = localStorage.getItem('dateTimePick')
  if (date && useDateTime.value) {
    const PickDate = JSON.parse(date)
    todoStore.addTodo(todo.value, PickDate.dateTime, PickDate.repeat)
    localStorage.setItem('dateTimePick', '')
  } else {
    console.log(999)
    todoStore.addTodo(todo.value, '', 'Never')
  }
  todo.value = ''
  useDateTime.value = false
}
const pick_date = function (): void {
  useDateTime.value = true
  window.api.openPickDate()
}
</script>
<style scoped lang="scss">
.input {
  :deep(.el-input__inner) {
    height: 50px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 5px;
    border: 3px;
    font-size: 20px;
    background-color: rgba($color: white, $alpha: 0.2);
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  }

  :deep(.el-input__wrapper):hover {
    box-shadow: 0 0 0 3px var(--el-input-focus-border-color) inset;
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 3px var(--el-input-focus-border-color) inset;
  }
}
</style>
