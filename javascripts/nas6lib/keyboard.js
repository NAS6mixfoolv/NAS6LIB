//Programed by NAS6
//keyboard.js

var TManKeyBoard; //キーボードに紐付けられているタイマーマネージャー

//本名定義
var KeyBoardID = [//U.S.標準キーボード
//                                  Break
'VK_$00','VK_LBUTTON','VK_RBUTTON','VK_CANCEL','VK_MBUTTON','VK_XBUTTON1','VK_XBUTTON2','VK_$07',//0
//BackSpace Tab                                  Enter
'VK_BACK','VK_TAB','VK_$0A','VK_$0B','VK_CLEAR','VK_RETURN','VK_$0E','VK_$0F',//8
//Shift     Ctrl         Alt       Pause
'VK_SHIFT','VK_CONTROL','VK_MENU','VK_PAUSE','VK_CAPITAL','VK_KANA','VK_$16','VK_JUNJA',//16
//                              Esc         変換         無変換
'VK_FINAL','VK_KANJI','VK_$1A','VK_ESCAPE','VK_CONVERT','VK_NONCONVERT','VK_ACCEPT','VK_MODCHANGE',//24
//Space     PgUp       PgDn      End      Home      ←        ↑      →
'VK_SPACE','VK_PRIOR','VK_NEXT','VK_END','VK_HOME','VK_LEFT','VK_UP','VK_RIGHT',//32
//↓                                           PrintScreen   Ins         Del
'VK_DOWN','VK_SELECT','VK_PRINT','VK_EXECUTE','VK_SNAPSHOT','VK_INSERT','VK_DELETE','VK_HELP',//40
'VK_0','VK_1','VK_2','VK_3','VK_4','VK_5','VK_6','VK_7',//48
'VK_8','VK_9','VK_$3A','VK_$3B','VK_$3C','VK_$3D','VK_$3E','VK_$3F',//56
'VK_$40','VK_A','VK_B','VK_C','VK_D','VK_E','VK_F','VK_G',//64
'VK_H','VK_I','VK_J','VK_K','VK_L','VK_M','VK_N','VK_O',//72
'VK_P','VK_Q','VK_R','VK_S','VK_T','VK_U','VK_V','VK_W',//80
'VK_X','VK_Y','VK_Z','VK_LWIN','VK_RWIN','VK_APPS','VK_$5E','VK_SLEEP',//88
'VK_NUMPAD0','VK_NUMPAD1','VK_NUMPAD2','VK_NUMPAD3','VK_NUMPAD4','VK_NUMPAD5','VK_NUMPAD6','VK_NUMPAD7',//96
//                         numpad *      numpad + numpad enter   numpad -      numpad .     numpad /
'VK_NUMPAD8','VK_NUMPAD9','VK_MULTIPLY','VK_ADD','VK_SEPARATOR','VK_SUBTRACT','VK_DECIMAL','VK_DIVIDE',//104
'VK_F1','VK_F2','VK_F3','VK_F4','VK_F5','VK_F6','VK_F7','VK_F8',//112
'VK_F9','VK_F10','VK_F11','VK_F12','VK_F13','VK_F14','VK_F15','VK_F16',//120
'VK_F17','VK_F18','VK_F19','VK_F20','VK_F21','VK_F22','VK_F23','VK_F24',//128
'VK_$88','VK_$89','VK_$8A','VK_$8B','VK_$8C','VK_$8D','VK_$8E','VK_$8F',//136
//Num Lock    Scroll Lock
'VK_NUMLOCK','VK_SCROLL','VK_$92','VK_$93','VK_$94','VK_$95','VK_$96','VK_$97',//144
'VK_$98','VK_$99','VK_$9A','VK_$9B','VK_$9C','VK_$9D','VK_$8E','VK_$9F',//152
'VK_LSHIFT','VK_RSHIFT','VK_LCONTROL','VK_RCONTROL','VK_LMENU','VK_RMENU','VK_BROWSER_BACK','VK_BROWSER_FORWARD',//160
'VK_BROWSER_REFRESH','VK_BROWSER_STOP','VK_BROWSER_SERCH','VK_BROWSER_FAVORITES','VK_BROWSER_HOME','VK_VOLUME_MUTE','VK_VOLUME_DOWN','VK_VOLUME_UP',//168
'VK_MEDIA_NEXT_TRACK','VK_MEDIA_PREV_TRACK','VK_MEDIA_STOP','VK_MEDIA_PLAY_PAUSE','VK_LAUNCH_MAIL','VK_LAUNCH_MEDIA_SELECT','VK_LAUNCH_APP1','VK_LAUNCH_APP2',//176
//     :;         +             ,              -              .               /?
'VK_$B8','VK_$B9','VK_OEM_1','VK_OEM_PLUS','VK_OEM_COMMA','VK_OEM_MINUS','VK_OEM_PERIOD','VK_OEM_2',//184
//`~
'VK_OEM_3','VK_$C1','VK_$C2','VK_$C3','VK_$C4','VK_$C5','VK_$C6','VK_$C7',//192
'VK_$C8','VK_$C9','VK_$CA','VK_$CB','VK_$CC','VK_$CD','VK_$CE','VK_$CF',//200
'VK_$D0','VK_$D1','VK_$D2','VK_$D3','VK_$D4','VK_$D5','VK_$D6','VK_$D7',//208
//                          [{         \|         ]}         '"
'VK_$D8','VK_$D9','VK_$DA','VK_OEM_4','VK_OEM_5','VK_OEM_6','VK_OEM_7','VK_OEM_8',//216
'VK_$E0','VK_OEM_AX','VK_OEM_102','VK_ICO_HELP','VK_ICO_00','VK_PROCESSKEY','VK_ICO_CLEAR','VK_PACKET',//224
'VK_$E8','VK_OEM_RESET','VK_OEM_JUMP','VK_OEM_PA1','VK_OEM_PA2','VK_OEM_PA3','VK_OEM_WSCTRL','VK_OEM_CUSEL',//232
//Caps Lock                    カナ                        全角
'VK_OEM_ATTN','VK_OEM_FINISH','VK_OEM_COPY','VK_OEM_AUTO','VK_OEM_ENLW','VK_OEM_BACKTAB','VK_ATTN','VK_CRSEL',//240
'VK_EXSEL','VK_EREOF','VK_PLAY','VK_ZOOM','VK_NONAME','VK_PA1','VK_OEM_CLEAR','VK_$FF'];//248

