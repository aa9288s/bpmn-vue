<template>
  <div class="service-task-property-container">
    <el-form-item label="代理类">
      <el-input v-model="clazz"/>
    </el-form-item>

    <el-form-item label="表达式">
      <el-input v-model="expression"/>
    </el-form-item>

    <field-list-property v-model="fieldList" :bpmn-factory="bpmnFactory" :panel-type="panelType"/>
  </div>
</template>

<script>
import {addExtensionElements, getExtensionElements} from '../utils/ElementUtil'
import FieldListProperty from './field-list-property'

export default {
  name: "service-task-like-property",
  components: {
    FieldListProperty
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    bpmnFactory: {
      type: Object,
      default () {
        return {};
      }
    },
    panelType: {
      type: String,
      default () {
        return 'activiti'
      }
    }
  },
  computed: {
    clazz: {
      get () {
        const businessObject = { ...this.value }
        return businessObject.class
      },
      set (clazz) {
        const businessObject = { ...this.value }
        businessObject.class = clazz
        this.$emit('input', businessObject)
      }
    },
    expression: {
      get () {
        const businessObject = { ...this.value }
        return businessObject.expression
      },
      set (expression) {
        const businessObject = { ...this.value }
        businessObject.expression = expression
        this.$emit('input', businessObject)
      }
    },
    fieldList: {
      get () {
        const businessObject = { ...this.value }
        const fieldList = getExtensionElements(businessObject, `${this.panelType}:Field`)
        console.log(fieldList)
        return fieldList
      },
      set (fieldList) {
        const businessObject = { ...this.value }
        if (fieldList) {
          const extensionElements = businessObject['extensionElements'] || this.bpmnFactory.create('bpmn:ExtensionElements', { values: [] })
          // 剔除重复数据
          extensionElements.values = extensionElements.values.filter(e => e.$type !== `${this.panelType}:Field`)
          console.log(fieldList)
          extensionElements.values = extensionElements.values.concat(fieldList)
          businessObject.extensionElements = extensionElements
        } else {
          addExtensionElements(businessObject, [], `${this.panelType}:Field`, this.bpmnFactory)
        }
        this.$emit('input', businessObject)
      }
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>
