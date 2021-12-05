<template>
  <el-tabs
      v-model="activatedTabName"
      class="bpmn-properties-panel"
      type="border-card"
  >
    <el-tab-pane
        v-for="(activatedTab) in activatedTabs"
        :key="activatedTab.id"
        :name="activatedTab.id"
        :label="activatedTab.label"
    >
      <el-form
          size="mini"
          label-width="80px"
      >
        <panel-property
            v-for="prop in activatedTab.props"
            :key="prop.id"
            :config="prop"
            :element="activatedElement"
            :modeler="{modeling, bpmnFactory}"
        ></panel-property>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {is} from 'bpmn-js/lib/util/ModelUtil'
import panelTabs from '../resources/tabs.json'
import panelProps from '../resources/props.json'
import PanelProperty from '../../properties/src/index'

export default {
  name: "PropertiesPanel",
  components: {
    PanelProperty
  },
  data() {
    return {
      eventBus: {},
      modeling: {},
      bpmnFactory: {},
      activatedTabs: [],
      activatedTabName: '',
      activatedElement: {}
    }
  },
  mounted() {
    this.initial()
  },
  methods: {
    initial() {
      this.eventBus.on('root.added', event => {
        this.activeTabs(event.element)
      })

      this.eventBus.on('element.click', event => {
        console.log(is(event.element, 'bpmn:BaseElement'))
        console.log(event.element)
        this.activeTabs(event.element)
      })
    },
    activeTabs(element) {
      this.activatedElement = element
      const activatedTabs = []
      panelTabs.filter(tab => tab.allow.filter(type => is(element, type)).length > 0).forEach(tab => {
        const activatedTab = {
          ...tab,
          props: []
        }
        tab.props.forEach(prop => {
          const props = panelProps.filter(panelProp => panelProp.id === prop && panelProp.allow.filter(type => is(element, type)).length > 0)
          activatedTab.props = activatedTab.props.concat(props)
        })
        activatedTabs.push(activatedTab)
      })
      this.activatedTabs = activatedTabs
      this.activatedTabName = activatedTabs[0].id
    }
  }
}
</script>

<style scoped>
.bpmn-properties-panel {
  height: calc(100% - 6px);
}
</style>
