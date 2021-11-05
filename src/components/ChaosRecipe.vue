<template>
<div>
  <b-container>
    <b-row>
      <b-col sm="12" class="my-1">
        <b-form-group label="帳號" label-cols-sm="7" label-align-sm="right" label-size="sm" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="handleAccountName" type="search" id="filterInput" placeholder="請輸入帳號"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!$store.state.POESESSID || !$store.state.accountName" @click="getStashTab()">查詢倉庫</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="12">
        <el-badge :value="helmetCount" :max="18" class="badgeItem" :type="`${helmetCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>頭</el-button>
        </el-badge>
        <el-badge :value="glovesCount" :max="18" class="badgeItem" :type="`${glovesCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>手</el-button>
        </el-badge>
        <el-badge :value="bootsCount" :max="18" class="badgeItem" :type="`${bootsCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>鞋</el-button>
        </el-badge>
        <el-badge :value="beltCount" :max="18" class="badgeItem" :type="`${beltCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>腰</el-button>
        </el-badge>
        <el-badge :value="weaponCount" :max="18" class="badgeItem" :type="`${weaponCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>武器</el-button>
        </el-badge>
        <el-badge :value="bodyCount" :max="36" class="badgeItem" :type="`${bodyCount < 18 ? 'warning' : 'primary'}`">
          <el-button size="small" round disabled>護甲</el-button>
        </el-badge>
      </b-col>
    </b-row>
  </b-container>

</div>
</template>

<script>
export default {
  data() {
    return {
      recipeItems: [],
      helmetCount: 0,
      glovesCount: 0,
      bootsCount: 0,
      beltCount: 0,
      weaponCount: 0,
      bodyCount: 0,
    }
  },
  created() {},
  mounted() {},
  methods: {
    getStashTab() {
      let vm = this
      let baseUrl = `https://www.pathofexile.com/character-window/get-stash-items?league=Scourge`
      let url = `${baseUrl}&accountName=${this.$store.state.accountName}&tabs=1`
      let cookie = `POESESSID=${this.$store.state.POESESSID};`
      let tabsIndex = []
      this.helmetCount = 0
      this.glovesCount = 0
      this.bootsCount = 0
      this.beltCount = 0
      this.weaponCount = 0
      this.bodyCount = 0

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
                case '頭 / 項鍊':
                  tabsIndex.push(element.i)
                  break;
                case '手 / 戒指':
                  tabsIndex.push(element.i)
                  break;
                case '鞋 / 腰帶':
                  tabsIndex.push(element.i)
                  break;
                case '武器':
                  tabsIndex.push(element.i)
                  break;
                case '護甲':
                  tabsIndex.push(element.i)
                  break;
                default:
                  break;
              }
            });
            if (tabsIndex.length > 0) {
              this.axios.all(tabsIndex.map(element => {
                  return this.axios.post(`http://localhost:3031/get_stash`, {
                    url: `${url}&tabIndex=${element}`,
                    cookie: cookie,
                  })
                }))
                .then(vm.axios.spread((...res) => {
                  res.forEach((element, index) => {
                    element.data.items.forEach(item => {
                      if (item.identified === false && !item.influences) {
                        switch (true) {
                          case item.icon.indexOf("/Helmet") > -1:
                            this.helmetCount += 1
                            break;
                          case item.icon.indexOf("/Gloves") > -1:
                            this.glovesCount += 1
                            break;
                          case item.icon.indexOf("/Boots") > -1:
                            this.bootsCount += 1
                            break;
                          case item.icon.indexOf("/Belt") > -1:
                            this.beltCount += 1
                            break;
                          case item.icon.indexOf("/Bow") > -1:
                            this.weaponCount += 1
                            break;
                          case item.icon.indexOf("/Wand") > -1:
                            this.weaponCount += 0.5
                            break;
                          case item.icon.indexOf("/Dagger") > -1:
                            this.weaponCount += 0.5
                            break;
                          case item.icon.indexOf("/OneHand") > -1:
                            this.weaponCount += 0.5
                            break;
                          case item.icon.indexOf("/Body") > -1:
                            this.bodyCount += 1
                            break;
                          default:
                            break;
                        }
                      }
                    })
                  });
                }))
                .catch(function (error) {
                  console.log(error);
                  vm.$message({
                    type: 'error',
                    message: `get stash error! ${error}`,
                  });
                })
            }
          }
        })
        .catch(function (error) {
          vm.$message({
            type: 'error',
            message: `error: ${error}`
          });
          console.log(error);
        })
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
  },
}
</script>

<style>
.badgeItem {
  margin-top: 8px;
  margin-right: 20px;
}
</style>
