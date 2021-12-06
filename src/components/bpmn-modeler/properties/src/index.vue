<template>
  <div class="panel-property">
    <string-property
        v-if="property.type === 'string'"
        :property="property"
    ></string-property>

    <text-property
        v-if="property.type === 'documentation'"
        :property="property"
    ></text-property>

    <assignment-property
        v-if="property.type === 'assignment'"
        :property="property"
    ></assignment-property>
  </div>
</template>

<script>
import StringProperty from './string'
import TextProperty from './documentation'
import AssignmentProperty from './assignment'

export default {
  name: "PanelProperty",
  components: {
    StringProperty,
    TextProperty,
    AssignmentProperty
  },
  props: {
    property: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>

</style>
