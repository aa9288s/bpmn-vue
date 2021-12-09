import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'

const ElementWrapper = function (element, modeling, bpmnFactory) {
    this.$element = element
    this.$modeling = modeling
    this.$bpmnFactory = bpmnFactory
}

ElementWrapper.prototype.getAttribute = function (name) {
    return getBusinessObject(this.$element)[name]
}

ElementWrapper.prototype.setAttribute = function (name, value) {
    const attrs = {}
    attrs[name] = value
    this.setAttributes(attrs)
}

ElementWrapper.prototype.setAttributes = function (attrs) {
    this.$modeling.updateProperties(this.$element, attrs)
}

ElementWrapper.prototype.getExtension = function (type) {
    const businessObject = getBusinessObject(this.$element)
    if (businessObject.extensionElements) {
        return businessObject.extensionElements.get('values').filter(e => is(e, type))[0]
    }
    return null
}

ElementWrapper.prototype.setExtension = function (type, props) {
    const businessObject = getBusinessObject(this.$element)
    businessObject.extensionElements = businessObject.extensionElements || this.createExtensionElements()
    if (!props || !Object.keys(props).length) {
        businessObject.extensionElements.set('values', businessObject.extensionElements.get('values').filter(e => !is(e, type)))
    } else {
        const extensionElement = this.createElement(type, props)
        businessObject.extensionElements.set('values', businessObject.extensionElements.get('values').filter(e => !is(e, type)))
        businessObject.extensionElements.get('values').push(extensionElement)
    }
}

ElementWrapper.prototype.createExtensionElements = function () {
    return this.createElement('bpmn:ExtensionElements')
}

ElementWrapper.prototype.createElement = function (type, props) {
    return this.$bpmnFactory.create(type, props)
}

export default ElementWrapper