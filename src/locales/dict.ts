import { browser } from 'webextension-polyfill-ts'
import En from './en'
import Ru from './ru'

interface Translation {
  kind: "single" | "plural"
}

export class SingleTranslation implements Translation {
  kind: "single" | "plural" = "single"
  constructor(public message: string) {}
}

export class PluralTranslation implements Translation {
  kind: "single" | "plural" = "plural"
  constructor(
    public messages: string[],
    public plur: number[] | RegExp[]
  ) {}
}

// type Translation = SingleTranslation | PluralTranslation

export interface Locale {
  'bookmarks_select_folder.title': Translation,
  'bookmarks_select_folder.ok': Translation,
  'bookmarks_select_folder.cancel': Translation,
  'bookmarks_editor.name_bookmark_placeholder': Translation,
  'bookmarks_editor.name_folder_placeholder': Translation,
  'bookmarks_editor.url_placeholder': Translation,

  'btn.create': Translation,
  'btn.save': Translation,
  'btn.yes': Translation,
  'btn.no': Translation,
  'btn.cancel': Translation,

  'confirm.warn_title': Translation,
  'confirm.tabs_close_pre': Translation,
  'confirm.tabs_close_post': Translation,
  'confirm.bookmarks_delete': Translation,

  // --- General
  'dashboard.lock_panel_label': Translation,
  'dashboard.lock_panel_tooltip': Translation,
  'dashboard.lock_tabs_label': Translation,
  'dashboard.lock_tabs_tooltip': Translation,
  'dashboard.skip_on_switching': Translation,
  'dashboard.no_empty_label': Translation,
  'dashboard.no_empty_tooltip': Translation,
  'dashboard.new_tab_ctx': Translation,
  'dashboard.drop_tab_ctx': Translation,
  'dashboard.move_tab_ctx': Translation,
  'dashboard.move_tab_ctx_none': Translation,
  'dashboard.move_tab_ctx_nochild': Translation,
  'dashboard.url_rules': Translation,
  'container_dashboard.custom_icon_note': Translation,
  'panel_config.custom_icon': Translation,
  'panel_config.custom_icon_load': Translation,

  // --- Bookmarks
  'bookmarks_dashboard.title': Translation,
  'bookmarks_dashboard.reload_bookmarks_tree': Translation,
  'bookmarks_dashboard.collapse_all_folders': Translation,

  // --- Pinned tabs
  'tabs_dashboard.dedup_tabs': Translation,
  'tabs_dashboard.close_all_tabs': Translation,
  'tabs_dashboard.reload_all_tabs': Translation,
  'tabs_dashboard.delete_container': Translation,

  // --- Pinned tabs
  'pinned_dashboard.title': Translation,

  // --- Private tabs
  'private_dashboard.title': Translation,

  // --- Default tabs
  'default_dashboard.title': Translation,
  'default_dashboard.close_all_tabs': Translation,

  // --- Container
  'container_dashboard.name_placeholder': Translation,
  'container_dashboard.icon_label': Translation,
  'container_dashboard.color_label': Translation,
  'container_dashboard.proxy_label': Translation,
  'container_dashboard.proxy_host_placeholder': Translation,
  'container_dashboard.proxy_port_placeholder': Translation,
  'container_dashboard.proxy_username_placeholder': Translation,
  'container_dashboard.proxy_password_placeholder': Translation,
  'container_dashboard.proxy_dns_label': Translation,
  'container_dashboard.proxy_http': Translation,
  'container_dashboard.proxy_https': Translation,
  'container_dashboard.proxy_socks4': Translation,
  'container_dashboard.proxy_socks': Translation,
  'container_dashboard.proxy_direct': Translation,
  'container_dashboard.rules_include': Translation,
  'container_dashboard.rules_include_tooltip': Translation,
  'container_dashboard.rules_exclude': Translation,
  'container_dashboard.rules_exclude_tooltip': Translation,
  'container_dashboard.user_agent': Translation,

