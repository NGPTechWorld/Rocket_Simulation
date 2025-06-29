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
          return; 
        }
  
        requestAnimationFrame(loop);
      };
      loop();
    }
}