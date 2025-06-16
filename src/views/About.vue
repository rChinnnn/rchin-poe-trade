<template>
<div class="about" style="padding-top: 5px;">
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="primary" header="POE 查價工具 v1.326.0" header-bg-variant="primary" header-text-variant="white" align="center">
        <b-card-text>作者：rChinnnn</b-card-text>
        <b-card-text>
          <b-button @click="openLink(`https://github.com/rChinnnn/rchin-poe-trade/releases`)" size="sm" variant="outline-primary" class="mb-2">
            版本發佈歷史請點我
          </b-button>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="danger" header="免責聲明" header-bg-variant="danger" header-text-variant="white" align="center">
        <b-card-text>
          <h5>使用此程式者請自行承擔所有可能後果和風險</h5>
        </b-card-text>
        <b-card-text>此程式並無修改任何記憶體</b-card-text>
        <b-card-text>運作原理為抓取 POE 遊戲內對物品複製後的文字進行分析，以利快速查價</b-card-text>
        <b-card-text>串接的 API 皆為官方公開資源，請勿於短時間內快速搜尋造成伺服器負擔</b-card-text>
        <b-card-text>
          <b style="font-family: monospace; background-color: lightyellow;">This product isn't affiliated with or endorsed by Grinding Gear Games and Garena in any way.</b>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" header="這是免費程式 / 贊助連結" align="center">
        <b-card-text>此程式已在 GitHub 上開源，歡迎分享給親朋好友使用</b-card-text>
        <b-card-text>也歡迎贊助一杯咖啡</b-card-text>
        <b-card-text>
          <b-button @click="openLink(`https://p.opay.tw/lE5Yu`)" size="sm" variant="outline-primary" class="mb-2">
            歐付寶（O'Pay）<i class="fas fa-coffee"></i>
          </b-button> /
          <b-button @click="openLink(`https://www.buymeacoffee.com/rChinnn`)" size="sm" variant="outline-primary" class="mb-2">
            Buy me a coffee <i class="fas fa-mug-hot"></i>
          </b-button>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="dark" header="使用說明" header-bg-variant="dark" header-text-variant="white" align="center">
        <b-card-text>1. 點此頁上方的 Home 頁籤，於搜尋設定下方選擇遊玩的伺服器</b-card-text>
        <b-card-text>2. 切換視窗回遊戲中</b-card-text>
        <b-card-text>3. 將滑鼠停在物品上，按下 Ctrl+C </b-card-text>
        <b-card-text>4. 程式將自動判斷此次搜尋物品 </b-card-text>
        <b-card-text>
          <b-button @click="openLink(`https://github.com/rChinnnn/rchin-poe-trade/blob/master/README.md`)" size="sm" variant="outline-primary" class="mb-2">
            詳細使用說明及基礎搜尋設定請點我
          </b-button>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
  <div style="padding:5px 30px;">
    <b-card-group deck>
      <b-card border-variant="dark" header="熱鍵功能" header-bg-variant="dark" header-text-variant="white" align="center">
        <table class="table table-sm">
          <thead class="thead-light">
            <tr>
              <th scope="col">按鍵</th>
              <th scope="col">功能說明</th>
            </tr>
          </thead>
          <tbody class="hotkey">
            <tr v-for="(item, index) in hotkey" :key="index" style="padding-top: 5px;">
              <td align="left">{{ item.key }}</td>
              <td align="left">{{ item.description }}</td>
            </tr>
          </tbody>
        </table>
        <b-card-text><b style="background-color: lightyellow;">注意事項：所有熱鍵於 POE 遊戲視窗內皆無作用！必須點選至查價工具視窗內才能驅動各功能</b></b-card-text>
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
  data() {
    return {
      hotkey: [{
        "key": "F5",
        "description": "程式顯示在最上層，並且透明化 (可漂浮在POE程式上)"
      }, {
        "key": "F6",
        "description": "程式取消在最上層，並取消透明化"
      }, {
        "key": "PageUp",
        "description": "透明化程度 +5%"
      }, {
        "key": "PageDown",
        "description": "透明化程度 -5%"
      }, ]
    }
  },
  methods: {
    openLink(URL) {
      shell.openExternal(URL)
    },
  },
}
</script>

<style>
.card-body {
  padding: 10px !important;
}

.card-text p {
  margin-block-start: 0.5em;
  margin-block-end: 0em;
}

tbody.hotkey>tr>td {
  padding-top: 8px;
  padding-left: 25px;
}
</style>
