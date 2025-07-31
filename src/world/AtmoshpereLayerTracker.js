export const ATMOSPHERE_LAYERS = [
  { name: 'Troposphere', maxHeight: 20 },//km    
  { name: 'Stratosphere', maxHeight: 50 },//km  
  { name: 'Mesosphere', maxHeight: 85 },//km  
  { name: 'Thermosphere', maxHeight: 600 },//km  
  { name: 'Ionosphere', maxHeight: 985 },//km  
  { name: 'Exosphere', maxHeight: 1000 },//km  
  { name: 'Space', maxHeight: Infinity },
];

export default class AtmoshpereLayerTracker {
   /**
   * @param {import('./WorldManager').default} world
  */
    constructor (world, rocket){
      this.rocket = rocket
      this.layer = 'Unknown'
      this.guiRight =world.guiRight
      this.layers = ATMOSPHERE_LAYERS

      this.startTracking()
    }

    isOutsideAtmosphere() {
      return this.layer === 'Space'
    }

    update() {
      this.layer = this.layers.find(layer => this.rocket.height <= layer.maxHeight * 1000)?.name || 'Unknown';
    }
    
    setGUI() {
        this.guiRight.addTextMonitor('Atmosphere Layer', () => this.layer)
    }

    startTracking() {
      const loop = () => {
        this.update()
  
        
        if (this.isOutsideAtmosphere()) {
          console.log('Rocket has reached space! Simulation should end.')
          
          this.rocket.stop()
          
      const msg = document.getElementById('end-simulation-message');
      if (msg) {
        // إخفاء أي واجهات سابقة إذا وجدت
        ['stop-message', 'crash-message'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });

        msg.style.display = 'flex';

        // ربط زر إعادة المحاكاة (نستخدم id مختلف لتفادي تعارض)
        const retryBtn = document.getElementById('retry-end');
        if (retryBtn) {
          // إلغاء أي مستمع قديم
          retryBtn.replaceWith(retryBtn.cloneNode(true));
          const fresh = document.getElementById('retry-end');
          fresh.addEventListener('click', () => {
            // إخفاء الواجهة
            msg.style.display = 'none';

            // إعادة تهيئة المحاكاة أو fallback بإعادة تحميل الصفحة
            if (typeof window.initSimulation === 'function') {
              window.initSimulation();
            } else {
              location.reload();
            }
          });
        }
      }

          return;
        }
  
        requestAnimationFrame(loop);
      };
      loop();
    }
}