  // --- Bookmark
  'menu.bookmark.open_in_sub_menu_name': Translation,
  'menu.bookmark.open_in_new_window': Translation,
  'menu.bookmark.open_in_new_priv_window': Translation,
  'menu.bookmark.open_in_ctr_': Translation,
  'menu.bookmark.open_in_default_panel': Translation,
  'menu.bookmark.open_in_': Translation,
  'menu.bookmark.create_bookmark': Translation,
  'menu.bookmark.create_folder': Translation,
  'menu.bookmark.create_separator': Translation,
  'menu.bookmark.edit_bookmark': Translation,
  'menu.bookmark.delete_bookmark': Translation,
  'menu.bookmark.sort_by_name': Translation,
  'menu.bookmark.sort_by_link': Translation,
  'menu.bookmark.sort_by_time': Translation,

  // --- Bookmarks panel
  'menu.bookmark.collapse_all': Translation,

  // --- Tab
  'menu.tab.undo': Translation,
  'menu.tab.move_to_sub_menu_name': Translation,
  'menu.tab.move_to_new_window': Translation,
  'menu.tab.move_to_new_priv_window': Translation,
  'menu.tab.move_to_another_window': Translation,
  'menu.tab.move_to_window_': Translation,
  'menu.tab.move_to_panel_label': Translation,
  'menu.tab.move_to_panel_': Translation,
  'menu.tab.reopen_in_new_window': Translation,
  'menu.tab.reopen_in_new_norm_window': Translation,
  'menu.tab.reopen_in_new_priv_window': Translation,
  'menu.tab.reopen_in_norm_window': Translation,
  'menu.tab.reopen_in_priv_window': Translation,
  'menu.tab.reopen_in_window': Translation,
  'menu.tab.reopen_in_default_panel': Translation,
  'menu.tab.reopen_in_sub_menu_name': Translation,
  'menu.tab.reopen_in_ctr_': Translation,
  'menu.tab.reopen_in_': Translation,
  'menu.tab.reopen_in_window_': Translation,
  'menu.tab.group': Translation,
  'menu.tab.flatten': Translation,
  'menu.tab.pin': Translation,
  'menu.tab.unpin': Translation,
  'menu.tab.mute': Translation,
  'menu.tab.unmute': Translation,
  'menu.tab.clear_cookies': Translation,
  'menu.tab.discard': Translation,
  'menu.tab.bookmark': Translation,
  'menu.tab.bookmarks': Translation,
  'menu.tab.reload': Translation,
  'menu.tab.duplicate': Translation,
  'menu.tab.close': Translation,
  'menu.tab.close_descendants': Translation,
  'menu.tab.close_above': Translation,
  'menu.tab.close_below': Translation,
  'menu.tab.close_other': Translation,

  // --- Tabs panel
  'menu.tabs_panel.mute_all_audible': Translation,
  'menu.tabs_panel.dedup': Translation,
  'menu.tabs_panel.reload': Translation,
  'menu.tabs_panel.discard': Translation,
  'menu.tabs_panel.close': Translation,
  'menu.tabs_panel.collapse_inact_branches': Translation,
  'menu.tabs_panel.remove_panel': Translation,

  // --- Common ---
  'menu.copy_url': Translation,
  'menu.copy_urls': Translation,
  'menu.common.conf': Translation,

  // --- Editor
  'menu.editor.reset': Translation,
  'menu.editor.create_separator': Translation,
  'menu.editor.create_sub_tooltip': Translation,
  'menu.editor.up_tooltip': Translation,
  'menu.editor.down_tooltip': Translation,
  'menu.editor.disable_tooltip': Translation,
  'menu.editor.tabs_title': Translation,
  'menu.editor.tabs_panel_title': Translation,
  'menu.editor.bookmarks_title': Translation,
  'menu.editor.bookmarks_panel_title': Translation,
  'menu.editor.inline_group_title': Translation,
  'menu.editor.list_title': Translation,
  'menu.editor.disabled_title': Translation,

  'nav.show_hidden_tooltip': Translation,
  'nav.add_ctx_tooltip': Translation,
  'nav.add_panel_tooltip': Translation,
  'nav.settings_tooltip': Translation,

