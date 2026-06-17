// 结构工作台启动脚本：负责选择 Data 页面、加载稳定的 workbench CSS / JS，并提供可选全屏。
/* global $, mw, document, window */
(function () {
  function trim(s) {
    return String(s == null ? '' : s).replace(/^\s+|\s+$/g, '')
  }

  function normalizeDataTitle(raw) {
    var title = trim(raw)
    if (!title) return ''
    if (!/^Data:/i.test(title)) {
      title = 'Data:' + title.replace(/^:+/, '')
    }
    if (!/\.json$/i.test(title)) {
      title += '.json'
    }
    return title
  }

  function getQueryDataTitle() {
    var q = new URLSearchParams(window.location.search)
    return normalizeDataTitle(q.get('data') || q.get('page') || '')
  }

  function getExistingMountRoot() {
    return document.querySelector('.web-structure-workbench')
  }

  function getMode(root) {
    var mode = root ? trim(root.getAttribute('data-wsw-mode') || '') : ''
    return mode.toLowerCase() === 'mini' ? 'mini' : 'full'
  }

  function loadRawPage(title, ctype) {
    return mw.util.getUrl(title, {
      action: 'raw',
      ctype: ctype,
    })
  }

  function loadCssOnce() {
    if (document.querySelector('link[data-wsw-css]')) return
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = loadRawPage('零件:StructureWorkbench.css', 'text/css')
    link.setAttribute('data-wsw-css', '1')
    document.head.appendChild(link)
  }

  function loadShellCssOnce() {
    if (document.querySelector('style[data-wsw-shell-css]')) return
    var style = document.createElement('style')
    style.setAttribute('data-wsw-shell-css', '1')
    style.textContent = [
      '.wsw-mini{width:320px;}',
      '.wsw-mini__bar{display:flex;align-items:center;gap:8px;min-height:56px;padding:8px 10px;border:1px solid #334155;border-radius:8px;background:#0f172a;box-shadow:0 10px 30px rgba(15,23,42,.35);cursor:move;user-select:none;color:#e5e7eb;}',
      '.wsw-mini__title{font:700 13px system-ui,sans-serif;color:#f8fafc;white-space:nowrap;}',
      '.wsw-mini__meta{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#94a3b8;font:12px system-ui,sans-serif;}',
      '.wsw-mini__btn{flex:0 0 auto;padding:4px 10px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:12px;}',
      '.wsw-mini__bar:active{cursor:grabbing;}',
      '.wsw-shell{position:fixed;inset:0;z-index:3999;display:flex;flex-direction:column;background:#111827;color:#e5e7eb;}',
      '.wsw-shell__bar{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:6px 10px;background:#0f172a;border-bottom:1px solid #334155;font:12px system-ui,sans-serif;}',
      '.wsw-shell__title{font-weight:700;color:#f8fafc;}',
      '.wsw-shell__meta{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#94a3b8;}',
      '.wsw-shell__btn,.wsw-picker__btn{padding:4px 10px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:12px;}',
      '.wsw-shell__app{flex:1;min-height:0;overflow:hidden;}',
      '.wsw-picker{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:#111827;color:#e5e7eb;font:14px system-ui,sans-serif;}',
      '.wsw-picker__row{display:flex;gap:8px;align-items:center;width:min(760px,calc(100vw - 32px));}',
      '.wsw-picker__label{font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;}',
      '.wsw-picker__input{flex:1;min-width:0;padding:8px 10px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;font:14px ui-monospace,monospace;}',
      '.wsw-error{margin:0;padding:20px;color:#fecaca;white-space:pre-wrap;}',
    ].join('')
    document.head.appendChild(style)
  }

  function createFullShell(dataTitle, buttonLabel) {
    var shell = document.createElement('div')
    shell.className = 'wsw-shell'
    shell.innerHTML = [
      '<div class="wsw-shell__bar">',
      '<div class="wsw-shell__title">Structure Workbench</div>',
      '<div class="wsw-shell__meta"></div>',
      '<button type="button" class="wsw-shell__btn" data-wsw-fullscreen>Fullscreen</button>',
      '</div>',
      '<div id="wsr-workbench-app" class="wsw-shell__app"></div>',
    ].join('')
    shell.querySelector('[data-wsw-fullscreen]').textContent = buttonLabel || 'Fullscreen'
    shell.querySelector('.wsw-shell__meta').textContent = dataTitle ? dataTitle : ''
    return shell
  }

  function createMiniLauncher(dataTitle) {
    var launcher = document.createElement('div')
    launcher.className = 'wsw-mini'
    launcher.innerHTML = [
      '<div class="wsw-mini__bar" data-wsw-drag-handle="1">',
      '<div class="wsw-mini__title">Structure Workbench</div>',
      '<div class="wsw-mini__meta"></div>',
      '<button type="button" class="wsw-mini__btn" data-wsw-expand>全屏</button>',
      '</div>',
    ].join('')
    launcher.querySelector('.wsw-mini__meta').textContent = dataTitle ? dataTitle : ''
    return launcher
  }

  function ensureSelector(root) {
    var box = document.createElement('div')
    box.className = 'wsw-picker'
    box.innerHTML = [
      '<div class="wsw-picker__label">Data 页面</div>',
      '<div class="wsw-picker__row">',
      '<input class="wsw-picker__input" type="text" placeholder="Data:Structures/Example.json" />',
      '<button type="button" class="wsw-picker__btn">打开</button>',
      '</div>',
    ].join('')
    root.innerHTML = ''
    root.appendChild(box)
    var input = box.querySelector('.wsw-picker__input')
    var button = box.querySelector('.wsw-picker__btn')
    function go() {
      var title = normalizeDataTitle(input.value)
      if (!title) return
      var url = new URL(window.location.href)
      url.searchParams.set('data', title)
      window.location.href = url.toString()
    }
    button.onclick = go
    input.onkeydown = function (e) {
      if (e.key === 'Enter') {
        go()
      }
    }
  }

  function loadWorkbenchBundle(shell) {
    if (!shell || document.querySelector('script[data-wsw-bundle]')) {
      return
    }
    var script = document.createElement('script')
    script.type = 'module'
    script.src = loadRawPage('零件:StructureWorkbench.bundle.js', 'text/javascript')
    script.setAttribute('data-wsw-bundle', '1')
    script.onload = function () {
      shell.setAttribute('data-wsw-bundle-loaded', '1')
    }
    script.onerror = function () {
      var shellBox = shell.querySelector('.wsw-shell')
      if (shellBox) {
        shellBox.innerHTML = '<pre class="wsw-error">Failed to load workbench bundle.</pre>'
      }
    }
    document.head.appendChild(script)
  }

  function mountFullWorkbench(root, dataTitle) {
    window.__WSR_WORKBENCH_DATA_TITLE__ = dataTitle
    loadShellCssOnce()
    var shell = createFullShell(dataTitle, 'Fullscreen')
    root.innerHTML = ''
    root.appendChild(shell)
    loadCssOnce()
    loadWorkbenchBundle(shell)
    shell.querySelector('[data-wsw-fullscreen]').onclick = function () {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(function () {})
        return
      }
      if (shell.requestFullscreen) {
        shell.requestFullscreen().catch(function () {})
      }
    }
    return shell
  }

  function mountMiniWorkbench(root, dataTitle) {
    window.__WSR_WORKBENCH_DATA_TITLE__ = dataTitle
    loadShellCssOnce()
    root.innerHTML = ''
    root.style.position = 'fixed'
    root.style.left = root.style.left || '24px'
    root.style.top = root.style.top || '24px'
    root.style.width = '320px'
    root.style.zIndex = '3999'
    var launcher = createMiniLauncher(dataTitle)
    var shell = createFullShell(dataTitle, '小窗')
    shell.style.display = 'none'
    root.appendChild(launcher)
    root.appendChild(shell)

    var positionState = {
      dragging: false,
      startX: 0,
      startY: 0,
      startLeft: 24,
      startTop: 24,
    }

    function savePosition() {
      try {
        localStorage.setItem('wsw-mini-left', String(Math.round(parseInt(root.style.left, 10) || 24)))
        localStorage.setItem('wsw-mini-top', String(Math.round(parseInt(root.style.top, 10) || 24)))
      } catch (e) {}
    }

    function restorePosition() {
      try {
        var left = parseInt(localStorage.getItem('wsw-mini-left') || '24', 10)
        var top = parseInt(localStorage.getItem('wsw-mini-top') || '24', 10)
        if (isFinite(left)) root.style.left = left + 'px'
        if (isFinite(top)) root.style.top = top + 'px'
      } catch (e) {}
    }

    restorePosition()

    function setExpanded(expanded) {
      shell.style.display = expanded ? 'flex' : 'none'
      launcher.style.display = expanded ? 'none' : 'block'
      if (!expanded) {
        shell.querySelector('[data-wsw-fullscreen]').textContent = '小窗'
      }
    }

    function requestFull() {
      setExpanded(true)
      loadCssOnce()
      loadWorkbenchBundle(shell)
      if (shell.requestFullscreen) {
        shell.requestFullscreen().catch(function () {})
      }
    }

    function exitFull() {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(function () {})
      } else {
        setExpanded(false)
      }
    }

    launcher.querySelector('[data-wsw-expand]').onclick = requestFull
    shell.querySelector('[data-wsw-fullscreen]').onclick = exitFull

    var dragHandle = launcher.querySelector('[data-wsw-drag-handle]')
    dragHandle.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('button')) {
        return
      }
      positionState.dragging = true
      positionState.startX = e.clientX
      positionState.startY = e.clientY
      positionState.startLeft = parseInt(root.style.left || '24', 10) || 24
      positionState.startTop = parseInt(root.style.top || '24', 10) || 24
      dragHandle.setPointerCapture(e.pointerId)
      e.preventDefault()
    })
    dragHandle.addEventListener('pointermove', function (e) {
      if (!positionState.dragging) {
        return
      }
      var nextLeft = positionState.startLeft + (e.clientX - positionState.startX)
      var nextTop = positionState.startTop + (e.clientY - positionState.startY)
      root.style.left = Math.max(8, nextLeft) + 'px'
      root.style.top = Math.max(8, nextTop) + 'px'
    })
    dragHandle.addEventListener('pointerup', function () {
      if (!positionState.dragging) return
      positionState.dragging = false
      savePosition()
    })
    dragHandle.addEventListener('pointercancel', function () {
      if (!positionState.dragging) return
      positionState.dragging = false
      savePosition()
    })

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) {
        setExpanded(false)
      }
    })
  }

  $(function () {
    var root = getExistingMountRoot()
    if (!root) {
      return
    }
    var mode = getMode(root)
    var dataTitle = normalizeDataTitle(root.getAttribute('data-wsw-data') || getQueryDataTitle() || window.__WSR_WORKBENCH_DATA_TITLE__ || '')
    if (mode === 'mini') {
      mountMiniWorkbench(root, dataTitle)
      return
    }
    if (!dataTitle) {
      loadShellCssOnce()
      ensureSelector(root)
      return
    }
    mountFullWorkbench(root, dataTitle)
  })
})()