var KeyBoardAliasID = [//別名定義 日本語キーボード
['VK_RETURN', 'VK_ENTER'], ['VK_ESCAPE', 'VK_ESC'], ['VK_OEM_MINUS', 'VK_-'], ['VK_OEM_7', 'VK_^'],  
['VK_NUMPAD1', 'VK_N1'], ['VK_NUMPAD2', 'VK_N2'], ['VK_NUMPAD3', 'VK_N3'], ['VK_NUMPAD4', 'VK_N4'], 
['VK_NUMPAD5', 'VK_N5'], ['VK_NUMPAD6', 'VK_N6'], ['VK_NUMPAD7', 'VK_N7'], ['VK_NUMPAD8', 'VK_N8'], 
['VK_NUMPAD9', 'VK_N9'], ['VK_NUMPAD0', 'VK_N0'], ['VK_DECIMAL', 'VK_N.'], ['VK_ADD', 'VK_N+'], 
['VK_SUBTRACT', 'VK_N-'], ['VK_MULTIPLY', 'VK_N*'], ['VK_DIVIDE', 'VK_N/'], ['VK_NUMLOCK', 'VK_NLK'], 
['VK_OEM_5', 'VK_|'],  ['VK_OEM_3', 'VK_@'], ['VK_OEM_4', 'VK_['], ['VK_OEM_PLUS', 'VK_;'], 
['VK_OEM_1', 'VK_:'], ['VK_OEM_6', 'VK_]'], ['VK_OEM_COMMA', 'VK_,'], ['VK_OEM_PERIOD', 'VK_.'], 
['VK_OEM_2', 'VK_/'], ['VK_OEM_102', 'VK__'], ['VK_CONTROL', 'VK_CTRL'], ['VK_MENU', 'VK_ALT'], 
['VK_CONVERT', 'VK_CNVT'], ['VK_NONCONVERT', 'VK_NONCNVT'], ['VK_PRIOR', 'VK_PGUP'], ['VK_NEXT', 'VK_PGDN'], 
['VK_LEFT', 'VK_←'], ['VK_UP', 'VK_↑'], ['VK_RIGHT', 'VK_→'],['VK_DOWN', 'VK_↓'], 
['VK_INSERT', 'VK_INS'], ['VK_DELETE', 'VK_DEL'], ['VK_SCROLL', 'VK_SLK'], ['VK_SNAPSHOT', 'VK_PRTSCRN'], 
['VK_OEM_ATTN', 'VK_CLK'], ['VK_OEM_COPY', 'VK_KANA'], ['VK_OEM_ENLW', 'VK_ZEN'], ['VK_OEM_AUTO', 'VK_ZEN2'], 
['VK_PAUSE', 'VK_BRK'], ['VK_CLEAR', 'VK_CLS']];

var UnityAliasID = [//別名統一 日本語キーボード
['VK_ZEN', 'VK_ZEN2']];

