//按照官方做法，使用入口来加载真正的逻辑文件，可参考
//https://www.huijiwiki.com/wiki/%E5%B8%AE%E5%8A%A9:%E5%9C%A8%E7%81%B0%E6%9C%BA%E4%BD%BF%E7%94%A8Vue.js

//使用ES5语法
//加载CSS和JS文件
//词条中挂载点示例：
//<div id="wiki-multi-structure-render" data-wmr-structure="MEControllers5x5"></div>
//将加载 https://你的站/wiki/Data:Structures/MEControllers5x5.json?action=raw
//若无 data-wmr-structure，则仍使用 window.__WMR_EMBED_DOCUMENT__（便于控制台调试）

/* global $, mw, document, window, console */
$(function () {
  function loadWmrCss() {
    if (document.querySelector('link[data-wmr-css]')) {
      return
    }
    var href = mw.util.getUrl('零件:StructureRender.css', {
      action: 'raw',
      ctype: 'text/css',
    })
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-wmr-css', '1')
    document.head.appendChild(link)
  }

  /**
   * 从挂载 div 的 data-wmr-structure 得到 MediaWiki 页面名 Data:Structures/XXX.json
   * 属性值填 XXX 即可（可带或不带 .json 后缀）
   */
  function structureDataTitleFromMountEl(el) {
    if (!el || !el.getAttribute) {
      return ''
    }
    var v = el.getAttribute('data-wmr-structure')
    if (v == null || typeof v !== 'string') {
      return ''
    }
    v = v.replace(/^\s+|\s+$/g, '')
    if (!v) {
      return ''
    }
    v = v.replace(/\.json$/i, '')
    return 'Data:Structures/' + v + '.json'
  }

  function onExternalLibsLoaded() {
    window.removeEventListener('externalLibsLoaded', onExternalLibsLoaded, false)
    loadWmrCss()
    var raw = mw.util.getUrl('零件:StructureRender.js', {
      action: 'raw',
      ctype: 'text/javascript',
    })
    $.getScript(raw, function () {
      if (!window.WikiMultiStructureRender || !window.WikiMultiStructureRender.mount) {
        return
      }
      var el = document.getElementById('wiki-multi-structure-render')
      if (!el) {
        return
      }
      var dataTitle = structureDataTitleFromMountEl(el)
      if (dataTitle) {
        var jsonUrl = mw.util.getUrl(dataTitle, { action: 'raw' })
        $.getJSON(jsonUrl)
          .done(function (doc) {
            window.WikiMultiStructureRender.mount(el, {
              data: { document: doc },
            })
          })
          .fail(function (_jqXHR, textStatus, err) {
            console.warn('[WMR] 结构数据加载失败', dataTitle, textStatus, err)
          })
        return
      }
      var doc = window.__WMR_EMBED_DOCUMENT__
      if (!doc) {
        console.warn('[WMR] 请设置 div 的 data-wmr-structure，或 window.__WMR_EMBED_DOCUMENT__')
        return
      }
      window.WikiMultiStructureRender.mount(el, {
        data: { document: doc },
      })
    })
  }
  window.addEventListener('externalLibsLoaded', onExternalLibsLoaded, false)
})
