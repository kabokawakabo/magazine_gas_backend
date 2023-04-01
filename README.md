# magazine_gas_backend
magazineデータ記録用のGASを利用したバックエンド
　　
　　
  
## スクリプトについて

- *_model_setting* （雑多な機能群
  - propertyの管理
  - Google sheets を操作(データ追加、取り出し、sheet選択)する関数群
- *my_api*
  -  REST API風操作（reqestに対し処理分岐、response）
    - 処理は requestの URL `?path= ~~` の値で区別
- *controller*
  - my_apiのpath毎に実際の処理を記述
- *model_~~*
  - Google Sheetsの各シートの内容・処理の定義