class N6LKeyBoard {

  constructor() {
    this.typename = "N6LKeyBoard";
    this.keystate = [];
    this.keyfunc = 0;
    this.lastkey = -1;
    this.enable = true;
  }

  //キーボードメソッド登録
  setfunc(func) {
    this.keyfunc = func;
  };

  //キーボード有効無効切り替え
  setenable(b) {
    this.enable = b;
  };

  //RealIDindex
  indexof(str) {
    for(var m in KeyBoardID){
      if(KeyBoardID[m] == str) return m;
    }
    return -1;
  };

  //別名追加
  addAlias(ary) {
    KeyBoardAliasID.push(ary);
  };

  //(紐付けも一緒に)別名削除
  delAlias(str) {
    var i;
    var j;
    var k;
    var ary = [];
    this.ToAliasID(str, ary);
    for(j in ary) {
      k = -1;
      for(i in KeyBoardAliasID) {
        if(ary[j] == KeyBoardAliasID[i][1]) { k = i; break; }
      }
      if(0 <= k) KeyBoardAliasID.splice(k, 1);
    }
  };

  //統一別名追加
  addUnityAlias(ary) {
    UnityAliasID.push(ary);
  };

  //統一別名削除
  delUnityAlias(str) {
    var i;
    var j;
    for(i in UnityAliasID) {
      for(j in UnityAliasID[i]) {
        if(UnityAliasID[i][j] == str) UnityAliasID.splice(i, 1);
      }
    }
  };

  //別名統一
  UnityAlias(str) {
    var i;
    var j;
    for(i in UnityAliasID) {
      for(j in UnityAliasID[i]) {
        if(j != '0'){
          if(UnityAliasID[i][j] == str) return UnityAliasID[i][0];
        }
      }
    }
    return str;
  };

  //統一された別名の押し下げ取得
  isPressUnityAlias(str) {
    var i;
    var j;
    var k;
    for(i in UnityAliasID) {
      for(j in UnityAliasID[i]) {
        if(UnityAliasID[i][j] == str) {
          for(k in UnityAliasID[i]) {
            if(KeyB.keystate[KeyB.indexof(KeyB.ToReal(UnityAliasID[i][k]))]) return true;
          }
          return false;
        }
      }
    }
    return KeyB.keystate[KeyB.indexof(KeyB.ToReal(str))];
  };

  //別名に変換
  ToAlias(str, ret) {
    var i;
    for(i in KeyBoardAliasID) {
      if(str == KeyBoardAliasID[i][0]) { ret.push(KeyBoardAliasID[i][1]); this.ToAlias(KeyBoardAliasID[i][1], ret); return ret[ret.length - 1]; }
    }
    return str;
  };

  //本名に変換
  ToReal(str) {
    var i;
    for(i in KeyBoardAliasID) {
      if(str == KeyBoardAliasID[i][1]) { str = this.ToReal(KeyBoardAliasID[i][0]); return str; }
    }
    return str;
  };

}



var KeyB = new N6LKeyBoard(); //N6LKeyBoard実体
var dokp;
var dokd;
var doku;

//キーボード初期化
//tman:N6LTimerMan, func:chkKeyBoardFunc, ret:loopKeyBoardID 
function initKeyBoard(tman, func) {
  if(func) KeyB.setfunc(function() { func(); });
  if(tman) TManKeyBoard = tman;
  else TManKeyBoard = new N6LTimerMan();
  TManKeyBoard.add();
  var id = TManKeyBoard.timer.length - 1;
  TManKeyBoard.timer[id].setalerm(function() { loopKeyBoard(id); }, 33);  //set main loop//メインループセット
  dokp = document.onkeypress;
  dokd = document.onkeydown;
  doku = document.onkeyup;
  return id;
}

//キーボードメインループ
function loopKeyBoard(id) {
  if(KeyB.enable) {
    document.onkeypress = function(e) {
      return false;
    };
    document.onkeydown = function(e) {
      KeyB.keystate[e.keyCode] = true;
      KeyB.lastkey = e.keyCode;
      return false;
    };
    document.onkeyup = function(e) {
      KeyB.keystate[e.keyCode] = false;
      KeyB.lastkey = e.keyCode;
      return false;
    };
    if(KeyB.keyfunc) KeyB.keyfunc();
  }
  else {
    if(dokp) document.onkeypress = dokp();
    else document.onkeypress = dokp;
    if(dokd) document.onkeydown = dokd();
    else document.onkeydown = dokd;
    if(doku) document.onkeyup = doku();
    else document.onkeyup = doku;
  }
  TManKeyBoard.timer[id].setalerm(function() { loopKeyBoard(id); }, 33);  //set main loop//メインループセット
}
