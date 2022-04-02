<template>
  <div class="fields-property-container">
    <el-table
      :data="fieldList"
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

export default {
  name: "field-list-property",
  components: {
    CustomSelect
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
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
      fieldDialog: {
        visible: false,
        $index: -1,
        form: {}
      },
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
    fieldList: {
      get () {
        if (this.value) {
          const fieldList = [...this.value]
          return fieldList.map(field => {
            const fieldObj = {}
            fieldObj.name = field.name
            fieldObj.type = this.fieldTypeOptions.filter(e => !!field[e.value])[0]?.value
            fieldObj[fieldObj.type] = field[fieldObj.value]
            return fieldObj
          })
        }
        return []
      },
      set (fieldList) {
        if (fieldList && fieldList.length) {
          this.$emit('input', fieldList.map(field => {
            const fieldObj = {}
            fieldObj.name = field.name
            fieldObj[field.type] = field[field.type]
            return this.bpmnFactory.create(`${this.panelType}:Field`, fieldObj)
          }))
        } else {
          this.$emit('input', null)
        }
      }
    }
  },
  methods: {
    fieldTypeLabel (type) {
      return this.fieldTypeOptions.filter(e => e.value === type)[0]?.label
    },
    openFieldDialog (form, $index) {
      this.fieldDialog.$index = $index === null || $index === undefined ? -1 : $index
      this.fieldDialog.form = form ? { ...form } : {}
      this.fieldDialog.visible = true
    },
    saveField () {
      this.$refs['fieldForm'].validate(valid => {
        if (valid) {
          let fieldList = this.fieldList || []
          if (this.fieldDialog.$index === -1) {
            if (fieldList.filter(e => e.name === this.fieldDialog.form.name).length) {
              this.$message.warning(`字段[${this.fieldDialog.form.name}]已存在`)
              return
            }
            fieldList.push(this.fieldDialog.form)
            this.fieldList = fieldList
            this.$message.success('字段保存成功')
          } else {
            if (fieldList.filter((e, i) => i !== this.fieldDialog.$index && e.name === this.fieldDialog.form.name).length) {
              this.$message.warning(`字段[${this.fieldDialog.form.name}]已存在`)
              return
            }
            fieldList[this.fieldDialog.$index] = this.fieldDialog.form
            this.fieldList = fieldList
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
    }
  }
}
</script>

<style scoped>

</style>
