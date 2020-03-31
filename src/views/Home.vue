<template>
<div class="home">
  <hr>
  <b-container class="bv-example-row">
    <b-row class="lesspadding">
      <b-col align-self="center">
        <b-button v-b-toggle.collapse-1 size="sm" variant="outline-primary">搜尋設定</b-button>
      </b-col>
      <b-col align-self="center">
        <b-button @click="isItemCollapse = !isItemCollapse" :disabled="!isItem" size="sm" variant="outline-primary">物品設定</b-button>
      </b-col>
      <b-col align-self="center">
        <b-button @click="isStatsCollapse = !isStatsCollapse" :disabled="searchStats.length == 0" size="sm" variant="outline-primary">詞綴設定</b-button>
      </b-col>
      <b-col align-self="center">
        <b-button @click="isMapCollapse = !isMapCollapse" :disabled="!isMap" size="sm" variant="outline-primary">地圖設定</b-button>
      </b-col>
      <b-col align-self="center">
        <b-button @click="isGemCollapse = !isGemCollapse" :disabled="!isGem" size="sm" variant="outline-primary">技能設定</b-button>
      </b-col>
    </b-row>
    <b-collapse visible id="collapse-1" class="mt-2">
      <b-card>
        <b-row>
          <b-col sm="5" style="padding-left: 15px;">
            <v-select :options="leagues.option" v-model="leagues.chosenL" :clearable="false" :filterable="false"></v-select>
          </b-col>
          <b-col sm="3" style="padding-top: 5px;">
            <!-- <b>已搜尋次數 {{ count }}</b> -->
          </b-col>
        </b-row>
        <b-row style="padding-top: 10px;">
          <b-col style="padding-left: 8px;">
            <b-form-checkbox v-model="isOnline" :disabled="isLoading" switch :inline="false">
              <b>只顯示線上</b>
            </b-form-checkbox>
          </b-col>
          <b-col>
            <b-form-checkbox v-model="isPriced" :disabled="isLoading" switch>
              <b>{{ pricedText }}</b>
            </b-form-checkbox>
          </b-col>
          <b-col sm="5" style="padding-left: 0px;">
            <b-form-checkbox v-model="isMapAreaCollapse" switch :inline="false">
              <b>輿圖區域名稱複製</b>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-collapse :visible="isMapAreaCollapse" class="lesspadding">
          <b-row style="padding-top: 15px;">
            <b-col sm="5">
              <b-button @click="mapAreaCopy('海沃克．哈姆雷特')" size="sm" variant="outline-primary">海沃克．哈姆雷特 (左上外)</b-button>
            </b-col>
            <b-col sm="2"></b-col>
            <b-col sm="5">
              <b-button @click="mapAreaCopy('雷克斯．伊喬里斯')" size="sm" variant="outline-primary">雷克斯．伊喬里斯 (右上外)</b-button>
            </b-col>
          </b-row>
          <b-row style="padding-top: 8px;">
            <b-col sm="3"></b-col>
            <b-col sm="3">
              <b-button @click="mapAreaCopy('特恩之盡')" size="sm" variant="outline-primary">特恩之盡 (左上內)</b-button>
            </b-col>
            <b-col sm="5">
              <b-button @click="mapAreaCopy('雷克斯．普拉克斯瑪')" size="sm" variant="outline-primary">雷克斯．普拉克斯瑪 (右上內)</b-button>
            </b-col>
            <b-col sm="1"></b-col>
          </b-row>
          <b-row style="padding-top: 8px;">
            <b-col sm="1"></b-col>
            <b-col sm="5">
              <b-button @click="mapAreaCopy('格倫納許．凱恩斯')" size="sm" variant="outline-primary">格倫納許．凱恩斯 (左下內)</b-button>
            </b-col>
            <b-col sm="4">
              <b-button @click="mapAreaCopy('瓦爾多憩地')" size="sm" variant="outline-primary">瓦爾多憩地 (右下內)</b-button>
            </b-col>
            <b-col sm="2"></b-col>
          </b-row>
          <b-row style="padding-top: 8px;">
            <b-col sm="4">
              <b-button @click="mapAreaCopy('新瓦斯提里')" size="sm" variant="outline-primary">新瓦斯提里 (左下外)</b-button>
            </b-col>
            <b-col sm="4"></b-col>
            <b-col sm="4">
              <b-button @click="mapAreaCopy('里拉．奧斯汀')" size="sm" variant="outline-primary">里拉．奧斯汀 (右下外)</b-button>
            </b-col>
          </b-row>
        </b-collapse>
      </b-card>
    </b-collapse>
  </b-container>
  <b-container class="bv-example-row">
    <b-collapse :visible="isItem && isItemCollapse" class="mt-2">
      <b-card>
        <!-- TODO: 全部物品篩選 -->
        <b-row class="lesspadding">
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="itemLevel.isSearch" @input="isItemLevelSearch" switch>物品等級</b-form-checkbox>
          </b-col>
          <b-col sm="1" style="padding-top: 3px;">
            <b-form-input v-model.number="itemLevel.min" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="1" style="padding-top: 3px;">
            <b-form-input v-model.number="itemLevel.max" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" :style="itemLevel.max && (itemLevel.max < itemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
          </b-col>
        </b-row>
        <b-row class="lesspadding" style="padding-top: 5px;">
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="itemBasic.isSearch" @input="isItemBasicSearch" switch>物品基底</b-form-checkbox>
          </b-col>
          <b-col sm="2">
            <b-form-input v-model="itemBasic.text" :disabled="true"></b-form-input>
          </b-col>
          <b-col sm="1"></b-col>
          <b-col sm="2" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="itemCategory.isSearch" @input="isItemCategorySearch" switch>物品分類</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select :options="itemCategory.option" v-model="itemCategory.chosenObj" label="label" @input="categoryChange" :disabled="!itemCategory.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select>
          </b-col>
        </b-row>
        <b-row class="lesspadding" style="padding-top: 3px;">
          <b-col sm="3" style="padding-top: 5px;">
            <b-form-checkbox class="float-right" v-model="isCorrupted" @input="isCorruptedSearch" switch>{{ corruptedText }}</b-form-checkbox>
          </b-col>
          <b-col sm="3"></b-col>
          <b-col style="padding-top: 5px;">
            <b-form-checkbox class="float-right" v-model="itemExBasic.isSearch" @input="isExBasicSearch" switch>勢力基底</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select class="exBasicIcon" :options="itemExBasic.option" :value="itemExBasic.chosenObj" label="label" @input="exBasicChange" :disabled="!itemExBasic.isSearch" :clearable="false" :filterable="false" placeholder="任何">
              <template v-slot:option="itemExBasic">
                <b-img :src="itemExBasic.url"></b-img>
                {{ itemExBasic.label }}
              </template>
            </v-select>
            <!-- <v-select :options="itemExBasic.option" :value="itemExBasic.chosenObj" label="label" @input="exBasicChange" :disabled="!itemExBasic.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select> -->
          </b-col>
        </b-row>
        <b-row v-if="searchStats.length == 0">
          <b-col sm="10"></b-col>
          <b-col sm="2" style="padding-top: 15px;">
            <b-button @click="clickToSearch" variant="outline-primary">查詢</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-container>
  <b-container class="bv-example-row">
    <b-collapse :visible="isMap && isMapCollapse" class="mt-2">
      <b-card>
        <b-row class="lesspadding">
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="mapLevel.isSearch" @input="isMapLevelSearch" switch>地圖階級</b-form-checkbox>
          </b-col>
          <b-col sm="1" style="padding-top: 3px;">
            <b-form-input v-model.number="mapLevel.min" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="1" style="padding-top: 3px;">
            <b-form-input v-model.number="mapLevel.max" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" :style="mapLevel.max && (mapLevel.max < mapLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
          </b-col>
        </b-row>
        <b-row class="lesspadding" style="padding-top: 5px;">
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="isCorrupted" @input="isCorruptedSearch" switch>{{ corruptedText }}</b-form-checkbox>
          </b-col>
          <b-col sm="2">
          </b-col>
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="mapBasic.isSearch" @input="isMapBasicSearch" switch>地圖基底</b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <!-- <b-form-input v-model="mapBasic.chosenM" :disabled="true"></b-form-input> -->
            <v-select :options="mapBasic.option" v-model="mapBasic.chosenM" @input="isMapBasicSearch" label="label" :disabled="!mapBasic.isSearch" :clearable="false" :filterable="true"></v-select>
          </b-col>
        </b-row>
        <b-collapse :visible="raritySet.chosenObj.label !== '傳奇'">
          <b-row style="padding-top: 8px;">
            <b-col sm="4" style="padding-left: 20px;">
              <b-form-checkbox v-model="mapCategory.isShaper" switch :inline="false">塑者領域</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <b-form-checkbox v-model="mapCategory.isElder" switch :inline="false">尊師領域</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <b-form-checkbox v-model="mapCategory.isBlighted" switch :inline="false">凋落地區</b-form-checkbox>
            </b-col>
          </b-row>
        </b-collapse>
        <b-collapse :visible="mapCategory.isElder">
          <b-row style="padding-top: 5px;">
            <b-col sm="4"></b-col>
            <b-col sm="3" style="padding-left: 28px; padding-top: 5px;">
              <b-form-checkbox v-model="mapElderGuard.isSearch" @input="isMapElderGuardSearch" switch :inline="false">守衛</b-form-checkbox>
            </b-col>
            <b-col sm="5">
              <v-select :options="mapElderGuard.option" v-model="mapElderGuard.chosenObj" @input="isMapElderGuardSearch" label="label" :disabled="!mapElderGuard.isSearch" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
        </b-collapse>
        <b-row>
          <b-col sm="10"></b-col>
          <b-col sm="2" style="padding-top: 15px;">
            <b-button @click="clickToSearch" variant="outline-primary">查詢</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-container>
  <b-container class="bv-example-row">
    <b-collapse :visible="isGem && isGemCollapse" class="mt-2">
      <b-card>
        <b-row class="lesspadding">
          <b-col sm="3" style="padding-top: 3px;">
            <b-form-checkbox class="float-right" v-model="gemLevel.isSearch" @input="isGemLevelSearch" switch>技能等級</b-form-checkbox>
          </b-col>
          <b-col sm="1">
            <b-form-input v-model.number="gemLevel.min" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="1">
            <b-form-input v-model.number="gemLevel.max" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" :style="gemLevel.max && (gemLevel.max < gemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="3" style="padding-top: 3px;">
            <b-form-checkbox class="float-right" v-model="gemQuality.isSearch" @input="isGemQualitySearch" switch>技能品質</b-form-checkbox>
          </b-col>
          <b-col sm="1">
            <b-form-input v-model.number="gemQuality.min" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" size="sm" type="number"></b-form-input>
          </b-col>
          <b-col sm="1">
            <b-form-input v-model.number="gemQuality.max" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" :style="gemQuality.max && (gemQuality.max < gemQuality.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="lesspadding" style="padding-top: 10px;">
          <b-col sm="4" style="padding-top: 6px;">
            <b-form-checkbox v-model="isCorrupted" @input="isCorruptedSearch" switch>{{ corruptedText }}</b-form-checkbox>
          </b-col>
          <b-col sm="3" style="padding-top: 6px;">
            <b-form-checkbox class="float-right" v-model="gemBasic.isSearch" @input="isGemBasicSearch" switch>技能基底</b-form-checkbox>
          </b-col>
          <b-col sm="5">
            <v-select :options="gemBasic.option" v-model="gemBasic.chosenG" @input="isGemBasicSearch" label="label" :disabled="!gemBasic.isSearch" :clearable="false" :filterable="true"></v-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="10"></b-col>
          <b-col sm="2" style="padding-top: 15px;">
            <b-button @click="clickToSearch" variant="outline-primary">查詢</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-container>
  <hr>
  <h5 :style="isItem ? 'cursor: pointer; user-select:none;' : ''" @click="isStatsCollapse = !isStatsCollapse">{{ searchName }}</h5>
  <b-container class="bv-example-row">
    <b-collapse :visible="isStatsCollapse && searchStats.length > 0">
      <table class="table table-sm">
        <thead class="thead-dark">
          <tr>
            <th scope="col">查詢</th>
            <th scope="col">種類</th>
            <th scope="col">詞綴內容</th>
            <th scope="col">最小值</th>
            <th scope="col">最大值</th>
          </tr>
        </thead>
        <tbody class="searchStats">
          <tr v-for="(item, index) in searchStats" :key="index" style="padding-top: 5px;" :style="item.isSearch ? '' : 'color: #AAACAD'">
            <td style="width: 45px;">
              <b-form-checkbox v-model="item.isSearch"></b-form-checkbox>
            </td>
            <td style="width: 45px; cursor: pointer; user-select:none;" :style="item.type === '隨機' ? '' : 'color: red;'" @click="item.isSearch = !item.isSearch">{{ item.type }} </td>
            <td style="cursor: pointer; user-select:none; white-space:pre-wrap;" @click="item.isSearch = !item.isSearch">{{ item.text }} </td>
            <td style="width: 64px; padding-top: 5px !important;">
              <div style="padding:0px 4px 0px 6px;">
                <b-form-input v-if="item.isValue" v-model.number="item.min" @dblclick="item.min = ''" :disabled="!item.isSearch" size="sm" type="number" style="text-align: center;"></b-form-input>
              </div>
            </td>
            <td style="width: 64px; padding-top: 5px !important;">
              <div style="padding:0px 4px 0px 6px;">
                <b-form-input v-if="item.isValue" v-model.number="item.max" @dblclick="item.max = ''" :disabled="!item.isSearch" :style="item.max && (item.max < item.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number" style="text-align: center;"></b-form-input>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <b-row>
        <b-col sm="10"></b-col>
        <b-col sm="2">
          <b-button @click="clickToSearch" variant="outline-primary">查詢</b-button>
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
  <h6>{{ status }}</h6>
  <div>
    <b-button v-if="fetchQueryID" @click="popOfficialWebsite" size="sm" variant="outline-primary">官方交易市集</b-button>
    <PriceAnalysis @loading="detectLoading" :fetchID="fetchID" :fetchQueryID="fetchQueryID" :isPriced="isPriced"></PriceAnalysis>
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
  clipboard,
  shell
} = require('electron')
export default {
  name: 'home',
  components: {
    PriceAnalysis
  },
  data() {
    return {
      count: 0,
      status: '',
      copyText: '',
      testResponse: '',
      isLoading: false,
      isOnline: true,
      isPriced: true,
      isItem: false,
      isMap: false,
      isGem: false,
      isCorrupted: false,
      isItemCollapse: true,
      isMapCollapse: true,
      isGemCollapse: true,
      isStatsCollapse: true,
      isMapAreaCollapse: false,
      searchStats: [], // 分析拆解後的物品詞綴陣列，提供使用者在界面勾選是否查詢及輸入數值
      pseudoStats: [], // 偽屬性
      explicitStats: [], // 隨機屬性
      implicitStats: [], // 固定屬性
      enchantStats: [], // 附魔
      clusterJewelStats: [], // 星團珠寶附魔詞綴
      craftedStats: [], // 已工藝
      fetchID: [], // 預計要搜尋物品細項的 ID, 10 個 ID 為一陣列
      searchName: '',
      fetchQueryID: '',
      allItems: [], // 物品 API 抓回來的資料
      equipItems: [], // 可裝備的物品資料
      leagues: { // 搜尋聯盟 
        option: ["譫妄聯盟", "譫妄聯盟（專家）", "標準模式", "專家模式"],
        chosenL: "譫妄聯盟"
      },
      raritySet: { // 稀有度設定
        option: [{
          label: "一般",
          prop: 'normal'
        }, {
          label: "魔法",
          prop: 'magic'
        }, {
          label: "稀有",
          prop: 'rare'
        }, {
          label: "傳奇",
          prop: 'unique'
        }, {
          label: "非傳奇",
          prop: 'nonunique'
        }, ],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      mapLevel: { // 地圖階級
        min: 0,
        max: 0,
        isSearch: false,
      },
      mapCategory: { // 地圖種類
        isShaper: false,
        isElder: false,
        isBlighted: false
      },
      mapElderGuard: { // 尊師守衛地圖
        option: [{
          label: "異界．奴役",
          prop: "1"
        }, {
          label: "異界．根除",
          prop: "2"
        }, {
          label: "異界．干擾",
          prop: "3"
        }, {
          label: "異界．淨化",
          prop: "4"
        }, ],
        chosenObj: {
          label: "無",
          prop: ''
        },
        isSearch: false,
      },
      mapBasic: { // 地圖基底
        option: [],
        chosenM: '無',
        isSearch: false,
      },
      itemLevel: { // 物品等級
        min: 0,
        max: '',
        isSearch: false,
      },
      itemCategory: { // 物品分類
        option: [],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      itemBasic: { // 物品基底
        text: '',
        isSearch: false,
      },
      itemExBasic: { // 勢力基底
        option: [{
          label: "塑者之物",
          prop: "shaper_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/shaper-symbol.png?1582104312019"
        }, {
          label: "尊師之物",
          prop: "elder_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/elder-symbol.png?1582104312011"
        }, {
          label: "聖戰君王物品",
          prop: "crusader_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/crusader-symbol.png?1582104312011"
        }, {
          label: "救贖者物品",
          prop: "redeemer_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/redeemer-symbol.png?1582104312015"
        }, {
          label: "總督軍物品",
          prop: "warlord_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/warlord-symbol.png?1582104312019"
        }, {
          label: "狩獵者物品",
          prop: "hunter_item",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/item/popup/hunter-symbol.png?1582104312015"
        }, ],
        chosenObj: {
          label: "任何",
          prop: ''
        },
        isSearch: false,
      },
      gemLevel: { // 技能寶石等級
        min: 0,
        max: '',
        isSearch: false,
      },
      gemQuality: { // 技能寶石品質
        min: 0,
        max: '',
        isSearch: false,
      },
      gemBasic: { // 技能寶石基底
        option: [],
        chosenG: '無',
        isSearch: false,
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
            },
            "map_filters": {
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
          "type": "寶鑽戒指", // 物品基底 isItemBasicSearch
          "stats": [{
            "type": "and",
            "filters": [{
              "id": "enchant.stat_3948993189", // 附魔：星團珠寶(jewel.cluster) 固定詞綴ID
              "value": { // "附加的小型天賦給予：#"
                "option": 16 // 1~53
              },
              'disabled': false
            }, {
              "id": "enchant.stat_2954116742", // 附魔：項鍊塗油 固定詞綴ID
              "value": { // "配置 #"
                "option": 32345 // 各技能皆一組 ID
              },
              'disabled': false
            }]
          }],
          "filters": {
            "misc_filters": {
              "filters": {
                "ilvl": { // 物品等級 isItemLevelSearch
                  "min": 86
                },
                "crusader_item": { // 勢力區域 isExBasicSearch
                  "option": "true"
                },
                "corrupted": { // 是否污染 isCorruptedSearch
                  "option": "true"
                },
                "gem_level": { // 技能等級 isGemLevelSearch
                  "min": 10
                },
                "quality": { // 技能品質 isGemQualitySearch
                  "min": 10
                },
              }
            },
            "type_filters": {
              "filters": {
                "category": { // 物品種類 isItemCategorySearch
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
    if (clipboard.readText().indexOf('稀有度:') > -1) {
      clipboard.writeText('')
    }
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
          copyText: this.copyText,
          league: this.leagues.chosenL
        })
        .then((response) => {
          this.count += 1;
          response.data.total = response.data.total == "100000" ? `${response.data.total}+` : response.data.total
          this.status = `共 ${response.data.total} 筆符合`
          this.fetchID = response.data.fetchID
          this.fetchQueryID = response.data.id
        })
        .catch(function (error) {
          console.log(error);
        })
    }, 300),
    popOfficialWebsite() {
      shell.openExternal(`https://web.poe.garena.tw/trade/search/${this.leagues.chosenL}/${this.fetchQueryID}`)
      // window.open(`https://web.poe.garena.tw/trade/search/${this.leagues.chosenL}/${this.fetchQueryID}`, '_blank', 'nodeIntegration=no')
    },
    detectLoading(boolean) {
      this.isLoading = boolean
    },
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
            if (element.id === "enchant.stat_3948993189") { // 星團珠寶固定附魔詞綴
              element.option.options.forEach((element, index) => {
                this.clusterJewelStats.push(element.text, (element.id).toString())
              })
            }
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
          result[0].entries.forEach((element, index) => { // "label": "飾品"(251筆) 一般飾品基底起始點 index = 180
            switch (true) {
              // 項鍊起始點 { "type": "碧珠護身符", "text": "碧珠護身符" }
              case index >= 180 && index <= 221:
                element.name = "項鍊"
                element.option = "accessory.amulet"
                this.equipItems.push(element)
                break;
                // 腰帶起始點 { "type": "素布腰帶", "text": "素布腰帶" }
              case index >= 222 && index <= 231:
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
          result[1].entries.forEach((element, index) => { // "label": "護甲"(737筆) 一般護甲基底起始點 index = 361
            switch (true) {
              // 胸甲起始點 { "type": "黃金戰甲", "text": "黃金戰甲" }
              case index >= 361 && index <= 464:
                element.name = "胸甲"
                element.option = "armour.chest"
                this.equipItems.push(element)
                break;
                // 鞋子起始點 { "type": "異色鞋", "text": "異色鞋" }
              case index >= 465 && index <= 518:
                element.name = "鞋子"
                element.option = "armour.boots"
                this.equipItems.push(element)
                break;
                // 手套起始點 { "type": "擒拿手套", "text": "擒拿手套" }
              case index >= 519 && index <= 572:
                element.name = "手套"
                element.option = "armour.gloves"
                this.equipItems.push(element)
                break;
                // 頭部起始點 { "type": "喚骨頭盔", "text": "喚骨頭盔" }
              case index >= 573 && index <= 638:
                element.name = "頭部"
                element.option = "armour.helmet"
                this.equipItems.push(element)
                break;
                // 盾牌起始點 { "type": "黃金聖炎", "text": "黃金聖炎" }
              case index >= 639 && index <= 727:
                element.name = "盾"
                element.option = "armour.shield"
                this.equipItems.push(element)
                break;
                // 箭袋起始點 { "type": "火靈箭袋", "text": "火靈箭袋" }
              case index >= 728:
                element.name = "箭袋"
                element.option = "armour.quiver"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[6].entries.forEach((element, index) => { // "label": "珠寶"(159筆) 一般珠寶基底起始點 index = 137
            switch (true) {
              // 珠寶起始點 { "type": "催眠之眼珠寶", "text": "催眠之眼珠寶" }
              case index >= 147:
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
          result[7].entries.forEach((element, index) => { // "label": "地圖"(635筆) 只抓 warfortheatlas 一般地圖基底
            switch (true) {
              // 地圖起始點 { "type": "惡靈學院", "text": "惡靈學院" }
              case index >= 28 && index <= 169:
                this.mapBasic.option.push(element.text)
                break;
              default:
                break;
            }
          });
          result[5].entries.forEach((element, index) => { // "label": "技能寶石"(418筆)
            this.gemBasic.option.push(element.text)
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    mapAreaCopy(name) {
      clipboard.writeText(name)
      this.$bvToast.toast(`${name} 區域已複製!`, {
        noCloseButton: true,
        toaster: 'toast-center-center',
        variant: 'primary',
        autoHideDelay: 800,
        appendToast: false
      })
      this.isMapAreaCollapse = false
    },
    clickToSearch() { // TODO: 重構物品/地圖交替搜尋時邏輯 stats: [{type: "and", filters: [], disabled: true(?)}]
      if (this.isItem) {
        this.searchJson.query.stats[0].filters.length = 0
      }
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
          } else if (element.option) {
            value.option = element.option
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
    itemStatsAnalysis(itemArray, rarityFlag) {
      this.isStatsCollapse = rarityFlag ? false : true
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
        if (element.indexOf("配置") > -1 && element.indexOf("(enchant)") > -1) {
          itemArray.splice(index + 1, 1);
          itemStatEnd--
        }
        if (element.indexOf("附加的小型天賦給予：") > -1 && element.indexOf("(enchant)") == -1) { // 有折行的星團珠寶附魔詞綴
          itemStatEnd-- 
          switch (true) {
            case element.indexOf("斧攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n劍攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              itemArray.splice(index + 1, 1);
              break;
            case element.indexOf("長杖攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n錘或權杖攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              itemArray.splice(index + 1, 1);
              break;
            case element.indexOf("爪攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n匕首攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              itemArray.splice(index + 1, 1);
              break;
            case element.indexOf("增加 12% 陷阱傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n增加 12% 地雷傷害 (enchant)`
              itemArray.splice(index + 1, 1);
              break;
            case element.indexOf("增加 10% 藥劑回復生命") > -1:
              itemArray[index] = `${itemArray[index]}\n增加 10% 藥劑回復魔力 (enchant)`
              itemArray.splice(index + 1, 1);
              break;
            default:
              break;
          }
        }
        if (element === "--------" && index !== itemStatStart + 1 && index !== itemStatStart + 2 && itemStatStart && index > itemStatStart && itemStatEnd == itemArray.length - 1) { // 判斷隨機詞墜結束點
          itemStatEnd = index
        }
        if (itemArray.indexOf('未鑑定') > -1) {
          itemStatEnd = itemStatStart + 1
        }
      });
      for (let index = itemStatStart; index < itemStatEnd; index++) {
        if (itemArray[index] !== "--------") {
          let text = itemArray[index]
          itemExplicitStats.push(itemArray[index])

          if (itemArray[index].indexOf('(implicit)') > -1) { // 固定屬性
            text = text.substring(0, text.indexOf('(implicit)')) // 刪除(implicit)字串
            tempStat.push(stringSimilarity.findBestMatch(text, this.implicitStats))
            tempStat[tempStat.length - 1].type = "固定"
          } else if (itemArray[index].indexOf('(crafted)') > -1) { // 已工藝屬性
            text = text.substring(0, text.indexOf('(crafted)'))
            tempStat.push(stringSimilarity.findBestMatch(text, this.craftedStats))
            tempStat[tempStat.length - 1].type = "工藝"
          } else if (itemArray[index].indexOf('(enchant)') > -1) {
            // TODO: 項鍊塗油的配置屬性為附魔，要再額外判斷
            text = text.substring(0, text.indexOf('(enchant)'))
            tempStat.push(stringSimilarity.findBestMatch(text, this.enchantStats))
            tempStat[tempStat.length - 1].type = "附魔"
          } else if (rarityFlag) { // 傳奇裝詞綴
            tempStat.push(stringSimilarity.findBestMatch(itemArray[index], this.explicitStats))
            tempStat[tempStat.length - 1].type = "傳奇"
          } else { // 隨機屬性
            tempStat.push(stringSimilarity.findBestMatch(itemArray[index], this.explicitStats))
            tempStat[tempStat.length - 1].type = "隨機"
          }
        }
      }
      // console.log(itemExplicitStats)
      // console.log(tempStat)
      tempStat.forEach((element, index) => { // 比對詞綴，抓出隨機數值與詞綴搜尋 ID
        let statID = element.ratings[element.bestMatchIndex + 1].target // 詞綴ID
        let statText = element.bestMatch.target // 詞綴字串
        // TODO: 詞綴判斷以偽屬性為優先
        let itemStatArray = itemExplicitStats[index].split(' ') // 將物品上的詞綴拆解
        let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
        // console.log(itemExplicitStats[index])
        // console.log(matchStatArray)
        let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
        let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
        let optionValue = 0 // 星團珠寶附魔 / 項鍊塗油配置 的 ID

        if (statID === "enchant.stat_3948993189") {
          let obj = stringSimilarity.findBestMatch(itemExplicitStats[index], this.clusterJewelStats)
          // console.log(obj)
          // console.log(element.bestMatch.target, obj.ratings[obj.bestMatchIndex].target)
          optionValue = parseInt(obj.ratings[obj.bestMatchIndex + 1].target, 10)
          statText = `附加的小型天賦給予：\n${obj.ratings[obj.bestMatchIndex].target}`
        } else {
          for (let index = 0; index < itemStatArray.length; index++) { // 比較由空格拆掉後的詞綴陣列元素
            if (randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最大值
              randomMaxValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
              randomMaxValue = isNaN(randomMaxValue) ? '' : randomMaxValue
            }
            if (!randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最小值
              randomMinValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
              randomMinValue = isNaN(randomMinValue) ? '' : randomMinValue
              if (matchStatArray[index]) {
                if (matchStatArray[index].indexOf('，#') > -1) { // 處理隨機數值在'，'後的詞綴(無法用空格符號 split)
                  let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('，') + 1)
                  randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
                } else if (matchStatArray[index].indexOf('：#') > -1) { // 處理隨機數值在'：'後的詞綴(無法用空格符號 split)
                  let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('：') + 1)
                  randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
                }
              }
            }
          }
        }
        this.searchStats.push({
          "id": statID,
          "text": statText,
          "option": optionValue,
          "min": randomMinValue,
          "max": randomMaxValue,
          "isValue": randomMinValue ? true : false,
          "isSearch": false,
          "type": element.type
        })
      })
    },
    isRaritySearch() {
      if (!this.raritySet.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.type_filters.filters.rarity // 刪除稀有度 filter
      } else if (this.raritySet.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.type_filters.filters.rarity = { // 增加稀有度 filter
          "option": this.raritySet.chosenObj.prop
        }
        if (this.isMap && this.raritySet.chosenObj.label === '傳奇') {
          this.mapCategory = {
            isShaper: false,
            isElder: false,
            isBlighted: false
          }
        }
      }
    },
    itemAnalysis(item, itemArray, matchItem) {
      const NL = this.newLine
      this.itemCategory.option.length = 0
      this.itemExBasic.chosenObj = {
        label: "任何",
        prop: ''
      }
      this.raritySet.chosenObj = {
        label: "非傳奇",
        prop: 'nonunique'
      }
      this.raritySet.isSearch = true
      this.isRaritySearch()
      // 判斷物品基底
      this.itemBasic.text = matchItem.text
      // 判斷物品等級
      if (item.indexOf('物品等級: ') > -1) {
        let levelPos = item.substring(item.indexOf('物品等級: ') + 5)
        let levelPosEnd = levelPos.indexOf(NL)
        this.itemLevel.min = parseInt(levelPos.substring(0, levelPosEnd).trim(), 10)
      }
      // 判斷物品分類
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
      this.isItemCategorySearch()
      // 判斷勢力基底
      this.itemExBasic.isSearch = true
      switch (true) {
        case itemArray.indexOf('塑者之物') > -1:
          this.itemExBasic.chosenObj = {
            label: "塑者之物",
            prop: "shaper_item"
          }
          break;
        case itemArray.indexOf('尊師之物') > -1:
          this.itemExBasic.chosenObj = {
            label: "尊師之物",
            prop: "elder_item"
          }
          break;
        case itemArray.indexOf('聖戰軍王物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "聖戰君王物品",
            prop: "crusader_item"
          }
          break;
        case itemArray.indexOf('救贖者物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "救贖者物品",
            prop: "redeemer_item"
          }
          break;
        case itemArray.indexOf('總督軍物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "總督軍物品",
            prop: "warlord_item"
          }
          break;
        case itemArray.indexOf('狩獵者物品') > -1:
          this.itemExBasic.chosenObj = {
            label: "狩獵者物品",
            prop: "hunter_item"
          }
          break;
        default:
          this.itemExBasic.isSearch = false
          break;
      }
      this.isExBasicSearch()
    },
    isItemLevelSearch() {
      if (!this.itemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters.ilvl // 刪除物品等級 filter
      } else if (this.itemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters.ilvl = { // 增加物品等級最小值 filter
          "min": this.itemLevel.min,
          "max": this.itemLevel.max ? this.itemLevel.max : ''
        }
      }
    },
    isItemBasicSearch() {
      if (!this.itemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.type // 刪除物品基底 filter
      } else if (this.itemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.type = this.itemBasic.text // 增加物品基底 filter
      }
    },
    isItemCategorySearch() {
      if (!this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.type_filters.filters.category // 刪除物品種類 filter
      } else if (this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && !_.isEmpty(this.searchJson)) {
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
      // this.itemCategory.chosenObj = value
    },
    isCorruptedSearch() {
      if (!this.isCorrupted && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters.corrupted // 刪除已污染 filter
      } else if (this.isCorrupted && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters.corrupted = { // 增加已污染 filter
          "option": "true"
        }
      }
    },
    isExBasicSearch() {
      if (!this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] // 刪除勢力選項
      } else if (this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
    },
    exBasicChange(value) {
      let exSearchItem = !this.itemExBasic.chosenObj.prop ? '' : this.itemExBasic.chosenObj.prop // 前一個搜尋的勢力選項
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
    mapAnalysis(item, itemArray, Rarity) {
      const NL = this.newLine
      let searchName = ''
      this.isMap = true
      this.isMapCollapse = true
      this.mapCategory = {
        isShaper: false,
        isElder: false,
        isBlighted: false
      }
      this.raritySet.chosenObj = {
        label: "非傳奇",
        prop: 'nonunique'
      }
      this.raritySet.isSearch = true
      this.isRaritySearch()
      let mapPos = item.substring(item.indexOf('地圖階級:') + 5) // 地圖階級截斷字串
      let mapPosEnd = mapPos.indexOf(NL) // 地圖階級換行定位點
      let mapTier = parseInt(mapPos.substring(0, mapPosEnd).trim(), 10)
      this.mapLevel.min = mapTier
      this.mapLevel.max = mapTier
      this.mapLevel.isSearch = true
      this.isMapLevelSearch()
      this.mapBasic.option.forEach(element => {
        if (item.indexOf(element) > -1) {
          this.mapBasic.chosenM = element
        }
      });
      this.mapBasic.isSearch = true
      this.isMapBasicSearch()
      // this.searchJson.query.type = { // TODO? 支援過往地圖類別
      //   "discriminator": "warfortheatlas"
      // }
      this.searchJson.query.filters.map_filters.filters.map_blighted = { // 過濾凋落圖
        "option": "false"
      }
      if (Rarity === "傳奇") { //傳奇地圖
        this.raritySet.chosenObj = {
          label: "傳奇",
          prop: 'unique'
        }
        this.raritySet.isSearch = true
        this.isRaritySearch()
      } else if (item.indexOf('區域被塑界者控制 (implicit)') > -1) { // 塑界者地圖
        this.mapCategory.isShaper = true
        this.searchJson.query.stats[0].filters[0] = {
          "id": "implicit.stat_1792283443",
          "value": {
            "option": "1"
          }
        }
      } else if (item.indexOf('區域被異界尊師控制 (implicit)') > -1) { // 尊師地圖
        this.mapCategory.isElder = true
        this.searchJson.query.stats[0].filters[0] = {
          "id": "implicit.stat_1792283443",
          "value": {
            "option": "2"
          }
        }
        if (item.indexOf('地圖被異界．奴役佔據 (implicit)') > -1) { // 尊師守衛地圖
          this.mapElderGuard.chosenObj = {
            label: "異界．奴役",
            prop: "1"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地圖被異界．根除佔據 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "異界．根除",
            prop: "2"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地圖被異界．干擾佔據 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "異界．干擾",
            prop: "3"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        } else if (item.indexOf('地圖被異界．淨化佔據 (implicit)') > -1) {
          this.mapElderGuard.chosenObj = {
            label: "異界．淨化",
            prop: "4"
          }
          this.mapElderGuard.isSearch = true
          this.isMapElderGuardSearch()
        }
      } else if (item.indexOf('凋落的') > -1) {
        this.mapCategory.isBlighted = true
        this.searchJson.query.filters.map_filters.filters.map_blighted = {
          "option": "true"
        }
      } else { // error handle
        this.status = `Oops! 尚未支援搜尋此種地圖`
      }
      this.searchTrade(this.searchJson)
    },
    isMapBasicSearch() {
      if (!this.mapBasic.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.type // 刪除地圖基底 filter
      } else if (this.mapBasic.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.type = this.mapBasic.chosenM // 增加地圖基底 filter
      }
    },
    isMapLevelSearch() {
      if (!this.mapLevel.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.map_filters.filters.map_tier // 刪除地圖階級 filter
      } else if (this.mapLevel.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.map_filters.filters.map_tier = { // 指定地圖階級最小 / 最大值 filter
          "min": this.mapLevel.min,
          "max": this.mapLevel.max
        }
      }
    },
    isMapElderGuardSearch() {
      if (this.mapCategory.isElder && !this.mapElderGuard.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.stats[0].filters.length = 1
      } else if (this.mapElderGuard.isSearch && this.mapElderGuard.chosenObj.prop && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.stats[0].filters[1] = {
          "id": "implicit.stat_3624393862",
          "value": {
            "option": this.mapElderGuard.chosenObj.prop
          }
        }
      }
    },
    isGemBasicSearch() {
      if (!this.gemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.type // 刪除技能基底 filter
      } else if (this.gemBasic.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.type = this.gemBasic.chosenG // 增加技能基底 filter
      }
    },
    isGemLevelSearch() {
      if (!this.gemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters.gem_level // 刪除技能等級 filter
      } else if (this.gemLevel.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters.gem_level = { // 指定技能等級最小 / 最大值 filter
          "min": this.gemLevel.min,
          "max": this.gemLevel.max
        }
      }
    },
    isGemQualitySearch() {
      if (!this.gemQuality.isSearch && !_.isEmpty(this.searchJson)) {
        delete this.searchJson.query.filters.misc_filters.filters.quality // 刪除技能品質 filter
      } else if (this.gemQuality.isSearch && !_.isEmpty(this.searchJson)) {
        this.searchJson.query.filters.misc_filters.filters.quality = { // 指定技能品質最小 / 最大值 filter
          "min": this.gemQuality.min,
          "max": this.gemQuality.max
        }
      }
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
      if (item.indexOf('稀有度:') === -1 || !this.copyText) { // POE 內的文字必定有稀有度
        return
      }
      if (this.isLoading) {
        this.$bvToast.toast(`搜尋太快了! 請放慢一點腳步`, {
          noCloseButton: true,
          toaster: 'toast-center-center',
          variant: 'danger',
          autoHideDelay: 500,
          appendToast: false
        })
        clipboard.writeText('')
        return
      }
      this.fetchID.length = 0
      this.isMap = false
      this.isItem = false
      this.isGem = false
      this.raritySet.isSearch = false
      this.itemLevel.isSearch = false
      this.itemBasic.isSearch = false
      this.gemLevel.isSearch = false
      this.isCorrupted = false
      this.fetchQueryID = ''
      this.status = ''
      this.searchStats = []
      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件
      const NL = this.newLine
      let itemArray = item.split(NL); // 以行數拆解複製物品文字
      let posRarity = item.indexOf(': ')
      let Rarity = itemArray[0].substring(posRarity + 2).trim()
      let searchName = itemArray[1]
      this.searchName = itemArray[2] === "--------" ? `物品名稱『${itemArray[1]}』` : `物品名稱『${itemArray[1]} ${itemArray[2]}』`
      let itemBasic = itemArray[2]
      let itemAnaCount = 0

      this.equipItems.forEach(element => {
        if (`${itemArray[1]} ${itemArray[2]}`.indexOf(element.text) > -1 && !itemAnaCount) {
          itemAnaCount++
          this.itemAnalysis(item, itemArray, element)
          this.isItem = true
          this.isItemCollapse = true
        }
      });

      if (Rarity === "傳奇" && item.indexOf('地圖階級') === -1 && item.indexOf('在塔恩的鍊金室') === -1) { // 傳奇道具
        if (item.indexOf('未鑑定') === -1) { // 已鑑定傳奇
          this.searchJson.query.name = searchName
          this.raritySet.chosenObj = {
            label: "傳奇",
            prop: 'unique'
          }
          this.raritySet.isSearch = true
          this.isRaritySearch()
          if (this.isItem) {
            this.itemStatsAnalysis(itemArray, 1)
          }
          // let tempStat = []
          // if (searchName === "看守之眼") { // 尊師三相珠寶 
          //   tempStat.push(stringSimilarity.findBestMatch(itemArray[11], this.explicitStats))
          //   tempStat.push(stringSimilarity.findBestMatch(itemArray[12], this.explicitStats))
          //   if (itemArray[13] !== "--------") {
          //     tempStat.push(stringSimilarity.findBestMatch(itemArray[13], this.explicitStats))
          //   }
          //   tempStat.forEach((element, index) => { // 比對詞綴
          //     let itemStatArray = itemArray[index + 11].split(' ') // 將物品上的詞綴拆解
          //     let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
          //     let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
          //     let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
          //     for (let index = 0; index < itemStatArray.length; index++) { // 比較由空格拆掉後的詞綴陣列元素
          //       if (randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最大值
          //         randomMaxValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
          //         randomMaxValue = isNaN(randomMaxValue) ? '' : randomMaxValue
          //       }
          //       if (!randomMinValue && itemStatArray[index] !== matchStatArray[index]) { // 最小值
          //         randomMinValue = parseFloat(itemStatArray[index].replace(/[+-]^\D+/g, ''))
          //         randomMinValue = isNaN(randomMinValue) ? '' : randomMinValue
          //         if (matchStatArray[index].indexOf('，#') > -1) { // 處理隨機數值在'，'後的詞綴(無法用空格符號 split)
          //           let tempStat = itemStatArray[index].substring(itemStatArray[index].indexOf('，') + 1)
          //           randomMinValue = parseFloat(tempStat.replace(/[+-]^\D+/g, ''))
          //         }
          //       }
          //     }
          //     this.searchStats.push({
          //       "id": element.ratings[element.bestMatchIndex + 1].target,
          //       "text": element.bestMatch.target,
          //       "min": randomMinValue,
          //       "max": randomMaxValue,
          //       "isValue": randomMinValue ? true : false,
          //       "type": "傳奇",
          //       "isSearch": true,
          //     })
          //   })
          //   return // 選擇詞墜後再搜尋
          // } else if (searchName === "奧爾的崛起") {
          //   tempStat.push(stringSimilarity.findBestMatch(itemArray[15], this.explicitStats))
          //   tempStat.forEach((element, index) => { // 比對詞綴
          //     if (element.bestMatch.rating) { // bestMatch > 0 (有抓到詞綴)
          //       let itemStatArray = itemArray[index + 11].split(' ') // 將物品上的詞綴拆解
          //       let matchStatArray = element.bestMatch.target.split(' ') // 將詞綴資料庫上的詞綴拆解
          //       this.searchStats.push({
          //         "id": element.ratings[element.bestMatchIndex + 1].target,
          //         "text": element.bestMatch.target,
          //         "min": '',
          //         "max": '',
          //         "isValue": false,
          //         "type": "傳奇",
          //         "isSearch": true,
          //       })
          //       // console.log(`物品上第${index+1}詞詞綴: ${itemArray[index+11]}\n第${index+1}詞ID: ${element.ratings[element.bestMatchIndex+1].target}\n第一詞詞綴: ${element.bestMatch.target}\n吻合率: ${element.bestMatch.rating}`)
          //     }
          //   })
          //   return // 選擇詞墜後再搜尋
          // }
        } else { // 未鑑定傳奇(但會搜到相同基底)
          if (searchName.indexOf('精良的') > -1) { // 未鑑定的品質傳奇物品
            searchName = searchName.substring(4)
          }
          this.raritySet.chosenObj = {
            label: "傳奇",
            prop: 'unique'
          }
          this.raritySet.isSearch = true
          this.isRaritySearch()
          this.searchJson.query.type = searchName
        }
      } else if (Rarity === "命運卡" || Rarity === "通貨") {
        this.searchJson.query.type = searchName
      } else if (Rarity === "寶石") {
        this.isGem = true
        this.gemBasic.chosenG = searchName

        let levelPos = item.substring(item.indexOf('等級: ') + 4)
        let levelPosEnd = levelPos.indexOf(NL)
        this.gemLevel.min = parseInt(levelPos.substring(0, levelPosEnd).replace(/[+-]^\D+/g, ''), 10)

        let minQuality = 0
        if (item.indexOf('品質: +') > -1) {
          let quaPos = item.substring(item.indexOf('品質: +') + 5) // 品質截斷字串 (包含'品質: +'前的字串全截斷)
          let quaPosEnd = quaPos.indexOf('% (augmented)') // 品質定位點
          minQuality = parseInt(quaPos.substring(0, quaPosEnd).trim(), 10)
        }
        this.gemQuality.min = minQuality
        if (item.indexOf('瓦爾．') > -1) { // 瓦爾技能
          let vaalPos = item.substring(item.indexOf('瓦爾．'))
          let vaalPosEnd = vaalPos.indexOf(NL)
          let vaalGem = vaalPos.substring(0, vaalPosEnd)
          this.searchName = `物品名稱『${vaalGem}』`
          this.gemBasic.chosenG = vaalGem
        }
        this.gemBasic.isSearch = true
        this.isGemBasicSearch()
        this.gemQuality.isSearch = true
        this.isGemQualitySearch()
      } else if (Rarity === "普通" && (item.indexOf('透過聖殿實驗室或個人') > -1 || item.indexOf('可以使用於個人的地圖裝置來增加地圖的詞綴') > -1 || item.indexOf('放置兩個以上不同的徽印在地圖裝置中') > -1 || item.indexOf('前往試練者廣場使用此物品進入帝王迷宮') > -1 || item.indexOf('擊殺指定數量的怪物後會掉落培育之物') > -1)) {
        // 地圖碎片、裂痕石、徽印、聖甲蟲、眾神聖器、女神祭品、培育器
        this.searchJson.query.type = searchName
      } else if (Rarity === "普通" && (item.indexOf('點擊右鍵將此預言附加於你的角色之上。') > -1)) { // 預言
        this.searchJson.query.name = searchName
      } else if (item.indexOf('地圖階級') > -1) { // 地圖搜尋
        this.mapAnalysis(item, itemArray, Rarity)
      } else if (this.isItem && (Rarity === "稀有" || Rarity === "魔法" || Rarity === "普通")) {
        this.itemStatsAnalysis(itemArray, 0)
        return
      } else {
        this.status = this.isItem ? '' : `目前版本尚未支援搜尋鍊魔器官及非傳奇藥劑`
        return
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
      this.searchTrade(this.searchJson)
    },
    isOnline: function () {
      let option = this.isOnline ? 'online' : 'any'
      this.searchJson_Def.query.status.option = option
      if (!_.isEmpty(this.searchJson) && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.status.option = option
        this.searchTrade(this.searchJson)
      }
    },
    isPriced: function () {
      this.fetchID.length = 0
      let option = this.isPriced ? 'priced' : 'unpriced'
      this.searchJson_Def.query.filters.trade_filters.filters.sale_type.option = option
      if (!_.isEmpty(this.searchJson) && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.filters.trade_filters.filters.sale_type.option = option
        this.searchTrade(this.searchJson)
      }
    },
    'leagues.chosenL': {
      handler(newVal) {
        if (_.isEmpty(this.searchJson)) {
          return
        }
        this.searchTrade(this.searchJson)
      },
      deep: true
    },
    'mapCategory.isShaper': { // TODO: 判斷塑者/尊師/凋落圖方式需重構
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
          this.mapCategory.isElder = false
          this.mapCategory.isBlighted = false
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "1", // 塑界者
            }
          }
        } else if (!newVal && !this.mapCategory.isElder && !this.mapCategory.isBlighted) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        }
      },
      deep: true
    },
    'mapCategory.isElder': {
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
          this.mapCategory.isShaper = false
          this.mapCategory.isBlighted = false
          this.searchJson.query.stats[0].filters[0] = {
            "id": "implicit.stat_1792283443",
            "value": {
              "option": "2", // 尊師
            }
          }
        } else if (!newVal && !this.mapCategory.isShaper && !this.mapCategory.isBlighted) {
          this.mapElderGuard.isSearch = false
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        } else if (!newVal) {
          this.mapElderGuard.isSearch = false
        }
      },
      deep: true
    },
    'mapCategory.isBlighted': {
      handler(newVal) {
        if (newVal) {
          this.searchJson.query.stats[0].filters.length = 0
          this.mapCategory.isShaper = false
          this.mapCategory.isElder = false
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "true"
          }
        } else if (!newVal && !this.mapCategory.isShaper && !this.mapCategory.isElder) {
          this.searchJson.query.stats[0].filters.length = 0
          this.searchJson.query.filters.map_filters.filters.map_blighted = {
            "option": "false"
          }
        }
      },
      deep: true
    },
  },
  computed: {
    isSearchJson() {
      return !_.isEmpty(this.searchJson)
    },
    pricedText() {
      return this.isPriced ? "有標價" : "未標價"
    },
    corruptedText() {
      return this.isCorrupted ? "已污染" : "未污染"
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
  padding-left: 0px !important;
  padding-right: 5px !important;
}

tbody.searchStats>tr>td {
  padding-top: 8px;
}

.toast-center-center {
  position: absolute;
  top: 40%;
  left: 38%;
  /* -ms-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%); */
}

.vs__dropdown-option--highlight {
  background: rgb(208, 236, 252) !important;
  color: #333 !important;
}

.vs__dropdown-option--selected {
  background: lightskyblue !important;
  color: #333 !important;
}
</style>
