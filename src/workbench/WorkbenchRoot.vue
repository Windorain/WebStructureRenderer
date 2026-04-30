<script setup lang="ts">
import { onMounted, ref } from 'vue'

import WorkbenchShell from '@/workbench/layout/WorkbenchShell.vue'
import WorkbenchSettingsDrawer from '@/workbench/components/WorkbenchSettingsDrawer.vue'
import MenuBar from '@/workbench/components/MenuBar.vue'
import WorkspaceTabs from '@/workbench/components/WorkspaceTabs.vue'
import ToolShelf from '@/workbench/components/ToolShelf.vue'
import ViewportHost from '@/workbench/components/ViewportHost.vue'
import PropertiesPanel from '@/workbench/components/PropertiesPanel.vue'
import StatusBar from '@/workbench/components/StatusBar.vue'
import { provideWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = provideWorkbenchContext()

/** 编辑模式 */
const editMode = ref(false)

/** 选中方块 */
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
      try {
        await ctx.loadLocalScene(sceneId)
      } catch {
        /* ignore */
      }
    }
  }
})
</script>

<template>
  <WorkbenchShell>
    <template #menubar>
      <MenuBar @open-settings="openSettings" @reset-layout="resetLayout" />
    </template>

    <template #workspace-tabs>
      <WorkspaceTabs />
    </template>

    <template #tool-shelf>
      <ToolShelf :edit-mode="editMode" @update:edit-mode="editMode = $event" />
    </template>

    <template #viewport>
      <ViewportHost
        :edit-mode="editMode"
        :selected-block="selectedBlock"
        @update:selected-block="selectedBlock = $event"
      />
    </template>

    <template #properties>
      <PropertiesPanel
        :edit-mode="editMode"
        :selected-block="selectedBlock"
      />
    </template>

    <template #statusbar>
      <StatusBar />
    </template>
  </WorkbenchShell>
  <WorkbenchSettingsDrawer />
</template>
