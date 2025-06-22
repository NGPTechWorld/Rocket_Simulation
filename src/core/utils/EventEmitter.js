
export default class EventEmitter {
    constructor() {
        // كائن لتخزين الأحداث والمستمعين المرتبطين بها
        this.events = {}
    }

    /**
     * تسجيل مستمع (callback) لحدث معين
     * @param {string} event - اسم الحدث
     * @param {Function} callback - الدالة التي ستُنفذ عند إطلاق الحدث
     */
    on(event, callback) {
        if (!this.events[event]) this.events[event] = []
        this.events[event].push(callback)
    }

    /**
     * إلغاء تسجيل مستمع من حدث معين
     * @param {string} event - اسم الحدث
     * @param {Function} callback - الدالة المراد حذفها
     */
    off(event, callback) {
        if (!this.events[event]) return
        this.events[event] = this.events[event].filter(fn => fn !== callback)
    }

    /**
     * إطلاق حدث واستدعاء جميع المستمعين المرتبطين به
     * @param {string} event - اسم الحدث
     * @param {...any} args - المعطيات الممررة للدوال
     */
    emit(event, ...args) {
        if (!this.events[event]) return
        for (const fn of this.events[event]) {
            fn(...args)
        }
    }
}
