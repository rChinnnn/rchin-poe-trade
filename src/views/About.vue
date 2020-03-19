<template>
<div class="about">
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="primary" header="台服 POE 查價工具（1.310.1）" header-bg-variant="primary" header-text-variant="white" align="center">
        <b-card-text>作者：rChinnn</b-card-text>
        <b-card-text>
          <p><a href="" @click="openLink(`https://github.com/rChinnnn/rchin-poe-trade`)" title="GitHub">詳細使用說明請點我</a></p>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="dark" header="使用說明" align="center">
        <b-card-text>1. 點回 Home 頁籤</b-card-text>
        <b-card-text>2. 切換視窗回遊戲中</b-card-text>
        <b-card-text>3. 將滑鼠停在物品上，按下 Ctrl+C </b-card-text>
        <b-card-text>4. 程式將自動判斷此次搜尋物品 </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</div>
</template>

<script>
const {
  clipboard,
  shell
} = require('electron')

export default {
  methods: {
    openLink(URL) {
      shell.openExternal(URL)
    },
  },
}
</script>
