export default class LoadingScreen {
  constructor() {
    this.createHTML()
  }

  createHTML() {
    this.container = document.createElement('div')
    this.container.id = 'loading-screen'
    this.container.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
     // background: radial-gradient(#111 20%, #000);
       background:
    radial-gradient(circle at 30% 40%, rgba(34, 193, 195, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(253, 187, 45, 0.25) 0%, transparent 50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: sans-serif;
      z-index: 9999;
    `
    const title = document.createElement('h1')
    title.innerText = '🚀 Rockety'
    title.style.marginBottom = '20px'
    title.style.fontSize = '2.5rem'

    this.bar = document.createElement('div')
    this.bar.style.cssText = `
      width: 300px;
      height: 12px;
      background: #333;
      border-radius: 6px;
      overflow: hidden;
    `

    this.progress = document.createElement('div')
    this.progress.style.cssText = `
      height: 100%;
      width: 0%;
      background: #4caf50;
      transition: width 0.2s ease;
    `

    this.bar.appendChild(this.progress)
    this.container.appendChild(title)
    this.container.appendChild(this.bar)
    document.body.appendChild(this.container)
  }


  setProgress(ratio) {
    this.progress.style.width = `${(ratio * 100).toFixed(0)}%`
  }

  hide() {
    this.container.style.transition = 'opacity 0.5s ease'
    this.container.style.opacity = 0
    setTimeout(() => {
      this.container.remove()
    }, 500)
  }
}
