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
            v-for="property in activatedTab.properties"
            :key="`panel-property-${property.name}`"
            :property="property"
        ></panel-property>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {is} from 'bpmn-js/lib/util/ModelUtil'
import panelTabs from '../resources/tabs.json'
import panelProps from '../resources/props'
import PanelProperty from '../../properties/src/index'
import ElementWrapper from '../../properties/utils/ElementWrapper'

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
      activatedTabName: ''
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
        this.activeTabs(event.element)
      })

      this.eventBus.on('element.changed', event => {
        if (!is(event.element, 'bpmn:SequenceFlow')) {
          this.activeTabs(event.element)
        }
      })
    },
    activeTabs(element) {
      const activatedTabs = []
      panelTabs.filter(tab => tab.allow.filter(type => is(element, type)).length > 0).forEach(tab => {
        const activatedTab = {
          ...tab,
          props: [],
          properties: []
        }
        tab.props.forEach(prop => {
          const props = panelProps.filter(panelProp => panelProp.name === prop && panelProp.allow.filter(type => is(element, type)).length > 0)
          activatedTab.props = activatedTab.props.concat(props)
        })
        activatedTab.props.forEach(prop => {
          if (!prop.get) {
            prop.get = (e) => {
              return e.getAttribute(prop.name)
            }
          }
          if (!prop.set) {
            prop.set = (e, value) => {
              e.setAttribute(prop.name, value)
            }
          }
          activatedTab.properties.push({
            ...prop,
            element: new ElementWrapper(element, this.modeling, this.bpmnFactory)
          })
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
