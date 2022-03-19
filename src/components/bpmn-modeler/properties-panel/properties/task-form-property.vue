<template>
  <custom-select
    v-model="selectValue"
    :options="options"
    placeholder="请选择......"
  ></custom-select>
</template>

<script>
import CustomSelect from '../../components/select/index'

export default {
  name: "task-form-property",
  components: {
    CustomSelect
  },
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      options: [
        {
          value: "1",
          label: "表单1"
        },
        {
          value: "2",
          label: "表单2"
        }
      ]
    }
  },
  computed: {
    selectValue: {
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
