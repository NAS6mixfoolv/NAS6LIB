//Programed by NAS6
//transpile.js

// ================================================================
// ブロック
// ================================================================

class N6LTranspilerBlock {
    constructor(mode, buffer) {
        this.mode = mode;
        this.buffer = buffer;
    }
}

// ================================================================
// トランスパイラー
// ================================================================

class N6LTranspiler {

    constructor(source, config) {
        this.config = config || {
            "langName": "N6LScript",

            "langBlockSyntax": {
                "start": "\\N---[",
                "end":   "]---\\N"
            },

            "replace": []
        };
        this.blocks =
        N6LTranspiler.splitBlocks(source, config);
    }


    // ============================================================
    // JS / N6LScript ブロック分離
    // ============================================================

    static splitBlocks(source, config, flg = false) {

        const lname = flg ? "eraseSpaceBlock" : config.langName;
        const start = flg ? config.langBlockSyntax.esstart : config.langBlockSyntax.start;
        const end   = flg ? config.langBlockSyntax.esend : config.langBlockSyntax.end;

        const lines = source.split("\n");

        const blocks = [];

        let mode = flg ? "normalBlock" : "JS";
        let buffer = [];


        for (const line of lines) {

            if (line.trim().startsWith(start)) {

                if (buffer.length > 0) {

                    blocks.push(
                        new N6LTranspilerBlock(
                            flg ? "normalBlock" : "JS",
                            [...buffer]
                        )
                    );

                    buffer = [];
                }

                mode = lname;
                continue;
            }


            if (line.trim().startsWith(end)) {

                if (buffer.length > 0) {

                    blocks.push(
                        new N6LTranspilerBlock(
                            lname,
                            [...buffer]
                        )
                    );

                    buffer = [];
                }

                mode = flg ? "normalBlock" : "JS";
                continue;
            }


            buffer.push(line);
        }


        if (buffer.length > 0) {

            blocks.push(
                new N6LTranspilerBlock(
                    mode,
                    [...buffer]
                )
            );
        }


        return blocks;
    }


    // ============================================================
    // Transpile
    // ============================================================

    transpile() {

        let jsCode = "";

        for (const blk of this.blocks) {

            if (blk.mode === "JS") {

                jsCode += blk.buffer.join("\n");
                jsCode += "\n";

            } else {

                jsCode +=
                    this.transpileMyLang(
                        blk.buffer
                    );
            }
        }

        return jsCode;
    }


    // ============================================================
    // N6LScript
    // ============================================================

    transpileMyLang(lines) {

        let code = lines.join("\n");

        let blk = N6LTranspiler.splitBlocks(code, this.config, true);

        code = this.eraseSpaceBlock(blk);

        return (
            `//[${this.config.langName} BlockStart transpiled]\n` +
            this.processExpr(
                code,
                this.config
            ) +
            `\n//[${this.config.langName} BlockEnd]\n`
        );
    }

    eraseSpaceBlock(blk) {
        let rep = "";

        for (const bk of blk) {

            if (bk.mode === "normalBlock") {

                rep += bk.buffer.join("\n");
                rep += "\n";

            } else {
                // 1. まず配列を一旦テキスト（文字列）に結合する
                let text = bk.buffer.join("\n");

                // 2. タブとスペースを除去する（split / join を使用）
                text = text.split('\t').join('');
                text = text.split(' ').join('');

                // 3. 処理済みの文字列を追加する
                rep += text;
                rep += "\n";
            }
        }

        return rep;
    }

    // ============================================================
    // 式処理
    // ============================================================

    processExpr(code, config) {
        let processed = code;

       // config.replace の適用: [i][1] → [i][0] に置換
        if (config && config.replace) {
            for (let i = 0; i < config.replace.length; i++) {
                const target = config.replace[i][1];
                const replacement = config.replace[i][0];
      
                // 正規表現のエスケープを避けるため split / join を使用して全置換
                processed = processed.split(target).join(replacement);
            }
        }

        return processed;
    }

}

/*

// ================================================================
// グローバル ：　N6LTranspiler を利用する為の簡単なチュートリアル
// ================================================================

function parseConfig(res) {
  let cfg;

  try {
    // JSON としてパース
    cfg = JSON.parse(res);
  } catch (e) {
    console.error("Config JSON parse error:", e);
    return null;
  }

  // --- 必須フィールドチェック ---
  if (!cfg.langName) {
    console.error("Config error: langName is required");
    return null;
  }

  return cfg;
}

let N6LTPConfig;

function readedConfig(res) {
  // 設定ファイルのテキストを専用エリアに表示
  const configEl = document.getElementById("config-output");
  if (configEl) configEl.textContent = res;

  N6LTPConfig = parseConfig(res);
  return true;
}

function readedCode(res) {
  // 元コードを専用エリアに表示
  const codeEl = document.getElementById("code-output");
  if (codeEl) codeEl.textContent = res;

  const config = N6LTPConfig;
  let TP = new N6LTranspiler(res, config);
  const jsCode = TP.transpile();

  // トランスパイル後のJSコードを専用エリアに表示
  const jsEl = document.getElementById("js-output");
  if (jsEl) jsEl.textContent = jsCode;

  try {
      console.log("\nCode Is Executed.\n");
      eval(jsCode);
  } catch(e) {
      console.error("Transpiled code execution error:", e);
  }

  return true;
}
    
function analyzeConfig(res) {
  return res;
}
    
function analyzeCode(res) {
  return res;
}

async function enter(){
    const scriptEl = document.getElementById("main-script");
    const scriptOutputEl = document.getElementById("script-output");
    if (scriptEl && scriptOutputEl) {
        scriptOutputEl.textContent = scriptEl.textContent;
    }
    const originalConsoleLog = console.log;
    const logBuffer = [];

    console.log = function(...args) {
        originalConsoleLog.apply(console, args);

        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
            }
            return String(arg);
        }).join(" ");

        logBuffer.push(message);

        const outputEl = document.getElementById("pre-output");
        if (outputEl) {
            outputEl.textContent = logBuffer.join("\n");
        }
    };

    try {
        // 1. コンフィグを確実にロードしてパース完了を待つ
        const configRes = await (await fetch('./data/testconfig001.txt')).text();
        const analyzedConfig = analyzeConfig(configRes);
        readedConfig(analyzedConfig); // ここで N6LTPConfig が確実にセットされる

        // 2. コンフィグ完了後にコードをロードして処理
        const codeRes = await (await fetch('./data/testcode001.txt')).text();
        const analyzedCodeText = analyzeCode(codeRes);
        readedCode(analyzedCodeText);

    } catch (e) {
        console.error("File load error:", e);
    }
}
*/
