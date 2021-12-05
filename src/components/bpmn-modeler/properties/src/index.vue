<template>
  <div class="panel-property">
    <string-property
        v-if="config.type === 'string' || config.type === 'text'"
        v-model="value"
        :config="config"
    ></string-property>

    <assignment-property
        v-if="config.type === 'assignment'"
        v-model="value"
        :config="config"
    ></assignment-property>
  </div>
</template>

<script>
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil'

import StringProperty from './string'
import AssignmentProperty from './assignment'

export default {
  name: "PanelProperty",
  components: {
    StringProperty,
    AssignmentProperty
  },
  props: {
    modeler: {
      type: Object,
      default() {
        return {}
      }
    },
    element: {
      type: Object,
      default() {
        return {}
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      modeling: {},
      bpmnFactory: {},
      value: null
    }
  },
  watch: {
    value: {
      deep: true,
      handler(nv, ov) {
        if (nv !== ov && nv !== null && nv !== undefined) {
          this.setValue(nv)
        }
      }
    },
    element: {
      deep: true,
      handler() {
        this.value = this.getValue()
      }
    }
  },
  created() {
    this.modeling = this.modeler.modeling
    this.bpmnFactory = this.modeler.bpmnFactory
  },
  mounted() {
  },
  methods: {
    setValue(value) {
      if (this.config.isAttr) {
        const obj = {}
        obj[this.config.name] = value
        this.modeling.updateProperties(this.element, obj)
      } else {
        if (this.config.isBody) {
          this.setExtension(this.config.name, {
            text: value
          })
        }
      }
    },
    getValue() {
      if (this.config.isAttr) {
        return getBusinessObject(this.element)[this.config.name]
      }
      if (this.config.isBody) {
        const extension = this.getExtension(this.config.name)
        return extension.length === 0 ? null : extension[0].get('text')
      }
    },
    setExtension(type, props) {
      const businessObject = getBusinessObject(this.element)
      businessObject.extensionElements = businessObject.extensionElements || this.createExtensionElements()
      const extensionElement = this.createElement(type, props)
      let existsElement = businessObject.extensionElements.get('values').filter(e => is(e, type))[0]
      if (existsElement) {
        Object.keys(existsElement).forEach(key => {
          existsElement.set(key, props[key])
        })

      } else {
        businessObject.extensionElements.get('values').push(extensionElement)
      }
    },
    getExtension(type) {
      const businessObject = getBusinessObject(this.element)
      if (businessObject.extensionElements) {
        return businessObject.extensionElements.get('values').filter(e => is(e, type))
      }
      return []
    },
    createExtensionElements() {
      return this.createElement('bpmn:ExtensionElements')
    },
    createElement(type, props) {
      return this.bpmnFactory.create(type, props)
    }
  }
}
</script>

<style scoped>

</style>
