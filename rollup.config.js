import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import polyfillNode from "rollup-plugin-polyfill-node";

export default {
  input: "src/index.js",
  output: {
    file: "./dist/Apricity.js",
    name: "Apricity",
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    resolve({
      browser: true,
    }),
    polyfillNode({}),
  ],
};
