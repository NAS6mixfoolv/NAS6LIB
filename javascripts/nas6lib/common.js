//2015

//add class 2021

//add ManagedClass 2025


/**
 * MyManagedClassの結果はオブジェクトとして返されるが、配列型が必要な場合はtoArrayIfIndexedを使用。
 * 例: const items = toArrayIfIndexed(instance.property.profile.items, true);
 */
/**
 * MyManagedClassは配列をオブジェクトとして処理します。
 * 配列型が必要な場合、toArrayIfIndexedを使用して変換してください。
 * 例:
 * const instance = new MyManagedClass({ items: [{ id: 1 }, { id: 2 }] });
 * const itemsArray = toArrayIfIndexed(instance.property.items, true); // [{ id: 1 }, { id: 2 }]
// 配列プロパティの取得
const instance = new MyManagedClass({ profile: { items: [{ id: 1 }, { id: 2 }] } });
const items = toArrayIfIndexed(instance.property.profile.items, true);
items.forEach(item => console.log(item.id)); // 1, 2

// トップレベルが配列
const arrayInstance = new MyManagedClass([{ id: 1 }, { id: 2 }]);
const array = toArrayIfIndexed(arrayInstance.property, true);
console.log(array); // [{ id: 1 }, { id: 2 }] */
/**
 * 数字文字列のキーを持つオブジェクトを配列に整形する
 * @param {Object} obj - 変換対象のオブジェクト
 * @param {boolean} [force=false] - キーが数字文字列でない場合も強制的に配列に変換
 * @param {String} [sparseHandling = 'keep'] - 空白配列のコンパクト化の選択
 * @returns {Array|Object} 配列（変換可能な場合）または元のオブジェクト
 */
function toArrayIfIndexed(obj, force = false, sparseHandling = 'keep') {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const keys = Object.keys(obj);
  const isIndexed = keys.every((key, i) => String(i) === key);
  if (!isIndexed && !force && process.env.NODE_ENV !== 'production') {
    console.warn('Non-sequential keys detected; consider using force=true or sparseHandling="compact"');
  }
  const maxIndex = keys.length > 0 ? Math.max(...keys.map(Number)) + 1 : 0;
  const result = new Array(maxIndex);
  for (const key of keys) {
    result[Number(key)] = obj[key];
  }
  if (sparseHandling === 'compact') {
    return result.filter(x => x !== undefined);
  }
  return result;
}

// フォールバック用の簡易クローン関数
function fallbackClone(item, seen = new WeakSet()) {
  if (item === null || typeof item !== 'object') return item;
  if (seen.has(item)) {
    throw new Error('Circular reference detected in fallbackClone');
  }
  seen.add(item);
  if (typeof item.clone === 'function') {
    return item.clone();
  }
  if (Array.isArray(item)) return item.map(item => fallbackClone(item, seen));
  if (item instanceof Date) return new Date(item);
  if (item instanceof Map) return new Map(fallbackClone([...item], seen));
  if (item instanceof Set) return new Set(fallbackClone([...item], seen));
  if (item instanceof RegExp) return new RegExp(item);
  const cloned = {};
  for (const key in item) {
    cloned[key] = fallbackClone(item[key], seen);
  }
  return cloned;
}

// 安全なstructuredCloneラッパー
function safeStructuredClone(item) {
  try {
    return structuredClone(item);
  } catch (e) {
    return fallbackClone(item);
  }
}

function recursiveClone(item, seen = new WeakSet()) {
  // 循環参照のチェック
  if (item && typeof item === 'object' && seen.has(item)) {
    throw new Error('Circular reference detected');
  }
  if (item && typeof item === 'object') {
    seen.add(item);
  }

  // 1. clone() メソッドを持つ場合
  if (item && typeof item.clone === 'function') {
    return item.clone();
  }

  // 2. 配列の場合
  if (Array.isArray(item)) {
    return item.map(element => recursiveClone(element, seen));
  }

  // 3. プレーンなオブジェクトの場合
  if (item && typeof item === 'object' && item.constructor === Object) {
    const clonedObject = {};
    for (const key in item) {
      clonedObject[key] = recursiveClone(item[key], seen);
    }
    return clonedObject;
  }

  // 4. その他（プリミティブ値など）
  return safeStructuredClone(item);
}

