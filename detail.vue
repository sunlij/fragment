<template>
  <div class="box">
    <xHeader fixed hasBack title="正文"></xHeader>
    <div class="content content-noTabbar">
      <xScroll
        ref="scroll"
        :scrollbar="{fade: true}"
        :pullDownRefresh="{threshold: 90}"
        @pullingDown="loadTop"
      >
      <!-- <mt-loadmore :top-method="loadTop" @touchend.native.stop ref="refurbish" style="height:100%;overflow:auto;"> -->
        <div id="article-detail">
          <div class="article-detail-head">
            <h1>{{articleTitle}}</h1>
            <p class="article-detail-desc">
              <span>{{articleAuthor}}</span>
              <span>{{articleTime && Xutil.formatDate(articleTime, 'yyyy-MM-dd hh:mm')}}</span>
            </p>
          </div>
          <div
            class="article-detail-body"
            @click="popupImg($event)"
            v-html="articleHtml"
            >
            <!-- v-html="articleHtml" @click="popupImg($event)"  -->
            <!-- <section>
              <h2>小标题小标题</h2>
              <p>
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
              </p>
              <p>
                <img src="./test/banner_img02.jpg" style="width:100%">
                <img src="./test/card01.jpg" style="width:100%">
                <img src="./test/network_error.png" style="width:100%">
              </p>
            </section>
            <section>
              <h2>小标题小标题</h2>
              <p>
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
                内容内容内容内容内容内容内容内容内容内容内容内容内容
              </p>
              <p>
                <img src="./test/index.png" style="width:100%">
              </p>
            </section> -->
          </div>
        </div>
      <!-- </mt-loadmore> -->
      </xScroll>
      <mt-popup v-model="showPopup" position="right" style="width:100%;height:100%;background:#5a5a5a">
        <v-touch
          id="popupcontent"
          class="popup-content"
          :enabled="{ pinch: true }"
          @pinchstart="onPinchStart"
          @pinchmove="onPinchMove"
          @pinchend="onPinchEnd"
          @panstart="onPanStart"
          @panmove="onPanMove"
          @panend="onPanEnd"
          @click.native="hide">
          <img id="popupimg" :src="imgSrc">
        </v-touch>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import fetch from '@/api/server/fetch'
