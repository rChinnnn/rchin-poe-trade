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
              <b-button v-else-if="corruptedCount" @click="$emit('exclude')" size="sm" :variant="corruptedCount > 5 ? 'outline-danger' : 'outline-warning'">排除 {{ corruptedCount }} 筆已汙染</b-button>
              <div v-if="corruptedCount" style="padding: 1px 0px;"></div>
              <b-button v-if="fetchResultPrice.length <= 40 && fetchID.length >= 4 && calResultLength" @click="priceAnalysis(8)" :disabled="isCounting" size="sm" variant="outline-primary">再多搜 {{ calResultLength >= 40 ? 40 : calResultLength }} 筆價格</b-button>
            </th>
          </tr>
        </thead>
        <tbody @mouseleave="hoveredIndex = -1">
          <tr v-for="(item, index) in collectionCurrency" :key="index">
            <td @mouseover="handleHover(index)" :style="`opacity: ${hoveredIndex == index ? 1 : parseFloat(item.accountName.length / item.count)}; color: ${maxValuableIndex == index && parseFloat(item.accountName.length / item.count) > 0.85 ? 'darkred;' : ''}`">
              報價：{{ item.amount }} x
              <b-img :src="item.image" :alt="item.text" width=30 height=30></b-img>
              / <b>{{ item.count }}</b>筆
              <span v-if="isPriceCollapse === false">（<b>{{ item.accountName.length }}</b>人標）</span>
              <b-icon-x-square v-show="hoveredIndex == index && $store.state.POESESSID" @click="addToBlackList(item.accountName)" v-b-tooltip.hover.right.v-secondary :title="`將這 ${item.accountName.length} 人加入黑名單`" style="cursor: pointer;"></b-icon-x-square>
            </td>
          </tr>
        </tbody>
        <tfoot v-show="$store.state.POESESSID">
          <tr>
            <th>
              <b-icon-arrow-repeat @click="isCounting ? '' : $emit('refresh')" :style="[`cursor: ${isCounting ? `not-allowed` : `pointer`};`, 'margin-left: 3px;']" v-b-tooltip.hover.top.v-secondary :title="`重新整理`"></b-icon-arrow-repeat>
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
      itemImage: '',
      isLoading: false,
      hoveredIndex: -1,
      Currency: [{
        "id": "alt",
        "text": "改造石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxNYWdpYyIsInNjYWxlIjoxfV0/6308fc8ca2/CurrencyRerollMagic.png"
      },
      {
        "id": "fusing",
        "text": "鏈結石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxTb2NrZXRMaW5rcyIsInNjYWxlIjoxfV0/c5e1959880/CurrencyRerollSocketLinks.png"
      },
      {
        "id": "alch",
        "text": "點金石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlVG9SYXJlIiwic2NhbGUiOjF9XQ/0c72cd1d44/CurrencyUpgradeToRare.png"
      },
      {
        "id": "chaos",
        "text": "混沌石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxSYXJlIiwic2NhbGUiOjF9XQ/46a2347805/CurrencyRerollRare.png"
      },
      {
        "id": "gcp",
        "text": "寶石匠的稜鏡",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lHZW1RdWFsaXR5Iiwic2NhbGUiOjF9XQ/dbe9678a28/CurrencyGemQuality.png"
      },
      {
        "id": "exalted",
        "text": "崇高石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lBZGRNb2RUb1JhcmUiLCJzY2FsZSI6MX1d/33f2656aea/CurrencyAddModToRare.png"
      },
      {
        "id": "chrome",
        "text": "幻色石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxTb2NrZXRDb2xvdXJzIiwic2NhbGUiOjF9XQ/19c8ddae20/CurrencyRerollSocketColours.png"
      },
      {
        "id": "jewellers",
        "text": "工匠石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxTb2NrZXROdW1iZXJzIiwic2NhbGUiOjF9XQ/ba411ff58a/CurrencyRerollSocketNumbers.png"
      },
      {
        "id": "engineers",
        "text": "工程石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRW5naW5lZXJzT3JiIiwic2NhbGUiOjF9XQ/114b671d41/EngineersOrb.png"
      },
      {
        "id": "infused-engineers-orb",
        "text": "充能的工程石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSW5mdXNlZEVuZ2luZWVyc09yYiIsInNjYWxlIjoxfV0/55774baf2f/InfusedEngineersOrb.png"
      },
      {
        "id": "chance",
        "text": "機會石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlUmFuZG9tbHkiLCJzY2FsZSI6MX1d/a3f9bf0917/CurrencyUpgradeRandomly.png"
      },
      {
        "id": "chisel",
        "text": "製圖釘",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNYXBRdWFsaXR5Iiwic2NhbGUiOjF9XQ/0246313b99/CurrencyMapQuality.png"
      },
      {
        "id": "scour",
        "text": "重鑄石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lDb252ZXJ0VG9Ob3JtYWwiLCJzY2FsZSI6MX1d/a0981d67fe/CurrencyConvertToNormal.png"
      },
      {
        "id": "blessed",
        "text": "祝福石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lJbXBsaWNpdE1vZCIsInNjYWxlIjoxfV0/48e700cc20/CurrencyImplicitMod.png"
      },
      {
        "id": "regret",
        "text": "後悔石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lQYXNzaXZlU2tpbGxSZWZ1bmQiLCJzY2FsZSI6MX1d/32d499f562/CurrencyPassiveSkillRefund.png"
      },
      {
        "id": "regal",
        "text": "富豪石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlTWFnaWNUb1JhcmUiLCJzY2FsZSI6MX1d/0ded706f57/CurrencyUpgradeMagicToRare.png"
      },
      {
        "id": "divine",
        "text": "神聖石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZXMiLCJzY2FsZSI6MX1d/ec48896769/CurrencyModValues.png"
      },
      {
        "id": "vaal",
        "text": "瓦爾寶珠",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lWYWFsIiwic2NhbGUiOjF9XQ/593fe2e22e/CurrencyVaal.png"
      },
      {
        "id": "annul",
        "text": "無效石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQW5udWxsT3JiIiwic2NhbGUiOjF9XQ/0858a418ac/AnnullOrb.png"
      },
      {
        "id": "orb-of-binding",
        "text": "束縛石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQmluZGluZ09yYiIsInNjYWxlIjoxfV0/aac9579bd2/BindingOrb.png"
      },
      {
        "id": "ancient-orb",
        "text": "古變石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQW5jaWVudE9yYiIsInNjYWxlIjoxfV0/83015d0dc9/AncientOrb.png"
      },
      {
        "id": "orb-of-horizons",
        "text": "地平石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSG9yaXpvbk9yYiIsInNjYWxlIjoxfV0/0891338fb0/HorizonOrb.png"
      },
      {
        "id": "harbingers-orb",
        "text": "神諭石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSGFyYmluZ2VyT3JiIiwic2NhbGUiOjF9XQ/0a26e01f15/HarbingerOrb.png"
      },
      {
        "id": "wisdom",
        "text": "知識卷軸",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lJZGVudGlmaWNhdGlvbiIsInNjYWxlIjoxfV0/c2d03ed3fd/CurrencyIdentification.png"
      },
      {
        "id": "portal",
        "text": "傳送卷軸",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lQb3J0YWwiLCJzY2FsZSI6MX1d/d92d3478a0/CurrencyPortal.png"
      },
      {
        "id": "scrap",
        "text": "護甲片",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lBcm1vdXJRdWFsaXR5Iiwic2NhbGUiOjF9XQ/fc4e26afbc/CurrencyArmourQuality.png"
      },
      {
        "id": "whetstone",
        "text": "磨刀石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lXZWFwb25RdWFsaXR5Iiwic2NhbGUiOjF9XQ/c9cd72719e/CurrencyWeaponQuality.png"
      },
      {
        "id": "bauble",
        "text": "玻璃彈珠",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lGbGFza1F1YWxpdHkiLCJzY2FsZSI6MX1d/59e57027e5/CurrencyFlaskQuality.png"
      },
      {
        "id": "transmute",
        "text": "蛻變石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlVG9NYWdpYyIsInNjYWxlIjoxfV0/ded9e8ee63/CurrencyUpgradeToMagic.png"
      },
      {
        "id": "aug",
        "text": "增幅石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lBZGRNb2RUb01hZ2ljIiwic2NhbGUiOjF9XQ/d879c15321/CurrencyAddModToMagic.png"
      },
      {
        "id": "mirror",
        "text": "卡蘭德的魔鏡",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lEdXBsaWNhdGUiLCJzY2FsZSI6MX1d/8d7fea29d1/CurrencyDuplicate.png"
      },
      {
        "id": "eternal",
        "text": "永恆寶珠",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lJbXByaW50T3JiIiwic2NhbGUiOjF9XQ/49500c70ba/CurrencyImprintOrb.png"
      },
      {
        "id": "rogues-marker",
        "text": "盜賊之印",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSGVpc3QvSGVpc3RDb2luQ3VycmVuY3kiLCJzY2FsZSI6MX1d/335e66630d/HeistCoinCurrency.png"
      },
      {
        "id": "crusaders-exalted-orb",
        "text": "聖戰士的崇高石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSW5mbHVlbmNlIEV4YWx0cy9DcnVzYWRlck9yYiIsInNjYWxlIjoxfV0/8b48230188/CrusaderOrb.png"
      },
      {
        "id": "redeemers-exalted-orb",
        "text": "救贖者的崇高石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSW5mbHVlbmNlIEV4YWx0cy9FeXJpZU9yYiIsInNjYWxlIjoxfV0/8ec9b52d65/EyrieOrb.png"
      },
      {
        "id": "hunters-exalted-orb",
        "text": "狩獵者的崇高石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSW5mbHVlbmNlIEV4YWx0cy9CYXNpbGlza09yYiIsInNjYWxlIjoxfV0/cd2131d564/BasiliskOrb.png"
      },
      {
        "id": "warlords-exalted-orb",
        "text": "總督軍的崇高石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSW5mbHVlbmNlIEV4YWx0cy9Db25xdWVyb3JPcmIiLCJzY2FsZSI6MX1d/57f0d85951/ConquerorOrb.png"
      },
      {
        "id": "awakeners-orb",
        "text": "喚醒者之玉",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVHJhbnNmZXJPcmIiLCJzY2FsZSI6MX1d/f3b1c1566f/TransferOrb.png"
      },
      {
        "id": "mavens-orb",
        "text": "支配之玉",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvTWF2ZW5PcmIiLCJzY2FsZSI6MX1d/f307d80bfd/MavenOrb.png"
      },
      {
        "id": "facetors",
        "text": "費斯特之鏡",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lHZW1FeHBlcmllbmNlIiwic2NhbGUiOjF9XQ/7011b1ed48/CurrencyGemExperience.png"
      },
      {
        "id": "prime-regrading-lens",
        "text": "初階篩分之鏡",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQWx0ZXJuYXRlU2tpbGxHZW1DdXJyZW5jeSIsInNjYWxlIjoxfV0/d514645103/AlternateSkillGemCurrency.png"
      },
      {
        "id": "secondary-regrading-lens",
        "text": "次階篩分之鏡",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQWx0ZXJuYXRlU3VwcG9ydEdlbUN1cnJlbmN5Iiwic2NhbGUiOjF9XQ/bde7f354d4/AlternateSupportGemCurrency.png"
      },
      {
        "id": "tempering-orb",
        "text": "淬鍊石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGl2aW5lRW5jaGFudEJvZHlBcm1vdXJDdXJyZW5jeSIsInNjYWxlIjoxfV0/37681eda1c/DivineEnchantBodyArmourCurrency.png"
      },
      {
        "id": "tailoring-orb",
        "text": "裁縫石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGl2aW5lRW5jaGFudFdlYXBvbkN1cnJlbmN5Iiwic2NhbGUiOjF9XQ/d417654a23/DivineEnchantWeaponCurrency.png"
      },
      {
        "id": "awakened-sextant",
        "text": "製圖六分儀．覺醒",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQXRsYXNSYWRpdXNUaWVyMyIsInNjYWxlIjoxfV0/0561e8049e/AtlasRadiusTier3.png"
      },
      {
        "id": "elevated-sextant",
        "text": "製圖六分儀．高尚",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQXRsYXNSYWRpdXNUaWVyNCIsInNjYWxlIjoxfV0/3e53bafe61/AtlasRadiusTier4.png"
      },
      {
        "id": "surveyors-compass",
        "text": "調查員的羅盤",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU3VydmV5b3JzQ29tcGFzcyIsInNjYWxlIjoxfV0/e67bfaa9cf/SurveyorsCompass.png"
      },
      {
        "id": "orb-of-unmaking",
        "text": "撤銷石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvUmVncmV0T3JiIiwic2NhbGUiOjF9XQ/beae1b00c7/RegretOrb.png"
      },
      {
        "id": "blessing-xoph",
        "text": "索伏的祝福",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQnJlYWNoL0JyZWFjaFVwZ3JhZGVyRmlyZSIsInNjYWxlIjoxfV0/16a58db13d/BreachUpgraderFire.png"
      },
      {
        "id": "blessing-tul",
        "text": "托沃的祝福",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQnJlYWNoL0JyZWFjaFVwZ3JhZGVyQ29sZCIsInNjYWxlIjoxfV0/3573fedbf3/BreachUpgraderCold.png"
      },
      {
        "id": "blessing-esh",
        "text": "艾許的祝福",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQnJlYWNoL0JyZWFjaFVwZ3JhZGVyTGlnaHRuaW5nIiwic2NhbGUiOjF9XQ/3d1db83ad2/BreachUpgraderLightning.png"
      },
      {
        "id": "blessing-uul-netol",
        "text": "烏爾尼多的祝福",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQnJlYWNoL0JyZWFjaFVwZ3JhZGVyUGh5c2ljYWwiLCJzY2FsZSI6MX1d/f230a19a13/BreachUpgraderPhysical.png"
      },
      {
        "id": "blessing-chayula",
        "text": "夏烏拉的祝福",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQnJlYWNoL0JyZWFjaFVwZ3JhZGVyQ2hhb3MiLCJzY2FsZSI6MX1d/45e8da717e/BreachUpgraderChaos.png"
      },
      {
        "id": "veiled-chaos-orb",
        "text": "隱匿混沌石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVmVpbGVkQ2hhb3NPcmIiLCJzY2FsZSI6MX1d/fd913b89d0/VeiledChaosOrb.png"
      },
      {
        "id": "enkindling-orb",
        "text": "點燃石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXhwZWRpdGlvbi9GbGFza1BsYXRlIiwic2NhbGUiOjF9XQ/7c1a584a8d/FlaskPlate.png"
      },
      {
        "id": "instilling-orb",
        "text": "滴注石",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXhwZWRpdGlvbi9GbGFza0luamVjdG9yIiwic2NhbGUiOjF9XQ/efc518b1be/FlaskInjector.png"
      },
      {
        "id": "sacred-orb",
        "text": "聖玉",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2FjcmVkT3JiIiwic2NhbGUiOjF9XQ/0380fd0dba/SacredOrb.png"
      },
      {
        "id": "stacked-deck",
        "text": "豐裕牌組",
        "image": "/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvRGl2aW5hdGlvbi9EZWNrIiwic2NhbGUiOjF9XQ/8e83aea79a/Deck.png"
      }
      ]
    }
  },
  created() {

  },
  mounted() {
    // let vm = this
    // this.axios.get(`https://pathofexile.tw/api/trade/data/static`, )
    //   .then((response) => { // 通貨 icon
    //     this.Currency = response.data.result[0].entries
    //   })
    //   .catch(function (error) {
    //     vm.$message({
    //       type: 'error',
    //       message: `error: ${error}`
    //     });
    //     console.log(error);
    //   })
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
        let params = {
          baseUrl: this.baseUrl,
          element,
          fetchQueryID: this.fetchQueryID
        }
        return this.axios.post(`http://localhost:3031/trade_fetch`, params)
        // return this.axios.get(`${this.baseUrl}/api/trade/fetch/${element}?query=${this.fetchQueryID}`)
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
          vm.isLoading = false;
          if (error.response.headers) {
            let limitString = (error.response.headers["x-rate-limit-ip-state"]).split(",")
            let limitState = limitString[1].slice(limitString[1].lastIndexOf(":") + 1)
            limitState = parseInt(limitState, 10)
            vm.$message({
              type: 'error',
              message: `被 Server 限制發送需求了，請等待 ${limitState} 秒後再重試`
            });
          }
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
            collectionCurrency[index].image = `https://web.poecdn.com${element.image}`
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

<style></style>