function simpleDeepMerge(target, source, seen = new WeakSet(), deep = true) {
    if (!deep) {
        return Object.assign({}, target, source);
    }    
    // ターゲットが有効なオブジェクトであることを確認
    // ターゲットがオブジェクトでなければ、ソースをディープコピーして返す（上書き）
    if (target === null || typeof target !== 'object') {
        // ターゲットが無効な場合、処理を継続する意味がないので、ソースをそのまま返すか、safeStructuredCloneを使う
        return safeStructuredClone(source); 
    }
    
    // ソースが有効なオブジェクトであることを確認
    if (source === null || typeof source !== 'object') {
        return target; // マージするものがないため、ターゲットをそのまま返す
    }
    
    // 1. 循環参照チェックと登録
    // この層での処理が確定したら登録
    if (seen.has(target) || seen.has(source)) {
        throw new Error('Circular reference detected');
    }
    seen.add(target);
    seen.add(source);

    // 配列をオブジェクトに変換するヘルパー関数
    const arrayToObject = arr => ({ ...arr });


    if (Array.isArray(target) && process.env.NODE_ENV !== 'production') {
      console.warn('Target array converted to object in simpleDeepMerge. Use toArrayIfIndexed to convert back.');
    }


    // 配列処理の統一: 配列はすべてインデックス付きのプレーンなオブジェクトとして扱う
    if (Array.isArray(target)) {
        // targetはマージのターゲットであり、型を維持するため、新しいオブジェクトに変換
        // 既存の target の内容を維持しつつ、オブジェクトとしてマージするために、新しいオブジェクトを作る
        target = Object.assign({}, target); 
    }
    if (Array.isArray(source)) {
        source = arrayToObject(source);
    }
    
    // 2. マージロジック
    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];

        // ターゲットの値がオブジェクトで、ソースの値もオブジェクトの場合にのみ再帰する
        if (sourceValue && typeof sourceValue === 'object' && sourceValue.constructor === Object) {
            
            // ターゲットの値がオブジェクトでなければ、新しい空のオブジェクトで初期化
            if (!targetValue || typeof targetValue !== 'object' || Array.isArray(targetValue)) {
                 target[key] = {}; 
            }
            // 配列をオブジェクトとして扱うため、ここでは Array.isArray(targetValue) のチェックは削除しても良いが、
            // ターゲットが配列として存在していた場合は既に Object.assign({}, target) でオブジェクトになっているはず
            
            simpleDeepMerge(target[key], sourceValue, seen); // 再帰

        } else if (typeof sourceValue?.clone === 'function') {
            // カスタムクラスは clone() で上書き
            target[key] = sourceValue.clone();
            
        } else {
            // プリミティブ、その他のオブジェクトは safeStructuredClone でディープコピーして上書き
            target[key] = safeStructuredClone(sourceValue);
        }
    }
    
    return target;
}

const MyManagedClassDefaultProperty = Object.freeze({
  variablename: "MyManagedClassDefaultProperty",
  profile: Object.freeze({ name: "Default Name", age: 25 }),
  settings: Object.freeze({ theme: "light", notifications: true })
});

class MyManagedClass {
  constructor(p, deep = true) {
    if(deep) {
      const target = recursiveClone(MyManagedClassDefaultProperty);
      this.property = simpleDeepMerge(target, p);
    }
    else {
      this.property = Object.assign({}, MyManagedClassDefaultProperty, p);
    }
  }
  clone() {
    return new MyManagedClass(this.property);
  }
  merge(p, deep = true) {
    // 1. コピー先のベースとなるプロパティを決定する
    let baseProperty;
    if (deep) {
      // ディープコピーしてからマージするために、まず自身のpropertyをディープコピーする
      baseProperty = recursiveClone(this.property);
    
      // 2. 新しいプロパティオブジェクト (baseProperty) に新しいデータ (p) をディープマージする
      //    （simpleDeepMergeがターゲットをインプレイスで更新すると仮定）
      simpleDeepMerge(baseProperty, p); 
    } else {
      // シャローマージ: Object.assignでthis.propertyのシャローコピーにpのプロパティを上書き
      baseProperty = Object.assign({}, this.property, p);
    }
    // 3. 不変性を維持するため、新しいプロパティを持つ新しいインスタンスを返す
    return new MyManagedClass(baseProperty, deep);
  }
  isThisType(rh){
    return rh instanceof MyManagedClass; 
  }
  toString(){
    try {
      // JSON.stringify(データ, リプレイサー, スペース数)
      // スペース数に「2」を指定することで、JSONは2スペースでインデントされます。
      const jsonString = JSON.stringify(this.property, null, 2); 
        
      // JSON文字列の各行の先頭に、カスタムヘッダーに合わせたインデント（ここでは2スペース）を追加
      // 最初の中括弧{は除く
      const indentedJson = jsonString.split('\n')
                                     .map((line, index) => (index > 0 ? '  ' : '') + line)
                                     .join('\n');
        
      // ヘッダーと整形されたJSONを結合
      if(this.property.variablename) return `MyManagedClass Instance (${this.property.variablename}) {\n  "property": ${indentedJson}\n}`;
      else return `MyManagedClass Instance {\n  "property": ${indentedJson}\n}`;
    } catch (e) {
      // 循環参照などが含まれる場合の処理
      return `MyManagedClass Instance [Serialization Error: ${e.message}]`;
    }
  }

