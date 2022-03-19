<template>
  <el-input v-model="stringValue" :placeholder="`请输入......`"/>
</template>

<script>
export default {
  name: "spring-property",
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    stringValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<style scoped>

</style>
