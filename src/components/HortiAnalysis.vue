<template>
<div>
  <b-container>
    <!-- User Interface controls -->
    <b-row>
      <b-col sm="4" class="my-1">
        <b-form-group label="排序" label-cols-sm="3" label-align-sm="right" label-size="sm" label-for="sortBySelect" class="mb-0">
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
        <b-form-group label="篩選" label-cols-sm="3" label-align-sm="right" label-size="sm" label-for="filterInput" class="mb-0">
          <b-input-group size="sm">
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="請輸入文字"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">清除篩選</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="10" class="my-1">
        <b-form-group :label="`已確認 ${hortiCount} 台園藝憩站, 總共有 ${statsTotal} 條工藝${filteredRows === statsTotal ? '' : `, 篩選後有 ${filteredRows} 條工藝`}`" label-cols-sm="12" label-align-sm="right" label-size="sm" class="mb-0">
        </b-form-group>
      </b-col>
      <b-col sm="2" class="my-1">
        <b-badge @click="clearHortiStation" pill variant="secondary" style="margin-top: 5px; cursor: pointer;">清除工藝</b-badge>
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
      this.$bvToast.toast(`已確認 ${this.hortiCount} 台園藝憩站, 總共有 ${this.statsTotal} 條工藝`, {
        noCloseButton: true,
        toaster: 'toast-warning-center',
        variant: 'info',
        autoHideDelay: 500,
        appendToast: true
      })
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
    copyText(value) {
      clipboard.writeText(value)
      this.$bvToast.toast(`已複製詞綴：${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`, {
        noCloseButton: true,
        toaster: 'toast-warning-center',
        variant: 'info',
        autoHideDelay: 300,
        appendToast: true
      })
    }
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
  },
}
</script>

<style>

</style>
