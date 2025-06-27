// src/ui/MainMenu.js
import * as THREE from 'three'

export default class MainMenu {
  constructor(uiManager) {
    this.uiManager = uiManager
    this.container = document.createElement('div')
    this.container.className = 'ui-main-menu'
    this.container.style.position = 'absolute'
    this.container.style.top = '0'
    this.container.style.left = '0'
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'column'
    this.container.style.justifyContent = 'center'
    this.container.style.alignItems = 'center'
    this.container.style.background = 'linear-gradient(rgba(92, 8, 86, 0.7), rgba(58, 3, 105, 0.9))' // قابل للتخصيص لاحقًا
    this.container.style.zIndex = '10'
    this.container.style.gap = '20px'
    this.container.style.fontFamily = 'sans-serif'

    const title = document.createElement('h1')
    title.innerText = '🚀 Rocket Simulation'
    title.style.color = '#fff'
    title.style.fontSize = '2.5rem'
    this.container.appendChild(title)

    const startBtn = this._createButton('ابدأ المحاكاة', () => this.uiManager.startSimulation())
    const rocketBtn = this._createButton('اختر الصاروخ', () => this.uiManager.showRocketSelector())
    const mapBtn = this._createButton('اختر الخريطة', () => this.uiManager.showMapSelector())

    this.container.appendChild(startBtn)
    this.container.appendChild(rocketBtn)
    this.container.appendChild(mapBtn)

    document.body.appendChild(this.container)
  }

  _createButton(text, onClick) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.style.padding = '12px 24px'
    btn.style.fontSize = '1.2rem'
    btn.style.border = 'none'
    btn.style.borderRadius = '8px'
    btn.style.background = 'rgba(213, 209, 5, 0.97)'
    btn.style.color = '#000'
    btn.style.cursor = 'pointer'
    btn.style.transition = 'all 0.3s ease'

    btn.onmouseenter = () => btn.style.background = 'rgba(213, 164, 5, 0.97)'
    btn.onmouseleave = () => btn.style.background = 'rgba(213, 209, 5, 0.97)'
    btn.onclick = onClick

    return btn
  }

  show() {
    this.container.style.display = 'flex'
  }

  hide() {
    this.container.style.display = 'none'
  }
}
