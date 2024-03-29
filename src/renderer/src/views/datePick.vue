<template>
  <div style="padding: 30px">
    <div class="datePickView">
      <div class="pickHeader-firts">
        <div>日期</div>
        <el-switch v-model="useDate" size="large" @change="openDate" />
      </div>
      <div :class="['datePick', useDate ? '' : 'disabledDate']">
        <el-config-provider :locale="locale">
          <el-calendar v-model="selectDate" style="padding: 0px; margin: 0px" />
        </el-config-provider>
      </div>
      <div class="pickHeader">
        <div>时间</div>
        <el-switch v-model="useTime" size="large" @change="openTime" />
      </div>
      <div class="timePick">
        <el-time-picker
          v-model="SelectTime"
          :disabled="!useTime"
          size="large"
          format="HH:mm"
          placeholder="输入时间"
        />
      </div>
      <div class="pickHeader">
        <div>重复</div>
        <el-select
          v-model="Repeatvalue"
          class="m-2"
          placeholder="Select"
          size="large"
          :disabled="!useDate"
        >
          <el-option
            v-for="item in RepeatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="confirmContainer">
        <div class="clear-button">
          <el-button @click="clearOption">清除</el-button>
        </div>
        <el-button type="primary" @click="confirmOption">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import moment from 'moment'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = zhCn
const useDate = ref<boolean>(false)
const useTime = ref<boolean>(false)
const selectDate = ref(new Date())
const SelectTime = ref(new Date())
const Repeatvalue = ref('Never')
const openTime = function (): void {
  if (useTime.value == true) {
    useDate.value = true
  }
}
const openDate = function (): void  {
  if (useDate.value == false) {
    useTime.value = false
  }
}
const clearOption = function (): void  {
  resetView()
  localStorage.setItem('dateTimePick', '')
  window.api.closePickDate()
}
const resetView = (): void  => {
  useDate.value = false
  useTime.value = false
  selectDate.value = new Date()
  SelectTime.value = new Date()
  Repeatvalue.value = 'Never'
}
const confirmOption = function (): void {
  let DateString = ''
  let TimeString = ''
  if (useDate.value) {
    DateString = moment(selectDate.value).format('YYYY-MM-DD')
  }
  if (useTime.value) {
    TimeString = moment(SelectTime.value).format('HH:mm')
  }
  // let result=DateString+" "+TimeString
  const result = JSON.stringify({
    dateTime: DateString + ' ' + TimeString,
    repeat: Repeatvalue.value
  })
  resetView()
  localStorage.setItem('dateTimePick', result)
  window.api.closePickDate()
}
const RepeatOptions = [
  {
    value: 'Never',
    label: '永不'
  },
  {
    value: 'Day',
    label: '每天'
  },
  {
    value: 'Week',
    label: '每周'
  },
  {
    value: 'Month',
    label: '每月'
  }
]
</script>
<style scoped lang="scss">
.pickHeader {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
}

.pickHeader-firts {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
}

.timePick {
  display: flex;
  justify-content: center;
}

.datePick :deep(.el-calendar-table .el-calendar-day) {
  width: 60px;
  height: 40px;
  text-align: center;
}

.disabledDate :deep(.el-calendar) {
  color: rgb(132, 132, 132) !important;
}

.datePick :deep(.el-calendar__body) {
  padding: 10px 0px;
}

.datePick :deep(.el-calendar__header) {
  padding: 10px 0px;
}

.datePick :deep(.is-selected) {
  //color: #409eff;
  color: #67c23a;
}

.timePick :deep(.el-input) {
  width: 100%;
}

.m-2 {
  width: 100px;
}

.confirmContainer {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;

  :deep(.el-button) {
    width: 200px;
    height: 50px;
    font-size: 25px;
    border-radius: 10px;
  }

  .clear-button :deep(.el-button) {
    border: 2px solid #909399;
  }
}
</style>
