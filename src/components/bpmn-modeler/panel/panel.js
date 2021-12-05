import Panel from './src/index'
import Vue from 'vue'

let PanelConstructor = Vue.extend(Panel)
let instance
let seed = 1

function PropertiesPanel(config = {}, eventBus, modeling, commandStack, canvas, bpmnFactory) {
    instance = new PanelConstructor({
        data() {
            return {
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
    if (!config.parent) {
        throw '未设置属性面板容器'
    }
    if (config.parent.indexOf('#') === 0) {
        const container = document.getElementById(config.parent.substr(1))
        if (!container) {
            throw '未找到属性面板容器'
        }
        container.appendChild(instance.$el)
    }
}

PropertiesPanel.$inject = [
    'config.propertiesPanel',
    'eventBus',
    'modeling',
    'commandStack',
    'canvas',
    'bpmnFactory'
]

export default PropertiesPanel
