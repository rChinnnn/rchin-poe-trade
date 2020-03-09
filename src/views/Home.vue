<template>
<div class="home">
  <!-- <div v-if="count == 0">
    <b-button v-show="!testResponse" @click="apiTest"> 點我測試程式是否能正常執行 </b-button>
    <h5> {{testResponse}} </h5>
    <h5 v-show="testResponse">使用說明：於遊戲中將滑鼠停在物品上，按下 Ctrl+C 即可輕鬆查價</h5>
  </div> -->
  <hr>
  <b-container class="bv-example-row">
    <b-row style="padding: 5px;">
      <b-col align-self="start">
        <b-button v-b-toggle.collapse-1 size="sm" variant="outline-primary">搜尋基本設定</b-button>
      </b-col>
      <b-col align-self="center">
        <!-- TODO:  :disabled="!isSearchJson" -->
        <b-button v-b-toggle.collapse-2 size="sm" variant="outline-primary">物品基本設定</b-button>
      </b-col>
      <b-col align-self="end"> </b-col>
    </b-row>
    <b-collapse visible id="collapse-1" class="mt-2">
      <b-card>
        <b-row>
          <b-col>
            <b-form-checkbox v-model="isOnline" switch :inline="false">
              <b>只顯示線上</b>
            </b-form-checkbox>
          </b-col>
          <b-col>
            <b-form-checkbox v-model="isPriced" switch>
              <b>是否直購</b>
            </b-form-checkbox>
          </b-col>
          <b-col>
            <b-form-checkbox v-model="isPopWindow" switch>
              <b>官網查詢</b>
            </b-form-checkbox>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-container>
  <!-- TODO: v-if="isSearchJson" -->
  <b-container class="bv-example-row">
    <b-collapse visible id="collapse-2" class="mt-2">
      <b-card>
        <b-row class="lesspadding">
          <b-col sm="4" style="padding-top: 3px;">
            <b-form-checkbox class="float-right" v-model="itemLevel.isSearch" @input="isLevelSearch" switch>物品等級 (min)</b-form-checkbox>
          </b-col>
          <b-col sm="1">
            <b-form-input v-model.number="itemLevel.value" @input="isLevelSearch" @dblclick="itemLevel.value = ''" :disabled="!itemLevel.isSearch" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="3" style="padding-top: 5px;">
            <b-form-checkbox class="float-right" v-model="itemCategory.isSearch" @input="isCategorySearch" switch>物品分類</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select :options="itemCategory.option" v-model="itemCategory.chosenObj" label="label" @input="categoryChange" :disabled="!itemCategory.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select>
          </b-col>
        </b-row>
        <b-row class="lesspadding" style="padding-top: 5px;">
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="itemBasic.isSearch" @input="isBasicSearch" switch>物品基底</b-form-checkbox>
          </b-col>
          <b-col sm="2">
            <b-form-input v-model="itemBasic.text" :disabled="true"></b-form-input>
          </b-col>
          <b-col sm="3" style="padding-top: 5px;">
            <b-form-checkbox class="float-right" v-model="itemExBasic.isSearch" @input="isExBasicSearch" switch>勢力基底</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select :options="itemExBasic.option" label="label" @input="exBasicChange" :disabled="!itemExBasic.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-container>
  <hr>
  <h5>{{ searchName }}</h5>
  <div class="d-inline-flex p-2 bd-highlight" v-if="searchStats.length > 0">
    <table>
      <tr>
        <th>是否查詢</th>
        <th>種類</th>
        <th>詞綴內容</th>
        <th>最小值</th>
        <th>最大值</th>
      </tr>
      <tr v-for="(item, index) in searchStats" :key="index" :style="item.isSearch ? '' : 'background-color: #e9ecef'">
        <td style="width: 70px;">
          <b-form-checkbox v-model="item.isSearch"></b-form-checkbox>
        </td>
        <td style="width: 50px;" :style="item.type === '隨機' ? '' : 'color: red;'">{{ item.type }} </td>
        <td>{{ item.text }} </td>
        <td style="width: 45px;">
          <b-form-input v-model.number="item.min" @dblclick="item.min = ''" :disabled="!item.isSearch || !item.isValue" size="sm" type="number" style="text-align: center;"></b-form-input>
        </td>
        <td style="width: 45px;">
          <b-form-input v-model.number="item.max" @dblclick="item.max = ''" :disabled="!item.isSearch || !item.isValue" :style="item.max && (item.max < item.min) ? 'background-color: #fc3232' : ''" size="sm" type="number" style="text-align: center;"></b-form-input>
        </td>
      </tr>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <b-button @click="clickToSearch" variant="outline-primary">查詢</b-button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div>已搜尋次數 {{ count }} </div>
  <div>搜尋狀態 {{ status }} </div>
  <!-- <div class="MapCopy">
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
  </div> -->
  <div v-if="fetchQueryID">
    <PriceAnalysis :fetchID="fetchID" :fetchQueryID="fetchQueryID" :isPriced="isPriced"></PriceAnalysis>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import PriceAnalysis from '@/components/PriceAnalysis.vue'
