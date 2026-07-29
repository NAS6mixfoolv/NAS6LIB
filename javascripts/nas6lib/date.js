//Programed by NAS6
//date.js

class N6LDate {

  //var dt = new N6LDate().normalize();のように.normalize()を必ずつけてください
  constructor(ya, ma, da, ho, mo, so, ms) {
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
          if (da !== undefined && da !== null) this.da = da;
          if (ho !== undefined && ho !== null) this.ho = ho;
          if (mo !== undefined && mo !== null) this.mo = mo;
          if (so !== undefined && so !== null) this.so = so;
          if (ms !== undefined && ms !== null) this.ms = ms;
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
  //また正確な経過日数はnormalize()かaddCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
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
  //また正確な経過日数はnormalize()かaddCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
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
  //また正確な経過日数はnormalize()かaddCalendar()後N6LDate.pastdayかN6LDate.msから取得してください
  calendarToDay(val, flg = false) {
    if(!this.afterGregorian(val)) {
      return this.julianDayRaw(val, flg);
    }
    else {
      var cc = { ya: 1582, ma: 10, da: 5, ho: 0, mo: 0, so: 0, ms: 0 };
      if((val.ya == 1582 && val.ma == 10 && 4 < val.da && val.da < 15)) {
        return this.julianDayRaw(cc, flg);
      }
      return (this.gregorianDayRaw(val, flg) - this.gregorianDayRaw(cc, flg) + this.julianDayRaw(cc, flg) - 10);
    }
  }

  //週取得
  getWeek(){
    var val = this.addCalendar();
    return val.wk;
  }

  //通算ミリセカンド取得
  getMS(){
    var val = this.addCalendar();
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
    var val = this.addCalendar();
    return Math.floor(val.pastdays / 7);
  }

  //ユリウス暦グレゴリオ暦改暦
  afterGregorian(val){
    if(
      val.ya < 1582 ||
      (val.ya == 1582 && val.ma < 10) ||
      (val.ya == 1582 && val.ma == 10 && val.da < 5)
    ) {
      return false;
    }
    return true;
  }

  //当年閏年判定
  isLeap(val){
    return ((val.ya % 4 === 0)&&((val.ya % 100 !== 0)||(val.ya % 400 === 0)));
  }

  //月末判定
  isMonthEnd(val){
    var wk = new N6LDate(val).normalize();
    var ed = this.getMonthEnd(wk);
    return (wk.da === ed);
  }

  //月末取得
  getMonthEnd(val){
    var wk = new N6LDate(val).normalize();
    var m = wk.ma;
    var ed = this.mdays[m];
    if(m == 2 && this.isLeap(wk)) ed++;
    return ed;
  }

  //通算閏年取得
  getLeap(val) {
    var tmp = new N6LDate(val.ya, val.ma, val.da);
    if(0 < tmp.ma && tmp.ma < 3){
      tmp.ya--;
      tmp.ma += 12;
    }
    var ret = (Math.floor(tmp.ya / 4) - (Math.floor(tmp.ya / 100) - Math.floor(tmp.ya / 400)));
    if(tmp.ya < 1600) ret = ret + (Math.floor(tmp.ya / 100) - Math.floor(tmp.ya / 400));
    else ret += 12;
    return ret;
  }

  // グレゴリオ歴加算処理
  // daya, ソース　：基準の通算日：小数点も可
  // add, デスト　 ：オフセットの加算通算日：小数点も可
  // flg, フラグ　 ：グレゴリオ歴かユリウス歴かのフラグ
  // 戻り値　　　　：正規化された加算した実際の日付
  addGregorian(daya, add = 0, flg = true) {
    if(!add) add = 0;
    var day = daya + add;
    var val = new N6LDate(this);
    // x は3月1日を起点とした年内日数
    // 1～2月は前年の13・14月として扱う（フェアフィールド方式）
    if(val.ma == 1 || val.ma == 2){
      val.ya--;
      val.ma += 12;
    }
    var y400 = flg ? 146097 : 146100; //365.2425 * 400 : 365.25 * 400
    val.ya = Math.floor(((day+305)*400)/y400);
    var lp = this.getLeap(val);
    var tdays = Math.floor(val.ya * 365) + lp;
    if(flg) tdays -= 10;//改暦閏年
    var x = (day + 305) - tdays;
    if(365 < x) x -= 365;
    var m = 3;
    if(x <= 0){
      var nl;
      if(flg) nl = ((val.ya % 4 === 0)&&((val.ya % 100 !== 0)||(val.ya % 400 === 0))) ? 1 : 0;
      else nl = (val.ya % 4 === 0) ? 1 : 0;
      val.ya--;
      tdays = tdays - (365 + nl);
      x = (day + 305) - tdays;
    }
    while(this.mdays[m] < x){
      x -= this.mdays[m];
      m++;
      if(m === this.mdays.length - 1) break;
    }

    var wsub = 5;
    val.ma = m;
    if(12 < val.ma) { val.ya++; val.ma -= 12; }
    val.da = x;

    val.wk = (day + wsub) % 7;

    var tt = Math.floor((add * this.DayMS + this.ms) % this.DayMS);
    val.ms = day  * this.DayMS + tt;

    val.pastdays = val.ms / this.DayMS;

    var ms = val.ms % this.DayMS;
    var t = ms;
    t %= this.DayMS;
    val.ho = Math.floor(t / this.HourMS);
    t %= this.HourMS;
    val.mo = Math.floor(t / this.MinMS);
    t %= this.MinMS;
    val.so = Math.floor(t / this.SecMS);

    return val;
  }

  //ユリウス歴加算処理
  addJulian(daya, add = 0) {
    return this.addGregorian(daya, add, false);
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
    }
    return this;
  }

