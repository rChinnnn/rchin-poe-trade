<template>
<div id="app">
  <div style="float: right;">
    <input type="checkbox" id="theme-toggle" v-model="nightMode">
    <label for="theme-toggle"><span></span></label>
  </div>
  <div id="nav" style="clear: both;">
    <router-link to="/home">Home</router-link> |
    <router-link to="/">About</router-link>
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
    isEnabled as isDarkReaderEnabled
} from 'darkreader';

enableDarkMode({
  brightness: 100,
  contrast: 95,
  sepia: 5
});

export default {
  data() {
    return {
      nightMode: true
    }
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
      // console.log('Night Mode: ' + JSON.stringify(this.nightMode), isDarkReaderEnabled())
    },
  },
}
</script>
