import Panel from './src/index'
import Vue from 'vue'

let PanelConstructor = Vue.extend(Panel)
let instance
let seed = 1

function PropertiesPanel (config = {}, eventBus, modeling, commandStack, canvas, bpmnFactory) {
  instance = new PanelConstructor({
    data () {
      return {
        config: config.propertiesPanel,
        eventBus,
        modeling,
        commandStack,
        canvas,
        bpmnFactory
      }
    }
  })
  instance.id = 'properties-panel-' + seed++
  instance.$mount()
  document.body.appendChild(instance.$el)
}

PropertiesPanel.$inject = [
  'config',
  'eventBus',
  'modeling',
  'commandStack',
  'canvas',
  'bpmnFactory'
]

export default PropertiesPanel
