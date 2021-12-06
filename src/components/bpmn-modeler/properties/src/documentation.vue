<template>
  <el-form-item
      :label="property.label"
  >
    <el-input
        v-model="textValue"
        :placeholder="`请输入${property.label}......`"
        type="textarea"
        :rows="5"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: "TextProperty",
  props: {
    property: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      textValue: ''
    }
  },
  watch: {
    textValue(text) {
      this.property.set(this.property.element, text)
    },
    property() {
      this.textValue = this.property.get(this.property.element)
    }
  }
}
</script>

<style scoped>

</style>