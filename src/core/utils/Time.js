import EventEmitter from './EventEmitter.js';

export default class Time extends EventEmitter {
  constructor() {
    super();
    this.start = performance.now();
    this.current = this.start;
    this.delta = 0;
    this.elapsed = 0;

    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  tick() {
    const now = performance.now();
    this.delta = (now - this.current) / 1000;
    this.current = now;
    this.elapsed = (now - this.start) / 1000;

    // نبث حدث 'tick' مع الفارق الزمني والوقت الكلي
    this.emit('tick', this.delta, this.elapsed);

    requestAnimationFrame(this.tick);
  }
}
