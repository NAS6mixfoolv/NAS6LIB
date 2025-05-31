//Programed by NAS6
//prime.js

var N6LISPRMONELOOPNUM = 1000;
var N6LISPRMNUM;
var N6LISPRMMAX;
var N6LISPRMRET = 0;
var N6LISPRMTMP = 5;
var N6LISPRMTMP0 = 5;
var N6LISPRMTMP1 = 5;

//入力////////////////////////////////////////////////
//id  : TManのid
//num : 判定する数
//出力////////////////////////////////////////////////
//num : 素数である
//-1  : 素数でない
//0   : 計算継続中
//////////////////////////////////////////////////////
function N6LIsPrime(id, num, loopnum){
  N6LISPRMRET = 0;
  N6LISPRMONELOOPNUM = loopnum;

  N6LISPRMNUM = num;
  N6LISPRMMAX = Math.ceil(Math.sqrt(N6LISPRMNUM));

  if((N6LISPRMNUM == 1)||(N6LISPRMNUM == 2)||(N6LISPRMNUM == 3)){
    N6LISPRMRET = N6LISPRMNUM;
    return N6LISPRMNUM;
  }
  if((N6LISPRMNUM <= 0)||(N6LISPRMNUM % 2 == 0)){
    N6LISPRMRET = -1;
    return -1;
  }

  N6LISPRMTMP = 5;

  var mod = N6LISPRMNUM % 6;
  if((N6LISPRMNUM != 3)&&((mod != 1)&&(mod != 5))){
    N6LISPRMRET = -1;
    return -1;
  }

  if(N6LISPRMMAX <= N6LISPRMTMP){
    N6LISPRMRET = N6LISPRMNUM;
    return N6LISPRMNUM;
  }

  function Loop(id){
    var cnt;
    for(cnt = 0; cnt < N6LISPRMONELOOPNUM; cnt++){
      mod = N6LISPRMTMP % 6;
      if((mod != 1)&&(mod != 5)){
         N6LISPRMTMP += 2;
        continue;
      }
      if(N6LISPRMNUM % N6LISPRMTMP == 0){
        N6LISPRMRET = -1;
        return -1;
      }

      N6LISPRMTMP += 2;

      if(N6LISPRMMAX <= N6LISPRMTMP){
         N6LISPRMRET = N6LISPRMNUM;
         return N6LISPRMNUM;
      }
    }

    TMan.timer[id].setalerm(function() { Loop(id); }, 50);  //メインループ再セット
    N6LISPRMRET = 0;
    return 0;
  }

  N6LISPRMRET = Loop(id);
  return N6LISPRMRET;
}



function N6LIsPrimeMNRD(id, num, loopnum){
  N6LISPRMRET = 0;
  N6LISPRMONELOOPNUM = loopnum;

  N6LISPRMNUM = num;
  N6LISPRMMAX = Math.ceil(Math.sqrt(N6LISPRMNUM));

  if((N6LISPRMNUM == 1)||(N6LISPRMNUM == 2)||(N6LISPRMNUM == 3)){
    N6LISPRMRET = N6LNUM;
    return N6LNUM;
  }
  if((N6LISPRMNUM <= 0)||(N6LISPRMNUM % 2 == 0)){
    N6LISPRMRET = -1;
    return -1;
  }

  N6LISPRMTMP0 = Math.ceil(N6LISPRMMAX / 2) * 2 + 1;
  N6LISPRMTMP1 = 5;

  var mod = N6LISPRMNUM % 6;
  if((N6LISPRMNUM != 3)&&((mod != 1)&&(mod != 5))){
    N6LISPRMRET = -1;
    return -1;
  }

  if(N6LISPRMTMP0 <= N6LISPRMTMP1){
    N6LISPRMRET = N6LISPRMNUM;
    return N6LISPRMNUM;
  }

  function LoopMNRD(id){
    var cnt;
    for(cnt = 0; cnt < N6LISPRMONELOOPNUM; cnt++){
      mod = N6LISPRMNUM % N6LISPRMTMP0;
      if(mod != 0){
        N6LISPRMTMP0 -= 2;
      }
      else{
        N6LISPRMRET = -1;
        return -1;
      }
      mod = N6LISPRMNUM % N6LISPRMTMP1;
      if(mod != 0){
        N6LISPRMTMP1 += 2;
      }
      else{
        N6LISPRMRET = -1;
        return -1;
      }

      if(N6LISPRMTMP0 <= N6LISPRMTMP1){
        N6LISPRMRET = N6LISPRMNUM;
        return N6LISPRMNUM;
      }
    }

    TMan.timer[id].setalerm(function() { LoopMNRD(id); }, 50);  //メインループ再セット
    N6LISPRMRET = 0;
    return 0;
  }

  N6LISPRMRET = LoopMNRD(id);
  return N6LISPRMRET;
}


