<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import content from '@/../docs/user-guide.md?raw'

const md = new MarkdownIt({ html: false, linkify: true })
const html = md.render(content)
</script>

<template>
  <div class="hw-root">
    <div class="hw-body" v-html="html" />
  </div>
</template>

<style scoped>
.hw-root {
  height: 100%;
  overflow-y: auto;
  background: var(--nei-bg);
  color: var(--nei-text-dark);
}
.hw-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 40px;
  font-size: 14px;
  line-height: 1.7;
}
.hw-body :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--nei-text);
}
.hw-body :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  margin: 28px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--nei-border);
  color: var(--nei-text);
}
.hw-body :deep(h3) {
  font-size: 15px;
  font-weight: 600;
  margin: 20px 0 8px;
  color: var(--nei-text-dark);
}
.hw-body :deep(p) {
  margin: 0 0 10px;
}
.hw-body :deep(ul) {
  margin: 0 0 10px;
  padding-left: 20px;
}
.hw-body :deep(li) { margin-bottom: 4px; }
.hw-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 12px;
}
.hw-body :deep(th) {
  text-align: left;
  padding: 6px 10px;
  background: var(--nei-bg-deep);
  border: 1px solid var(--nei-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--nei-text);
}
.hw-body :deep(td) {
  padding: 5px 10px;
  border: 1px solid var(--nei-border);
  font-size: 13px;
}
.hw-body :deep(code) {
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 12px;
  background: var(--nei-inset-bg);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid var(--nei-border);
}
.hw-body :deep(pre) {
  background: var(--nei-inset-bg);
  border: 1px solid var(--nei-border);
  border-radius: 6px;
  padding: 12px 16px;
  overflow-x: auto;
}
.hw-body :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
}
</style>
