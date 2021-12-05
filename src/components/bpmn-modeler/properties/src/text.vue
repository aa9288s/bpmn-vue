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
  computed: {
    textValue: {
      get() {
        const documentation = this.property.getAttribute('documentation')
        if (documentation && documentation.length) {
          return documentation[0].get('text')
        } else {
          return ''
        }
      },
      set(text) {
        if (text) {
          this.property.setAttribute('documentation', [
            this.property.createElement('bpmn:Documentation', {
              text: text
            })
          ])
        } else {
          this.property.setAttribute('documentation', [])
        }
      }
    }
  }
}
</script>

<style scoped>

</style>