<script setup lang="ts">
/**
 * PS 风格菜单栏：File / Edit / View / Help
 */
import { ref } from 'vue'
import { useWorkbenchContext } from '@/workbench/workbenchContext'
import { t, setLang, currentLang } from '@/workbench/i18n'

const ctx = useWorkbenchContext()

defineProps<{ editMode?: boolean }>()

const emit = defineEmits<{
  (e: 'open-settings'): void
  (e: 'reset-layout'): void
}>()

const openMenu = ref<string | null>(null)
const lang = currentLang

function switchLang(v: 'zh' | 'en'): void {
  setLang(v)
  closeMenu()
}

function toggleMenu(menu: string): void {
  openMenu.value = openMenu.value === menu ? null : menu
}
function closeMenu(): void { openMenu.value = null }

function onMenuAction(action: string): void {
  closeMenu()
  switch (action) {
    case 'open-settings': emit('open-settings'); break
    case 'save-file': void ctx.writeSceneToLocalDisk().catch(() => {}); break
    case 'reset-layout': emit('reset-layout'); break
  }
}
</script>

<template>
  <div class="mb-root" @mouseleave="closeMenu">
    <div class="mb-left">
      <div class="mb-item" @mouseenter="toggleMenu('file')">
        <span class="mb-label">{{ t('file') }}</span>
        <div v-if="openMenu === 'file'" class="mb-dropdown">
          <button class="mb-dd-item" @click="onMenuAction('open-settings')">{{ t('openScene') }}</button>
          <button class="mb-dd-item" @click="onMenuAction('save-file')">{{ t('saveToFile') }}</button>
        </div>
      </div>
      <div class="mb-item" @mouseenter="toggleMenu('edit')">
        <span class="mb-label">{{ t('edit') }}</span>
        <div v-if="openMenu === 'edit'" class="mb-dropdown">
          <div class="mb-dd-section">{{ t('language') }}</div>
          <button class="mb-dd-item" :class="{ 'mb-dd-item--checked': lang === 'zh' }" @click="switchLang('zh')">
            <span class="mb-check">{{ lang === 'zh' ? '✓' : '' }}</span>{{ t('chinese') }}
          </button>
          <button class="mb-dd-item" :class="{ 'mb-dd-item--checked': lang === 'en' }" @click="switchLang('en')">
            <span class="mb-check">{{ lang === 'en' ? '✓' : '' }}</span>{{ t('english') }}
          </button>
        </div>
      </div>
      <div class="mb-item" @mouseenter="toggleMenu('view')">
        <span class="mb-label">{{ t('view') }}</span>
        <div v-if="openMenu === 'view'" class="mb-dropdown">
          <button class="mb-dd-item" @click="onMenuAction('reset-layout')">{{ t('resetLayout') }}</button>
        </div>
      </div>
      <span class="mb-label mb-disabled">{{ t('help') }}</span>
    </div>
    <div class="mb-right">
      <span class="mb-status-dot" :class="ctx.connectionOk.value ? 'mb-online' : 'mb-offline'" />
      <span class="mb-status-label">{{ ctx.connectionOk.value ? t('connected') : t('offline') }}</span>
    </div>
  </div>
</template>

<style scoped>
.mb-root {
  display: flex; align-items: center; justify-content: space-between;
  height: 100%; padding: 0 6px; font-size: 12px;
}
.mb-left, .mb-right { display: flex; align-items: center; gap: 0; }
.mb-item { position: relative; }
.mb-label {
  padding: 3px 10px; border-radius: 4px; cursor: pointer;
  user-select: none; color: #cbd5e1; display: inline-block;
}
.mb-label:hover { background: #334155; }
.mb-disabled { color: #475569; cursor: default; }
.mb-disabled:hover { background: transparent; }
.mb-dropdown {
  position: absolute; top: 100%; left: 0; z-index: 1000;
  min-width: 180px; padding: 4px;
  background: #1e293b; border: 1px solid #334155; border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.mb-dd-section {
  padding: 4px 10px 2px; font-size: 10px; text-transform: uppercase;
  color: #64748b; letter-spacing: 0.5px;
}
.mb-dd-item {
  display: flex; align-items: center; gap: 4px;
  width: 100%; padding: 5px 10px; border: none;
  background: transparent; color: #e2e8f0; font-size: 12px;
  text-align: left; cursor: pointer; border-radius: 3px;
}
.mb-dd-item:hover { background: #2563eb; }
.mb-check { width: 14px; font-size: 10px; color: #22c55e; }
.mb-status-dot { width: 7px; height: 7px; border-radius: 50%; margin-right: 4px; }
.mb-online { background: #22c55e; box-shadow: 0 0 4px #22c55e; }
.mb-offline { background: #64748b; }
.mb-status-label { font-size: 11px; color: #94a3b8; }
</style>
