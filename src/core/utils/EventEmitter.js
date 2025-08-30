
export default class EventEmitter {
    constructor() {
        this.events = {}
    }


    on(event, callback) {
        if (!this.events[event]) this.events[event] = []
        this.events[event].push(callback)
    }

    off(event, callback) {
        if (!this.events[event]) return
        this.events[event] = this.events[event].filter(fn => fn !== callback)
    }

    emit(event, ...args) {
        if (!this.events[event]) return
        for (const fn of this.events[event]) {
            fn(...args)
        }
    }
}
