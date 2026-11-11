import UmamiStats from './UmamiStats.vue'
import { createUmamiClient, umamiStatsKey } from './client.js'

export default {
  install(app, options) {
    const configured = options?.baseUrl && options?.websiteId && options?.shareId
    app.provide(umamiStatsKey, configured ? createUmamiClient(options) : null)
    app.component('UmamiStats', UmamiStats)
  },
}
