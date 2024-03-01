<template>
  <div id="app">
    <div style="float: right;">
      <input type="checkbox" id="theme-toggle" v-model="nightMode">
      <label for="theme-toggle"><span></span></label>
    </div>
    <div id="nav" style="display: flex; justify-content: center; clear: both;">
      <div style="flex: 1; text-align: center;">
        <router-link to="/home">Home</router-link> |
        <router-link to="/">About</router-link>
      </div>
      <div style="align-self: flex-end;">
        <b-button v-if="isUpdateAvailable" size="sm" variant="outline-success" @click="restartApp">
          更新
        </b-button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 5px
</style>

<script>
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from 'darkreader';

const { ipcRenderer } = window.require('electron');

enableDarkMode({
  brightness: 100,
  contrast: 95,
  sepia: 5
});

export default {
  data() {
    return {
      nightMode: true,
      isUpdateAvailable: false
    }
  },
  created() {
    this.nightMode = localStorage.getItem('nightMode') ? JSON.parse(localStorage.getItem('nightMode')) : true

    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_downloaded');
      this.isUpdateAvailable = true
      this.$message({
        type: 'success',
        message: `新版已經下載完成，可以點選右上角按鈕作更新！`
      })
    });
  },
  watch: {
    nightMode: function () {
      if (this.nightMode) {
        enableDarkMode({
          brightness: 100,
          contrast: 95,
          sepia: 5
        });
      } else {
        disableDarkMode();
      }
      localStorage.setItem("nightMode", JSON.stringify(this.nightMode));
    },
  },
  methods: {
    restartApp() {
      ipcRenderer.send('restart_app');
    }
  }
}
</script>
