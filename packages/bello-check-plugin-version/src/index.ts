import { BaseConfig, CreateDialog } from './dialog'

export { CreateDialog }

interface PluginInfo {
  xclientId: string
  version: string
  token: string
}

interface Version {
  latest: string // 最新版本
  least: string // 最低版本
}

export function judgeVersionUpdated(
  currentVersion: string,
  newestVersion: string
): boolean {
  if (!currentVersion || !newestVersion) return false
  const currentVersionArr = currentVersion
    .split('.')
    .map(each => parseInt(each))
  const newestVersionArr = newestVersion.split('.').map(each => parseInt(each))
  if (newestVersionArr[0] > currentVersionArr[0]) {
    // 大版本
    return true
  }
  if (newestVersionArr[0] === currentVersionArr[0]) {
    // 大版本一样
    if (newestVersionArr[1] > currentVersionArr[1]) {
      // 小版本
      return true
    }
    if (newestVersionArr[1] === currentVersionArr[1]) {
      // 小版本一样
      if (newestVersionArr[2] > currentVersionArr[2]) {
        return true
      }
    }
  }
  return false
}

export default class XiaobeiVersion {
  hasPlugin = false
  dialog: CreateDialog | null
  pluginInfo: PluginInfo | null = null
  version: Version | null = null
  autoVisible?: boolean = true
  noticeTiming?: string
  status: 'least' | 'latest' | 'uninstall' | 'success' = 'uninstall'
  constructor(
    version: Version,
    config?: BaseConfig,
    public content?: HTMLElement,
    public onChange?: (
      status: 'least' | 'latest' | 'uninstall' | 'success'
    ) => void
  ) {
    this.content = content ?? document.body
    const { visible = true, ...otherConfig } = config || {}

    const _config = {
      showClose: true,
      closeOnClickModal: false,
      id: '_xiaobei_update_dialog_',
      notice_timing: 'unInstall,update',
      status: 'uninstall',
      content: this.content,
      ...(otherConfig || {})
    }
    const { notice_timing, id } = _config || {}

    this.version = version
    this.autoVisible = visible
    this.content?.querySelector(`#${id}`)?.remove()
    this.dialog = new CreateDialog(_config)
    this.noticeTiming = notice_timing

    // 检查更新
    const messageToPlugin = setInterval(() => {
      if (this.hasPlugin) {
        clearInterval(messageToPlugin)
        return
      }
      window.postMessage({ type: 'osr_inited' }, '*')
    }, 100)

    window.addEventListener('message', this.fetchXClientVersion)

    // 未安装插件
    setTimeout(() => {
      if (this.noticeTiming?.includes('unInstall') && !this.hasPlugin) {
        messageToPlugin && clearInterval(messageToPlugin)
        this.checkVersion()
        window.removeEventListener('message', this.fetchXClientVersion)
      }
    }, 1.5 * 1000)
  }
  fetchXClientVersion = (event: MessageEvent): void => {
    const { data } = event || {}
    const { data: pluginData, type } = data || {}
    if (type === 'bl_plugin_inited') {
      this.hasPlugin = true
      this.pluginInfo = pluginData

      if (this.noticeTiming?.includes('update')) {
        this.checkVersion()
      }

      return data
    }
  }
  open(fn?: () => void): void {
    try {
      fn && fn()
      this.dialog?.onOpen()
    } catch (err) {
      console.error(err)
    }
  }
  close(fn?: () => void): void {
    try {
      fn && fn()
      this.dialog?.onClose()
    } catch (err) {
      console.error(err)
    }
  }
  checkVersion(): string {
    if (!this.dialog) {
      return 'no_dialog'
    }
    const fn = this.onChange
    const { version = '' } = this.pluginInfo || {}
    const { latest = '', least = '' } = this.version || {}

    const isLeastVersion = judgeVersionUpdated(version, least)
    const isLatestVersion = judgeVersionUpdated(version, latest)

    if (!this.hasPlugin) {
      // 未安装插件
      this.status = 'uninstall'

      this.autoVisible &&
        this.dialog.setConfig({
          visible: true,
          showClose: true,
          status: 'uninstall'
        })
    } else if (isLeastVersion) {
      // 强制更新
      this.status = 'least'

      this.autoVisible &&
        this.dialog.setConfig({ visible: true, showClose: false })
    } else if (isLatestVersion) {
      // 软更新
      this.status = 'latest'

      this.autoVisible &&
        this.dialog.setConfig({ visible: true, showClose: true })
    } else {
      // 安装了最新版
      this.status = 'success'
    }

    fn && fn(this.status)
    return this.status
  }
  destroy(): void {
    this.version = null
    window.removeEventListener('message', this.fetchXClientVersion)
  }
}
