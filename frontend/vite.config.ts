import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The dev server is only reachable from the browser if it binds all interfaces:
    // inside the container, 127.0.0.1 is not the host.
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      // Source is bind-mounted from a Windows drive, where inotify events are unreliable.
      usePolling: true,
      interval: 300,
    },
  },
})
