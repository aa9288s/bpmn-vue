import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'

const ElementProperty = function (element, config = {}, modeling, bpmnFactory) {
    this.name = config.name
    this.label = config.label
    this.type = config.type
    this.isBody = config.isBody
    this.isAttr = config.isAttr
    this.$element = element
    this.$modeling = modeling
    this.$bpmnFactory = bpmnFactory
}

ElementProperty.prototype.getAttributeValue = function () {
    return getBusinessObject(this.$element)[this.name]
}

ElementProperty.prototype.setAttributeValue = function (value) {
    const obj = {}
    obj[this.name] = value
    this.$modeling.updateProperties(this.$element, obj)
}

ElementProperty.prototype.getExtension = function () {

}

ElementProperty.prototype.setExtension = function (type, props, filter) {
    const businessObject = getBusinessObject(this.$element)
    businessObject.extensionElements = businessObject.extensionElements || this.createExtensionElements()
    const values = businessObject.extensionElements.get('values').filter(e => !is(e, type) || filter && filter(e))
    const extensionElement = this.createElement(type, props)
    values.push(extensionElement)
    businessObject.extensionElements.set('values', values)
}

ElementProperty.prototype.createExtensionElements = function () {
    return this.createElement('bpmn:ExtensionElements')
}

ElementProperty.prototype.createElement = function (type, props) {
    return this.$bpmnFactory.create(type, props)
}

export default ElementProperty