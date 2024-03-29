import { Menu, Tray } from 'electron'
import path from 'path'
const createTray = (): Tray => {
  const tray = new Tray(
    path.resolve(
      __dirname,
      process.platform == 'darwin' ? '../../resources/icon@2x.png' : '../../resources/icon.png'
    )
  )
  const contextMenu = Menu.buildFromTemplate([{ label: '退出', role: 'quit' }])
  tray.setToolTip('代办清单')
  tray.setContextMenu(contextMenu)
  return tray
}

export { createTray }
