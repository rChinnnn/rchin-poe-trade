<template>
<div>
  <div class="d-inline-flex p-2 bd-highlight">
    <table>
      <tr>
        <th>PriceAnalysis</th>
      </tr>
      <tr v-for="(item, index) in collectionRepeat" :key="index">
        <td>
          [ 標價：{{ item.currency }} x {{ item.amount }}] * {{ item.count }}
        </td>
      </tr>
      <tfoot>
        <tr>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
var _ = require('lodash');
var axios = require('axios');
var rateLimit = require('axios-rate-limit');

const http = rateLimit(axios.create(), {
  maxRequests: 3,
  perMilliseconds: 2400,
})

export default {
  // 接受父组件的值
  props: {
    fetchID: Array,
    fetchQueryID: String,
  },
  components: {},
  data() {
    return {
      fetchResult: [],
    }
  },
  created() {

  },
  mounted() {
    setTimeout(() => {
      console.log(this.fetchResult.flat(Infinity))
    }, 1500);
  },
  methods: {
    hotkeyPressed() {
      this.count++
    },
  },
  watch: {
    fetchID: {
      immediate: true,
      handler(val) {
        this.fetchResult = [
          [],
          [],
          []
        ]
        for (let index = 0; index < (val.length >= 3 ? 3 : val.length); index++) {
          console.log(`https://web.poe.garena.tw/api/trade/fetch/${val[index]}?query=${this.fetchQueryID}`)
          http.get(`https://web.poe.garena.tw/api/trade/fetch/${val[index]}?query=${this.fetchQueryID}`)
            .then((response) => {
              this.fetchResult[index].push(response.data.result)
            })
            .catch(function (error) {
              console.log(error);
            })
        }
      }
    },
  },
  computed: {
    fetchResultPrice() { // 取出 result -> listing -> price 物件內容
      return this.fetchResult.flat(Infinity).map(item => Object.values(item)[1]).map(item => Object.values(item)[Object.values(item).length - 1]);
    },
    collectionRepeat() {
      const result = [...this.fetchResultPrice.reduce((r, e) => { // 計算相同 amount & currency 重複的次數
        let k = `${e.amount}|${e.currency}`;
        if (!r.has(k)) r.set(k, {
          ...e,
          count: 1
        })
        else r.get(k).count++
        return r;
      }, new Map).values()]

      return result
      // return [...new Set(this.fetchResultPrice.map(item => JSON.stringify(item)))].map(item => JSON.parse(item)); // 去除相同 obj
    },
  },
}
</script>

<style>

</style>
