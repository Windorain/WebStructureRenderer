/**
 * 灰机 Wiki「零件」入口示例：在 Vue（cockpitVue）就绪后加载构建产物。
 * 1. 将 dist/wiki-multi-structure-render.js 上传为零件（名称自定，与下方 URL 一致）。
 * 2. 在页面模板中放置：<div id="wiki-multi-structure-render"></div>
 * 3. 若使用独立 CSS 文件，需另行通过站点 CSS 或 <link> 引入 dist/wiki-multi-structure-render.css
 */
$(function () {
  window.addEventListener(
    'externalLibsLoaded',
    function () {
      $.getScript('/wiki/Gadget:wiki-multi-structure-render.js?action=raw').fail(function (_jqXHR, textStatus, err) {
        console.error('[WikiMultiStructureRender] 脚本加载失败', textStatus, err)
      })
    },
    { once: true },
  )
})
