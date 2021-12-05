<template>
  <el-select
      v-model="selectValue"
      :placeholder="placeholder"
      size="mini"
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
  name: "index",
  props: {
    value: null,
    placeholder: null,
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style scoped>

</style>