  //ここにそのほかのメソッドを記述

}

//使用例

function managedtest01(){

  // 使用例: 複数の型とネスト構造を持つ配列
  const nestedHoge = [
    new Person2(taroData), 
    ['a', ['b', new Person2(jiroData)]], 
    { x: 1, y: 2 }
  ];

  const clonedHage = recursiveClone(nestedHoge);
  nestedHoge[1][0] = 'changed';

  console.log(nestedHoge);
/*
  const nestedHoge = [
    new Person2(taroData), 
    ['cahnged', ['b', new Person2(jiroData)]], 
    { x: 1, y: 2 }
  ];
*/
  console.log(clonedHage);
/*
  const clonedHage = [
    new Person2(taroData), 
    ['a', ['b', new Person2(jiroData)]], 
    { x: 1, y: 2 }
  ];
*/

  const personMap = {
    leader: new Person2(taroData),
    member: {
      subleader: new Person2(jiroData),
      bench: new Person2(zakoData)
    }
  };

  const clonedPM = recursiveClone(personMap);
  const tmpP = personMap.leader.clone();
  personMap.leader = personMap.member.bench.clone();
  personMap.member.bench = tmpP.clone();

  console.log(personMap);
/*
  const personMap = {
    leader: new Person2(zakoData),
    member: {
      subleader: new Person2(jiroData),
      bench: new Person2(taroData)
    }
  };
*/
  console.log(clonedPM);
/*
  const clonedPM = {
    leader: new Person2(taroData),
    member: {
      subleader: new Person2(jiroData),
      bench: new Person2(zakoData)
    }
  };
*/

  managedtest02();
}

function managedtest02(){

  const data = new MyManagedClass(taroData);

  const elm = document.getElementById('TDATA');
  elm.value = data.toString();
  console.log(data.toString());
/*
MyManagedClass Instance (taroData) {
  "property": {
    "variablename": "taroData",
    "profile": {
      "name": "Taro",
      "age": 25,
      "nation": "Japan",
      "items": {
        "0": "ball",
        "1": "glove"
      }
    },
    "settings": {
      "theme": "red",
      "notifications": true
    }
  }
}
*/

  const MyManagedClassMap = {
    leader: new MyManagedClass(taroData),
    member: {
      subleader: new MyManagedClass(jiroData),
      bench: new MyManagedClass(zakoData)
    }
  };

  const clonedMM = recursiveClone(MyManagedClassMap);
  const tmpM = MyManagedClassMap.leader.clone();
  MyManagedClassMap.leader = MyManagedClassMap.member.bench.clone();
  MyManagedClassMap.member.bench = tmpM.clone();

/*

  MyManagedClassMap.leader.property.permissions = ["edit", "view"];
  MyManagedClassMap.member.subleader.property.permissions = MyManagedClassMap.leader.property.permissions;
  MyManagedClassMap.leader.property.permissions[0] = "save";
  var str = MyManagedClassMap.leader.property.permissions;
  str += MyManagedClassMap.member.subleader.property.permissions;

// 1. シャローマージの結果を新しい変数に格納
// profile全体を渡すのではなく、ネストされていないプロパティだけを渡すのが安全
const newLeader = MyManagedClassMap.leader.merge({
    // マージデータにネストされていないプロパティのみを渡す
    variablename: 'New Leader Data'
}, false);

// 2. 元の leader インスタンスのネストされたデータを変更
// profile.name はマージされていないため、参照共有が継続しているはず
MyManagedClassMap.leader.property.profile.name = 'Old Name Changed';

// 3. 結果の確認
//var str = MyManagedClassMap.leader.property.permissions; // (前の処理の結果)
//str += MyManagedClassMap.member.subleader.property.permissions; // (前の処理の結果)

str += "\n" + newLeader.property.profile.name + "\n";
elm.value = elm.value + "\n" +str;

*/

  console.log(MyManagedClassMap);
/*
  const MyManagedClassMap = {
    leader: new MyManagedClass(zakoData),
    member: {
      subleader: new MyManagedClass(jiroData),
      bench: new MyManagedClass(taroData)
    }
  };
*/
  console.log(clonedMM);
/*
  const clonedPM = {
    leader: new MyManagedClass(taroData),
    member: {
      subleader: new MyManagedClass(jiroData),
      bench: new MyManagedClass(zakoData)
    }
  };
*/

}



