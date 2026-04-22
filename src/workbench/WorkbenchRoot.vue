<script setup lang="ts">
import { computed, onMounted } from 'vue'

import ExportActionsPanel from '@/workbench/components/ExportActionsPanel.vue'
import MetadataEditor from '@/workbench/components/MetadataEditor.vue'
import WorkbenchPreviewConfigPanel from '@/workbench/components/WorkbenchPreviewConfigPanel.vue'
import WorkbenchPreviewPanel from '@/workbench/components/WorkbenchPreviewPanel.vue'
import WorkbenchSettingsDrawer from '@/workbench/components/WorkbenchSettingsDrawer.vue'
import WorkbenchSidebar from '@/workbench/components/WorkbenchSidebar.vue'
import WorkbenchTopbar from '@/workbench/components/WorkbenchTopbar.vue'
import { provideWorkbenchContext } from '@/workbench/workbenchContext'

const ctx = provideWorkbenchContext()

const section = computed(() => ctx.mainSection.value)
const metadataEditorKey = computed(
  () => `${ctx.sceneLoadEpoch.value}-${ctx.localFileName.value ?? ''}-${ctx.selectedExportName.value ?? ''}`,
)

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
        /* 保持当前模式与空文档 */
      }
    }
  }
})
</script>

<template>
  <div class="dash-app">
    <WorkbenchSidebar />

    <div class="dash-main">
      <WorkbenchTopbar />

      <div class="dash-body">
        <div v-show="section === 'preview'" class="dash-pane dash-pane--preview">
          <WorkbenchPreviewPanel />
          <WorkbenchPreviewConfigPanel />
        </div>
        <div v-show="section === 'edit'" class="dash-pane dash-pane--narrow">
          <MetadataEditor :key="metadataEditorKey" />
        </div>
        <div v-show="section === 'export'" class="dash-pane dash-pane--narrow">
          <ExportActionsPanel />
        </div>
      </div>
    </div>

    <WorkbenchSettingsDrawer />
  </div>
</template>

<style scoped>
.dash-app {
  display: flex;
  min-height: 100vh;
  background: #020617;
}
.dash-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.dash-body {
  flex: 1;
  padding: 18px 20px 24px;
  box-sizing: border-box;
  overflow: auto;
}
.dash-pane {
  min-height: calc(100vh - 52px - 36px);
}
.dash-pane--preview {
  max-width: none;
}
.dash-pane--narrow {
  max-width: 800px;
}
</style>
