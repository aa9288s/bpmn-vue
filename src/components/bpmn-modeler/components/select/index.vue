<template>
  <el-select
    v-model="selectValue"
    :placeholder="placeholder"
    size="mini"
    :filterable="filterable"
    :filter-method="filterMethod"
    :multiple="multiple"
    :clearable="clearable"
    @change="onChange"
  >
    <el-option
      v-for="(option, i) in options"
      :key="i"
      :value="option.value"
      :label="option.label"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: "select",
  props: {
    value: null,
    placeholder: null,
    options: {
      type: Array,
      default () {
        return []
      }
    },
    filterable: {
      type: Boolean,
      default () {
        return false;
      }
    },
    filterMethod: {
      type: Function,
      default () {
        return null
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false;
      }
    },
    clearable: {
      type: Boolean,
      default () {
        return false;
      }
    },
  },
  data () {
    return {}
  },
  computed: {
    selectValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    onChange (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
