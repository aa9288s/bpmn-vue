import BpmnModeler from './bpmn-modeler'

const components = [
  BpmnModeler
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.use(component)
  })
}

export default {
  install
}
