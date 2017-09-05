const {app, BrowserWindow, TouchBar} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const time = new Date().toLocaleTimeString('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}).toString()

const timer = new TouchBarButton({
  label: time,
  backgroundColor: '#7851A9'
})

const touchBar = new TouchBar([
  timer
])

let window

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
})
