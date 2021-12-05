<template>
  <div class="bpmn-table">
    <el-table
        :data="data"
        border
        size="mini"
        style="width: 100%"
    >
      <el-table-column
          v-if="selectable"
          type="selection"
          width="55"
          align="center"
      ></el-table-column>

      <el-table-column
          v-if="index"
          type="index"
          width="55"
          align="center"
          label="序号"
      ></el-table-column>

      <template v-for="(column, i) in columns">
        <el-table-column
            :key="`table-column-key-${i}`"
            :width="column.width"
            :label="column.label"
            :prop="column.prop"
            :align="column.align"
        >
          <template
              slot-scope="scope"
          >
            <template v-if="column.buttons && column.buttons.length > 0">
              <el-button
                  v-for="(button, i) in column.buttons"
                  :key="`btn-key-${i}`"
                  size="mini"
                  :type="button.type"
                  :icon="button.icon"
                  :round="button.round"
                  :circle="button.circle"
                  @click="button.click? button.click(scope.row, button.$this) : () => {}"
              >
                {{ button.name }}
              </el-button>
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>

    </el-table>

    <el-pagination
        v-if="pageable"
        small
        layout="prev, pager, next"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "BpmnTable",
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    pageable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    selectable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    index: {
      type: Boolean,
      default() {
        return false;
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      pagination: {
        current: 1,
        size: 20,
        total: 0
      }
    }
  },
  methods: {
    currentChange(current) {
      this.$emit('load', current, this.pagination.size)
    }
  }
}
</script>

<style scoped>

</style>