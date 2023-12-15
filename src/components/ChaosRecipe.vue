<template>
  <div>
    <b-container>
      <b-row>
        <b-col sm="12" style="margin-left: 5px;">
          <b-form-group label="帳號" label-cols-sm="8" label-align-sm="right" label-size="sm" class="mb-0">
            <b-input-group size="sm">
              <b-form-input v-model="handleAccountName" placeholder="請輸入帳號"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!$store.state.POESESSID || !$store.state.accountName" @click="getStashTab()">查詢倉庫</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <loading loader="bars" :active.sync="isLoading" :is-full-page="false"></loading>
        </b-col>
        <b-col v-if="!isLoading" sm="12" style="margin-left: 20px; padding-top: 5px;">
          <el-badge :value="haCountString" class="badgeItem" :type="`${helmetCount < 18 || amuletCount < 18 ? 'warning' : 'primary'}`">
            <el-button size="small" round @click="stringCopy('頭部|項鍊')">頭/鍊</el-button>
          </el-badge>
          <el-badge :value="grCountString" class="badgeItem" :type="`${glovesCount < 18 || ringCount < 18 ? 'warning' : 'primary'}`">
            <el-button size="small" round @click="stringCopy('手套|戒指')">手/戒</el-button>
          </el-badge>
          <el-badge :value="bbCountString" class="badgeItem" :type="`${bootsCount < 18 || beltCount < 18 ? 'warning' : 'primary'}`">
            <el-button size="small" round @click="stringCopy('鞋子|腰帶')">鞋/腰</el-button>
          </el-badge>
          <el-badge :value="weaponCount" :max="18" class="badgeItem" :type="`${weaponCount < 18 ? 'warning' : 'primary'}`">
            <el-button size="small" round @click="stringCopy('單手|匕首|法杖|弓')">武器</el-button>
          </el-badge>
          <el-badge :value="bodyCount" :max="18" class="badgeItem" :type="`${bodyCount < 18 ? 'warning' : 'primary'}`">
            <el-button size="small" round @click="stringCopy('胸甲')">胸甲</el-button>
          </el-badge>
          <el-badge :value="veiledCount" class="badgeItem" type="success">
            <el-button size="small" round @click="stringCopy('隱匿')">隱</el-button>
          </el-badge>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const {
  clipboard,
} = require('electron')
import VueLoading from 'vue-loading-overlay'

