<script setup lang="ts">
import { onMounted, ref } from 'vue'

import WorkbenchShell from '@/workbench/layout/WorkbenchShell.vue'
import WorkbenchSettingsDrawer from '@/workbench/components/WorkbenchSettingsDrawer.vue'
import MenuBar from '@/workbench/components/MenuBar.vue'
import WorkspaceTabs from '@/workbench/components/WorkspaceTabs.vue'
import ViewportHost from '@/workbench/components/ViewportHost.vue'
import PropertiesPanel from '@/workbench/components/PropertiesPanel.vue'
import StatusBar from '@/workbench/components/StatusBar.vue'
import ExportWorkspace from '@/workbench/components/ExportWorkspace.vue'
import { provideWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = provideWorkbenchContext()

const workspace = ref<'preview' | 'export'>('preview')
const editMode = ref(false)
const activeTool = ref('select')
const selectedBlock = ref<{
  blockId: string
  voxel?: { column: number; row: number; zSlice: number }
} | null>(null)

function openSettings(): void { ctx.settingsOpen.value = true }
function resetLayout(): void {
  try { localStorage.removeItem('wsr-wb-left-w'); localStorage.removeItem('wsr-wb-right-w') } catch { /* */ }
  location.reload()
}

onMounted(async () => {
  if (ctx.apiBase.value) {
    await ctx.testConnection()
    if (ctx.connectionOk.value) {
      await ctx.refreshExportList()
      await ctx.loadWorkspaceFromServer()
    }
  } else if (import.meta.env.DEV) {
    const q = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const sceneId = q?.get('sceneId')
    if (sceneId) {
      try { await ctx.loadLocalScene(sceneId) } catch { /* ignore */ }
    }
  }
})
</script>

<template>
  <!-- Preview Workspace: 3-column Blender layout -->
  <WorkbenchShell v-show="workspace === 'preview'">
    <template #menubar>
      <MenuBar @open-settings="openSettings" @reset-layout="resetLayout" />
    </template>
    <template #workspace-tabs>
      <WorkspaceTabs :model-value="workspace" @update:model-value="workspace = $event" />
    </template>
    <template #tool-shelf />
    <template #viewport>
      <ViewportHost
        :edit-mode="editMode"
        :selected-block="selectedBlock"
        @update:edit-mode="editMode = $event"
        @update:active-tool="activeTool = $event"
        @update:selected-block="selectedBlock = $event"
      />
    </template>
    <template #properties>
      <PropertiesPanel :edit-mode="editMode" :selected-block="selectedBlock" />
    </template>
    <template #statusbar>
      <StatusBar />
    </template>
  </WorkbenchShell>

  <!-- Export Workspace: standalone full page -->
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
  background: #0f172a;
  color: #e2e8f0;
}
.wb-standalone-menubar {
  flex-shrink: 0;
  height: 28px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}
.wb-standalone-top {
  flex-shrink: 0;
  height: 32px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
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
</style>
