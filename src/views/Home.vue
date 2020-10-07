<template>
<div class="home">
  <go-top :size="30" :bottom="50" :max-width="575" bg-color="#04a9f3" :boundary="50"></go-top>
  <hr>
  <b-alert v-if="isApiError" show variant="danger" style="margin-top: 5px;">
    <div>Oops! API 串接時似乎發生了一點錯誤...</div>
    <h4 style="padding-top: 6px;">{{ apiErrorStr }}</h4>
    <hr>
    <div>若跳出提示 Code 503，表示台服或國際服官方應在關機維護中，請稍後再試</div>
    <div>國際服玩家 -> 台服及國際服官方皆正常才可使用</div>
    <div>台服玩家 -> 台服官方正常即可使用</div>
    <hr>
    <countdown ref="countdown" :time="countTime" @end="handleCountdownEnd" :interval="100">
      <template slot-scope="props">
        <b-button v-if="isCounting" @click="getAllAPI" :disabled="isCounting" size="sm" variant="outline-danger">請等待 {{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }} 秒後重試</b-button>
        <div v-else>
          <b-button @click="getAllAPI(true)" :disabled="isCounting" size="sm" variant="outline-danger">國際服玩家點我重試一次</b-button> /
          <b-button @click="getAllAPI(false)" :disabled="isCounting" size="sm" variant="outline-danger">台服玩家點我重試一次</b-button>
        </div>
      </template>
    </countdown>
  </b-alert>
  <div v-else>
    <b-container class="bv-example-row">
      <b-row class="lesspadding">
        <b-col align-self="center" style="padding-left: 6px !important;">
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
        <b-col align-self="center">
          <b-button v-b-toggle.collapse-2 size="sm" variant="outline-primary">附加功能</b-button>
        </b-col>
        <b-col v-if="isDevMode" align-self="center">
          <b-button @click="checkAPI" size="sm" variant="outline-primary">API 測試</b-button>
        </b-col>
      </b-row>
      <b-collapse id="collapse-2" class="mt-2">
        <b-card>
          <b-row class="lesspadding" style="padding-left: 2px;">
            <b-col sm="4">
              <b-form-checkbox style="padding-top: 7px;" class="float-right" v-model="isMapAreaCollapse" switch :inline="false">
                <b>輿圖區域名稱複製</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="1"></b-col>
            <b-col sm="7" class="my-1">
              <b-form-group label="" label-cols-sm="0" label-align-sm="right" label-size="sm" class="mb-0">
                <b-input-group size="sm">
                  <b-form-input v-model="wantedAddedText" type="search" id="filterInput" placeholder="請輸入欲在複製字串後增加的文字"></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!wantedAddedText" @click="addAfterCopyText">增加</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-collapse :visible="isMapAreaCollapse" class="lesspadding">
            <b-row style="padding-top: 10px;">
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
                <b-button @click="mapAreaCopy('瓦爾多憩地')" size="sm" @click.right="clickCount++" variant="outline-primary">瓦爾多憩地 (右下內)</b-button>
              </b-col>
              <b-col sm="2"></b-col>
            </b-row>
            <b-row style="padding-top: 8px;">
              <b-col sm="4">
                <b-button @click="mapAreaCopy('新瓦斯提里')" size="sm" variant="outline-primary" @click.shift.middle="clickCount > 5 && isGem ? clickOpen() : ''">新瓦斯提里 (左下外)</b-button>
              </b-col>
              <b-col sm="4"></b-col>
              <b-col sm="4">
                <b-button @click="mapAreaCopy('里拉．奧斯汀')" size="sm" variant="outline-primary">里拉．奧斯汀 (右下外)</b-button>
              </b-col>
            </b-row>
          </b-collapse>
        </b-card>
      </b-collapse>
      <b-collapse visible id="collapse-1" class="mt-2">
        <b-card>
          <b-row>
            <b-col sm="5" class="lesspadding">
              <v-select :options="leagues.option" v-model="leagues.chosenL" :clearable="false" :filterable="false"></v-select>
            </b-col>
            <b-col sm="7" class="my-1" v-if="handlePOESESSID">
              <b-input-group size="sm">
                <b-form-input v-model="handlePOESESSID" disabled type="search" placeholder="POESESSID"></b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px; padding-left: 2px;">
            <b-col sm="3">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="isOnline" :disabled="isCounting" switch :inline="false">
                <b>只顯示線上</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="isPriced" :disabled="isCounting" switch>
                <b>{{ pricedText }}</b>
              </b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox class="float-right" style="padding-top: 5px;" v-model="corruptedSet.isSearch" :disabled="true" switch>已汙染</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <v-select :options="corruptedSet.option" v-model="corruptedSet.chosenObj" @input="corruptedInput" :disabled="!isSearchJson || isCounting" label="label" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
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
              <b-form-input v-model.number="itemLevel.min" @dblclick="itemLevel.min = ''" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLevel.max" @dblclick="itemLevel.max = ''" @input="isItemLevelSearch" :disabled="!itemLevel.isSearch" :style="itemLevel.max && (itemLevel.max < itemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox style="padding-right: 19px !important;" class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemLinked.isSearch" @input="isLinkedSearch" switch>物品連線</b-form-checkbox>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLinked.min" @dblclick="itemLinked.min = ''" @input="isLinkedSearch" :disabled="!itemLinked.isSearch" :style="itemLinked.min > 6 ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="itemLinked.max" @dblclick="itemLinked.max = ''" @input="isLinkedSearch" :disabled="!itemLinked.isSearch" :style="(itemLinked.max && (itemLinked.max < itemLinked.min)) || itemLinked.max > 6 ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemCategory.isSearch" @input="isItemCategorySearch" switch>物品分類</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="itemCategory.option" v-model="itemCategory.chosenObj" label="label" @input="categoryChange" :disabled="!itemCategory.isSearch" :clearable="false" :filterable="false" placeholder="任何"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemBasic.isSearch" @input="isItemBasicSearch" switch>物品基底</b-form-checkbox>
            </b-col>
            <b-col sm="3" style="padding-top: 3px;">
              <b-form-input style="width: 100px;" v-model="itemBasic.text" :disabled="true" size="sm"></b-form-input>
            </b-col>
            <b-col sm="2" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="itemExBasic.isSearch" @input="isExBasicSearch" switch>勢力基底</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select class="exBasicIcon" :options="itemExBasic.option" :value="itemExBasic.chosenObj" label="label" @input="exBasicChange" :disabled="!itemExBasic.isSearch" :clearable="false" :filterable="false" placeholder="任何">
                <template v-slot:option="itemExBasic">
                  <b-img :src="itemExBasic.url"></b-img>
                  {{ itemExBasic.label }}
                </template>
              </v-select>
            </b-col>
          </b-row>
          <b-collapse :visible="!isStatsCollapse || searchStats.length == 0">
            <b-row>
              <b-col sm="10"></b-col>
              <b-col sm="2" style="padding-top: 15px;">
                <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查詢</b-button>
              </b-col>
            </b-row>
          </b-collapse>
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
              <b-form-input v-model.number="mapLevel.min" @dblclick="mapLevel.min= ''" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1" style="padding-top: 3px;">
              <b-form-input v-model.number="mapLevel.max" @dblclick="mapLevel.max= ''" @input="isMapLevelSearch" :disabled="!mapLevel.isSearch" :style="mapLevel.max && (mapLevel.max < mapLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="2"></b-col>
            <b-col sm="2" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="raritySet.isSearch" @input="isRaritySearch" switch>稀有度</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <v-select :options="raritySet.option" v-model="raritySet.chosenObj" @input="isRaritySearch" label="label" :disabled="!raritySet.isSearch" :clearable="false" :filterable="false"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 5px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="mapBasic.isSearch" @input="isMapBasicSearch" switch>地圖基底</b-form-checkbox>
            </b-col>
            <b-col :sm="isGarenaSvr ? 4 : 9">
              <!-- <b-form-input v-model="mapBasic.chosenM" :disabled="true"></b-form-input> -->
              <v-select :options="mapBasic.option" v-model="mapBasic.chosenM" @input="isMapBasicSearch" label="label" :disabled="!mapBasic.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-collapse :visible="raritySet.chosenObj.label !== '傳奇'">
            <b-row style="padding-top: 10px;">
              <b-col sm="4">
                <b-form-checkbox style="padding-left: 8px !important" v-model="mapCategory.isShaper" switch :inline="false">塑者領域</b-form-checkbox>
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
            <b-row style="padding-top: 8px;">
              <b-col sm="4"></b-col>
              <b-col sm="3" style="padding-left: 28px; padding-top: 5px;">
                <b-form-checkbox v-model="mapElderGuard.isSearch" @input="isMapElderGuardSearch" switch :inline="false">守衛</b-form-checkbox>
              </b-col>
              <b-col sm="5" class="lesspadding">
                <v-select :options="mapElderGuard.option" v-model="mapElderGuard.chosenObj" @input="isMapElderGuardSearch" label="label" :disabled="!mapElderGuard.isSearch" :clearable="false" :filterable="false">
                  <template v-slot:option="mapElderGuard">
                    <b-img style="max-width: 25px;" :src="mapElderGuard.url"></b-img>
                    {{ mapElderGuard.label }}
                  </template>
                </v-select>
              </b-col>
            </b-row>
          </b-collapse>
          <b-row>
            <b-col sm="10"></b-col>
            <b-col sm="2" style="padding-top: 15px;">
              <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查詢</b-button>
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
              <b-form-input v-model.number="gemLevel.min" @dblclick="gemLevel.min= ''" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemLevel.max" @dblclick="gemLevel.max= ''" @input="isGemLevelSearch" :disabled="!gemLevel.isSearch" :style="gemLevel.max && (gemLevel.max < gemLevel.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="3" style="padding-top: 3px;">
              <b-form-checkbox class="float-right" v-model="gemQuality.isSearch" @input="isGemQualitySearch" switch>技能品質</b-form-checkbox>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemQuality.min" @dblclick="gemQuality.min= ''" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" size="sm" type="number"></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-form-input v-model.number="gemQuality.max" @dblclick="gemQuality.max= ''" @input="isGemQualitySearch" :disabled="!gemQuality.isSearch" :style="gemQuality.max && (gemQuality.max < gemQuality.min) ? 'color: #fc3232; font-weight:bold;' : ''" size="sm" type="number"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 10px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="gemQualitySet.isSearch" @input="gemQualityTypeInput" switch>替代品質</b-form-checkbox>
            </b-col>
            <b-col sm="4">
              <v-select :options="gemQualitySet.option" v-model="gemQualitySet.chosenObj" @input="gemQualityTypeInput" label="label" :disabled="!gemQualitySet.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-row class="lesspadding" style="padding-top: 10px;">
            <b-col sm="3" style="padding-top: 6px;">
              <b-form-checkbox class="float-right" v-model="gemBasic.isSearch" @input="isGemBasicSearch" switch>技能基底</b-form-checkbox>
            </b-col>
            <b-col :sm="isGarenaSvr ? 6 : 9">
              <v-select :options="gemBasic.option" v-model="gemBasic.chosenG" @input="isGemBasicSearch" label="label" :disabled="!gemBasic.isSearch" :clearable="false" :filterable="true"></v-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10"></b-col>
            <b-col sm="2" style="padding-top: 5px;">
              <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查詢</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-container>
    <b-alert v-if="isCounting && !isApiError" show variant="warning" style="margin-top: 5px;">
      <countdown ref="countdown" :time="countTime" @end="handleCountdownEnd" :interval="100">
        <template slot-scope="props">因 API 發送次數限制，請再等待：{{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }} 秒</template>
      </countdown>
    </b-alert>
    <hr v-else>
    <h5 :style="isItem && searchStats.length > 0 ? 'cursor: pointer; user-select:none;' : ''" @click="isStatsCollapse = !isStatsCollapse" v-html="searchName"></h5>
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
            <tr v-for="(item, index) in searchStats" :key="index" style="padding-top: 5px;" :style="item.isSearch ? 'font-weight:bold;' : 'color: #AAACAD'">
              <td style="width: 45px;">
                <b-form-checkbox v-model="item.isSearch"></b-form-checkbox>
              </td>
              <td style="width: 45px; cursor: pointer; user-select:none;" :style="statsFontColor(item.type)" @click="item.isSearch = !item.isSearch">{{ item.type }} </td>
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
            <b-button @click="clickToSearch" :disabled="isCounting" variant="outline-primary">查詢</b-button>
          </b-col>
        </b-row>
      </b-collapse>
    </b-container>
    <h6 v-html="status"></h6>
  </div>
  <div>
    <b-button v-if="fetchQueryID" @click="popOfficialWebsite" :disabled="isCounting" size="sm" variant="outline-primary">{{ whichServer }} 官方交易市集</b-button>
    <PriceAnalysis @countdown="startCountdown" @refresh="searchTrade(searchJson)" :isCounting="isCounting" :fetchID="fetchID" :fetchQueryID="fetchQueryID" :isPriced="isPriced" :baseUrl="baseUrl" :searchTotal="searchTotal"></PriceAnalysis>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import PriceAnalysis from '@/components/PriceAnalysis.vue'
import hotkeys from "hotkeys-js";
import GoTop from '@inotom/vue-go-top';

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
    PriceAnalysis,
    GoTop
  },
  data() {
    return {
      clickCount: 0,
      searchTotal: 0,
      status: '',
      copyText: '',
      wantedAddedText: '',
      testResponse: '',
      countTime: 0,
      baseUrl: 'https://web.poe.garena.tw',
      isGarenaSvr: true,
      isApiError: false,
      apiErrorStr: '',
      isCounting: false,
      isOnline: true,
      isPriced: true,
      isItem: false,
      isMap: false,
      isGem: false,
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
      allocatesStats: [], // 項鍊塗油配置附魔詞綴
      wrapStats: [],
      craftedStats: [], // 已工藝
      fetchID: [], // 預計要搜尋物品細項的 ID, 10 個 ID 為一陣列
      searchName: '',
      fetchQueryID: '',
      allItems: [], // 物品 API 抓回來的資料
      equipItems: [], // 可裝備的物品資料
      leagues: { // 搜尋聯盟 
        option: [],
        chosenL: ""
      },
      gggLeagues: [], // 暫存 ggg 聯盟字串
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
      corruptedSet: { // 汙染設定
        option: [{
          label: "是",
          prop: 'true'
        }, {
          label: "否",
          prop: 'false'
        }, {
          label: "任何",
          prop: 'any'
        }],
        chosenObj: {
          label: "任何",
          prop: 'any'
        },
        isSearch: true,
      },
      gemQualitySet: { // 寶石替代品質設定
        option: [{
          label: "精良的（預設）",
          prop: '0'
        }, {
          label: "任何替代",
          prop: 'alternate'
        }, {
          label: "異常的",
          prop: '1'
        }, {
          label: "相異的",
          prop: '2'
        }, {
          label: "幻影的",
          prop: '3'
        }, ],
        chosenObj: {
          label: "精良的（預設）",
          prop: '0'
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
          prop: "1",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/Art/2DItems/Maps/AtlasMapGuardianFire.png?v=e5e1e33936ce8035aed76e3ca12b9b4f"
        }, {
          label: "異界．根除",
          prop: "2",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/Art/2DItems/Maps/AtlasMapGuardianLightning.png?v=90d792a619252cc02b8f974893811531"
        }, {
          label: "異界．干擾",
          prop: "3",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/Art/2DItems/Maps/AtlasMapGuardianHoly.png?v=ebb9b06c3456603cc78e88b797049dda"
        }, {
          label: "異界．淨化",
          prop: "4",
          url: "https://twwebcdnpoe-a.akamaihd.net/image/Art/2DItems/Maps/AtlasMapGuardianChaos.png?v=e131ac9d26855fcbd7eb44deee8a9ef1"
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
      gggMapBasic: [],
      itemLevel: { // 物品等級
        min: 0,
        max: '',
        isSearch: false,
      },
      itemLinked: { // 物品插槽連線
        min: '',
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
      gggGemBasic: [],
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
                "corrupted": { // 已汙染設定 corruptedInput
                  "option": "true"
                },
                "gem_level": { // 技能等級 isGemLevelSearch
                  "min": 10
                },
                "quality": { // 技能品質 isGemQualitySearch
                  "min": 10
                },
                "gem_alternate_quality": { // 寶石替代品質設定 gemQualityTypeInput
                  "option": "alternate", // any alternate
                  "option": "0", // superior(default) 精良的
                  "option": "1", // anomalous  異常的
                  "option": "2", // divergent  相異的
                  "option": "3", // phantasmal 幻影的
                },
              }
            },
            "type_filters": {
              "filters": {
                "category": { // 物品種類 isItemCategorySearch
                  "option": "accessory.ring", // 戒指
                  "option": "heistequipment" // 劫盜裝備
                }
              }
            },
            "socket_filters": { // 插槽連線設定
              "filters": {
                "links": {
                  "min": 5
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
      this.cleanClipboard()
    }
  },
  mounted() {
    // hotkeys('ctrl+c, command+c', () => this.hotkeyPressed())
    this.scanCopy();
    this.getAllAPI(true);
  },
  methods: {
    checkAPI() {
      this.equipItems.forEach(element => {
        console.log(element.text, element.name, element.option)
      });
    },
    replaceString(string) {
      const regMatchBrackets = /\((.+?)\)/g // 取出括號內文字
      string = regMatchBrackets.test(string) ? string.match(regMatchBrackets)[0] : string
      const regEnglish = /[\u4e00-\u9fa5]+|\(|\)|．|：/g // 全域搜尋中文字、括號及特定符號，ready for replace
      if (string.indexOf('追憶之') > -1) { // 追憶物品只取 itemBasic Name
        string = string.slice(4).trim()
      }
      return this.isGarenaSvr ? string : string.replace(regEnglish, '').trim()
    },
    resetSearchData() {
      this.searchName = ''
      this.fetchID.length = 0
      this.isMap = false
      this.isItem = false
      this.isGem = false
      this.raritySet.isSearch = false
      this.itemLevel.isSearch = false
      this.itemLevel.max = ''
      this.itemLinked.isSearch = false
      this.itemLinked.min = ''
      this.itemLinked.max = ''
      this.itemBasic.isSearch = false
      this.gemLevel.isSearch = false
      this.gemLevel.max = ''
      this.gemQuality.max = ''
      this.corruptedSet.chosenObj = {
        label: "任何",
        prop: 'any'
      }
      this.fetchQueryID = ''
      this.status = ''
      this.searchStats = []
    },
    hotkeyPressed() {
      this.searchTotal++
    },
    scanCopy() {
      setInterval(() => {
        this.copyText = clipboard.readText()
      }, 500);
    },
    cleanClipboard() {
      clipboard.writeText('')
    },
    cleanCopyText() {
      this.copyText = ''
    },
    clickOpen() {
      this.$prompt('請輸入 e-mail', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        inputPattern: /^[a-z0-9]{32}$|^$/,
        inputErrorMessage: 'e-mail 格式不正確'
      }).then(({
        value
      }) => {
        this.$store.commit('setPOESESSID', value);
        this.$message({
          type: 'success',
          message: `你的 mailID: ${value} 已儲存成功`
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消輸入'
        });
      });
    },
    apiTest: _.debounce(function () {
      let vm = this
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
      let vm = this
      if (this.searchJson.query.stats[0].filters.length === 0) {
        this.searchStats.forEach((element, index, array) => {
          let value = {}
          let min = element.min
          let max = element.max
          if (element.isNegative && _.isNumber(min)) {
            value.max = -min
          } else if (_.isNumber(min)) {
            value.min = min
          }
          if (element.isNegative && _.isNumber(max)) {
            value.min = -max
          } else if (_.isNumber(max)) {
            value.max = max
          }
          if (element.option) {
            value.option = element.option
          }
          this.searchJson.query.stats[0].filters.push({
            "id": element.id,
            "disabled": element.isSearch ? false : true,
            "value": value
          })
        })
      }
      this.fetchQueryID = ''
      this.axios.post(`http://localhost:3031/trade`, {
          searchJson: obj,
          baseUrl: this.baseUrl,
          league: this.leagues.chosenL,
          cookie: this.$store.state.POESESSID,
        })
        .then((response) => {
          this.searchTotal = parseInt(response.data.total, 10) // 總共搜到幾項物品
          response.data.total += response.data.total == "100000" ? `+` : ``
          this.status = `共 ${response.data.total} 筆符合`
          this.fetchID = response.data.fetchID
          this.fetchQueryID = response.data.id
        })
        .catch(function (error) {
          let errMsg = JSON.stringify(error.response.data)
          vm.status = `此次搜尋異常，煩請至 巴哈討論串 / Github Issue 回報複製後的物品字串，感謝！<br>${errMsg}`
          vm.$message({
            type: 'error',
            message: errMsg
          });
          console.log(errMsg);
        })
    }, 300),
    popOfficialWebsite() {
      shell.openExternal(`${this.baseUrl}/trade/search/${this.leagues.chosenL}/${this.fetchQueryID}`)
      // window.open(`https://web.poe.garena.tw/trade/search/${this.leagues.chosenL}/${this.fetchQueryID}`, '_blank', 'nodeIntegration=no')
    },
    startCountdown(Time) {
      this.countTime = Time * 1000
      this.isCounting = true
    },
    handleCountdownEnd() {
      this.isCounting = false
      this.cleanClipboard()
    },
    getAllAPI(boolean) {
      this.isApiError = false
      this.statsAPI();
      this.itemsAPI();
      this.leaguesAPI();
      if (boolean) {
        setTimeout(() => {
          this.gggAPI();
        }, 1000);
      }
    },
    statsAPI() { // 詞綴 API
      let vm = this
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/stats`, )
        .then((response) => {
          response.data.result[0].entries.forEach((element, index) => { // 偽屬性
            this.pseudoStats.push(element.text, element.id)
          })
          response.data.result[1].entries.forEach((element, index) => { // 隨機屬性
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            if (text.includes('\n')) { // 處理折行詞綴
              this.wrapStats.push(text)
            }
            this.explicitStats.push(text, element.id)
          })
          response.data.result[2].entries.forEach((element, index) => { // 固定屬性
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            if (text.includes('\n')) { // 處理折行詞綴
              this.wrapStats.push(text)
            }
            this.implicitStats.push(text, element.id)
          })
          response.data.result[4].entries.forEach((element, index) => { // 附魔
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            if (element.id === "enchant.stat_3948993189") { // 星團珠寶固定附魔詞綴
              element.option.options.forEach((element, index) => {
                this.clusterJewelStats.push(element.text, (element.id).toString())
              })
            } else if (element.id === "enchant.stat_2954116742") { // 項鍊塗油配置附魔詞綴
              element.option.options.forEach((element, index) => {
                this.allocatesStats.push(element.text, (element.id).toString())
              })
            }
            if (text.includes('\n')) { // 處理折行詞綴
              this.wrapStats.push(text)
            }
            this.enchantStats.push(text, element.id)
          })
          response.data.result[5].entries.forEach((element, index) => { // 已工藝
            let text = element.text
            if (text.indexOf(' (部分)') > -1) { // 刪除(部分)字串
              text = text.substring(0, text.indexOf(' (部分)'))
            }
            if (text.includes('\n')) { // 處理折行詞綴
              this.wrapStats.push(text)
            }
            this.craftedStats.push(text, element.id)
          })
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    itemsAPI() { // 物品 API
      let vm = this
      let accessoryIndex = 0
      let armourIndex = 0
      let flasksIndex = 0
      let jewelIndex = 0
      let weaponIndex = 0
      let mapIndex = 0
      let heistIndex = 0
      this.equipItems.length = 0
      this.mapBasic.option.length = 0
      this.gemBasic.option.length = 0
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/items`, )
        .then((response) => {
          this.allItems = response.data.result
          // TODO: 把 allItems 改為可套用至全域搜尋的資料格式
          let result = response.data.result
          result[0].entries.forEach((element, index) => { // "label": "飾品"
            const basetype = ["碧珠護身符", "素布腰帶", "裂痕戒指"]
            // _.isUndefined(element.flags) == true 表示非傳奇物品
            if (_.isUndefined(element.flags)) {
              accessoryIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (accessoryIndex) {
              case 1: // 項鍊起始點 { "type": "碧珠護身符", "text": "碧珠護身符" }
                element.name = "項鍊"
                element.option = "accessory.amulet"
                this.equipItems.push(element)
                break;
              case 2: // 腰帶起始點 { "type": "素布腰帶", "text": "素布腰帶" }
                element.name = "腰帶"
                element.option = "accessory.belt"
                this.equipItems.push(element)
                break;
              case 3: // 戒指起始點 { "type": "裂痕戒指", "text": "裂痕戒指" }  
                element.name = "戒指"
                element.option = "accessory.ring"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[1].entries.forEach((element, index) => { // "label": "護甲"
            const basetype = ["黃金戰甲", "異色鞋", "擒拿手套", "喚骨頭盔", "黃金聖炎", "火靈箭袋"]
            if (_.isUndefined(element.flags)) {
              armourIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (armourIndex) {
              case 1: // 胸甲起始點 { "type": "黃金戰甲", "text": "黃金戰甲" }
                element.name = "胸甲"
                element.option = "armour.chest"
                this.equipItems.push(element)
                break;
              case 2: // 鞋子起始點 { "type": "異色鞋", "text": "異色鞋" }
                element.name = "鞋子"
                element.option = "armour.boots"
                this.equipItems.push(element)
                break;
              case 3: // 手套起始點 { "type": "擒拿手套", "text": "擒拿手套" }
                element.name = "手套"
                element.option = "armour.gloves"
                this.equipItems.push(element)
                break;
              case 4: // 頭部起始點 { "type": "喚骨頭盔", "text": "喚骨頭盔" }
                element.name = "頭部"
                element.option = "armour.helmet"
                this.equipItems.push(element)
                break;
              case 5: // 盾牌起始點 { "type": "黃金聖炎", "text": "黃金聖炎" }
                element.name = "盾"
                element.option = "armour.shield"
                this.equipItems.push(element)
                break;
              case 6: // 箭袋起始點 { "type": "火靈箭袋", "text": "火靈箭袋" }
                element.name = "箭袋"
                element.option = "armour.quiver"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[4].entries.forEach((element, index) => { // "label": "藥劑" 
            const basetype = ["小型複合藥劑"]
            if (_.isUndefined(element.flags)) {
              flasksIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (flasksIndex) {
              case 1: // 藥劑起始點 { "type": "小型複合藥劑", "text": "小型複合藥劑" }
                element.name = "藥劑"
                element.option = "flask"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[6].entries.forEach((element, index) => { // "label": "珠寶"
            const basetype = ["催眠之眼珠寶"]
            if (_.isUndefined(element.flags)) {
              jewelIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (jewelIndex) {
              case 1: // 珠寶起始點 { "type": "催眠之眼珠寶", "text": "催眠之眼珠寶" }
                element.name = "珠寶"
                element.option = "jewel"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[8].entries.forEach((element, index) => { // "label": "武器"
            const basetype = ["拳釘", "玻璃利片", "鏽斧", "朽木之棒", "鏽劍", "朽木法杖", "魚竿", "粗製弓", "朽木之幹", "石斧", "朽木巨錘", "鏽斑巨劍"]
            if (_.isUndefined(element.flags)) {
              weaponIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (weaponIndex) {
              case 1: // 爪起始點 { "type": "拳釘", "text": "拳釘" }
                element.name = "爪"
                element.option = "weapon.claw"
                element.weapon = "weapon.one" // "weapon.one" 單手武器
                this.equipItems.push(element)
                break;
              case 2: // 匕首起始點 { "type": "玻璃利片", "text": "玻璃利片" }
                element.name = "匕首"
                element.option = "weapon.dagger"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 3: // 單手斧起始點 { "type": "鏽斧", "text": "鏽斧" }
                element.name = "單手斧"
                element.option = "weapon.oneaxe"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 4: // 單手錘起始點 { "type": "朽木之棒", "text": "朽木之棒" }
                element.name = "單手錘"
                element.option = "weapon.onemace"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 5: // 單手劍起始點 { "type": "鏽劍", "text": "鏽劍" }
                element.name = "單手劍"
                element.option = "weapon.onesword"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 6: // 法杖起始點 { "type": "朽木法杖", "text": "朽木法杖" }
                element.name = "法杖"
                element.option = "weapon.wand"
                element.weapon = "weapon.one"
                this.equipItems.push(element)
                break;
              case 7: // { "type": "魚竿", "text": "魚竿" }
                element.name = "釣竿"
                element.option = "weapon.rod"
                this.equipItems.push(element)
                break;
              case 8: // 弓起始點 { "type": "粗製弓", "text": "粗製弓" }
                element.name = "弓"
                element.option = "weapon.bow"
                this.equipItems.push(element)
                break;
              case 9: // 長杖起始點 { "type": "朽木之幹", "text": "朽木之幹" }
                element.name = "長杖"
                element.option = "weapon.staff"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 10: // 雙手斧起始點 { "type": "石斧", "text": "石斧" }
                element.name = "雙手斧"
                element.option = "weapon.twoaxe"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 11: // 雙手錘起始點 { "type": "朽木巨錘", "text": "朽木巨錘" }
                element.name = "雙手錘"
                element.option = "weapon.twomace"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              case 12: // 雙手劍起始點 { "type": "鏽斑巨劍", "text": "鏽斑巨劍" }
                element.name = "雙手劍"
                element.option = "weapon.twosword"
                element.weapon = "weapon.twomelee"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[13].entries.forEach((element, index) => { // "label": "劫盜裝備"
            const basetype = ["鰻皮鞋底"]
            if (_.isUndefined(element.flags)) {
              heistIndex += stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1 ? 1 : 0
            }
            switch (heistIndex) {
              case 1: // 劫盜裝備起始點 { "type": "鰻皮鞋底", "text": "鰻皮鞋底" }
                element.name = "劫盜裝備"
                element.option = "heistequipment"
                this.equipItems.push(element)
                break;
              default:
                break;
            }
          });
          result[7].entries.forEach((element, index) => { // "label": "地圖" 
            const basetype = ["惡靈學院"] // 地圖起始點 { "type": "惡靈學院", "text": "惡靈學院" }
            if (_.isUndefined(element.flags) && element.disc === "warfortheatlas") { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
              this.mapBasic.option.push(element.text)
            }
          });
          result[5].entries.forEach((element, index) => { // "label": "技能寶石"
            this.gemBasic.option.push(element.text)
          });
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    leaguesAPI() { // 聯盟 API
      let vm = this
      this.axios.get(`https://web.poe.garena.tw/api/trade/data/leagues`, )
        .then((response) => {
          const getID = _.property('id')
          this.leagues.option = _.map(response.data.result, 'id')
          // `_.property` 迭代縮寫 _.map(response.data.result, 'id') = _.map(response.data.result, getID) 
          this.leagues.chosenL = this.leagues.option[0]
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    gggAPI() {
      let vm = this
      const ignoreTyep = ["神諭之殿．神臨", "神諭之殿．歸徒", "神諭之殿．降師"] // 國際服的圖沒有這三種基底
      let tempMapBasic = []
      this.mapBasic.option.forEach((element, index) => {
        if (stringSimilarity.findBestMatch(element, ignoreTyep).bestMatch.rating !== 1) { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
          tempMapBasic.push(element)
        }
      });
      this.axios.get(`https://www.pathofexile.com/api/trade/data/leagues`, )
        .then((response) => {
          this.gggLeagues = _.map(response.data.result, 'id')
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
      this.axios.get(`https://www.pathofexile.com/api/trade/data/items`, )
        .then((response) => {
          let result = response.data.result
          let mapMatchIndex = 0
          result[7].entries.forEach((element, index) => { // "label": "Maps" 台服 143 / 國際服 140
            const basetype = ["Academy Map"] // 地圖起始點 { "type": "Academy Map", "text": "Academy Map" }
            if (stringSimilarity.findBestMatch(element.type, basetype).bestMatch.rating === 1) {
              mapMatchIndex = index
            }
            if (_.isUndefined(element.flags) && element.disc === "warfortheatlas") { // 只抓 {"disc": "warfortheatlas"} 一般地圖基底
              this.gggMapBasic.push(`${tempMapBasic[index - mapMatchIndex]} (${element.text})`)
            }
          });
          result[5].entries.forEach((element, index) => { // "label": "Gems" 台服國際服皆 436
            this.gggGemBasic.push(`${this.gemBasic.option[index]} (${element.text})`)
          });
        })
        .catch(function (error) {
          vm.isApiError = true
          vm.apiErrorStr = error
          vm.startCountdown(10)
          vm.resetSearchData()
          console.log(error);
        })
    },
    mapAreaCopy(name) {
      clipboard.writeText(name)
      this.$message({
        duration: 1200,
        type: 'success',
        message: `${name} 區域已複製!`
      });
      this.isMapAreaCollapse = false
    },
    addAfterCopyText() {
      clipboard.writeText(`${clipboard.readText()} ${this.wantedAddedText}`)
      this.$message({
        duration: 2000,
        type: 'success',
        message: `已複製字串：${clipboard.readText().substring(0, 10)} ... ${this.wantedAddedText}`
      });
    },
    clickToSearch: _.debounce(function () { // TODO: 重構物品/地圖交替搜尋時邏輯 stats: [{type: "and", filters: [], disabled: true(?)}]
      if (this.isItem) {
        this.searchJson.query.stats[0].filters.length = 0
      }
      if (this.isMap && this.mapBasic.isSearch) {
        this.searchName = `物品名稱 <br>『${this.mapBasic.chosenM}』`
      }
      if (this.isGem && this.gemBasic.isSearch) {
        this.searchName = `物品名稱 <br>『${this.gemQualitySet.chosenObj.prop !== '0' && this.gemQualitySet.isSearch ? `${this.gemQualitySet.chosenObj.label} ` : ''}${this.gemBasic.chosenG}』`
      }
      this.searchTrade(this.searchJson)
    }, 500),
    itemStatsAnalysis(itemArray, rarityFlag) {
      this.isStatsCollapse = rarityFlag ? false : true
      let tempStat = []
      let itemDisplayStats = [] // 該物品顯示的詞綴陣列
      let itemLevelIndex = 0 // 物品等級於陣列中的位置
      let itemStatStart = 0 // 物品隨機詞綴初始位置
      let itemStatEnd = itemArray.length - 1 // 物品隨機詞綴結束位置

      function spliceWrapStats(spliceNumber, index) { //配合 splice function 與 \n 數量調整詞綴結束位置
        itemArray.splice(index + 1, spliceNumber)
        itemStatEnd = itemArray.length - spliceNumber
      }

      itemArray.forEach((element, index) => {
        let isEnchantOrImplicit = index > 0 ? itemArray[index - 1].indexOf("(enchant)") > -1 || itemArray[index - 1].indexOf("(implicit)") > -1 : false
        // "--------" 字串前一筆資料若為固定詞或附魔詞，則不將此 index 視為詞綴結束點
        if (stringSimilarity.compareTwoStrings(element, '魔符階級:') > 0.7) {
          itemStatStart = index + 2
        } else if (stringSimilarity.compareTwoStrings(element, '物品等級:') > 0.7) {
          itemStatStart = index + 2
          itemLevelIndex = index
        }
        this.wrapStats.forEach((wrapStatsElement, wrapStatsIndex) => {
          let firstWSE = wrapStatsElement.split("\n")[0]
          let secondWSE = wrapStatsElement.split("\n")[1]
          let newLineCount = wrapStatsElement.split("\n").length - 1
          let tempStatArray = []
          // 比對折行詞綴第一筆與第二筆，比對成功就將 itemArray 刪除指定筆數
          if (element && stringSimilarity.compareTwoStrings(firstWSE, element) > 0.7 && stringSimilarity.compareTwoStrings(secondWSE, itemArray[index + 1]) > 0.7) {
            for (let i = 0; i <= newLineCount; i++) {
              tempStatArray.push(itemArray[index + i])
            }
            itemArray[index] = tempStatArray.join('\n')
            spliceWrapStats(newLineCount, index)
          }
        });
        if (element.indexOf("附加的小型天賦給予：") > -1 && element.indexOf("(enchant)") == -1) { // 有折行的星團珠寶附魔詞綴
          switch (true) {
            case element.indexOf("斧攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n劍攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("長杖攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n錘或權杖攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("爪攻擊增加 12% 擊中和異常狀態傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n匕首攻擊增加 12% 擊中和異常狀態傷害 (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("持弓類武器時增加 12% 傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n增加 12% 弓技能持續傷害 (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("增加 12% 陷阱傷害") > -1:
              itemArray[index] = `${itemArray[index]}\n增加 12% 地雷傷害 (enchant)`
              spliceWrapStats(1, index)
              break;
            case element.indexOf("增加 10% 藥劑回復生命") > -1:
              itemArray[index] = `${itemArray[index]}\n增加 10% 藥劑回復魔力 (enchant)`
              spliceWrapStats(1, index)
              break;
            default:
              break;
          }
        }
        if (element === "--------" && !isEnchantOrImplicit && itemStatStart && index > itemStatStart && itemStatEnd == itemArray.length - 1) { // 判斷隨機詞墜結束點
          itemStatEnd = index
        }
        if (element.indexOf('未鑑定') > -1) {
          itemStatEnd = index - 1
          return
        }
      });

      function findBestStat(text, stats) { // 物品上原先詞綴 與 原先詞綴數值用'#'取代的兩種字串皆判斷並取最符合那一筆
        let originalObj = stringSimilarity.findBestMatch(text, stats)
        let modifiedObj = stringSimilarity.findBestMatch(text.replace(/\d+/g, '#'), stats)
        return originalObj.bestMatch.rating > modifiedObj.bestMatch.rating ? originalObj : modifiedObj
      }
      for (let index = itemStatStart; index < itemStatEnd; index++) {
        if (itemArray[index] !== "--------") {
          let text = itemArray[index]
          itemDisplayStats.push(itemArray[index])
          if (itemArray[index].indexOf('(implicit)') > -1) { // 固定屬性
            text = text.substring(0, text.indexOf('(implicit)')) // 刪除(implicit)字串
            tempStat.push(findBestStat(text, this.implicitStats))
            tempStat[tempStat.length - 1].type = "固定"
          } else if (itemArray[index].indexOf('(crafted)') > -1) { // 已工藝屬性
            text = text.substring(0, text.indexOf('(crafted)'))
            tempStat.push(findBestStat(text, this.craftedStats))
            tempStat[tempStat.length - 1].type = "工藝"
          } else if (itemArray[index].indexOf('(enchant)') > -1) {
            text = text.substring(0, text.indexOf('(enchant)'))
            tempStat.push(findBestStat(text, this.enchantStats))
            tempStat[tempStat.length - 1].type = "附魔"
          } else if (rarityFlag) { // 傳奇裝詞綴
            tempStat.push(findBestStat(text, this.explicitStats))
            tempStat[tempStat.length - 1].type = "傳奇"
          } else { // 隨機屬性
            tempStat.push(findBestStat(text, this.explicitStats))
            tempStat[tempStat.length - 1].type = "隨機"
          }
        }
      }
      // console.log(itemDisplayStats)
      // console.log(tempStat)
      tempStat.forEach((element, index) => { // 比對詞綴，抓出隨機數值與詞綴搜尋 ID
        let statID = element.ratings[element.bestMatchIndex + 1].target // 詞綴ID
        let apiStatText = element.bestMatch.target // API 抓回來的詞綴字串
        let itemStatText = itemDisplayStats[index] // 物品上的詞綴字串
        switch (true) { // 偽屬性、部分(Local)屬性判斷處理
          case statID.indexOf('stat_210067635') > -1: // 攻擊速度 (部分)
            statID = 'pseudo.pseudo_total_attack_speed'
            break;
          case statID.indexOf('stat_3489782002') > -1 || statID.indexOf('stat_4052037485') > -1: // # 最大能量護盾 (部分)
            statID = 'pseudo.pseudo_total_energy_shield'
            break;
          case statID.indexOf('stat_960081730') > -1 || statID.indexOf('stat_1940865751') > -1: // 附加 # 至 # 物理傷害 (部分)
            statID = 'pseudo.pseudo_adds_physical_damage'
            break;
          case statID.indexOf('stat_321077055') > -1 || statID.indexOf('stat_709508406') > -1: // 附加 # 至 # 火焰傷害 (部分)
            statID = 'pseudo.pseudo_adds_fire_damage'
            break;
          case statID.indexOf('stat_3531280422') > -1 || statID.indexOf('stat_2223678961') > -1: // 附加 # 至 # 混沌傷害 (部分)
            statID = 'pseudo.pseudo_adds_chaos_damage'
            break;
          case statID.indexOf('stat_2885144362') > -1 || statID.indexOf('stat_1334060246') > -1 || statID.indexOf('stat_3336890334') > -1: // 附加 # 至 # 閃電傷害 (部分)
            // stat_2885144362 應改為攻擊和法術附加 # 至 # 閃電傷害
            statID = 'pseudo.pseudo_adds_lightning_damage'
            break;
          case statID.indexOf('stat_1662717006') > -1 || statID.indexOf('stat_1037193709') > -1 || statID.indexOf('stat_2387423236') > -1: // 附加 # 至 # 冰冷傷害 (部分)
            // stat_1662717006 應改為攻擊和法術附加 # 至 # 冰冷傷害
            statID = 'pseudo.pseudo_adds_cold_damage'
            break;
            // 閃避值與護甲無偽屬性，若物品為護甲，應為（部分）標籤
          case statID.indexOf('stat_2144192055') > -1 || statID.indexOf('stat_53045048') > -1: // # 點閃避值 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) { // 護甲類別
              statID = `${statID.split('.')[0]}.stat_53045048`
            } else { // 非護甲
              statID = `${statID.split('.')[0]}.stat_2144192055`
            }
            break;
          case statID.indexOf('stat_2106365538') > -1 || statID.indexOf('stat_124859000') > -1: // 增加 #% 閃避值 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_124859000`
            } else {
              statID = `${statID.split('.')[0]}.stat_2106365538`
            }
            break;
          case statID.indexOf('stat_809229260') > -1 || statID.indexOf('stat_3484657501') > -1: // # 點護甲 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_3484657501`
            } else {
              statID = `${statID.split('.')[0]}.stat_809229260`
            }
            break;
          case statID.indexOf('stat_2866361420') > -1 || statID.indexOf('stat_1062208444') > -1: // 增加 #% 護甲 (部分)
            if (this.itemCategory.chosenObj.prop.indexOf('armour') > -1) {
              statID = `${statID.split('.')[0]}.stat_1062208444`
            } else {
              statID = `${statID.split('.')[0]}.stat_2866361420`
            }
            break;
          default:
            break;
        }
        let itemStatArray = itemStatText.split(' ') // 將物品上的詞綴拆解
        let matchStatArray = apiStatText.split(' ') // 將詞綴資料庫上的詞綴拆解
        // console.log(itemStatText)
        // console.log(matchStatArray)
        let randomMinValue = '' // 預設詞綴隨機數值最小值為空值
        let randomMaxValue = '' // 預設詞綴隨機數值最大值為空值
        let optionValue = 0 // 星團珠寶附魔 / 項鍊塗油配置 的 ID

        if (statID === "enchant.stat_3948993189") {
          let obj = stringSimilarity.findBestMatch(itemStatText, this.clusterJewelStats)
          optionValue = parseInt(obj.ratings[obj.bestMatchIndex + 1].target, 10)
          apiStatText = `附加的小型天賦給予：\n${obj.ratings[obj.bestMatchIndex].target}`
        } else if (statID === "enchant.stat_2954116742") {
          let obj = stringSimilarity.findBestMatch(itemStatText, this.allocatesStats)
          optionValue = parseInt(obj.ratings[obj.bestMatchIndex + 1].target, 10)
          apiStatText = `配置塗油天賦：${obj.ratings[obj.bestMatchIndex].target}`
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
        let isNegativeStat = false // API 詞綴只有"增加"，但物品可能有"減少"詞綴相關處理
        if (apiStatText.includes('增加') && itemStatText.includes('減少')) {
          apiStatText = apiStatText.replace('增加', '減少')
          isNegativeStat = true
        }
        if (statID === "enchant.stat_3086156145") { // 星團珠寶附加天賦數量調整為帶入最大值，最小值為最大值 - 1
          let tempValue = randomMinValue
          randomMaxValue = tempValue
          randomMinValue = tempValue - 1
        }
        this.searchStats.push({
          "id": statID,
          "text": apiStatText,
          "option": optionValue,
          "min": randomMinValue,
          "max": randomMaxValue,
          "isValue": randomMinValue ? true : false,
          "isNegative": isNegativeStat,
          "isSearch": false,
          "type": element.type
        })
      })
    },
    isRaritySearch() {
      if (!this.raritySet.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.type_filters.filters.rarity // 刪除稀有度 filter
      } else if (this.raritySet.isSearch && this.isSearchJson) {
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
        let levelValue = parseInt(levelPos.substring(0, levelPosEnd).trim(), 10)
        this.itemLevel.min = levelValue >= 86 ? 86 : levelValue // 物等超過86 只留86
      }
      // 判斷插槽連線
      if (item.indexOf('插槽: ') > -1) {
        const regLinkStr = /[A-Z]/g // 全域搜尋大寫英文字母
        const regLink6 = /(-){5}/g // 六連
        const regLink5 = /(-){4}/g // 五連
        const regLink4 = /(-){3}/g // 四連
        let linkedPos = item.substring(item.indexOf('插槽: ') + 3)
        let linkedPosEnd = linkedPos.indexOf(NL)
        let linkedString = linkedPos.substring(0, linkedPosEnd).trim().replace(regLinkStr, '')
        switch (true) {
          case regLink6.test(linkedString) == true:
            this.itemLinked.min = 6
            break;
          case regLink5.test(linkedString) == true:
            this.itemLinked.min = 5
            break;
          case regLink4.test(linkedString) == true:
            this.itemLinked.min = 4
            break;
          default:
            break;
        }
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
      if (matchItem.option === 'heistequipment') {
        this.itemBasic.isSearch = true
        this.isItemBasicSearch()
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
      if (!this.itemLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.ilvl // 刪除物品等級 filter
      } else if (this.itemLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.ilvl = { // 增加物品等級最小值 filter
          "min": this.itemLevel.min,
          "max": this.itemLevel.max ? this.itemLevel.max : ''
        }
      }
    },
    isLinkedSearch() { // 插槽連線設定
      if (!this.itemLinked.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.socket_filters // 刪除連線設定 filter
      } else if (this.itemLinked.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.socket_filters = { // 增加物品連線 filter
          "filters": {
            "links": {
              "min": this.itemLinked.min ? this.itemLinked.min : '',
              "max": this.itemLinked.max ? this.itemLinked.max : ''
            }
          }
        }
      }
    },
    isItemBasicSearch() {
      if (!this.itemBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除物品基底 filter
      } else if (this.itemBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.itemBasic.text) // 增加物品基底 filter
      }
    },
    isItemCategorySearch() {
      if (!this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.type_filters.filters.category // 刪除物品種類 filter
      } else if (this.itemCategory.isSearch && this.itemCategory.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.type_filters.filters.category = { // 增加物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
    },
    categoryChange(value) {
      if (this.isSearchJson) {
        this.searchJson.query.filters.type_filters.filters.category = { // 修改物品種類 filter
          "option": this.itemCategory.chosenObj.prop
        }
      }
    },
    corruptedInput() { // 已汙染設定
      if (this.isSearchJson && this.corruptedSet.chosenObj.prop === 'any') {
        delete this.searchJson.query.filters.misc_filters.filters.corrupted // 刪除已汙染 filter
        this.corruptedSet.chosenObj = {
          label: "任何",
          prop: 'any'
        }
        this.searchTrade(this.searchJson)
      } else if (this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.corrupted = {
          "option": this.corruptedSet.chosenObj.prop
        }
        this.searchTrade(this.searchJson)
      }
    },
    gemQualityTypeInput() { // 寶石替代品質設定 
      if (!this.gemQualitySet.isSearch && this.gemQualitySet.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.gem_alternate_quality // 刪除寶石替代品質 filter
      } else if (this.gemQualitySet.isSearch && this.gemQualitySet.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.gem_alternate_quality = {
          "option": this.gemQualitySet.chosenObj.prop
        }
      }
    },
    isExBasicSearch() {
      if (!this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] // 刪除勢力選項
      } else if (this.itemExBasic.isSearch && this.itemExBasic.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters[this.itemExBasic.chosenObj.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
    },
    exBasicChange(value) {
      let exSearchItem = !this.itemExBasic.chosenObj.prop ? '' : this.itemExBasic.chosenObj.prop // 前一個搜尋的勢力選項
      if (this.isSearchJson && this.searchJson.query.filters.misc_filters.filters.hasOwnProperty(exSearchItem)) {
        delete this.searchJson.query.filters.misc_filters.filters[exSearchItem] // 刪除前一個勢力選項
      }
      if (this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters[value.prop] = { // 增加目前選擇的勢力
          "option": "true"
        }
      }
      this.itemExBasic.chosenObj = value
    },
    mapAnalysis(item, itemArray, Rarity) {
      // this.itemStatsAnalysis(itemArray, 1) 地圖先不加入詞綴判斷
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

      let itemNameString = itemArray[2] === "--------" ? itemArray[1] : `${itemArray[1]} ${itemArray[2]}`
      let mapBasicCount = 0

      this.mapBasic.option.some(element => {
        let itemNameStringIndex = itemNameString.indexOf(element.replace(/[^\u4e00-\u9fa5|．]/gi, "")) // 比對 mapBasic.option 時只比對中文字串
        if (itemNameStringIndex > -1 && !mapBasicCount) {
          mapBasicCount++
          this.mapBasic.chosenM = this.isGarenaSvr ? element.replace(/[^\u4e00-\u9fa5|．]/gi, "") : itemNameString.slice(itemNameStringIndex)
          return true
        }
      });
      this.mapBasic.isSearch = true
      this.isMapBasicSearch()
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
      } else if (item.indexOf('凋落的') > -1 || item.indexOf('Blighted') > -1) {
        this.mapCategory.isBlighted = true
        this.searchJson.query.filters.map_filters.filters.map_blighted = {
          "option": "true"
        }
      }
      // else { // error handle
      //   this.status = `Oops! 尚未支援搜尋此種地圖`
      //   return
      // }
      this.searchTrade(this.searchJson)
    },
    isMapBasicSearch() {
      if (!this.mapBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除地圖基底 filter
      } else if (this.mapBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.mapBasic.chosenM) // 增加地圖基底 filter
      }
    },
    isMapLevelSearch() {
      if (!this.mapLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.map_filters.filters.map_tier // 刪除地圖階級 filter
      } else if (this.mapLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.map_filters.filters.map_tier = { // 指定地圖階級最小 / 最大值 filter
          "min": this.mapLevel.min,
          "max": this.mapLevel.max
        }
      }
    },
    isMapElderGuardSearch() {
      if (this.mapCategory.isElder && !this.mapElderGuard.isSearch && this.isSearchJson) {
        this.searchJson.query.stats[0].filters.length = 1
      } else if (this.mapElderGuard.isSearch && this.mapElderGuard.chosenObj.prop && this.isSearchJson) {
        this.searchJson.query.stats[0].filters[1] = {
          "id": "implicit.stat_3624393862",
          "value": {
            "option": this.mapElderGuard.chosenObj.prop
          }
        }
      }
    },
    isGemBasicSearch() {
      if (!this.gemBasic.isSearch && this.isSearchJson) {
        delete this.searchJson.query.type // 刪除技能基底 filter
      } else if (this.gemBasic.isSearch && this.isSearchJson) {
        this.searchJson.query.type = this.replaceString(this.gemBasic.chosenG) // 增加技能基底 filter
      }
    },
    isGemLevelSearch() {
      if (!this.gemLevel.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.gem_level // 刪除技能等級 filter
      } else if (this.gemLevel.isSearch && this.isSearchJson) {
        this.searchJson.query.filters.misc_filters.filters.gem_level = { // 指定技能等級最小 / 最大值 filter
          "min": this.gemLevel.min,
          "max": this.gemLevel.max
        }
      }
    },
    isGemQualitySearch() {
      if (!this.gemQuality.isSearch && this.isSearchJson) {
        delete this.searchJson.query.filters.misc_filters.filters.quality // 刪除技能品質 filter
      } else if (this.gemQuality.isSearch && this.isSearchJson) {
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
      if (item.indexOf('稀有度:') === -1 || !this.copyText || this.isApiError) { // POE 內的文字必定有稀有度
        return
      }
      if (this.isCounting) {
        this.cleanCopyText()
        this.cleanClipboard()
        this.$message({
          duration: 2000,
          type: 'error',
          message: `請等待限制間隔倒數完畢後再次按下 Ctrl+C`
        });
        return
      }
      this.resetSearchData();
      this.searchJson = JSON.parse(JSON.stringify(this.searchJson_Def)); // Deep Copy：用JSON.stringify把物件轉成字串 再用JSON.parse把字串轉成新的物件
      const NL = this.newLine
      let itemArray = item.split(NL); // 以行數拆解複製物品文字
      const regExp = new RegExp("[A-Za-z]+"); // 有英文字就代表是國際服
      if (item.indexOf('點擊右鍵將此預言附加於你的角色之上。') > -1) { // 預言特殊判斷
        this.isGarenaSvr = regExp.test(itemArray[3]) ? false : true
      } else {
        this.isGarenaSvr = regExp.test(itemArray[1]) ? false : true // 國際服中文化判斷 
      }
      let posRarity = item.indexOf(': ')
      let Rarity = itemArray[0].substring(posRarity + 2).trim()
      let searchName = itemArray[1]
      this.searchName = itemArray[2] === "--------" ? `物品名稱 <br>『${itemArray[1]}』` : `物品名稱 <br>『${itemArray[1]} ${itemArray[2]}』`
      let itemBasic = itemArray[2]
      let itemNameString = itemArray[2] === "--------" ? itemArray[1] : `${itemArray[1]} ${itemArray[2]}`
      let itemBasicCount = 0

      this.equipItems.some(element => {
        let itemNameStringIndex = itemNameString.indexOf(element.text)
        // console.log(itemNameString, itemNameStringIndex)
        if (itemNameStringIndex > -1 && !itemBasicCount && (itemNameString.indexOf('碎片') === -1 || Rarity !== '傳奇')) {
          itemBasicCount++
          element.text = this.isGarenaSvr ? element.text : this.replaceString(itemNameString)
          this.itemAnalysis(item, itemArray, element)
          this.isItem = true
          this.isItemCollapse = true
          return true
        }
      });

      if (Rarity === "傳奇" && item.indexOf('地圖階級') === -1 && item.indexOf('在塔恩的鍊金室') === -1) { // 傳奇道具
        if (item.indexOf('未鑑定') === -1) { // 已鑑定傳奇
          this.searchJson.query.name = this.replaceString(searchName)
          this.searchJson.query.type = this.replaceString(itemBasic)
          this.raritySet.chosenObj = {
            label: "傳奇",
            prop: 'unique'
          }
          this.raritySet.isSearch = true
          this.isRaritySearch()
          if (this.isItem) {
            this.itemStatsAnalysis(itemArray, 1)
          }
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
          this.searchJson.query.type = this.replaceString(searchName)
          this.$message({
            duration: 2000,
            type: 'warning',
            message: `未鑑定傳奇物品會搜到相同基底的其他傳奇裝`
          });
        }
      } else if (Rarity === "命運卡" || Rarity === "通貨" || Rarity === "通貨不足") {
        this.searchJson.query.type = this.replaceString(searchName)
      } else if (Rarity === "寶石") {
        this.isGem = true

        if (item.indexOf('異常的 ') > -1) { // 替代品質判斷
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '1'
          this.gemQualitySet.chosenObj.label = '異常的'
          this.gemBasic.chosenG = searchName.substring(4)
        } else if (item.indexOf('相異的 ') > -1) {
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '2'
          this.gemQualitySet.chosenObj.label = '相異的'
          this.gemBasic.chosenG = searchName.substring(4)
        } else if (item.indexOf('幻影的 ') > -1) {
          this.gemQualitySet.isSearch = true
          this.gemQualitySet.chosenObj.prop = '3'
          this.gemQualitySet.chosenObj.label = '幻影的'
          this.gemBasic.chosenG = searchName.substring(4)
        } else {
          this.gemQualitySet.isSearch = false
          this.gemQualitySet.chosenObj.prop = '0'
          this.gemQualitySet.chosenObj.label = '精良的（預設）'
          this.gemBasic.chosenG = searchName
        }
        this.gemQualityTypeInput()

        if (item.indexOf('瓦爾．') > -1) { // 瓦爾技能
          let vaalPos = item.substring(item.indexOf('瓦爾．'))
          let vaalPosEnd = vaalPos.indexOf(NL)
          let vaalGem = vaalPos.substring(0, vaalPosEnd)
          this.searchName = `物品名稱『${vaalGem}』`
          this.isGarenaSvr = regExp.test(vaalGem) ? false : true
          this.gemBasic.chosenG = vaalGem
        }
        this.gemBasic.isSearch = true
        this.isGemBasicSearch()

        let levelPos = item.substring(item.indexOf('等級: ') + 4)
        let levelPosEnd = levelPos.indexOf(NL)
        this.gemLevel.min = parseInt(levelPos.substring(0, levelPosEnd).replace(/[+-]^\D+/g, ''), 10)

        let minQuality = 0
        if (item.indexOf('品質: +') > -1) {
          let quaPos = item.substring(item.indexOf('品質: +') + 5) // 品質截斷字串 (包含'品質: +'前的字串全截斷)
          let quaPosEnd = quaPos.indexOf('% (augmented)') // 品質定位點
          minQuality = parseInt(quaPos.substring(0, quaPosEnd).trim(), 10)
        }
        if (!this.gemQualitySet.isSearch) { // 若沒有替代品質，則搜尋技能品質
          this.gemQuality.isSearch = true
        }
        this.gemQuality.min = minQuality
        this.isGemQualitySearch()
      } else if (Rarity === "普通" && (item.indexOf('透過聖殿實驗室或個人') > -1 || item.indexOf('可以使用於個人的地圖裝置來增加地圖的詞綴') > -1 || item.indexOf('放置兩個以上不同的徽印在地圖裝置中') > -1 || item.indexOf('你必須完成異界地圖中出現的全部六種試煉才能進入此區域') > -1 || item.indexOf('擊殺指定數量的怪物後會掉落培育之物') > -1)) {
        // 地圖碎片、裂痕石、徽印、聖甲蟲、眾神聖器、女神祭品、培育器
        this.searchJson.query.type = this.replaceString(searchName)
      } else if (Rarity === "普通" && (item.indexOf('點擊右鍵將此預言附加於你的角色之上。') > -1)) { // 預言
        let name = this.isGarenaSvr ? searchName : this.replaceString(searchName.split('(')[1])
        this.searchJson.query.name = name
      } else if (item.indexOf('地圖階級') > -1) { // 地圖搜尋
        this.mapAnalysis(item, itemArray, Rarity)
      } else if (this.isItem && (Rarity === "稀有" || Rarity === "魔法" || Rarity === "普通")) {
        this.itemStatsAnalysis(itemArray, 0)
        return
      } else {
        this.status = this.isItem ? '' : `目前版本尚未支援搜尋鍊魔器官及 3.12 新試驗基底、聯盟相關道具`
        return
      }
      this.searchTrade(this.searchJson)
    },
    isGarenaSvr: function () { // 國際服相關 function 處理
      let vm = this
      this.baseUrl = this.isGarenaSvr ? 'https://web.poe.garena.tw' : 'https://www.pathofexile.com'
      if (!this.isGarenaSvr) {
        this.leagues.option = this.gggLeagues
        this.leagues.chosenL = this.gggLeagues[0]
        this.mapBasic.option = Object.assign([], this.gggMapBasic);
        this.gemBasic.option = Object.assign([], this.gggGemBasic);
      } else {
        this.itemsAPI();
        this.leaguesAPI();
      }
    },
    isOnline: _.debounce(function () {
      let option = this.isOnline ? 'online' : 'any'
      this.searchJson_Def.query.status.option = option
      if (this.isSearchJson && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.status.option = option
        this.searchTrade(this.searchJson)
      }
    }, 500),
    isPriced: function () {
      this.fetchID.length = 0
      let option = this.isPriced ? 'priced' : 'unpriced'
      this.searchJson_Def.query.filters.trade_filters.filters.sale_type.option = option
      if (this.isSearchJson && JSON.stringify(this.searchJson_Def) !== JSON.stringify(this.searchJson)) {
        this.searchJson.query.filters.trade_filters.filters.sale_type.option = option
        this.searchTrade(this.searchJson)
      }
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
    handlePOESESSID: {
      get() { // get stored message
        return this.$store.state.POESESSID;
      },
      set(newID) { // commit a mutation to set message
        this.$store.commit('setPOESESSID', newID);
      }
    },
    isDevMode() {
      return process.env.NODE_ENV === 'development'
    },
    isSearchJson() {
      return !_.isEmpty(this.searchJson)
    },
    pricedText() {
      return this.isPriced ? "有標價" : "未標價"
    },
    whichServer() {
      return this.isGarenaSvr ? "台服" : "國際服"
    },
    statsFontColor() {
      return function (item) {
        switch (item) {
          case '固定':
            return {
              'color': '#5555ff'
            }
            break;
          case '附魔':
            return {
              'color': '#8181ff'
            }
            break;
          case '工藝':
            return {
              'color': '#8181ff'
            }
            break;
          case '傳奇':
            return {
              'color': '#af6025'
            }
            break;
          default:
            break;
        }
      }
    },
    isDetailHistoried() {
      return function (item) {
        if (item.isDetailHistoried === 'true') {
          return true
        }
      }
    },
  },
}
</script>

<style>
/* 隱藏滾動捲軸 */
::-webkit-scrollbar {
  display: none;
}

.MapCopy {
  border-top: 1px solid #000;
  padding: 5px;
  color: #b4b4ff
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

.vs__dropdown-menu {
  flex-direction: column;
  align-items: flex-start;
  min-width: 0px !important;
  width: calc(100% - 5px) !important;
}

.vs__dropdown-option--highlight {
  background: rgb(208, 236, 252) !important;
  color: #333 !important;
}

.vs__dropdown-option--selected {
  background: lightskyblue !important;
  color: #333 !important;
}

.statsFontColor {
  color: (var(color))
}

.el-message {
  min-width: 220px;
  max-width: 450px;
  height: 40px;
}

.el-message p {
  max-width: 370px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.custom-control-label {
  cursor: pointer;
}
</style>