  'notif.hide_ctrl': Translation,
  'notif.undo_ctrl': Translation,
  'notif.tabs_rm_post': Translation,
  'notif.bookmarks_rm_post': Translation,
  'notif.bookmarks_sort': Translation,
  'notif.snapshot_created': Translation,
  'notif.view_snapshot': Translation,
  'notif.tabs_err': Translation,
  'notif.tabs_err_fix': Translation,
  'notif.tabs_reloading': Translation,
  'notif.tabs_reloading_stop': Translation,

  'settings.opt_true': Translation,
  'settings.opt_false': Translation,

  'settings.nav_settings': Translation,
  'settings.nav_settings_general': Translation,
  'settings.nav_settings_menu': Translation,
  'settings.nav_settings_nav': Translation,
  'settings.nav_settings_group': Translation,
  'settings.nav_settings_containers': Translation,
  'settings.nav_settings_panels': Translation,
  'settings.nav_settings_dnd': Translation,
  'settings.nav_settings_tabs': Translation,
  'settings.nav_settings_new_tab_position': Translation,
  'settings.nav_settings_pinned_tabs': Translation,
  'settings.nav_settings_tabs_tree': Translation,
  'settings.nav_settings_bookmarks': Translation,
  'settings.nav_settings_appearance': Translation,
  'settings.nav_settings_snapshots': Translation,
  'settings.nav_settings_mouse': Translation,
  'settings.nav_settings_keybindings': Translation,
  'settings.nav_settings_permissions': Translation,
  'settings.nav_settings_storage': Translation,
  'settings.nav_settings_sync': Translation,
  'settings.nav_settings_help': Translation,

  'settings.nav_menu': Translation,
  'settings.nav_menu_tabs': Translation,
  'settings.nav_menu_tabs_panel': Translation,
  'settings.nav_menu_bookmarks': Translation,
  'settings.nav_menu_bookmarks_panel': Translation,

  'settings.nav_styles': Translation,
  'settings.nav_snapshots': Translation,

  'settings.ctrl_copy': Translation,
  'settings.ctrl_close': Translation,

  // --- General
  'settings.general_title': Translation,
  'settings.native_scrollbars': Translation,
  'settings.sel_win_screenshots': Translation,
  'settings.tabs_check': Translation,
  'settings.tabs_fix': Translation,
  'settings.tabs_fix_reinit': Translation,
  'settings.tabs_fix_notify': Translation,
  'settings.tabs_fix_desc': Translation,
  'settings.state_storage': Translation,
  'settings.state_storage_global': Translation,
  'settings.state_storage_session': Translation,
  'settings.state_storage_desc': Translation,

  // --- Context menu
  'settings.ctx_menu_title': Translation,
  'settings.autoHide_ctx_menu': Translation,
  'settings.autoHide_ctx_menu_250': Translation,
  'settings.autoHide_ctx_menu_500': Translation,
  'settings.autoHide_ctx_menu_1000': Translation,
  'settings.autoHide_ctx_menu_none': Translation,
  'settings.ctx_menu_native': Translation,
  'settings.ctx_menu_render_inact': Translation,
  'settings.ctx_menu_ignore_ctr': Translation,
  'settings.ctx_menu_ignore_ctr_or': Translation,
  'settings.ctx_menu_ignore_ctr_note': Translation,
  'settings.ctx_menu_editor': Translation,

  // --- Navigation bar
  'settings.nav_title': Translation,
  'settings.nav_bar_layout': Translation,
  'settings.nav_bar_layout_horizontal': Translation,
  'settings.nav_bar_layout_vertical': Translation,
  'settings.nav_bar_layout_hidden': Translation,
  'settings.nav_bar_inline': Translation,
  'settings.hide_settings_btn': Translation,
  'settings.hide_add_btn': Translation,
  'settings.nav_btn_count': Translation,
  'settings.hide_empty_panels': Translation,
  'settings.nav_mid_click': Translation,
  'settings.nav_mid_click_rm_act_tab': Translation,
  'settings.nav_mid_click_rm_all': Translation,
  'settings.nav_mid_click_none': Translation,
  'settings.nav_switch_panels_wheel': Translation,

