<template>
  <div class="task-assignment-container">
    <div class="task-assignment-title">
      <span><i class="el-icon-menu" style="margin-right: 8px; color: #555555"></i>已选列表</span>
      <span>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="openSearchDialog"
        >
          搜索
        </el-button>

        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="openExpressionDialog"
        >
          表达式
        </el-button>
      </span>
    </div>

    <el-table
      :data="assignmentList"
      border
      size="mini"
      style="width: 100%"
    >
      <el-table-column
        label="类型"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span>{{ assignmentTypeLabel(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-delete"
            circle
            type="danger"
            @click="assignmentList = assignmentList.filter(e => e.type !== scope.row.type || e.id !== scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="搜索"
      append-to-body
      :visible.sync="searchDialog.visible"
    >
      <el-card>
        <el-form label-width="100px">
          <el-form-item label="类型">
            <custom-select
              v-model="searchDialog.assigmentType"
              placeholder="请选择......"
              :options="assignmentTypeOptions"
              @change="onSelectionTypeChange"
            ></custom-select>
          </el-form-item>

          <el-form-item :label="`所选${assignmentTypeLabel(searchDialog.assigmentType)}`">
            <el-tag
              v-for="selection in searchDialog.selections"
              :key="`${searchDialog.assigmentType}-${selection.value}`"
              type="success"
              closable
              @close="onSelectionClosed(selection.value)"
            >
              {{ `[${assignmentTypeLabel(selection.type)}]${selection.label}` }}
            </el-tag>

            <span v-if="!searchDialog.selections.length"
                  class="task-assignment-selection-empty">{{
                `没有选择${assignmentTypeLabel(searchDialog.assigmentType)}......`
              }}</span>
          </el-form-item>

          <el-form-item label="搜索">
            <custom-select
              multiple
              filterable
              @change="saveSelections"
              :filter-method="searchSelection"
              :options="searchDialog.options"
            ></custom-select>
          </el-form-item>
        </el-form>
      </el-card>

      <el-row slot="footer">
        <el-col :span="24" align="right">
          <el-button @click="saveSearch" size="mini">保存</el-button>
          <el-button @click="cancelSearch" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="表达式"
      :visible.sync="expressionDialog.visible"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="类型">
          <custom-select
            v-model="expressionDialog.assigmentType"
            placeholder="请选择......"
            :options="assignmentTypeOptions"
            @change="onSelectionTypeChange"
          ></custom-select>
        </el-form-item>

        <el-form-item label="表达式">
          <el-input v-model="expressionDialog.expression" size="mini"></el-input>
        </el-form-item>
      </el-form>

      <el-row slot="footer">
        <el-col :span="24" align="right">
          <el-button @click="saveExpression" size="mini">保存</el-button>
          <el-button @click="cancelExpression" size="mini">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import CustomSelect from '../../components/select/index'
import {addExtensionProperties, getExtensionProperties} from '../utils/ElementUtil'

export default {
  name: "task-assignment-property",
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
      // assignmentList: [],
      searchDialog: {
        visible: false,
        assigmentType: '',
        selections: [],
        options: []
      },
      expressionDialog: {
        visible: false,
        assigmentType: '',
        expression: ''
      },
      assignmentTypeOptions: [
        {
          value: 'candidateUsers',
          label: '人员'
        },
        {
          value: 'candidateRoles',
          label: '角色'
        }
      ]
    }
  },
  computed: {
    assignmentList: {
      get () {
        const businessObject = {
          ...this.value
        }
        const ids = this.assignmentTypeOptions.map(e => e.value)
        const properties = getExtensionProperties(businessObject, ids, this.panelType)
        return properties.map(e => {
          return {
            id: e.value,
            name: e.name,
            type: e.id
          }
        })
      },
      set (assignmentList) {
        const businessObject = {
          ...this.value
        }
        const candidateUsers = assignmentList.map(e => {
          // 封装任务指派
          if (e.type === 'candidateRoles') {
            return `roleAssignmentDelegate.getCandidateUsers("${e.id}")`
          } else {
            return e.id
          }
        })
        businessObject['candidateUsers'] = candidateUsers.join(',') || undefined

        // 封装进扩展属性中
        const properties = assignmentList.map(e => {
          return {
            id: e.type,
            name: e.name,
            value: e.id
          }
        })
        addExtensionProperties(businessObject, properties, this.bpmnFactory, this.panelType)
        this.$emit('input', businessObject)
      }
    }
  },
  methods: {
    openSearchDialog () {
      this.searchDialog.selections = []
      this.searchDialog.assigmentType = 'candidateUsers'
      this.searchDialog.options = []
      this.searchDialog.visible = true
    },
    assignmentTypeLabel (value) {
      return this.assignmentTypeOptions.filter(e => e.value === value)[0]?.label
    },
    onSelectionTypeChange () {
      this.searchDialog.options = []
    },
    onSelectionClosed (value) {
      this.searchDialog.selections = this.searchDialog.selections.filter(e => e.value !== value)
    },
    saveSelections (values) {
      let selections = this.searchDialog.options.filter(e => !values ? false : values.indexOf(e.value) !== -1)
      if (selections) {
        selections.forEach(e => {
          if (!this.searchDialog.selections.filter(e2 => e2.value === e.value).length) {
            this.searchDialog.selections.push({
              ...e,
              type: this.searchDialog.assigmentType
            })
          }
        })
      }

    },
    searchSelection (keyword) {
      if (this.searchDialog.assigmentType === 'candidateUsers') {
        this.searchUsers(keyword)
      } else if (this.searchDialog.assigmentType === 'candidateRoles') {
        this.searchRoles(keyword);
      }
    },
    searchUsers (keyword) {
      let options = []

      //TODO 搜索人员
      let result = [
        { value: 'u1', label: '人员1' },
        { value: 'u2', label: '人员2' },
        { value: 'u3', label: '人员3' },
        { value: 'u4', label: '人员4' }
      ]

      result.forEach(e => {
        if (e.label.indexOf(keyword) !== -1) {
          options.push({
            value: e.value,
            label: e.label
          })
        }
      })

      this.searchDialog.options = options
    },
    searchRoles (keyword) {
      let options = []

      //TODO 搜索角色
      let result = [
        { value: 'r1', label: '角色1' },
        { value: 'r2', label: '角色2' },
        { value: 'r3', label: '角色3' },
        { value: 'r4', label: '角色4' }
      ]

      result.forEach(e => {
        if (e.label.indexOf(keyword) !== -1) {
          options.push({
            value: e.value,
            label: e.label
          })
        }
      })

      this.searchDialog.options = options
    },
    saveSearch () {
      const assignmentList = [].concat(this.assignmentList)
      this.searchDialog.selections.forEach(e => {
        if (!this.assignmentList.filter(e2 => e2.id === e.value && e2.type === e.type).length) {
          assignmentList.push({
            id: e.value,
            name: e.label,
            type: e.type
          })
        }
      })
      this.assignmentList = assignmentList

      this.cancelSearch()
    },
    cancelSearch () {
      this.searchDialog.visible = false
    },
    openExpressionDialog () {
      this.expressionDialog.assigmentType = 'candidateUsers'
      this.expressionDialog.expression = ''
      this.expressionDialog.visible = true
    },
    saveExpression () {
      const assignmentList = [].concat(this.assignmentList)
      if (!this.assignmentList.filter(e => e.id === this.expressionDialog.expression && e.type === this.expressionDialog.assigmentType).length) {
        assignmentList.push({
          id: this.expressionDialog.expression,
          name: this.expressionDialog.expression,
          type: this.expressionDialog.assigmentType
        })
      }
      this.assignmentList = assignmentList
      this.cancelExpression()
    },
    cancelExpression () {
      this.expressionDialog.visible = false
    }
  }
}
</script>

<style scoped>
.task-assignment-title {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
}

.task-assignment-selection-empty {
  font-size: 12px;
  color: #606266;
}
</style>