  //加算処理(ユリウス暦後レゴリオ歴自動処理)
  //及び正規の日付を返す
  //this内容変更含む
  addCalendar(rh = null){
    var val1 = new N6LDate(this)
    var days1;
    days1 = this.calendarToDay(val1);
    var val0;
    var days0 = 0;
    if (rh && rh.typename == "N6LDate") {
      val0 = new N6LDate(rh);
      days0 = this.calendarToDay(rh);
    } else if (typeof rh === "number") {
      days0 = rh;
    }
    days0 = days0 - days1;

    var daya = days0 + days1;
    var val;

    if(this.afterGregorian(val1)) {
      val = this.addGregorian(daya, days1);
    }
    else {
      val = this.addJulian(daya, days1);
    }
    this.SetVal(val);
    return this;
  }

  //[!!!通算ミリ秒!!!][日時週]正規化
  //this内容変更含む
  // 自身の日付・時間を正規化する（再帰を起こさない安全な実装）
  normalize(){
    // 単純に現在の自分の値をベースに addCalendar(0) を走らせることで、
    // 繰り上げ・繰り下げや日付の正規化を行う
    var val = this.addCalendar();
    this.SetVal(val);
    return this;
  }

  // 差分ミリセカンド取得 (this - target)
  diffMS(target) {
    var lh = new N6LDate(this).normalize();
    var rh = new N6LDate(target).normalize();
    return Math.floor(lh.getMS() - rh.getMS());
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
    var val = new N6LDate(this).normalize();
    val.ya = Math.floor(val.ya + rh);
    return val.normalize();
  }

  addMonths(rh) {
    var val = new N6LDate(this).normalize();
    var total = val.ma - 1 + Math.floor(rh);
    val.ya += Math.floor(total / 12);
    val.ma = Math.floor((total % 12) + 12) % 12 + 1;
    return val.normalize();
  }

  addDays(rh) {
    var rhdays = rh;
    return this.addCalendar(rhdays);
  }

  addHours(rh) {
    var rhdays = rh  * this.HourMS / this.DayMS;
    return this.addCalendar(rhdays);
  }

  addMinutes(rh) {
    var rhdays = rh * this.MinMS / this.DayMS;
    return this.addCalendar(rhdays);
  }

  addSeconds(rh) {
    var rhdays = rh * this.SecMS / this.DayMS;
    return this.addCalendar(rhdays);
  }

  addMSs(rh) {
    var rhdays = rh / this.DayMS;
    return this.addCalendar(rhdays);
  }

}

