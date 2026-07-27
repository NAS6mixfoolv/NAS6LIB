//Programed by NAS6
//ringbuffer.js
//N6LRingBuffer 2026

class N6LRingBuffer {
  constructor(rh, ary = null, it = 0) {

    this.typename = "N6LRingBuffer";
    this.max = 0;
    this.it = -1;
    this.len = 0;
    this.x = [];

    var i;
    if(rh && rh.typename == "N6LRingBuffer"){
        this.max = rh.max;
        this.it = rh.it;
        this.len = rh.len;
        this.x.length = rh.max;
        var bit = Math.floor((rh.it - rh.len + 1 + rh.max) % rh.max);
        this.x[bit] = rh.x[bit];
        for(i = 1; i < rh.len; i++){
            var nit = Math.floor((bit + i + rh.max) % rh.max);
            this.x[nit] = rh.x[nit];
        }
    }
    else if(!rh) {
      ;
    }
    else if(typeof(rh) == "number"){
        this.max = rh;
        this.x.length = rh;
        if(Array.isArray(ary)){
            var len = Math.min(ary.length, rh);
            this.it = len - 1;
            this.len = len;
            for(i = 0; i < len; i++){
              this.x[i] = ary[i];
            }
            if (len === rh && Number.isInteger(it) && 0 <= it && it < rh) this.it = it;
        }
    }
  } 
  clone(){
    return new N6LRingBuffer(this);
  }
  get length() {
    return this.len;
  }

  get capacity() {
    return this.max;
  }

  get iterator() {
    return this.it;
  }

  get buffer() {
    return this.x;
  }

  isEmpty(){
    return (this.len <= 0);
  }

  isFull(){
    return (this.len === this.max);
  }

  Clear(){
    this.it = -1;
    this.len = 0;
    this.x = new Array(this.max);
    return this;
  }

  Front(){
    return this.GetStart();
  }

  Back(){
    return this.GetEnd();
  }

/*
ToArray
var rb = new N6LRingBuffer(5,[0,1,2,3,4],2);
//rb.it : 2, rb.len : 5, rb.max : 5, rb.x : [0,1,2,3,4];
rb.ToArray(true);
//rb.it : 4, rb.len : 5, rb.max : 5, rb.x : [3,4,0,1,2];
var rb2 = new N6LRingBuffer(8,[0,1,2,3,4],2);//it:不正
//rb2.it : 4, rb2.len : 5, rb2.max : 8, rb2.x : [0,1,2,3,4];
rb2.ToArray(true);
//rb2.it : 4, rb2.len : 5, rb2.max : 8, rb2.x : [0,1,2,3,4];

*/
  ToArray(flg = false){
    var tmp = new Array(this.max);
    var i;
    for(i = 0; i < this.len; i++){
      tmp[i] = this.GetStart(i);
    }
    this.x = new Array(this.max);
    for(i = 0; i < this.len; i++){
      this.x[i] = tmp[i];
    }
    this.it = this.len - 1;
    if(!flg) return this.x.slice(0, this.len);
    return this;
  }

  TestIt(){
    this.x.length = this.max;
    if(this.len === this.max){
      if(0 <= this.it && this.it < this.max) return true;
      this.it = this.len - 1;
      return false;
    }
    else if(this.max < this.len){
      this.len = this.max;
      this.it = this.len - 1;
      return false;
    }
    else {
      if(this.it === this.len - 1) return true;
      this.it = this.len - 1;
      return false;
    }
    return false;
  }

  BufStartPos(skipTest = false){
    if(!skipTest) this.TestIt();
    var bit = Math.floor((this.it - this.len + 1 + this.max) % this.max);
    return bit;
  }

  BufEndPos(skipTest = false){
    if(!skipTest) this.TestIt();
    return this.it;
  }

  BufNewPos(skipTest = false){
    if(!skipTest) this.TestIt();
    var bit = Math.floor((this.it + 1 + this.max) % this.max);
    return bit;
  }

  PopStart(){
    if(this.isEmpty()) return null;
    var tmprb = this.clone();
    var tmpary = tmprb.ToArray();
    var tmp = tmpary[0];
    var wkary = tmpary.slice(1);
    this.x = wkary.slice();
    this.x.length = this.max;
    this.len--;
    this.it = this.len - 1;
    return tmp;
  }

  PopEnd(){
    if(this.isEmpty()) return null;
    var tmprb = this.clone().ToArray(true);
    var tmp = tmprb.GetEnd();
    this.x = tmprb.x.slice(0, this.len - 1);
    this.x.length = this.max;
    this.len--;
    this.it = this.len - 1;
    return tmp;
  }

  PushStart(rh){
    var tmprb = this.clone();
    var tmpary = tmprb.ToArray();
    var wkary = new Array(this.max);
    var i;
    wkary[0] = rh;
    for(i = 1; i < this.max; i++){
      wkary[i] = tmpary[i - 1];
    }
    this.x = wkary.slice();
    this.len++;
    if(this.max < this.len) this.len = this.max;
    this.it = this.len - 1;
    return this;
  }

  PushNew(rh){
    var bit = this.BufNewPos();
    this.x[bit] = rh;
    this.len++;
    this.it = bit;
    if(this.max < this.len) this.len = this.max;
    return this;
  }

  GetStart(rh = 0){
    if(this.isEmpty()) return null;
    var bit = this.BufStartPos();
    var nit = Math.floor((bit + rh + this.max) % this.max);
    return this.x[nit];
  }

  GetEnd(rh = 0){
    if(this.isEmpty()) return null;
    var bit = this.BufEndPos();
    var nit = Math.floor((bit - rh + this.max) % this.max);
    return this.x[nit];
  }
}
