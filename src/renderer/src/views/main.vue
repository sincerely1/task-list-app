<template>
  <div id="main-view"  :style="`background-color:rgba(255,255,255, ${todoStore.opacity})`">
    <div style="padding: 40px 20px 0px 20px;  ">
      <el-header height="120px" style="margin:0px;padding:0px">
        <mainHeader></mainHeader>
        <inputeTodo style="padding-top: 20px;"></inputeTodo>
      </el-header>
      <el-main style="padding:30px 0px 0px 0px;overflow:hidden;">
        <el-scrollbar :max-height="scrollbarHeight">
          <div v-if="undoList.length > 0" class="undo-List">
            <div class="undo-title">未完成</div>
            <div class='undo-items'>
              <div v-for="item in undoList" class="undo-item" @contextmenu="deleteUndo($event, item.id)">
                <i class="far fa-circle select-circle" @click="setTodoFinished(item.id)" />
                <div style="display:flex; flex: 1; justify-content: space-between;">
                  <div class="item-name">
                    <div>{{ item.text }}</div>
                  </div>
                  <div class="item-time">
                    {{ showDateTime(item.date) }}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-if="repeatUnodList.length > 0" class="undo-List">
            <div class="undo-title">定期</div>
            <div class='undo-items'>
              <div v-for="item in repeatUnodList" class="undo-item" @contextmenu="deleteUndo($event, item.id)">
                <i class="far fa-circle select-circle" @click="setTodoRepeatFinished(item.id)" />
                <div style="display:flex; flex: 1; justify-content: space-between;">
                  <div class="item-name">
                    <div>{{ item.text }}</div>
                  </div>
                  <div class="item-time">
                    {{ showRepeat(item.repeat) }}<span v-if="item.date !== ''">,</span>{{ showDateTime(item.date) }}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-if="noDateList.length > 0" class="undo-List">
            <div class="undo-title">无日期</div>
            <div class='undo-items'>
              <div v-for="item in noDateList" class="undo-item" @contextmenu="deleteUndo($event, item.id)">
                <i class="far fa-circle select-circle" @click="setTodoFinished(item.id)" />
                <div style="display:flex; flex: 1; justify-content: space-between;">
                  <div class="item-name">
                    <div>{{ item.text }}</div>
                  </div>
                  <div class="item-time">
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-if="haddoList.length > 0 && todoStore.hideHaddo != true" class="haddo-List">
            <div class="haddo-title">已完成</div>
            <div class='haddo-items'>
              <div v-for="item in haddoList" class="haddo-item" @contextmenu="deleteUndo($event, item.id)">
                <i class="fa-regular fa-circle-check select-circle" @click="setTodoUnFinished(item.id)" />
                <div style="display:flex; flex: 1; justify-content: space-between;">
                  <div class="item-name">
                    <div>{{ item.text }}</div>
                  </div>
                  <div class="item-time">
                    {{ showDateTime(item.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <context-menu v-model:show="show" :options="optionsComponent">
          <context-menu-item @click="onMenuClick(now_select)" style="">
            <div style="font-size: 15px;">
              <i class="fa-regular fa-trash-can"></i>删除
            </div>
          </context-menu-item>
        </context-menu>
      </el-main>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import mainHeader from '@renderer/components/mainHeader.vue'
import inputeTodo from '@renderer/components/inputTodo.vue'
import { todos } from "@renderer/stores/config";
import moment from 'moment';
const todoStore = todos()
const undoList = computed(() => todoStore.unfinishedTodosDate)
const noDateList = computed(() => todoStore.unfinishedTodosNoDate)
const haddoList = computed(() => todoStore.finishedTodos)
const repeatUnodList = computed(() => todoStore.repeatTodos)
const show = ref<boolean>(false)
const now_select = ref<number>(0)
const scrollbarHeight = ref<number>(380)
window.api.resetScrollbarHeight((_event: any, resizeData) => {
  const height = resizeData['height']
  if (height != 600) {
    scrollbarHeight.value = height - 220
  }
})
window.api.setOptical((_event: any, Optical: number) => {
  todoStore.opacity = Optical
})
window.api.setHideHaddo((_event: any, showOrHide: boolean) => {
  todoStore.hideHaddo = showOrHide
})
window.api.setHideEdge((_event: any, showOrHide: boolean) => {
  todoStore.hideWhenEdge = showOrHide
})
// onBeforeMount(() => {
//   for (let i = 0; i < 5; i += 1) {
//     todoStore.addTodo('测试事件', '2023-7-14 09:42', 'Never')
//   }
//   todoStore.addTodo('测试事件', '', 'Never')
//   todoStore.addTodo('测试事件', '2023-7-13', 'Day')
//   todoStore.addTodo('测试事件', '2023-7-18', 'Day')

// })
const optionsComponent = reactive({
  zIndex: 3,
  minWidth: 150,
  minHeight: 80,
  x: 500,
  y: 200,
})
const showRepeat = function (repeat) {
  const repeatMap = new Map<string, string>([
    ['Never', '从不'],
    ['Day', '每天'],
    ['Week', '每周'],
    ['Month', '每月'],])
  return repeatMap.get(repeat)
}
const setTodoFinished = function (id: number) {
  todoStore.setTodoFinished(id)
}
const setTodoRepeatFinished = function (id: number) {
  todoStore.setTodoRepeatFinished(id)
}
const setTodoUnFinished = function (id: number) {
  todoStore.setTodoUnFinished(id)
}
const deleteUndo = function (e: MouseEvent, id: number) {
  now_select.value = id
  show.value = true
  optionsComponent.x = e.x
  optionsComponent.y = e.y
}
const onMenuClick = function (id: number) {
  todoStore.delTodo(id)
}
const showDateTime = function (dateTime: string): string {
  if (dateTime.split(' ').length == 1) {
    return moment(dateTime, 'YYYY-MM-DD ').format('M/D')
  }
  else {
    return moment(dateTime, 'YYYY-MM-DD hh:mm').format('M/D HH:MM')
  }

}
</script>
<style scoped lang="scss">
@import '@renderer/assets/css/ContextMenu.scss';
#main-view {
  border-radius: 10px;
  width: 100vw;
  height: 100vh;
}

.undo-List {
  font-size: 16px;
  padding-right: 20px;

  .undo-items {
    margin-left: 20px;

    .undo-item {
      display: flex;
      cursor: default;
      justify-content: space-between;
      margin: 5px 0px;
      padding: 3px 0px;

      .select-circle {
        color: #73767a;
        font-size: 15px;
        padding-top: 4px;
        margin-right: 5px;

      }

      .item-name {
        display: flex;


      }

      .item-time {
        padding-right: 10px;
      }
    }

    .undo-item:hover {
      .select-circle {
        color: #409EFF;
      }
    }
  }
}

.haddo-List {
  font-size: 16px;
  padding-right: 20px;

  .haddo-items {
    margin-left: 20px;

    .haddo-item {
      display: flex;
      justify-content: space-between;
      margin: 5px 0px;
      padding: 3px 0px;

      .select-circle {
        color: #73767a;
        font-size: 15px;
        padding-top: 4px;
        margin-right: 5px;

      }

      .item-name {
        display: flex;


      }

      .item-time {
        padding-right: 10px;
      }
    }

    .haddo-item:hover {
      .select-circle {
        color: #409EFF;
      }
    }
  }

}</style>
