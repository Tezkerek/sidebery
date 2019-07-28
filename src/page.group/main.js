import { DEFAULT_SETTINGS, CUSTOM_CSS_VARS } from '../defaults'
import { noiseBg } from '../noise-bg'
import Utils from '../utils'

void (async function() {
  let { settings } = await browser.storage.local.get({ settings: DEFAULT_SETTINGS })

  document.body.setAttribute('data-style', settings.style)
  document.body.setAttribute('data-layout', settings.groupLayout)
  document.body.setAttribute('data-animations', settings.animations ? 'fast' : 'none')

  if (settings.bgNoise) {
    noiseBg(document.body, {
      width: 300,
      height: 300,
      gray: [12, 175],
      alpha: [0, 66],
      spread: [0, 9],
    })
    let scaleShift = ~~window.devicePixelRatio
    let sW = 300 >> scaleShift
    let sH = 300 >> scaleShift
    document.body.style.backgroundSize = `${sW}px ${sH}px`
  }

  // Set user styles
  let { cssVars } = await browser.storage.local.get({ cssVars: {} })
  for (let key in CUSTOM_CSS_VARS) {
    if (!CUSTOM_CSS_VARS.hasOwnProperty(key)) continue
    if (cssVars[key]) {
      document.body.style.setProperty(Utils.toCSSVarName(key), cssVars[key])
    }
  }

  // Load current window and get url-hash
  const win = await browser.windows.getCurrent()
  const hash = decodeURI(window.location.hash.slice(1))

  // Init page
  let lastState
  lastState = await init(win.id, hash, lastState)

  // Set listener for reinit request
  browser.runtime.onMessage.addListener(msg => {
    if (msg.windowId !== undefined && msg.windowId !== win.id) return

    const hash = decodeURI(window.location.hash.slice(1))
    if (msg.name === 'reinit_group' && decodeURI(msg.arg) === hash) {
      init(win.id, hash, lastState).then(state => (lastState = state))
    }
  })
})()

/**
 * Init group page
 */
async function init(windowId, hash, lastState) {
  // Set title of group page
  const titleEl = document.getElementById('title')
  const hashData = hash.split(':id:')
  const title = hashData[0]
  const groupId = hashData[1]
  titleEl.value = title
  document.title = title

  // Listen chagnes of title
  titleEl.addEventListener('input', e => {
    const normTitle = e.target.value.trim()
    document.title = normTitle
    window.location.hash = `#${encodeURI(normTitle)}:id:${groupId}`
  })

  // Get list of tabs
  const groupInfo = await browser.runtime.sendMessage({
    action: 'getGroupInfo',
    windowId,
    arg: hash,
  })
  if (!groupInfo || !groupInfo.tabs) return lastState

  // Check for changes
  const checkSum = groupInfo.tabs.map(t => {
    return [t.title, t.url, t.discarded]
  })
  const checkSumStr = JSON.stringify(checkSum)
  if (lastState === checkSumStr) return checkSumStr

  const tabsBoxEl = document.getElementById('tabs')

  if (groupInfo && groupInfo.tabs) {

    // Cleanup
    while (tabsBoxEl.lastChild) {
      tabsBoxEl.removeChild(tabsBoxEl.lastChild)
    }

    for (let info of groupInfo.tabs) {
      info.el = createTabEl(info)
      tabsBoxEl.appendChild(info.el)

      // Set click listeners
      info.el.addEventListener('click', async () => {
        await browser.runtime.sendMessage({
          action: 'expTabsBranch',
          arg: groupInfo.id,
        })
        browser.tabs.update(info.id, { active: true })
      })
    }
  }

  let newTabEl = document.createElement('div')
  newTabEl.classList.add('new-tab')
  newTabEl.setAttribute('title', 'Create new tab')
  tabsBoxEl.appendChild(newTabEl)
  newTabEl.addEventListener('click', () => {
    let lastTab = groupInfo.tabs[groupInfo.tabs.length - 1]
    if (lastTab === undefined) lastTab = groupInfo.index
    browser.tabs.create({
      index: lastTab.index + 1,
      openerTabId: groupInfo.id,
    })
  })

  // Load screens
  loadScreens(groupInfo.tabs)

  return checkSumStr
}

/**
 * Create tab element
 */
function createTabEl(info) {
  info.tabEl = document.createElement('div')
  info.tabEl.classList.add('tab')
  info.tabEl.title = info.url
  info.tabEl.setAttribute('data-lvl', info.lvl)

  info.bgEl = document.createElement('div')
  info.bgEl.classList.add('bg')
  info.tabEl.appendChild(info.bgEl)

  if (info.favIconUrl) {
    let favEl = document.createElement('div')
    favEl.classList.add('fav')
    favEl.style.backgroundImage = `url(${info.favIconUrl})`
    info.tabEl.appendChild(favEl)
  }

  let infoEl = document.createElement('div')
  infoEl.classList.add('info')
  info.tabEl.appendChild(infoEl)

  let titleEl = document.createElement('h3')
  titleEl.classList.add('tab-title')
  titleEl.innerText = info.title
  infoEl.appendChild(titleEl)

  let urlEl = document.createElement('p')
  urlEl.classList.add('tab-url')
  urlEl.innerText = info.url
  infoEl.appendChild(urlEl)

  let ctrlsEl = document.createElement('div')
  ctrlsEl.classList.add('ctrls')
  info.tabEl.appendChild(ctrlsEl)

  if (!info.url.startsWith('about:')) {
    let discardBtnEl = createButton('icon_discard', 'discard-btn', event => {
      event.stopPropagation()
      browser.tabs.discard(info.id)
      info.tabEl.classList.add('-discarded')
    })
    ctrlsEl.appendChild(discardBtnEl)
  }

  let reloadBtnEl = createButton('icon_reload', 'reload-btn', event => {
    event.stopPropagation()
    browser.tabs.reload(info.id)
  })
  ctrlsEl.appendChild(reloadBtnEl)

  let closeBtnEl = createButton('icon_close', 'close-btn', event => {
    event.stopPropagation()
    browser.tabs.remove(info.id)
    info.tabEl.style.display = 'none'
  })
  ctrlsEl.appendChild(closeBtnEl)

  return info.tabEl
}

/**
 * Create button element
 */
function createButton(svgId, className, clickHandler) {
  let btnEl = document.createElement('div')
  btnEl.classList.add('btn', className)

  let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')  
  svgEl.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
  btnEl.appendChild(svgEl)

  let useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use')  
  useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + svgId)
  svgEl.appendChild(useEl)

  btnEl.addEventListener('click', clickHandler)

  return btnEl
}

/**
 * Load screenshots
 */
function loadScreens(tabs) {
  for (let tab of tabs) {
    if (tab.discarded) {
      tab.tabEl.classList.add('-discarded')
      continue
    }

    browser.tabs.captureTab(tab.id, { format: 'jpeg', quality: 90 }).then(screen => {
      tab.bgEl.style.backgroundImage = `url(${screen})`
    })
  }
}
