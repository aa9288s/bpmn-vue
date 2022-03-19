<template>
  <div class="task-listener-container">
    <el-table :data="listenerList" size="mini" border>
      <el-table-column label="序号" width="50px" type="index"/>
      <el-table-column label="事件类型" min-width="80px" show-overflow-tooltip
                       :formatter="row => listenerEventTypeObject[row.event]"/>
      <el-table-column label="事件id" min-width="80px" prop="id" show-overflow-tooltip/>
      <el-table-column label="监听器类型" min-width="80px" show-overflow-tooltip
                       :formatter="row => listenerTypeObject[row.listenerType]"/>
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
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
        <el-form label-width="100px" size="mini">
          <el-form-item label="事件类型">
            <custom-select
              v-model="listenerDialog.form.event"
              :options="eventOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item label="监听器类型">
            <custom-select
              v-model="listenerDialog.form.listenerType"
              :options="listenerOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item
            v-for="option in listenerOptions"
            :key="`listener-expression-item-${option.value}`"
            :label="option.label"
            v-show="listenerDialog.form.listenerType === option.value"
          >
            <el-input
              v-model="listenerDialog.form[option.value]"
              :placeholder="`请输入${option.label}......`"
              :key="`listener-expression-input-${option.value}`"
              clearable
            />
          </el-form-item>
        </el-form>
        <el-divider/>
        <el-table
          :data="fieldList"
          size="mini"
          max-height="240"
          border
          fit
        >
          <el-table-column label="序号" width="50px" type="index"/>
          <el-table-column label="字段名称" min-width="100px" prop="name"/>
          <el-table-column label="字段类型" min-width="80px" show-overflow-tooltip
                           :formatter="row => fieldTypeObject[row.fieldType]"/>
          <el-table-column label="字段值/表达式" min-width="100px" show-overflow-tooltip
                           :formatter="row => row.string || row.expression"/>
          <el-table-column label="操作" width="100px">
            <template slot-scope="{ row, $index }">
              <el-button size="mini" type="text" @click="openListenerFieldForm(row, $index)">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListenerField(row, $index)">移除
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
              @click="openFieldDialog"
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
      title="添加字段"
      append-to-body
    >
      <el-card>
        <el-form label-width="100px" size="mini">
          <el-form-item label="事件类型">
            <custom-select
              v-model="listenerDialog.form.event"
              :options="eventOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item label="监听器类型">
            <custom-select
              v-model="listenerDialog.form.listenerType"
              :options="listenerOptions"
              clearable
            ></custom-select>
          </el-form-item>

          <el-form-item
            v-for="option in listenerOptions"
            :key="`listener-expression-item-${option.value}`"
            :label="option.label"
            v-show="listenerDialog.form.listenerType === option.value"
          >
            <el-input
              v-model="listenerDialog.form[option.value]"
              :placeholder="`请输入${option.label}......`"
              :key="`listener-expression-input-${option.value}`"
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
  name: "task-listener-property",
  components: {
    CustomSelect
  },
  props: {},
  data () {
    return {
      listenerList: [],
      fieldList: [],
      listenerDialog: {
        visible: false,
        form: {}
      },
      fieldDialog: {
        visible: false
      },
      eventOptions: [
        {
          value: 'create',
          label: '新建'
        },
        {
          value: 'assignment',
          label: '分派'
        },
        {
          value: 'complete',
          label: '完成'
        },
        {
          value: 'delete',
          label: '删除'
        }
      ],
      listenerOptions: [
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
      ]
    }
  },
  methods: {
    openTaskListenerDialog () {
      this.listenerDialog.visible = true
    },
    openFieldDialog () {
      this.fieldDialog.visible = true
    },
    saveListener () {

      this.cancelListener()
    },
    cancelListener () {

      this.listenerDialog.visible = false
    },
    saveField () {

      this.cancelField()
    },
    cancelField () {

      this.fieldDialog.visible = false
    }
  }
}
</script>

<style scoped>

</style>
