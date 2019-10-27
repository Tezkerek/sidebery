/**
 * Handle changes of all storages (update current state)
 */
function onChangeStorage(changes, type) {
  if (type !== 'local') return

  if (changes.settings) {
    this.actions.updateSettings(changes.settings.newValue)
  }
  if (changes.cssVars) {
    this.actions.applyCSSVars(changes.cssVars.newValue)
  }
  if (changes.containers && !this.state.private) {
    this.actions.updateContainers(changes.containers.newValue)
  }
  if (changes.panels && !this.state.private) {
    this.actions.updatePanels(changes.panels.newValue)
  }
  if (changes.tabsMenu) {
    this.state.tabsMenu = changes.tabsMenu.newValue
  }
  if (changes.tabsPanelMenu) {
    this.state.tabsPanelMenu = changes.tabsPanelMenu.newValue
  }
  if (changes.bookmarksMenu) {
    this.state.bookmarksMenu = changes.bookmarksMenu.newValue
  }
  if (changes.bookmarksPanelMenu) {
    this.state.bookmarksPanelMenu = changes.bookmarksPanelMenu.newValue
  }
  if (changes.sidebarCSS) {
    this.actions.applyCustomCSS(changes.sidebarCSS.newValue)
  }
}

/**
 * Setup listeners
 */
function setupStorageListeners() {
  browser.storage.onChanged.addListener(this.handlers.onChangeStorage)
}

/**
 * Setup listeners
 */
function resetStorageListeners() {
  browser.storage.onChanged.removeListener(this.handlers.onChangeStorage)
}

export default {
  onChangeStorage,
  setupStorageListeners,
  resetStorageListeners,
}