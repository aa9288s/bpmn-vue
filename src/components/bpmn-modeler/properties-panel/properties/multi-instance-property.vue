<template>
  <div class="multi-instance-container">
    <el-form
      size="mini"
      label-width="100px"
    >
      <el-form-item label="多实例类型">
        <custom-select
          v-model="multiInstanceType"
          :options="typeOptions"
          placeholder="请选择多实例类型..."
          clearable
        />
      </el-form-item>

      <template v-if="multiInstanceType">
        <el-form-item label="循环基数">
          <el-input v-model="loopCardinality" placeholder="请输入循环基数..." clearable/>
        </el-form-item>

        <el-form-item label="元素集合">
          <el-input v-model="collection" placeholder="请输入元素集合..." clearable/>
        </el-form-item>

        <el-form-item label="元素变量">
          <el-input v-model="elementVariable" placeholder="请输入元素变量..." clearable/>
        </el-form-item>

        <el-form-item label="完成条件">
          <el-input v-model="completionCondition" placeholder="请输入完成条件..." clearable/>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import CustomSelect from '../../components/select/index'

export default {
  name: "multi-instance-property",
  components: {
    CustomSelect
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
        return {}
      }
    }
  },
  computed: {
    multiInstanceType: {
      get () {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          return businessObject.loopCharacteristics.isSequential ? 'Sequential' : 'Parallel'
        }
        return ''
      },
      set (type) {
        const businessObject = { ...this.value }
        if (type) {
          businessObject.loopCharacteristics = businessObject.loopCharacteristics || this.bpmnFactory.create('bpmn:MultiInstanceLoopCharacteristics')
          businessObject.loopCharacteristics.isSequential = type === 'Sequential'
        } else {
          businessObject.loopCharacteristics = undefined
        }
        this.$emit('input', businessObject)
      }
    },
    loopCardinality: {
      get () {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          return businessObject.loopCharacteristics.loopCardinality?.body
        }
        return ''
      },
      set (loopCardinality) {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          if (loopCardinality) {
            businessObject.loopCharacteristics.loopCardinality = this.bpmnFactory.create('bpmn:Expression', { body: loopCardinality })
          } else {
            businessObject.loopCharacteristics.loopCardinality = undefined
          }
          this.$emit('input', businessObject)
        }
      }
    },
    collection: {
      get () {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          return businessObject.loopCharacteristics.collection
        }
        return ''
      },
      set (collection) {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          if (collection) {
            businessObject.loopCharacteristics.collection = collection
          } else {
            businessObject.loopCharacteristics.collection = undefined
          }
          this.$emit('input', businessObject)
        }
      }
    },
    elementVariable: {
      get () {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          return businessObject.loopCharacteristics.elementVariable
        }
        return ''
      },
      set (elementVariable) {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          if (elementVariable) {
            businessObject.loopCharacteristics.elementVariable = elementVariable
          } else {
            businessObject.loopCharacteristics.elementVariable = undefined
          }
          this.$emit('input', businessObject)
        }
      }
    },
    completionCondition: {
      get () {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          return businessObject.loopCharacteristics.completionCondition?.body
        }
        return ''
      },
      set (completionCondition) {
        const businessObject = { ...this.value }
        if (businessObject.loopCharacteristics) {
          if (completionCondition) {
            businessObject.loopCharacteristics.completionCondition = this.bpmnFactory.create('bpmn:Expression', { body: completionCondition })
          } else {
            businessObject.loopCharacteristics.completionCondition = undefined
          }
          this.$emit('input', businessObject)
        }
      }
    }
  },
  data () {
    return {
      typeOptions: [
        {
          value: 'Parallel',
          label: '并行'
        },
        {
          value: 'Sequential',
          label: '串行'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
