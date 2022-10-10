import DefaultTheme from 'vitepress/dist/client/theme-default'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './index.css'
import * as components from '../components'

function registerComponents(app) {
  app.use(Antd)
  Object.keys(components).forEach((key) => {
    app.component(key, components[key])
  })
}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    registerComponents(app)
  }
}