import URL from '@/api/server/urls'
export default {
  name: 'articleDetail',
  data () {
    return {
      id: '',
      showPopup: false,
      imgSrc: '',
      articleTitle: '',
      articleTime: '',
      articleAuthor: '',
      articleHtml: '',
      imgTouch: {
        scale: 1,
        moveX: 0,
        moveY: 0,
        imgWidth: 0,
        imgHeight: 0,
        contentWidth: 0,
        contentHeight: 0
      }
    }
  },
  computed: {
    maxMove () {
      let data = this.imgTouch
      let x, y
      x = (data.imgWidth * data.scale - data.contentWidth) / 2
      y = (data.imgHeight * data.scale - data.contentHeight) / 2
      if (x < 0) {
        x = 0
      }
      if (y < 0) {
        y = 0
      }
      return {
        x: x,
        y: y
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.fetchDetail()
  },
  mounted () {
    this.contentElm = document.getElementById('popupcontent')
    this.imgElm = document.getElementById('popupimg')
  },
  methods: {
    loadTop () {
      console.log('刷新')
      this.fetchDetail(true)
    },
    popupImg (e) {
      if (e.target.tagName === 'IMG') {
        this.imgSrc = e.target.src
        this.showPopup = true
        this.$nextTick(function () {
          this.imgTouch.imgWidth = this.imgElm.clientWidth
          this.imgTouch.imgHeight = this.imgElm.clientHeight
          this.imgTouch.contentWidth = this.contentElm.clientWidth
          this.imgTouch.contentHeight = this.contentElm.clientHeight
        })
      }
    },
    hide () {
      this.showPopup = false
      this.imgTouch = {
        scale: 1,
        moveX: 0,
        moveY: 0,
        imgWidth: 0,
        imgHeight: 0,
        contentWidth: 0,
        contentHeight: 0
      }
      this.imgElm.style.transform = 'translate3d(0, 0, 0) scale(1)'
    },
    onPinchStart (e) {
      console.log('onPinchStart')
    },
    onPinchMove (e) {
      this.imgElm.style.transform = `translate3d(${this.imgTouch.moveX}px, ${this.imgTouch.moveY}px, 0) scale(${this.imgTouch.scale * e.scale})`
    },
    onPinchEnd (e) {
      console.log('onPinchEnd')
      this.imgTouch.scale *= e.scale
      this.scaleLimit()
      this.moveLimit()
    },
    onPanStart (e) {
      console.log('onPanStart')
      console.log(e.deltaX, e.deltaY)
    },
    onPanMove (e) {
      this.panMove = true
      this.imgElm.style.transform = `translate3d(${this.imgTouch.moveX + e.deltaX}px, ${this.imgTouch.moveY + e.deltaY}px, 0) scale(${this.imgTouch.scale}`
    },
    onPanEnd (e) {
      console.log('onPanEnd')
      if (this.panMove) {
        this.imgTouch.moveX += e.deltaX
        this.imgTouch.moveY += e.deltaY
        this.moveLimit()
      }
      this.panMove = false
    },
    scaleLimit () {
      if (this.imgTouch.scale < 1) {
        this.imgTouch.scale = 1
      }
    },
    moveLimit () {
      let x = this.imgTouch.moveX
      let y = this.imgTouch.moveY
      let xi, yi
      if (x >= 0) {
        xi = 1
      } else {
        xi = -1
      }
      if (y >= 0) {
        yi = 1
      } else {
        yi = -1
      }
      if (x * xi > this.maxMove.x) {
        this.imgTouch.moveX = this.maxMove.x * xi
      }
      if (y * yi > this.maxMove.y) {
        this.imgTouch.moveY = this.maxMove.y * yi
      }
      this.imgElm.style.transform = `translate3d(${this.imgTouch.moveX}px, ${this.imgTouch.moveY}px, 0) scale(${this.imgTouch.scale}`
    },
    fetchDetail (param) {
      fetch(URL.Articles.getDocDetail, {
        type: 'post',
        doShowLoading: !param,
        data: {
          id: this.id
        }
      }).then(res => {
        this.articleHtml = res.content
        this.articleTime = res.updateTime
        this.articleAuthor = res.author
        this.articleTitle = res.title
        this.$refs.scroll.forceUpdate()
      }, err => {
        console.log(err)
        this.$refs.scroll.forceUpdate()
      })
    }
  }
}
</script>
<style>
/*@import "./quill.snow.css"*/
/*与文章后台编辑器统一样式*/
.article-detail-body { box-sizing: border-box; line-height: 1.42; height: 100%; outline: none; overflow-y: auto; padding: 12px 15px; tab-size: 4; -moz-tab-size: 4; text-align: left; white-space: pre-wrap; word-wrap: break-word; }
.article-detail-body > * { cursor: text; }
.article-detail-body p, .article-detail-body ol, .article-detail-body ul, .article-detail-body pre, .article-detail-body blockquote, .article-detail-body h1, .article-detail-body h2, .article-detail-body h3, .article-detail-body h4, .article-detail-body h5, .article-detail-body h6 { margin: 0; padding: 0; counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9; }
.article-detail-body ol, .article-detail-body ul { padding-left: 1.5em; }
.article-detail-body ol > li, .article-detail-body ul > li { list-style-type: none; }
.article-detail-body ul > li::before { content: '\2022'; }
.article-detail-body ul[data-checked=true], .article-detail-body ul[data-checked=false] { pointer-events: none; }
.article-detail-body ul[data-checked=true] > li *, .article-detail-body ul[data-checked=false] > li * { pointer-events: all; }
.article-detail-body ul[data-checked=true] > li::before, .article-detail-body ul[data-checked=false] > li::before { color: #777; cursor: pointer; pointer-events: all; }
.article-detail-body ul[data-checked=true] > li::before { content: '\2611'; }
.article-detail-body ul[data-checked=false] > li::before { content: '\2610'; }
.article-detail-body li::before { display: inline-block; white-space: nowrap; width: 1.2em; }
.article-detail-body li:not(.ql-direction-rtl)::before { margin-left: -1.5em; margin-right: 0.3em; text-align: right; }
.article-detail-body li.ql-direction-rtl::before { margin-left: 0.3em; margin-right: -1.5em; }
.article-detail-body ol li:not(.ql-direction-rtl), .article-detail-body ul li:not(.ql-direction-rtl) { padding-left: 1.5em; }
.article-detail-body ol li.ql-direction-rtl, .article-detail-body ul li.ql-direction-rtl { padding-right: 1.5em; }
.article-detail-body ol li { counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9; counter-increment: list-0; }
.article-detail-body ol li:before { content: counter(list-0, decimal) '. '; }
.article-detail-body ol li.ql-indent-1 { counter-increment: list-1; }
.article-detail-body ol li.ql-indent-1:before { content: counter(list-1, lower-alpha) '. '; }
.article-detail-body ol li.ql-indent-1 { counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-2 { counter-increment: list-2; }
.article-detail-body ol li.ql-indent-2:before { content: counter(list-2, lower-roman) '. '; }
.article-detail-body ol li.ql-indent-2 { counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-3 { counter-increment: list-3; }
.article-detail-body ol li.ql-indent-3:before { content: counter(list-3, decimal) '. '; }
.article-detail-body ol li.ql-indent-3 { counter-reset: list-4 list-5 list-6 list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-4 { counter-increment: list-4; }
.article-detail-body ol li.ql-indent-4:before { content: counter(list-4, lower-alpha) '. '; }
.article-detail-body ol li.ql-indent-4 { counter-reset: list-5 list-6 list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-5 { counter-increment: list-5; }
.article-detail-body ol li.ql-indent-5:before { content: counter(list-5, lower-roman) '. '; }
.article-detail-body ol li.ql-indent-5 { counter-reset: list-6 list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-6 { counter-increment: list-6; }
.article-detail-body ol li.ql-indent-6:before { content: counter(list-6, decimal) '. '; }
.article-detail-body ol li.ql-indent-6 { counter-reset: list-7 list-8 list-9; }
.article-detail-body ol li.ql-indent-7 { counter-increment: list-7; }
.article-detail-body ol li.ql-indent-7:before { content: counter(list-7, lower-alpha) '. '; }
.article-detail-body ol li.ql-indent-7 { counter-reset: list-8 list-9; }
.article-detail-body ol li.ql-indent-8 { counter-increment: list-8; }
.article-detail-body ol li.ql-indent-8:before { content: counter(list-8, lower-roman) '. '; }
.article-detail-body ol li.ql-indent-8 { counter-reset: list-9; }
.article-detail-body ol li.ql-indent-9 { counter-increment: list-9; }
.article-detail-body ol li.ql-indent-9:before { content: counter(list-9, decimal) '. '; }
.article-detail-body .ql-indent-1:not(.ql-direction-rtl) { padding-left: 3em; }
.article-detail-body li.ql-indent-1:not(.ql-direction-rtl) { padding-left: 4.5em; }
.article-detail-body .ql-indent-1.ql-direction-rtl.ql-align-right { padding-right: 3em; }
.article-detail-body li.ql-indent-1.ql-direction-rtl.ql-align-right { padding-right: 4.5em; }
.article-detail-body .ql-indent-2:not(.ql-direction-rtl) { padding-left: 6em; }
.article-detail-body li.ql-indent-2:not(.ql-direction-rtl) { padding-left: 7.5em; }
.article-detail-body .ql-indent-2.ql-direction-rtl.ql-align-right { padding-right: 6em; }
.article-detail-body li.ql-indent-2.ql-direction-rtl.ql-align-right { padding-right: 7.5em; }
.article-detail-body .ql-indent-3:not(.ql-direction-rtl) { padding-left: 9em; }
.article-detail-body li.ql-indent-3:not(.ql-direction-rtl) { padding-left: 10.5em; }
.article-detail-body .ql-indent-3.ql-direction-rtl.ql-align-right { padding-right: 9em; }
.article-detail-body li.ql-indent-3.ql-direction-rtl.ql-align-right { padding-right: 10.5em; }
.article-detail-body .ql-indent-4:not(.ql-direction-rtl) { padding-left: 12em; }
.article-detail-body li.ql-indent-4:not(.ql-direction-rtl) { padding-left: 13.5em; }
.article-detail-body .ql-indent-4.ql-direction-rtl.ql-align-right { padding-right: 12em; }
.article-detail-body li.ql-indent-4.ql-direction-rtl.ql-align-right { padding-right: 13.5em; }
.article-detail-body .ql-indent-5:not(.ql-direction-rtl) { padding-left: 15em; }
.article-detail-body li.ql-indent-5:not(.ql-direction-rtl) { padding-left: 16.5em; }
.article-detail-body .ql-indent-5.ql-direction-rtl.ql-align-right { padding-right: 15em; }
.article-detail-body li.ql-indent-5.ql-direction-rtl.ql-align-right { padding-right: 16.5em; }
.article-detail-body .ql-indent-6:not(.ql-direction-rtl) { padding-left: 18em; }
.article-detail-body li.ql-indent-6:not(.ql-direction-rtl) { padding-left: 19.5em; }
.article-detail-body .ql-indent-6.ql-direction-rtl.ql-align-right { padding-right: 18em; }
.article-detail-body li.ql-indent-6.ql-direction-rtl.ql-align-right { padding-right: 19.5em; }
.article-detail-body .ql-indent-7:not(.ql-direction-rtl) { padding-left: 21em; }
.article-detail-body li.ql-indent-7:not(.ql-direction-rtl) { padding-left: 22.5em; }
.article-detail-body .ql-indent-7.ql-direction-rtl.ql-align-right { padding-right: 21em; }
.article-detail-body li.ql-indent-7.ql-direction-rtl.ql-align-right { padding-right: 22.5em; }
.article-detail-body .ql-indent-8:not(.ql-direction-rtl) { padding-left: 24em; }
.article-detail-body li.ql-indent-8:not(.ql-direction-rtl) { padding-left: 25.5em; }
.article-detail-body .ql-indent-8.ql-direction-rtl.ql-align-right { padding-right: 24em; }
.article-detail-body li.ql-indent-8.ql-direction-rtl.ql-align-right { padding-right: 25.5em; }
.article-detail-body .ql-indent-9:not(.ql-direction-rtl) { padding-left: 27em; }
.article-detail-body li.ql-indent-9:not(.ql-direction-rtl) { padding-left: 28.5em; }
.article-detail-body .ql-indent-9.ql-direction-rtl.ql-align-right { padding-right: 27em; }
.article-detail-body li.ql-indent-9.ql-direction-rtl.ql-align-right { padding-right: 28.5em; }
.article-detail-body .ql-video { display: block; max-width: 100%; }
.article-detail-body .ql-video.ql-align-center { margin: 0 auto; }
.article-detail-body .ql-video.ql-align-right { margin: 0 0 0 auto; }
.article-detail-body .ql-bg-black { background-color: #000; }
.article-detail-body .ql-bg-red { background-color: #e60000; }
.article-detail-body .ql-bg-orange { background-color: #f90; }
.article-detail-body .ql-bg-yellow { background-color: #ff0; }
.article-detail-body .ql-bg-green { background-color: #008a00; }
.article-detail-body .ql-bg-blue { background-color: #06c; }
.article-detail-body .ql-bg-purple { background-color: #93f; }
.article-detail-body .ql-color-white { color: #fff; }
.article-detail-body .ql-color-red { color: #e60000; }
.article-detail-body .ql-color-orange { color: #f90; }
.article-detail-body .ql-color-yellow { color: #ff0; }
.article-detail-body .ql-color-green { color: #008a00; }
.article-detail-body .ql-color-blue { color: #06c; }
.article-detail-body .ql-color-purple { color: #93f; }
.article-detail-body .ql-font-serif { font-family: Georgia, Times New Roman, serif; }
.article-detail-body .ql-font-monospace { font-family: Monaco, Courier New, monospace; }
.article-detail-body .ql-size-small { font-size: 0.75em; }
.article-detail-body .ql-size-large { font-size: 1.5em; }
.article-detail-body .ql-size-huge { font-size: 2.5em; }
.article-detail-body .ql-direction-rtl { direction: rtl; text-align: inherit; }
.article-detail-body .ql-align-center { text-align: center; }
.article-detail-body .ql-align-justify { text-align: justify; }
.article-detail-body .ql-align-right { text-align: right; }
.article-detail-body.ql-blank::before { color: rgba(0, 0, 0, 0.6); content: attr(data-placeholder); font-style: italic; left: 15px; pointer-events: none; position: absolute; right: 15px; }
.article-detail-body h1 { font-size: 2em; }
.article-detail-body h2 { font-size: 1.5em; }
.article-detail-body h3 { font-size: 1.17em; }
.article-detail-body h4 { font-size: 1em; }
.article-detail-body h5 { font-size: 0.83em; }
.article-detail-body h6 { font-size: 0.67em; }
.article-detail-body a { text-decoration: underline; }
.article-detail-body blockquote { border-left: 4px solid #ccc; margin-bottom: 5px; margin-top: 5px; padding-left: 16px; }
.article-detail-body code, .article-detail-body pre { background-color: #f0f0f0; border-radius: 3px; }
.article-detail-body pre { white-space: pre-wrap; margin-bottom: 5px; margin-top: 5px; padding: 5px 10px; }
.article-detail-body code { font-size: 85%; padding: 2px 4px; }
.article-detail-body pre.ql-syntax { background-color: #23241f; color: #f8f8f2; overflow: visible; }
.article-detail-body img { max-width: 100%; }
</style>
<style>
#article-detail {
  line-height: 1.5;
  background-color: #fff;
  overflow: hidden;
}
.article-detail-head {
  padding: 20px 15px 0;
}
.article-detail-head h1 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0.5em;
  word-break: break-word;
}
.article-detail-desc {
  color: #586069;
}
.article-detail-desc span {
  margin-right: 10px;
}
#popupcontent.popup-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  /*padding-top: 60px;*/
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
#popupcontent.popup-content img {
  transform: scale(1) translate3d(0,0,0);
  max-width: 100%;
  max-height: 100%;
}
</style>
