<!-- Author: ferrinweb -->
<!-- Create Time: 2019/01/08 13:12 -->
<!-- Description: vue-scale-box-demo -->
<template>
  <div id="app">
    <scale-box ref="scaleBox">
      <img :style="'opacity: ' + (loaded - 0)" @load="sourceLoaded" :src="src">
    </scale-box>
    <button @click="$refs.scaleBox.update()">Reset and Update</button>
  </div>
</template>

<script>
import scaleBox from './lib/scale-box'

export default {
  name: 'App',
  components: {
    scaleBox
  },
  data () {
    return {
      loaded: false,
      src: 'https://lorempixel.com/1440/900/nature'
    }
  },
  methods: {
    sourceLoaded () {
      this.loaded = true
      // If the content is an image or contains images,
      // execute the update method after all of images are loaded.
      this.$refs.scaleBox.update()
    }
  }
}
</script>

<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  body{
    box-sizing: border-box;
    padding: 50px 0;
  }

  #app {
    width: 720px;
    height: 450px;
    margin: auto;
    background-color: #f9f9f9;
    box-shadow: rgba(0,0,0,.3) 0 2px 10px;
    border: #fff 1px solid;
  }
  img {
    display: block;
  }
  button {
    display: inline-block;
    margin: 15px 0;
  }
</style>
