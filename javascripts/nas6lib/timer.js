//Programed by NAS6
//timer.js

var DISP_NAS6LIB_COPYRIGHT = false;

class N6LTimer {

  constructor(id, rh = null) {
    this.typename = "N6LTimer";
    this.ID = id;
    this.enable = false;
    var dt = new Date();
    this.starttime = dt.getTime();
    this.alerm = -1;
    this.alermfunc = 0;
    this.isUpdating = false; // ★実行中かどうかを管理するフラグ
    this.interval = 25;
    var i;
    if(rh && rh.typename == "N6LTimer"){
        this.ID = rh.ID;
        this.enable = rh.enable;
        this.starttime = rh.starttime;
        this.alerm = rh.alerm;
        this.alermfunc = rh.alermfunc;
        this.isUpdating = rh.isUpdating;
        this.interval = rh.interval;
    }
  }
  clone() {
    return new N6LTimer(this.ID, this);
  };
  start() {
    this.enable = true;
    this.reset();
  };
  stop() {
    this.enable = false;
  };
  reset() {
    var dt = new Date();
    this.starttime = dt.getTime();
  };
  copy(src) {
    this.ID = src.ID;
    this.enable = src.enable;
    this.starttime = src.starttime;
    this.alerm = src.alerm;
    this.alermfunc = src.alermfunc;
  };
  now() {
    if(this.starttime != 0){
      var dt = new Date();
      var nowtime = dt.getTime();
      var interval = nowtime - this.starttime;
      return interval;
    }
  };
  setalerm(func,alm) {
    if(this.isUpdating) alm += this.interval;
    this.start();
    this.alerm = alm;
    this.alermfunc = func;
  };


}

class N6LTimerMan {
  constructor(rh) {
    this.typename = "N6LTimerMan";
    this.interval = 25;
    this.enable = true;
    this.timer = new Array();
    this.hnd = null; // ★予約を管理するハンドルを追加
    this.isUpdating = false; // ★実行中かどうかを管理するフラグ
    var i;
    if(rh && rh.typename == "N6LTimerMan"){
        this.interval = rh.interval;
        this.enable = rh.enable;
        this.hnd = rh.hnd;
        this.isUpdating = rh.isUpdating;
        this.timer.length = rh.timer.length;
        for(i = 0; i < rh.timer.length; i++) this.timer[i] = new N6LTimer(rh.timer[i]);
    }
  }
  clone() {
    return new N6LTimerMan(this);
  };

  add() {
    var l = this.timer.length;
    if(l == 0) this.start();
    this.timer.push(new N6LTimer(l));
    this.timer[l].start();
    return l;
  };
  changeinterval(int) {
    this.interval = int;
    var me = this;
    var i;
    for(i = 0; i < this.timer,length; i++) this.timer[i].interval = int;
  };
  start() {
    this.enable = true;
    // ★重要：readyなどから重複して呼ばれた際、古い「予約」をここで確実に抹殺する
    if (this.hnd) {
      clearTimeout(this.hnd);
      this.hnd = null;
    }
    // フラグもリセットして、新しい一本の道を作る
    this.isUpdating = false; 
    TMUpdate(this);
  };
  stop() {
    this.enable = false;
    // ★停止時にも予約をクリアする
    if (this.hnd) {
      clearTimeout(this.hnd);
      this.hnd = null;
    }
    // フラグもリセットして、新しい一本の道を作る
    this.isUpdating = false; 
  };
}

function TMUpdate(timerman) {
// 1. すでに別の TMUpdate が実行中なら、即座に終了して重複を防ぐ
  if (timerman.isUpdating) return;
  // 2. 「実行中」のカギをかける
  timerman.isUpdating = true;
  if(DISP_NAS6LIB_COPYRIGHT){
    window.alert("powerd by NAS6LIB : licence : GPL-3.0\ncopyright : NAS6 : contact : nas6@nas6.net");
    DISP_NAS6LIB_COPYRIGHT = false;
  }
  // 1. 物理的な多重起動を根絶する
  // どのルートから TMUpdate が呼ばれても、既存の予約(hnd)をまず殺す
  if (timerman.hnd) {
    clearTimeout(timerman.hnd);
    timerman.hnd = null;
  }
  if (timerman.enable == true) {
    // 2. 各タイマーのアラームチェック
    for (var m in timerman.timer) {
      var tm = timerman.timer[m];
      if (tm.enable == true && 0 <= tm.alerm) {
        var now = tm.now();
        if (tm.alerm <= now) {
          tm.alerm = -1;
          tm.isUpdating = true;
          tm.alermfunc(tm.ID); // GLoopなどが呼ばれる
          tm.isUpdating = false;
        }
      }
    }
    // 3. 全ての処理が終わったら「カギ」を開け、次の予約を入れる
    timerman.isUpdating = false; 
    timerman.hnd = setTimeout(function() { 
      TMUpdate(timerman);
    }, timerman.interval);
  } else {
    timerman.isUpdating = false;
  }
}
