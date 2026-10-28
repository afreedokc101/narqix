import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Notion checklists render as disabled checkboxes; they are decoration, so hide them from screen readers.
function rehypeDecorativeCheckboxes() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'input' && node.properties?.type === 'checkbox') {
      node.properties['aria-hidden'] = 'true';
      node.properties.tabIndex = -1;
    }
    node.children?.forEach(walk);
  };
  return walk;
}

export default defineConfig({
  site: 'https://academy.narqix.com',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  prefetch: false,
  vite: { plugins: [tailwindcss()] },
  markdown: { gfm: true, smartypants: false, rehypePlugins: [rehypeDecorativeCheckboxes] },
});