  // --- Group page
  'settings.group_title': Translation,
  'settings.group_layout': Translation,
  'settings.group_layout_grid': Translation,
  'settings.group_layout_list': Translation,

  // --- Containers
  'settings.containers_title': Translation,
  'settings.contianer_remove_confirm_prefix': Translation,
  'settings.contianer_remove_confirm_postfix': Translation,
  'settings.containers_create_btn': Translation,

  // --- Panels
  'settings.panels_title': Translation,
  'settings.panel_remove_confirm_1': Translation,
  'settings.panel_remove_confirm_2': Translation,
  'settings.panel_icon_custom': Translation,
  'settings.panels_create_btn': Translation,

  // --- Drag and drop
  'settings.dnd_title': Translation,
  'settings.dnd_tab_act': Translation,
  'settings.dnd_tab_act_delay': Translation,
  'settings.dnd_mod': Translation,
  'settings.dnd_mod_alt': Translation,
  'settings.dnd_mod_shift': Translation,
  'settings.dnd_mod_ctrl': Translation,
  'settings.dnd_mod_none': Translation,
  'settings.dnd_exp': Translation,
  'settings.dnd_exp_pointer': Translation,
  'settings.dnd_exp_hover': Translation,
  'settings.dnd_exp_none': Translation,
  'settings.dnd_exp_delay': Translation,

  // --- Tabs
  'settings.tabs_title': Translation,
  'settings.warn_on_multi_tab_close': Translation,
  'settings.warn_on_multi_tab_close_any': Translation,
  'settings.warn_on_multi_tab_close_collapsed': Translation,
  'settings.warn_on_multi_tab_close_none': Translation,
  'settings.activate_on_mouseup': Translation,
  'settings.activate_last_tab_on_panel_switching': Translation,
  'settings.skip_empty_panels': Translation,
  'settings.show_tab_rm_btn': Translation,
  'settings.show_tab_ctx': Translation,
  'settings.hide_inactive_panel_tabs': Translation,
  'settings.activate_after_closing': Translation,
  'settings.activate_after_closing_next': Translation,
  'settings.activate_after_closing_prev': Translation,
  'settings.activate_after_closing_prev_act': Translation,
  'settings.activate_after_closing_none': Translation,
  'settings.activate_after_closing_prev_rule': Translation,
  'settings.activate_after_closing_next_rule': Translation,
  'settings.activate_after_closing_rule_tree': Translation,
  'settings.activate_after_closing_rule_visible': Translation,
  'settings.activate_after_closing_rule_any': Translation,
  'settings.activate_after_closing_global': Translation,
  'settings.activate_after_closing_no_folded': Translation,
  'settings.activate_after_closing_no_discarded': Translation,
  'settings.shift_selection_from_active': Translation,
  'settings.ask_new_bookmark_place': Translation,
  'settings.tabs_rm_undo_note': Translation,
  'settings.native_highlight': Translation,
  'settings.tabs_unread_mark': Translation,
  'settings.tabs_reload_limit': Translation,
  'settings.tabs_reload_limit_notif': Translation,

  // --- New tab position
  'settings.new_tab_position': Translation,
  'settings.move_new_tab_pin': Translation,
  'settings.move_new_tab_pin_start': Translation,
  'settings.move_new_tab_pin_end': Translation,
  'settings.move_new_tab_pin_none': Translation,
  'settings.move_new_tab_parent': Translation,
  'settings.move_new_tab_parent_before': Translation,
  'settings.move_new_tab_parent_sibling': Translation,
  'settings.move_new_tab_parent_first_child': Translation,
  'settings.move_new_tab_parent_last_child': Translation,
  'settings.move_new_tab_parent_start': Translation,
  'settings.move_new_tab_parent_end': Translation,
  'settings.move_new_tab_parent_default': Translation,
  'settings.move_new_tab_parent_none': Translation,
  'settings.move_new_tab_parent_act_panel': Translation,
  'settings.move_new_tab': Translation,
  'settings.move_new_tab_start': Translation,
  'settings.move_new_tab_end': Translation,
  'settings.move_new_tab_before': Translation,
  'settings.move_new_tab_after': Translation,
  'settings.move_new_tab_first_child': Translation,
  'settings.move_new_tab_last_child': Translation,
  'settings.move_new_tab_none': Translation,

