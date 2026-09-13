<script setup>
import { ref } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh'
  }
})

const error = ref(null)
const fileInput = ref(null)
const isInputEnabled = ref(false)
const isDragging = ref(false) // 新增：拖拽状态
const loadingMessage = ref('')
const loadingDetail = ref('')
const loadedFile = ref(null)
const phase = ref('idle')
const primarySchemeGroup = ref(null)
const advancedGroups = ref([])
const selectedScheme = ref('')
const lastAction = ref('')
const systemImeWarning = ref(false)

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function refreshSchemeActions(fcitx) {
  if (!fcitx) return
  const groups = buildMenuGroups(fcitx.getMenuActions())
  const primaryIndex = groups.findIndex(group => group.options.length > 1)
  const [primary] = groups.splice(primaryIndex < 0 ? 0 : primaryIndex, 1)
  const utilityOptions = primary?.options.filter(option => option.desc === 'Latin Mode') || []
  if (primary) primary.options = primary.options.filter(option => option.desc !== 'Latin Mode')
  primarySchemeGroup.value = primary || null
  advancedGroups.value = utilityOptions.length
    ? [{ title: 'Latin Mode', options: utilityOptions }, ...groups]
    : groups
  const schemeOptions = primary?.options || []
  const checked = schemeOptions.find(option => option.checked)
  if (checked) selectedScheme.value = String(checked.id)
  else if (!schemeOptions.some(option => String(option.id) === selectedScheme.value)) {
    selectedScheme.value = schemeOptions[0] ? String(schemeOptions[0].id) : ''
  }
}

function getFcitx() {
  return typeof window !== 'undefined' ? window.fcitx : null
}

function flattenMenuActions(actions) {
  return actions.flatMap(action => {
    if (action.children?.length) return flattenMenuActions(action.children)
    const hiddenActions = ['Deploy', 'Synchronize']
    if (hiddenActions.includes(action.desc) || action.separator) return []
    return [{ ...action, desc: action.desc }]
  })
}

function buildMenuGroups(actions) {
  return actions
    .filter(action => !['Deploy', 'Synchronize'].includes(action.desc) && !action.separator)
    .map(action => ({
      title: action.desc,
      options: action.children?.length ? flattenMenuActions(action.children) : [action]
    }))
    .filter(group => group.options.length)
}

function activateMenuAction(id) {
  const fcitx = getFcitx()
  if (!fcitx) return
  const action = [primarySchemeGroup.value, ...advancedGroups.value].filter(Boolean).flatMap(group => group.options).find(item => item.id === id)
  if (primarySchemeGroup.value?.options.some(item => item.id === id)) selectedScheme.value = String(id)
  fcitx.activateMenuAction(id)
  fcitx.updateStatusArea()
  lastAction.value = action?.desc || ''
  window.setTimeout(() => refreshSchemeActions(fcitx), 80)
}

function changeScheme(event) {
  const id = Number(event.target.value)
  if (Number.isInteger(id)) activateMenuAction(id)
}

function handleCompositionStart() {
  systemImeWarning.value = true
}

