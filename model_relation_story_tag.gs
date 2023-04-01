class ModelRelationStoryTag{
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /**-------------- 内部使用 ------------*/
  _list2Data(li){
    const [
      story_id,
      tag_id,
    ] = li;

    return ({
      story_id,
      tag_id,
    })
  }
  _data2List(data){
    const {
      story_id, tag_id
    } = data;

    return [story_id, tag_id];
  }

  _getIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list),
    })
  }


  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.relation_story_tag);
  }

  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }





  /**------------- 外部用 ---------------*/
  create(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._getIndexObj(index, data_list);
  }

  update(data) {
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
      .map((d, index)=> this._getIndexObj(index, d));
  }

  fromIds(ids){
    const sheet_values = this._getValues();

    return ids
      .map(index=> this._getIndexObj(index, sheet_values[index]));
  }
  fromStoryIds(story_ids){
    const all_data = this.allData();
    const review_ids_set = new Set(story_ids);

    return all_data
      .filter(d=> review_ids_set.has(d.story_id));
  }


  /**------------- テスト用 --------------*/
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}





/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const RelationStoryTag_TestData = {
  create: {
    story_id: 0,
    tag_id: 0,
  },

  list: [
    {
      story_id: 0,
      tag_id: 0,
    },
    {
      story_id: 1,
      tag_id: 2,
    },
    {
      story_id: 0,
      tag_id: 2,
    }
  ]
}


function test_createModelRelationStoryTag(){
  const model = createTestModel(ModelRelationStoryTag);

  const test1 = RelationStoryTag_TestData.create;
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();
  console.log(result1, pop_result1);
}


function test_updateModelRelationStoryTag(){
  const model = createTestModel(ModelRelationStoryTag);

  const create_data = RelationStoryTag_TestData.list
    .map(d=> model.create(d));

  const test1_new = ({
    index: create_data[1].index,
    story_id: 0,
    tag_id: 2,
  });
  const result1 = model.update(test1_new);
  const pop_result1 = create_data.map(_=> model.popLastData());

  console.log(result1, pop_result1);
}


function test_fromIdsModelRelationStoryTag(){
  const model = createTestModel(ModelRelationStoryTag);
  const create_data = RelationStoryTag_TestData.list
    .map(d=> model.create(d));

  const ids = create_data
    .map(d=> d.index)
    .filter((_, i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData());
}


function test_fromReviewIdsModelRelationStoryTag(){
  const model = createTestModel(ModelRelationStoryTag);
  const create_data = RelationStoryTag_TestData.list
    .map(d=> model.create(d));

  const test1_story_ids = [0, 1];
  const result1 = model.fromStoryIds(test1_story_ids);
  console.log(test1_story_ids, result1);

  const test2_story_ids = [1];
  const result2 = model.fromStoryIds(test2_story_ids);
  console.log(test2_story_ids, result2);

  create_data.map(_=> model.popLastData());
}