  // --- Pinned tabs
  'settings.pinned_tabs_title': Translation,
  'settings.pinned_tabs_position': Translation,
  'settings.pinned_tabs_position_top': Translation,
  'settings.pinned_tabs_position_left': Translation,
  'settings.pinned_tabs_position_right': Translation,
  'settings.pinned_tabs_position_bottom': Translation,
  'settings.pinned_tabs_position_panel': Translation,
  'settings.pinned_tabs_list': Translation,
  'settings.pinned_auto_group': Translation,

  // --- Tabs tree
  'settings.tabs_tree_title': Translation,
  'settings.tabs_tree_layout': Translation,
  'settings.group_on_open_layout': Translation,
  'settings.tabs_tree_limit': Translation,
  'settings.tabs_tree_limit_1': Translation,
  'settings.tabs_tree_limit_2': Translation,
  'settings.tabs_tree_limit_3': Translation,
  'settings.tabs_tree_limit_4': Translation,
  'settings.tabs_tree_limit_5': Translation,
  'settings.tabs_tree_limit_none': Translation,
  'settings.hide_folded_tabs': Translation,
  'settings.auto_fold_tabs': Translation,
  'settings.auto_fold_tabs_except': Translation,
  'settings.auto_fold_tabs_except_1': Translation,
  'settings.auto_fold_tabs_except_2': Translation,
  'settings.auto_fold_tabs_except_3': Translation,
  'settings.auto_fold_tabs_except_4': Translation,
  'settings.auto_fold_tabs_except_5': Translation,
  'settings.auto_fold_tabs_except_none': Translation,
  'settings.auto_exp_tabs': Translation,
  'settings.rm_child_tabs': Translation,
  'settings.rm_child_tabs_all': Translation,
  'settings.rm_child_tabs_folded': Translation,
  'settings.rm_child_tabs_none': Translation,
  'settings.tabs_child_count': Translation,
  'settings.tabs_lvl_dots': Translation,
  'settings.discard_folded': Translation,
  'settings.discard_folded_delay': Translation,
  'settings.discard_folded_delay_sec': Translation,
  'settings.discard_folded_delay_min': Translation,
  'settings.tabs_tree_bookmarks': Translation,
  'settings.tree_rm_outdent': Translation,
  'settings.tree_rm_outdent_branch': Translation,
  'settings.tree_rm_outdent_first_child': Translation,

  // --- Bookmarks
  'settings.bookmarks_title': Translation,
  'settings.bookmarks_panel': Translation,
  'settings.warn_on_multi_bookmark_delete': Translation,
  'settings.warn_on_multi_bookmark_delete_any': Translation,
  'settings.warn_on_multi_bookmark_delete_collapsed': Translation,
  'settings.warn_on_multi_bookmark_delete_none': Translation,
  'settings.open_bookmark_new_tab': Translation,
  'settings.mid_click_bookmark': Translation,
  'settings.mid_click_bookmark_open_new_tab': Translation,
  'settings.mid_click_bookmark_edit': Translation,
  'settings.mid_click_bookmark_delete': Translation,
  'settings.act_mid_click_tab': Translation,
  'settings.auto_close_bookmarks': Translation,
  'settings.auto_rm_other': Translation,
  'settings.show_bookmark_len': Translation,
  'settings.highlight_open_bookmarks': Translation,
  'settings.activate_open_bookmark_tab': Translation,
  'settings.bookmarks_rm_undo_note': Translation,
  'settings.fetch_bookmarks_favs': Translation,
  'settings.fetch_bookmarks_favs_stop': Translation,
  'settings.fetch_bookmarks_favs_done': Translation,
  'settings.fetch_bookmarks_favs_errors': Translation,

