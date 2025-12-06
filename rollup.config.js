import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "index.js",
  output: {
    file: "package/lib/aux4-faker.js",
    format: "es",
    sourcemap: false,
    inlineDynamicImports: true
  },
  external: (id) => {
    // Node.js built-ins
    if ([
      "fs", "path", "process", "stream", "zlib", "util", "events",
      "buffer", "string_decoder", "url", "http", "https", "crypto",
      "os", "child_process", "assert", "worker_threads", "module"
    ].includes(id)) {
      return true;
    }
    return false;
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      exportConditions: ["node"]
    }),
    commonjs({
      ignoreDynamicRequires: true
    }),
    json()
  ],
  onwarn(warning, warn) {
    // Suppress circular dependency warnings
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    // Suppress eval warnings
    if (warning.code === "EVAL") return;
    warn(warning);
  }
};
