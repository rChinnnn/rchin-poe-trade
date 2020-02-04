<template>
<div class="home">
  <HelloWorld msg="" />
  <div v-if="count == 0">
    <button v-show="!testResponse" @click="apiTest"> 點我測試程式是否能正常執行 </button>
    <h4> {{testResponse}} </h4>
    <h4 v-show="testResponse">使用說明：於遊戲中將滑鼠停在物品上，按下 Ctrl+C 即可輕鬆查價</h4>
  </div>
  <div><b>只顯示線上</b><input type="checkbox" v-model="isOnline"></div>
  <div><b>是否直購</b><input type="checkbox" v-model="isPriced"></div>
  <div>已搜尋次數 {{ count }} </div>
  <div>搜尋狀態 {{ status }} </div>
  <div class="MapCopy">
    <h5>輿圖區域名稱複製</h5>
    <b-button-group>
      <b-button disabled variant="info">
        <b-icon-arrow-up-left></b-icon-arrow-up-left>左上
      </b-button>
      <b-button @click="mapAreaCopy('Success')">Success</b-button>
      <b-button @click="mapAreaCopy('Info')">Info</b-button>
    </b-button-group>
    <b-button-group>
      <b-button disabled variant="info">
        <b-icon-arrow-up-right></b-icon-arrow-up-right>右上
      </b-button>
      <b-button @click="mapAreaCopy('Success')">Success</b-button>
      <b-button @click="mapAreaCopy('Info')">Info</b-button>
    </b-button-group>
    <b-button-group>
      <b-button disabled variant="info">
        <b-icon-arrow-down-left></b-icon-arrow-down-left>左下
      </b-button>
      <b-button @click="mapAreaCopy('Success')">Success</b-button>
      <b-button @click="mapAreaCopy('Info')">Info</b-button>
    </b-button-group>
    <b-button-group>
      <b-button disabled variant="info">
        <b-icon-arrow-down-right></b-icon-arrow-down-right>右下
      </b-button>
      <b-button @click="mapAreaCopy('Success')">Success</b-button>
      <b-button @click="mapAreaCopy('Info')">Info</b-button>
    </b-button-group>
  </div>
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
      count: 0,
      status: `目前版本尚未支援搜尋稀有裝備(黃裝)及鍊魔器官`,
      copyText: '',
      testResponse: '',
      isOnline: true,
      isPriced: true,
      stats: {},
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
      },
      newLine: navigator.userAgent.indexOf('Mac OS X') > -1 ? '\n' : '\r\n' // Mac 與 Windows 換行符號差異
    }
  },
  created() {

  },
  mounted() {
    // hotkeys('ctrl+c, command+c', () => this.hotkeyPressed())
    this.scanCopy();
    this.statsAPI();
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
          clipboardText: clipboard.readText()
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
          response.data.total = response.data.total == "100000" ? `${response.data.total}+` : response.data.total
          this.status = `此次物品搜尋ID: ${response.data.id}, 總共 ${response.data.total} 筆符合`
          window.open(`https://web.poe.garena.tw/trade/search/%E9%8D%8A%E9%AD%94%E8%81%AF%E7%9B%9F/${response.data.id}`, '_blank', 'nodeIntegration=no')
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 300),
    statsAPI() { // 詞綴 api
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/stats`, )
        .then((response) => {
          this.stats = response.data
          // console.log(this.stats.result[1].entries) // 隨機屬性的 Array {id: "", text: "", type: "explicit"}
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    mapAreaCopy(name) {
      clipboard.writeText(name)
    },
    similarity(s1, s2) { // 字串吻合度比較
      var longer = s1;
      var shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      var longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
      return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },
    editDistance(s1, s2) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();

      var costs = new Array();
      for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
          if (i == 0)
            costs[j] = j;
          else {
            if (j > 0) {
              var newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0)
          costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    },
  },
  watch: {
    copyText: function () {

      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件
      const NL = this.newLine

      let item = this.copyText;
      let itemArray = item.split(NL); // 以行數拆解複製物品文字
      let posRarity = item.indexOf(': ')
      let Rarity = itemArray[0].substring(posRarity + 2).trim()
      let searchName = itemArray[1]
      let itemBasic = itemArray[2]

      if (Rarity === "傳奇" && item.indexOf('地圖階級') === -1 && item.indexOf('在塔恩的鍊金室') === -1) { // 傳奇道具
        if (item.indexOf('未鑑定') === -1) { // 已鑑定
          this.searchJson.query.name = searchName
          if (searchName === "看守之眼") { // 尊師三相珠寶 
            // console.log(itemArray.length) // Mac 兩詞珠寶 => length = 19
            let explicit = this.stats.result[1].entries // 隨機屬性的 Array {id: "", text: "", type: "explicit"}
            console.log(explicit)
            // console.log(itemArray[11]) // 第一詞：被紀律影響時 +7% 法術傷害格擋率
            // console.log(itemArray[12]) // 第二詞：被清晰影響時被擊中，17% 承受的傷害轉化為魔力，在 4 秒內回復
            // console.log(this.similarity(itemArray[11], "被紀律影響時 #% 法術傷害格擋率"))
            // console.log(this.similarity(itemArray[11], "被紀律影響時增加 #% 能量護盾回復率"))
            // console.log(this.similarity(itemArray[12], "被清晰影響時被擊中，#% 承受的傷害轉化為魔力，在 4 秒內回復"))
            explicit.forEach((element, index) => {
              if (this.similarity(itemArray[11], element.text) > 0.75) { // 第一詞比較
                console.log(`物品上詞綴: ${itemArray[11]}\n第一詞ID: ${element.id}\n第一詞詞綴: ${element.text}\n吻合率: ${this.similarity(itemArray[11], element.text)}`)
                // this.searchJson.query.stats[0].filters[0] = {
                //   "id": element.id
                // }
                this.searchJson.query.stats[0].filters.push({
                  "id": element.id
                })
              }
              if (this.similarity(itemArray[12], element.text) > 0.75) { // 第二詞比較
                console.log(`物品上詞綴: ${itemArray[12]}\n第二詞ID: ${element.id}\n第二詞詞綴: ${element.text}\n吻合率: ${this.similarity(itemArray[12], element.text)}`)
                // this.searchJson.query.stats[0].filters.push({
                //   "id": element.id
                // })
              }
            });
          }
        } else { // 未鑑定(但會搜到相同基底)
          if (searchName.indexOf('精良的') > -1) { // 未鑑定的品質傳奇物品
            searchName = searchName.substring(4)
          }
          this.searchJson.query.type = searchName
          this.searchJson.query.filters.type_filters = {
            "filters": {
              "rarity": {
                "option": "unique"
              }
            }
          }
        }
      } else if (Rarity === "命運卡") {
        this.searchJson.query.type = searchName
      } else if (Rarity === "通貨") {
        this.searchJson.query.type = searchName
      } else if (Rarity === "寶石") {
        this.searchJson.query.type = searchName
        let gemQuality = 0
        if (item.indexOf('品質: +') > -1) {
          let quaPos = item.substring(item.indexOf('品質: +') + 5) // 品質截斷字串 (包含'品質: +'前的字串全截斷)
          let quaPosEnd = quaPos.indexOf('% (augmented)') // 品質定位點
          gemQuality = parseInt(quaPos.substring(0, quaPosEnd).trim(), 10)
        }
        if (item.indexOf('瓦爾．') > -1) { // 瓦爾技能
          let vaalPos = item.substring(item.indexOf('瓦爾．'))
          let vaalPosEnd = vaalPos.indexOf(NL)
          let vaalGem = vaalPos.substring(0, vaalPosEnd)
          this.searchJson.query.type = vaalGem
        }
        this.searchJson.query.filters.misc_filters = {
          "filters": {
            "quality": {
              "min": gemQuality
            }
          }
        }
      } else if (Rarity === "普通" && (item.indexOf('透過聖殿實驗室或個人') > -1 || item.indexOf('可以使用於個人的地圖裝置來增加地圖的詞綴') > -1 || item.indexOf('放置兩個以上不同的徽印在地圖裝置中') > -1 || item.indexOf('前往試練者廣場使用此物品進入帝王迷宮') > -1 || item.indexOf('擊殺指定數量的怪物後會掉落培育之物') > -1)) {
        // 地圖碎片、裂痕石、徽印、聖甲蟲、眾神聖器、女神祭品、培育器
        this.searchJson.query.type = searchName
      } else if (Rarity === "普通" && (item.indexOf('點擊右鍵將此預言附加於你的角色之上。') > -1)) { // 預言
        this.searchJson.query.name = searchName
      } else if (item.indexOf('地圖階級') > -1) { // 地圖搜尋

        let mapPos = item.substring(item.indexOf('地圖階級:') + 5) // 地圖階級截斷字串
        let mapPosEnd = mapPos.indexOf(NL) // 地圖階級換行定位點
        let mapTier = parseInt(mapPos.substring(0, mapPosEnd).trim(), 10)
        this.searchJson.query.filters.map_filters = { // 指定地圖階級
          "filters": {
            "map_tier": {
              "min": mapTier
            }
          }
        }
        if (Rarity === "傳奇" && item.indexOf('未鑑定') > -1) { // 未鑑定傳奇地圖
          if (searchName.indexOf('精良的') > -1) {
            searchName = searchName.substring(4)
          }
          this.searchJson.query.type = {
            "option": searchName
          }
          this.searchJson.query.type.discriminator = "warfortheatlas"
          this.searchJson.query.filters.type_filters = {
            "filters": {
              "rarity": {
                "option": "unique"
              }
            }
          }
        } else if (Rarity === "傳奇") { // 已鑑定傳奇地圖
          this.searchJson.query.name = searchName
        } else if (item.indexOf('區域被塑界者控制 (implicit)') > -1) { // 塑界者地圖
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "1"
            }
          }
        } else if (item.indexOf('區域被異界尊師控制 (implicit)') > -1) { // 尊師地圖
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "2"
            }
          }
          if (item.indexOf('地圖被異界．奴役佔據 (implicit)') > -1) { // 尊師守衛地圖 守衛地圖不指定最低階級
            delete this.searchJson.query.filters.map_filters
            this.searchJson.query.stats[0].filters.push({
              "id": "implicit.stat_3624393862",
              "value": {
                "option": "1"
              }
            })
          } else if (item.indexOf('地圖被異界．根除佔據 (implicit)') > -1) {
            delete this.searchJson.query.filters.map_filters
            this.searchJson.query.stats[0].filters.push({
              "id": "implicit.stat_3624393862",
              "value": {
                "option": "2"
              }
            })
          } else if (item.indexOf('地圖被異界．干擾佔據 (implicit)') > -1) {
            delete this.searchJson.query.filters.map_filters
            this.searchJson.query.stats[0].filters.push({
              "id": "implicit.stat_3624393862",
              "value": {
                "option": "3"
              }
            })
          } else if (item.indexOf('地圖被異界．淨化佔據 (implicit)') > -1) {
            delete this.searchJson.query.filters.map_filters
            this.searchJson.query.stats[0].filters.push({
              "id": "implicit.stat_3624393862",
              "value": {
                "option": "4"
              }
            })
          }
        } else if (item.indexOf('凋落的') > -1) {
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "true"
          }
        } else { // 白.藍.黃圖，單純抓地圖階級，不管地圖名稱
          this.searchJson.query.filters.map_filters.filters.map_blighted = { // 過濾凋落圖
            "option": "false"
          }
          this.searchJson.query.filters.type_filters = {
            "filters": {
              "rarity": {
                "option": "nonunique"
              }
            }
          }
        }
        this.searchTrade(this.searchJson)
      } else {
        this.status = `目前版本尚未支援搜尋稀有裝備(黃裝)及鍊魔器官`
        return
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
      this.searchTrade(this.searchJson)
    },
    isOnline: function () {
      if (this.isOnline) {
        this.searchJson_Def.query.status.option = 'online'
        this.searchJson.query.status.option = 'online'
      } else {
        this.searchJson_Def.query.status.option = 'any'
        this.searchJson.query.status.option = 'any'
      }
      if (JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchTrade(this.searchJson)
      }
    },
    isPriced: function () {
      if (this.isPriced) {
        this.searchJson_Def.query.filters.trade_filters.filters.sale_type.option = 'priced'
        this.searchJson.query.filters.trade_filters.filters.sale_type.option = 'priced'
      } else {
        this.searchJson_Def.query.filters.trade_filters.filters.sale_type.option = 'unpriced'
        this.searchJson.query.filters.trade_filters.filters.sale_type.option = 'unpriced'
      }
      if (JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchTrade(this.searchJson)
      }
    },

  },
  computed: {

  },
}
</script>

<style>
.MapCopy {
  border-top: 1px solid #000;
  padding: 5px;
}
</style>
