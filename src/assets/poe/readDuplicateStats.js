// 引入 fs 模組
const fs = require('fs');

// 讀取 JSON 檔案
fs.readFile('stats.json', 'utf8', (err, data) => {
  if (err) {
    console.error('讀取檔案時發生錯誤:', err);
    return;
  }

  try {
    // 解析 JSON 資料
    const jsonData = JSON.parse(data);
    // 輸出 entries 的值
    let explicitEntries = jsonData.result.find(item => item.id === 'explicit').entries;
    // 建立一個空的 Map 來儲存 text 和其對應的 id
    let map = new Map();

    let result = [];
    let allIds = [];
    explicitEntries.forEach(item => {
      // 如果 map 中已經有 item.text，則取出其對應的 ids，否則建立一個新的 Set
      let ids = map.get(item.text) || new Set();
      ids.add(item.id);
      map.set(item.text, ids);
      // 如果 ids 的長度大於 1，表示有相同的 text 對應到多個 id
      if (ids.size > 1) {
        result.push({
          ids: Array.from(ids),
          text: item.text,
          count: ids.size
        });
        allIds.push(...Array.from(ids));
      }
    });

    let output = {
      result: result,
      allIds: allIds
    };

    fs.writeFile('duplicateStats.json', JSON.stringify(output, null, 2), (err) => {
      if (err) {
        console.error('寫入檔案時發生錯誤:', err);
        return;
      }
      console.log('已成功寫入 duplicateStats.json');
    });
  } catch (err) {
    console.error('解析 JSON 時發生錯誤:', err);
  }
});