import hotkeys from "hotkeys-js";

var axios = require('axios');
var rateLimit = require('axios-rate-limit');
var _ = require('lodash');
var stringSimilarity = require('string-similarity');
const {
  clipboard
} = require('electron')
export default {
  name: 'home',
  components: {
    PriceAnalysis
  },
  data() {
    return {
      count: 0,
      status: `目前版本尚未支援搜尋稀有裝備(黃裝)及鍊魔器官`,
      copyText: '',
      testResponse: '',
      isOnline: true,
      isPriced: true,
      isPopWindow: false,
      searchStats: [], // 分析拆解後的物品詞綴陣列，提供使用者在界面勾選是否查詢及輸入數值
      pseudoStats: [], // 偽屬性
      explicitStats: [], // 隨機屬性
      implicitStats: [], // 固定屬性
      enchantStats: [], // 附魔
      craftedStats: [], // 已工藝
      fetchID: [], // 預計要搜尋物品細項的 ID, 10 個 ID 為一陣列
      searchName: '',
      fetchQueryID: '',
      allItems: [], // 物品 API 抓回來的資料
      equipItems: [], // 可裝備的物品資料
      itemLevel: { // 物品等級
        value: 0,
        isSearch: false,
      },
      itemCategory: { // 物品分類
        option: [],
        chosenObj: {},
        isSearch: false,
      },
      itemBasic: { // 物品基底
        text: '',
        isSearch: false,
      },
      itemExBasic: { // 勢力基底
        option: [{
          label: "塑者之物",
          prop: "shaper_item"
        }, {
          label: "尊師之物",
          prop: "elder_item"
        }, {
          label: "聖戰君王物品",
          prop: "crusader_item"
        }, {
          label: "救贖者物品",
          prop: "redeemer_item"
        }, {
          label: "總督軍物品",
          prop: "warlord_item"
        }, {
          label: "狩獵者物品",
          prop: "hunter_item"
        }, ],
        chosenObj: {},
        isSearch: false,
      },
      itemInf: { // 物品各項資訊
        Category: '',
        Basic: '',
        exBasic: '',
        Level: '',
        Corrupted: false, // 是否污染
      },
      mapInf: { // 地圖各項資訊
        Level: '', // 地圖階級
        Basic: '', // 地圖基底
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
            },
            "misc_filters": {
              "filters": {}
            },
            "type_filters": {
              "filters": {}
            }
          }
        },
        "sort": {
          "price": "asc"
        }
      },
      newLine: navigator.userAgent.indexOf('Mac OS X') > -1 ? '\n' : '\r\n', // Mac 與 Windows 換行符號差異
      exJson: {
        "query": {
          "status": {
            "option": "online"
          },
          "type": "寶鑽戒指", // 物品基底 isBasicSearch
          "stats": [{
            "type": "and",
            "filters": []
          }],
          "filters": {
            "misc_filters": {
              "filters": {
                "ilvl": { // 物品等級 isLevelSearch
                  "min": 86
                },
                "crusader_item": { // 勢力區域 isExBasicSearch
                  "option": "true"
                },
                "corrupted": { // 是否污染
                  "option": "true"
                },
              }
            },
            "type_filters": {
              "filters": {
                "category": { // 物品種類 isCategorySearch
                  "option": "accessory.ring", // 戒指
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
    this.statsAPI();
    this.itemsAPI();
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
      this.fetchQueryID = ''
      this.axios.post(`http://localhost:3031/trade`, {
          searchJson: obj,
          copyText: this.copyText
        })
        .then((response) => {
          this.count += 1;
          response.data.total = response.data.total == "100000" ? `${response.data.total}+` : response.data.total
          this.status = `此次物品搜尋ID: ${response.data.id}, 總共 ${response.data.total} 筆符合`
          this.fetchID = response.data.fetchID
          this.fetchQueryID = response.data.id
          if (this.isPopWindow) {
            window.open(`https://web.poe.garena.tw/trade/search/%E9%8D%8A%E9%AD%94%E8%81%AF%E7%9B%9F/${response.data.id}`, '_blank', 'nodeIntegration=no')
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 300),
    statsAPI() { // 詞綴 API
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/stats`, )
        .then((response) => {
          response.data.result[0].entries.forEach((element, index) => { // 偽屬性
            this.pseudoStats.push(element.text, element.id)
          })
          response.data.result[1].entries.forEach((element, index) => { // 隨機屬性
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 處理複合詞綴，刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            this.explicitStats.push(text, element.id)
          })
          response.data.result[2].entries.forEach((element, index) => { // 固定屬性
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 處理複合詞綴，刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            this.implicitStats.push(text, element.id)
          })
          response.data.result[4].entries.forEach((element, index) => { // 附魔
            this.enchantStats.push(element.text, element.id)
          })
          response.data.result[5].entries.forEach((element, index) => { // 已工藝
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 處理複合詞綴，刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            this.craftedStats.push(text, element.id)
          })
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    itemsAPI() { // 物品 API
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/items`, )
        .then((response) => {
          this.allItems = response.data.result // TODO: 把 allItems 改為可套用至全域搜尋的資料格式
          let result = response.data.result
          result[0].entries.forEach((element, index) => { // "label": "飾品"(250筆) 一般飾品基底起始點 index = 179
            switch (true) {
              // 項鍊起始點 { "type": "碧珠護身符", "text": "碧珠護身符" }
              case index >= 179 && index <= 220:
                element.name = "項鍊"
                element.option = "accessory.amulet"
                this.equipItems.push(element)
                break;
                // 腰帶起始點 { "type": "素布腰帶", "text": "素布腰帶" }
              case index >= 221 && index <= 231:
                element.name = "腰帶"
                element.option = "accessory.belt"
                this.equipItems.push(element)
                break;
                // 戒指起始點 { "type": "裂痕戒指", "text": "裂痕戒指" }  
              case index >= 232:
                element.name = "戒指"
                element.option = "accessory.ring"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[1].entries.forEach((element, index) => { // "label": "護甲"(733筆) 一般護甲基底起始點 index = 357
            switch (true) {
              // 胸甲起始點 { "type": "黃金戰甲", "text": "黃金戰甲" }
              case index >= 357 && index <= 460:
                element.name = "胸甲"
                element.option = "armour.chest"
                this.equipItems.push(element)
                break;
                // 鞋子起始點 { "type": "異色鞋", "text": "異色鞋" }
              case index >= 461 && index <= 514:
                element.name = "鞋子"
                element.option = "armour.boots"
                this.equipItems.push(element)
                break;
                // 手套起始點 { "type": "擒拿手套", "text": "擒拿手套" }
              case index >= 515 && index <= 568:
                element.name = "手套"
                element.option = "armour.gloves"
                this.equipItems.push(element)
                break;
                // 頭部起始點 { "type": "喚骨頭盔", "text": "喚骨頭盔" }
              case index >= 569 && index <= 634:
                element.name = "頭部"
                element.option = "armour.helmet"
                this.equipItems.push(element)
                break;
                // 盾牌起始點 { "type": "黃金聖炎", "text": "黃金聖炎" }
              case index >= 635 && index <= 723:
                element.name = "盾"
                element.option = "armour.shield"
                this.equipItems.push(element)
                break;
                // 箭袋起始點 { "type": "火靈箭袋", "text": "火靈箭袋" }
              case index >= 724:
                element.name = "箭袋"
                element.option = "armour.quiver"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[6].entries.forEach((element, index) => { // "label": "珠寶"(146筆) 一般珠寶基底起始點 index = 137
            switch (true) {
              // 珠寶起始點 { "type": "催眠之眼珠寶", "text": "催眠之眼珠寶" }
              case index >= 137:
                element.name = "珠寶"
                element.option = "jewel"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[8].entries.forEach((element, index) => { // "label": "武器"(547筆) 一般武器基底起始點 index = 238
            switch (true) {
              // 爪起始點 { "type": "拳釘", "text": "拳釘" }
              case index >= 238 && index <= 262:
                element.name = "爪"
                element.option = "weapon.claw"
                element.weapon = "weapon.one" // "weapon.one" 單手武器
                this.equipItems.push(element)
                break;
                // 匕首起始點 { "type": "玻璃利片", "text": "玻璃利片" }
              case index >= 263 && index <= 287:
                element.name = "匕首"
                element.option = "weapon.dagger"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
                // 單手斧起始點 { "type": "鏽斧", "text": "鏽斧" }
              case index >= 288 && index <= 312:
                element.name = "單手斧"
                element.option = "weapon.oneaxe"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
                // 單手錘起始點 { "type": "朽木之棒", "text": "朽木之棒" }
              case index >= 313 && index <= 362:
                element.name = "單手錘"
                element.option = "weapon.onemace"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
                // 單手劍起始點 { "type": "鏽劍", "text": "鏽劍" }
              case index >= 363 && index <= 412:
                element.name = "單手劍"
                element.option = "weapon.onesword"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
                // 法杖起始點 { "type": "朽木法杖", "text": "朽木法杖" }
              case index >= 413 && index <= 432:
                element.name = "法杖"
                element.option = "weapon.wand"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
                // { "type": "魚竿", "text": "魚竿" }
              case index >= 433 && index <= 433:
                element.name = "釣竿"
                element.option = "weapon.rod"
                this.equipItems.push(element)
                break;
                // 弓起始點 { "type": "粗製弓", "text": "粗製弓" }
              case index >= 434 && index <= 458:
                element.name = "弓"
                element.option = "weapon.bow"
                this.equipItems.push(element)
                break;
                // 長杖起始點 { "type": "朽木之幹", "text": "朽木之幹" }
              case index >= 459 && index <= 480:
                element.name = "長杖"
                element.option = "weapon.staff"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
                // 雙手斧起始點 { "type": "石斧", "text": "石斧" }
              case index >= 481 && index <= 502:
                element.name = "雙手斧"
                element.option = "weapon.twoaxe"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
                // 雙手錘起始點 { "type": "朽木巨錘", "text": "朽木巨錘" }
              case index >= 503 && index <= 524:
                element.name = "雙手錘"
                element.option = "weapon.twomace"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
                // 雙手劍起始點 { "type": "鏽斑巨劍", "text": "鏽斑巨劍" }
              case index >= 525:
                element.name = "雙手劍"
                element.option = "weapon.twosword"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    mapAreaCopy(name) {
      clipboard.writeText(name)
    },
    similarity(s1, s2) { // 字串吻合度比較 this.similarity(第一字串.第二字串)
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
    clickToSearch() {
      this.searchJson.query.stats[0].filters = []
      this.searchStats.forEach((element, index) => {
        if (element.isSearch) {
          let value = {}
          if (element.min && element.max) {
            value.min = element.min
            value.max = element.max
          } else if (element.min) {
            value.min = element.min
          } else if (element.max) {
            value.max = element.max
          }
          this.searchJson.query.stats[0].filters.push({
            "id": element.id,
            "disabled": false,
            "value": value
          })
        }
      })
      this.searchTrade(this.searchJson)
    },
    rareStatsAnalysis(itemArray) {

      let tempStat = []
      let itemExplicitStats = [] // 該物品固定 + 隨機屬性
      let itemLevelIndex = 0 // 物品等級於陣列中的位置
      let itemStatStart = 0 // 物品隨機詞綴初始位置
      let itemStatEnd = itemArray.length - 1 // 物品隨機詞綴結束位置

      itemArray.forEach((element, index) => {
        if (stringSimilarity.compareTwoStrings(element, '魔符階級:') > 0.7) {
          itemStatStart = index + 2
        } else if (stringSimilarity.compareTwoStrings(element, '物品等級:') > 0.7) {
          itemStatStart = index + 2
          itemLevelIndex = index
        }
        if (element === "--------" && index !== itemStatStart + 1 && itemStatStart && index > itemStatStart && itemStatEnd == itemArray.length - 1) { // 判斷隨機詞墜結束點
          itemStatEnd = index
        }
      });
      for (let index = itemStatStart; index < itemStatEnd; index++) {
        if (itemArray[index] !== "--------") {
          itemExplicitStats.push(itemArray[index])

          if (itemArray[index].indexOf('(implicit)') > -1) { // 固定屬性
            let text = itemArray[index]
            text = text.substring(0, text.indexOf('(implicit)')) // 刪除(implicit)字串
            tempStat.push(stringSimilarity.findBestMatch(text, this.implicitStats))
            tempStat[tempStat.length - 1].type = "固定"
          } else if (itemArray[index].indexOf('(crafted)') > -1) { // 已工藝屬性
            let text = itemArray[index]
            text = text.substring(0, text.indexOf('(crafted)'))
            tempStat.push(stringSimilarity.findBestMatch(text, this.craftedStats))
            tempStat[tempStat.length - 1].type = "工藝"
          } else if (itemArray[index + 1] === "--------" && index + 1 !== itemStatEnd) { // 附魔屬性沒有 enchant 字串，判斷方式不同
            // TODO: 項鍊塗油的配置屬性為附魔，要再額外判斷
            // let text = itemArray[index]
            // text = text.substring(0, text.indexOf('(enchant)')) 
            tempStat.push(stringSimilarity.findBestMatch(itemArray[index], this.enchantStats))
            tempStat[tempStat.length - 1].type = "附魔"
          } else { // 隨機屬性
            tempStat.push(stringSimilarity.findBestMatch(itemArray[index], this.explicitStats))
            tempStat[tempStat.length - 1].type = "隨機"
          }
        }
      }
      // console.log(itemExplicitStats)
      // console.log(tempStat)
      tempStat.forEach((element, index) => { // 比對詞綴，抓出隨機數值與詞綴搜尋 ID
        let itemStatArray = itemExplicitStats[index].split(' ') // 將物品上的詞綴拆解
        let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
        itemStatArray.length = matchStatArray.length // TODO: 確認(crafted)字串是否有連起來
        // console.log(itemStatArray, matchStatArray)
        let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
        let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
        for (let index = 0; index < itemStatArray.length; index++) { // 比較由空格拆掉後的詞綴陣列元素
          if (randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最大值
            randomMaxValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
            randomMaxValue = isNaN(randomMaxValue) ? '' : randomMaxValue
          }
          if (!randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最小值
            randomMinValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
            if (matchStatArray[index].indexOf('，#') > -1) { // 處理隨機數值在'，'後的詞綴(無法用空格符號 split)
              let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('，') + 1)
              randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
            }
          }
        }
        this.searchStats.push({
          "id": element.ratings[element.bestMatchIndex + 1].target,
          "text": element.bestMatch.target,
          "min": randomMinValue,
          "max": randomMaxValue,
          "isValue": randomMinValue ? true : false,
          "isSearch": true,
          "type": element.type
        })
        // console.log(`物品上第${index+1}詞詞綴: ${itemArray[index+11]}\n第${index+1}詞ID: ${element.ratings[element.bestMatchIndex+1].target}\n第一詞詞綴: ${element.bestMatch.target}\n吻合率: ${element.bestMatch.rating}`)
      })
    },
    itemAnalysis(item, matchItem) {
      const NL = this.newLine
      this.itemBasic.text = matchItem.text
      this.itemCategory.option.length = 0
      if (item.indexOf('物品等級: ') > -1) {
        let levelPos = item.substring(item.indexOf('物品等級: ') + 5)
        let levelPosEnd = levelPos.indexOf(NL)
        this.itemLevel.value = parseInt(levelPos.substring(0, levelPosEnd).trim(), 10)
      }
      this.itemCategory.option.push({
        label: matchItem.name,
        prop: matchItem.option,
      })
      this.itemCategory.chosenObj = {
        label: matchItem.name,
        prop: matchItem.option,
      }
      if (matchItem.weapon) {
        this.itemCategory.option.push({
          label: matchItem.weapon === "weapon.one" ? "單手武器" : "雙手武器",
          prop: matchItem.weapon === "weapon.one" ? "weapon.one" : "weapon.twomelee",
        })
      }
      this.itemCategory.isSearch = true
      this.isCategorySearch()

      // TODO: 勢力基底用 array.indexOf(Array) 判斷及後續處理
      
      var itemInf = { // 物品各項資訊
        Category: '', // 物品分類
        Basic: '', // 物品基底
        exBasic: '', // 勢力基底
        Level: '', // 物品等級
        Corrupted: false, // 是否污染
      }
    },
    isLevelSearch() {
      if (!this.itemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters.ilvl // 刪除物品等級 filter
      } else if (this.itemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters.ilvl = { // 增加物品等級最小值 filter
          "min": this.itemLevel.value
        }
      }
    },
    isBasicSearch() {
      if (!this.itemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.type // 刪除物品基底 filter
      } else if (this.itemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.type = this.itemBasic.text // 增加物品基底 filter
      }
    },
    isCategorySearch() {
      if (!this.itemCategory.isSearch && !_.isEmpty(this.itemCategory.chosenObj) && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.type_filters.filters.category // 刪除物品種類 filter
      } else if (this.itemCategory.isSearch && !_.isEmpty(this.itemCategory.chosenObj) && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.type_filters.filters.category = { // 增加物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
    },
    categoryChange(value) {
      if (!_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.type_filters.filters.category = { // 修改物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
      this.itemCategory.chosenObj = value
    },
    isExBasicSearch() {
      if (!this.itemExBasic.isSearch && !_.isEmpty(this.itemExBasic.chosenObj) && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] // 刪除勢力選項
      } else if (this.itemExBasic.isSearch && !_.isEmpty(this.itemExBasic.chosenObj) && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
    },
    exBasicChange(value) {
      let exSearchItem = _.isEmpty(this.itemExBasic.chosenObj) ? {} : this.itemExBasic.chosenObj.prop // 前一個搜尋的勢力選項
      if (!_.isEmpty(this.searchJson) && this.searchJson.query.filters.misc_filters.filters.hasOwnProperty(exSearchItem)) {
        delete this.searchJson.query.filters.misc_filters.filters[exSearchItem] // 刪除前一個勢力選項
      }
      if (!_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters[value.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
      this.itemExBasic.chosenObj = value
    },
    checkValue(event, item, ref) {
      if (event < 0) {
        if (ref == "min") {
          item.min = 0
        } else {
          item.max = 0
        }
      }
    },
  },
  watch: {
    copyText: function () {
      let item = this.copyText;
      if (item.indexOf('稀有度') === -1) { // POE 內的文字必定有稀有度
        return
      }
      this.fetchQueryID = ''
      this.searchStats = []
      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件
      const NL = this.newLine
      let itemArray = item.split(NL); // 以行數拆解複製物品文字
      let posRarity = item.indexOf(': ')
      let Rarity = itemArray[0].substring(posRarity + 2).trim()
      let searchName = itemArray[1]
      this.searchName = itemArray[2] === "--------" ? `物品名稱『${itemArray[1]}』` : `物品名稱『${itemArray[1]} ${itemArray[2]}』`
      let itemBasic = itemArray[2]

      this.equipItems.forEach(element => {
        if (`${itemArray[1]} ${itemArray[2]}`.indexOf(element.text) > -1) {
          this.itemAnalysis(item, element)
        }
      });

      if (Rarity === "傳奇" && item.indexOf('地圖階級') === -1 && item.indexOf('在塔恩的鍊金室') === -1) { // 傳奇道具
        if (item.indexOf('未鑑定') === -1) { // 已鑑定傳奇
          this.searchJson.query.name = searchName
          let tempStat = []
          if (searchName === "看守之眼") { // 尊師三相珠寶 
            tempStat.push(stringSimilarity.findBestMatch(itemArray[11], this.explicitStats))
            tempStat.push(stringSimilarity.findBestMatch(itemArray[12], this.explicitStats))
            if (itemArray[13] !== "--------") {
              tempStat.push(stringSimilarity.findBestMatch(itemArray[13], this.explicitStats))
            }
            tempStat.forEach((element, index) => { // 比對詞綴
              let itemStatArray = itemArray[index + 11].split(' ') // 將物品上的詞綴拆解
              let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
              let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
              let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
              for (let index = 0; index < itemStatArray.length; index++) { // 比較由空格拆掉後的詞綴陣列元素
                if (randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最大值
                  randomMaxValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
                  randomMaxValue = isNaN(randomMaxValue) ? '' : randomMaxValue
                }
                if (!randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最小值
                  randomMinValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
                  if (matchStatArray[index].indexOf('，#') > -1) { // 處理隨機數值在'，'後的詞綴(無法用空格符號 split)
                    let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('，') + 1)
                    randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
                  }
                }
              }
              this.searchStats.push({
                "id": element.ratings[element.bestMatchIndex + 1].target,
                "text": element.bestMatch.target,
                "min": randomMinValue,
                "max": randomMaxValue,
                "isValue": randomMinValue ? true : false,
                "type": "傳奇",
                "isSearch": true,
              })
              // console.log(`物品上第${index+1}詞詞綴: ${itemArray[index+11]}\n第${index+1}詞ID: ${element.ratings[element.bestMatchIndex+1].target}\n第一詞詞綴: ${element.bestMatch.target}\n吻合率: ${element.bestMatch.rating}`)
            })
            return // 選擇詞墜後再搜尋
          } else if (searchName === "奧爾的崛起") {
            tempStat.push(stringSimilarity.findBestMatch(itemArray[15], this.explicitStats))
            tempStat.forEach((element, index) => { // 比對詞綴
              if (element.bestMatch.rating) { // bestMatch > 0 (有抓到詞綴)
                let itemStatArray = itemArray[index + 11].split(' ') // 將物品上的詞綴拆解
                let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
                this.searchStats.push({
                  "id": element.ratings[element.bestMatchIndex + 1].target,
                  "text": element.bestMatch.target,
                  "min": '',
                  "max": '',
                  "isValue": false,
                  "type": "傳奇",
                  "isSearch": true,
                })
                // console.log(`物品上第${index+1}詞詞綴: ${itemArray[index+11]}\n第${index+1}詞ID: ${element.ratings[element.bestMatchIndex+1].target}\n第一詞詞綴: ${element.bestMatch.target}\n吻合率: ${element.bestMatch.rating}`)
              }
            })
            return // 選擇詞墜後再搜尋
          }
        } else { // 未鑑定傳奇(但會搜到相同基底)
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
      } else if (Rarity === "命運卡" || Rarity === "通貨") {
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
      } else if (Rarity === "稀有") {
        this.rareStatsAnalysis(itemArray)
        return
      } else {
        this.status = `目前版本尚未支援搜尋藍裝及鍊魔器官`
        return
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
      this.searchTrade(this.searchJson)
    },
    isOnline: function () {
      if (_.isEmpty(this.searchJson)) {
        return
      }
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
      if (_.isEmpty(this.searchJson)) {
        return
      }
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
    isPopWindow: function () {
      if (_.isEmpty(this.searchJson)) {
        return
      }
      if (this.isPopWindow && (JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson))) {
        this.searchTrade(this.searchJson)
      }
    },
  },
  computed: {
    isSearchJson() {
      return !_.isEmpty(this.searchJson)
    },
  },
}
</script>

<style>
.MapCopy {
  border-top: 1px solid #000;
  padding: 5px;
}

/* 取消 input 欄位的 step 功能 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.lesspadding div {
  padding-left: 3px !important;
  padding-right: 3px !important;
}
</style>
