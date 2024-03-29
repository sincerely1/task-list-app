/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createTray } from './tray'
const BrowserWindowsMap = new Map<number, BrowserWindow>()
let mainWindowId: number
let settingWindowId: number
let datePickWindowId: number
let tray
function createWindow(): void {
  // 创建主窗口
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    minWidth: 500,
    minHeight: 600,
    show: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  // 禁用右键菜单
  mainWindow.hookWindowMessage(278, function (_e) {
    mainWindow.setEnabled(false) //窗口禁用
    setTimeout(() => {
      mainWindow.setEnabled(true)
    }, 100) //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
    return true
  })
  //mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('resized', (_e) => {
    //主窗口变成大小是变化显示的 Scrollbar大小
    const sizeData = mainWindow.getContentBounds()
    mainWindow.webContents.send('resizeEvent', sizeData)
  })
  mainWindow.on('close', () => {
    //关闭是消除数据
    BrowserWindowsMap.delete(mainWindowId)
    mainWindowId = 0
  })

  if (!mainWindowId) {
    //记录窗口
    mainWindowId = mainWindow.id
    BrowserWindowsMap.set(mainWindowId, mainWindow)
  }
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (process.platform == 'darwin') app.dock.hide() //隐藏图标
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow() //创建主窗口
  tray = createTray() //主窗口隐藏显示
  tray.on('click', () => {
    const mainWindow = BrowserWindowsMap.get(mainWindowId)
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.restore()
        mainWindow.show()
      } else {
        mainWindow.hide()
        mainWindow.minimize()
      }
    }
    // 窗口是否隐藏
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  ipcMain.on('quit', () => {
    app.quit()
  })
  ipcMain.handle('closeDatePick', function (event) {
    //关闭DatePick窗口
    const webContents = event.sender
    //获取窗口
    const nowWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    BrowserWindowsMap.delete(nowWindow.id)
    datePickWindowId = 0
    nowWindow.close()
    return true
  })

  ipcMain.handle('showDatePick', function (event) {
    if (datePickWindowId) {
      //显示隐藏
      const datePickWindow = BrowserWindowsMap.get(datePickWindowId)
      datePickWindow?.show()
      return true
    }
    const webContents = event.sender
    //获取窗口
    const mainWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    const positon = mainWindow?.getPosition()
    const x: number = positon[0] - 500 > 0 ? positon[0] - 500 : 100
    const y: number = positon[1] - 750 > 0 ? positon[1] - 750 : 100
    const win_config = {
      x: x,
      y: y,
      width: 500,
      height: 700,
      parent: mainWindow,
      resizable: false,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: false
      }
    }
    const datePickWindow = new BrowserWindow(win_config)

    // 禁用右键菜单
    datePickWindow.hookWindowMessage(278, function (_e) {
      mainWindow.setEnabled(false) //窗口禁用
      setTimeout(() => {
        mainWindow.setEnabled(true)
      }, 100) //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
      return true
    })
    datePickWindow.on('close', () => {
      //关闭时消除数据
      BrowserWindowsMap.delete(datePickWindowId)
      datePickWindowId = 0
    })
    datePickWindow.on('blur', () => {
      datePickWindow.hide()
    })
    if (!datePickWindowId) {
      //记录窗口
      datePickWindowId = datePickWindow.id
      BrowserWindowsMap.set(datePickWindowId, datePickWindow)
    }
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      console.log(process.env['ELECTRON_RENDERER_URL'])
      datePickWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/datePick')
    } else {
      datePickWindow.loadFile(join(__dirname, '../renderer/index.html'),{
        hash: "/datePick"
      })
    }
    datePickWindow.show()
    return true
  })
  ipcMain.handle('closeSetting', function (event) {
    const webContents = event.sender
    //获取窗口
    const mainWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    BrowserWindowsMap.delete(settingWindowId)
    settingWindowId = 0
    mainWindow.close()
    return true
  })
  ipcMain.handle('showSetting', function (event) {
    if (settingWindowId) {
      //显示隐藏
      const settingWindow = BrowserWindowsMap.get(settingWindowId)
      settingWindow?.focus()
      return true
    }
    const webContents = event.sender //获取窗口
    const mainWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    const positon = mainWindow?.getPosition()
    const win_config = {
      x: positon[0],
      y: positon[1],
      width: 500,
      height: 400,
      parent: mainWindow,
      resizable: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: false
      }
    }
    const settingWindow = new BrowserWindow(win_config)
    settingWindow.hookWindowMessage(278, function (_e) {
      mainWindow.setEnabled(false) //窗口禁用
      setTimeout(() => {
        mainWindow.setEnabled(true)
      }, 100) //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
      return true
    })
    if (!settingWindowId) {
      //记录窗口
      settingWindowId = settingWindow.id
      BrowserWindowsMap.set(settingWindowId, settingWindow)
    }
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      settingWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/setting')
    } else {
      settingWindow.loadFile(join(__dirname, '../renderer/index.html'),{
        hash: "/setting"
      })
    }
    settingWindow.show()
    settingWindow.on('close', () => {
      //关闭时消除数据
      BrowserWindowsMap.delete(settingWindowId)
      settingWindowId = 0
    })
    return true
  })
  ipcMain.on('setOptical', function (event, opacity: number) {
    const webContents = event.sender
    //接受setting信息后发送给mainwindow
    const nowWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    const faterWindow = nowWindow.getParentWindow()
    faterWindow.webContents.send('saveOpacity', opacity / 100)
  })
  ipcMain.on('setEdge', function (event, showOrHide: boolean) {
    const webContents = event.sender
    //接受setting信息后发送给mainwindow
    const nowWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    const faterWindow = nowWindow.getParentWindow()
    faterWindow.webContents.send('saveEdge', showOrHide)
  })
  ipcMain.on('setHideHaddo', function (event, showOrHide: boolean) {
    const webContents = event.sender
    //接受setting信息后发送给mainwindow
    const nowWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    const faterWindow = nowWindow.getParentWindow()
    faterWindow.webContents.send('saveHideHaddo', showOrHide)
  })
  ipcMain.on('hideMainWindow', function (event) {
    const webContents = event.sender
    //接受setting信息后发送给mainwindow
    const mainWindow: any | BrowserWindow = BrowserWindow.fromWebContents(webContents)
    mainWindow.hide()
    mainWindow.minimize()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
