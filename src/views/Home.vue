<template>
<div class="home">
  <HelloWorld msg="" />
  <button @click="apiRequest"> testAPI </button>
  <div>已搜尋次數 {{ count }} </div>
  <!-- <div>搜尋狀態 {{ status }} </div> -->
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
var _ = require('lodash');
const { clipboard } = require('electron')
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
      headers: {
        'Content-Type': 'application/json',
      },
      searchJson: {
        "query": {
          "status": {
            "option": "online"
          },
          "name": "init",
          "stats": [{
            "type": "and",
            "filters": [],
            "disabled": false
          }],
          "filters": {
            "trade_filters": {
              "filters": {
                "indexed": {
                  "option": "1week"
                }
              }
            }
          }
        },
        "sort": {
          "price": "asc"
        }
      }
    };
  },
  created() {
    this.scanCopy();
  },
  methods: {
    scanCopy() {
      setInterval(() => {
        this.copyText = clipboard.readText()
      }, 1000);
    },
    apiRequest: _.debounce(function () {
      this.count++
      this.axios.post(`http://localhost:3031/trade`, {
          itemName: 123,
        })
        .then((response) => {
          console.log(response.data)
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
      let searchName = item.substring(firstN, secondN)

      if (Rarity === "傳奇" || Rarity === "命運卡") {
        this.count += 1;
      } else {
        this.status = `目前只支援搜尋傳奇道具與命運卡！`
        // this.copyText = `Rarity：${Rarity}、length: ${Rarity.length}`
      }
    },
  },
}
</script>
