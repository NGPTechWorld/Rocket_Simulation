import * as THREE from 'three'

export default class SoundManager {
  constructor(camera) {
    this.listener = new THREE.AudioListener()
    camera.add(this.listener)

    this.loader = new THREE.AudioLoader()
    this.sounds = {}
  }

  /**
   * تحميل صوت جديد
   * @param {string} name - اسم تعريفي للصوت
   * @param {string} path - مسار ملف الصوت
   * @param {boolean} loop - هل يتكرر؟
   * @param {number} volume - مستوى الصوت من 0 إلى 1
   */
  load(name, path, loop = false, volume = 1) {
    const sound = new THREE.Audio(this.listener)
    this.loader.load(path, (buffer) => {
      sound.setBuffer(buffer)
      sound.setLoop(loop)
      sound.setVolume(volume)
      this.sounds[name] = sound
      console.log(`🟢 [SoundManager] Loaded: ${name}`)
    }, undefined, (err) => {
      console.error(`🔴 [SoundManager] Failed to load: ${name}`, err)
    })
  }


  play(name) {
    const sound = this.sounds[name]
    if (sound && !sound.isPlaying) {
      sound.play()
    }
  }


  stop(name) {
    const sound = this.sounds[name]
    if (sound && sound.isPlaying) {
      sound.stop()
    }
  }

  get(name) {
    return this.sounds[name] || null
  }
}