async function handleFile(file) {
  if (!file) return
  
  // 检查文件类型是否为zip
  if (!file.name.endsWith('.zip')) {
    error.value = props.lang === 'zh' ? '请选择在线体验用的 ZIP 方案包，无需解压。' : 'Choose a pre-built ZIP package for the online demo. Keep it zipped.'
    isInputEnabled.value = false
    phase.value = 'error'
    return
  }

  error.value = null
  isInputEnabled.value = false
  loadedFile.value = null
  phase.value = 'loading'
  loadingMessage.value = props.lang === 'zh' ? '正在准备网页输入法…' : 'Preparing the web input method…'
  loadingDetail.value = `${file.name} · ${formatFileSize(file.size)}`

  try {
    console.log('Loading Rime input:', file)
    const { loadZip } = await import('./resources/fcitx5Online/Fcitx5.js')
    loadingMessage.value = props.lang === 'zh' ? '正在加载方案包…' : 'Loading the input package…'
    await loadZip(file)
    refreshSchemeActions(getFcitx())
    isInputEnabled.value = true
    loadedFile.value = file
    phase.value = 'ready'
  } catch (err) {
    error.value = (props.lang === 'zh' ? '方案包未能加载，请确认使用的是在线体验预构建包。错误信息：' : 'Could not load the package. Check that it was pre-built for the online demo. Error: ') + err.message
    console.error('Failed to load Rime input:', err)
    isInputEnabled.value = false
    phase.value = 'error'
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  await handleFile(file)
}

function triggerFileInput() {
  fileInput.value.click()
}

function retryUpload() {
  error.value = null
  phase.value = 'idle'
  triggerFileInput()
}

// 新增：拖拽相关事件处理
function handleDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer.files[0]
  await handleFile(file)
}
</script>