  // --- Appearance
  'settings.appearance_title': Translation,
  'settings.font_size': Translation,
  'settings.font_size_xxs': Translation,
  'settings.font_size_xs': Translation,
  'settings.font_size_s': Translation,
  'settings.font_size_m': Translation,
  'settings.font_size_l': Translation,
  'settings.font_size_xl': Translation,
  'settings.font_size_xxl': Translation,
  'settings.switch_style': Translation,
  'settings.style_dark': Translation,
  'settings.style_light': Translation,
  'settings.style_auto': Translation,
  'settings.theme': Translation,
  'settings.theme_default': Translation,
  'settings.theme_tactile': Translation,
  'settings.theme_none': Translation,
  'settings.bg_noise': Translation,
  'settings.animations': Translation,
  'settings.animation_speed': Translation,
  'settings.animation_speed_fast': Translation,
  'settings.animation_speed_norm': Translation,
  'settings.animation_speed_slow': Translation,
  'settings.edit_styles': Translation,
  'settings.edit_theme': Translation,
  'settings.appearance_notes_title': Translation,
  'settings.appearance_notes': Translation,

  // --- Snapshots
  'settings.snapshots_title': Translation,
  'settings.snap_notify': Translation,
  'settings.snap_exclude_private': Translation,
  'settings.snap_interval': Translation,
  'settings.snap_interval_min': Translation,
  'settings.snap_interval_hr': Translation,
  'settings.snap_interval_day': Translation,
  'settings.snap_interval_none': Translation,
  'settings.snap_limit': Translation,
  'settings.snap_limit_snap': Translation,
  'settings.snap_limit_kb': Translation,
  'settings.snap_limit_day': Translation,
  'settings.snapshots_view_label': Translation,
  'settings.make_snapshot': Translation,
  'settings.rm_all_snapshots': Translation,
  'settings.apply_snapshot': Translation,
  'settings.rm_snapshot': Translation,

  // --- Mouse
  'settings.mouse_title': Translation,
  'settings.h_scroll_through_panels': Translation,
  'settings.scroll_through_tabs': Translation,
  'settings.scroll_through_tabs_panel': Translation,
  'settings.scroll_through_tabs_global': Translation,
  'settings.scroll_through_tabs_none': Translation,
  'settings.scroll_through_visible_tabs': Translation,
  'settings.scroll_through_tabs_skip_discarded': Translation,
  'settings.scroll_through_tabs_except_overflow': Translation,
  'settings.scroll_through_tabs_cyclic': Translation,
  'settings.tab_double_click': Translation,
  'settings.tab_long_left_click': Translation,
  'settings.tab_long_right_click': Translation,
  'settings.tab_action_reload': Translation,
  'settings.tab_action_duplicate': Translation,
  'settings.tab_action_pin': Translation,
  'settings.tab_action_mute': Translation,
  'settings.tab_action_clear_cookies': Translation,
  'settings.tab_action_exp': Translation,
  'settings.tab_action_new_after': Translation,
  'settings.tab_action_new_child': Translation,
  'settings.tab_action_close': Translation,
  'settings.tab_action_none': Translation,
  'settings.tabs_panel_left_click_action': Translation,
  'settings.tabs_panel_double_click_action': Translation,
  'settings.tabs_panel_right_click_action': Translation,
  'settings.tabs_panel_middle_click_action': Translation,
  'settings.tabs_panel_action_tab': Translation,
  'settings.tabs_panel_action_prev': Translation,
  'settings.tabs_panel_action_next': Translation,
  'settings.tabs_panel_action_expand': Translation,
  'settings.tabs_panel_action_parent': Translation,
  'settings.tabs_panel_action_menu': Translation,
  'settings.tabs_panel_action_collapse': Translation,
  'settings.tabs_panel_action_undo': Translation,
  'settings.tabs_panel_action_rm_act_tab': Translation,
  'settings.tabs_panel_action_none': Translation,

  // --- Keybindings
  'settings.kb_title': Translation,
  'settings.kb_input': Translation,
  'settings.kb_err_duplicate': Translation,
  'settings.kb_err_invalid': Translation,
  'settings.reset_kb': Translation,
  'settings.toggle_kb': Translation,

