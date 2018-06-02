'user strict'
const {app, BrowserWindow, TouchBar, Tray, Menu} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar
const Stopwatch = require('timer-stopwatch')
const Hrt = require('human-readable-time')
let player = require('play-sound')(opts = {})

let timeFormat = new Hrt('%mm%:%ss%')
let onTime = 1500000
let offTime = 300000
let pomodoroDuration = onTime + offTime
let isOffTime = false
let pomodoroCount = 0

const options = {
  refreshRateMS: 1000    // How often the clock should be updated
}

global.onTimer = new Stopwatch(onTime, options)
global.offTimer = new Stopwatch(offTime, options)
global.isOffTime = isOffTime
global.pomodoroCount = pomodoroCount

global.onTimer.onTime(function (time) {
  let workTimeRemaining = timeFormat(new Date(time.ms)).toString() // TouchBarButton labels in electron only take strings
  // console.log(timeRemaining) // number of milliseconds past (or remaining);
  timer.label = '👩‍💻 time remaining - ' + workTimeRemaining
  return timer.label
})

// Fires when the timer is done
global.onTimer.onDone(function () {
  player.play('bell.wav', function (err) {
    if (err) throw err
  })
  global.isOffTime = true
  global.onTimer.reset(onTime)
  global.offTimer.start()
})

global.offTimer.onTime(function (time) {
  let breakTimeRemaining = timeFormat(new Date(time.ms)).toString()
  timer.label = '💆‍ time remaining - ' + breakTimeRemaining
  return timer.label
})

global.offTimer.onDone(function () {
  global.isOffTime = false
  timer.label = 'Start Pomodoro! 💡'
  // counter increments by 2 :/
  // pomodoroCount++
  // pomodoroCounter.label = pomodoroCount
  global.offTimer.reset(offTime)
  player.play('bell.wav', function (err) {
    if (err) throw err
  })
  return timer.label
})

const timer = new TouchBarButton({
  label: 'Start Pomodoro! 💡',
  backgroundColor: '#7851A9',
  click: () => {
    if (global.isOffTime) {
      global.offTimer.start()
    } else {
      global.onTimer.start()
    }
  }
})

let pomodoroCounter = new TouchBarLabel({
  label: 'Completed ' + global.pomodoroCount,
  textColor: '#fffff'
})

const touchBar = new TouchBar([
  timer,
  pomodoroCounter
])

// Menu
const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit'},
    {role: 'quit'}
])
let tray = null
let window

app.once('ready', () => {
  tray = new Tray('icon.png')
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 1,
    height: 1,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
  tray.setContextMenu(contextMenu)
})
