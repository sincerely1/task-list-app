/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  hideMainWindow: () => {//隐藏窗口
    ipcRenderer.send('hideMainWindow')
  },
  quit: () => ipcRenderer.send('quit'),
  openPickDate: () => {
    return ipcRenderer.invoke('showDatePick')//打开选择日期窗口
  },
  closePickDate: () => {
    return ipcRenderer.invoke('closeDatePick')//关闭打开日期窗口
  },
  openSetting: (data: any) => {
    return ipcRenderer.invoke('showSetting', data)//打开设置窗口
  },
  closeSetting: () => {
    return ipcRenderer.invoke('closeSetting')//关闭设置窗口
  },
  resetScrollbarHeight: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {//动态设置scaroll高度
    ipcRenderer.on('resizeEvent', callback)
  },
  sendOptical: (date: number) => {
    return ipcRenderer.send('setOptical', date)//设置到主进程通信
  },
  setOptical: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {//主进程到man窗口通信
    ipcRenderer.on('saveOpacity', callback)
  },
  sendEdge: (date: number) => {
    return ipcRenderer.send('setEdge', date) //发送请求给主进程要求修改设置
  },
  setHideEdge: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('saveEdge', callback)// 主进程通知manwindow修改设置
  },
  sendHideHaddo: (date: number) => {
    return ipcRenderer.send('setHideHaddo', date)
  },
  setHideHaddo: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('saveHideHaddo', callback)
  },
}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
