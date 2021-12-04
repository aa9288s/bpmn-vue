<template>
  <div class="panel-property">
    <string-property v-if="type === 'string'"></string-property>
  </div>
</template>

<script>
import StringProperty from './string'

export default {
  name: "PanelProperty",
  components: {
    StringProperty
  },
  props: {
    modeler: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default () {
        return '';
      }
    },
    element: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {}
}
</script>

<style scoped>

</style>
