

function returnJson (json_data) {
  const text = JSON.stringify(json_data);
  return ContentService.createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function errorStatusOutput (message){
  const content = JSON.stringify({
    statusCode: 401,
    message
  });
  return ContentService.setMimeType(ContentService.MimeType.JSON)
    .setContent(content);
}




function doPost(e) {
  const sheets = loadSheets();
  const req_data = JSON.parse(e.postData.getDataAsString());

  //const path = e.pathInfo;// postだとredirectしてgetが入るので上手く動作しない？
  const path = e.parameter.path;
  const myAPI = new MyAPI(sheets);
  try{
    /**----------------- magazine一覧ページ ----------------- */
    if(path === "magazineFromYear"){
      const magazines = myAPI.magazineFormYear(req_data);
      return returnJson(magazines);
    }
    if(path === "createMagazine"){
      const magazine = myAPI.createMagazine(req_data);
      return returnJson(magazine);
    }


    /** ---------------- story一覧ページ    -------------- */

    ///// get
    if(path === "extractCreaterFromText"){
      const creaters = myAPI.extractCreaterFromText(req_data);
      return returnJson(creaters);
    }
    if(path === "extractNotFinishWork"){
      const works = myAPI.extractNotFinishWork(req_data);
      return returnJson(works);
    }
    if(path === "extractStoryFromMagazineId"){
      const stories = myAPI.extractStoryFromMagazineId(req_data);
      return returnJson(stories); 
    }
    if(path === "getMagazine"){
      const magazine = myAPI.getMagazine(req_data);
      return returnJson(magazine);
    }


    ///// post
    if(path === "updateMagazine"){
      const magazine = myAPI.updateMagazine(req_data);
      return returnJson(magazine);
    }

    if(path === "createCreater"){
      const creater = myAPI.createCreater(req_data);
      return returnJson(creater);
    }
    if(path === "createWork"){
      const work = myAPI.createWork(req_data);
      return returnJson(work);
    }
    if(path === "createStory"){
      const story = myAPI.createStory(req_data);
      return returnJson(story);
    }
    if(path === "updateWork"){
      // (patchだとindexがずれた時にタイトルから正誤比較などができない欠点あり)
      // 完結かの変更送信する？
      const work = myAPI.updateWork(req_data);
      return returnJson(work);
    }
    if(path === "updateStory"){
      // 雑誌の連載順を変更？
      const work = myAPI.updateStory(req_data);
      return returnJson(work);
    }
    // patchの欠点：TSの場合、別個にType宣言しないと曖昧さが生まれそう（）
    if(path === "patchWork"){
      // 完結かの変更送信する？
      const work = myAPI.patchWork(req_data);
      return returnJson(work);
    }
    if(path === "patchStory"){
      // カラーかの情報更新
      const work = myAPI.patchStory(req_data);
      return returnJson(work);
    }
    if(path === "patchStories"){
      /// 連載順を変更する際、swapするので二つのデータが送信される
      const stories = myAPI.patchStories(req_data);
      return returnJson(stories);
    }



    return errorStatusOutput(`該当するパスは存在しない： ${path}`)
  } catch(error){
    console.error(error);
    return returnJson({message: error.message});
  }
}
