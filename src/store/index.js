import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    POESESSID: '' || localStorage.getItem('POESESSID'),
    accountName: '' || localStorage.getItem('accountName'),
    selectedTab: localStorage.getItem('selectedTab') || '0',
    priceSettingMin: localStorage.getItem('priceSettingMin') || 0.1,
    priceSettingMax: localStorage.getItem('priceSettingMax') || null,
    serverString: localStorage.getItem('serverString') || '台服',
  },
  mutations: {
    setPOESESSID(state, POESESSID) {
      state.POESESSID = POESESSID
      localStorage.setItem('POESESSID', POESESSID)
    },
    setAccountName(state, accountName) {
      state.accountName = accountName
      localStorage.setItem('accountName', accountName)
    },
    setSelectedTab(state, selectedTab) {
      state.selectedTab = selectedTab
      localStorage.setItem('selectedTab', selectedTab)
    },
    setPriceMin(state, value) {
      state.priceSettingMin = value
      localStorage.setItem('priceSettingMin', value)
    },
    setPriceMax(state, value) {
      state.priceSettingMax = value
      localStorage.setItem('priceSettingMax', value)
    },
    setServerString(state, value) {
      state.serverString = value
      localStorage.setItem('serverString', value)
    },
  },
  actions: {},
  modules: {}
})
