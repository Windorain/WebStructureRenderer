<script setup lang="ts">
/**
 * Workbench 主布局壳：Blender 风格 3 列。
 * 通过 named slots 让父组件控制各区域的内容与 props。
 */
import { provide } from 'vue'
import { usePanelResize } from './panelResize'

const { leftWidth, rightWidth, startLeftDrag, startRightDrag, dragging } = usePanelResize()

provide('wb-left-width', leftWidth)
provide('wb-right-width', rightWidth)
provide('wb-dragging', dragging)
</script>

<template>
  <div class="wb-shell" :class="{ 'wb-shell--dragging': dragging }">
    <header class="wb-menubar">
      <slot name="menubar" />
    </header>

    <nav class="wb-workspace-tabs">
      <slot name="workspace-tabs" />
    </nav>

    <div class="wb-main">
      <aside class="wb-toolshelf" :style="{ width: `${leftWidth}px` }">
        <slot name="tool-shelf" />
      </aside>

      <div
        class="wb-divider wb-divider--left"
        @pointerdown="startLeftDrag"
        role="separator"
        aria-orientation="vertical"
        tabindex="-1"
      />

      <main class="wb-viewport">
        <slot name="viewport" />
      </main>

      <div
        class="wb-divider wb-divider--right"
        @pointerdown="startRightDrag"
        role="separator"
        aria-orientation="vertical"
        tabindex="-1"
      />

      <aside class="wb-properties" :style="{ width: `${rightWidth}px` }">
        <slot name="properties" />
      </aside>
    </div>

    <footer class="wb-statusbar">
      <slot name="statusbar" />
    </footer>
  </div>
</template>

<style>
.wb-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #0f172a;
  color: #e2e8f0;
}
.wb-shell--dragging * { cursor: col-resize !important; }

.wb-menubar {
  flex-shrink: 0;
  height: 28px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.wb-workspace-tabs {
  flex-shrink: 0;
  height: 32px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.wb-main {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.wb-toolshelf {
  flex-shrink: 0;
  overflow-y: auto;
  background: #1a2332;
  border-right: 1px solid #1e293b;
}

.wb-divider {
  flex-shrink: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.15s;
  z-index: 10;
}
.wb-divider:hover,
.wb-divider:active {
  background: #2563eb;
}

.wb-viewport {
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  background: #0a0f19;
}

.wb-properties {
  flex-shrink: 0;
  overflow-y: auto;
  background: #1a2332;
  border-left: 1px solid #1e293b;
}

.wb-statusbar {
  flex-shrink: 0;
  height: 24px;
  background: #1e293b;
  border-top: 1px solid #334155;
  font-size: 11px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #64748b;
}
</style>
