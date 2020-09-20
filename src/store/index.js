import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    POESESSID: '' || localStorage.getItem('POESESSID'),
    accountName: '' || localStorage.getItem('accountName'),
    selectedTab: localStorage.getItem('selectedTab') || '0',
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
  },
  actions: {},
  modules: {}
})
