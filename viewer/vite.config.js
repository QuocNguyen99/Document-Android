import {
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
} from "node:fs";
import { extname, resolve, sep } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const contentRoot = resolve(import.meta.dirname, "..");
const resourcesRoot = resolve(contentRoot, "resources");
const assetAliases = new Map([
  ["layout_grid_ui_ux.png.png", "layout_grid_ui_ux.png"],
]);

const mimeTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function serveAsset(response, filePath) {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) return false;
  response.statusCode = 200;
  response.setHeader(
    "Content-Type",
    mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
  );
  response.setHeader("Cache-Control", "public, max-age=3600");
  createReadStream(filePath).pipe(response);
  return true;
}

function copyDocumentAssets() {
  return {
    name: "copy-document-assets",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent(
          new URL(request.url || "/", "http://localhost").pathname,
        );

        if (pathname.startsWith("/resources/")) {
          const requestedName = pathname.slice("/resources/".length);
          const safeName = assetAliases.get(requestedName) || requestedName;
          const filePath = resolve(resourcesRoot, safeName);
          if (
            filePath.startsWith(`${resourcesRoot}${sep}`)
            && serveAsset(response, filePath)
          ) return;
        }

        if (pathname === "/General/VersionControlSystem/image.png") {
          const filePath = resolve(
            contentRoot,
            "General/VersionControlSystem/image.png",
          );
          if (serveAsset(response, filePath)) return;
        }

        next();
      });
    },
    closeBundle() {
      const out = resolve(import.meta.dirname, "dist");
      mkdirSync(out, { recursive: true });
      cpSync(
        resourcesRoot,
        resolve(out, "resources"),
        { recursive: true },
      );

      for (const [alias, source] of assetAliases) {
        cpSync(
          resolve(resourcesRoot, source),
          resolve(out, "resources", alias),
        );
      }

      const localImage = resolve(
        contentRoot,
        "General/VersionControlSystem/image.png",
      );
      if (existsSync(localImage)) {
        const target = resolve(out, "General/VersionControlSystem");
        mkdirSync(target, { recursive: true });
        cpSync(localImage, resolve(target, "image.png"));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyDocumentAssets()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
