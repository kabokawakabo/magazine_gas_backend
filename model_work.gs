class ModelWork{
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
  }


  /**----------------- 内部使用 ---------------------- */
  _list2Data(li){
    const [
      title, start_magazine_id, end_magazine_id, is_short, image_url,
      eval_world, eval_character, eval_komawari
    ] = li;

    return ({
      title, start_magazine_id, end_magazine_id, is_short, image_url,
      eval_world, eval_character, eval_komawari
    })
  }
  _data2List(data){
    const {
      title, start_magazine_id, end_magazine_id, is_short, image_url,
      eval_world, eval_character, eval_komawari
    } = data;

    return [title, start_magazine_id, end_magazine_id, is_short, image_url,
      eval_world, eval_character, eval_komawari
    ];
  }

  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list)
    });
  }

  _isNotFinish(index_obj){
    return index_obj.end_magazine_id === ""
      || index_obj.end_magazine_id === undefined;
  }

  
  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.work);
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
    /// 最終話かのみ追加や、読み切りか...を変更であっても全てのデータを送信して更新
    /// 注意: indexがこれまで作られてない場所より上であっても書き込み（create風）できる
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

    const modifiled_list = this.ModelInterface.patch(sheet, index, data_list);
    return this._createIndexObj(index, modifiled_list);
  }


  allData(){
    const sheet_values = this._getValues();
    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  notFinishWork(){
    /// 号の作品を選択する用（一つ前までで終了してない作品のみを取り出す方が効率的だと思うので
    const all_data = this.allData();
    return all_data
      .filter(d=> this._isNotFinish(d));/// undefinedの場合空文字になるらしい
  }

  fromIds(ids){
    const sheet_values = this._getValues();
    return ids
      .map(index=> this._createIndexObj(index, sheet_values[index]) );
  }


  /**----------------- テスト用 ----------------------- */
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}





/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const Work_TestData = {
  list: [
    {
      title: "山田くんと",
      start_magazine_id: 1,
      end_magazine_id: undefined,
      is_short: false,
    },
    {
      title: "僕は",
      start_magazine_id: 1,
      end_magazine_id: undefined,
      is_short: true,/// 実際には、trueなら　end_magazine_idがstartと同じになって欲しいところ
    },
    {
      title: "ペーぺー物語",
      start_magazine_id: 1,
      end_magazine_id: 10,
      is_short: false,
    }
  ]
}


function test_createModelWork(){
  const model = createTestModel(ModelWork);

  const test1 = ({
    title: "山田くんと",
    start_magazine_id: 1,
    end_magazine_id: undefined,
    is_short: false,
  });
  const result1 = model.create(test1);
  const pop_result1 = model.popLastData();
  console.log(test1, result1, pop_result1);
}

function test_updateModelWork(){
  const model = createTestModel(ModelWork);
  const create_data = Work_TestData.list
    .map(d=> model.create(d) );

  const test1 = ({
    index: create_data[1].index,
    title: undefined,
    start_magazine_id: 10,
    end_magazine_id: 1,
    is_short: true,
  });
  const result1 = model.update(test1);

  const pop_data = create_data.map(_=> model.popLastData() );
  console.log(test1, create_data, pop_data);
}

function test_patchModelWork(){
  const model = createTestModel(ModelWork);
  const create_data = Work_TestData.list
    .map(d=> model.create(d) );

  const test1 = ({
    index: create_data[1].index,
    end_magazine_id: 1,
    is_short: true,
  });
  const result1 = model.patch(test1);
  const pop_data = create_data.map(_=> model.popLastData() );

  console.log(result1, create_data, pop_data);
}


function test_notFinishModelWork(){
  const model = createTestModel(ModelWork);
  const create_data = Work_TestData.list
    .map(d=> model.create(d) );

  const result1 = model.notFinishWork();
  create_data.map(_=> model.popLastData() );

  console.log(result1);
}


function test_fromIdsModelWork(){
  const model = createTestModel(ModelWork);
  const create_data = Work_TestData.list
    .map(d=> model.create(d) );

  
  const ids = create_data
    .map(d=> d.index)
    .filter((_,i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData() );
}