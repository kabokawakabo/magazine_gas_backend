class ModelTag {
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /**--------- 内部使用 ------------- **/
  _list2Data(li){
    const [
      name
    ] = li;

    return ({
      name
    })
  }
  _data2List(data){
    const {
      name
    } = data;

    return [name];
  }

  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list),
    });
  }


  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.tag);
  }
  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }


  /**------------------ 外部用 ------------------ */
  create(data){
    const sheet = this._getSheet()
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._createIndexObj(index, data_list);
  }
  /*
  update(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);
    const { index } = data;

    this.ModelInterface.update(sheet, data_list);
    return data;
  }*/


  allData(){
    const sheet_values = this._getValues();

    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  fromIds(ids){
    const sheet_values = this._getValues();

    return ids
      .map(index=> this._createIndexObj(index, sheet_values[index]) );
  }


  /**------------------ テスト用 ------------------- */
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}




/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const Tag_TestData = {
  list: [
    {
      name: "笑"
    },
    {
      name: "作画"
    },
    {
      name: "構図"
    }
  ]
}


function test_createModelTag(){
  const model = createTestModel(ModelTag);

  const test1 = ({
    name: "笑"
  });
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();

  console.log(result1, pop_result1);
}


function test_fromIdsModelTag(){
  const model = createTestModel(ModelTag);
  const create_data = Tag_TestData.list
    .map(d=> model.create(d));


  const ids = create_data
    .map(d=> d.index)
    .filter((_, i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData() );
}


