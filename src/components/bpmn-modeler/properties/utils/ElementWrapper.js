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
    getBusinessObject(this.$element).set(name, value)
}

ElementWrapper.prototype.setAttributes = function (attrs) {
    /* this.$modeling.updateProperties(this.$element, attrs)*/
    Object.keys(attrs).forEach(key => {
        getBusinessObject(this.$element)[key] = attrs[key]
    })
}

ElementWrapper.prototype.getExtension = function () {
    const businessObject = getBusinessObject(this.$element)
    if (businessObject.extensionElements) {
        return businessObject.extensionElements.get('values').filter(e => is(e, this.name))
    }
    return []
}

ElementWrapper.prototype.setExtension = function (props) {
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

ElementWrapper.prototype.createExtensionElements = function () {
    return this.createElement('bpmn:ExtensionElements')
}

ElementWrapper.prototype.createElement = function (type, props) {
    return this.$bpmnFactory.create(type, props)
}

export default ElementWrapper