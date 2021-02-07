import {
  BOOKMARKS_PANEL_STATE,
  DEFAULT_PANEL_STATE,
  TABS_PANEL_STATE,
  BOOKMARKS_PANEL,
  DEFAULT_TABS_PANEL,
  DEFAULT_CTX,
  TABS_PANEL,
} from '../defaults'

/**
 * Normalize panels and put them to state
 */
async function loadPanels() {
  let saveNeeded = false
  let storage = await browser.storage.local.get({ panels_v4: null, panelIndex: null })
  let panels = storage.panels_v4 ? storage.panels_v4 : []

  // Check if default panels are present
  let bookmarksPanelIndex = panels.findIndex(p => p.type === 'bookmarks')
  let defaultPanelIndex = panels.findIndex(p => p.type === 'default')
  if (bookmarksPanelIndex === -1 && this.state.bookmarksPanel) {
    panels.unshift(Utils.deepClone(BOOKMARKS_PANEL_STATE))
    bookmarksPanelIndex = 0
  }
  if (defaultPanelIndex === -1) {
    let defaultPanelClone = Utils.deepClone(DEFAULT_PANEL_STATE)
    panels.splice(bookmarksPanelIndex + 1, 0, defaultPanelClone)
    defaultPanelIndex = 1
  }

  // Normalize
  let panelDefs
  let panelsMap = {}
  let normPanels = []
  for (let i = 0; i < panels.length; i++) {
    let panel
    let loadedPanel = panels[i]

    if (loadedPanel.type === 'bookmarks') panelDefs = BOOKMARKS_PANEL_STATE
    else if (loadedPanel.type === 'default') panelDefs = DEFAULT_PANEL_STATE
    else if (loadedPanel.type === 'tabs') panelDefs = TABS_PANEL_STATE
    else continue

    panel = Utils.normalizeObject(loadedPanel, panelDefs)

    panel.index = i
    if (!panel.id) panel.id = Utils.uid()

    if (panel.urlRulesActive && panel.urlRules) {
      this.actions.parsePanelUrlRules(panel)
    }

    if (
      panel.newTabCtx !== 'none' &&
      panel.newTabCtx !== DEFAULT_CTX &&
      !this.state.containers[panel.newTabCtx]
    ) {
      panel.newTabCtx = 'none'
    }
    if (
      panel.moveTabCtx !== 'none' &&
      panel.newTabCtx !== DEFAULT_CTX &&
      !this.state.containers[panel.moveTabCtx]
    ) {
      panel.moveTabCtx = 'none'
    }

    normPanels.push(panel)
    panelsMap[panel.id] = panel
  }

  // Setup panel index
  if (!this.state.private) {
    let actPanel = normPanels[storage.panelIndex]
    if (actPanel) this.state.panelIndex = storage.panelIndex
    else this.state.panelIndex = defaultPanelIndex
    this.state.lastPanelIndex = this.state.panelIndex
  }

  this.state.panels = normPanels
  this.state.panelsMap = panelsMap
  this.actions.infoLog('Panels loaded')

  if (saveNeeded) this.actions.savePanels()
}

function parsePanelUrlRules(panel) {
  if (!this.state.urlRules) this.state.urlRules = []

  for (let rawRule of panel.urlRules.split('\n')) {
    let rule = rawRule.trim()
    if (!rule) continue

    if (rule[0] === '/' && rule[rule.length - 1] === '/') {
      try {
        rule = new RegExp(rule.slice(1, rule.length - 1))
      } catch (err) {
        continue
      }
    }

    this.state.urlRules.push({ panelId: panel.id, value: rule })
  }
}

/**
 * Clean up panels info and save them
 */
async function savePanels() {
  let output = []
  let panelDefs
  for (let panel of this.state.panels) {
    if (panel.type === 'bookmarks') panelDefs = BOOKMARKS_PANEL
    else if (panel.type === 'default') panelDefs = DEFAULT_TABS_PANEL
    else if (panel.type === 'tabs') panelDefs = TABS_PANEL

    output.push(Utils.normalizeObject(panel, panelDefs))
  }
  browser.storage.local.set({ panels_v4: output })
}
function savePanelsDebounced(delay = 500) {
  if (this._savePanelsTimeout) clearTimeout(this._savePanelsTimeout)
  this._savePanelsTimeout = setTimeout(() => this.actions.savePanels(), delay)
}

export default {
  loadPanels,
  parsePanelUrlRules,
  savePanels,
  savePanelsDebounced,
}
