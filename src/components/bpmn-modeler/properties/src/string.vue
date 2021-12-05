<template>
  <el-form-item
      :label="property.label"
  >
    <el-input
        v-model="stringValue"
        :placeholder="`请输入${property.label}......`"
        :rows="5"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: "string",
  props: {
    property: {
      type: Object,
      default() {
        return null
      }
    }
  },
  computed: {
    stringValue: {
      get() {
        return this.property.getAttributeValue()
      },
      set(value) {
        this.property.setAttributeValue(value)
      }
    }
  }
}
</script>

<style scoped>

</style>
