<script setup lang="ts">
import { onMounted, ref } from 'vue'

import WorkbenchShell from '@/workbench/layout/WorkbenchShell.vue'
import WorkbenchSettingsDrawer from '@/workbench/components/WorkbenchSettingsDrawer.vue'
import MenuBar from '@/workbench/components_new/MenuBar.vue'
import WorkspaceTabs from '@/workbench/components_new/WorkspaceTabs.vue'
import ToolShelf from '@/workbench/components_new/ToolShelf.vue'
import ViewportHost from '@/workbench/components_new/ViewportHost.vue'
import PropertiesPanel from '@/workbench/components_new/PropertiesPanel.vue'
import StatusBar from '@/workbench/components_new/StatusBar.vue'
import { provideWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = provideWorkbenchContext()

/** 编辑模式 */
const editMode = ref(false)

/** 选中方块 */
const selectedBlock = ref<{
  blockId: string
  voxel?: { column: number; row: number; zSlice: number }
} | null>(null)

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
      <MenuBar />
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
