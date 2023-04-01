class ModelCreater {
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /**----------------- 内部利用 ----------------------- */
  _list2Data(li){
    const [ name ] = li;
    return ({
      name,
    })
  }
  _data2List(data){
    const { name } = data;
    return [name, ];
  }

  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list)
    });
  }

  _isSubMatchTextName(index_obj, text){
    return index_obj.name.indexOf(text) !== -1;
  }


  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.creater);
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
  

  allData(){
    const sheet_values = this._getValues();
    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  subMatchText(text){
    const all_data = this.allData();
    return all_data
      .filter(d=> this._isSubMatchTextName(d, text) );
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





/**　ーーー   test   ーーーーー */
const Create_TestModel = {
  list: [
    {name: "尾田"},
    {name: "タイザン"},
    {name: "芥"},
    //{name: "西尾"},
    //{name: "香川"},
    //{name: "魔修羅側"},
  ]
}


function test_createModelCreater() {
  const model = createTestModel(ModelCreater);

  const test1 = {name: "尾田"};
  const return_data = model.create(test1);
  const result1 = model.popLastData();

  console.log(return_data, test1, result1);
}


function test_allModelCreater(){
  const model = createTestModel(ModelCreater);
  const create_data = Create_TestModel.list
    .map(d=> model.create(d) );

  const result1 = model.allData();
  const result1_pop = create_data.map(_ => model.popLastData() );

  console.log(result1, result1_pop);
}

function test_fromIdsModelCreater(){
  const model = createTestModel(ModelCreater);
  const create_data = Create_TestModel.list
    .map(d=> model.create(d) );

  const ids = create_data
    .map(d=> d.index)
    .filter((_,i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData() );
}
