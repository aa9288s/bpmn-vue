<template>
  <div class="bpmn-panel-assigment">
    <el-form-item label-width="0">
      <el-row>
        <el-col :span="20">
          <el-input
              v-model="keyword"
              clearable
              placeholder="请输入关键词..."
          >
            <bpmn-select
                style="width: 100px;"
                v-model="assignmentType"
                slot="prepend"
                :options="typeOptions"
            ></bpmn-select>
            <template slot="append">
              <el-button
                  icon="el-icon-check"
                  @click="addAssignment(keyword)"
              ></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="4" align="right">
          <el-button
              icon="el-icon-search"
              @click="openDialog"
          ></el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <el-table
        :data="assignmentList"
        border
        size="mini"
        style="width: 100%"
    >
      <el-table-column
          prop="typeLabel"
          label="类型"
          align="center"
          width="80px"
      ></el-table-column>
      <el-table-column
          prop="label"
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
              @click="assignmentList = assignmentList.filter(e => e.id !== scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        :title="`设置${assignmentLabel}`"
        :visible.sync="dialog.visible"
        :close-on-click-modal="false"
        :show-close="false"
    >
      <el-form size="mini">
        <el-row>
          <el-col
              :span="12"
              :offset="12"
          >
            <el-form-item>
              <el-input
                  v-model="dialog.keyword"
                  placeholder="请输入关键词..."
                  clearable
              >
                <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="dialogSearch"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <bpmn-table
          :data="dialog.tableData"
          :columns="dialog.tableColumns"
          index
      ></bpmn-table>

      <el-row v-if="dialog.selectedList && dialog.selectedList.length > 0">
        <el-col>
          <span> 已选择：</span>
          <el-tag
              v-for="tag in dialog.selectedList"
              :key="tag.id"
              closable
              type="success"
              @close="dialog.selectedList = dialog.selectedList.filter(selected => selected.id !== tag.id)"
          >
            {{ tag.label }}
          </el-tag>
        </el-col>
      </el-row>

      <div slot="footer">
        <el-row>
          <el-col>
            <el-button
                type="info"
                size="mini"
                icon="el-icon-close"
                @click="dialog.visible = false"
            >
              取消
            </el-button>
            <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                @click="dialogConfirm"
            >
              确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BpmnTable from '../../components/table/index'
import BpmnSelect from '../../components/select/index'

export default {
  name: "assignment",
  components: {
    BpmnTable,
    BpmnSelect
  },
  props: {
    property: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialog: {
        visible: false,
        keyword: '',
        selectedList: [],
        tableData: [],
        tableColumns: [
          {
            prop: 'label',
            label: '名称',
            align: 'center'
          },
          {
            label: '操作',
            align: 'center',
            width: 100,
            buttons: [
              {
                id: 'delete',
                icon: 'el-icon-check',
                type: 'success',
                circle: true,
                $this: this,
                click(row, $this) {
                  let selectedList = $this.dialog.selectedList
                  const assignmentType = $this.assignmentType
                  if (selectedList.indexOf(row.id) === -1) {
                    if (assignmentType === 'assignee') {
                      $this.dialog.selectedList = [row]
                    } else {
                      $this.dialog.selectedList.push(row)
                    }

                  }
                }
              }
            ]
          }
        ]
      },
      keyword: '',
      assignmentType: 'assignee',
      typeOptions: [
        {
          value: 'assignee',
          label: '签收人'
        },
        {
          value: 'candidateUsers',
          label: '候选人'
        },
        {
          value: 'candidateGroups',
          label: '候选组'
        },
        {
          value: 'candidateRoles',
          label: '候选角色'
        }

      ],
      assignmentList: []
    }
  },
  computed: {
    assignmentLabel() {
      return this.typeOptions.filter(option => option.value === this.assignmentType)[0].label
    },
    hasAssignee() {
      return this.assignmentList.filter(assignment => assignment.type === 'assignee').length > 0
    },
    isAssigneeType() {
      return this.assignmentType === 'assignee'
    }
  },
  methods: {
    openDialog() {
      this.dialog.keyword = ''
      this.dialog.tableData = []
      this.dialog.selectedList = []
      this.dialog.visible = true
    },
    dialogSearch() {
      switch (this.assignmentType) {
        case "assignee":
        case 'candidateUsers':
          this.findUsers(this.dialog.keyword, users => {
            this.dialog.tableData = users || []
          })
          break
      }
    },
    findUsers(keyword, callback) {
      if (keyword) {
        //TODO
        keyword = keyword.trim()
        callback([
          {
            id: 'yaozhendong',
            label: '姚振东'
          }, {
            id: 'huangzhixiong',
            label: '黄职雄'
          }
        ])
      }
    },
    dialogConfirm() {
      this.addAssignment(this.dialog.selectedList)
    },
    addAssignment(assignmentList) {
      if (!assignmentList) {
        return
      }
      if (!this.isAssigneeType && this.hasAssignee) {
        this.$message.warning('已设置签收人')
        return;
      }
      if (typeof assignmentList === 'string') {
        assignmentList = [
          {
            id: assignmentList,
            label: assignmentList,
            type: this.assignmentType
          }
        ]
      }

      if (this.isAssigneeType) {
        this.assignmentList = this.assignmentList.filter(assignment => assignment.type !== 'assignee')
      }

      assignmentList = assignmentList.filter(selected => {
        selected.type = this.assignmentType
        selected.typeLabel = this.assignmentLabel
        return this.assignmentList.filter(assignment => assignment.type === selected.type && assignment.id === selected.id).length === 0
      })
      this.assignmentList = this.assignmentList.concat(assignmentList)
      this.dialog.visible = false
    }
  },
  watch: {
    assignmentList: {
      deep: true,
      handler() {
        const assignment = {}
        this.typeOptions.forEach(e => {
          assignment[e.value] = undefined
        })
        this.assignmentList.forEach(e => {
          if (!assignment[e.type]) {
            assignment[e.type] = e.id
          } else {
            assignment[e.type] += `,${e.id}`
          }
        })
        this.property.set(this.property.element, assignment)
      }
    },
    property: {
      deep: true,
      handler() {
      }
    }
  }
}
</script>

<style scoped>

</style>
