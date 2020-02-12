<template>
<div>

</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import hotkeys from "hotkeys-js";
var _ = require('lodash');
var stringSimilarity = require('string-similarity');
const {
  clipboard
} = require('electron')

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      count: 0

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    hotkeyPressed() {
      this.count++
    },
  },
  watch: {
    isPriced: function () {

    },
  },
  computed: {

  },
}
</script>

<style>


</style>