  // --- Permissions
  'settings.permissions_title': Translation,
  'settings.all_urls_label': Translation,
  'settings.all_urls_info': Translation,
  'settings.tab_hide_label': Translation,
  'settings.tab_hide_info': Translation,
  'settings.clipboard_write_label': Translation,
  'settings.clipboard_write_info': Translation,
  'settings.web_request_blocking_label': Translation,
  'settings.web_request_blocking_info': Translation,

  // --- Storage
  'settings.storage_title': Translation,
  'settings.storage_delete_prop': Translation,
  'settings.storage_open_prop': Translation,
  'settings.storage_delete_confirm': Translation,
  'settings.update_storage_info': Translation,
  'settings.clear_storage_info': Translation,
  'settings.clear_storage_confirm': Translation,

  // --- Sync
  'settings.sync_title': Translation,
  'settings.sync_name': Translation,
  'settings.sync_name_or': Translation,
  'settings.sync_save_settings': Translation,
  'settings.sync_save_ctx_menu': Translation,
  'settings.sync_save_styles': Translation,
  'settings.sync_auto_apply': Translation,
  'settings.sync_settings_title': Translation,
  'settings.sync_ctx_menu_title': Translation,
  'settings.sync_styles_title': Translation,
  'settings.sync_apply_btn': Translation,
  'settings.sync_delete_btn': Translation,
  'settings.sync_update_btn': Translation,
  'settings.sync_apply_confirm': Translation,

  // --- Help
  'settings.help_title': Translation,
  'settings.debug_info': Translation,
  'settings.repo_issues': Translation,
  'settings.repo_issue': Translation,
  'settings.repo_bug': Translation,
  'settings.repo_feature': Translation,
  'settings.reset_settings': Translation,
  'settings.reset_confirm': Translation,
  'settings.ref_rm': Translation,
  'settings.help_exp_data': Translation,
  'settings.help_imp_data': Translation,
  'settings.help_imp_perm': Translation,
  'settings.export_title': Translation,
  'settings.import_title': Translation,
  'settings.export_containers': Translation,
  'settings.export_panels': Translation,
  'settings.export_settings': Translation,
  'settings.export_ctx_menu': Translation,
  'settings.export_styles': Translation,
  'settings.export_snapshots': Translation,
  'settings.export_select_all': Translation,
  'settings.reload_addon': Translation,
  'settings.mark_window': Translation,
  'settings.mark_window_preface': Translation,

  'snapshot.window_title': Translation,
  'snapshot.btn_open': Translation,
  'snapshot.btn_apply': Translation,
  'snapshot.btn_remove': Translation,
  'snapshot.btn_create_snapshot': Translation,
  'snapshot.snap_win': Translation,
  'snapshot.snap_ctr': Translation,
  'snapshot.snap_tab': Translation,

  // --- Common
  'styles.common_title': Translation,
  'styles.bg_color': Translation,
  'styles.title_color': Translation,
  'styles.sub_title_color': Translation,
  'styles.label_color': Translation,
  'styles.label_color_hover': Translation,
  'styles.label_color_active': Translation,
  'styles.info_color': Translation,
  'styles.true_color': Translation,
  'styles.false_color': Translation,
  'styles.active_color': Translation,
  'styles.inactive_color': Translation,
  'styles.favi_placeholder_color': Translation,

  // --- Buttons
  'styles.buttons_title': Translation,
  'styles.btn_bg_color': Translation,
  'styles.btn_bg_color_hover': Translation,
  'styles.btn_bg_color_active': Translation,
  'styles.btn_fg_color': Translation,
  'styles.btn_fg_color_hover': Translation,
  'styles.btn_fg_color_active': Translation,

  // --- Scroll Box
  'styles.scroll_box_title': Translation,
  'styles.scroll_progress_height': Translation,
  'styles.scroll_progress_color': Translation,

  // --- Context Menu
  'styles.menu_title': Translation,
  'styles.menu_font': Translation,
  'styles.menu_bg_color': Translation,
  'styles.menu_opt_fg_color': Translation,
  'styles.menu_opt_fg_color_hover': Translation,

