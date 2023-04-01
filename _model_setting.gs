const PROPATY_KEY = {
  SHEET_ID: "SHEET_ID",
  GOO_APP_ID: "GOO_APP_ID",
}



const SHEET_TYPE = {
  creater: "creater",
  work: "work",
  magazine: "magazine",//雑誌号
  story: "story",// 雑誌号と作品をつなげる + センターカラー、連載順を記録
  tag: "tag",// レビューにタグ付け（ワクワク、笑い、絵、...などグループ分け）

  relation_creater_work: "relation_creater_work",
  relation_story_tag: "relation_story_tag",
};


function loadSheets() {
  const sheet_id = ScriptProperties.getProperty(PROPATY_KEY.SHEET_ID);
  const spreadSheet = SpreadsheetApp.openById(sheet_id);

  return spreadSheet.getSheets(); 
}

function selectSheetFromType(sheets, type) {
  if(type === SHEET_TYPE.creater) return sheets[0];
  if(type === SHEET_TYPE.work) return sheets[1];
  if(type === SHEET_TYPE.magazine) return sheets[2];
  if(type === SHEET_TYPE.story) return sheets[3];
  if(type === SHEET_TYPE.tag) return sheets[4];

  if(type === SHEET_TYPE.relation_creater_work) return sheets[5];
  if(type === SHEET_TYPE.relation_story_tag) return sheets[6];

  throw ReferenceError("該当するsheet typeはありません");
}



const ModelInterface = {
  _getOneRowRange(sheet, index, data_list){
    return sheet.getRange(index +2, 1, 1, data_list.length)// headerを除いたindexの列のみを取りだす(headerのインデックスも1から始まるので2) & col数も指定しないと怒られる
  },

  /**------------------- 外部使用 ----------------------*/
  getValues(sheet) {
    const range = sheet.getDataRange();// getRangeだと、行名指定なしでは一つしか取れない
    const values = range.getValues();
    return values.filter((_,i)=> i!==0);///header削除
  },
  create(sheet, data_list){
    const before_values = this.getValues(sheet);
    const len = before_values.length;

    sheet.appendRow(data_list);

    return len;//indexを返す
  },
  update(sheet, index, data_list) {
    const range = this._getOneRowRange(sheet, index, data_list);
    range.setValues([data_list]);

    return data_list;
  },
  patch(sheet, index, data_list){
    const range = this._getOneRowRange(sheet, index, data_list);

    const values = range.getValues();
    const modified_list = values[0]
      .map((d, i)=>{
        const new_d = data_list[i];
        return new_d !== undefined ? new_d : d;
      });

    range.setValues([modified_list]);
    
    return modified_list; 
  },


  /**--------------------- testデータ確認用 -------------------------*/
  popLastData(sheet) {
    const range = sheet.getDataRange();
    const values = range.getValues();

    sheet.deleteRow(values.length);// lengthは一つデータがあると 1なので indexが1からと相性がいい
    return values[values.length-1];
  },

}



/** ------------- test用　----------------------- */
function createTestModel(Model){
  const sheets = loadSheets();
  return new Model(sheets);
}

