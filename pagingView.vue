<!-- 父组件用法 <paging-view :currIndex="currIndex" :totalIndex="totalIndex" :maxPage="7" @changePage="changePage"></paging-view> -->
<template>
  <div class="btn-group pull-right">
    <!-- <button
      type="button"
      class="btn btn-default"
      @click="clickPage( 1 )">
        <span :title="totalIndex">首页</span>
    </button> -->
    <button
      type="button"
      class="btn btn-default"
      @click="clickPage( myPage - 1 )"
      :class="{disabled: myPage <= 1}">上一页</button>
    <button
      type="button"
      class="btn btn-default"
      v-for="item in pageList"
      @click="clickPage(item)"
      :class="{active: item === myPage, disabled: item === '▪▪▪'}" ><span class="paging-span">{{item}}</span></button>
    <button
      type="button"
      class="btn btn-default"
      @click="clickPage( myPage + 1 )"
      :class="{disabled: myPage >= totalIndex}">下一页</button>
    <!-- <button
      type="button"
      class="btn btn-default"
      @click="clickPage( totalIndex )">
        <span :title="totalIndex">末页</span>
      </button> -->
  </div>
</template>

<script>
    export default {
        name: 'paging',
        props: {
            currIndex: {
                type: Number,
                required: true
            },
            totalIndex: {
                type: Number,
                required: true
            },
            maxPage: {
                type: Number,
                default: 9
            }
        },
        data () {
            return {

            };
        },
        computed: {
            myPage () {
                return this.currIndex;
            },
            pageList () {
                return this.pageArray( this.myPage, this.totalIndex, this.maxPage);
            }
        },
        mounted () {},
        methods: {
            clickPage ( data) {
                let i = data * 1;
                console.log( i );

                if ( i < 1) {
                    return;
                }

                if ( i > this.totalIndex ) {
                    return;
                }

                if ( !isNaN(i) ) {
                    this.$emit('changePage', i); // 通知父组件触发事件，传入当前点击页码
                }
            },

            pageArray (currPage, totalPage, maxShowPage) {

                if (currPage > totalPage) {
                    throw new RangeError();
                }

                let page = [],
                    startStr = '',
                    endStr = '',
                    startPage = 1,
                    endPage = totalPage * 1,
                    aroundPage = Math.floor( (maxShowPage - 3) / 2 );

                if (totalPage <= maxShowPage) {
                    endPage = totalPage;
                } else {
                    if (currPage <= aroundPage + 2) {
                        endPage = 2 * aroundPage + 2;
                        endStr = '▪▪▪';
                    } else if (currPage >= totalPage - aroundPage - 1) {
                        startPage = totalPage - 2 * aroundPage - 1;
                        startStr = '▪▪▪';
                    } else {
                        startPage = currPage - aroundPage;
                        startStr = '▪▪▪';
                        endPage = currPage + aroundPage;
                        endStr = '▪▪▪';
                    }
                }

                // 生成页码数组

                // page.push('上一页');

                if (startStr) {
                    page.push('1');
                    page.push(startStr);
                }

                for (let i = startPage; i <= endPage; i++) {
                    page.push(i + '');
                }

                if (endStr) {
                    page.push(endStr);
                    page.push(totalPage + '');
                }

                // page.push('下一页');

                console.log(page);
                return page;
            }
        }
    };
</script>

<style>
  .paging-span{
    display: inline-block;
    width: 20px;
  }
  /*.pull-right {
    float: right!important;
  }
  .btn-group {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border-radius: 3px;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: 1px solid transparent;
  }
  .btn-default {
    background-color: #f4f4f4;
    color: #444;
    border-color: #ddd;
  }
  .btn-default.active, .btn-default:active {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }
  .btn.disabled, .btn[disabled], fieldset[disabled] .btn {
    cursor: not-allowed;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: .65;
  }
  .btn-group>.btn {
    position: relative;
    float: left;
  }
  .btn-group>.btn:first-child {
    margin-left: 0;
  }
  .btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }*/
</style>
