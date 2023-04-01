class ModelStory{
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /** ------------------- 内部使用 ------------------ */
  _list2Data(li){
    const [
      work_id, magazine_id, color_bool, order, read_order,
      eval_interesting,
      review,
    ] = li;

    return ({
      work_id, magazine_id, color_bool, order, read_order,
      eval_interesting,
      review,
    })
  }
  _data2List(data){
    const {
      work_id, magazine_id, color_bool, order, read_order,
      eval_interesting,
      review,
    } = data;

    return [work_id, magazine_id, color_bool, order, read_order,
      eval_interesting,
      review,
    ];
  }


  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list)
    });
  }

  _isSameMagazine(index_obj, magazine_id){
    // 念の為 Number化(空文字の時は 0に変換されるバグになる？)
    return Number(index_obj.magazine_id) === Number(magazine_id);
  }


  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.story);
  }
  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }


  /** ------------------- 外部用 -------------------- */
  create(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._createIndexObj(index, data_list);
  }
  update(data){
    const sheet = this._getSheet()
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
    return this._createIndexObj(index, data_list);
  }


  allData(){
    const sheet_values = this._getValues();
    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  fromMagazineId(magazine_id){
    const all_data = this.allData();
    return all_data
      .filter(d=> this._isSameMagazine(d, magazine_id) );
  }

  fromIds(ids){
    const sheet_values = this._getValues();
    return ids
      .map(index=> this._createIndexObj(index, sheet_values[index]) );
  }


  /** ------------------- テスト用 ------------------- */
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}





/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const Story_TestData = {
  list: [
    {
      work_id: 1,
      magazine_id: 2, 
      color_bool: false,
      order: 2,
    },
    {
      work_id: 1,
      magazine_id: 3, 
      color_bool: false,
      order: 5,
    },
    {
      work_id: 2,
      magazine_id: 3,
      color_bool: true,
      order: 1
    },
  ]
}


function test_createModelStory(){
  const model = createTestModel(ModelStory);

  const test1 = ({
    work_id: 1,
    magazine_id: 2, 
    color_bool: false,
    order: 2,
  });
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();

  console.log(result1, pop_result1);
}


function test_updateModelStory(){
  const model = createTestModel(ModelStory);
  const create_data = Story_TestData.list
    .map(d=> model.create(d) );

  const test1 = ({
    index: create_data[1].index,
    work_id: 2,
    magazine_id: 3,
    color_bool: true,
    order: 1
  });
  const result1 = model.update(test1);
  const pop_result1 = create_data.map(_=> model.popLastData() );

  console.log(result1, pop_result1);
}


function test_loadFromMagazineIdModelStory(){
  const model = createTestModel(ModelStory);
  const create_data = Story_TestData.list
    .map(d=> model.create(d) );

  
  const test1_id = 3;
  const result1 = model.fromMagazineId(test1_id);
  console.log(test1_id, result1);

  create_data.map(_=> model.popLastData() );
}

function test_fromIdsModelStory(){
  const model = createTestModel(ModelStory);
  const create_data = Story_TestData.list
    .map(d=> model.create(d) );


  const test1_ids = create_data
    .map(d=> d.index)
    .filter((_, i)=> i !== 1);
  const result1 = model.fromIds(test1_ids);
  console.log(test1_ids, result1);

  create_data.map(_=> model.popLastData() );
}