<template>
  <div class="rime-container">
    <!-- 方案状态卡片 -->
    <div 
      class="scheme-card"
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[`scheme-${phase}`, { 'dragging': isDragging }]"
    >
      <input 
        ref="fileInput"
        type="file" 
        accept=".zip" 
        @change="handleFileUpload"
        style="display: none"
      />
      <template v-if="phase === 'ready' && loadedFile">
        <div class="scheme-header">
          <span class="loaded-badge"><span class="loaded-dot"></span>{{ lang === 'zh' ? '已加载' : 'Loaded' }}</span>
          <button class="replace-button" type="button" @click.stop="retryUpload">{{ lang === 'zh' ? '更换方案包' : 'Change package' }}</button>
        </div>
        <p class="loaded-file-name">{{ loadedFile.name }}</p>
        <p class="hint">{{ formatFileSize(loadedFile.size) }} · {{ lang === 'zh' ? '可在下方选择包内的输入方案' : 'Choose an input scheme from this package below' }}</p>
      </template>
      <template v-else-if="phase === 'loading'">
        <div class="phase-icon phase-loading">↻</div>
        <p class="phase-title">{{ loadingMessage }}</p>
        <p class="hint">{{ loadingDetail }}</p>
        <p class="hint">{{ lang === 'zh' ? '较大的方案包需要更多时间，请保持页面打开。' : 'Large packages take longer to load. Please keep this page open.' }}</p>
        <div class="loading-progress" role="progressbar" :aria-label="loadingMessage"><div class="loading-progress-bar"></div></div>
      </template>
      <template v-else-if="phase === 'error'">
        <div class="phase-icon phase-error">!</div>
        <p class="phase-title">{{ lang === 'zh' ? '方案包加载失败' : 'Package could not be loaded' }}</p>
        <p class="hint">{{ error }}</p>
        <button class="replace-button" type="button" @click.stop="retryUpload">{{ lang === 'zh' ? '重新选择' : 'Choose again' }}</button>
      </template>
      <template v-else>
        <div class="phase-icon">↑</div>
        <p class="phase-title" v-text="lang === 'zh' ? '加载在线体验方案包' : 'Load an online demo package'"></p>
        <p class="hint" v-text="lang === 'zh' ? '点击选择或拖入下载好的 ZIP，无需解压' : 'Click to choose or drop the downloaded ZIP — no extraction needed'"></p>
      </template>
    </div>

    <div v-if="phase === 'ready' && primarySchemeGroup" class="scheme-picker">
      <div class="picker-header">
        <strong>{{ lang === 'zh' ? '当前方案' : 'Input scheme' }}</strong>
        <span class="picker-hint">{{ lang === 'zh' ? '选择后立即切换' : 'Switches immediately' }}</span>
      </div>
      <select class="scheme-select" :value="selectedScheme" @change="changeScheme">
        <optgroup :label="lang === 'zh' ? '输入方案' : 'Input schemes'">
          <option v-for="action in primarySchemeGroup.options" :key="action.id" :value="action.id">{{ action.desc }}</option>
        </optgroup>
      </select>
      <details v-if="advancedGroups.length" class="advanced-options">
        <summary>{{ lang === 'zh' ? '更多输入选项' : 'More input options' }}</summary>
        <div v-for="group in advancedGroups" :key="group.title" class="advanced-group">
          <span>{{ group.title }}</span>
          <button v-for="action in group.options" :key="action.id" class="scheme-option" type="button" @click.stop="activateMenuAction(action.id)">{{ action.desc }}</button>
        </div>
      </details>
      <p v-if="lastAction" class="action-feedback">✓ {{ lang === 'zh' ? `已更新：${lastAction}` : `Updated: ${lastAction}` }}</p>
    </div>
    
    <div class="usage-tips">
      <div class="usage-heading">
        <strong>{{ lang === 'zh' ? '薄荷功能示例' : 'Try these in Oh-my-rime' }}</strong>
        <span>{{ lang === 'zh' ? '依次输入，注意大小写' : 'Type each sequence exactly as shown' }}</span>
      </div>
      <div class="usage-tip-grid">
        <a :href="`/${lang}/demo/funcKeys.html`"><code>orq</code> {{ lang === 'zh' ? '日期' : 'Date' }} · <code>osj</code> {{ lang === 'zh' ? '时间' : 'Time' }} · <code>onl</code> {{ lang === 'zh' ? '农历' : 'Lunar date' }}</a>
        <a :href="`/${lang}/demo/reverseWords.html`"><code>Uu</code> / <code>Uw</code> / <code>Ui</code> {{ lang === 'zh' ? '拼音拆字 / 五笔 / 笔画反查' : 'component / Wubi / stroke lookup' }}</a>
        <a :href="`/${lang}/demo/funcKeys.html`"><code>=1+2</code> {{ lang === 'zh' ? '计算表达式' : 'Evaluate an expression' }}</a>
        <a :href="`/${lang}/demo/kaomoji.html`"><code>VV</code> {{ lang === 'zh' ? '颜文字' : 'Kaomoji' }}</a>
      </div>
      <p class="usage-scope">{{ lang === 'zh' ? '以上为薄荷方案的功能示例。五笔、九键或其他方案包的触发方式可能不同，点击示例可查看对应文档。' : 'These examples follow the Oh-my-rime documentation. Triggers may differ in Wubi, nine-key schemes or other packages. Follow a link for details.' }}</p>
    </div>

    <div v-if="systemImeWarning" class="ime-warning" role="alert">
      <strong>{{ lang === 'zh' ? '检测到系统输入法正在工作' : 'System input method detected' }}</strong>
      <span>{{ lang === 'zh' ? '请将电脑输入法切换为 ABC/英文，避免系统输入法与网页输入法重复处理。' : 'Switch your system input method to ABC/English to avoid duplicate input.' }}</span>
      <button type="button" @click="systemImeWarning = false">{{ lang === 'zh' ? '知道了' : 'Got it' }}</button>
    </div>

    <!-- 输入区域 -->
    <textarea
      class="rime-input"
      :disabled="!isInputEnabled"
      :aria-label="lang === 'zh' ? '在线输入体验区' : 'Online typing area'"
      :placeholder="isInputEnabled
        ? (lang === 'zh' ? '先将系统输入法切换为 ABC/英文，再用当前方案输入…' : 'Switch your system input method to ABC/English, then type using the selected scheme…')
        : (lang === 'zh' ? '加载方案包后，即可在这里输入' : 'Load an input package to start typing here')"
      @compositionstart="handleCompositionStart"
    ></textarea>
  </div>
</template>

<style scoped>
.rime-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  padding: 20px 0 0 0;
}

.scheme-card {
  position: relative;
  padding: 1.5rem;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}

.scheme-card:hover, .scheme-card.dragging {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.scheme-ready {
  border-style: solid;
  border-color: var(--vp-c-green-1);
  background-color: var(--vp-c-green-soft);
}

.loaded-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--vp-c-green-1);
  background: var(--vp-c-bg);
  font-size: 0.875rem;
  font-weight: 600;
}

