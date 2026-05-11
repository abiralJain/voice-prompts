import path from "node:path";

/**
 * Workaround for a bug in @tailwindcss/postcss (v4.2.x and v4.3.0):
 * when PostCSS is invoked without `result.opts.from` (which happens with
 * Next.js 16's Turbopack on certain dev compilations), Tailwind computes
 * `path.dirname(path.resolve(""))`, which resolves to the *parent* of the
 * current working directory. That parent (e.g. /Users/<you>) has no
 * node_modules, so resolving "tailwindcss" fails and floods the terminal.
 *
 * This wrapper plugin runs before @tailwindcss/postcss and ensures `from`
 * is always set to a real path inside the project.
 */
const ensureFromForTailwind = () => ({
  postcssPlugin: "ensure-from-for-tailwind",
  Once(_root, { result }) {
    if (!result.opts.from) {
      result.opts.from = path.join(process.cwd(), "src/app/globals.css");
    }
  },
});
ensureFromForTailwind.postcss = true;

const config = {
  plugins: [ensureFromForTailwind(), "@tailwindcss/postcss"],
};

export default config;
