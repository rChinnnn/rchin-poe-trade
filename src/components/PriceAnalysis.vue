<template>
<div>
  <h5>PriceAnalysis</h5>
  <!-- <div> {{fetchResult}} </div> -->

  <div class="d-inline-flex p-2 bd-highlight">
    <table>
      <tr>
        <th>Price</th>
      </tr>
      <tr v-for="(item, index) in fetchResult.flat(Infinity)" :key="index">
        <td>
          {{ item.listing.price.currency }} x {{ item.listing.amount.currency }}
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
      fetchResult: [
        [],
        [],
        []
      ],
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
        for (let index = 0; index < (val.length >= 3 ? 3 : val.length); index++) {
          http.get(`https://web.poe.garena.tw/api/trade/fetch/${val[index]}?query=${this.fetchQueryID}`)
            .then((response) => {
              console.log(index + 1)
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
    fetchResultPrice() {
      return this.fetchResult.flat(Infinity)
    }
  },
}
</script>

<style>

</style>
