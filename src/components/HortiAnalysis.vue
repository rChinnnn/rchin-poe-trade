<template>
<div>
  <b-container>
    <!-- 勢力基底測試區
    <el-checkbox-group v-model="checkedItemExBasic" :min="0" :max="2">
      <el-checkbox v-for="item in itemExBasic" :label="item" :key="item" :style="`opacity: ${checkedItemExBasic.indexOf(item) > -1 ? '1' : '0.7'}`">{{item}}</el-checkbox>
    </el-checkbox-group> -->
    <!-- User Interface controls -->
    <b-row>
      <b-col sm="12" class="my-1">
        <b-form-group label="增加字串" label-cols-sm="4" label-align-sm="right" label-size="sm" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="wantedAddedText" type="search" id="filterInput" placeholder="請輸入欲增加的字串"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!wantedAddedText" @click="addAfterCopyText">增加</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="12" class="my-1">
        <b-form-group label="POESESSID" label-cols-sm="4" label-align-sm="right" label-size="sm" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="$store.state.POESESSID" :disabled="true" type="search" id="filterInput" placeholder="請輸入ID"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="7" class="my-1">
        <b-form-group label="帳號" label-cols-sm="4" label-align-sm="right" label-size="sm" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="handleAccountName" type="search" id="filterInput" placeholder="請輸入帳號"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!$store.state.POESESSID || !$store.state.accountName" @click="getStashTab()">查詢倉庫</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="5" class="my-1">
        <b-form-group label="選擇倉庫" label-cols-sm="4" label-align-sm="right" label-size="sm" class="mb-0">
          <b-form-select v-model="handleSelectedTab" :disabled="operatorMode || !$store.state.POESESSID || !$store.state.accountName" size="sm" :options="tabOptions" @change="getStashTab()">
            <template v-if="!operatorMode" v-slot:first>
              <option value="" disabled>請選擇倉庫</option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="4" class="my-1">
        <b-form-group label="排序" label-cols-sm="4" label-align-sm="right" label-size="sm" label-for="sortBySelect" class="mb-0">
          <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions">
              <template v-slot:first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="8" class="my-1">
        <b-form-group label="篩選" label-cols-sm="2" label-align-sm="right" label-size="sm" label-for="filterInput" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="請輸入文字"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">清除篩選</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="10" class="my-1">
        <b-form-group :label="`已確認 ${hortiCount} 台園藝憩站, 總共有 ${statsTotal} 條工藝${filteredRows == statsTotal ? '' : `, 篩選後有 ${filteredRows} 條工藝`}`" label-cols-sm="12" label-align-sm="right" label-size="sm" class="mb-0">
        </b-form-group>
      </b-col>
      <b-col sm="2" class="my-1">
        <b-badge @click="operatorMode ? clearHortiStation : getStashTab()" pill variant="secondary" style="margin-top: 5px; cursor: pointer;">{{ operatorText }}</b-badge>
      </b-col>

      <!-- Main table element -->
      <b-table style="padding-top: 10px;" responsive show-empty small :items="hortiStation" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" @filtered="onFiltered">
        <template v-slot:cell(description)="row">
          <div style="float: left; max-width:415px; cursor: pointer;" @click="copyText(row.value)">
            <span v-b-tooltip.hover.top.v-secondary :title="row.value.length > 29 ? row.value : ''" class="col text-truncate" style="float: left;">
              {{ row.value }}
            </span>
          </div>
        </template>
        <template v-slot:cell(level)="row">
          {{ row.value }}
        </template>
        <template v-slot:cell(amount)="row">
          {{ row.value }}
        </template>
      </b-table>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group label="每頁顯示" label-cols-sm="6" label-cols-md="4" label-cols-lg="3" label-align-sm="right" label-size="sm" label-for="perPageSelect" class="mb-0">
          <b-form-select v-model="perPage" id="perPageSelect" size="sm" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="7" md="6" class="my-1">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</div>
</template>

