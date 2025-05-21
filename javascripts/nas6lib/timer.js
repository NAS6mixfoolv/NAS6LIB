//Programed by NAS6
//timer.js

class N6LTimer {

  constructor(id) {
    this.typename = "N6LTimer";
    this.ID = id;
    this.enable = false;
    var dt = new Date();
    this.starttime = dt.getTime();
    this.alerm = -1;
    this.alermfunc = 0;
  }

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
    this.start();
    this.alerm = alm;
    this.alermfunc = func;
  };


}


class N6LTimerMan {

  constructor() {
    this.typename = "N6LTimerMan";
    this.interval = 25;
    this.enable = true;
    this.timer = new Array();
  }

  add() {
    var l = this.timer.length;
    if(l == 0) this.start();
    this.timer.push(new N6LTimer(l));
    this.timer[l].start();
  };
  changeinterval(int) {
    this.interval = int;
    var me = this;
    setTimeout(function() { TMUpdate(me); }, this.interval);
  };
  start() {
    this.enable = true;
    var me = this;
    setTimeout(function() { TMUpdate(me); }, this.interval);
  };
  stop() {
    this.enable = false;
  };

}




function TMUpdate(timerman) {
  if(timerman.enable == true){
    for(var m in timerman.timer){
      var tm = timerman.timer[m];
      if(tm.enable == true && 0 <= tm.alerm){
        var now = tm.now();
        if(tm.alerm <= now){
          tm.alerm = -1;
          tm.alermfunc(tm.ID);
        }
      }
    }
    setTimeout(function() { TMUpdate(timerman); }, this.interval);
  }
}


