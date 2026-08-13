//Programed by NAS6
//date.js

class N6LDate {

  //var dt = new N6LDate().normalize();のように.normalize()を必ずつけてください
  constructor(ya, ma, da, ho, mo, so, ms, region = "DEFAULT", regionW = "DEFAULT", fpd = 0) {
    this.typename = "N6LDate";
    this.ya = 1;
    this.ma = 1;
    this.da = 1; // MDN準拠: 引数なしの場合は日を1に
    this.ho = 0;
    this.mo = 0;
    this.so = 0;
    this.ms = 0;
    this.wk = 0;
    this.pastdays = fpd ? fpd : 0;
    this.region = "DEFAULT";
    this.regionW = "DEFAULT";
    this.weeks = {
      JP: ["土","日","月","火","水","木","金"],        // 日本
      EN: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],   // 英語圏（US/GB 共通）

      FR: ["Sam","Dim","Lun","Mar","Mer","Jeu","Ven"],   // フランス
      DE: ["Sa","So","Mo","Di","Mi","Do","Fr"],          // ドイツ
      ES: ["Sab","Dom","Lun","Mar","Mie","Jue","Vie"],   // スペイン
      IT: ["Sab","Dom","Lun","Mar","Mer","Gio","Ven"],   // イタリア
      PT: ["Sab","Dom","Seg","Ter","Qua","Qui","Sex"],   // ポルトガル

      RU: ["Сб","Вс","Пн","Вт","Ср","Чт","Пт"],          // ロシア
      GR: ["Σαβ","Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ"],   // ギリシャ

      SE: ["Lor","Son","Man","Tis","Ons","Tors","Fre"],   // スウェーデン
      NO: ["Lor","Son","Man","Tir","Ons","Tor","Fre"],    // ノルウェー
      DK: ["Lor","Son","Man","Tir","Ons","Tor","Fre"],    // デンマーク
      FI: ["La","Su","Ma","Ti","Ke","To","Pe"],           // フィンランド
      NL: ["Za","Zo","Ma","Di","Wo","Do","Vr"],           // オランダ

      PL: ["Sob","Nie","Pon","Wto","S^ro","Czw","Pia"],    // ポーランド
      CZ: ["So","Ne","Po","Ut","St","C^t","Pa"],           // チェコ
      SK: ["So","Ne","Po","Ut","St","S^t","Pi"],           // スロバキア
      HU: ["Szo","Vas","Het","Ked","Sze","Csu","Pen"],    // ハンガリー

      TR: ["Cmt","Paz","Pzt","Sal","Car","Per","Cum"],    // トルコ
      BG: ["Съб","Нед","Пон","Вт","Ср","Чет","Пет"],      // ブルガリア
      RO: ["Sam","Dum","Lun","Mar","Mie","Joi","Vin"],    // ルーマニア
      RS: ["Суб","Нед","Пон","Уто","Сре","Чет","Пет"],    // セルビア

      US: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],    // アメリカ（EN と同じ）
      CA: ["Sam","Dim","Lun","Mar","Mer","Jeu","Ven"],    // カナダ（FR/EN 混在 → FR を採用）
      AU: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],    // オーストラリア
      NZ: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],    // ニュージーランド

      LT: ["S^es^","Sek","Pir","Ant","Tre","Ket","Pen"],    // リトアニア
      LV: ["Ses","Sve","Pir","Otr","Tre","Cet","Pie"],    // ラトビア
      EE: ["Lau","Puh","Esm","Tei","Kol","Nel","Ree"],    // エストニア

      MX: ["Sab","Dom","Lun","Mar","Mie","Jue","Vie"],    // メキシコ（スペイン語）
      PE: ["Sab","Dom","Lun","Mar","Mie","Jue","Vie"],    // ペルー
      BR: ["Sab","Dom","Seg","Ter","Qua","Qui","Sex"],    // ブラジル（ポルトガル語）
      PH: ["Sab","Dom","Lun","Mar","Miy","Huw","Biy"],     // フィリピン（タガログ語）
    };
    // DEFAULT は内部的に EN にマップする
    if (regionW === "DEFAULT") {
        regionW = "EN";
    }
    // ReformTable に存在する地域だけ採用
    if (this.weeks[regionW]) {
        this.regionW = regionW;
    } else {
        this.regionW = "EN"; // フォールバック
    }

    this.months = {
      JP: ["1","2","3","4","5","6","7","8","9","10","11","12"],
      EN: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      FR: ["Janv","Fevr","Mars","Avr","Mai","Juin","Juil","Aout","Sept","Oct","Nov","Dec"],
      DE: ["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
      ES: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
      PT: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
      // 必要なら追加
    };



    this.mdays = [0,31,28,31,30,31,30,31,31,30,31,30,31,31,28];

    this.ReformTable = {
      JP: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "日本",             countryEN: "Japan"},
      GB: { julianEnd: "1752-09-02", gregorianStart: "1752-09-14", reformDays: "11", countryJP: "イギリス",         countryEN: "UK"},
      RU: { julianEnd: "1918-01-31", gregorianStart: "1918-02-14", reformDays: "13", countryJP: "ロシア",           countryEN: "Russia"},
      GR: { julianEnd: "1923-02-15", gregorianStart: "1923-03-01", reformDays: "13", countryJP: "ギリシャ",         countryEN: "Greece"},

      IT: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "イタリア",         countryEN: "Italy"},
      ES: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "スペイン",         countryEN: "Spain"},
      PT: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "ポルトガル",       countryEN: "Portugal"},
      PL: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "ポーランド",       countryEN: "Poland"},

      FR: { julianEnd: "1582-12-09", gregorianStart: "1582-12-20", reformDays: "10", countryJP: "フランス",         countryEN: "France"},
      NL: { julianEnd: "1582-12-14", gregorianStart: "1582-12-25", reformDays: "10", countryJP: "オランダ",         countryEN: "Netherlands"},

      DE: { julianEnd: "1700-02-18", gregorianStart: "1700-03-01", reformDays: "11", countryJP: "ドイツ",           countryEN: "Germany"},
      DK: { julianEnd: "1700-02-18", gregorianStart: "1700-03-01", reformDays: "11", countryJP: "デンマーク",       countryEN: "Denmark"},
      NO: { julianEnd: "1700-02-18", gregorianStart: "1700-03-01", reformDays: "11", countryJP: "ノルウェー",       countryEN: "Norway"},

      SE: { julianEnd: "1753-02-17", gregorianStart: "1753-03-01", reformDays: "11", countryJP: "スウェーデン",     countryEN: "Sweden"},

      CH: { julianEnd: "1583-01-11", gregorianStart: "1583-01-22", reformDays: "10", countryJP: "スイス",           countryEN: "Switzerland"},
      HU: { julianEnd: "1587-10-21", gregorianStart: "1587-11-01", reformDays: "10", countryJP: "ハンガリー",       countryEN: "Hungary"},

      TR: { julianEnd: "1917-02-15", gregorianStart: "1917-02-28", reformDays: "13", countryJP: "トルコ",           countryEN: "Turkey"},
      BG: { julianEnd: "1916-03-31", gregorianStart: "1916-04-14", reformDays: "13", countryJP: "ブルガリア",       countryEN: "Bulgaria"},
      RO: { julianEnd: "1919-03-31", gregorianStart: "1919-04-14", reformDays: "13", countryJP: "ルーマニア",       countryEN: "Romania"},
      RS: { julianEnd: "1919-01-14", gregorianStart: "1919-01-27", reformDays: "13", countryJP: "セルビア",         countryEN: "Serbia"},

      AT: { julianEnd: "1583-01-06", gregorianStart: "1583-01-17", reformDays: "10", countryJP: "オーストリア",     countryEN: "Austria"},
      CZ: { julianEnd: "1584-10-04", gregorianStart: "1584-10-15", reformDays: "10", countryJP: "チェコ",           countryEN: "Czech Republic"},
      SK: { julianEnd: "1587-10-21", gregorianStart: "1587-11-01", reformDays: "10", countryJP: "スロバキア",       countryEN: "Slovakia"},

      LT: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "リトアニア",       countryEN: "Lithuania"},
      LV: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "ラトビア",         countryEN: "Latvia"},
      EE: { julianEnd: "1700-02-18", gregorianStart: "1700-03-01", reformDays: "11", countryJP: "エストニア",       countryEN: "Estonia"},

      FI: { julianEnd: "1753-02-17", gregorianStart: "1753-03-01", reformDays: "11", countryJP: "フィンランド",     countryEN: "Finland"},

      US: { julianEnd: "1752-09-02", gregorianStart: "1752-09-14", reformDays: "11", countryJP: "アメリカ",         countryEN: "USA"},
      CA: { julianEnd: "1752-09-02", gregorianStart: "1752-09-14", reformDays: "11", countryJP: "カナダ",           countryEN: "Canada"},
      AU: { julianEnd: "1752-09-02", gregorianStart: "1752-09-14", reformDays: "11", countryJP: "オーストラリア",   countryEN: "Australia"},
      NZ: { julianEnd: "1752-09-02", gregorianStart: "1752-09-14", reformDays: "11", countryJP: "ニュージーランド", countryEN: "New Zealand"},

      MX: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "メキシコ",         countryEN: "Mexico"},
      PE: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "ペルー",           countryEN: "Peru"},
      BR: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "ブラジル",         countryEN: "Brazil"},
      PH: { julianEnd: "1582-10-04", gregorianStart: "1582-10-15", reformDays: "10", countryJP: "フィリピン",       countryEN: "Philippines"}
    };
    // DEFAULT は内部的に JP にマップする
    if (region === "DEFAULT") {
        region = "JP";
    }
    // ReformTable に存在する地域だけ採用
    if (this.ReformTable[region]) {
        this.region = region;
    } else {
        this.region = "JP"; // フォールバック
    }

    this.SecMS = 1000;
    this.MinMS = 60 * this.SecMS;
    this.HourMS = 60 * this.MinMS;
    this.DayMS = 24 * this.HourMS;
    this.JDMon = 30.6001;
    this.JDYear = 365.25;
    this.MonMS = this.JDMon * this.DayMS;
    this.YearMS = this.JDYear * this.DayMS;

    if (arguments.length === 0) {
      // new Date() 相当（現在時刻）
      const now = new Date();
      this.ya = now.getFullYear();
      this.ma = now.getMonth() + 1;
      this.da = now.getDate();
      this.ho = now.getUTCHours()
      this.mo = now.getMinutes();
      this.so = now.getSeconds();
      this.ms = now.getMilliseconds();
      this.pastdays += this.tempPDays(this);
    } 
    else if (ya !== undefined && ya !== null) {
      // まず N6LDate インスタンス（または同等オブジェクト）の場合の処理
      if (ya.typename === "N6LDate") {
        this.ya = ya.ya;
        this.ma = ya.ma;
        this.da = ya.da;
        this.ho = ya.ho;
        this.mo = ya.mo;
        this.so = ya.so;
        this.ms = ya.ms;
        this.wk = ya.wk;
        this.pastdays += ya.pastdays;
        this.region = ya.region;
        this.regionW = ya.regionW;
      }
      // 標準の Date オブジェクトの場合
      else if (ya instanceof Date) {
        this.ya = ya.getFullYear();
        this.ma = ya.getMonth() + 1;
        this.da = ya.getDate();
        this.ho = ya.getUTCHours();
        this.mo = ya.getMinutes();
        this.so = ya.getSeconds();
        this.ms = ya.getMilliseconds();
        this.pastdays += this.tempPDays(this);
      }
      else if (typeof ya.getFullYear === "function") {
        // その他の getter 持ちオブジェクト
        this.ya = ya.getFullYear();
        this.ma = ya.getMonth() + 1;
        this.da = ya.getDate();
        this.ho = ya.getUTCHours();
        this.mo = ya.getMinutes();
        this.so = ya.getSeconds();
        this.ms = ya.getMilliseconds();
        this.pastdays += this.tempPDays(this);
      } 
      else if (typeof ya === "string") {
        // 文字列からの生成
        const d = new Date(ya);
        if (!isNaN(d.getTime())) {
          this.ya = d.getFullYear();
          this.ma = d.getMonth() + 1;
          this.da = d.getDate();
          this.ho = d.getUTCHours();
          this.mo = d.getMinutes();
          this.so = d.getSeconds();
          this.ms = d.getMilliseconds();
          this.pastdays += this.tempPDays(this);
        }
      } 
      else if (typeof ya === "number") {
        // 数値、または複数の数値引数パターン
        if (ma === undefined || ma === null) {
          const d = new Date(ya);
          this.ya = d.getFullYear();
          this.ma = d.getMonth() + 1;
          this.da = d.getDate();
          this.ho = d.getUTCHours();
          this.mo = d.getMinutes();
          this.so = d.getSeconds();
          this.ms = d.getMilliseconds();
          this.pastdays += this.tempPDays(this);
        } else {
          var val = {ya: ya, ma: ma, da: da, ho: ho, mo: mo, so: so, ms: ms, dms: 0, pastdays: 0};
          val = this.adjustTime(val);
          this.ya = val.ya;
          this.ma = val.ma;
          this.da = val.da;
          this.ho = val.ho;
          this.mo = val.mo;
          this.so = val.so;
          this.ms = val.ms;
          this.pastdays += val.pastdays;
        }
      }
    }
  }

  //クローン
  clone() {
    return new N6LDate(this).normalize();
  }

  //N6LDays.pastdaysに仮置きするために1日のうちの時間成分の小数部を計算
  tempPDays(val){
    return (val.ho * this.HourMS + val.mo * this.MinMS + val.so * this.SecMS + val.ms) / this.DayMS;
  }

  //時間情報の繰り上げ下げ
  adjustTime(val){
    // 前回の dms があれば、まずミリ秒側に足し戻す
    var currentMS = (val.ms !== undefined) ? val.ms : 0;
    if (val.dms !== undefined) {
      currentMS += val.dms; // 持ち越した端数ミリ秒を加算
    }

    var ret = {ya: 0, ma: 0, da: 0, ho: 0, mo: 0, so: 0, ms: 0, dms: 0, pastdays: 0};

    // --- ここから下位から上位への繰り上げ・繰り下げ計算 ---
    // (例: currentMS から秒、分、時、日、月、年へ分解し、
    //  どうしても割り切れない真の端数だけを ret.dms に残す)
      var totalMS = currentMS; 
      var extraSec = Math.floor(totalMS / 1000);    // 1000ms分を計算 (1秒)
      if (val.so === undefined || val.so === null) val.so = 0;
      val.so += extraSec;                               // 秒に加算
      ret.ms = Math.floor(totalMS % 1000);               // 残りのms (～.999秒)
    if (val.so !== undefined && val.so !== null) {
      var totalSec = val.so; 
      var extraMin = Math.floor(totalSec / 60);     // 60秒を超えた分（分への繰り上げ）
      if (val.mo === undefined || val.mo === null) val.mo = 0;
      val.mo += extraMin;                          
      var remainingSec = totalSec % 60;              // 残りの秒（0?59.999...）
      ret.so = Math.floor(remainingSec);             // 整数部分の秒
       // ★ 秒の「小数点以下の端数」だけを dms に送る（あるいはミリ秒に換算）
      var secFraction = remainingSec - ret.so;
      ret.dms += secFraction * this.SecMS;          
    }
    if (val.mo !== undefined && val.mo !== null) {
      var totalMin = val.mo; 
      var extraHour = Math.floor(totalMin / 60);     
      if (val.ho === undefined || val.ho === null) val.ho = 0;
      val.ho += extraHour;                          
      var remainingMin = totalMin % 60;              
      ret.mo = Math.floor(remainingMin);             
      var minFraction = remainingMin - ret.mo;
      ret.dms += minFraction * this.MinMS;          
    }
    if (val.ho !== undefined && val.ho !== null) {
      var totalHour = val.ho; 
      var extraDay = Math.floor(totalHour / 24);     
      if (val.da === undefined || val.da === null) val.da = 1;
      val.da += extraDay;                          
      var remainingHour = totalHour % 24;              
      ret.ho = Math.floor(remainingHour);             
      var hourFraction = remainingHour - ret.ho;
      ret.dms += hourFraction * this.HourMS;          
    }
    if (val.da !== undefined && val.da !== null) {
      var totalDay = val.da; 
      var extraMon = Math.floor(totalDay / 31);     
      if (val.ma === undefined || val.ma === null) val.ma = 1;
      val.ma += extraMon;                          
      var remainingDay = totalDay % 31;              
      ret.da = Math.floor(remainingDay);             
      var dayFraction = remainingDay - ret.da;
      ret.dms += dayFraction * this.DayMS;          
    }
      // 例：ma が 15.5 の場合
      var totalMon = val.ma; 
      var extraYear = Math.floor(totalMon / 12); // 12ヶ月分を計算 (1年)
      val.ya += extraYear;                              // 年に加算
      var remainingMon = totalMon % 12;              
      ret.ma = Math.floor(remainingMon);             
      var monFraction = remainingMon - ret.ma;
      ret.dms += monFraction * 31 * this.DayMS;          
      ret.ya = Math.floor(val.ya);
      ret.dms += (val.ya - Math.floor(val.ya)) * 12 * 31 * this.DayMS;
    // 浮動小数点の誤差対策として、収束判定にはイプシロンを使う
    // if (Math.abs(ret.dms) > 1e-6) { ... }
    if(Math.abs(ret.dms) > 1e-6) ret = this.adjustTime(ret);
    ret.pastdays = this.tempPDays(ret);
    return ret;
  }

  //ユリウス暦通算日数取得誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayから取得してください
  julianDayRaw(val, flg = false){
    // x は3月1日を起点とした年内日数
    // 1～2月は前年の13・14月として扱う（フェアフィールド方式）
    if(val.ma == 1 || val.ma == 2){
      val.ya--;
      val.ma += 12;
    }
    var ret = Math.floor(
        Math.floor(365*val.ya) +
        Math.floor(val.ya/4) +
        Math.floor(306*(val.ma+1)/10) +
        Math.floor(val.da) - 429
    ) + 2;
    var ret2 = 0;
    if(flg) ret2 = (val.ho * this.HourMS + val.mo * this.MinMS + val.so * this.SecMS + val.ms) / this.DayMS;
    return ret + ret2;
  }

  //グレゴリオ暦通算日数取得誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayから取得してください
  gregorianDayRaw(val, flg = false){
    // x は3月1日を起点とした年内日数
    // 1～2月は前年の13・14月として扱う（フェアフィールド方式）
    if(val.ma == 1 || val.ma == 2){
      val.ya--;
      val.ma += 12;
    }
    var ret = Math.floor(
        Math.floor(365*val.ya) +
        Math.floor(val.ya/4) -
        (Math.floor(val.ya/100) - Math.floor(val.ya/400)) +
        Math.floor(306*(val.ma+1)/10) +
        Math.floor(val.da) - 429
    ) + 2;
    var ret2 = 0;
    if(flg) ret2 = (val.ho * this.HourMS + val.mo * this.MinMS + val.so * this.SecMS + val.ms) / this.DayMS;
    return ret + ret2;
  }

  //通算日数取得(ユリウス暦・グレゴリオ暦自動処理)誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayから取得してください
  calendarToDay(val, flg = false) {
    if(!this.afterGregorian(val)) {
      var reform = this.ReformTable[this.region];
      var jed = this.parseDate(reform.julianEnd);
      var gsd = this.parseDate(reform.gregorianStart);
      gsd = this.suboneday(gsd);
      var rd = Math.floor(reform.reformDays);
      var cc = { ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0, region: this.region };
      var med = this.getMonthEnd(new N6LDate(cc.ya,cc.ma,cc.da,cc.ho,cc.mo,cc.so,cc.ms,cc.region),false);
      if(jed.ma == gsd.ma) med = gsd.da;
      if(((val.ya == jed.ya && val.ma == jed.ma && jed.da < val.da && val.da <= med))||
         ((val.ya == gsd.ya && val.ma == gsd.ma && 0 < val.da && val.da <= gsd.da))) {
        return this.julianDayRaw(cc, flg);
      }
      return this.julianDayRaw(val, flg);
    }
    else {
      var reform = this.ReformTable[this.region];
      var jed = this.parseDate(reform.julianEnd);
      var gsd = this.parseDate(reform.gregorianStart);
      gsd = this.suboneday(gsd);
      var rd = Math.floor(reform.reformDays);
      var cc = { ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0, region: this.region };
      var med = this.getMonthEnd(new N6LDate(cc.ya,cc.ma,cc.da,cc.ho,cc.mo,cc.so,cc.ms,cc.region),false);
      if(jed.ma == gsd.ma) med = gsd.da;
      if(((val.ya == jed.ya && val.ma == jed.ma && jed.da < val.da && val.da <= med))||
         ((val.ya == gsd.ya && val.ma == gsd.ma && 0 < val.da && val.da <= gsd.da))) {
        return this.julianDayRaw(cc, flg);
      }
      return (this.gregorianDayRaw(val, flg) - this.gregorianDayRaw(cc, flg) + this.julianDayRaw(cc, flg) - rd);
    }
  }

  //前日に変換
  suboneday(val){
    val.da--;
    if(val.da < 1){
      val.ma--;
      while(12 < val.ma){
        val.ya++;
        val.ma -= 12;
      }
      while(val.ma < 1){
        val.ya--;
        val.ma += 12;
      }
      val.da = this.mdays[val.ma] + val.da;
    }
    return val;
  }

  //日付解析
  parseDate(str){
    const words = str.split("-");
    const ya = Math.floor(words[0]);
    const ma = Math.floor(words[1]);
    const da = Math.floor(words[2]);
    return {ya: ya, ma: ma, da: da};
  }

  //週取得
  getWeek(){
    var val = this.adjustCalendar();
    return val.wk;
  }

  //通算ミリセカンド取得チックタイム(元期1/1/1:0:0:0.000)
  getMS(){
    return this.getPDays() * this.DayMS;
  }

  //通算日数取得(元期1/1/1:0:0:0.000)
  getPDays(){
    var val = this.adjustCalendar();
    return val.pastdays;
  }

  //時間取得
  getTime(){
    var val = new N6LDate(this).normalize();
    var ms = val.getMS();
    ms = ms % this.DayMS;
    var t = ms;
    t %= this.DayMS;
    val.ho = Math.floor(t / this.HourMS);
    t %= this.HourMS;
    val.mo = Math.floor(t / this.MinMS);
    t %= this.MinMS;
    val.so = Math.floor(t / this.SecMS);
    return val;
  }

  //週番号
  getWeekNumber(){
    var val = this.adjustCalendar();
    return Math.floor(val.pastdays / 7);
  }

  //ISO Week Date（ISO 8601）
  getISOWeekDate(){
    var base = this.clone();
    var isoWeekDay = (base.wk + 2) % 7 + 1;
    var thursday = base.clone().addDays(4 - isoWeekDay);
    var isoYear = thursday.ya;
    var jan4 = new N6LDate(isoYear, 1, 4).normalize();
    var jan4_isoWeekDay = (jan4.wk + 2) % 7 + 1;
    var firstThursday = jan4.clone().addDays(4 - jan4_isoWeekDay);
    var isoWeek = Math.floor((thursday.getPDays() - firstThursday.getPDays()) / 7) + 1;
    return {isoYear: isoYear, isoWeek: isoWeek, isoWeekDay: isoWeekDay};
  }

  //ISO 8601 Time Duration（期間表記）
  getISOTimeDuration(target){
    var ms = this.diffMS(target);
    var sign = ms < 0 ? "-" : "";
    ms = Math.abs(ms);
    var year = Math.floor(ms / this.YearMS)
    ms -= year * this.YearMS
    var month = Math.floor(ms / this.MonMS)
    ms -= month * this.MonMS
    var day = Math.floor(ms / this.DayMS)
    ms -= day * this.DayMS
    var hour = Math.floor(ms / this.HourMS)
    ms -= hour * this.HourMS
    var minute = Math.floor(ms / this.MinMS)
    ms -= minute * this.MinMS
    var second = ms / this.SecMS   // 小数秒
    var str = `${sign}P${year}Y${month}M${day}DT${hour}H${minute}M${second.toFixed(3)}S`;
    return str;
  }

  //改暦情報
  getReformInfo(region = "GB", lng = "DEFAULT") {
    const reform = this.ReformTable[region] || this.ReformTable["GB"];
    var cnt;
    var jed = reform.julianEnd;
    var gsd = reform.gregorianStart;
    var rd = reform.reformDays;
    var str;
    if(lng === "DEFAULT"){
      cnt = reform.countryEN;
      str = `In ${cnt}, due to the calendar reform, the day following ${jed} was ${gsd}, and ${rd} days were skipped.`;
    } else {
      cnt = reform.countryJP;
      str = `${cnt}は改暦により ${jed} の翌日が ${gsd} となり、${rd} 日が欠落しました。`;
    }
    return str;
  }

  //ユリウス暦グレゴリオ暦改暦判定
  afterGregorian(val){
    var reform = this.ReformTable[this.region];
    var jed = this.parseDate(reform.julianEnd);
    var gsd = this.parseDate(reform.gregorianStart);
    gsd = this.suboneday(gsd);
    var rd = Math.floor(reform.reformDays);
    var cc = { ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0, region: val.region };
    var med = this.getMonthEnd(new N6LDate(cc.ya,cc.ma,cc.da,cc.ho,cc.mo,cc.so,cc.ms,cc.region),false);
    if(jed.ma == gsd.ma) med = gsd.da;
    if((val.ya < jed.ya) ||
      (val.ya == jed.ya && val.ma < jed.ma) ||
      ((val.ya == jed.ya && val.ma == jed.ma && val.da <= med) ||
       (val.ya == gsd.ya && val.ma == gsd.ma && val.da <= gsd.da))
    ) {
      return false;
    }
    return true;
  }

  //当年閏年判定
  isLeap(val, flg = true){
    if(flg) return ((val.ya % 4 === 0)&&((val.ya % 100 !== 0)||(val.ya % 400 === 0)));
    return (val.ya % 4 === 0);
  }

  //月末判定
  isMonthEnd(val){
    var wk = new N6LDate(val).normalize();
    var ed = this.getMonthEnd(wk);
    return (wk.da === ed);
  }

  //月末取得
  getMonthEnd(val, flg = true){
    var wk = new N6LDate(val);
    //安全に
    while(wk.da < 1){
      wk.ma--;
      wk.da = this.mdays[wk.ma] + wk.da;
      if(wk.ma < 1) {
        wk.ya--;
        wk.ma += 12;
      }
    }
    while(this.mdays[wk.ma] < wk.da){
      wk.ma++;
      wk.da = wk.da - this.mdays[wk.ma];
      if(12 < wk.ma) {
        wk.ya++;
        wk.ma = 1;
      }
    }
    if(flg) wk.normalize();
    var m = wk.ma;
    var ed = this.mdays[m];
    if(m == 2 && this.isLeap(wk)) ed++;
    return ed;
  }

  //通算閏年取得
  getLeap(val) {
    var reform = this.ReformTable[val.region];
    var jed = this.parseDate(reform.julianEnd);
    var gsd = this.parseDate(reform.gregorianStart);
    var rd = Math.floor(reform.reformDays);
    var cc = { ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0, region: this.region };
    var med = this.getMonthEnd(new N6LDate(cc.ya,cc.ma,cc.da,cc.ho,cc.mo,cc.so,cc.ms,cc.region),false);
    if(jed.ma == gsd.ma) med = gsd.da;

    var tmp = new N6LDate(val.ya, val.ma, val.da);
    if(0 < tmp.ma && tmp.ma < 3){
      tmp.ya--;
      tmp.ma += 12;
    }
    var ret = (Math.floor(tmp.ya / 4) - (Math.floor(tmp.ya / 100) - Math.floor(tmp.ya / 400)));
    if(tmp.ya < jed.ya) ret = ret + (Math.floor(tmp.ya / 100) - Math.floor(tmp.ya / 400));
    else ret += (rd + 2);
    return ret;
  }

  //副作用注意：this内容変更含む
  SetVal(val){
    if(val && val.typename == "N6LDate"){
      this.ya = val.ya;
      this.ma = val.ma;
      this.da = val.da;
      this.ho = val.ho;
      this.mo = val.mo;
      this.so = val.so;
      this.ms = val.ms;
      this.wk = val.wk;
      this.pastdays = val.pastdays;
      this.region = val.region;
      this.regionW = val.regionW;
    }
    return this;
  }

  // 通算日からグレゴリオ暦の日付オブジェクトを生成する
  //副作用注意：this内容変更含む
  gregorianDayToDate(targetDay, flg = true) {
    var val = new N6LDate(this);
    var day = Math.floor(targetDay);             // 処理対象の通算日
    var dms = targetDay - Math.floor(targetDay); // 処理対象の通算日小数部
    var msInDay = dms * this.DayMS;              // 1日の中のミリ秒

    var y400 = flg ? 146097 : 146100;
    val.ya = Math.floor(((day + 305) * 400) / y400);
    var lp = this.getLeap(val);
    var tdays = Math.floor(val.ya * 365) + lp;

    var reform = this.ReformTable[val.region];
    var rd = Math.floor(reform.reformDays);

    if(flg) tdays -= rd;

    var x = (day + 305) - tdays;
    if (365 < x) x -= 365;
    
    var m = 3;
    if (x <= 0) {
      var nl;
      if (flg) nl = ((val.ya % 4 === 0) && ((val.ya % 100 !== 0) || (val.ya % 400 === 0))) ? 1 : 0;
      else nl = (val.ya % 4 === 0) ? 1 : 0;
      val.ya--;
      tdays = tdays - (365 + nl);
      x = (day + 305) - tdays;
    }
    while (this.mdays[m] < x) {
      x -= this.mdays[m];
      m++;
      if (m === this.mdays.length - 1) break;
    }

    var wsub = 5;
    val.ma = m;
    if (12 < val.ma) { val.ya++; val.ma -= 12; }
    val.da = x;

    val.wk = Math.floor((day + wsub) % 7);


    // ms は通算ミリ秒（正規化前に addDays/addHours が更新している）
    var msTick = (day - 2) * this.DayMS + msInDay;
    var ms = msTick;
    val.pastdays = ms / this.DayMS;

    // 1日の中のミリ秒
    var t = ms % this.DayMS;
    if (t < 0) t += this.DayMS; // 負の値の補正

    val.ho = Math.floor(t / this.HourMS);
    t %= this.HourMS;

    val.mo = Math.floor(t / this.MinMS);
    t %= this.MinMS;

    val.so = Math.floor(t / this.SecMS);
    t %= this.SecMS;

    val.ms = Math.floor(t);
    return val;
  }

  // ユリウス暦加算処理（通算日からユリウス暦の日付オブジェクトを生成）
  //副作用注意：this内容変更含む
  julianDayToDate(targetDay, flg = false) {
    return this.gregorianDayToDate(targetDay, false);
  }

  // 日付調整処理（ユリウス暦・グレゴリオ暦自動処理）
  //副作用注意：this内容変更含む
  adjustCalendar(rh = null) {
    // 1. 起点となる現在の日付（this）の通算日を取得
    var sourceDays = this.calendarToDay(this);

    // 2. 加算値（オフセット）を確定
    var addDays = 0;
    if (rh && rh.typename == "N6LDate") {
      addDays = this.calendarToDay(rh) - sourceDays;
    } else if (typeof rh === "number") {
      addDays = rh;
    }

    // 3. 目的地のトータル通算日//this.pastdays//通算チックタイム
    var targetDay = sourceDays + addDays + (this.pastdays - Math.floor(this.pastdays));

    // 4. 改暦境界の通算日を定義（ユリウス暦最終日とグレゴリオ暦開始日）
    var reform = this.ReformTable[this.region];
    var jed = this.parseDate(reform.julianEnd);
    var gsd = this.parseDate(reform.gregorianStart);
    var rd = Math.floor(reform.reformDays);
    var julianEndDay = this.calendarToDay({ ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0 });
    var gregorianStartDay = this.calendarToDay({ ya: gsd.ya, ma: gsd.ma, da: gsd.da, ho: 0, mo: 0, so: 0, ms: 0 });

    // 5. 改暦をまたいだかの判定（必要に応じて ccflg などの拡張用）
    var ccflg = 0;
    if (sourceDays <= julianEndDay && targetDay >= gregorianStartDay) {
      ccflg = 1;  // ユリウス暦 → グレゴリオ暦
    } else if (sourceDays >= gregorianStartDay && targetDay <= julianEndDay) {
      ccflg = -1; // グレゴリオ暦 → ユリウス暦
    }

    // 6. 目的地の通算日がどちらの暦の空間にあるかで復元を厳密に分岐
    var val;
    if (targetDay >= gregorianStartDay) {
      val = this.gregorianDayToDate(targetDay, true);
    } else {
      val = this.julianDayToDate(targetDay, false);
    }

    this.SetVal(val);
    return this;
  }

  //[!!!通算ミリ秒!!!][日時週]正規化
  //副作用注意：this内容変更含む
  // 自身の日付・時間を正規化する（再帰を起こさない安全な実装）
  normalize(){
    // 単純に現在の自分の値をベースに adjustCalendar(0) を走らせることで、
    // 繰り上げ・繰り下げや日付の正規化を行う
    var val = new N6LDate(this);
    if(this.region === "SE"){//スウェーデン特殊歴
      // 1712-02-30 はそのまま許可
      if(val.ya === 1712 && val.ma === 2 && val.da === 30){
        return val;
      }
      // 1700-02-29 は存在しない → 1700-03-01 に補正
      if(val.ya === 1700 && val.ma === 2 && val.da === 29){
        val.ma = 3;
        val.da = 1;
      }
      // 1712-02-30 の翌日は 1712-03-01
      if(val.ya === 1712 && val.ma === 2 && val.da === 31){
        val.ma = 3;
        val.da = 1;
      }
      // 1700～1712 の特殊暦期間はユリウス暦 +1 日として扱う
      if(val.ya >= 1700 && val.ya <= 1712){
        // Julian +1 day
        // （あなたの calendarToDay / fromJD が自動で整合する）
        val = this.adjustCalendar(1);
      }
    }
    else {
      val = this.adjustCalendar();
      while(val.ma < 1){
        val.ma += 12;
        val.ya--;
      }
      while(12 < val.ma){
        val.ma -= 12;
        val.ya++;
      }
    }
    this.SetVal(val);
    return this;
  }



  // 差分ミリセカンド取得 (this - target)
  diffMS(target) {
    var lh = new N6LDate(this).normalize();
    var rh = new N6LDate(target).normalize();
    var ret = Math.floor(lh.getMS() - rh.getMS());
    return ret;
  }

  // 差分日数取得 (this - target)
  diffDays(target) {
    return this.diffMS(target) / this.DayMS;
  }

  // 差分構造体取得 (this - target)
  diffDuration(target){
    var ms = this.diffMS(target);
    var tt = ms;
    var ret = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 , millisecond: 0 };
    ret.year = tt / this.YearMS;
    tt %= this.YearMS;
    ret.month = tt / this.MonMS;
    tt %= this.MonMS;
    ret.day = tt / this.DayMS;
    tt %= this.DayMS;
    ret.hour = tt / this.HourMS;
    tt %= this.HourMS;
    ret.minute = tt / this.MinMS;
    tt %= this.MinMS;
    ret.second = tt / this.SecMS;
    tt %= this.SecMS;
    ret.millisecond = tt;
    return ret;
  }

  //比較演算
  isBefore(target) { return this.diffMS(target) < 0; }
  isAfter(target) { return this.diffMS(target) > 0; }
  isEqual(target, eps = 1e-6) { return Math.abs(this.diffMS(target)) <= eps; }

  // N6LDate 標準フォーマット定数
  // toString(fmtsw) のプリセット指定子として使用する
  static get N6LDATE_FMT_DEFAULT()  { return 0; }  // "2026/07/29(水) 04:55:04.123"
  static get N6LDATE_FMT_FULL()     { return 1; }  // "2026/07/29 04:55:04.123 (水)"
  static get N6LDATE_FMT_NW()       { return 2; }  // "2026/07/29 04:55:04.123"
  static get N6LDATE_FMT_DATE()     { return 3; }  // "2026/07/29(水)"
  static get N6LDATE_FMT_DATE_NW()  { return 4; }  // "2026/07/29"
  static get N6LDATE_FMT_ISO()      { return 5; }  // "2026-07-29(水) T 04:55:04.123 Z"
  static get N6LDATE_FMT_ISO_W()    { return 6; }  // "2026-07-29 T 04:55:04.123 Z (水)"
  static get N6LDATE_FMT_ISO_NW()   { return 7; }  // "2026-07-29 T 04:55:04.123 Z"
  static get N6LDATE_FMT_ISO_D()    { return 8; }  // "2026-07-29(水)"
  static get N6LDATE_FMT_ISO_D_NW() { return 9; }  // "2026-07-29"

  // フォーマット出力 (例: "2026/07/29 04:55:04 水")
  toString(fmtsw = 0) {
    const y = String(this.ya).padStart(4, '0');
    const m = String(this.ma).padStart(2, '0');
    const d = String(this.da).padStart(2, '0');
    const h = String(this.ho).padStart(2, '0');
    const min = String(this.mo).padStart(2, '0');
    const s = String(this.so).padStart(2, '0');
    const mss = String(this.ms).padStart(3, '0');
    const w = this.weeks[this.regionW][this.wk] || "";
    switch(fmtsw){
    case N6LDate.N6LDATE_FMT_ISO_D_NW:
             return `${y}-${m}-${d}`;
    case N6LDate.N6LDATE_FMT_ISO_D:
             return `${y}-${m}-${d}(${w})`;
    case N6LDate.N6LDATE_FMT_ISO_NW:
             return `${y}-${m}-${d} T ${h}:${min}:${s}.${mss} Z`;
    case N6LDate.N6LDATE_FMT_ISO_W:
             return `${y}-${m}-${d} T ${h}:${min}:${s}.${mss} Z (${w})`;
    case N6LDate.N6LDATE_FMT_ISO:
             return `${y}-${m}-${d}(${w}) T ${h}:${min}:${s}.${mss} Z`;
    case N6LDate.N6LDATE_FMT_DATE_NW:
             return `${y}/${m}/${d}`;
    case N6LDate.N6LDATE_FMT_DATE:
             return `${y}/${m}/${d}(${w})`;
    case N6LDate.N6LDATE_FMT_NW:
             return `${y}/${m}/${d} ${h}:${min}:${s}.${mss}`;
    case N6LDate.N6LDATE_FMT_FULL:
             return `${y}/${m}/${d} ${h}:${min}:${s}.${mss} (${w})`;
    case N6LDate.N6LDATE_FMT_DEFAULT:
    default:
             return `${y}/${m}/${d}(${w}) ${h}:${min}:${s}.${mss}`;
    }
  }

  // カスタムフォーマット出力
  // 例: date.format("YYYY-MM-DD hh:mm:ss.SSS (W)")
  format(pattern) {
    var wk = new N6LDate(this).normalize();

    var year = wk.ya;
    var month = wk.ma;
    var day = wk.da;

    var monthName = (wk.months && wk.months[wk.regionW])
      ? wk.months[wk.regionW][month - 1]
      : month;

    var totalSec = Math.floor(wk.ms / 1000);
    var ms = wk.ms % 1000;
    var second = totalSec % 60;
    var totalMin = Math.floor(totalSec / 60);
    var minute = totalMin % 60;
    var totalHour = Math.floor(totalMin / 60);
    var hour = totalHour % 24;
    var hour12 = hour % 12 === 0 ? 12 : hour % 12;
    var ampm = hour < 12 ? "AM" : "PM";

    var weekIndex = typeof wk.getWeek === "function" ? wk.getWeek() : 0;
    var weekStr = (wk.weeks && wk.weeks[wk.regionW][weekIndex]) ? wk.weeks[wk.regionW][weekIndex] : "";

    var pad = (n, len = 2) => String(n).padStart(len, '0');

    const map = {
      "YYYY": year,
      "YY": String(year).slice(-2),
      "MMMM": monthName,
      "MMM": monthName.slice(0,3),
      "MM": pad(month),
      "M": month,
      "DD": pad(day),
      "D": day,
      "hh": pad(hour),
      "h": hour,
      "HH": pad(hour),
      "mm": pad(minute),
      "m": minute,
      "ss": pad(second),
      "s": second,
      "SSS": pad(ms,3),
      "A": ampm,
      "W": weekStr
    };

    // 長いトークンを優先して正規表現で一括置換
    return pattern.replace(
      /YYYY|YY|MMMM|MMM|MM|M|DD|D|hh|h|HH|mm|m|ss|s|SSS|A|W/g,
      token => map[token]
    );
  }

  // Dateオブジェクト出力
  toDate() {
    return new Date(this.ya, this.ma - 1, this.da, this.ho, this.mo, this.so, this.ms);
  }
  // Temporalオブジェクト出力
  toTemporal() {
    if (typeof Temporal === "undefined" || !Temporal.Instant) {
      throw new Error("Temporal API (Temporal.Instant) が利用できない環境です");
    }

    const ms = this.toUNIXms();
    return Temporal.Instant.fromEpochMilliseconds(ms);
  }

  //現在日時で構築
  Now(){
    return new N6LDate().normalize();
  }

  // ユリウス日
  toJD(){
    var wk = new N6LDate(this).normalize();
    if (wk.ma < 3) {
      wk.ya = wk.ya - 1;
      wk.ma = wk.ma + 12;
    }
    var A = Math.floor(wk.ya / 100);
    var B = 2 - A + Math.floor(A / 4);
    var C = ((wk.pastdays % 1) + 1) % 1;

    var JD = Math.floor(this.JDYear * (wk.ya + 4716))
      + Math.floor(this.JDMon * (wk.ma + 1))
      + wk.da + B - 1524.5 + C;
    return JD;
  }

  fromJD(rh){
    var Z = Math.floor(rh + 0.5);
    var F = (rh + 0.5) - Z;

    var A = Z;

    var reform = this.ReformTable[this.region];
    var gsd = this.parseDate(reform.gregorianStart);
    gsd = this.suboneday(gsd);
    var cc = new N6LDate(gsd.ya, gsd.ma, gsd.da, 0, 0, 0, 0, this.region).normalize();
    var daysgsd = this.calendarToDay(cc);
    var jdepoch = 1721424; //1/1/1のJD
    if(Z >= jdepoch + daysgsd){
      var alpha = Math.floor((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    var B = A + 1524;
    var C = Math.floor((B - 122.1) / this.JDYear);
    var D = Math.floor(this.JDYear * C);
    var E = Math.floor((B - D) / this.JDMon);

    var day = B - D - Math.floor(this.JDMon * E) + F;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = (month > 2) ? C - 4716 : C - 4715;

    var fpd = ((day * this.DayMS) % this.DayMS) / this.DayMS;
    day = Math.floor(day);

    return new N6LDate(year, month, day, 0, 0, 0, 0, this.region, this.regionW, fpd).normalize();
  }

  // 修正ユリウス日
  toMJD(){
    var JD = this.toJD();
    return JD - 2400000.5;
  }

  fromMJD(rh){
    return this.fromJD(rh + 2400000.5).normalize();
  }

  // ユニックス時間秒
  toUNIX(){
    return (this.toJD() - 2440587.5) * 86400;
  }

  fromUNIX(rh){
    var jd = rh / 86400 + 2440587.5;
    return this.fromJD(jd).normalize();
  }

  // ユニックス時間ミリ秒
  toUNIXms(){
    return (this.toJD() - 2440587.5) * 86400000;
  }

  fromUNIXms(rh){
    var jd = rh / 86400000 + 2440587.5;
    return this.fromJD(jd).normalize();
  }

  //シリアライズ
  //const dt = new N6LDate(2030, 9, 15, 12, 34, 56, 789).normalize();
  //dt.region = "JP";
  //const json = JSON.stringify(dt);          // toJSONが自動呼び出し
  // → {"year":2030,"month":9,"day":15,...}
  //const restored = N6LDate.fromJSON(JSON.parse(json));
  //console.log(restored.toString());         // 2030/09/15(Sun) 12:34:56.789
  toJSON() {
    // normalize() 済みであることを前提（または内部で軽くチェック）
    return {
      // 暦値（コンストラクタで使う用）
      year: this.ya,
      month: this.ma,
      day: this.da,
      hour: this.ho,
      minute: this.mo,
      second: this.so,
      ms: this.ms,

      // 設定
      region: this.region,
      regionW: this.regionW,

      // 高精度復元用（優先度高い）
      unixms: this.toUNIXms(),
      jd: this.toJD(),

      // 参考情報
      pastday: this.pastdays,
      week: this.getWeek(),
    };
  }


  static fromJSON(json) {
    var dt;

    // 1. 暦値が揃っている場合はそれを優先（今回の方式）
    if (json.year != null) {
      dt = new N6LDate(
        json.year,
        json.month  || 1,
        json.day    || 1,
        json.hour   || 0,
        json.minute || 0,
        json.second || 0,
        json.ms     || 0
      );
    }
    // 2. unixms がある場合
    else if (json.unixms != null) {
      dt = new N6LDate(json.unixms);
    }
    // 3. jd がある場合
    else if (json.jd != null) {
      dt = new N6LDate().fromJD(json.jd);
    }
    else {
      throw new Error("Invalid JSON for N6LDate");
    }

    if (json.region)  dt.region  = json.region;
    if (json.regionW) dt.regionW = json.regionW;

    // pastdays の事前セット（今回のやり方を維持）
    if (typeof dt.tempPDays === "function") {
      dt.pastdays = dt.tempPDays(dt);
    }

    return dt.normalize();
  }

  startOf(unit) {
    var dt = this.clone();  // イミュータブル

    switch (unit) {
    case 'day':
      dt.ho = 0;
      dt.mo = 0;
      dt.so = 0;
      dt.ms = 0;          // または this のミリ秒部分を0に
      break;

    case 'month':
      dt.da = 1;
      dt.ho = 0;
      dt.mo = 0;
      dt.so = 0;
      dt.ms = 0;
      break;

    case 'year':
      dt.ma = 1;
      dt.da = 1;
      dt.ho = 0;
      dt.mo = 0;
      dt.so = 0;
      dt.ms = 0;
      break;

    case 'week':
      // 例: 月曜日始まりの場合
      const weekDay = dt.getWeek();  // 既存の getWeek() を活用
      // 必要日数を引く
      dt = dt.addDays( -((weekDay + 5) % 7) );  // 調整
      dt.ho = 0;
      dt.mo = 0;
      dt.so = 0;
      dt.ms = 0;
      break;
    default:
      break;
    }
    var fpd = dt.tempPDays(dt);
    dt.pastdays = fpd;
    return dt.normalize();  // ここが重要
  }

  endOf(unit) {
    var dt = this.clone();  // イミュータブル

    switch (unit) {
    case 'day':
      dt.ho = 23;
      dt.mo = 59;
      dt.so = 59;
      dt.ms = 999;
      break;

    case 'month':
      dt.da = dt.getMonthEnd(dt);
      dt.ho = 23;
      dt.mo = 59;
      dt.so = 59;
      dt.ms = 999;
      break;

    case 'year':
      dt.ma = 12;
      dt.da = 31;
      dt.ho = 23
      dt.mo = 59;
      dt.so = 59;
      dt.ms = 999;
      break;

    case 'week':
      // 例: 月曜日始まりの場合
      const weekDay = dt.getWeek();  // 既存の getWeek() を活用
      // 必要日数を足す
      dt = dt.addDays( ((weekDay + 1) % 7) );  // 調整
      dt.ho = 23;
      dt.mo = 59;
      dt.so = 59;
      dt.ms = 999;
      break;
    default:
      break;
    }
    var fpd = dt.tempPDays(dt);
    dt.pastdays = fpd;
    return dt.normalize();  // ここが重要
  }

  // 各種加算//引数を少数を含む経過日にしてadjustCalendarを叩くだけ
  addYears(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh * this.YearMS / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

  addMonths(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh * this.MonMS / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

  addDays(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh;
    return wk.adjustCalendar(rhdays);
  }

  addHours(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh * this.HourMS / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

  addMinutes(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh * this.MinMS / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

  addSeconds(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh * this.SecMS / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

  addMSs(rh) {
    var wk = this.clone();  // イミュータブル
    var rhdays = rh / this.DayMS;
    return wk.adjustCalendar(rhdays);
  }

}

