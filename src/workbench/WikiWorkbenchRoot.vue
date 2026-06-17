<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

import WorkbenchShell from '@/workbench/layout/WorkbenchShell.vue'
import WorkbenchSettingsDrawer from '@/workbench/components/WorkbenchSettingsDrawer.vue'
import MenuBar from '@/workbench/components/MenuBar.vue'
import WorkspaceTabs from '@/workbench/components/WorkspaceTabs.vue'
import ViewportHost from '@/workbench/components/ViewportHost.vue'
import PropertiesPanel from '@/workbench/components/PropertiesPanel.vue'
import StatusBar from '@/workbench/components/StatusBar.vue'
import ExportWorkspace from '@/workbench/components/ExportWorkspace.vue'
import WikiViewerWorkspace from '@/workbench/components/WikiViewerWorkspace.vue'
import WikiDataPageEditor from '@/workbench/components/WikiDataPageEditor.vue'
import { useNeiTheme } from '@/workbench/composables/useNeiTheme'
import { provideSceneContext } from '@/workbench/sceneContext'
import { provideConnectionContext } from '@/workbench/connectionContext'
import { provideWikiDataContext } from '@/workbench/wikiDataContext'
import { parseWorkbenchQuery } from '@/workbench/utils/sceneHelpers'
import { normalizeWikiDataTitle } from '@/workbench/wikiDataPage'

declare global {
  interface Window {
    __WSR_WORKBENCH_DATA_TITLE__?: string
  }
}

const scene = provideSceneContext()
const connection = provideConnectionContext(scene)
const wikiData = provideWikiDataContext(scene)
useNeiTheme()

const workspace = ref<'preview' | 'wiki' | 'export'>('preview')
const settingsOpen = ref(false)
provide('workbenchSettingsOpen', settingsOpen)

function openSettings(): void { settingsOpen.value = true }
function resetLayout(): void {
  try { localStorage.removeItem('wsr-wb-left-w'); localStorage.removeItem('wsr-wb-right-w') } catch { /* */ }
  location.reload()
}

function initialWikiDataTitle(): string {
  if (typeof window === 'undefined') return ''
  const fromQuery = parseWorkbenchQuery().dataTitle
  const fromGlobal = window.__WSR_WORKBENCH_DATA_TITLE__ ?? ''
  const root = document.querySelector('[data-wsw-root]')
  const fromRoot = root instanceof HTMLElement ? root.getAttribute('data-wsw-data') ?? '' : ''
  const raw = fromQuery || fromGlobal || fromRoot
  if (!raw) return ''
  try {
    return normalizeWikiDataTitle(raw)
  } catch {
    return ''
  }
}

onMounted(async () => {
  const dataTitle = initialWikiDataTitle()
  if (dataTitle) {
    try {
      await wikiData.loadWikiDataPage(dataTitle)
    } catch (e) {
      scene.previewError.value = e instanceof Error ? e.message : String(e)
    }
    return
  }
  if (connection.apiBase.value) {
    await connection.testConnection()
    if (connection.connected.value) {
      await connection.refreshExportList()
      await connection.pullFromServer()
    }
  }
})
</script>

<template>
  <WorkbenchShell v-show="workspace === 'preview'">
    <template #menubar>
      <MenuBar @open-settings="openSettings" @reset-layout="resetLayout" />
    </template>
    <template #workspace-tabs>
      <WorkspaceTabs :model-value="workspace" @update:model-value="workspace = $event" />
    </template>
    <template #tool-shelf />
    <template #viewport>
      <ViewportHost />
    </template>
    <template #properties>
      <div class="wb-wiki-side">
        <WikiDataPageEditor />
        <PropertiesPanel />
      </div>
    </template>
    <template #statusbar>
      <StatusBar />
    </template>
  </WorkbenchShell>

  <div v-show="workspace === 'wiki'" class="wb-standalone">
    <header class="wb-standalone-menubar">
      <MenuBar @open-settings="openSettings" @reset-layout="resetLayout" />
    </header>
    <header class="wb-standalone-top">
      <div class="wb-standalone-tabs">
        <WorkspaceTabs :model-value="workspace" @update:model-value="workspace = $event" />
      </div>
    </header>
    <main class="wb-standalone-body wb-wiki-body">
      <WikiViewerWorkspace />
      <aside class="wb-wiki-dock">
        <WikiDataPageEditor />
      </aside>
    </main>
  </div>

  <div v-show="workspace === 'export'" class="wb-standalone">
    <header class="wb-standalone-menubar">
      <MenuBar @open-settings="openSettings" @reset-layout="resetLayout" />
    </header>
    <header class="wb-standalone-top">
      <div class="wb-standalone-tabs">
        <WorkspaceTabs :model-value="workspace" @update:model-value="workspace = $event" />
      </div>
    </header>
    <main class="wb-standalone-body">
      <ExportWorkspace />
    </main>
  </div>

  <WorkbenchSettingsDrawer />
</template>

<style>
.wb-standalone {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--nei-bg);
  color: var(--nei-text-dark);
}
.wb-standalone-menubar {
  flex-shrink: 0;
  height: 28px;
  background: var(--nei-bg-deep);
  border-bottom: 1px solid var(--nei-border);
}
.wb-standalone-top {
  flex-shrink: 0;
  height: 32px;
  background: var(--nei-bg-deep);
  border-bottom: 1px solid var(--nei-border);
  display: flex;
  align-items: center;
}
.wb-standalone-tabs {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.wb-standalone-body {
  flex: 1;
  overflow-y: auto;
}
.wb-wiki-side {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.wb-wiki-side > :first-child {
  flex-shrink: 0;
  border-bottom: 1px solid var(--nei-border);
}
.wb-wiki-side > :last-child {
  flex: 1;
  min-height: 0;
}
.wb-wiki-body {
  display: flex;
  overflow: hidden;
}
.wb-wiki-body > :first-child {
  flex: 1;
  min-width: 0;
}
.wb-wiki-dock {
  flex: 0 0 300px;
  border-left: 1px solid var(--nei-border);
  background: var(--nei-bg-deep);
  overflow-y: auto;
}
</style>