  // --- Navigation Strip
  'styles.nav_title': Translation,
  'styles.nav_fg_color': Translation,
  'styles.nav_btn_width': Translation,
  'styles.nav_btn_height': Translation,

  // --- Pinned dock
  'styles.pinned_dock_title': Translation,
  'styles.pinned_dock_overlay_bg': Translation,
  'styles.pinned_dock_overlay_shadow': Translation,

  // --- Tabs
  'styles.tabs_title': Translation,
  'styles.tabs_height': Translation,
  'styles.tabs_pinned_width': Translation,
  'styles.tabs_pinned_height': Translation,
  'styles.tabs_indent': Translation,
  'styles.tabs_font': Translation,
  'styles.tabs_count_font': Translation,
  'styles.tabs_fg_color': Translation,
  'styles.tabs_fg_color_hover': Translation,
  'styles.tabs_fg_color_active': Translation,
  'styles.tabs_bg_color_hover': Translation,
  'styles.tabs_bg_color_active': Translation,
  'styles.tabs_active_bg_color': Translation,
  'styles.tabs_active_fg_color': Translation,
  'styles.tabs_selected_bg_color': Translation,
  'styles.tabs_selected_fg_color': Translation,
  'styles.tabs_border': Translation,
  'styles.tabs_activated_border': Translation,
  'styles.tabs_selected_border': Translation,
  'styles.tabs_shadow': Translation,
  'styles.tabs_activated_shadow': Translation,
  'styles.tabs_selected_shadow': Translation,
  'styles.tabs_lvl_indicator_bg': Translation,

  // --- Bookmarks
  'styles.bookmarks_title': Translation,
  'styles.bookmarks_bookmark_height': Translation,
  'styles.bookmarks_folder_height': Translation,
  'styles.bookmarks_separator_height': Translation,
  'styles.bookmarks_bookmark_font': Translation,
  'styles.bookmarks_folder_font': Translation,
  'styles.bookmarks_fg_color': Translation,
  'styles.bookmarks_fg_color_hover': Translation,
  'styles.bookmarks_fg_color_active': Translation,
  'styles.bookmarks_bg_color_hover': Translation,
  'styles.bookmarks_bg_color_active': Translation,
  'styles.bookmarks_closed_dir_fg_color': Translation,
  'styles.bookmarks_closed_dir_fg_color_hover': Translation,
  'styles.bookmarks_closed_dir_fg_color_active': Translation,
  'styles.bookmarks_open_dir_fg_color': Translation,
  'styles.bookmarks_open_dir_fg_color_hover': Translation,
  'styles.bookmarks_open_dir_fg_color_active': Translation,
  'styles.bookmarks_empty_dir_fg_color': Translation,
  'styles.bookmarks_open_fg_color': Translation,

  'styles.reset_styles': Translation,

  'styles.css_sidebar': Translation,
  'styles.css_group': Translation,
  'styles.css_placeholder': Translation,
  'styles.css_selectors_instruction': Translation,
}

interface LocaleMap {
  [lang: string]: Locale
}

const locales: LocaleMap = {
  en: { ...En },
  ru: { ...Ru },
}

let LANG = browser.i18n.getUILanguage().slice(0, 2)
let dict: Locale = LANG in locales ? locales[LANG as keyof typeof locales] : locales.en

/**
 *  Get dict value
 **/
export function translate(id: string, plurNum: number | string): string {
  if (!(id in dict)) {
    return id
  }
  let key = id as keyof typeof dict

  const record = dict[key]
  if (record instanceof SingleTranslation) {
      return record.message
  }
  if (record instanceof PluralTranslation) {
      let i
      for (i = 0; i < record.plur.length; i++) {
        let range = record.plur[i]
        if (range === plurNum) return record.messages[i]

          if (range instanceof Array && range[0] <= plurNum && range[1] >= plurNum) {
            return record.messages[i]
          }
          if (range.constructor === RegExp && range.test(plurNum.toString())) {
            return record.messages[i]
          }
      }
      return record.messages[i]
  } else {
    return id
  }
}
