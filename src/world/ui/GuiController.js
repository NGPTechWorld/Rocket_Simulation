import GUI from 'lil-gui'

export default class GuiController {
  constructor() {
    this.gui = new GUI()
    this.folders = {}
  }

    /**
   * إضافة تحكم عادي مثل: this.gui.add(obj, 'prop', [...])
   */
  add(...args) {
    return this.gui.add(...args)
  }
  
  /**
   * إضافة تحكم لمجسم (position, scale, rotation)
   * @param {string} name - اسم القسم داخل الواجهة
   * @param {THREE.Object3D} object - المجسم المستهدف
   */
  addObjectControls(name, object) {
    const folder = this.gui.addFolder(name)

    // Position
    folder.add(object.position, 'x', -10, 10).step(0.1).name('pos.x')
    folder.add(object.position, 'y', -10, 10).step(0.1).name('pos.y')
    folder.add(object.position, 'z', -10, 10).step(0.1).name('pos.z')

    // Scale
    folder.add(object.scale, 'x', 0.01, 5).step(0.01).name('scale.x')
    folder.add(object.scale, 'y', 0.01, 5).step(0.01).name('scale.y')
    folder.add(object.scale, 'z', 0.01, 5).step(0.01).name('scale.z')

    // Rotation
    folder.add(object.rotation, 'x', 0, Math.PI * 2).step(0.01).name('rot.x')
    folder.add(object.rotation, 'y', 0, Math.PI * 2).step(0.01).name('rot.y')
    folder.add(object.rotation, 'z', 0, Math.PI * 2).step(0.01).name('rot.z')

    folder.open()

    this.folders[name] = folder
  }

  /**
  * إضافة أزرار تحكم الإطلاق والإيقاف للـ rocket
  * @param {object} rocket - الكائن الذي يحتوي على دوال launch و stop
  */
  addLaunchStopControls(rocket) {
    this.gui.add({ launch: () => rocket.launch() }, 'launch')
    this.gui.add({ stop: () => rocket.stop() }, 'stop')
  }

  /**
   * إضافة مراقبة نصية لقيمة معينة (مثل ارتفاع)
   * @param {string} label الاسم الظاهر في الواجهة
   * @param {() => any} getValue دالة لإرجاع القيمة
   */
  addTextMonitor(label, getValue) {
    const obj = { [label]: getValue() }

    const controller = this.gui.add(obj, label)

    function update() {
      controller.setValue(getValue())
      requestAnimationFrame(update)
    }

    update()
  }

  /**
   * إزالة مجلد تحكم
   */
  remove(name) {
    if (this.folders[name]) {
      this.gui.removeFolder(this.folders[name])
      delete this.folders[name]
    }
  }
}
