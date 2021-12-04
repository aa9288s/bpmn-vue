import BpmnEditor from './editor/src/index'

BpmnEditor.install = function (Vue) {
  Vue.component(BpmnEditor.name, BpmnEditor)
}

export default {
  install (Vue) {
    Vue.use(BpmnEditor)
  }
}
