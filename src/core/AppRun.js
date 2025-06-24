import * as THREE from 'three'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import SceneManager from './SceneManager.js'
import Sizes from './utils/Size.js'
import Time from './utils/Time.js'
import EventEmitter from './utils/EventEmitter.js'
import GuiController from './../world/ui/GuiController.js'
import SoundManager from './SoundManager.js'

export default class AppRun {
  static instance

  constructor(canvas) {
    if (AppRun.instance) return AppRun.instance
    AppRun.instance = this

    this.canvas = canvas
    this.scene = new THREE.Scene()

    this.gui = new GuiController()
    this.sizes = new Sizes()
    this.eventEmitter = new EventEmitter()
    this.time = new Time()
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.sceneManager = new SceneManager(this)
    this.sound = new SoundManager(this.camera.instance) 

    this.sizes.on('resize', () => this.resize())
    this.time.on('tick', () => this.update())
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.sceneManager.update()
    this.renderer.update()
  }
}
