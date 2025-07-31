import AppRun from './core/AppRun.js'

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas.webgl')
  const app = new AppRun(canvas)
  app.start()
})