# Readme.md

![GitHub Repo stars](https://img.shields.io/github/stars/rChinnnn/rchin-poe-trade?style=social)
![GitHub Downloads](https://img.shields.io/github/downloads/rChinnnn/rchin-poe-trade/latest/rchin-poe-trade-Setup-1.316.1.exe?label=Downloads&style=social)
![GitHub Downloads](https://img.shields.io/github/downloads/rChinnnn/rchin-poe-trade/latest/rchin-poe-trade-1.316.1.exe?label=Downloads&style=social)

# rChin POE Trade
POE 查價工具 (Built with Electron and Vue.)
> 絕大部分的物品皆可搜尋 - 支援台服、國際服（中文化 by poedb）

### 贊助連結 
* 此工具為開源程式，歡迎分享給親朋好友使用，也歡迎贊助一杯咖啡
  * [歐付寶（O'Pay）](https://p.opay.tw/lE5Yu)
  * [Buy me a coffee](https://www.buymeacoffee.com/rChinnn)

### 安裝版本說明
* 點選 [Releases頁面](https://github.com/rChinnnn/rchin-poe-trade/releases)，有兩種版本可以下載
    * `rchin-poe-trade-Setup-1.316.1.exe` 安裝版，若程式偵測到有最新版，會在背景下載新版本並在重開程式時更新
    * `rchin-poe-trade-1.316.1.exe` 可攜版，無法支援自動更新

## 【免責聲明】
* **使用此程式者請自行承擔所有可能後果和風險**
  * 此程式並無修改任何記憶體
  * 運作原理為抓取 POE 遊戲內對物品複製後的文字進行分析，以利快速查價
  * 串接的 API 皆為官方公開資源，請勿於短時間內快速搜尋造成伺服器負擔
  * This product isn't affiliated with or endorsed by Grinding Gear Games and Garena in any way.
 
## 熱鍵功能
| 按鍵 | 功能說明 | 
| --- | --- | 
| F5 | 程式顯示在最上層，並且透明化 (可漂浮在POE程式上) | 
| F6 | 程式取消在最上層，並取消透明化 | 
| PageUp   | 透明化程度 +5% | 
| PageDown | 透明化程度 -5% | 

**熱鍵注意事項：所有熱鍵於 POE 遊戲視窗內皆無作用！必須在工具視窗內才能驅動各功能**

## 使用說明
1. 將程式開啟
2. 點回 Home 頁籤
3. 切換視窗回遊戲中
4. 將滑鼠停在物品上，按下 Ctrl+C 
5. 程式將自動判斷此次搜尋物品

- 各類物品有不同設定，詳見下列狀況
    - [非自動搜尋項目](#非自動搜尋項目)
        - [非傳奇裝備](#非傳奇裝備)
    - [自動搜尋項目](#自動搜尋項目)
        - [傳奇裝備](#傳奇裝備)
        - [地圖](#地圖)
        - [技能](#技能)
        - [其餘項目](#其餘項目)
    - [未支援項目](#未支援項目)

### 非自動搜尋項目

#### 非傳奇裝備
* 預設帶入稀有度：非傳奇
* 預設帶入物品分類
    * 武器可選大類別（Ex: 匕首/單手武器、長杖/雙手武器）
* 預設帶入所有詞綴及數值
    * 欲搜尋的詞綴需自行點選開啟
    * 無隨機數值的詞綴無法輸入最小/最大值
* 勢力裝預設帶入勢力基底
* 物品等級、物品基底、污染為手動選擇項目
* **各選項設定完成後，必須手動按下右下角查詢按鈕**

### 自動搜尋項目

#### 傳奇裝備
* 預設帶入稀有度：傳奇
* 預設帶入物品分類
* 詞綴表格預設不展開，若需篩選特定詞綴可點選物品名稱或"詞綴設定"展開表格
* 支援未鑑定的傳奇裝，但會搜尋到相同基底的其他傳奇
    * 例如：族譜最複雜的皮革腰帶

#### 地圖
* 預設帶入稀有度
    * 傳奇圖：傳奇
    * 其他圖：非傳奇
* 預設帶入地圖基底
* 預設帶入地圖階級
* 預設帶入勢力領域與凋落地區
* 污染為手動選擇項目

#### 技能
* 預設帶入技能品質
* 預設帶入技能基底
* 技能等級、污染為手動選擇項目

#### 其餘項目
* 通貨、卡片、精髓、聖甲蟲、裂片..等其餘物品皆會自動搜尋

### 未支援項目
* 鍊魔器官
* 劫盜契約、藍圖

## 其他功能

### 輿圖區域名稱複製
1. 點選開關展開
2. 選擇想搜尋的輿圖區域（點選即複製）
3. 回到輿圖倉庫頁搜尋欄貼上，可快速搜尋各區地圖
![](https://i.imgur.com/loaymoI.png)

## 遊戲內搜尋截圖
### 傳奇物品
#### 一般物品
![](https://i.imgur.com/KlsWdZl.jpg)
### 三相珠寶
![](https://i.imgur.com/tTW2UUm.jpg)

### 稀有裝備
#### 範例1
![](https://i.imgur.com/bQpIr9H.png)
#### 範例2
![](https://i.imgur.com/BSM3Cu9.jpg)

### 技能寶石
#### 一般
![](https://i.imgur.com/DSdGJwz.png)
#### 瓦爾
![](https://i.imgur.com/DFDmXF6.jpg)

### 地圖
#### 塑者
![](https://i.imgur.com/XWD8aCS.png)
#### 尊師(守衛)
![](https://i.imgur.com/1NrkPjP.png)
