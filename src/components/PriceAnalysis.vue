<template>
<div>
  <h5>PriceAnalysis</h5>
  <div> {{fetchID}} </div>
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
    console.log(this.fetchID)
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
        console.log(val)
        var vm = this
        for (let index = 0; index < (val.length >= 3 ? 3 : val.length); index++) {
          if (!Array.isArray(this.fetchResult[index])) {
            vm.fetchResult[index] = []
          }
          http.get(`https://web.poe.garena.tw/api/trade/fetch/${val[index]}?query=${this.fetchQueryID}`)
            .then((response) => {
              console.log(index + 1)
              vm.fetchResult[index] = response.data.result
              console.log(vm.fetchResult)
            })
            .catch(function (error) {
              console.log(error);
            })
        }
      }
    },
  },
  computed: {

  },
}
</script>

<style>

</style>
