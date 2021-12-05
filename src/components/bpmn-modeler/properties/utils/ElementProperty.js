import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'

const ElementProperty = function (element, config = {}, modeling, bpmnFactory) {
    this.id = config.id
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
    return this.getAttribute(this.name)
}

ElementProperty.prototype.setAttributeValue = function (value) {
    this.setAttribute(this.name, value)
}

ElementProperty.prototype.getAttribute = function (name) {
    return getBusinessObject(this.$element)[name]
}

ElementProperty.prototype.setAttribute = function (name, value) {
    const obj = {}
    obj[name] = value
    this.$modeling.updateProperties(this.$element, obj)
}

ElementProperty.prototype.getExtension = function () {
    const businessObject = getBusinessObject(this.$element)
    if (businessObject.extensionElements) {
        return businessObject.extensionElements.get('values').filter(e => is(e, this.name))
    }
    return []
}

ElementProperty.prototype.setExtension = function (props) {
    const businessObject = getBusinessObject(this.$element)
    businessObject.extensionElements = businessObject.extensionElements || this.createExtensionElements()
    const extensionElement = this.createElement(this.name, props)
    let existsElement = businessObject.extensionElements.get('values').filter(e => is(e, this.name))[0]
    if (existsElement) {
        Object.keys(existsElement).forEach(key => {
            existsElement.set(key, props[key])
        })
    } else {
        businessObject.extensionElements.get('values').push(extensionElement)
    }
}

ElementProperty.prototype.createExtensionElements = function () {
    return this.createElement('bpmn:ExtensionElements')
}

ElementProperty.prototype.createElement = function (type, props) {
    return this.$bpmnFactory.create(type, props)
}

export default ElementProperty