export default {
  components: {
    loading: VueLoading,
  },
  data() {
    return {
      recipeItems: [],
      helmetCount: 0,
      amuletCount: 0,
      glovesCount: 0,
      ringCount: 0,
      bootsCount: 0,
      beltCount: 0,
      weaponCount: 0,
      bodyCount: 0,
      veiledCount: 0,
      isLoading: false,
    }
  },
  created() { },
  mounted() { },
  methods: {
    getStashTab() {
      let vm = this
      let baseUrl = `https://www.pathofexile.com/character-window/get-stash-items?league=Ancestor&realm=pc`
      let url = `${baseUrl}&accountName=${this.$store.state.accountName}&tabs=1&tabIndex=`
      let cookie = `POESESSID=${this.$store.state.POESESSID};`
      let tabsIndex = []
      this.helmetCount = 0
      this.amuletCount = 0
      this.glovesCount = 0
      this.ringCount = 0
      this.bootsCount = 0
      this.beltCount = 0
      this.weaponCount = 0
      this.bodyCount = 0
      this.veiledCount = 0
      this.isLoading = true

      this.axios.post(`http://localhost:3031/get_stash`, {
        url: url,
        cookie: cookie,
      })
        .then((response) => {
          // console.log(response.data)
          if (response.data.hasOwnProperty('error')) {
            let errorMessage = ''
            switch (response.data.error.message) {
              case 'Resource not found':
                errorMessage = '請再次檢查帳號名稱是否正確！'
                break;
              case 'Forbidden':
                errorMessage = '請再次檢查 POESESSID 是否正確！'
                break;
              default:
                errorMessage = `發生錯誤！${response.data.error.message}`
                break;
            }
            vm.isLoading = false
            vm.$message({
              type: 'error',
              message: `${errorMessage}`
            });
          } else {
            response.data.tabs.forEach(element => {
              // element.n => 倉庫名稱, element.i => 倉庫 index
              switch (element.n) {
                case 'Q':
                  tabsIndex.push(element.i)
                  break;
                case '頭部/項鍊':
                  tabsIndex.push(element.i)
                  break;
                case '手套/戒指':
                  tabsIndex.push(element.i)
                  break;
                case '鞋子/腰帶':
                  tabsIndex.push(element.i)
                  break;
                case '武器':
                  tabsIndex.push(element.i)
                  break;
                case '胸甲':
                  tabsIndex.push(element.i)
                  break;
                default:
                  break;
              }
            });
            if (tabsIndex.length > 0) {
              this.axios.all(tabsIndex.map(element => {
                return this.axios.post(`http://localhost:3031/get_stash`, {
                  url: `${url}${element}`,
                  cookie: cookie,
                })
              }))
                .then(vm.axios.spread((...res) => {
                  const ITEM_TYPES = {
                    HELMET: "/Helmet",
                    AMULET: "Amulet",
                    GLOVES: "/Gloves",
                    RING: ["Ring", "TopazRuby", "TopazSapphire", "SapphireRuby"],
                    BOOTS: "/Boots",
                    BELT: "/Belt",
                    WEAPON: "/Bow",
                    WEAPONS: ["/Wand", "/Dagger", "/OneHand"],
                    BODY: "/Body"
                  };

                  const handleItemCount = (item) => {
                    for (const type in ITEM_TYPES) {
                      const itemKeywords = ITEM_TYPES[type];

                      if (Array.isArray(itemKeywords)) {
                        if (itemKeywords.some(keyword => item.icon.includes(keyword))) {
                          if (type === "RING") {
                            this.ringCount += 0.5;
                          } else if (type === "WEAPONS") {
                            this.weaponCount += 0.5;
                          }
                        }
                      } else {
                        if (item.icon.includes(itemKeywords)) {
                          this[`${type.toLowerCase()}Count`] += 1;
                        }
                      }
                    }
                  };

                  res.forEach((element, index) => {
                    element.data.items.forEach(item => {
                      if (item.identified === false && item.ilvl >= 60) {
                        handleItemCount(item);
                      } else if (item.veiled === true) {
                        this.veiledCount += 1;
                      }
                    });
                  });
                }))
                .catch(function (error) {
                  console.log(error);
                  vm.$message({
                    type: 'error',
                    message: `get stash error! ${error}`,
                  });
                })
                .finally(() => {
                  vm.isLoading = false
                })
            }
          }
        })
        .catch(function (error) {
          vm.isLoading = false
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
    },
    stringCopy(name) {
      clipboard.writeText(name)
      this.$message({
        duration: 1500,
        type: 'success',
        message: `"${name}" 文字已複製!`
      });
    },
  },
  watch: {},
  computed: {
    handleAccountName: {
      get() {
        return this.$store.state.accountName;
      },
      set(newAccountName) {
        this.$store.commit('setAccountName', newAccountName);
      }
    },
    haCountString() {
      return `${this.helmetCount > 18 ? '18+' : this.helmetCount}/${this.amuletCount > 18 ? '18+' : this.amuletCount}`
    },
    grCountString() {
      return `${this.glovesCount > 18 ? '18+' : this.glovesCount}/${this.ringCount > 18 ? '18+' : this.ringCount}`
    },
    bbCountString() {
      return `${this.bootsCount > 18 ? '18+' : this.bootsCount}/${this.beltCount > 18 ? '18+' : this.beltCount}`
    }
  },
}
</script>

<style>
.badgeItem {
  margin-top: 8px;
  margin-right: 20px;
}

.el-badge__content.is-fixed {
  z-index: 10;
  right: 25px;
}
</style>
