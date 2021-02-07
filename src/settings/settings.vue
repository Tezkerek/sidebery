<template lang="pug">
.Settings(@scroll.passive="onScroll")
  GeneralSection(ref="settings_general")
  MenuSection(ref="settings_menu")
  NavbarSection(ref="settings_nav")
  GroupSection(ref="settings_group")
  ContainersSection(ref="settings_containers")
  PanelsSection(ref="settings_panels")
  DndSection(ref="settings_dnd")
  TabsSection(ref="settings_tabs")
  NewTabPositionSection(ref="settings_new_tab_position")
  PinnedTabsSection(ref="settings_pinned_tabs")
  TabsTreeSection(ref="settings_tabs_tree")
  BookmarksSection(ref="settings_bookmarks")
  AppearanceSection(ref="settings_appearance")
  MouseSection(ref="settings_mouse")
  KeybindingsSection(ref="settings_keybindings")
  PermissionsSection(ref="settings_permissions")
  SnapshotsSection(ref="settings_snapshots")
  StorageSection(ref="settings_storage")
  SyncSection(ref="settings_sync")
  HelpSection(ref="settings_help")

  .details-box(v-if="$store.state.dbgDetails" @wheel="onDbgWheel")
    .box
      .btn(@click="copyDetails") {{t('settings.ctrl_copy')}}
      .btn.-warn(@click="$store.state.dbgDetails = ''") {{t('settings.ctrl_close')}}
    .json {{$store.state.dbgDetails}}

  FooterSection
</template>

<script lang="ts">
import State from './store/state'
import GeneralSection from './components/settings.general.vue'
import MenuSection from './components/settings.menu.vue'
import NavbarSection from './components/settings.navbar.vue'
import GroupSection from './components/settings.group.vue'
import ContainersSection from './components/settings.containers.vue'
import PanelsSection from './components/settings.panels.vue'
import DndSection from './components/settings.dnd.vue'
import TabsSection from './components/settings.tabs.vue'
import NewTabPositionSection from './components/settings.new-tab-position.vue'
import PinnedTabsSection from './components/settings.pinned-tabs.vue'
import TabsTreeSection from './components/settings.tabs-tree.vue'
import BookmarksSection from './components/settings.bookmarks.vue'
import AppearanceSection from './components/settings.appearance.vue'
import MouseSection from './components/settings.mouse.vue'
import KeybindingsSection from './components/settings.keybindings.vue'
import PermissionsSection from './components/settings.permissions.vue'
import SnapshotsSection from './components/settings.snapshots.vue'
import StorageSection from './components/settings.storage.vue'
import SyncSection from './components/settings.sync.vue'
import HelpSection from './components/settings.help.vue'
import FooterSection from './components/footer.vue'

const SECTIONS = [
  'settings_general',
  'settings_menu',
  'settings_nav',
  'settings_group',
  'settings_containers',
  'settings_panels',
  'settings_dnd',
  'settings_tabs',
  'settings_new_tab_position',
  'settings_pinned_tabs',
  'settings_tabs_tree',
  'settings_bookmarks',
  'settings_appearance',
  'settings_mouse',
  'settings_keybindings',
  'settings_permissions',
  'settings_snapshots',
  'settings_storage',
  'settings_sync',
  'settings_help',
]

export default {
  components: {
    GeneralSection,
    MenuSection,
    NavbarSection,
    GroupSection,
    ContainersSection,
    PanelsSection,
    DndSection,
    TabsSection,
    NewTabPositionSection,
    PinnedTabsSection,
    TabsTreeSection,
    BookmarksSection,
    AppearanceSection,
    MouseSection,
    KeybindingsSection,
    PermissionsSection,
    SnapshotsSection,
    StorageSection,
    SyncSection,
    HelpSection,
    FooterSection,
  },

  data() {
    return { scrollY: 0 }
  },

  computed: {
    activateAfterClosingNextOrPrev() {
      return State.activateAfterClosing === 'next' || State.activateAfterClosing === 'prev'
    },
  },

  mounted() {
    State.settingsRefs = this.$refs
  },

  activated() {
    if (this.scrollY) this.$el.scrollTop = this.scrollY
  },

  methods: {
    /**
     * Handle scroll event
     */
    onScroll(e) {
      this.scrollY = e.target.scrollTop

      if (State.navLock) return

      for (let name, section, i = SECTIONS.length; i--; ) {
        name = SECTIONS[i]
        section = this.$refs[name]
        if (!section) break
        if (section._isVue) section = section.$el

        if (e.target.scrollTop >= section.offsetTop - 8) {
          State.activeSection = name
          break
        }
      }
    },

    /**
     * Block scrolling the main page when debug info showed.
     */
    onDbgWheel(e) {
      let scrollOffset = e.target.parentNode.scrollTop
      let maxScrollOffset = e.target.scrollHeight - e.target.parentNode.offsetHeight
      if (scrollOffset === 0 && e.deltaY < 0) e.preventDefault()
      if (scrollOffset === maxScrollOffset && e.deltaY > 0) e.preventDefault()
    },

    /**
     * Copy debug info
     */
    copyDetails() {
      if (!State.dbgDetails) return
      navigator.clipboard.writeText(State.dbgDetails)
    },
  },
}
</script>
