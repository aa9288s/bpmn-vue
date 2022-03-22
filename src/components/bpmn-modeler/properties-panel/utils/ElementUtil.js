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

export function addTaskListeners (businessObject = {}, listenerObjs = {}, bpmnFactory = {}, prefix = 'activiti') {
  const listenerBpmnName = `${prefix}:TaskListener`
  const fieldBpmnName = `${prefix}:Field`

  const extensionElements = businessObject['extensionElements'] || bpmnFactory.create('bpmn:ExtensionElements', { values: [] })
  // 剔除重复数据
  extensionElements.values = extensionElements.values.filter(e => e.$type !== listenerBpmnName)

  listenerObjs.forEach(listenerObj => {
    listenerObj.fields = listenerObj.fields.map(e => {
      return bpmnFactory.create(fieldBpmnName, e)
    })
    extensionElements.values.push(bpmnFactory.create(listenerBpmnName, listenerObj))
  })

  businessObject.extensionElements = extensionElements
}

export function getTaskListeners (businessObject, prefix = 'activiti') {
  const listenerBpmnName = `${prefix}:TaskListener`

  const extensionElements = businessObject['extensionElements']
  if (extensionElements && extensionElements.values) {
    return extensionElements.values.filter(e => e.$type === listenerBpmnName)
  }
  return []
}


export function addExecutionListeners (businessObject = {}, listenerObjs = {}, bpmnFactory = {}, prefix = 'activiti') {
  const listenerBpmnName = `${prefix}:ExecutionListener`
  const fieldBpmnName = `${prefix}:Field`

  const extensionElements = businessObject['extensionElements'] || bpmnFactory.create('bpmn:ExtensionElements', { values: [] })
  // 剔除重复数据
  extensionElements.values = extensionElements.values.filter(e => e.$type !== listenerBpmnName)

  listenerObjs.forEach(listenerObj => {
    listenerObj.fields = listenerObj.fields.map(e => {
      return bpmnFactory.create(fieldBpmnName, e)
    })
    extensionElements.values.push(bpmnFactory.create(listenerBpmnName, listenerObj))
  })

  businessObject.extensionElements = extensionElements
}

export function getExecutionListeners (businessObject, prefix = 'activiti') {
  const listenerBpmnName = `${prefix}:ExecutionListener`

  const extensionElements = businessObject['extensionElements']
  if (extensionElements && extensionElements.values) {
    return extensionElements.values.filter(e => e.$type === listenerBpmnName)
  }
  return []
}
