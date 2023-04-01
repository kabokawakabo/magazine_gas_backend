class MyAPI{
  constructor(sheets){
    this.sheets = sheets;
  }


  /**---------------- magazine一覧 ------------------ */

  /////// get
  magazineFormYear(req_data){
    const { year } = req_data;

    const model = new ModelMagazine(this.sheets);
    const magazines = model.fromYear(year);
    return magazines;
  }

  //////// post
  createMagazine(req_data){
    const model = new ModelMagazine(this.sheets);
    return model.create(req_data);
  }



  /**--------------- story一覧 ---------------- */
  ////// get

  extractCreaterFromText(req_data){
    const { text } = req_data;

    const model = new ModelCreater(this.sheets);
    return model.subMatchText(text);
  }
  extractNotFinishWork(req_data){
    const model = new ModelWork(this.sheets);
    return model.notFinishWork();
  }
  extractStoryFromMagazineId(req_data){
    const { magazine_id } = req_data;

    const model = new ModelStory(this.sheets);
    const stories = model.fromMagazineId(magazine_id);

    const workModel = new ModelWork(this.sheets);
    const work_ids = stories.map(d=> d.work_id);/// work情報も一緒に取り出すことでフロントAPI呼び出しの処理が楽になる
    const works = workModel.fromIds(work_ids);

    return stories
      .map((d, i)=> ({...d, work: works[i]}) );
  }

  getMagazine(req_data){
    const { index } = req_data;

    const model = new ModelMagazine(this.sheets);
    const magazines = model.fromIds([index]);
    return magazines[0];
  }


  ////// post
  updateMagazine(req_data){
    const model = new ModelMagazine(this.sheets);
    return model.update(req_data);
  }

  createCreater(req_data){
    const model = new ModelCreater(this.sheets);
    return model.update(req_data);
  }
  createWork(req_data){
    const { creater_list, ...work_data } = req_data;// {index: creater_id} のリスト

    const model = new ModelWork(this.sheets);
    const work =  model.create(work_data);

    const relationModel = new ModelRelationCreaterWork(this.sheets);
    return creater_list
      .map(d=> relationModel({creater_id: d.index, work_id: work.index}) ); 
  }
  createStory(req_data){
    const model = new ModelStory(this.sheets);
    return model.create(req_data);
  }

  updateWork(req_data){
    const model = new ModelWork(this.sheets);
    return model.update(req_data);
  }
  updateStory(req_data){
    const model = new ModelStory(this.sheets);
    return model.update(req_data);
  }

  patchWork(req_data){
    const model = new ModelWork(this.sheets);
    return model.patch(req_data);
  }
  patchStory(req_data){
    const model = new ModelStory(this.sheets);
    return model.patch(req_data);
  }
  patchStories(req_data){
    const { stories } = req_data;

    const model = new ModelStory(this.sheets);
    const new_stories = stories
      .map(d=> model.patch(d));

    return new_stories;
  }

}