function isNumber(n){
  if ( typeof(n) === 'number' && Number.isFinite(n) ) {
    return true;
  }
  return false;
}

function isNumberAllowString(n) {
  const type = typeof(n);
  if ( type === 'number' && Number.isFinite(n) ) {
    return true;
  }
  if ( type === 'string' && n.trim() !== '' && Number.isFinite(n - 0) ) {
    return true;
  }
  return false;
}



class Col {
  constructor(r, g, b, a) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    if((isNumber(r) == true)&&(4 <=r.length)){
      this.r = Number(r[0]);
      this.g = Number(r[1]);
      this.b = Number(r[2]);
      this.a = Number(r[3]);
      return this;
    }
    if(a != undefined){
      this.r = Number(r);
      this.g = Number(g);
      this.b = Number(b);
      this.a = Number(a);
      return this;
    }
    return this;
  }
}

class Vec2 {
  constructor(x, y) {
    this.typename = "Vec2";
    this.x = 0;
    this.y = 0;
    if(x != undefined){
      if(x.typename == "Vec2"){
        this.x = x.x;
        this.y = x.y;
        return this;
      }
      else if((isNumber(x) == true)&&(2 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        return this;
      }
      else if(y != undefined){
        this.x = Number(x);
        this.y = Number(y);
        return this;
      }
    }
    return this;
  }
}

class Vec3 {
  constructor(x, y, z) {
    this.typename = "Vec3";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    if(x != undefined){
      if(x.typename == "Vec3"){
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        return this;
      }
      else if((isNumber(x) == true)&&(3 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.z = Number(x[2]);
        return this;
      }
      else if(z != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
        return this;
      }
    }
    return this;
  }
}

class Vec4 {
  constructor(x, y, z, w) {
    this.typename = "Vec4";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
    if(x != undefined){
      if(x.typename == "Vec4"){
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        this.w = x.w;
        return this;
      }
      else if((isNumber(x) == true)&&(4 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.z = Number(x[2]);
        this.w = Number(x[3]);
        return this;
      }
      else if(w != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
        this.w = Number(w);
        return this;
      }
    }
    return this;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.typename = "Rectangle";
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    if(x != undefined){
      if(x.typename == "Rectangle"){
        this.x = x.x;
        this.y = x.y;
        this.w = x.w;
        this.h = x.h;
        return this;
      }
      else if((isNumber(x) == true)&&(4 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.w = Number(x[2]);
        this.h = Number(x[3]);
        return this;
      }
      else if(h != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.w = Number(w);
        this.h = Number(h);
        return this;
      }
    }
    return this;
  }

  create(x, y){
    var l = x.x;
    var r = y.x;
    var u = x.y;
    var d = y.y;
    if(r < l) { l = y.x; r = x.x; }
    if(d < u) { u = y.y; d = x.y; }
    this.x = l;
    this.y = u;
    this.w = r - l;
    this.h = d - u;

    return this;
  }
}


var isIE= false;
var isOpera= false;
var isSafari= false;
var isChrome= false;
var isFireFox= false;

function ChkBrws(){
  if(window.navigator.userAgent.toLowerCase().indexOf('msie') != -1) isIE = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('trident') != -1) isIE = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('safari') != -1) isSafari = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1) isChrome = true;
  if(isChrome) isSafari = false; 
  if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) isFireFox = true; 
  if(window.navigator.userAgent.toLowerCase().indexOf('opr') != -1) isOpera = true;
  if(isOpera) { isChrome = false; isSafari = false; }
}

function isZoom(){
  ChkBrws();
  var z = -1.0;
  if(isIE) z = (screen.deviceXDPI / 96.0);
  else z = (window.devicePixelRatio);
  return z;
}

function TextContent(element,value){
  var content = element.textContent;
  if (value === undefined) {
    if (content !== undefined) return content;
    else return element.innerText;
  }
  else {
    if (content !== undefined) element.textContent = value;
    else element.innerText = value;
  }
}

function getScrollPos(){
  var obj = new Object();
  var x1 = x2 = x3 = 0;
  var y1 = y2 = y3 = 0;
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0;
    y1 = document.documentElement.scrollTop || 0;
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0;
    y2 = document.body.scrollTop || 0;
  }
  x3 = window.scrollX || 0;
  y3 = window.scrollY || 0;
  obj.x = Math.max(x1, Math.max(x2, x3));
  obj.y = Math.max(y1, Math.max(y2, y3));
  return obj;
}

