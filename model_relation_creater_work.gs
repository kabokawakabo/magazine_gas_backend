class ModelRelationCreaterWork{
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /**--------------- 内部使用 ---------------*/
  _list2Data(li){
    const [
      creater_id,
      work_id
    ] = li;

      return ({
        creater_id,
        work_id
      })
  }
  _data2List(data){
    const {
      creater_id, work_id
    } = data;

    return [creater_id, work_id];
  }

  _getIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list),
    })
  }

  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.relation_creater_work);
  }
  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }


  /**--------------- 外部用 -----------------*/
  create(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._getIndexObj(index, data_list);
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
    return this._getIndexObj(index, modified_list);
  }


  allData(){
    const sheet_values = this._getValues();

    return sheet_values
      .map((d, index)=> this._getIndexObj(index, d) );
  }

  fromIds(ids){
    const sheet_values = this._getValues();

    return ids
      .map(index=> this._getIndexObj(index, sheet_values[index]) );
  }

  fromWorkIds(work_ids){
    const all_data = this.allData();
    const work_ids_set = new Set(work_ids);

    return all_data
      .filter(d=> work_ids_set.has(d.work_id));
  }



  /**--------------- テスト用 ----------------*/
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }

}






/**ーーーー〜〜ー　テスト　ーーーーー〜〜ー */

const RelationCreaterWork_TestData = {
  list: [
    {
      creater_id: 0,
      work_id: 0,
    },
    {
      creater_id: 3,
      work_id: 0
    },
    {
      creater_id: 0,
      work_id: 1,
    }
  ]
}


function test_createModelRelationCreaterWork(){
  const model = createTestModel(ModelRelationCreaterWork);

  const test1 = RelationCreaterWork_TestData.list[0];
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();

  console.log(result1, pop_result1);
}


function test_updateModelRelationCreaterWork(){
  const model = createTestModel(ModelRelationCreaterWork)
  const create_data = RelationCreaterWork_TestData.list
    .map(d=> model.create(d));

  const test1 = ({
    ...create_data[1],
    creater_id: 1,
  });
  const result1 = model.update(test1);
  const pop_result1 = create_data.map(_=> model.popLastData());

  console.log(result1, pop_result1);
}


function test_fromIdsModelRelationCreaterWork(){
  const model = createTestModel(ModelRelationCreaterWork);
  const create_data = RelationCreaterWork_TestData.list
    .map(d=> model.create(d));

  const ids = create_data
    .map(d=> d.index)
    .filter((_,i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData());
}


function test_fromWorkIdsModelRelationCreaterWork(){
  const model = createTestModel(ModelRelationCreaterWork);
  const create_data = RelationCreaterWork_TestData.list
    .map(d=> model.create(d));


  const work_ids1 = [0, 1];
  const result1 = model.fromWorkIds(work_ids1);
  console.log(work_ids1, result1);

  const work_ids2 = [1];
  const result2 = model.fromWorkIds(work_ids2);
  console.log(work_ids2, result2);

  create_data.map(_=> model.popLastData());
}

