
const GooAPI = {
  HIRA_URL: "https://labs.goo.ne.jp/api/hiragana",
  APP_ID: ScriptProperties.getProperty(PROPATY_KEY.GOO_APP_ID),

  _getPayload(text){
    return JSON.stringify({
      app_id: this.APP_ID,
      sentence: text,
      output_type: "hiragana",
    });
  },
  _getOptions(payload){
    return ({
      "method" : "post",
      "contentType" : "application/json",
      "payload" : payload
    });
  },
  _convertRes2HiraText(res){
    const res_json = JSON.parse(res);
    const converted = res_json.converted;
    //console.log(res_json);

    return converted
      .split(" ").join("");// 形態素で空白分けをするので取り除く
  },
  fetchText2Hira(text) {
    const payload = this._getPayload(text);
    const options = this._getOptions(payload);
    
    const res = UrlFetchApp.fetch(this.HIRA_URL, options).getContentText('UTF-8');
    if(res.getResponseCode < 200 || res.getResponseCode >= 300) {
      //throw Error(`GooAPIエラー: ${res}`);///throwすると保存できないのでしない
      console.error(res);
      return undefined;
    }
    
    return this._convertRes2HiraText(res);
  },

  hira2Kana(hira){
    return hira
      .split("")// 文字ごとにlist変換
      .map(d=>{
        const code = d.charCodeAt(0);
        // 小文字あ ~ ん までの場合カタカナに（記号を変えないように）
        if(12353 <= code && code <= 12435) return code + 0x60;
        
        return code;
      })
      .map(d=> String.fromCharCode(d))/// 文字コードを文字に
      .join("");
  }
}



/** ---------- テスト ---------- */
function test_text2Hira() {
  const data = GooAPI.fetchText2Hira("今日にノン");
  console.log(data);
}

const test_hira2Kana = ()=>{
  const test1 = "こんにちは！";
  const result1 = GooAPI.hira2Kana(test1);
  console.log(test1, result1);

  const test2 = "あ、んぱんくぅ＠";
  const result2 = GooAPI.hira2Kana(test2);
  console.log(test2, result2);
}