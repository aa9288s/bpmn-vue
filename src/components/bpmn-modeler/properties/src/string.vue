<template>
  <el-form-item
      :label="config.label"
  >
    <el-input
        v-model="stringValue"
        :placeholder="`请输入${config.label}......`"
        :type="config.type === 'string'? 'text' : 'textarea'"
        :rows="5"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: "string",
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    stringValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped>

</style>
