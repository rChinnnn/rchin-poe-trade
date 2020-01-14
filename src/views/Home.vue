<template>
<div class="home">
  <HelloWorld msg="" />
  <div v-if="count == 0">
    <button @click="apiTest"> 點我測試程式是否能正常執行 </button> {{testResponse}}
  </div>
  <div>已搜尋次數 {{ count }} </div>
  <div>搜尋狀態 {{ status }} </div>
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
var _ = require('lodash');
const {
  clipboard
} = require('electron')
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      copyText: 'test',
      count: 0,
      status: '',
      testResponse: '',
      headers: {
        'Content-Type': 'application/json',
      },
      searchJson: {
        "query": {
          "status": {
            "option": "online"
          },
          "stats": [{
            "type": "and",
            "filters": []
          }],
          "filters": {
            "trade_filters": {
              "filters": {
                "sale_type": {
                  "option": "priced"
                }
              }
            }
          }
        },
        "sort": {
          "price": "asc"
        }
      }
    }
  },
  created() {
    this.scanCopy();
  },
  methods: {
    scanCopy() {
      setInterval(() => {
        this.copyText = clipboard.readText()
      }, 1200);
    },
    apiTest: _.debounce(function () {
      this.axios.post(`http://localhost:3031/tradeTest`, {
          itemName: 123,
        })
        .then((response) => {
          this.testResponse = response.data
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 200),
    searchTrade: _.debounce(function () {
      this.axios.post(`http://localhost:3031/trade`, {
          searchJson: this.searchJson
        })
        .then((response) => {
          this.count += 1;
          this.status = `成功！`
          window.open(`https://web.poe.garena.tw/trade/search/%E9%8D%8A%E9%AD%94%E8%81%AF%E7%9B%9F/${response.data}`, '_blank', 'nodeIntegration=no')
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 200),
  },
  watch: {
    copyText: function () {

      this.copyText = clipboard.readText()
      let item = this.copyText;
      let posRarity = item.indexOf(': ')
      let firstN = item.indexOf('\n')
      let secondN = item.indexOf('\n', item.indexOf('\n') + 1)
      let Rarity = item.substring(posRarity + 2, firstN).trim()
      let searchName = item.substring(firstN + 1, secondN)

      if (Rarity === "傳奇") {
        this.searchJson.query.name = searchName
        delete this.searchJson.query.type
        this.searchTrade()
      } else if (Rarity === "命運卡") {
        this.searchJson.query.type = searchName
        delete this.searchJson.query.name
        this.searchTrade()
      }
      else {
        this.status = `目前只支援搜尋傳奇道具與命運卡！`
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
    },
  },
}
</script>
