// 使わないけどsheet順番の変更が面倒なのでそのままにする
class ModelReview {
  constructor(sheets){
    this.sheets = sheets;
    this.ModelInterface = ModelInterface;
    this.GooAPI = GooAPI
  }

  /**-------------- 内部使用 --------------------- */
  _list2Data(li){
    const [
      review,
      hira_review,
      kana_review,
    ] = li;

    return ({
      review,
      hira_review,
      kana_review,
    })
  }
  _data2List(data){
    const {
      review, hira_review, kana_review
    } = data;

    return [review, hira_review, kana_review];
  }

  _createIndexObj(index, data_list){
    return ({
      index,
      ...this._list2Data(data_list),
    });
  }

  
  _isSubMatch(review_obj, text){
    return review_obj.review.indexOf(text) !== -1 
      || review_obj.hira_review.indexOf(text) !== -1
      || review_obj.kana_review.indexOf(text) !== -1
  }
  _isAllMatch(review_obj, text){
    return review_obj.review === text
      || review_obj.hira_review === text
      || review_obj.kana_review === text
  }

  
  _getSheet(){
    return selectSheetFromType(this.sheets, SHEET_TYPE.review);
  }
  _getValues(){
    const sheet = this._getSheet();
    return this.ModelInterface.getValues(sheet);
  }

  _fetchHiraKana(review){
    const hira_review = this.GooAPI.fetchText2Hira(review);
    const kana_review = this.GooAPI.hira2Kana(hira_review);

    return [hira_review, kana_review];
  }


  _create(data){
    const sheet = this._getSheet();
    const data_list = this._data2List(data);

    const index = this.ModelInterface.create(sheet, data_list);
    return this._createIndexObj(index, data_list)
  }


  /**-------------- 外部用 ------------------------ */
  create(review){
    /// GooAPIと連携して保存する部分を分離
    const [hira_review, kana_review] = this._fetchHiraKana(review);
    const data = ({review, hira_review, kana_review});
    return this._create(data);
  }
  

  allData(){
    const sheet_values = this._getValues();
    return sheet_values
      .map((d, index)=> this._createIndexObj(index, d) );
  }
  subMatchText(text){
    const all_data = this.allData();
    return all_data
      .filter(d=> this._isSubMatch(d, text) );
  }
  allMatchText(text){
    const all_data = this.allData();
    return all_data
      .filter(d=> this._isAllMatch(d, text) );
  }
  fromIds(ids){
    const sheet_values = this._getValues();
    return ids
      .map(index=> this._createIndexObj(index, sheet_values[index]) );
  }


  /**-------------- テスト用 ---------------------- */
  popLastData(){
    const sheet = this._getSheet();
    return this.ModelInterface.popLastData(sheet);
  }
}





/** ーーーー〜〜ー　テスト　ーーーーー〜〜ー */
const Review_TestData = {
  list: [
    {
      review: "(好きな)先輩にもブタれたことないのに...は笑う",
      hira_review: "(すきな)せんぱいにもぶたれたことないのに...はわらう",
      kana_review: "(スキナ)センパイニモブタレタコトナイノニ...ハワラウ",
    },
    {
      review: "すき家",
      hira_review: "すきや",
      kana_review: "スキヤ",
    },
    {
      review: "海苔巻き",
      hira_review: "のりまき",
      kana_review: "ノリマキ",
    }
  ]
}

function test_createModelReviewWithGooAPI(){
  const model = createTestModel(ModelReview);

  const test1 = "(好きな)先輩にもブタれたことないのに...は笑う"
  const result1 = model.create(test1);
  const pop_data = model.popLastData();

  console.log(test1, result1);
}


function test_createModelReview(){
  const model = createTestModel(ModelReview);

  const test1 = Review_TestData.list[0];
  const result1 = model._create(test1);
  const pop_result1 = model.popLastData();
  console.log(result1, pop_result1);
}


function test_matchTextModelReviewInside(){
  const model = createTestModel(ModelReview);
  const data = Review_TestData.list[0];

  const test1 = "すき";
  const sub_result1 = model._isSubMatch(data, test1);
  const all_result1 = model._isAllMatch(data, test1);
  console.log(sub_result1, all_result1);

  const test2 = data.review;
  const all_result2 = model._isAllMatch(data, test2);
  console.log(all_result2);
}

function text_matchTextModelReview(){
  const model = createTestModel(ModelReview);
  const create_data = Review_TestData.list
    .map(d=> model._create(d) );


  const seed_text1 = "すき";
  const sub_result1 = model.subMatchText(seed_text1);
  const all_result1 = model.allMatchText(seed_text1);
  console.log(seed_text1, sub_result1, all_result1);
  
  const seed_text2 = "スキヤ";
  const sub_result2 = model.subMatchText(seed_text1);
  const all_result2 = model.allMatchText(seed_text2);
  console.log(seed_text2, sub_result2, all_result2);

  create_data.map(_=> model.popLastData());
}


function test_fromIdsModelReview(){
  const model = createTestModel(ModelReview);
  const create_data = Review_TestData.list
    .map(d=> model._create(d));

  const ids = create_data
    .map(d=> d.index)
    .filter((_,i)=> i !== 1);
  const result1 = model.fromIds(ids);
  console.log(ids, result1);

  create_data.map(_=> model.popLastData());
}