.loaded-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
}

.loaded-file-name {
  margin-top: 0.65rem !important;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.scheme-card p {
  margin: 0;
  color: var(--vp-c-text-1);
}

.scheme-card .hint {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.scheme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.phase-icon { font-size: 1.75rem; color: var(--vp-c-brand); }
.phase-loading { animation: spin 1s linear infinite; }
.phase-error { color: var(--vp-c-danger-1); }
.phase-title { font-weight: 600; }
.replace-button { border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 0.35rem 0.7rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; }
.replace-button:hover { border-color: var(--vp-c-brand); color: var(--vp-c-brand); }
.action-feedback { margin: .7rem 0 0; color: var(--vp-c-green-1); font-size: .85rem; }
.scheme-picker { padding: 1rem 1.25rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); }
.picker-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .75rem; }
.picker-hint { color: var(--vp-c-text-2); font-size: .85rem; }
.scheme-select { width: 100%; min-height: 2.5rem; padding: .45rem .65rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; font-size: .95rem; }
.scheme-select:focus { border-color: var(--vp-c-brand); outline: 2px solid var(--vp-c-brand-soft); }
.advanced-options { margin-top: .8rem; border-top: 1px solid var(--vp-c-divider); padding-top: .7rem; }
.advanced-options summary { color: var(--vp-c-text-2); cursor: pointer; font-size: .875rem; }
.advanced-group { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; margin-top: .7rem; }
.advanced-group > span { width: 100%; color: var(--vp-c-text-2); font-size: .8rem; }
.scheme-option { padding: .55rem .8rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; text-align: left; }
.scheme-option:hover, .scheme-option:focus-visible { border-color: var(--vp-c-brand); color: var(--vp-c-brand); outline: none; }
.scheme-option[aria-pressed="true"] { border-color: var(--vp-c-brand); color: var(--vp-c-brand); background: var(--vp-c-brand-soft); }

.loading-progress {
  height: 6px;
  overflow: hidden;
  margin: 0 auto 1rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.loading-progress-bar {
  width: 42%;
  height: 100%;
  border-radius: inherit;
  background: var(--vp-c-brand);
  animation: loading-progress 1.4s ease-in-out infinite;
}

@keyframes loading-progress {
  0% { transform: translateX(-120%); }
  50% { transform: translateX(120%); }
  100% { transform: translateX(280%); }
}

@keyframes spin { to { transform: rotate(360deg); } }

.rime-input {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.25s;
  flex-grow: 1;
}

.rime-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.rime-input:disabled {
  background-color: var(--vp-c-bg-soft);
  cursor: not-allowed;
}
.ime-warning { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; border: 1px solid var(--vp-c-yellow-1); border-radius: 8px; background: var(--vp-c-yellow-soft); color: var(--vp-c-text-1); font-size: .875rem; }
.ime-warning span { flex: 1; color: var(--vp-c-text-2); }
.ime-warning button { flex: none; padding: .35rem .65rem; border: 1px solid var(--vp-c-divider); border-radius: 5px; background: var(--vp-c-bg); color: inherit; cursor: pointer; }
@media (max-width: 640px) { .ime-warning { align-items: flex-start; flex-direction: column; } }
.usage-tips { color: var(--vp-c-text-2); font-size: .875rem; }
.usage-heading { display: flex; flex-wrap: wrap; align-items: baseline; gap: .25rem .75rem; margin-bottom: .5rem; }
.usage-heading strong { color: var(--vp-c-text-1); }
.usage-heading span, .usage-scope { font-size: .8rem; }
.usage-tip-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem .9rem; }
.usage-tip-grid a { font-weight: 400; }
.usage-tips .usage-scope { margin: .5rem 0 0; }
@media (max-width: 640px) { .usage-tip-grid { grid-template-columns: 1fr; } }
</style>
