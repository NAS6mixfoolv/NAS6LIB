//Programed by NAS6
//prime.js

const N6LONELOOPNUM = 1000;

var N6LNUM;
var N6LMAX;
var N6LISPRMRET = 0;

//入力////////////////////////////////////////////////
//id  : TManのid
//num : 判定する数
//出力////////////////////////////////////////////////
//num : 素数である
//-1  : 素数でない
//0   : 計算継続中
//////////////////////////////////////////////////////
function N6LIsPrime(id, num){
  N6LISPRMRET = 0;

  N6LNUM = num;
  N6LMAX = Math.ceil(Math.sqrt(NUM));

  if((N6LNUM == 1)||(N6LNUM == 2)||(N6LNUM == 3)){
    N6LISPRMRET = N6LNUM;
    return N6LNUM;
  }
  if((N6LNUM <= 0)||(N6LNUM % 2 == 0)){
    N6LISPRMRET = -1;
    return -1;
  }

  N6LTMP = 5;

  var mod = N6LNUM % 6;
  if((N6LNUM != 3)&&((mod != 1)&&(mod != 5))){
    N6LISPRMRET = -1;
    return -1;
  }

  if(N6LMAX <= N6LTMP){
    N6LISPRMRET = N6LNUM;
    return N6LNUM;
  }

  function Loop(id){
    var cnt;
    for(cnt = 0; cnt < N6LONELOOPNUM; cnt++){
      mod = N6LTMP % 6;
      if((mod != 1)&&(mod != 5)){
         N6LTMP += 2;
        continue;
      }
      if(N6LNUM % N6LTMP == 0){
        N6LISPRMRET = -1;
        return -1;
      }

      N6LTMP += 2;

      if(N6LMAX <= N6LTMP){
         N6LISPRMRET = N6LNUM;
         return N6LNUM;
      }
    }

    TMan.timer[id].setalerm(function() { Loop(id); }, 50);  //メインループ再セット
    N6LISPRMRET = 0;
    return 0;
  }

  N6LISPRMRET = Loop(id);
  return N6LISPRMRET;
}



function N6LIsPrimeMNRD(id, num){
  N6LISPRMRET = 0;

  N6LNUM = num;
  N6LMAX = Math.ceil(Math.sqrt(NUM));

  if((N6LNUM == 1)||(N6LNUM == 2)||(N6LNUM == 3)){
    N6LISPRMRET = N6LNUM;
    return N6LNUM;
  }
  if((N6LNUM <= 0)||(N6LNUM % 2 == 0)){
    N6LISPRMRET = -1;
    return -1;
  }

  N6LTMP0 = Math.ceil(N6LMAX / 2) * 2 + 1;
  N6LTMP1 = 5;

  var mod = N6LNUM % 6;
  if((N6LNUM != 3)&&((mod != 1)&&(mod != 5))){
    N6LISPRMRET = -1;
    return -1;
  }

  if(N6LTMP0 <= N6LTMP1){
    N6LISPRMRET = N6LNUM;
    return N6LNUM;
  }

  function LoopMNRD(id){
    var cnt;
    for(cnt = 0; cnt < N6LONELOOPNUM; cnt++){
      mod = N6LNUM % N6LTMP0;
      if(mod != 0){
        N6LTMP0 -= 2;
      }
      else{
        N6LISPRMRET = -1;
        return -1;
      }
      mod = N6LNUM % N6LTMP1;
      if(mod != 0){
        N6LTMP1 += 2;
      }
      else{
        N6LISPRMRET = -1;
        return -1;
      }

      if(N6LTMP0 <= N6LTMP1){
        N6LISPRMRET = N6LNUM;
        return N6LNUM;
      }
    }

    TMan.timer[id].setalerm(function() { LoopMNRD(id); }, 50);  //メインループ再セット
    N6LISPRMRET = 0;
    return 0;
  }

  N6LISPRMRET = LoopMNRD(id);
  return N6LISPRMRET;
}


