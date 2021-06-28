<template>
<div v-if="isPriced && fetchQueryID" style="padding-top: 10px;">
  <div>
    <b-img :src="itemImage" style="max-height:100px;"></b-img>
  </div>
  <div class="d-inline-flex p-2 bd-highlight">
    <loading loader="bars" :active.sync="isLoading" :is-full-page="false"></loading>
    <table class="table table-striped" sticky-header v-if="collectionCurrency && !isLoading">
      <thead class="thead-dark">
        <tr>
          <th scope="col">前 {{ fetchResultPrice.length }} 筆價格分析
            <br>
            <span v-if="corruptedCount && corruptedCount === fetchResultPrice.length" style="color: lightpink;">{{ corruptedCount }} 筆皆汙染</span>
            <b-button v-else-if="corruptedCount" @click="$emit('exclude')" size="sm" variant="outline-danger">排除 {{ corruptedCount }} 筆已汙染</b-button>
            <div v-if="corruptedCount" style="padding: 1px 0px;"></div>
            <b-button v-if="fetchResultPrice.length <= 40 && fetchID.length >= 4 && calResultLength" @click="priceAnalysis(8)" :disabled="isCounting" size="sm" variant="outline-secondary">再多搜 {{ calResultLength >= 40 ? 40 : calResultLength }} 筆價格</b-button>
          </th>
        </tr>
      </thead>
      <tbody @mouseleave="hoveredIndex = -1">
        <tr v-for="(item, index) in collectionCurrency" :key="index">
          <td :style="`opacity: ${hoveredIndex == index ? 1 : parseFloat(item.accountName.length / item.count)}; 
                       color: ${maxValuableIndex == index && parseFloat(item.accountName.length / item.count) > 0.85 ? 'darkred;' : ''}`" @mouseover="handleHover(index)">
            報價：{{ item.amount }} x
            <b-img :src="item.image" :alt="item.text" width=30 height=30></b-img>
            / <b>{{ item.count }}</b>筆
            <span v-if="item.count !== item.accountName.length">（<b>{{ item.accountName.length }}</b>人標）</span>
            <b-icon-x-square v-show="hoveredIndex == index && $store.state.POESESSID" @click="addToBlackList(item.accountName)" v-b-tooltip.hover.right.v-secondary :title="`將這 ${item.accountName.length} 人加入黑名單`" style="cursor: pointer;"></b-icon-x-square>
          </td>
        </tr>
      </tbody>
      <tfoot v-show="$store.state.POESESSID">
        <tr>
          <th>
            <b-icon-arrow-repeat @click="isCounting ? '' : $emit('refresh')" :style="[`cursor: ${isCounting ? `not-allowed` : `pointer`};`,'margin-left: 3px;']" v-b-tooltip.hover.top.v-secondary :title="`重新整理`"></b-icon-arrow-repeat>
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import VueLoading from 'vue-loading-overlay'

// const rateLimit = require('axios-rate-limit');
// const http = rateLimit(axios.create(), {
//   maxRequests: 3,
//   perMilliseconds: 2400,
// })

export default {
  // 接受父組件的值
  props: {
    fetchID: Array,
    fetchQueryID: String,
    isPriced: Boolean,
    isCounting: Boolean,
    isPriceCollapse: Boolean,
    baseUrl: String,
    searchTotal: Number,
    resultLength: Number
  },
  components: {
    loading: VueLoading,
  },
  data() {
    return {
      fetchResult: [],
      Currency: [],
      itemImage: '',
      isLoading: false,
      hoveredIndex: -1,
    }
  },
  created() {

  },
  mounted() {
    let vm = this
    this.axios.get(`https://web.poe.garena.tw/api/trade/data/static`, )
      .then((response) => { // 通貨 icon
        this.Currency = response.data.result[0].entries
      })
      .catch(function (error) {
        vm.$message({
          type: 'error',
          message: `error: ${error}`
        });
        console.log(error);
      })
  },
  methods: {
    hotkeyPressed() {
      this.count++
    },
    priceAnalysis(indexLength) {
      let vm = this
      this.isLoading = true;
      let newFilterResult = this.fetchID.filter(function (item, index, array) {
        return indexLength > 4 ? index >= 4 && index < 8 && item : index < indexLength
      })
      this.axios.all(newFilterResult.map((element, index) => {
          return this.axios.get(`${this.baseUrl}/api/trade/fetch/${element}?query=${this.fetchQueryID}`)
        }))
        .then(this.axios.spread((...res) => {
          let limitStringArray = []
          res.forEach((element, index) => {
            this.fetchResult[indexLength > 4 ? index + 4 : index].push(element.data.result)
            let limitString = (element.headers["x-rate-limit-ip-state"]).split(",")
            let limitState = limitString[1].substring(0, limitString[1].indexOf(':'))
            limitStringArray.push(parseInt(limitState, 10))
          });
          this.switchLimitState(Math.max(...limitStringArray))
          if (this.fetchResult[0].length !== 0 && !this.itemImage) {
            this.itemImage = this.fetchResult[0][0][0].item.icon
          }
          this.isLoading = false;
          this.$emit('scroll')
        }))
        .catch(function (error) {
          console.log(error)
          let limitString = (error.response.headers["x-rate-limit-ip-state"]).split(",")
          let limitState = limitString[1].slice(limitString[1].lastIndexOf(":") + 1)
          limitState = parseInt(limitState, 10)
          vm.isLoading = false;
          vm.$message({
            type: 'error',
            message: `被 Server 限制發送需求了，請等待 ${limitState} 秒後再重試`
          });
        })
    },
    switchLimitState(limitState) {
      // console.log('PriceAnalysis', limitState)
      switch (limitState) {
        case 12:
          this.$emit('countdown', 4 / 1.33)
          break;
        case 13:
        case 14:
        case 15:
        case 16:
          this.$emit('countdown', 6 / 1.33)
          break;
        default:
          break;
      }
    },
    handleHover(index) {
      if (this.hoveredIndex !== index)
        this.hoveredIndex = index
    },
    addToBlackList(accounts) {
      let vm = this
      this.$confirm(`是否將 ${accounts} ${accounts.length > 1 ? `等 ${accounts.length} 人` : ''}加入黑名單?`, '請再次確認', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.axios.all(accounts.map(element => {
            return this.axios.post(`http://localhost:3031/ignorePUT`, {
              accountName: `${element}`,
              baseUrl: this.baseUrl,
              cookie: `POESESSID=${this.$store.state.POESESSID}`
            })
          }))
          .then(vm.axios.spread((...res) => {
            console.log('all done', res[res.length - 1])
            vm.$message({
              type: 'success',
              message: `已將 ${accounts.length} 人加入黑名單，下次查價時生效！`,
            });
          }))
          .catch(function (error) {
            console.log(error);
            vm.$message({
              type: 'error',
              message: `加入失敗！ ${error}`,
            });
          })
      }).catch(() => {
        vm.$message({
          type: 'info',
          duration: 1200,
          message: '取消增加黑名單'
        });
      });
    }
  },
  watch: {
    fetchID: {
      immediate: true,
      handler(val) {
        let vm = this
        this.fetchResult = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ]
        this.itemImage = ''
        if (!this.isPriced || val.length === 0) {
          return
        }
        let indexLength = val.length >= 4 ? 4 : val.length
        this.priceAnalysis(indexLength)
      }
    },
  },
  computed: {
    fetchResultPrice() { // 取出 result -> listing -> price 物件內容
      return this.fetchResult.flat(Infinity).map(item => {
        if (!item.gone) {
          return Object.values(item)[1]
        }
      }).filter(function (item, index, array) {
        return item; // 排除包含 "gone": true 的物品（物品不存在）
      }).map(item => {
        if (item.price) {
          item.price.accountName = new Array
          item.price.accountName[0] = item.account.name // 增加該帳號到陣列中
        }
        return item.price
      }).filter(function (item, index, array) {
        return item; // 排除介面已選擇有標價但 API 還是回傳尚未標價的物品 （未標價 => null）
      });
    },
    fetchResultLength() {
      return Math.ceil(this.fetchResultPrice.length / 10)
    },
    calResultLength() { // 官方回傳的總數扣除目前搜尋且已整理的數量
      return this.resultLength - this.fetchResultPrice.length
    },
    collectionRepeat() {
      if (!this.isPriced || !this.fetchResultPrice[0]) {
        return 0
      }
      const result = [...this.fetchResultPrice.reduce((r, e) => { // 計算相同 amount & currency 重複的次數
        let k = `${e.amount}|${e.currency}`;
        if (!r.has(k)) {
          r.set(k, {
            ...e,
            count: 1
          })
        } else {
          r.get(k).count++
          if (r.get(k).accountName.indexOf(e.accountName[0]) === -1) {
            r.get(k).accountName.push(e.accountName[0]) // 每筆價格整理內皆包含不重複的使用者帳號名稱
          }
        }
        return r;
      }, new Map).values()]

      return result
      // return [...new Set(this.fetchResultPrice.map(item => JSON.stringify(item)))].map(item => JSON.parse(item)); // 去除相同 obj
    },
    collectionCurrency() { // 增加通貨 icon
      if (!this.isPriced || !this.fetchResultPrice[0]) {
        return 0
      }
      let collectionCurrency = this.collectionRepeat
      collectionCurrency.forEach((collection, index) => {
        this.Currency.forEach(element => {
          if (collection.currency === element.id) {
            collectionCurrency[index].image = `https://web.poe.garena.tw${element.image}`
            collectionCurrency[index].text = element.text
          }
        });
      });
      return collectionCurrency
    },
    maxValuableIndex() { // 最有價值的參考價格 index => 暫時不用
      let tempValue = 0
      let targetIndex = 0
      this.collectionCurrency.forEach((e, index, array) => {
        let calValue = parseFloat(e.accountName.length / e.count) + parseFloat(e.count)
        if (calValue > tempValue) {
          tempValue = calValue
          targetIndex = index
        }
      });
      return targetIndex
    },
    corruptedCount() { // 計算已污染的數量
      let count = 0
      this.fetchResult.flat(Infinity).map(item => {
        return Object.values(item)[2]
      }).forEach(element => {
        if (element.corrupted) {
          count++
        }
      })
      return count
    },
  },
}
</script>

<style>

</style>
