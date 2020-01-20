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
import hotkeys from "hotkeys-js";
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
      copyText: '',
      count: 0,
      status: '目前只支援搜尋傳奇道具與命運卡！',
      testResponse: '',
      headers: {
        'Content-Type': 'application/json',
      },
      searchJson: {},
      searchJson_Def: {
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

  },
  mounted() {
    // hotkeys('ctrl+c, command+c', () => this.hotkeyPressed())
    this.scanCopy();
  },
  methods: {
    hotkeyPressed() {
      this.count++
    },
    scanCopy() {
      setInterval(() => {
        this.copyText = clipboard.readText()
      }, 500);
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
    }, 500),
    searchTrade: _.debounce(function (obj) {
      this.axios.post(`http://localhost:3031/trade`, {
          searchJson: obj,
          copyText: this.copyText
        })
        .then((response) => {
          this.count += 1;
          this.status = `物品交易ID: ${response.data}`
          window.open(`https://web.poe.garena.tw/trade/search/%E9%8D%8A%E9%AD%94%E8%81%AF%E7%9B%9F/${response.data}`, '_blank', 'nodeIntegration=no')
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 200),
    statsAPI() { // 詞綴 api
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/stats`,)
        .then((response) => {
          // this.testResponse = response.data
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  watch: {
    copyText: function () {

      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件 只有可以轉成JSON格式的物件才可以這樣用

      let item = this.copyText;
      let posRarity = item.indexOf(': ')
      let firstN = item.indexOf('\n')
      let secondN = item.indexOf('\n', item.indexOf('\n') + 1)
      let Rarity = item.substring(posRarity + 2, firstN).trim()
      let searchName = item.substring(firstN + 1, secondN)

      if (Rarity === "傳奇") {
        this.searchJson.query.name = searchName
        this.searchTrade(this.searchJson)
      } else if (Rarity === "命運卡") {
        this.searchJson.query.type = searchName
        this.searchTrade(this.searchJson)
      } else {
        this.status = `目前只支援搜尋傳奇道具與命運卡！`
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
    },
  },
}
</script>
