<template>
  <el-input
    v-model="stringValue"
    :placeholder="`请输入......`"
    type="textarea"
    :rows="5"
  />
</template>

<script>
export default {
  name: "documentation-property",
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    bpmnFactory: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    stringValue: {
      get () {
        const documentation = this.value
        if (documentation && documentation.length) {
          return documentation[0].get('text')
        } else {
          return ''
        }
      },
      set (val) {
        if (val) {
          this.$emit('input', [
            this.bpmnFactory.create('bpmn:Documentation', {
              text: val
            })
          ])
        } else {
          this.$emit('input', [])
        }
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