function getScreenSize() {
  ChkBrws();
  var obj = new Object();
  if (!isSafari && !isOpera) {
    obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
    obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
  } else {
    obj.x = window.innerWidth;
    obj.y = window.innerHeight;
  }
  obj.mx = parseInt((obj.x)/2);
  obj.my = parseInt((obj.y)/2);
  return obj;
}

function getScrollPosition() {
  var obj = new Object();
  obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
  obj.y = document.documentElement.scrollTop || document.body.scrollTop;
  return obj;
}

function ElmReqFullscreen(elm) {
  var list = [
    "requestFullscreen",
    "webkitRequestFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen"
  ];
  var i;
  var num = list.length;
  for(i = 0; i < num; i++) {
    if(elm[list[i]]) {
      elm[list[i]]();
      return true;
    }
  }
  return false;
}

function DocExitFullscreen(doc) {
  var list = [
    "exitFullscreen",
    "webkitExitFullscreen",
    "mozCancelFullScreen",
    "msExitFullscreen"
  ];
  var i;
  var num = list.length;
  for(i = 0; i < num; i++) {
    if(doc[list[i]]) {
      doc[list[i]]();
      return true;
    }
  }
  return false;
}

function Sign(x, eps){
  if(Math.abs(x) <= eps) return 0.0;
  else if(0.0 < x) return 1.0;
  else return -1.0;
}

function Rand(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  return (Math.random() * (max - min) + min)
}

function RandSqr(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  var r = Math.random();
  return (r * r * (max - min) + min)
}

function RandSqr2(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  var r1 = Math.random();
  var r2 = Math.random();
  return (r1 * r2 * (max - min) + min)
}

//x3dom:<ComposedShader>タグのフィールドの値の変更
function changeShaderParamValue(fieldElementName, value)
{
  var fieldDOMElement = document.getElementById(fieldElementName);
  if (fieldDOMElement){
    fieldDOMElement.setAttribute("value", parseFloat(value));
    var labelElement = document.getElementById(fieldElementName + "Label");
    if (labelElement){
      labelElement.innerHTML = value;
    }
  }
}

//read CSV //CSV読み込み
function readCSV(filename,analyzefunc,donefunc){
  var afunc = new Function("param", "return " + analyzefunc + "(param)");   
  var dfunc = new Function("param", "return " + donefunc + "(param)");   
  var httpObj = new XMLHttpRequest();
  res = "";
  httpObj.open("GET", filename, true);
  httpObj.onreadystatechange = function() {
    if (httpObj.readyState == 4) {
      if(httpObj.status == 0){
        alert("Error:connect");
      }
      else if((200 <= httpObj.status && httpObj.status < 300) || (httpObj.status == 304)) {
        res = httpObj.responseText;
        res = afunc(res);
        dfunc(res);
        return res;
      }
      else {
        alert("Error:others");
      }
    }
  }
  httpObj.send(null);
  return true;
}

//read CSV //CSV読み込み
function readCSV2(filename,analyzefunc,donefunc){
  var afunc = analyzefunc;   
  var dfunc = donefunc;   
  var httpObj = new XMLHttpRequest();
  res = "";
  httpObj.open("GET", filename, true);
  httpObj.onreadystatechange = function() {
    if (httpObj.readyState == 4) {
      if(httpObj.status == 0){
        alert("Error:connect");
      }
      else if((200 <= httpObj.status && httpObj.status < 300) || (httpObj.status == 304)) {
        res = httpObj.responseText;
        res = afunc(res);
        dfunc(res);
        return res;
      }
      else {
        alert("Error:others");
      }
    }
  }
  httpObj.send(null);
  return true;
}

//analyze CSV //CSV解析
function analyzeCSV(res) {
  var ares = new Array();
  var line;
  if (res.match(/\r/))     line = res.split("\r\n");
  else                     line = res.split("\n");

  var linenum = line.length;
  for (var i = 0; i < linenum; i++) ares[i] = new Array();
  var k = 0;
  var maxcol = 0;
  for (i = 0; i < linenum; i++) {
    if(line[i][0] == '#') {k++; continue;} //skip comment out//コメントアウトはスキップ
    line[i] = line[i].replace( /\t/g,"");
    line[i] = line[i].replace( /\s/g,"");
    var col = line[i].split(",");
    var colnum = col.length;
    for (var j = 0; j < colnum; j++) ares[i - k][j] = col[j];
    if (colnum > maxcol) maxcol = colnum;
  }
  ares.length = linenum - k;
  return ares;
}

//ex//使用例：readCSV('filename', 'analyzeCSV', 'donefunc');
