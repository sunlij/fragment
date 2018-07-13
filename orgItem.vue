<template>
  <li>
    <xListItem>
      <div slot="left">
        <div v-if="typeData.icon === 'ORG' " class="list-font-icon">
          ORG
        </div>
        <div v-else class="list-font-icon">
          <svg v-if="item.show === false && childLength" class="icon icon-font-12" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use>
          </svg>
          <svg v-else class="icon icon-font-12" aria-hidden="true">
            <use xlink:href="#icon-jian"></use>
          </svg>
        </div>
      </div>
      <div slot="content" @click="gotoDetail">
        <p class="height-auto">{{item.name}}</p>
        <p class="time height-auto">{{item.owner}}</p>
      </div>
      <div slot="right" @click="itemShow">
        <p class="list-right right">{{Xutil.formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}</p>
        <p class="list-right" v-if="childLength" >
          <!-- <span style="margin-right: 0.1rem">{{item.children.length}}个下级组织</span> -->
          <svg v-if="item.show" class="icon icon-font-12" aria-hidden="true">
            <use xlink:href="#icon-shang"></use>
          </svg>
          <svg v-else class="icon icon-font-12" aria-hidden="true">
            <use xlink:href="#icon-xia"></use>
          </svg>
        </p>
      </div>
    </xListItem>
    <ul v-if="childLength" v-show="item.show" class="org-item-ul">
      <orchid-org-item
        v-for="(childItem, index) in item.children"
        :key="index"
        :item="childItem"
        :typeData="{ 'type': typeData.type, 'detailKey': typeData.detailKey, 'icon': '-' }"
      ></orchid-org-item>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'orchidOrgItem',
  props: {
    item: {
      type: Object
    },
    typeData: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    childLength () {
      if (!this.item.children) {
        return false
      }
      if (this.item.children.length <= 0) {
        return false
      }
      return this.item.children.length
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    itemShow () {
      if (this.childLength) {
        this.item.show = !this.item.show
      }
    },
    gotoDetail () {
      this.$router.push({
        name: 'orchidManageDetail',
        query: {
          id: this.item[this.typeData.detailKey],
          type: this.typeData.type
        }
      })
    }
  }
}
</script>

<style scoped>
.list-right {
  color: #586069;
  text-align: right;
}
.list-font-icon {
  height: 28px;
  line-height: 28px;
  color: #2c3e50;
  font-weight: bold;
}
.height-auto {
  height: auto;
  word-break: break-word;
}
.icon-font-12 {
  font-size: 12px;
}
.org-item-ul {
  background-color: rgba(234, 234, 234, 0.5);
}
/*ul.org-item-ul li {
  margin-left: 15px;
  margin-right: 0px;
}*/
</style>
