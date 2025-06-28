import restart from "vite-plugin-restart";

export default {
  root: "src/", // Sources files (typically where index.html is)
  publicDir: "../assets/", // Path from "root" to static assets (files that are served as they are)
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  plugins: [
    restart({ restart: ["../assets/**"] }), // Restart server on static file change
  ],
};
