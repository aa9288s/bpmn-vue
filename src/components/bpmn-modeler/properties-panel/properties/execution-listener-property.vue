<template>
  <div class="execution-listener-container">
    <el-table
      :data="listenerList"
      size="mini"
      border
    >
      <el-table-column
        label="序号"
        width="50px"
        type="index"
      />
      <el-table-column
        label="事件类型"
        min-width="80px"
        show-overflow-tooltip
        :formatter="row => listenerEventLabel(row.event)"
      />
      <el-table-column
        label="监听器类型"
        min-width="80px"
        show-overflow-tooltip
        :formatter="row => listenerTypeLabel(row.type)"
      />
      <el-table-column
        label="监听器的值"
        min-width="80px"
        show-overflow-tooltip
        :formatter="row => row[row.type]"
      />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openTaskListenerDialog(row, $index)">编辑</el-button>
          <el-divider direction="vertical"/>
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListener(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 10px;">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        style="width: 100%;"
        @click="openTaskListenerDialog"
      >
        添加监听器
      </el-button>
    </div>

    <el-dialog
      :visible.sync="listenerDialog.visible"
      title="任务监听器"
      append-to-body
    >
      <el-card>
        <el-form
          ref="listenerForm"
          label-width="100px"
          size="mini"
          :model="listenerDialog.form"
        >
          <el-form-item
            label="事件类型"
            prop="event"
            :rules="[{required: true, message: '请选择事件类型'}]"
          >
            <custom-select
              v-model="listenerDialog.form.event"
              :options="listenerEventOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item
            label="监听器类型"
            prop="type"
            :rules="[{required: true, message: '请选择监听器类型'}]"
          >
            <custom-select
              v-model="listenerDialog.form.type"
              :options="listenerTypeOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item
            v-if="listenerDialog.form.type"
            :label="listenerTypeLabel(listenerDialog.form.type)"
            :prop="listenerDialog.form.type"
            :rules="[{required: true ,message: `${listenerTypeLabel(listenerDialog.form.type)}不能为空`}]"
          >
            <el-input
              v-model="listenerDialog.form[listenerDialog.form.type]"
              :placeholder="`请输入${listenerTypeLabel(listenerDialog.form.type)}......`"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-divider/>

        <el-table
          :data="listenerDialog.form.fieldList"
          size="mini"
          max-height="240"
          border
          fit
        >
          <el-table-column
            label="序号"
            width="50px"
            type="index"
          />
          <el-table-column
            label="字段名称"
            min-width="100px"
            prop="name"
          />
          <el-table-column
            label="字段类型"
            min-width="80px"
            show-overflow-tooltip
            :formatter="row => fieldTypeLabel(row.type)"
          />
          <el-table-column
            label="字段值/表达式"
            min-width="100px"
            show-overflow-tooltip
            :formatter="row => row[row.type]"
          />
          <el-table-column
            label="操作"
            width="100px"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="text"
                @click="openFieldDialog(row, $index)"
              >
                编辑
              </el-button>

              <el-divider direction="vertical"/>

              <el-button
                type="text"
                style="color: #ff4d4f"
                @click="removeField(row.name, $index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span="24" style="margin-top: 10px;">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              style="width: 100%;"
              @click="openFieldDialog()"
            >
              添加字段
            </el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-row slot="footer">
        <el-col :span="24" align="right">
          <el-button @click="saveListener" size="mini">保存</el-button>
          <el-button @click="cancelListener" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      :visible.sync="fieldDialog.visible"
      :title="`${fieldDialog.$index!==-1?'编辑':'添加'}字段`"
      append-to-body
    >
      <el-card>
        <el-form
          ref="fieldForm"
          label-width="100px"
          size="mini"
          :model="fieldDialog.form"
        >
          <el-form-item
            label="字段名称"
            prop="name"
            :rules="[{required: true, message: '字段名称不能为空'}]"
          >
            <el-input
              v-model="fieldDialog.form.name"
              placeholder="请输入字段名称......"
              clearable
            />
          </el-form-item>

          <el-form-item
            label="字段类型"
            prop="type"
            :rules="[{required: true, message: '请选择字段类型'}]"
          >
            <custom-select
              v-model="fieldDialog.form.type"
              :options="fieldTypeOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item
            v-if="fieldDialog.form.type"
            :label="fieldTypeLabel(fieldDialog.form.type)"
            :prop="fieldDialog.form.type"
            :rules="[{required: true, message: `${fieldTypeLabel(fieldDialog.form.type)}不能为空`}]"
          >
            <el-input
              v-model="fieldDialog.form[fieldDialog.form.type]"
              :placeholder="`请输入${fieldTypeLabel(fieldDialog.form.type)}......`"
              clearable
            />
          </el-form-item>
        </el-form>
      </el-card>

      <el-row slot="footer">
        <el-col :span="24" align="right">
          <el-button @click="saveField" size="mini">保存</el-button>
          <el-button @click="cancelField" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import CustomSelect from '../../components/select/index'
import {addExecutionListeners, getExecutionListeners} from '../utils/ElementUtil'

export default {
  name: "execution-listener-property",
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
    panelType: {
      type: String,
      default () {
        return 'activiti'
      }
    },
    bpmnFactory: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      listenerDialog: {
        visible: false,
        $index: -1,
        form: {
          fieldList: []
        }
      },
      fieldDialog: {
        visible: false,
        $index: -1,
        form: {}
      },
      listenerEventOptions: [
        {
          value: 'start',
          label: '开始'
        },
        {
          value: 'end',
          label: '完成'
        }
      ],
      listenerTypeOptions: [
        {
          value: 'class',
          label: 'Java类'
        },
        {
          value: 'expression',
          label: '表达式'
        },
        {
          value: 'delegateExpression',
          label: '代理表达式'
        }
      ],
      fieldTypeOptions: [
        {
          value: 'string',
          label: '字符串'
        },
        {
          value: 'stringValue',
          label: '字符文本'
        },
        {
          value: 'expression',
          label: '表达式'
        }
      ]
    }
  },
  computed: {
    listenerList: {
      get () {
        const businessObject = {
          ...this.value
        }
        return getExecutionListeners(businessObject, this.panelType).map(e => {
          const listenerObj = {}
          listenerObj.event = e.event
          listenerObj.type = this.listenerTypeOptions.filter(e2 => !!e[e2.value])[0]?.value
          listenerObj[listenerObj.type] = e[listenerObj.type]
          listenerObj.fieldList = !e.fields ? [] : e.fields.map(e => {
            const fieldObj = {}
            fieldObj.name = e.name
            fieldObj.type = this.fieldTypeOptions.filter(e2 => !!e[e2.value])[0]?.value
            fieldObj[fieldObj.type] = e[fieldObj.type]
            return fieldObj
          })
          return listenerObj
        })
      },
      set (listenerList) {
        const businessObject = {
          ...this.value
        }
        const listenerObjs = listenerList.map(e => {
          const listenerObj = {}
          listenerObj.id = e.id
          listenerObj.event = e.event
          listenerObj[e.type] = e[e.type]
          listenerObj.fields = e.fieldList ? e.fieldList.map(e2 => {
            const field = {}
            field.name = e2.name
            field[e2.type] = e2[e2.type]
            return field
          }) : []
          return listenerObj
        })
        addExecutionListeners(businessObject, listenerObjs, this.bpmnFactory, this.panelType)
        this.$emit('input', businessObject)
      }
    }
  },
  methods: {
    listenerEventLabel (event) {
      return this.listenerEventOptions.filter(e => e.value === event)[0]?.label
    },
    listenerTypeLabel (type) {
      return this.listenerTypeOptions.filter(e => e.value === type)[0]?.label
    },
    fieldTypeLabel (type) {
      return this.fieldTypeOptions.filter(e => e.value === type)[0]?.label
    },
    openTaskListenerDialog (form, $index) {
      this.listenerDialog.$index = $index === null || $index === undefined ? -1 : $index
      this.listenerDialog.form = form ? { ...form } : { fieldList: [] }
      this.listenerDialog.visible = true
    },
    openFieldDialog (form, $index) {
      this.fieldDialog.$index = $index === null || $index === undefined ? -1 : $index
      this.fieldDialog.form = form ? { ...form } : {}
      this.fieldDialog.visible = true
    },
    saveListener () {
      this.$refs['listenerForm'].validate(validate => {
        if (validate) {
          if (this.listenerDialog.$index === -1) {
            this.listenerDialog.form.id = `Task_Listener_${Math.random().toString(36).slice(-8)}`
            const listenerList = [...this.listenerList]
            listenerList.push(this.listenerDialog.form)
            console.log(listenerList)
            this.listenerList = listenerList
            this.$message.success('执行监听器保存成功')
          } else {
            const listenerList = [...this.listenerList]
            listenerList[this.listenerDialog.$index] = this.listenerDialog.form
            this.listenerList = listenerList
            this.$message.success('执行监听器修改成功')
          }
          this.cancelListener()
        }
      })
    },
    cancelListener () {

      this.listenerDialog.visible = false
    },
    saveField () {
      this.$refs['fieldForm'].validate(valid => {
        if (valid) {
          let fieldList = this.listenerDialog.form.fieldList || []
          if (this.fieldDialog.$index === -1) {
            if (fieldList.filter(e => e.name === this.fieldDialog.form.name).length) {
              this.$message.warning(`字段[${this.fieldDialog.form.name}]已存在`)
              return
            }
            fieldList.push(this.fieldDialog.form)
            this.listenerDialog.form.fieldList = fieldList
            this.$message.success('字段保存成功')
          } else {
            if (fieldList.filter((e, i) => i !== this.fieldDialog.$index && e.name === this.fieldDialog.form.name).length) {
              this.$message.warning(`字段[${this.fieldDialog.form.name}]已存在`)
              return
            }
            this.listenerDialog.form.fieldList[this.fieldDialog.$index] = this.fieldDialog.form
            this.$message.success('字段修改成功')
          }
          this.cancelField()
        }
      })
    },
    cancelField () {
      this.fieldDialog.visible = false
    },
    removeField (name) {
      let fieldList = this.listenerDialog.form.fieldList
      this.listenerDialog.form.fieldList = fieldList.filter(e => e.name !== name)
      this.$message.success('字段移除成功')
    },
    removeListener (row, $index) {
      this.listenerList = this.listenerList.filter((e, i) => i !== $index)
    }
  }
}
</script>

<style scoped>

</style>
