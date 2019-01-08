# vue-scale-box

> A vue scale box component, for browsing large image and content, support interaction by both mouse and touch.

> 一个简单的缩放盒子组件，支持鼠标和触摸操作，用于浏览尺寸较大的图片、文档等。

![](https://github.com/ferrinweb/vue-scale-box/raw/master/screenshots1.png)
![](https://github.com/ferrinweb/vue-scale-box/raw/master/screenshots2.png)
![](https://github.com/ferrinweb/vue-scale-box/raw/master/screenshots3.png)

## How to use / 如何使用

### Install / 安装

```javascript
npm install vue-scale-box
// or install from github reponsitory
npm install https://github.com/ferrinweb/vue-scale-box.git

// or use yarn / 推荐使用 yarn
yarn add vue-scale-box
// or install from github reponsitory
yarn add https://github.com/ferrinweb/vue-scale-box.git
```

### Import / 引入

```javascript
// global import / 全局引入
import scaleBox from 'vue-scale-box'
Vue.use(scaleBox)

// import on demand in your vue component file. / 按需引入
import scaleBox from 'vue-scale-box'
export default {
  components: {
    scaleBox
  },
  ...
}
```

### Use and demo / 使用及示例
> You can ckeckout this repository and try this demo.

> 你可以直接检出 vue-scale-box 源码到本地，查看示例。

```html
<template>
  <div id="app">
    <scale-box ref="scaleBox">
      <img :style="'opacity: ' + (loaded - 0)" @load="sourceLoaded" :src="src">
    </scale-box>
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
</style>
```

### Slots / 插槽
名称 | 说明 | 默认值
|---|---|---|
default | 放置到缩放盒子的内容 | 无

### Attributes / 属性
名称 | 说明 | 默认值
|---|---|---|
maxRatio | 最大方法比例 | 3
minRatio | 最小缩小比例 | 0.1
originalSizeText | 原始尺寸按钮文本 | Original Size
fitPageText | 适应页面（当前容器）尺寸 | Fit Page

### Methods / 方法
名称 | 说明 | 参数
|---|---|---|
update | 更新缩放盒子内容尺寸等参数 | 无

## Lisence
MIT Lisence.
