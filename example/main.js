import { App } from './App.js'

import { createApp } from '../lib/guide-mini-vue.esm.js'

const rootContainer = document.querySelector('#container')
createApp(App).mount(rootContainer);