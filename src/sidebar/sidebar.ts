import * as Vue from 'vue'
import EventBus, { initMsgHandling } from '../event-bus'
import { initActionsMixin } from '../mixins/act'
import Dict from '../mixins/dict'
import Actions, { injectInActions } from './actions'
import Handlers, { injectInHandlers } from './handlers'
import Sidebar from './sidebar.vue'
import Store from './store'
import State from './store/state'

const GLOB_CTX = {
  getters: Store.getters,
  state: State,
  actions: Actions,
  handlers: Handlers,
  eventBus: EventBus,
}

injectInActions(GLOB_CTX)
injectInHandlers(GLOB_CTX)

if (!State.tabsMap) State.tabsMap = []

initMsgHandling(State, Actions)

export default Vue.createApp({
  el: '#root',
  store: Store,

  mixins: [Dict, initActionsMixin(Actions)],

  components: {
    Sidebar,
  },

  data() {
    return {}
  },

  computed: {
    pinnedTabsPosition() {
      if (!Store.getters.pinnedTabs.length) return 'none'
      return State.pinnedTabsPosition
    },

    animations() {
      if (!Store.state.animations) return 'none'
      else return Store.state.animationSpeed || 'fast'
    },
  },

  async created() {
    State.instanceType = 'sidebar'

    Actions.infoLog('Initialization start')

    await Promise.all([Actions.loadWindowInfo(), Actions.loadSettings(), Actions.loadContainers()])

    Handlers.setupWindowsListeners()
    Handlers.setupContainersListeners()
    Handlers.setupStorageListeners()
    Handlers.setupHandlers()

    if (State.theme !== 'default') Actions.initTheme()
    if (State.bgNoise) Actions.applyNoiseBg()
    if (State.sidebarCSS) Actions.loadCustomCSS()

    await Actions.loadPanels()

    if (State.bookmarksPanel) {
      if (State.panels[State.panelIndex].bookmarks) {
        await Actions.loadBookmarks()
      }
      Handlers.setupBookmarksListeners()
    }

    if (State.stateStorage === 'global') await Actions.loadTabsFromGlobalStorage()
    if (State.stateStorage === 'session') await Actions.loadTabsFromSessionStorage()
    Handlers.setupTabsListeners()

    Actions.loadKeybindings()
    Handlers.setupKeybindingListeners()

    Actions.loadCtxMenu()
    Actions.loadCSSVars()
    Actions.scrollToActiveTab()
    Actions.loadFavicons()
    Actions.loadPermissions(true)
    Actions.updateTabsVisability()
    if (State.stateStorage === 'global') Actions.saveTabsData()
    if (State.stateStorage === 'session') Actions.saveGroups()

    Actions.updateActiveGroupPage()
    Actions.connectToBG()
  },

  mounted() {
    Actions.updateSidebarWidth()
    Actions.updateFontSize()
    Store.watch(Object.getOwnPropertyDescriptor(State, 'fontSize').get, function() {
      Actions.updateFontSize()
    })
  },

  beforeDestroy() {
    Handlers.resetContainersListeners()
    Handlers.resetTabsListeners()
    Handlers.resetBookmarksListeners()
    Handlers.resetWindowsListeners()
    Handlers.resetStorageListeners()
    Handlers.resetKeybindingListeners()
    Handlers.resetHandlers()
  },
})
