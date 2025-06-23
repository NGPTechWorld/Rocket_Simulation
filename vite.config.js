import restart from 'vite-plugin-restart'

export default {
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../assets/', // Path from "root" to static assets (files that are served as they are)

    plugins:
    [
        restart({ restart: [ '../assets/**', ] }) // Restart server on static file change
    ],
}