<template>
  <el-dialog
    :title="`选中节点：${businessObject.name || ''}`"
    :visible.sync="panelVisible"
  >
    <el-form size="mini" label-width="100px">
      <el-tabs
        v-model="activatedTabName"
        class="bpmn-properties-panel"
        type="border-card"
      >
        <el-tab-pane name="Normal" label="基础属性">
          <el-form-item label="id">
            <string-property v-model="businessObject.id"></string-property>
          </el-form-item>

          <el-form-item label="名称">
            <string-property v-model="businessObject.name"></string-property>
          </el-form-item>

          <el-form-item label="关联的表单" v-if="is(element, 'bpmn:UserTask')">
            <task-form-property v-model="businessObject.formKey"></task-form-property>
          </el-form-item>

          <el-form-item label="文档">
            <documentation-property
              v-model="businessObject.documentation"
              :bpmn-factory="bpmnFactory"
            ></documentation-property>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="Assignment" label="任务分派" v-if="is(element, 'bpmn:UserTask')">
          <task-assignment-property
            v-model="businessObject"
            :panel-type="config.type"
            :bpmn-factory="bpmnFactory"
          ></task-assignment-property>
        </el-tab-pane>
        <el-tab-pane name="TaskListener" label="任务监听器" v-if="is(element, 'bpmn:UserTask')">
          <task-listener-property
            v-model="businessObject"
            :bpmn-factory="bpmnFactory"
            :panel-type="config.type"
          ></task-listener-property>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-row slot="footer">
      <el-col :span="24" align="right">
        <el-button @click="save" size="mini">保存</el-button>
        <el-button @click="cancel" size="mini">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {is} from 'bpmn-js/lib/util/ModelUtil'
import StringProperty from '../properties/spring-property'
import DocumentationProperty from '../properties/documentation-property'
import TaskFormProperty from '../properties/task-form-property'
import TaskAssignmentProperty from '../properties/task-assignment-property'
import TaskListenerProperty from '../properties/task-listener-property'

export default {
  name: "PropertiesPanel",
  components: {
    StringProperty,
    DocumentationProperty,
    TaskFormProperty,
    TaskAssignmentProperty,
    TaskListenerProperty
  },
  data () {
    return {
      config: {},
      eventBus: {},
      modeling: {},
      bpmnFactory: {},
      panelVisible: false,
      activatedTabName: 'Normal',
      businessObject: {},
      element: {},
      is: is
    }
  },
  mounted () {
    this.initial()
  },
  methods: {
    initial () {
      this.eventBus.on('element.dblclick', event => {
        console.log(event.element)
        this.openDialog(event.element)
      })
    },
    openDialog (element) {
      this.element = element
      let businessObject = {}
      for (let i in element.businessObject) {
        // 剔除原生属性
        if (['$type', 'di', 'isForCompensation', 'startQuantity', 'completionQuantity',
          'async', 'asyncBefore', 'asyncAfter', 'exclusive', '$instanceOf', 'get', 'set'].indexOf(i) === -1) {
          businessObject[i] = element.businessObject.get(i)
        }
      }
      this.businessObject = businessObject
      this.activatedTabName = 'Normal'
      this.panelVisible = true
    },
    save () {
      console.log(this.businessObject)
      this.modeling.updateProperties(this.element, this.businessObject)
      this.panelVisible = false
    },
    cancel () {
      this.panelVisible = false
    }
  }
}
</script>

<style scoped>
.bpmn-properties-panel {
  height: calc(100% - 6px);
}
</style>
