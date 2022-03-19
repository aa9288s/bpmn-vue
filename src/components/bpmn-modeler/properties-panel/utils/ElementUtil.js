export function addExtensionProperties (businessObject = {}, properties = [], bpmnFactory = {}, prefix = 'activiti') {
  const propertiesBpmnName = `${prefix}:Properties`
  const propertyBpmnName = `${prefix}:Property`

  const extensionElements = businessObject['extensionElements'] || bpmnFactory.create('bpmn:ExtensionElements', { values: [] })
  let extensionProperties = extensionElements.values.filter(e => e.$type === propertiesBpmnName)[0] || bpmnFactory.create(propertiesBpmnName, { values: [] })

  // 剔除重复数据
  extensionElements.values = extensionElements.values.filter(e => e.$type !== propertiesBpmnName)
  extensionProperties.values = extensionProperties.values.filter(e => !properties.filter(e2 => e2.id === e.id).length)

  properties.forEach(e => {
    extensionProperties.values.push(bpmnFactory.create(propertyBpmnName, {
      ...e
    }))
  })
  extensionElements.values.push(extensionProperties)
  businessObject.extensionElements = extensionElements
}

export function getExtensionProperties (businessObject, ids = [], prefix = 'activiti') {
  const propertiesBpmnName = `${prefix}:Properties`

  const extensionElements = businessObject['extensionElements']
  if (extensionElements && extensionElements.values) {
    const extensionProperties = extensionElements.values.filter(e => e.$type === propertiesBpmnName)[0]
    if (extensionProperties && extensionProperties.values) {
      return extensionProperties.values.filter(e => ids.indexOf(e.id) !== -1)
    }
  }
  return []
}
