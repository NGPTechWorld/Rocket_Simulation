
export default class AtmoshpereLayerTracker {
   /**
   * @param {import('./WorldManager').default} world
  */
    constructor (world, rocket){
      this.rocket = rocket
      this.layer = 'Unknown'
        this.gui =world.gui
      this.layers = [
        { name: 'Troposphere', maxHeight: 14500 },
        { name: 'Stratosphere', maxHeight: 50000 },
        { name: 'Mesosphere', maxHeight: 85000 },
        { name: 'Thermosphere', maxHeight: 600000 },
        { name: 'Ionosphere', maxHeight: 985000 },
        { name: 'Exosphere', maxHeight: 1000000 },
        { name: 'Space', maxHeight: Infinity },
      ];

      this.startTracking()
    }

    isOutsideAtmosphere() {
      return this.layer === 'Space'
    }

    update() {
      const height = this.rocket.height
  
      const foundLayer = this.layers.find(layer => height <= layer.maxHeight)
      this.layer = foundLayer ? foundLayer.name : 'Unknown'
    }

    setGUI() {
        this.gui.addTextMonitor('Atmosphere Layer', () => this.layer)
    }

    startTracking() {
      const loop = () => {
        this.update()
  
        
        if (this.isOutsideAtmosphere()) {
          console.log('Rocket has reached space! Simulation should end.')
          
          this.rocket.stop()
          return; 
        }
  
        requestAnimationFrame(loop);
      };
      loop();
    }
}