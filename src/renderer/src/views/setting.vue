<template>
  <div style="padding: 40px 20px 0px 20px">
    <div class="settingView">
      <div class="header">
        <span>设置</span>
        <el-icon size="40px" @click="closeWindow">
          <Close />
        </el-icon>
      </div>

      <div class="main">
        <div class="main-item">
          <div>透明度</div>
          <div class="slider-block">
            <div class="slider-main">
              <el-slider
                v-model="transparentValue"
                :show-tooltip="false"
                @change="sendTransparendValue"
              />
            </div>
            <span class="demonstration">{{ transparentValue }}%</span>
          </div>
        </div>
        <div class="main-item">
          <div>隐藏已完成</div>
          <el-switch v-model="hideHaddo" size="large" @change="sendHideHaddoValue" />
        </div>
        <div class="main-item">
          <div>边缘隐藏</div>
          <el-switch v-model="hideEdge" size="large" @change="sendHideEdgeValue" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
const transparentValue = ref(100)
const hideHaddo = ref(false)
const hideEdge = ref(true)
const closeWindow = function (): void {
  window.api.closeSetting()
}
const sendTransparendValue = (): void => {
  window.api.sendOptical(transparentValue.value)
}
const sendHideEdgeValue = (): void => {
  window.api.sendEdge(hideEdge.value)
}
const sendHideHaddoValue = (): void => {
  window.api.sendHideHaddo(hideHaddo.value)
}
onMounted(() => {
  const Stringdata = localStorage.getItem('settingPage')
  if (Stringdata) {
    const data = JSON.parse(Stringdata)
    console.log(data)
    transparentValue.value = data.opacity * 100
    hideHaddo.value = data.hideHaddo
    hideEdge.value = data.hideEdge
  }
})
</script>
<style scoped lang="scss">
.header {
  display: flex;
  font-size: 30px;
  font-weight: 600;
  justify-content: space-between;
  margin-bottom: 20px;
}

.main {
  display: flex;
  flex-direction: column;

  .main-item {
    margin-bottom: 20px;
    font-size: 20px;
  }
}

.slider-block {
  display: flex;
  align-items: center;
  padding: 0px 10px;
}
.slider-block .slider-main {
  margin-top: 0;
  margin-right: 12px;
  width: 85%;
}
.slider-block .demonstration {
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
</style>
