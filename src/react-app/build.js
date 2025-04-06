const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "../../static/js/bundle.js", // Hugo serves from /static/
  loader: { ".ts": "ts", ".tsx": "tsx" },
  jsx: "automatic",
  external: [], // No CDN for React. Something something something privacy.
  format: "iife",
  globalName: "GraphApp",
}).catch(() => process.exit(1));
