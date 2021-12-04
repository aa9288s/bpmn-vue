import translate from 'diagram-js/lib/i18n/translate'
import PropertiesPanel from './panel'

export default {
  __depends__: [
     translate.translate
  ],
  __init__: ['propertiesPanel'],
  propertiesPanel: ['type', PropertiesPanel]
}
