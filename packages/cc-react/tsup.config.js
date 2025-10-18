import { defineConfig } from "tsup";
export default defineConfig({
    clean: true,
    dts: true,
    entry: ["./src/packages/cc-react/index.ts"],
    format: ["cjs", "esm"],
    shims: true,
    skipNodeModulesBundle: true,
});
