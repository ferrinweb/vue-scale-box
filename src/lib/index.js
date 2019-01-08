import scaleBox from './scale-box'

scaleBox.install = function (Vue) {
  Vue.component(scaleBox.name, scaleBox)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(scaleBox)
}

export default scaleBox
