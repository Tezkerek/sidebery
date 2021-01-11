import { browser } from 'webextension-polyfill-ts';
const ALPH = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_',
];
const UNDERSCORE_RE = /_/g;
const CSS_NUM_RE = /([\d.]+)(\w*)/;
const URL_RE = /^https?:\/\/.+/;
const GROUP_URL = browser.runtime.getURL('/group/group.html');
export function uid() {
    let tp = Date.now();
    let rp1 = (Math.random() * 2147483648) | 0;
    let rp2 = (Math.random() * 2147483648) | 0;
    let chars = [];
    for (let i = 0; i < 5; i++) {
        chars.push(ALPH[rp1 & 63]);
        rp1 = rp1 >> 6;
    }
    for (let i = 5; i < 7; i++) {
        chars.push(ALPH[rp2 & 63]);
        rp2 = rp2 >> 6;
    }
    for (let i = 7; i < 12; i++) {
        chars.push(ALPH[tp & 63]);
        tp = tp >> 6;
    }
    return chars.join('');
}
function asap(cb, delay) {
    const ctx = {
        busy: false,
        func: (a) => {
            if (ctx.busy)
                return;
            ctx.busy = true;
            if (!delay && window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    cb(a);
                    ctx.busy = false;
                });
            }
            else {
                setTimeout(() => {
                    cb(a);
                    ctx.busy = false;
                }, delay || 66);
            }
        }
    };
    return ctx;
}
function debounce(cb, delay, instant = false, ctx = {}) {
    ctx.func = val => {
        if (ctx.busy)
            clearTimeout(ctx.busy);
        else if (instant) {
            if (instant.call)
                instant(val);
            else
                cb(val);
        }
        ctx.busy = setTimeout(() => {
            ctx.busy = null;
            cb(val);
        }, delay);
    };
    return ctx;
}
async function sleep(ms = 1000) {
    return new Promise(wakeup => {
        setTimeout(wakeup, ms);
    });
}
function bytesToStr(bytes) {
    if (bytes <= 1024)
        return bytes + ' b';
    let kb = Math.trunc(bytes / 102.4) / 10;
    if (kb <= 1024)
        return kb + ' kb';
    let mb = Math.trunc(bytes / 104857.6) / 10;
    if (mb <= 1024)
        return mb + ' mb';
    let gb = Math.trunc(bytes / 107374182.4) / 10;
    return gb + ' gb';
}
function strSize(str) {
    const bytes = new Blob([str]).size;
    return bytesToStr(bytes);
}
function uDate(ms, delimiter = '.') {
    const date = new Date(ms);
    let day = date.getDate();
    let dayStr = day.toString();
    if (day < 10)
        dayStr = '0' + dayStr;
    let month = date.getMonth() + 1;
    let monthStr = month.toString();
    if (month < 10)
        monthStr = '0' + monthStr;
    return `${date.getFullYear()}${delimiter}${monthStr}${delimiter}${dayStr}`;
}
function uTime(ms, delimiter = ':') {
    const date = new Date(ms);
    let seconds = date.getSeconds();
    let secondsStr = seconds.toString();
    if (seconds < 10)
        secondsStr = '0' + secondsStr;
    let minutes = date.getMinutes();
    let minutesStr = minutes.toString();
    if (minutes < 10)
        minutesStr = '0' + minutesStr;
    let hours = date.getHours();
    let hoursStr = hours.toString();
    if (hours < 10)
        hoursStr = '0' + hoursStr;
    return `${hoursStr}${delimiter}${minutesStr}${delimiter}${secondsStr}`;
}
function toCSSVarName(key) {
    return '--' + key.replace(UNDERSCORE_RE, '-');
}
function parseCSSNum(cssValue, or = 0) {
    const parseResult = CSS_NUM_RE.exec(cssValue.trim());
    if (!parseResult)
        return [0, ''];
    let numStr = parseResult[1];
    let unit = parseResult[2];
    let num;
    if (numStr.includes('.')) {
        if (numStr[0] === '.')
            numStr = '0' + numStr;
        num = parseFloat(numStr);
    }
    else {
        num = parseInt(numStr);
    }
    if (isNaN(num))
        num = or;
    return [num, unit];
}
function commonSubStr(strings) {
    if (!strings || !strings.length)
        return '';
    if (strings.length === 1)
        return strings[0];
    const first = strings[0];
    const others = strings.slice(1);
    let start = 0;
    let end = 1;
    let out = '';
    let common = '';
    while (end <= first.length) {
        common = first.slice(start, end);
        const isCommon = others.every(s => {
            return s.toLowerCase().includes(common.toLowerCase());
        });
        if (isCommon) {
            if (common.length > out.length)
                out = common;
            end++;
        }
        else {
            end = ++start + 1;
        }
    }
    return out;
}
async function getDataFromDragEvent(event, types = [], checkReg) {
    return new Promise(async (res) => {
        if (!event.dataTransfer)
            return res(null);
        for (let item of event.dataTransfer.items) {
            if (item.kind !== 'string')
                continue;
            const typeOk = types.some(type => type === item.type);
            if (!typeOk)
                continue;
            let output = await _getStringFromDragItem(item);
            if (!checkReg) {
                return res(output);
            }
            else if (checkReg.test(output))
                res(output);
        }
        res(null);
    });
}
async function _getStringFromDragItem(item) {
    return new Promise(res => item.getAsString(s => res(s)));
}
async function getUrlFromDragEvent(event) {
    return new Promise(async (res) => {
        if (!event.dataTransfer)
            return res(null);
        for (let item of event.dataTransfer.items) {
            if (item.kind !== 'string')
                continue;
            let typeOk = item.type === 'text/x-moz-url-data' ||
                item.type === 'text/uri-list' ||
                item.type === 'text/x-moz-text-internal';
            if (!typeOk)
                continue;
            let output = await _getStringFromDragItem(item);
            if (URL_RE.test(output))
                return res(output);
        }
        res(null);
    });
}
async function getDescFromDragEvent(event) {
    return new Promise(async (res) => {
        if (!event.dataTransfer)
            return res(null);
        for (let item of event.dataTransfer.items) {
            if (item.kind !== 'string')
                continue;
            let typeOk = item.type === 'text/x-moz-url-desc';
            if (typeOk) {
                res(await _getStringFromDragItem(item));
                break;
            }
        }
        res(null);
    });
}
function isGroupUrl(url) {
    return url.startsWith('moz') && url.includes('/group.html');
}
function getGroupId(url) {
    const idIndex = url.lastIndexOf('#') + 1;
    return url.slice(idIndex);
}
function getGroupRawParams(url) {
    let startIndex = url.indexOf('?');
    if (startIndex === -1)
        return '';
    let endIndex = url.lastIndexOf('#');
    return url.substring(startIndex, endIndex);
}
function createGroupUrl(name, conf) {
    let urlBase = browser.runtime.getURL('group/group.html');
    if (conf && conf.pin !== undefined)
        urlBase += '?pin=' + conf.pin;
    return urlBase + `#${encodeURI(name)}:id:${uid()}`;
}
function findSuccessorTab(state, tab, exclude) {
    let target;
    let isNextTree = state.activateAfterClosingNextRule === 'tree';
    let rmFolded = state.rmChildTabs === 'folded';
    let rmChild = state.rmChildTabs === 'all';
    let isPrevTree = state.activateAfterClosingPrevRule === 'tree';
    let isPrevVisible = state.activateAfterClosingPrevRule === 'visible';
    let skipFolded = state.activateAfterClosingNoFolded;
    let skipDiscarded = state.activateAfterClosingNoDiscarded;
    if (state.removingTabs && !exclude)
        exclude = state.removingTabs;
    if (tab.pinned) {
        let pinInPanels = state.pinnedTabsPosition === 'panel';
        if (state.tabsMap[tab.relGroupId])
            return state.tabsMap[tab.relGroupId];
        if (state.activateAfterClosing === 'prev') {
            for (let i = tab.index; i--;) {
                if (!state.tabs[i].pinned)
                    break;
                if (pinInPanels && state.tabs[i].panelId === tab.panelId)
                    return state.tabs[i];
                else if (!pinInPanels)
                    return state.tabs[i];
            }
            for (let i = tab.index + 1; i < state.tabs.length; i++) {
                if (!state.tabs[i].pinned)
                    break;
                if (pinInPanels && state.tabs[i].panelId === tab.panelId)
                    return state.tabs[i];
                else if (!pinInPanels)
                    return state.tabs[i];
            }
        }
        if (state.activateAfterClosing === 'next') {
            for (let i = tab.index + 1; i < state.tabs.length; i++) {
                if (!state.tabs[i].pinned)
                    break;
                if (pinInPanels && state.tabs[i].panelId === tab.panelId)
                    return state.tabs[i];
                else if (!pinInPanels)
                    return state.tabs[i];
            }
            for (let i = tab.index; i--;) {
                if (!state.tabs[i].pinned)
                    break;
                if (pinInPanels && state.tabs[i].panelId === tab.panelId)
                    return state.tabs[i];
                else if (!pinInPanels)
                    return state.tabs[i];
            }
        }
        if (state.activateAfterClosing === 'next' || state.activateAfterClosing === 'prev') {
            let panel = state.panelsMap[tab.panelId];
            if (pinInPanels && panel.tabs.length)
                return panel.tabs[0];
        }
    }
    if (tab.url.startsWith(GROUP_URL)) {
        let urlInfo = new URL(tab.url);
        let pin = urlInfo.searchParams.get('pin');
        if (pin) {
            let [containerId, url] = pin.split('::');
            target = state.tabs.find(t => t.pinned && t.cookieStoreId === containerId && t.url === url);
            if (target)
                return target;
        }
    }
    if (state.activateAfterClosing === 'next') {
        for (let i = tab.index + 1, next; i < state.tabs.length; i++) {
            next = state.tabs[i];
            if (!next)
                break;
            if (isNextTree && next.lvl < tab.lvl)
                break;
            if (next.panelId !== tab.panelId || next.pinned !== tab.pinned)
                break;
            if (exclude && exclude.includes(next.id))
                continue;
            if (rmFolded && next.invisible)
                continue;
            if (rmChild && next.lvl > tab.lvl)
                continue;
            if (skipDiscarded && next.discarded)
                continue;
            if (next.panelId === tab.panelId) {
                target = next;
                break;
            }
        }
        if (!target) {
            let i, prev;
            for (i = tab.index; i--;) {
                prev = state.tabs[i];
                if (!prev)
                    break;
                if (prev.panelId !== tab.panelId || prev.pinned !== tab.pinned)
                    break;
                if (exclude && exclude.includes(prev.id))
                    continue;
                if (isPrevTree && prev.lvl > tab.lvl)
                    continue;
                if (isPrevVisible && prev.invisible)
                    continue;
                if (skipDiscarded && prev.discarded)
                    continue;
                if (prev.panelId === tab.panelId) {
                    target = prev;
                    break;
                }
            }
            if (!target) {
                while (i > -1) {
                    prev = state.tabs[i--];
                    if (!prev)
                        break;
                    if (skipDiscarded && prev.discarded)
                        continue;
                    if (prev.invisible)
                        continue;
                    target = prev;
                    break;
                }
            }
        }
    }
    if (state.activateAfterClosing === 'prev') {
        for (let i = tab.index, prev; i--;) {
            prev = state.tabs[i];
            if (!prev)
                break;
            if (prev.panelId !== tab.panelId || prev.pinned !== tab.pinned)
                break;
            if (exclude && exclude.includes(prev.id))
                continue;
            if (isPrevTree && prev.lvl > tab.lvl)
                continue;
            if (isPrevVisible && prev.invisible)
                continue;
            if (skipDiscarded && prev.discarded)
                continue;
            if (prev.panelId === tab.panelId) {
                target = prev;
                break;
            }
        }
        if (!target) {
            for (let i = tab.index + 1, next; i < state.tabs.length; i++) {
                next = state.tabs[i];
                if (!next)
                    break;
                if (isNextTree && next.lvl < tab.lvl)
                    break;
                if (next.panelId !== tab.panelId || next.pinned !== tab.pinned)
                    break;
                if (exclude && exclude.includes(next.id))
                    continue;
                if (rmFolded && next.invisible)
                    continue;
                if (rmChild && next.lvl > tab.lvl)
                    continue;
                if (skipDiscarded && next.discarded)
                    continue;
                if (next.panelId === tab.panelId) {
                    target = next;
                    break;
                }
            }
        }
    }
    if (state.activateAfterClosing === 'prev_act') {
        let actTabsBox;
        if (state.activateAfterClosingGlobal)
            actTabsBox = state;
        else
            actTabsBox = state.panelsMap[tab.panelId] || state;
        if (!actTabsBox.actTabs)
            return;
        let targetId, prev;
        for (let i = actTabsBox.actTabs.length; i--;) {
            targetId = actTabsBox.actTabs[i];
            prev = state.tabsMap[targetId];
            if (exclude && exclude.includes(targetId))
                continue;
            if (skipDiscarded && prev && prev.discarded)
                continue;
            if (skipFolded && prev && prev.invisible)
                continue;
            if (targetId !== tab.id && prev) {
                target = prev;
                break;
            }
        }
    }
    return target;
}
function cloneArray(arr) {
    const out = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            out.push(cloneArray(item));
        }
        else if (typeof item === 'object' && item !== null) {
            out.push(deepClone(item));
        }
        else {
            out.push(item);
        }
    }
    return out;
}
function deepClone(source) {
    if (source === null)
        return source;
    if (source instanceof Date)
        return new Date(source.getTime());
    if (source instanceof Array)
        return source.map(item => deepClone(item));
    if (typeof source === 'object') {
        return Object.getOwnPropertyNames(source).reduce((o, prop) => {
            Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
            o[prop] = deepClone(source[prop]);
            return o;
        }, Object.create(Object.getPrototypeOf(source)));
    }
    return source;
}
function normalizeUrl(url) {
    if (url === 'about:newtab')
        return undefined;
    if (url.startsWith('chrome:') ||
        url.startsWith('javascript:') ||
        url.startsWith('data:') ||
        url.startsWith('file:') ||
        url.startsWith('jar:file:') ||
        url.startsWith('about:')) {
        return browser.runtime.getURL('url/url.html') + '#' + url;
    }
    else {
        return url;
    }
}
function normalizeTab(tab, defaultPanelId) {
    if (tab.isParent === undefined)
        tab.isParent = false;
    if (tab.folded === undefined)
        tab.folded = false;
    if (tab.invisible === undefined)
        tab.invisible = false;
    if (tab.parentId === undefined)
        tab.parentId = -1;
    if (tab.panelId === undefined)
        tab.panelId = defaultPanelId;
    if (tab.lvl === undefined)
        tab.lvl = 0;
    if (tab.sel === undefined)
        tab.sel = false;
    if (tab.updated === undefined)
        tab.updated = false;
    if (tab.loading === undefined)
        tab.loading = false;
    if (tab.status === undefined)
        tab.status = 'complete';
    if (tab.warn === undefined)
        tab.warn = false;
    if (tab.favIconUrl === 'chrome://global/skin/icons/warning.svg') {
        tab.warn = true;
    }
    if (tab.favIconUrl === undefined)
        tab.favIconUrl = '';
    else if (tab.favIconUrl.startsWith('chrome:'))
        tab.favIconUrl = '';
    if (tab.unread === undefined)
        tab.unread = false;
}
function findDataForTabs(tabs, data) {
    let maxEqualityCounter = 1;
    let result;
    for (let winTabs of data) {
        let equalityCounter = 0;
        let gOffset = 0;
        perTab: for (let tab, tabData, i = 0, k = 0; i < winTabs.length; i++, k++) {
            tab = tabs[k];
            if (!tab)
                break;
            tabData = winTabs[i];
            if (isGroupUrl(tabData.url) && tabData.url !== tab.url) {
                tabData.isMissedGroup = true;
                k--;
                continue;
            }
            let blindspot = tab.status === 'loading' && tab.url === 'about:blank';
            if (tabData.url === tab.url || blindspot) {
                tabData.index = k + gOffset;
                equalityCounter++;
            }
            else {
                for (let j = k + 1; j < k + 5; j++) {
                    if (tabs[j] && tabs[j].url === tabData.url) {
                        k = j;
                        tabData.index = k + gOffset;
                        equalityCounter++;
                        continue perTab;
                    }
                }
                k--;
            }
        }
        if (maxEqualityCounter <= equalityCounter) {
            maxEqualityCounter = equalityCounter;
            result = winTabs;
        }
        if (equalityCounter === tabs.length)
            break;
    }
    return result || [];
}
function normalizeObject(obj, defaults) {
    let result = deepClone(defaults);
    for (let key of Object.keys(defaults)) {
        if (obj[key] !== undefined)
            result[key] = obj[key];
    }
    return result;
}
function findUrls(str) {
    let urls = [];
    let words = str.split(/\s|,/);
    for (let word of words) {
        if (URL_RE.test(word))
            urls.push(word);
    }
    return urls;
}
async function loadBinAsBase64(url) {
    return new Promise(async (res) => {
        let response;
        try {
            response = await fetch(url, {
                method: 'GET',
                mode: 'no-cors',
                credentials: 'omit',
            });
        }
        catch (err) {
            return res(null);
        }
        if (!response)
            return res(null);
        let blob = await response.blob();
        let reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(blob);
    });
}
function limitStringLength(string, length, suffix = "...") {
    if (length < suffix.length) {
        throw new Error("`length` must be greater than the suffix's length.");
    }
    return string.length < length ? string : string.substring(0, length - suffix.length) + "...";
}
export default {
    uid,
    asap,
    debounce,
    sleep,
    strSize,
    bytesToStr,
    uDate,
    uTime,
    toCSSVarName,
    parseCSSNum,
    commonSubStr,
    getDataFromDragEvent,
    getUrlFromDragEvent,
    getDescFromDragEvent,
    isGroupUrl,
    getGroupId,
    getGroupRawParams,
    createGroupUrl,
    findSuccessorTab,
    cloneArray,
    deepClone,
    normalizeUrl,
    normalizeTab,
    findDataForTabs,
    normalizeObject,
    findUrls,
    loadBinAsBase64,
    limitStringLength
};
//# sourceMappingURL=utils.js.map