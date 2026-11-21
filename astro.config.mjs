// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    // Emit CSS as separate files instead of inline <style> tags, so the
    // Content-Security-Policy in vercel.json can forbid all inline code.
    inlineStylesheets: 'never',
  },
});
