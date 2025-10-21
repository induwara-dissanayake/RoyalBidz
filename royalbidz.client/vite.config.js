import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { env } from "process";

const baseFolder =
  env.APPDATA !== undefined && env.APPDATA !== ""
    ? `${env.APPDATA}/ASP.NET/https`
    : `${env.HOME}/.aspnet/https`;

const certificateName = "royalbidz.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (
    0 !==
    child_process.spawnSync(
      "dotnet",
      [
        "dev-certs",
        "https",
        "--export-path",
        certFilePath,
        "--format",
        "Pem",
        "--no-password",
      ],
      { stdio: "inherit" }
    ).status
  ) {
    throw new Error("Could not create certificate.");
  }
}

// Use HTTP backend since HTTPS is not working
const target = "http://localhost:5242";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy all API calls to the backend server
      "^/api": {
        target,
        secure: false,
        changeOrigin: true,
      },
      // Proxy SignalR hub
      "^/auctionHub": {
        target,
        secure: false,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying for SignalR
      },
      // Proxy Swagger
      "^/swagger": {
        target,
        secure: false,
        changeOrigin: true,
      },
      // Keep the original weatherforecast proxy for backward compatibility
      "^/weatherforecast": {
        target,
        secure: false,
      },
      // Proxy uploads so front-end can request /uploads/* and Vite will forward to backend
      "^/uploads": {
        target,
        secure: false,
        changeOrigin: true,
      },
    },
    port: parseInt(env.DEV_SERVER_PORT || "3000"),
    host: "127.0.0.1", // Use IPv4 localhost instead of IPv6
    // Commented out HTTPS for development to avoid permission issues
    // https: {
    //   key: fs.readFileSync(keyFilePath),
    //   cert: fs.readFileSync(certFilePath),
    // },
  },
});
