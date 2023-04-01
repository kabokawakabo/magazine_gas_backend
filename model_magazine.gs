class ModelMagazine{
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface; 
  }


  /**----------------- 内部使用 ----------------------- */
  _list2Data(li){
    const [
      year,
      issue,/// 数字 or 文字列(5・6 ...の合併など)
      supplement,
      image_url
    ] = li;

    return ({
      year,
      issue,
      supplement,
      image_url
    });
  }
  _data2List(data){
    const {
      year, issue, supplement_text, image_url
    } = data;

    return [year, issue, supplement_text, image_url];
  }

  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list),
    });
  }

  _isSameYear(index_obj, year){
    // 念の為numberにする
    return index_obj.year === year || Number(index_obj.year) === Number(year);
  }


  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.magazine);
  }
  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }





  /**----------------- 外部用 ------------------------- */
  create(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._createIndexObj(index, data_list);
  }
  update(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);
    const { index } = data;

    this.ModelInterface.update(sheet, index, data_list);
    return data;
  }
  patch(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);
    const { index } = data;

    const modified_list = this.ModelInterface.patch(sheet, index, data_list);
    return this._createIndexObj(index, modified_list);
  }


  allData(){
    const sheet_values = this._getValues();
    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  fromYear(year){
    const all_data = this.allData();

    // yearがundefinedの場合、全部取り出す(データ数が少ない時フロントで操作した方が楽？... yearデータ一覧を取り出す面倒さなどが解消)
    if(year === undefined) return all_data

    return all_data
      .filter(d=> this._isSameYear(d, year));
  }

  fromIds(ids){
    const sheet_values = this._getValues();
    return ids
      .map(index=> this._createIndexObj(index, sheet_values[index]) );
  }


  /**----------------- テスト用 ------------------------ */
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}




/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const Magazine_TestData = {
  list: [
    {
      year: 2000,
      issue: "3",
      supplement_text: "週ちゃんは三つ編み特集"
    },
    {
      year: 2000,
      issue: "3・4",
      supplement_text: ""
    },
    {
      year: 2001,
      issue: "3・4",
      supplement_text: "ボドゲあり。週ちゃんねたハガキ"
    }
  ]
}


function test_createModelMagazine(){
  const model = createTestModel(ModelMagazine);
  
  const test1 = ({
    year: 2000,
    issue: 3,
    supplement_text: "週ちゃんは三つ編み特集"
  });
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();
  console.log(result1, pop_result1);
}

function test_updateModelMagazine(){
  const model = createTestModel(ModelMagazine);
  const create_data = Magazine_TestData.list
    .map(d=> model.create(d) );

  
  const test1 = ({
    index: create_data[0].index,
    year: 2001,
    issue: "3・4",
    supplement_text: "ボドゲあり。週ちゃんねたハガキ"
  })
  const result1_update = model.update(test1);
  const pop_result1 = create_data.map(_=> model.popLastData());
  
  console.log(result1_update, pop_result1);
}


function test_fromYearModelMagazine(){
  const model = createTestModel(ModelMagazine);
  const create_data = Magazine_TestData.list
    .map(d=> model.create(d) );

  const test1_year = 2000;
  const result1 = model.fromYear(test1_year);
  const pop_result1 = create_data.map(_=> model.popLastData() );

  console.log(result1, pop_result1);
}


function test_fromIdsModelMagazine(){
  const model = createTestModel(ModelMagazine);
  const create_data = Magazine_TestData.list
    .map(d=> model.create(d) );
  
  const test1_ids = create_data
    .map(d=> d.index)
    .filter((_, i)=> i !== 1);
  const result1 = model.fromIds(test1_ids);
  console.log(test1_ids, result1);

  create_data.map(_=> model.popLastData() );
}