<script>
const {
  clipboard,
} = require('electron')
const _ = require('lodash');
export default {
  // 接受父组件的值
  props: {
    tempItemArray: Array,
  },
  components: {
    // loading: VueLoading,
  },
  data() {
    return {
      checkedItemExBasic: [],
      itemExBasic: ['塑界者', '異界尊師', '聖戰士', '救贖者', '狩獵者', '總督軍'],
      wantedAddedText: '',
      tabOptions: [],
      hortiCount: 0,
      hortiStation: [],
      fields: [{
          key: 'description',
          label: '工藝描述',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'level',
          label: '等級',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'amount',
          label: '數量',
          sortable: true,
          class: 'text-center'
        },
      ],
      totalRows: 1,
      filteredRows: 0,
      currentPage: 1,
      perPage: 15,
      pageOptions: [15, 20, 25, 30, 100],
      sortBy: 'description',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
    }
  },
  created() {

  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.hortiStation.length
    if (this.$store.state.POESESSID && this.$store.state.accountName) {
      this.getStashTab();
    }
  },
  methods: {
    hortiAnalysis(itemArray) {
      let tempHortiStation = []
      let statStart = itemArray.indexOf("保存有限的收割工藝選項，於之後使用") + 1 // 工藝詞綴初始位置
      let statEnd = itemArray.lastIndexOf("--------") // 工藝詞綴結束位置
      // console.log(statStart, itemArray[statStart], statEnd, itemArray[statEnd])
      for (let index = statStart; index < statEnd; index++) {
        tempHortiStation.push(itemArray[index])
      }
      tempHortiStation.forEach((element, index) => {
        let goPush = true
        let description = element.split('(')[0].trim() // 詞綴工藝名稱
        let level = parseInt(element.split('(')[1].substring(0, 2), 10) // 詞綴等級
        level = level >= 76 ? 100 : level

        this.hortiStation.forEach(e => { // 檢查是否有相同詞綴與等級
          if (e.description === description && e.level === level) {
            e.amount = e.amount + 1
            goPush = false
          }
        });
        if (goPush) {
          this.hortiStation.push({
            "amount": 1,
            "level": level,
            "description": description
          })
        }
      });
      this.hortiCount++
      this.totalRows = this.hortiStation.length
      this.filteredRows = this.statsTotal
      this.$message({
        duration: 2000,
        type: 'success',
        message: `已確認 ${this.hortiCount} 台園藝憩站, 總共有 ${this.statsTotal} 條工藝`
      });
    },
    clearHortiStation() {
      this.filteredRows = 0
      this.hortiCount = 0
      this.totalRows = 1
      this.hortiStation = []
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.filteredRows = filteredItems.length === 0 ? 0 : filteredItems.map(item => Object.values(item)[0]).reduce((a, b) => a + b);
      this.currentPage = 1
    },
    addAfterCopyText() {
      clipboard.writeText(`${clipboard.readText()} ${this.wantedAddedText}`)
      this.$message({
        duration: 2000,
        type: 'success',
        message: `已複製字串：${clipboard.readText().substring(0, 10)} ... ${this.wantedAddedText}`
      });
    },
    copyText(value) {
      clipboard.writeText(value)
      this.$message({
        duration: 2000,
        type: 'success',
        message: `已複製工藝詞綴：${value}`
      });
    },
    getStashTab() {
      let vm = this
      let baseUrl = `https://pathofexile.tw/character-window/get-stash-items?league=%E8%B1%90%E6%94%B6%E8%81%AF%E7%9B%9F`
      let url = `${baseUrl}&accountName=${this.$store.state.accountName}&tabs=1&tabIndex=${this.$store.state.selectedTab}`
      let cookie = `POESESSID=${this.$store.state.POESESSID};`
      this.hortiStation = []
      this.tabOptions = []
      this.hortiCount = 0
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
              this.tabOptions.push({
                value: element.i,
                text: element.n
              })
            });
            response.data.items.forEach(element => {
              if (element.typeLine == "園藝憩站") {
                this.hortiCount++
                if (element.craftedMods) {
                  element.craftedMods.forEach((element, index) => {
                    let goPush = true
                    let description = element.split('(')[0].trim() // 詞綴工藝名稱
                    let level = parseInt(element.split('(')[1].substring(0, 2), 10) // 詞綴等級
                    level = level >= 76 ? 100 : level

                    this.hortiStation.forEach(e => { // 檢查是否有相同詞綴與等級
                      if (e.description === description && e.level === level) {
                        e.amount = e.amount + 1
                        goPush = false
                      }
                    });
                    if (goPush) {
                      this.hortiStation.push({
                        "amount": 1,
                        "level": level,
                        "description": description
                      })
                    }
                  });
                }
              }
            });
            this.totalRows = this.hortiStation.length
            this.filteredRows = this.statsTotal
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
  watch: {
    tempItemArray: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.hortiAnalysis(val)
        }
      }
    },
  },
  computed: {
    handleSelectedTab: {
      get() {
        return this.$store.state.selectedTab;
      },
      set(newSelectedTab) {
        this.$store.commit('setSelectedTab', newSelectedTab);
      }
    },
    handleAccountName: {
      get() {
        return this.$store.state.accountName;
      },
      set(newAccountName) {
        this.$store.commit('setAccountName', newAccountName);
      }
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return {
            text: f.label,
            value: f.key
          }
        })
    },
    statsTotal() {
      return this.hortiStation.length === 0 ? 0 : this.hortiStation.map(item => Object.values(item)[0]).reduce((a, b) => a + b);
    },
    operatorMode() { // true => 手動複製模式、false => 搜尋倉庫頁面模式
      return this.tabOptions.length === 0
    },
    operatorText() {
      return this.operatorMode ? '清除工藝' : '更新工藝'
    },
  },
}
</script>

<style>

</style>
