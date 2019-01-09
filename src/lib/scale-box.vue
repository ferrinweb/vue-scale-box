<!-- Author: ferrinweb -->
<!-- Create Time: 2018/12/27 10:13 -->
<!-- Description: scale-box -->
<template>
  <div class="scale-box-wrapper">
    <div class="scale-panel-wrapper"
      ref="scalePanelWrapper"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"
      @mousemove.stop.prevent="drag($event)"
      @touchmove.stop.prevent="drag($event)"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag"
      @wheel="zoom($event)"
    >
      <loading class="loading" color="#969696" v-if="!contentReady"></loading>
      <div class="scale-fix"
        :style="`${transition};transform:translate3d(${-scaleFixX}px,${-scaleFixY}px,0)`"
      >
        <div class="content-wrapper"
          :class="{'ready': contentReady, 'no-pointer': dragging || fingerZooming}"
          :style="contentStyle"
          ref="content"
        >
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="scale-tool">
      <span v-if="scaleRatio !== 1" @click="scaleRatio = 1" :title="originalSizeText">{{originalSizeText}}</span>
      <span v-if="initScaleRatio !== scaleRatio" @click="fitPage(true)">{{fitPageText}}</span>
    </div>
  </div>
</template>

<script>
import loading from './loading'
export default {
  name: 'scale-box',
  components: {
    loading
  },
  props: {
    maxRatio: {
      type: Number,
      default: 3
    },
    minRatio: {
      type: Number,
      default: 0.1
    },
    /**
     * Default zoom ratio type when component initialization is complete
     * 'no-scaling': No scaling, showing original size
     * 'fit-when-large': Fit the page size only when the content is larger than the page size
     * 'fit': Fit the page always
     *  number: Scale according to this value when the value is a positive number
     */
    initRatioType: {
      type: [Number, String],
      default: 'fit-when-large'
    },
    originalSizeText: {
      type: String,
      default: 'Original Size'
    },
    fitPageText: {
      type: String,
      default: 'Fit Page'
    }
  },
  data () {
    return {
      scalePanelWrapper: null,
      content: null,
      wrapperPos: null,
      contentPos: null,
      dragStart: false,
      dragging: false,
      fingerZooming: false,
      contentStyle: '',
      transition: '',
      initScaleRatio: 1,
      tempScaleRatio: 0,
      scaleRatio: 1,
      dragX: 0,
      dragY: 0,
      scrollX: 0,
      scrollY: 0,
      touchZoomBaseValue: 0,
      scaleFixX: 0,
      scaleFixY: 0,
      tempScaleFixX: 0,
      tempScaleFixY: 0,
      WHRatio: 1,
      contentWHRatio: 1,
      contentReady: false
    }
  },
  methods: {
    startDrag (e) {
      if (e.which !== 1 && e.which !== 0) return
      e.preventDefault()
      this.dragStart = true
      const eProxy = e.type === 'touchstart' ? e.touches[0] : e
      this.dragX = eProxy.pageX
      this.dragY = eProxy.pageY
    },
    drag (e) {
      if (this.dragStart) this.dragging = true
      if (e.type === 'touchmove' && e.touches.length > 1) {
        this.zoom(e)
        return
      }
      if (this.dragging) {
        const eProxy = e.type === 'touchmove' ? e.touches[0] : e
        this.scaleFixX = this.tempScaleFixX + this.dragX - eProxy.pageX
        this.scaleFixY = this.tempScaleFixY + this.dragY - eProxy.pageY
      }
    },
    endDrag () {
      this.dragStart = false
      this.dragging = false
      this.touchZoomBaseValue = 0
      this.tempScaleRatio = 0
      this.tempScaleFixX = this.scaleFixX
      this.tempScaleFixY = this.scaleFixY
      this.fingerZooming = false
    },
    getFingerDistance (touches) {
      const touch1 = touches[0]
      const touch2 = touches[1]
      return Math.abs(Math.sqrt(Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2)))
    },
    zoom (e) {
      if (e.type === 'touchmove') {
        this.fingerZooming = true
        if (this.touchZoomBaseValue && this.tempScaleRatio) {
          let currentZoomValue = this.getFingerDistance(e.touches)
          this.scaleRatio = this.tempScaleRatio * currentZoomValue / this.touchZoomBaseValue
        } else {
          this.tempScaleRatio = this.scaleRatio
          this.touchZoomBaseValue = this.getFingerDistance(e.touches)
        }
      } else {
        this.scaleRatio += e.wheelDeltaY > 0 ? (this.scaleRatio < this.maxRatio ? 0.05 : 0) : (this.scaleRatio > this.minRatio ? -0.05 : 0)
      }
    },
    fitPage (smooth) {
      this.scaleRatio = this.contentWHRatio > this.WHRatio
        ? this.wrapperPos.width / this.contentPos.width
        : this.wrapperPos.height / this.contentPos.height
      if (smooth) {
        this.transition = 'transition: transform .4s'
        setTimeout(() => {
          this.transition = ''
        }, 400)
      }
      this.scaleFixX = this.tempScaleFixX = (50000 - this.wrapperPos.width / 2) | 0
      this.scaleFixY = this.tempScaleFixY = (50000 - this.wrapperPos.height / 2) | 0
      this.contentReady = true
    },
    update () {
      this.contentReady = false
      this.contentStyle = ''
      this.contentPos = this.content.getBoundingClientRect()
      if (!this.contentPos.width || !this.contentPos.height) return
      this.contentWHRatio = this.contentPos.width / this.contentPos.height
      this.wrapperPos = this.scalePanelWrapper.getBoundingClientRect()
      this.WHRatio = this.wrapperPos.width / this.wrapperPos.height
      this.initScaleRatio = this.contentWHRatio > this.WHRatio
        ? this.wrapperPos.width / this.contentPos.width
        : this.wrapperPos.height / this.contentPos.height
      this.fitPage()
    }
  },
  watch: {
    scaleRatio (value) {
      const styles = [`width:${this.contentPos.width}px;height:${this.contentPos.height}px;`]
      this.fingerZooming && styles.push('transition: unset;')
      styles.push(`transform: scale(${value});`)
      this.contentStyle = styles.join('')
    }
  },
  mounted () {
    this.scalePanelWrapper = this.$refs.scalePanelWrapper
    this.content = this.$refs.content
    this.update()
  }
}
</script>

<style lang="scss" scoped>
  .scale-box-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    .scale-tool{
      position: absolute;
      right: 10px;
      bottom: 10px;
      cursor: pointer;
      color: #fff;
      font-size: 12px;
      span {
        display: inline-block;
        margin-left: 1px;
        padding: 5px 10px;
        background-color: rgba(0,0,0,.4);
        &:hover{
          background-color: rgba(0,0,0,.8);
        }
      }
    }
  }
  .content-wrapper{
    opacity: 0;
    transition: transform .4s, opacity .4s;
    &.ready {
      opacity: 1;
    }
  }
  .scale-panel-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .scale-fix{
      width: 100000px;
      height: 100000px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
      transition: opacity .1s;
      transform: translate3d(0,0,0);
      cursor: move;
    }
  }
  .loading{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .no-pointer{
    pointer-events: none;
  }
</style>
