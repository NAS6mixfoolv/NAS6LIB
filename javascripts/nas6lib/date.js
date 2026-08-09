//Programed by NAS6
//date.js

class N6LDate {

  //var dt = new N6LDate().normalize();のように.normalize()を必ずつけてください
  constructor(ya, ma, da, ho, mo, so, ms, region = "JP") {
    this.typename = "N6LDate";
    this.ya = 1;
    this.ma = 1;
    this.da = 1; // MDN準拠: 引数なしの場合は日を1に
    this.ho = 0;
    this.mo = 0;
    this.so = 0;
    this.ms = 0; // tick: 通算ミリセカンドとして保持
    this.wk = 0;
    this.pastdays = 0;
    this.weeks = ["土", "日", "月", "火", "水", "木", "金"];
    this.mdays = [0,31,28,31,30,31,30,31,31,30,31,30,31,31,28];
    this.ReformTable = {
      JP: { julianEnd: "1582-10-04", gregorianStart: "1582-10-14", reformDays: "10" },
      GB: { julianEnd: "1752-09-02", gregorianStart: "1752-09-13", reformDays: "11" },
      RU: { julianEnd: "1918-01-31", gregorianStart: "1918-02-13", reformDays: "13" },
      GR: { julianEnd: "1923-02-15", gregorianStart: "1923-02-28", reformDays: "13" },
    };
    if(region === "JP" || region === "GB" || region === "RU" || region === "GR") this.region = region;
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
      this.ho = now.getHours();
      this.mo = now.getMinutes();
      this.so = now.getSeconds();
      this.ms = now.getMilliseconds();
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
        this.region = ya.region;
      }
      // 標準の Date オブジェクトの場合
      else if (ya instanceof Date) {
        this.ya = ya.getFullYear();
        this.ma = ya.getMonth() + 1;
        this.da = ya.getDate();
        this.ho = ya.getHours();
        this.mo = ya.getMinutes();
        this.so = ya.getSeconds();
        this.ms = ya.getMilliseconds();
      }
      else if (typeof ya.getFullYear === "function") {
        // その他の getter 持ちオブジェクト
        this.ya = ya.getFullYear();
        this.ma = ya.getMonth() + 1;
        this.da = ya.getDate();
        this.ho = ya.getHours();
        this.mo = ya.getMinutes();
        this.so = ya.getSeconds();
        this.ms = ya.getMilliseconds();
      } 
      else if (typeof ya === "string") {
        // 文字列からの生成
        const d = new Date(ya);
        if (!isNaN(d.getTime())) {
          this.ya = d.getFullYear();
          this.ma = d.getMonth() + 1;
          this.da = d.getDate();
          this.ho = d.getHours();
          this.mo = d.getMinutes();
          this.so = d.getSeconds();
          this.ms = d.getMilliseconds();
        }
      } 
      else if (typeof ya === "number") {
        // 数値、または複数の数値引数パターン
        if (ma === undefined || ma === null) {
          const d = new Date(ya);
          this.ya = d.getFullYear();
          this.ma = d.getMonth() + 1;
          this.da = d.getDate();
          this.ho = d.getHours();
          this.mo = d.getMinutes();
          this.so = d.getSeconds();
          this.ms = d.getMilliseconds();
        } else {
          this.ya = ya;
          this.ma = ma;
          var dms = 0;
          if (da !== undefined && da !== null) { this.da = Math.floor(da); dms += ((da - Math.floor(da)) * this.DayMS); }
          if (ho !== undefined && ho !== null) { this.ho = Math.floor(ho); dms += (ho * this.HourMS); }
          if (mo !== undefined && mo !== null) { this.mo = Math.floor(mo); dms += (mo * this.MinMS); }
          if (so !== undefined && so !== null) { this.so = Math.floor(so); dms += (so * this.SecMS); }
          if (ms !== undefined && ms !== null) { this.ms = ms % this.SecMS; dms += (ms % this.SecMS); }
          if (region !== undefined && region !== null) this.region = region;
          this.ms += dms;
        }
      }
    }
}

  clone() {
    return new N6LDate(this).normalize();
  }

  static get N6LDATE_FMT_DEFAULT()  { return 0; }  // "2026/07/29(水) 04:55:04.123"
  static get N6LDATE_FMT_FULL()     { return 1; }  // "2026/07/29 04:55:04.123 (水)"
  static get N6LDATE_FMT_NW()       { return 2; }  // "2026/07/29 04:55:04.123"
  static get N6LDATE_FMT_DATE()     { return 3; }  // "2026/07/29(水)"
  static get N6LDATE_FMT_DATE_NW()  { return 4; }  // "2026/07/29"
  static get N6LDATE_FMT_ISO()      { return 5; }  // "2026-07-29(水)T04:55:04.123Z"
  static get N6LDATE_FMT_ISO_W()    { return 6; }  // "2026-07-29T04:55:04.123Z(水)"
  static get N6LDATE_FMT_ISO_NW()   { return 7; }  // "2026-07-29T04:55:04.123Z"
  static get N6LDATE_FMT_ISO_D()    { return 8; }  // "2026-07-29(水)"
  static get N6LDATE_FMT_ISO_D_NW() { return 9; }  // "2026-07-29"

  //ユリウス暦通算日数取得誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
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
    if(flg) ret2 = (val.ho * this.HourMS + val.mo * this.MinMS + val.so * this.SecMS + (val.ms % this.SecMS)) / this.DayMS;
    return ret + ret2;
  }

  //グレゴリオ暦通算日数取得誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
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
    if(flg) ret2 = (val.ho * this.HourMS + val.mo * this.MinMS + val.so * this.SecMS + (val.ms % this.SecMS)) / this.DayMS;
    return ret + ret2;
  }

  //通算日数取得(ユリウス暦・グレゴリオ暦自動処理)誤差含む
  //また正確な経過日数はnormalize()かadjustCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
  calendarToDay(val, flg = false) {
    if(!this.afterGregorian(val)) {
      return this.julianDayRaw(val, flg);
    }
    else {
      var reform = this.ReformTable[this.region];
      var jed = this.parseDate(reform.julianEnd);
      var gsd = this.parseDate(reform.gregorianStart);
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

  //通算ミリセカンド取得
  getMS(){
    var val = this.adjustCalendar();
    return val.ms;
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

  //ユリウス暦グレゴリオ暦改暦
  afterGregorian(val){
    var reform = this.ReformTable[this.region];
    var jed = this.parseDate(reform.julianEnd);
    var gsd = this.parseDate(reform.gregorianStart);
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

  //this内容変更含む
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
    }
    return this;
  }

  // 通算日からグレゴリオ暦の日付オブジェクトを生成する
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
    var msTick = day * this.DayMS + msInDay;
    var ms = msTick;

    // 1日の中のミリ秒
    var t = ms % this.DayMS;
    if (t < 0) t += this.DayMS; // 負の値の補正

    val.ho = Math.floor(t / this.HourMS);
    t %= this.HourMS;

    val.mo = Math.floor(t / this.MinMS);
    t %= this.MinMS;

    val.so = Math.floor(t / this.SecMS);
    t %= this.SecMS;

    // ms を通算ミリ秒に復元//this.ms//通算チックタイム
    val.ms = msTick;

/*
    // 時刻・ミリ秒の計算
    var tt = Math.floor((day * this.DayMS) % this.DayMS); // ※日数の小数部分や時刻の復元
    val.ms = (day - 2) * this.DayMS;
    val.pastdays = val.ms / this.DayMS;

    var ms = val.ms % this.DayMS;
    var t = ms % this.DayMS;
    val.ho = Math.floor(t / this.HourMS);
    t %= this.HourMS;
    val.mo = Math.floor(t / this.MinMS);
    t %= this.MinMS;
    val.so = Math.floor(t / this.SecMS);
*/
    return val;
  }

  // ユリウス暦加算処理（通算日からユリウス暦の日付オブジェクトを生成）
  julianDayToDate(targetDay, flg = false) {
    return this.gregorianDayToDate(targetDay, false);
  }

  // 日付調整処理（ユリウス暦・グレゴリオ暦自動処理）
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

    // 3. 目的地のトータル通算日//this.ms//通算チックタイム
    var targetDay = sourceDays + addDays + ( this.ms % this.DayMS ) / this.DayMS;

    // 4. 改暦境界の通算日を定義（ユリウス暦最終日とグレゴリオ暦開始日）
    var reform = this.ReformTable[this.region];
    var jed = this.parseDate(reform.julianEnd);
    var gsd = this.parseDate(reform.gregorianStart);
    var med = this.mdays[jed.ma];
    if(med < gsd.da + 1){
      gsd.ma++;
      gsd.da = 0;
    }
    else if(jed.ma + 1 == gsd.ma){
      ;
    }
    var rd = Math.floor(reform.reformDays);
    var julianEndDay = this.calendarToDay({ ya: jed.ya, ma: jed.ma, da: jed.da, ho: 0, mo: 0, so: 0, ms: 0 });
    var gregorianStartDay = this.calendarToDay({ ya: gsd.ya, ma: gsd.ma, da: gsd.da + 1, ho: 0, mo: 0, so: 0, ms: 0 });

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
  //this内容変更含む
  // 自身の日付・時間を正規化する（再帰を起こさない安全な実装）
  normalize(){
    // 単純に現在の自分の値をベースに adjustCalendar(0) を走らせることで、
    // 繰り上げ・繰り下げや日付の正規化を行う
    var val = this.adjustCalendar();
    if(12 < val.ma){
      val.ma -= 12;
      val.ya++;
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

  // フォーマット出力 (例: "2026/07/29 04:55:04 水")
  toString(fmtsw = 0) {
    const y = String(this.ya).padStart(4, '0');
    const m = String(this.ma).padStart(2, '0');
    const d = String(this.da).padStart(2, '0');
    const h = String(this.ho).padStart(2, '0');
    const min = String(this.mo).padStart(2, '0');
    const s = String(this.so).padStart(2, '0');
    const mss = String(Math.floor(this.ms % this.SecMS)).padStart(3, '0');
    const w = this.weeks[this.wk] || "";
    switch(fmtsw){
    case N6LDate.N6LDATE_FMT_ISO_D_NW:
             return `${y}-${m}-${d}`;
    case N6LDate.N6LDATE_FMT_ISO_D:
             return `${y}-${m}-${d}(${w})`;
    case N6LDate.N6LDATE_FMT_ISO_NW:
             return `${y}-${m}-${d}T${h}:${min}:${s}.${mss}Z`;
    case N6LDate.N6LDATE_FMT_ISO_W:
             return `${y}-${m}-${d}T${h}:${min}:${s}.${mss}Z(${w})`;
    case N6LDate.N6LDATE_FMT_ISO:
             return `${y}-${m}-${d}(${w})T${h}:${min}:${s}.${mss}Z`;
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

  // Dateオブジェクト出力
  toDate() {
    return new Date(this.ya, this.ma - 1, this.da, this.ho, this.mo, this.so, Math.floor(this.ms % this.SecMS));
  }

  //現在日時でクリエイト
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
    var C = Math.floor(wk.ms % this.DayMS) / this.DayMS;

    var JD = Math.floor(this.JDYear * (wk.ya + 4716))
      + Math.floor(this.JDMon * (wk.ma + 1))
      + wk.da + B - 1524.5 + C;
    return JD;
  }

  // ユリウス日
  fromJD(rh){
    var Z = Math.floor(rh + 0.5);
    var F = (rh + 0.5) - Z;

    var A = Z;
    if(Z >= 2299161){
      var alpha = Math.floor((Z - 1867216.25) / 36524.25);
      A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    var B = A + 1524;
    var C = Math.floor((B - 122.1) / this.JDYear);
    var D = Math.floor(this.JDYear * C);
    var E = Math.floor((B - D) / this.JDMon);

    var day = B - D - Math.floor(30.6001 * E) + F;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = (month > 2) ? C - 4716 : C - 4715;

    var ms = Math.floor((day % 1) * this.DayMS);
    day = Math.floor(day);

    return new N6LDate(year, month, day).normalize().addMSs(ms).normalize();
  }

  // 修正ユリウス日
  toMJD(){
    var JD = this.toJD();
    return JD - 2400000.5;
  }

  // 修正ユリウス日
  fromMJD(rh){
    return this.fromJD(rh + 2400000.5).normalize();
  }

  // ユニックス時間
  toUNIX(){
    return (this.toJD() - 2440587.5) * 86400;
  }

  // ユニックス時間
  fromUNIX(rh){
    var jd = rh / 86400 + 2440587.5;
    return this.fromJD(jd).normalize();
  }

  // 各種加算
  addYears(rh) {
    var rhdays = rh * this.YearMS / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

  addMonths(rh) {
    var rhdays = rh * this.MonMS / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

  addDays(rh) {
    var rhdays = rh;
    return this.adjustCalendar(rhdays);
  }

  addHours(rh) {
    var rhdays = rh * this.HourMS / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

  addMinutes(rh) {
    var rhdays = rh * this.MinMS / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

  addSeconds(rh) {
    var rhdays = rh * this.SecMS / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

  addMSs(rh) {
    var rhdays = rh / this.DayMS;
    return this.adjustCalendar(rhdays);
  }

}

