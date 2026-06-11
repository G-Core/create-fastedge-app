#!/usr/bin/env node

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/arg@5.0.2/node_modules/arg/index.js
var require_arg = __commonJS({
  "node_modules/.pnpm/arg@5.0.2/node_modules/arg/index.js"(exports, module) {
    var flagSymbol = /* @__PURE__ */ Symbol("arg flag");
    var ArgError = class _ArgError extends Error {
      constructor(msg, code) {
        super(msg);
        this.name = "ArgError";
        this.code = code;
        Object.setPrototypeOf(this, _ArgError.prototype);
      }
    };
    function arg2(opts, {
      argv = process.argv.slice(2),
      permissive = false,
      stopAtPositional = false
    } = {}) {
      if (!opts) {
        throw new ArgError(
          "argument specification object is required",
          "ARG_CONFIG_NO_SPEC"
        );
      }
      const result = { _: [] };
      const aliases = {};
      const handlers = {};
      for (const key of Object.keys(opts)) {
        if (!key) {
          throw new ArgError(
            "argument key cannot be an empty string",
            "ARG_CONFIG_EMPTY_KEY"
          );
        }
        if (key[0] !== "-") {
          throw new ArgError(
            `argument key must start with '-' but found: '${key}'`,
            "ARG_CONFIG_NONOPT_KEY"
          );
        }
        if (key.length === 1) {
          throw new ArgError(
            `argument key must have a name; singular '-' keys are not allowed: ${key}`,
            "ARG_CONFIG_NONAME_KEY"
          );
        }
        if (typeof opts[key] === "string") {
          aliases[key] = opts[key];
          continue;
        }
        let type = opts[key];
        let isFlag = false;
        if (Array.isArray(type) && type.length === 1 && typeof type[0] === "function") {
          const [fn] = type;
          type = (value, name, prev = []) => {
            prev.push(fn(value, name, prev[prev.length - 1]));
            return prev;
          };
          isFlag = fn === Boolean || fn[flagSymbol] === true;
        } else if (typeof type === "function") {
          isFlag = type === Boolean || type[flagSymbol] === true;
        } else {
          throw new ArgError(
            `type missing or not a function or valid array type: ${key}`,
            "ARG_CONFIG_VAD_TYPE"
          );
        }
        if (key[1] !== "-" && key.length > 2) {
          throw new ArgError(
            `short argument keys (with a single hyphen) must have only one character: ${key}`,
            "ARG_CONFIG_SHORTOPT_TOOLONG"
          );
        }
        handlers[key] = [type, isFlag];
      }
      for (let i = 0, len = argv.length; i < len; i++) {
        const wholeArg = argv[i];
        if (stopAtPositional && result._.length > 0) {
          result._ = result._.concat(argv.slice(i));
          break;
        }
        if (wholeArg === "--") {
          result._ = result._.concat(argv.slice(i + 1));
          break;
        }
        if (wholeArg.length > 1 && wholeArg[0] === "-") {
          const separatedArguments = wholeArg[1] === "-" || wholeArg.length === 2 ? [wholeArg] : wholeArg.slice(1).split("").map((a) => `-${a}`);
          for (let j2 = 0; j2 < separatedArguments.length; j2++) {
            const arg3 = separatedArguments[j2];
            const [originalArgName, argStr] = arg3[1] === "-" ? arg3.split(/=(.*)/, 2) : [arg3, void 0];
            let argName = originalArgName;
            while (argName in aliases) {
              argName = aliases[argName];
            }
            if (!(argName in handlers)) {
              if (permissive) {
                result._.push(arg3);
                continue;
              } else {
                throw new ArgError(
                  `unknown or unexpected option: ${originalArgName}`,
                  "ARG_UNKNOWN_OPTION"
                );
              }
            }
            const [type, isFlag] = handlers[argName];
            if (!isFlag && j2 + 1 < separatedArguments.length) {
              throw new ArgError(
                `option requires argument (but was followed by another short argument): ${originalArgName}`,
                "ARG_MISSING_REQUIRED_SHORTARG"
              );
            }
            if (isFlag) {
              result[argName] = type(true, argName, result[argName]);
            } else if (argStr === void 0) {
              if (argv.length < i + 2 || argv[i + 1].length > 1 && argv[i + 1][0] === "-" && !(argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) && (type === Number || // eslint-disable-next-line no-undef
              typeof BigInt !== "undefined" && type === BigInt))) {
                const extended = originalArgName === argName ? "" : ` (alias for ${argName})`;
                throw new ArgError(
                  `option requires argument: ${originalArgName}${extended}`,
                  "ARG_MISSING_REQUIRED_LONGARG"
                );
              }
              result[argName] = type(argv[i + 1], argName, result[argName]);
              ++i;
            } else {
              result[argName] = type(argStr, argName, result[argName]);
            }
          }
        } else {
          result._.push(wholeArg);
        }
      }
      return result;
    }
    arg2.flag = (fn) => {
      fn[flagSymbol] = true;
      return fn;
    };
    arg2.COUNT = arg2.flag((v2, name, existingCount) => (existingCount || 0) + 1);
    arg2.ArgError = ArgError;
    module.exports = arg2;
  }
});

// node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js"(exports, module) {
    "use strict";
    var ESC = "\x1B";
    var CSI = `${ESC}[`;
    var beep = "\x07";
    var cursor = {
      to(x2, y3) {
        if (!y3) return `${CSI}${x2 + 1}G`;
        return `${CSI}${y3 + 1};${x2 + 1}H`;
      },
      move(x2, y3) {
        let ret = "";
        if (x2 < 0) ret += `${CSI}${-x2}D`;
        else if (x2 > 0) ret += `${CSI}${x2}C`;
        if (y3 < 0) ret += `${CSI}${-y3}A`;
        else if (y3 > 0) ret += `${CSI}${y3}B`;
        return ret;
      },
      up: (count = 1) => `${CSI}${count}A`,
      down: (count = 1) => `${CSI}${count}B`,
      forward: (count = 1) => `${CSI}${count}C`,
      backward: (count = 1) => `${CSI}${count}D`,
      nextLine: (count = 1) => `${CSI}E`.repeat(count),
      prevLine: (count = 1) => `${CSI}F`.repeat(count),
      left: `${CSI}G`,
      hide: `${CSI}?25l`,
      show: `${CSI}?25h`,
      save: `${ESC}7`,
      restore: `${ESC}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI}S`.repeat(count),
      down: (count = 1) => `${CSI}T`.repeat(count)
    };
    var erase = {
      screen: `${CSI}2J`,
      up: (count = 1) => `${CSI}1J`.repeat(count),
      down: (count = 1) => `${CSI}J`.repeat(count),
      line: `${CSI}2K`,
      lineEnd: `${CSI}K`,
      lineStart: `${CSI}1K`,
      lines(count) {
        let clear = "";
        for (let i = 0; i < count; i++)
          clear += this.line + (i < count - 1 ? cursor.up() : "");
        if (count)
          clear += cursor.left;
        return clear;
      }
    };
    module.exports = { cursor, scroll, erase, beep };
  }
});

// node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js"(exports, module) {
    var p2 = process || {};
    var argv = p2.argv || [];
    var env = p2.env || {};
    var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p2.platform === "win32" || (p2.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input, index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "", cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors = (enabled = isColorSupported) => {
      let f = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: f("\x1B[0m", "\x1B[0m"),
        bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: f("\x1B[3m", "\x1B[23m"),
        underline: f("\x1B[4m", "\x1B[24m"),
        inverse: f("\x1B[7m", "\x1B[27m"),
        hidden: f("\x1B[8m", "\x1B[28m"),
        strikethrough: f("\x1B[9m", "\x1B[29m"),
        black: f("\x1B[30m", "\x1B[39m"),
        red: f("\x1B[31m", "\x1B[39m"),
        green: f("\x1B[32m", "\x1B[39m"),
        yellow: f("\x1B[33m", "\x1B[39m"),
        blue: f("\x1B[34m", "\x1B[39m"),
        magenta: f("\x1B[35m", "\x1B[39m"),
        cyan: f("\x1B[36m", "\x1B[39m"),
        white: f("\x1B[37m", "\x1B[39m"),
        gray: f("\x1B[90m", "\x1B[39m"),
        bgBlack: f("\x1B[40m", "\x1B[49m"),
        bgRed: f("\x1B[41m", "\x1B[49m"),
        bgGreen: f("\x1B[42m", "\x1B[49m"),
        bgYellow: f("\x1B[43m", "\x1B[49m"),
        bgBlue: f("\x1B[44m", "\x1B[49m"),
        bgMagenta: f("\x1B[45m", "\x1B[49m"),
        bgCyan: f("\x1B[46m", "\x1B[49m"),
        bgWhite: f("\x1B[47m", "\x1B[49m"),
        blackBright: f("\x1B[90m", "\x1B[39m"),
        redBright: f("\x1B[91m", "\x1B[39m"),
        greenBright: f("\x1B[92m", "\x1B[39m"),
        yellowBright: f("\x1B[93m", "\x1B[39m"),
        blueBright: f("\x1B[94m", "\x1B[39m"),
        magentaBright: f("\x1B[95m", "\x1B[39m"),
        cyanBright: f("\x1B[96m", "\x1B[39m"),
        whiteBright: f("\x1B[97m", "\x1B[39m"),
        bgBlackBright: f("\x1B[100m", "\x1B[49m"),
        bgRedBright: f("\x1B[101m", "\x1B[49m"),
        bgGreenBright: f("\x1B[102m", "\x1B[49m"),
        bgYellowBright: f("\x1B[103m", "\x1B[49m"),
        bgBlueBright: f("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
        bgCyanBright: f("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: f("\x1B[107m", "\x1B[49m")
      };
    };
    module.exports = createColors();
    module.exports.createColors = createColors;
  }
});

// src/create-app/index.ts
var import_arg = __toESM(require_arg(), 1);

// node_modules/.pnpm/@clack+core@0.5.0/node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
var import_picocolors = __toESM(require_picocolors(), 1);
import { stdin as j, stdout as M } from "node:process";
import * as g from "node:readline";
import O from "node:readline";
import { Writable as X } from "node:stream";
function DD({ onlyFirst: e2 = false } = {}) {
  const t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(t, e2 ? void 0 : "g");
}
var uD = DD();
function P(e2) {
  if (typeof e2 != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e2}\``);
  return e2.replace(uD, "");
}
function L(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
var W = { exports: {} };
(function(e2) {
  var u2 = {};
  e2.exports = u2, u2.eastAsianWidth = function(F2) {
    var s = F2.charCodeAt(0), i = F2.length == 2 ? F2.charCodeAt(1) : 0, D2 = s;
    return 55296 <= s && s <= 56319 && 56320 <= i && i <= 57343 && (s &= 1023, i &= 1023, D2 = s << 10 | i, D2 += 65536), D2 == 12288 || 65281 <= D2 && D2 <= 65376 || 65504 <= D2 && D2 <= 65510 ? "F" : D2 == 8361 || 65377 <= D2 && D2 <= 65470 || 65474 <= D2 && D2 <= 65479 || 65482 <= D2 && D2 <= 65487 || 65490 <= D2 && D2 <= 65495 || 65498 <= D2 && D2 <= 65500 || 65512 <= D2 && D2 <= 65518 ? "H" : 4352 <= D2 && D2 <= 4447 || 4515 <= D2 && D2 <= 4519 || 4602 <= D2 && D2 <= 4607 || 9001 <= D2 && D2 <= 9002 || 11904 <= D2 && D2 <= 11929 || 11931 <= D2 && D2 <= 12019 || 12032 <= D2 && D2 <= 12245 || 12272 <= D2 && D2 <= 12283 || 12289 <= D2 && D2 <= 12350 || 12353 <= D2 && D2 <= 12438 || 12441 <= D2 && D2 <= 12543 || 12549 <= D2 && D2 <= 12589 || 12593 <= D2 && D2 <= 12686 || 12688 <= D2 && D2 <= 12730 || 12736 <= D2 && D2 <= 12771 || 12784 <= D2 && D2 <= 12830 || 12832 <= D2 && D2 <= 12871 || 12880 <= D2 && D2 <= 13054 || 13056 <= D2 && D2 <= 19903 || 19968 <= D2 && D2 <= 42124 || 42128 <= D2 && D2 <= 42182 || 43360 <= D2 && D2 <= 43388 || 44032 <= D2 && D2 <= 55203 || 55216 <= D2 && D2 <= 55238 || 55243 <= D2 && D2 <= 55291 || 63744 <= D2 && D2 <= 64255 || 65040 <= D2 && D2 <= 65049 || 65072 <= D2 && D2 <= 65106 || 65108 <= D2 && D2 <= 65126 || 65128 <= D2 && D2 <= 65131 || 110592 <= D2 && D2 <= 110593 || 127488 <= D2 && D2 <= 127490 || 127504 <= D2 && D2 <= 127546 || 127552 <= D2 && D2 <= 127560 || 127568 <= D2 && D2 <= 127569 || 131072 <= D2 && D2 <= 194367 || 177984 <= D2 && D2 <= 196605 || 196608 <= D2 && D2 <= 262141 ? "W" : 32 <= D2 && D2 <= 126 || 162 <= D2 && D2 <= 163 || 165 <= D2 && D2 <= 166 || D2 == 172 || D2 == 175 || 10214 <= D2 && D2 <= 10221 || 10629 <= D2 && D2 <= 10630 ? "Na" : D2 == 161 || D2 == 164 || 167 <= D2 && D2 <= 168 || D2 == 170 || 173 <= D2 && D2 <= 174 || 176 <= D2 && D2 <= 180 || 182 <= D2 && D2 <= 186 || 188 <= D2 && D2 <= 191 || D2 == 198 || D2 == 208 || 215 <= D2 && D2 <= 216 || 222 <= D2 && D2 <= 225 || D2 == 230 || 232 <= D2 && D2 <= 234 || 236 <= D2 && D2 <= 237 || D2 == 240 || 242 <= D2 && D2 <= 243 || 247 <= D2 && D2 <= 250 || D2 == 252 || D2 == 254 || D2 == 257 || D2 == 273 || D2 == 275 || D2 == 283 || 294 <= D2 && D2 <= 295 || D2 == 299 || 305 <= D2 && D2 <= 307 || D2 == 312 || 319 <= D2 && D2 <= 322 || D2 == 324 || 328 <= D2 && D2 <= 331 || D2 == 333 || 338 <= D2 && D2 <= 339 || 358 <= D2 && D2 <= 359 || D2 == 363 || D2 == 462 || D2 == 464 || D2 == 466 || D2 == 468 || D2 == 470 || D2 == 472 || D2 == 474 || D2 == 476 || D2 == 593 || D2 == 609 || D2 == 708 || D2 == 711 || 713 <= D2 && D2 <= 715 || D2 == 717 || D2 == 720 || 728 <= D2 && D2 <= 731 || D2 == 733 || D2 == 735 || 768 <= D2 && D2 <= 879 || 913 <= D2 && D2 <= 929 || 931 <= D2 && D2 <= 937 || 945 <= D2 && D2 <= 961 || 963 <= D2 && D2 <= 969 || D2 == 1025 || 1040 <= D2 && D2 <= 1103 || D2 == 1105 || D2 == 8208 || 8211 <= D2 && D2 <= 8214 || 8216 <= D2 && D2 <= 8217 || 8220 <= D2 && D2 <= 8221 || 8224 <= D2 && D2 <= 8226 || 8228 <= D2 && D2 <= 8231 || D2 == 8240 || 8242 <= D2 && D2 <= 8243 || D2 == 8245 || D2 == 8251 || D2 == 8254 || D2 == 8308 || D2 == 8319 || 8321 <= D2 && D2 <= 8324 || D2 == 8364 || D2 == 8451 || D2 == 8453 || D2 == 8457 || D2 == 8467 || D2 == 8470 || 8481 <= D2 && D2 <= 8482 || D2 == 8486 || D2 == 8491 || 8531 <= D2 && D2 <= 8532 || 8539 <= D2 && D2 <= 8542 || 8544 <= D2 && D2 <= 8555 || 8560 <= D2 && D2 <= 8569 || D2 == 8585 || 8592 <= D2 && D2 <= 8601 || 8632 <= D2 && D2 <= 8633 || D2 == 8658 || D2 == 8660 || D2 == 8679 || D2 == 8704 || 8706 <= D2 && D2 <= 8707 || 8711 <= D2 && D2 <= 8712 || D2 == 8715 || D2 == 8719 || D2 == 8721 || D2 == 8725 || D2 == 8730 || 8733 <= D2 && D2 <= 8736 || D2 == 8739 || D2 == 8741 || 8743 <= D2 && D2 <= 8748 || D2 == 8750 || 8756 <= D2 && D2 <= 8759 || 8764 <= D2 && D2 <= 8765 || D2 == 8776 || D2 == 8780 || D2 == 8786 || 8800 <= D2 && D2 <= 8801 || 8804 <= D2 && D2 <= 8807 || 8810 <= D2 && D2 <= 8811 || 8814 <= D2 && D2 <= 8815 || 8834 <= D2 && D2 <= 8835 || 8838 <= D2 && D2 <= 8839 || D2 == 8853 || D2 == 8857 || D2 == 8869 || D2 == 8895 || D2 == 8978 || 9312 <= D2 && D2 <= 9449 || 9451 <= D2 && D2 <= 9547 || 9552 <= D2 && D2 <= 9587 || 9600 <= D2 && D2 <= 9615 || 9618 <= D2 && D2 <= 9621 || 9632 <= D2 && D2 <= 9633 || 9635 <= D2 && D2 <= 9641 || 9650 <= D2 && D2 <= 9651 || 9654 <= D2 && D2 <= 9655 || 9660 <= D2 && D2 <= 9661 || 9664 <= D2 && D2 <= 9665 || 9670 <= D2 && D2 <= 9672 || D2 == 9675 || 9678 <= D2 && D2 <= 9681 || 9698 <= D2 && D2 <= 9701 || D2 == 9711 || 9733 <= D2 && D2 <= 9734 || D2 == 9737 || 9742 <= D2 && D2 <= 9743 || 9748 <= D2 && D2 <= 9749 || D2 == 9756 || D2 == 9758 || D2 == 9792 || D2 == 9794 || 9824 <= D2 && D2 <= 9825 || 9827 <= D2 && D2 <= 9829 || 9831 <= D2 && D2 <= 9834 || 9836 <= D2 && D2 <= 9837 || D2 == 9839 || 9886 <= D2 && D2 <= 9887 || 9918 <= D2 && D2 <= 9919 || 9924 <= D2 && D2 <= 9933 || 9935 <= D2 && D2 <= 9953 || D2 == 9955 || 9960 <= D2 && D2 <= 9983 || D2 == 10045 || D2 == 10071 || 10102 <= D2 && D2 <= 10111 || 11093 <= D2 && D2 <= 11097 || 12872 <= D2 && D2 <= 12879 || 57344 <= D2 && D2 <= 63743 || 65024 <= D2 && D2 <= 65039 || D2 == 65533 || 127232 <= D2 && D2 <= 127242 || 127248 <= D2 && D2 <= 127277 || 127280 <= D2 && D2 <= 127337 || 127344 <= D2 && D2 <= 127386 || 917760 <= D2 && D2 <= 917999 || 983040 <= D2 && D2 <= 1048573 || 1048576 <= D2 && D2 <= 1114109 ? "A" : "N";
  }, u2.characterLength = function(F2) {
    var s = this.eastAsianWidth(F2);
    return s == "F" || s == "W" || s == "A" ? 2 : 1;
  };
  function t(F2) {
    return F2.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  u2.length = function(F2) {
    for (var s = t(F2), i = 0, D2 = 0; D2 < s.length; D2++) i = i + this.characterLength(s[D2]);
    return i;
  }, u2.slice = function(F2, s, i) {
    textLen = u2.length(F2), s = s || 0, i = i || 1, s < 0 && (s = textLen + s), i < 0 && (i = textLen + i);
    for (var D2 = "", C2 = 0, n = t(F2), E = 0; E < n.length; E++) {
      var a = n[E], o2 = u2.length(a);
      if (C2 >= s - (o2 == 2 ? 1 : 0)) if (C2 + o2 <= i) D2 += a;
      else break;
      C2 += o2;
    }
    return D2;
  };
})(W);
var tD = W.exports;
var eD = L(tD);
var FD = function() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};
var sD = L(FD);
function p(e2, u2 = {}) {
  if (typeof e2 != "string" || e2.length === 0 || (u2 = { ambiguousIsNarrow: true, ...u2 }, e2 = P(e2), e2.length === 0)) return 0;
  e2 = e2.replace(sD(), "  ");
  const t = u2.ambiguousIsNarrow ? 1 : 2;
  let F2 = 0;
  for (const s of e2) {
    const i = s.codePointAt(0);
    if (i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879) continue;
    switch (eD.eastAsianWidth(s)) {
      case "F":
      case "W":
        F2 += 2;
        break;
      case "A":
        F2 += t;
        break;
      default:
        F2 += 1;
    }
  }
  return F2;
}
var w = 10;
var N = (e2 = 0) => (u2) => `\x1B[${u2 + e2}m`;
var I = (e2 = 0) => (u2) => `\x1B[${38 + e2};5;${u2}m`;
var R = (e2 = 0) => (u2, t, F2) => `\x1B[${38 + e2};2;${u2};${t};${F2}m`;
var r = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], gray: [90, 39], grey: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgGray: [100, 49], bgGrey: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
Object.keys(r.modifier);
var iD = Object.keys(r.color);
var CD = Object.keys(r.bgColor);
[...iD, ...CD];
function rD() {
  const e2 = /* @__PURE__ */ new Map();
  for (const [u2, t] of Object.entries(r)) {
    for (const [F2, s] of Object.entries(t)) r[F2] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }, t[F2] = r[F2], e2.set(s[0], s[1]);
    Object.defineProperty(r, u2, { value: t, enumerable: false });
  }
  return Object.defineProperty(r, "codes", { value: e2, enumerable: false }), r.color.close = "\x1B[39m", r.bgColor.close = "\x1B[49m", r.color.ansi = N(), r.color.ansi256 = I(), r.color.ansi16m = R(), r.bgColor.ansi = N(w), r.bgColor.ansi256 = I(w), r.bgColor.ansi16m = R(w), Object.defineProperties(r, { rgbToAnsi256: { value: (u2, t, F2) => u2 === t && t === F2 ? u2 < 8 ? 16 : u2 > 248 ? 231 : Math.round((u2 - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u2 / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(F2 / 255 * 5), enumerable: false }, hexToRgb: { value: (u2) => {
    const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(u2.toString(16));
    if (!t) return [0, 0, 0];
    let [F2] = t;
    F2.length === 3 && (F2 = [...F2].map((i) => i + i).join(""));
    const s = Number.parseInt(F2, 16);
    return [s >> 16 & 255, s >> 8 & 255, s & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u2) => r.rgbToAnsi256(...r.hexToRgb(u2)), enumerable: false }, ansi256ToAnsi: { value: (u2) => {
    if (u2 < 8) return 30 + u2;
    if (u2 < 16) return 90 + (u2 - 8);
    let t, F2, s;
    if (u2 >= 232) t = ((u2 - 232) * 10 + 8) / 255, F2 = t, s = t;
    else {
      u2 -= 16;
      const C2 = u2 % 36;
      t = Math.floor(u2 / 36) / 5, F2 = Math.floor(C2 / 6) / 5, s = C2 % 6 / 5;
    }
    const i = Math.max(t, F2, s) * 2;
    if (i === 0) return 30;
    let D2 = 30 + (Math.round(s) << 2 | Math.round(F2) << 1 | Math.round(t));
    return i === 2 && (D2 += 60), D2;
  }, enumerable: false }, rgbToAnsi: { value: (u2, t, F2) => r.ansi256ToAnsi(r.rgbToAnsi256(u2, t, F2)), enumerable: false }, hexToAnsi: { value: (u2) => r.ansi256ToAnsi(r.hexToAnsi256(u2)), enumerable: false } }), r;
}
var ED = rD();
var d = /* @__PURE__ */ new Set(["\x1B", "\x9B"]);
var oD = 39;
var y = "\x07";
var V = "[";
var nD = "]";
var G = "m";
var _ = `${nD}8;;`;
var z = (e2) => `${d.values().next().value}${V}${e2}${G}`;
var K = (e2) => `${d.values().next().value}${_}${e2}${y}`;
var aD = (e2) => e2.split(" ").map((u2) => p(u2));
var k = (e2, u2, t) => {
  const F2 = [...u2];
  let s = false, i = false, D2 = p(P(e2[e2.length - 1]));
  for (const [C2, n] of F2.entries()) {
    const E = p(n);
    if (D2 + E <= t ? e2[e2.length - 1] += n : (e2.push(n), D2 = 0), d.has(n) && (s = true, i = F2.slice(C2 + 1).join("").startsWith(_)), s) {
      i ? n === y && (s = false, i = false) : n === G && (s = false);
      continue;
    }
    D2 += E, D2 === t && C2 < F2.length - 1 && (e2.push(""), D2 = 0);
  }
  !D2 && e2[e2.length - 1].length > 0 && e2.length > 1 && (e2[e2.length - 2] += e2.pop());
};
var hD = (e2) => {
  const u2 = e2.split(" ");
  let t = u2.length;
  for (; t > 0 && !(p(u2[t - 1]) > 0); ) t--;
  return t === u2.length ? e2 : u2.slice(0, t).join(" ") + u2.slice(t).join("");
};
var lD = (e2, u2, t = {}) => {
  if (t.trim !== false && e2.trim() === "") return "";
  let F2 = "", s, i;
  const D2 = aD(e2);
  let C2 = [""];
  for (const [E, a] of e2.split(" ").entries()) {
    t.trim !== false && (C2[C2.length - 1] = C2[C2.length - 1].trimStart());
    let o2 = p(C2[C2.length - 1]);
    if (E !== 0 && (o2 >= u2 && (t.wordWrap === false || t.trim === false) && (C2.push(""), o2 = 0), (o2 > 0 || t.trim === false) && (C2[C2.length - 1] += " ", o2++)), t.hard && D2[E] > u2) {
      const c = u2 - o2, f = 1 + Math.floor((D2[E] - c - 1) / u2);
      Math.floor((D2[E] - 1) / u2) < f && C2.push(""), k(C2, a, u2);
      continue;
    }
    if (o2 + D2[E] > u2 && o2 > 0 && D2[E] > 0) {
      if (t.wordWrap === false && o2 < u2) {
        k(C2, a, u2);
        continue;
      }
      C2.push("");
    }
    if (o2 + D2[E] > u2 && t.wordWrap === false) {
      k(C2, a, u2);
      continue;
    }
    C2[C2.length - 1] += a;
  }
  t.trim !== false && (C2 = C2.map((E) => hD(E)));
  const n = [...C2.join(`
`)];
  for (const [E, a] of n.entries()) {
    if (F2 += a, d.has(a)) {
      const { groups: c } = new RegExp(`(?:\\${V}(?<code>\\d+)m|\\${_}(?<uri>.*)${y})`).exec(n.slice(E).join("")) || { groups: {} };
      if (c.code !== void 0) {
        const f = Number.parseFloat(c.code);
        s = f === oD ? void 0 : f;
      } else c.uri !== void 0 && (i = c.uri.length === 0 ? void 0 : c.uri);
    }
    const o2 = ED.codes.get(Number(s));
    n[E + 1] === `
` ? (i && (F2 += K("")), s && o2 && (F2 += z(o2))) : a === `
` && (s && o2 && (F2 += z(s)), i && (F2 += K(i)));
  }
  return F2;
};
function Y(e2, u2, t) {
  return String(e2).normalize().replace(/\r\n/g, `
`).split(`
`).map((F2) => lD(F2, u2, t)).join(`
`);
}
var xD = ["up", "down", "left", "right", "space", "enter", "cancel"];
var B = { actions: new Set(xD), aliases: /* @__PURE__ */ new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["", "cancel"], ["escape", "cancel"]]) };
function $(e2, u2) {
  if (typeof e2 == "string") return B.aliases.get(e2) === u2;
  for (const t of e2) if (t !== void 0 && $(t, u2)) return true;
  return false;
}
function BD(e2, u2) {
  if (e2 === u2) return;
  const t = e2.split(`
`), F2 = u2.split(`
`), s = [];
  for (let i = 0; i < Math.max(t.length, F2.length); i++) t[i] !== F2[i] && s.push(i);
  return s;
}
var AD = globalThis.process.platform.startsWith("win");
var S = /* @__PURE__ */ Symbol("clack:cancel");
function m(e2, u2) {
  const t = e2;
  t.isTTY && t.setRawMode(u2);
}
function fD({ input: e2 = j, output: u2 = M, overwrite: t = true, hideCursor: F2 = true } = {}) {
  const s = g.createInterface({ input: e2, output: u2, prompt: "", tabSize: 1 });
  g.emitKeypressEvents(e2, s), e2.isTTY && e2.setRawMode(true);
  const i = (D2, { name: C2, sequence: n }) => {
    const E = String(D2);
    if ($([E, C2, n], "cancel")) {
      F2 && u2.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!t) return;
    const a = C2 === "return" ? 0 : -1, o2 = C2 === "return" ? -1 : 0;
    g.moveCursor(u2, a, o2, () => {
      g.clearLine(u2, 1, () => {
        e2.once("keypress", i);
      });
    });
  };
  return F2 && u2.write(import_sisteransi.cursor.hide), e2.once("keypress", i), () => {
    e2.off("keypress", i), F2 && u2.write(import_sisteransi.cursor.show), e2.isTTY && !AD && e2.setRawMode(false), s.terminal = false, s.close();
  };
}
var gD = Object.defineProperty;
var vD = (e2, u2, t) => u2 in e2 ? gD(e2, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e2[u2] = t;
var h = (e2, u2, t) => (vD(e2, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var x = class {
  constructor(u2, t = true) {
    h(this, "input"), h(this, "output"), h(this, "_abortSignal"), h(this, "rl"), h(this, "opts"), h(this, "_render"), h(this, "_track", false), h(this, "_prevFrame", ""), h(this, "_subscribers", /* @__PURE__ */ new Map()), h(this, "_cursor", 0), h(this, "state", "initial"), h(this, "error", ""), h(this, "value");
    const { input: F2 = j, output: s = M, render: i, signal: D2, ...C2 } = u2;
    this.opts = C2, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = i.bind(this), this._track = t, this._abortSignal = D2, this.input = F2, this.output = s;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(u2, t) {
    const F2 = this._subscribers.get(u2) ?? [];
    F2.push(t), this._subscribers.set(u2, F2);
  }
  on(u2, t) {
    this.setSubscriber(u2, { cb: t });
  }
  once(u2, t) {
    this.setSubscriber(u2, { cb: t, once: true });
  }
  emit(u2, ...t) {
    const F2 = this._subscribers.get(u2) ?? [], s = [];
    for (const i of F2) i.cb(...t), i.once && s.push(() => F2.splice(F2.indexOf(i), 1));
    for (const i of s) i();
  }
  prompt() {
    return new Promise((u2, t) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted) return this.state = "cancel", this.close(), u2(S);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      const F2 = new X();
      F2._write = (s, i, D2) => {
        this._track && (this.value = this.rl?.line.replace(/\t/g, ""), this._cursor = this.rl?.cursor ?? 0, this.emit("value", this.value)), D2();
      }, this.input.pipe(F2), this.rl = O.createInterface({ input: this.input, output: F2, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), O.emitKeypressEvents(this.input, this.rl), this.rl.prompt(), this.opts.initialValue !== void 0 && this._track && this.rl.write(this.opts.initialValue), this.input.on("keypress", this.onKeypress), m(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u2(S);
      });
    });
  }
  onKeypress(u2, t) {
    if (this.state === "error" && (this.state = "active"), t?.name && (!this._track && B.aliases.has(t.name) && this.emit("cursor", B.aliases.get(t.name)), B.actions.has(t.name) && this.emit("cursor", t.name)), u2 && (u2.toLowerCase() === "y" || u2.toLowerCase() === "n") && this.emit("confirm", u2.toLowerCase() === "y"), u2 === "	" && this.opts.placeholder && (this.value || (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder))), u2 && this.emit("key", u2.toLowerCase()), t?.name === "return") {
      if (this.opts.validate) {
        const F2 = this.opts.validate(this.value);
        F2 && (this.error = F2 instanceof Error ? F2.message : F2, this.state = "error", this.rl?.write(this.value));
      }
      this.state !== "error" && (this.state = "submit");
    }
    $([u2, t?.name, t?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), m(this.input, false), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const u2 = Y(this._prevFrame, process.stdout.columns, { hard: true }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, u2 * -1));
  }
  render() {
    const u2 = Y(this._render(this) ?? "", process.stdout.columns, { hard: true });
    if (u2 !== this._prevFrame) {
      if (this.state === "initial") this.output.write(import_sisteransi.cursor.hide);
      else {
        const t = BD(this._prevFrame, u2);
        if (this.restoreCursor(), t && t?.length === 1) {
          const F2 = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F2)), this.output.write(import_sisteransi.erase.lines(1));
          const s = u2.split(`
`);
          this.output.write(s[F2]), this._prevFrame = u2, this.output.write(import_sisteransi.cursor.move(0, s.length - F2 - 1));
          return;
        }
        if (t && t?.length > 1) {
          const F2 = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F2)), this.output.write(import_sisteransi.erase.down());
          const s = u2.split(`
`).slice(F2);
          this.output.write(s.join(`
`)), this._prevFrame = u2;
          return;
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(u2), this.state === "initial" && (this.state = "active"), this._prevFrame = u2;
    }
  }
};
var dD = class extends x {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(u2) {
    super(u2, false), this.value = !!u2.initialValue, this.on("value", () => {
      this.value = this._value;
    }), this.on("confirm", (t) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = t, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
};
var A;
A = /* @__PURE__ */ new WeakMap();
var OD = Object.defineProperty;
var PD = (e2, u2, t) => u2 in e2 ? OD(e2, u2, { enumerable: true, configurable: true, writable: true, value: t }) : e2[u2] = t;
var J = (e2, u2, t) => (PD(e2, typeof u2 != "symbol" ? u2 + "" : u2, t), t);
var LD = class extends x {
  constructor(u2) {
    super(u2, false), J(this, "options"), J(this, "cursor", 0), this.options = u2.options, this.cursor = this.options.findIndex(({ value: t }) => t === u2.initialValue), this.cursor === -1 && (this.cursor = 0), this.changeValue(), this.on("cursor", (t) => {
      switch (t) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
      }
      this.changeValue();
    });
  }
  get _value() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._value.value;
  }
};
var RD = class extends x {
  get valueWithCursor() {
    if (this.state === "submit") return this.value;
    if (this.cursor >= this.value.length) return `${this.value}\u2588`;
    const u2 = this.value.slice(0, this.cursor), [t, ...F2] = this.value.slice(this.cursor);
    return `${u2}${import_picocolors.default.inverse(t)}${F2.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(u2) {
    super(u2), this.on("finalize", () => {
      this.value || (this.value = u2.defaultValue);
    });
  }
};

// node_modules/.pnpm/@clack+prompts@0.11.0/node_modules/@clack/prompts/dist/index.mjs
var import_picocolors2 = __toESM(require_picocolors(), 1);
var import_sisteransi2 = __toESM(require_src(), 1);
import y2 from "node:process";
function ce() {
  return y2.platform !== "win32" ? y2.env.TERM !== "linux" : !!y2.env.CI || !!y2.env.WT_SESSION || !!y2.env.TERMINUS_SUBLIME || y2.env.ConEmuTask === "{cmd::Cmder}" || y2.env.TERM_PROGRAM === "Terminus-Sublime" || y2.env.TERM_PROGRAM === "vscode" || y2.env.TERM === "xterm-256color" || y2.env.TERM === "alacritty" || y2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var V2 = ce();
var u = (t, n) => V2 ? t : n;
var le = u("\u25C6", "*");
var L2 = u("\u25A0", "x");
var W2 = u("\u25B2", "x");
var C = u("\u25C7", "o");
var ue = u("\u250C", "T");
var o = u("\u2502", "|");
var d2 = u("\u2514", "\u2014");
var k2 = u("\u25CF", ">");
var P2 = u("\u25CB", " ");
var A2 = u("\u25FB", "[\u2022]");
var T = u("\u25FC", "[+]");
var F = u("\u25FB", "[ ]");
var $e = u("\u25AA", "\u2022");
var _2 = u("\u2500", "-");
var me = u("\u256E", "+");
var de = u("\u251C", "+");
var pe = u("\u256F", "+");
var q = u("\u25CF", "\u2022");
var D = u("\u25C6", "*");
var U = u("\u25B2", "!");
var K2 = u("\u25A0", "x");
var b2 = (t) => {
  switch (t) {
    case "initial":
    case "active":
      return import_picocolors2.default.cyan(le);
    case "cancel":
      return import_picocolors2.default.red(L2);
    case "error":
      return import_picocolors2.default.yellow(W2);
    case "submit":
      return import_picocolors2.default.green(C);
  }
};
var G2 = (t) => {
  const { cursor: n, options: r2, style: i } = t, s = t.maxItems ?? Number.POSITIVE_INFINITY, c = Math.max(process.stdout.rows - 4, 0), a = Math.min(c, Math.max(s, 5));
  let l2 = 0;
  n >= l2 + a - 3 ? l2 = Math.max(Math.min(n - a + 3, r2.length - a), 0) : n < l2 + 2 && (l2 = Math.max(n - 2, 0));
  const $2 = a < r2.length && l2 > 0, g2 = a < r2.length && l2 + a < r2.length;
  return r2.slice(l2, l2 + a).map((p2, v2, f) => {
    const j2 = v2 === 0 && $2, E = v2 === f.length - 1 && g2;
    return j2 || E ? import_picocolors2.default.dim("...") : i(p2, v2 + l2 === n);
  });
};
var he = (t) => new RD({ validate: t.validate, placeholder: t.placeholder, defaultValue: t.defaultValue, initialValue: t.initialValue, render() {
  const n = `${import_picocolors2.default.gray(o)}
${b2(this.state)}  ${t.message}
`, r2 = t.placeholder ? import_picocolors2.default.inverse(t.placeholder[0]) + import_picocolors2.default.dim(t.placeholder.slice(1)) : import_picocolors2.default.inverse(import_picocolors2.default.hidden("_")), i = this.value ? this.valueWithCursor : r2;
  switch (this.state) {
    case "error":
      return `${n.trim()}
${import_picocolors2.default.yellow(o)}  ${i}
${import_picocolors2.default.yellow(d2)}  ${import_picocolors2.default.yellow(this.error)}
`;
    case "submit":
      return `${n}${import_picocolors2.default.gray(o)}  ${import_picocolors2.default.dim(this.value || t.placeholder)}`;
    case "cancel":
      return `${n}${import_picocolors2.default.gray(o)}  ${import_picocolors2.default.strikethrough(import_picocolors2.default.dim(this.value ?? ""))}${this.value?.trim() ? `
${import_picocolors2.default.gray(o)}` : ""}`;
    default:
      return `${n}${import_picocolors2.default.cyan(o)}  ${i}
${import_picocolors2.default.cyan(d2)}
`;
  }
} }).prompt();
var ye = (t) => {
  const n = t.active ?? "Yes", r2 = t.inactive ?? "No";
  return new dD({ active: n, inactive: r2, initialValue: t.initialValue ?? true, render() {
    const i = `${import_picocolors2.default.gray(o)}
${b2(this.state)}  ${t.message}
`, s = this.value ? n : r2;
    switch (this.state) {
      case "submit":
        return `${i}${import_picocolors2.default.gray(o)}  ${import_picocolors2.default.dim(s)}`;
      case "cancel":
        return `${i}${import_picocolors2.default.gray(o)}  ${import_picocolors2.default.strikethrough(import_picocolors2.default.dim(s))}
${import_picocolors2.default.gray(o)}`;
      default:
        return `${i}${import_picocolors2.default.cyan(o)}  ${this.value ? `${import_picocolors2.default.green(k2)} ${n}` : `${import_picocolors2.default.dim(P2)} ${import_picocolors2.default.dim(n)}`} ${import_picocolors2.default.dim("/")} ${this.value ? `${import_picocolors2.default.dim(P2)} ${import_picocolors2.default.dim(r2)}` : `${import_picocolors2.default.green(k2)} ${r2}`}
${import_picocolors2.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var ve = (t) => {
  const n = (r2, i) => {
    const s = r2.label ?? String(r2.value);
    switch (i) {
      case "selected":
        return `${import_picocolors2.default.dim(s)}`;
      case "active":
        return `${import_picocolors2.default.green(k2)} ${s} ${r2.hint ? import_picocolors2.default.dim(`(${r2.hint})`) : ""}`;
      case "cancelled":
        return `${import_picocolors2.default.strikethrough(import_picocolors2.default.dim(s))}`;
      default:
        return `${import_picocolors2.default.dim(P2)} ${import_picocolors2.default.dim(s)}`;
    }
  };
  return new LD({ options: t.options, initialValue: t.initialValue, render() {
    const r2 = `${import_picocolors2.default.gray(o)}
${b2(this.state)}  ${t.message}
`;
    switch (this.state) {
      case "submit":
        return `${r2}${import_picocolors2.default.gray(o)}  ${n(this.options[this.cursor], "selected")}`;
      case "cancel":
        return `${r2}${import_picocolors2.default.gray(o)}  ${n(this.options[this.cursor], "cancelled")}
${import_picocolors2.default.gray(o)}`;
      default:
        return `${r2}${import_picocolors2.default.cyan(o)}  ${G2({ cursor: this.cursor, options: this.options, maxItems: t.maxItems, style: (i, s) => n(i, s ? "active" : "inactive") }).join(`
${import_picocolors2.default.cyan(o)}  `)}
${import_picocolors2.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var xe = (t = "") => {
  process.stdout.write(`${import_picocolors2.default.gray(d2)}  ${import_picocolors2.default.red(t)}

`);
};
var Ie = (t = "") => {
  process.stdout.write(`${import_picocolors2.default.gray(ue)}  ${t}
`);
};
var Se = (t = "") => {
  process.stdout.write(`${import_picocolors2.default.gray(o)}
${import_picocolors2.default.gray(d2)}  ${t}

`);
};
var M2 = { message: (t = "", { symbol: n = import_picocolors2.default.gray(o) } = {}) => {
  const r2 = [`${import_picocolors2.default.gray(o)}`];
  if (t) {
    const [i, ...s] = t.split(`
`);
    r2.push(`${n}  ${i}`, ...s.map((c) => `${import_picocolors2.default.gray(o)}  ${c}`));
  }
  process.stdout.write(`${r2.join(`
`)}
`);
}, info: (t) => {
  M2.message(t, { symbol: import_picocolors2.default.blue(q) });
}, success: (t) => {
  M2.message(t, { symbol: import_picocolors2.default.green(D) });
}, step: (t) => {
  M2.message(t, { symbol: import_picocolors2.default.green(C) });
}, warn: (t) => {
  M2.message(t, { symbol: import_picocolors2.default.yellow(U) });
}, warning: (t) => {
  M2.warn(t);
}, error: (t) => {
  M2.message(t, { symbol: import_picocolors2.default.red(K2) });
} };
var J2 = `${import_picocolors2.default.gray(o)}  `;
var Y2 = ({ indicator: t = "dots" } = {}) => {
  const n = V2 ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"], r2 = V2 ? 80 : 120, i = process.env.CI === "true";
  let s, c, a = false, l2 = "", $2, g2 = performance.now();
  const p2 = (m2) => {
    const h2 = m2 > 1 ? "Something went wrong" : "Canceled";
    a && N2(h2, m2);
  }, v2 = () => p2(2), f = () => p2(1), j2 = () => {
    process.on("uncaughtExceptionMonitor", v2), process.on("unhandledRejection", v2), process.on("SIGINT", f), process.on("SIGTERM", f), process.on("exit", p2);
  }, E = () => {
    process.removeListener("uncaughtExceptionMonitor", v2), process.removeListener("unhandledRejection", v2), process.removeListener("SIGINT", f), process.removeListener("SIGTERM", f), process.removeListener("exit", p2);
  }, B2 = () => {
    if ($2 === void 0) return;
    i && process.stdout.write(`
`);
    const m2 = $2.split(`
`);
    process.stdout.write(import_sisteransi2.cursor.move(-999, m2.length - 1)), process.stdout.write(import_sisteransi2.erase.down(m2.length));
  }, R2 = (m2) => m2.replace(/\.+$/, ""), O2 = (m2) => {
    const h2 = (performance.now() - m2) / 1e3, w2 = Math.floor(h2 / 60), I2 = Math.floor(h2 % 60);
    return w2 > 0 ? `[${w2}m ${I2}s]` : `[${I2}s]`;
  }, H = (m2 = "") => {
    a = true, s = fD(), l2 = R2(m2), g2 = performance.now(), process.stdout.write(`${import_picocolors2.default.gray(o)}
`);
    let h2 = 0, w2 = 0;
    j2(), c = setInterval(() => {
      if (i && l2 === $2) return;
      B2(), $2 = l2;
      const I2 = import_picocolors2.default.magenta(n[h2]);
      if (i) process.stdout.write(`${I2}  ${l2}...`);
      else if (t === "timer") process.stdout.write(`${I2}  ${l2} ${O2(g2)}`);
      else {
        const z2 = ".".repeat(Math.floor(w2)).slice(0, 3);
        process.stdout.write(`${I2}  ${l2}${z2}`);
      }
      h2 = h2 + 1 < n.length ? h2 + 1 : 0, w2 = w2 < n.length ? w2 + 0.125 : 0;
    }, r2);
  }, N2 = (m2 = "", h2 = 0) => {
    a = false, clearInterval(c), B2();
    const w2 = h2 === 0 ? import_picocolors2.default.green(C) : h2 === 1 ? import_picocolors2.default.red(L2) : import_picocolors2.default.red(W2);
    l2 = R2(m2 ?? l2), t === "timer" ? process.stdout.write(`${w2}  ${l2} ${O2(g2)}
`) : process.stdout.write(`${w2}  ${l2}
`), E(), s();
  };
  return { start: H, stop: N2, message: (m2 = "") => {
    l2 = R2(m2 ?? l2);
  } };
};

// src/create-app/index.ts
var import_picocolors3 = __toESM(require_picocolors(), 1);
import child_process from "node:child_process";
import util from "node:util";

// src/create-app/available-templates.ts
var availableTemplates = [
  "http-base",
  "http-react",
  "http-react-hono",
  "cdn-base",
  ""
];

// src/create-app/resources.ts
var FastEdgeTemplates = { "http-base": [{ "description": "Simple request/response handling application", "language": "javascript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\n**/node_modules/\n**/out/\n**/dist/\n**/build/\n**/*.wasm\n**/target/\n\n# Binaries for programs and plugins\n/bin\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# other\n.DS_Store\n/coverage\n/typings\n.npm\n.eslintcache\n\n# dotenv environment variable files\n.env\n.env.*\n!.env.example\n\n# IDEs and editors\n/.idea\n.project\n.classpath\n.c9/\n*.launch\n.settings/\n*.sublime-workspace\n\n# IDE - VSCode\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/*\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/", "README.md": "# FastEdge Basic Application\n\nA simple FastEdge application that responds to HTTP requests.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/basic-http.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.", "package.json": '{\n  "name": "fastedge-basic-http-app",\n  "description": "Basic HTTP example for FastEdge application",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "build": "npx fastedge-build ./src/index.js ./wasm/basic-http.wasm"\n  },\n  "devDependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest"\n  }\n}\n', "src/index.js": 'async function eventHandler(event) {\n  return new Response("Hello from FastEdge!");\n}\n\naddEventListener("fetch", (event) => {\n  event.respondWith(eventHandler(event));\n});' } }, { "description": "Simple request/response handling application", "language": "rust", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".cargo/config.toml": '[build]\ntarget = "wasm32-wasip2"\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\n**/node_modules/\n**/out/\n**/dist/\n**/build/\n**/*.wasm\n**/target/\n\n# Binaries for programs and plugins\n/bin\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# other\n.DS_Store\n/coverage\n/typings\n.npm\n.eslintcache\n\n# dotenv environment variable files\n.env\n.env.*\n!.env.example\n\n# IDEs and editors\n/.idea\n.project\n.classpath\n.c9/\n*.launch\n.settings/\n*.sublime-workspace\n\n# IDE - VSCode\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/*\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/", "Cargo.toml": '[package]\nname = "basic_wasi_http"\nversion = "0.1.0"\nedition = "2021"\n\n[lib]\ncrate-type = ["cdylib"]\n\n[dependencies]\nwstd = "0.6"\nanyhow = "1"\n', "README.md": "# FastEdge Basic Application\n\nA simple FastEdge application that responds to HTTP requests.\n\n## Build\n\n```bash\ncargo build --release\n```\n\nThis will create `./target/wasm32-wasip2/release/basic_wasi_http.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.\n", "src/lib.rs": 'use wstd::http::body::Body;\nuse wstd::http::{Method, Request, Response, StatusCode};\n\n#[wstd::http_server]\nasync fn main(request: Request<Body>) -> anyhow::Result<Response<Body>> {\n    match request.method() {\n        &Method::GET | &Method::HEAD => (),\n        _ => {\n            return Ok(Response::builder()\n                .status(StatusCode::METHOD_NOT_ALLOWED)\n                .header("allow", "GET, HEAD")\n                .body(Body::from("This method is not allowed\\n"))?);\n        }\n    };\n\n    let path = request.uri().path();\n\n    Ok(Response::builder()\n        .status(StatusCode::OK)\n        .header("content-type", "text/plain;charset=UTF-8")\n        .body(Body::from(format!(\n            "Hello from FastEdge! You made a request to {path}"\n        )))?)\n}\n' } }, { "description": "Simple request/response handling application", "language": "typescript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\n**/node_modules/\n**/out/\n**/dist/\n**/build/\n**/*.wasm\n**/target/\n\n# Binaries for programs and plugins\n/bin\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# other\n.DS_Store\n/coverage\n/typings\n.npm\n.eslintcache\n\n# dotenv environment variable files\n.env\n.env.*\n!.env.example\n\n# IDEs and editors\n/.idea\n.project\n.classpath\n.c9/\n*.launch\n.settings/\n*.sublime-workspace\n\n# IDE - VSCode\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/*\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/", "README.md": "# FastEdge Basic Application\n\nA simple FastEdge application that responds to HTTP requests.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/basic-http.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.", "package.json": '{\n  "name": "fastedge-basic-http-app",\n  "description": "Basic HTTP example for FastEdge application",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "build": "tsc && npx fastedge-build --input ./src/index.ts --output ./wasm/basic-http.wasm --tsconfig ./tsconfig.json"\n  },\n  "devDependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest",\n    "typescript": "^5.0.0"\n  }\n}\n', "src/index.ts": 'async function eventHandler(event: FetchEvent): Promise<Response> {\n  return new Response("Hello from FastEdge!");\n}\n\naddEventListener("fetch", (event: FetchEvent) => {\n  event.respondWith(eventHandler(event));\n});', "tsconfig.json": '{\n  "compilerOptions": {\n    "target": "ES2023",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "strict": true,\n    "skipLibCheck": true,\n    "noEmit": true,\n    "lib": ["ES2023"],\n    "types": ["@gcoredev/fastedge-sdk-js"]\n  },\n  "include": ["src/**/*"],\n  "exclude": ["node_modules"]\n}\n' } }], "http-react": [{ "description": "React application starter-kit using Vite, static server only", "language": "javascript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".fastedge/build-config.js": 'const config = {\n  type: "static",\n  entryPoint: ".fastedge/static-index.js",\n  ignoreDotFiles: true,\n  ignoreDirs: ["./node_modules"],\n  ignoreWellKnown: false,\n  tsConfigPath: "./tsconfig.fastedge.json",\n  wasmOutput: "wasm/react-app.wasm",\n  publicDir: "./dist",\n  contentTypes: [],\n};\n\nconst serverConfig = {\n  type: "static",\n  extendedCache: [],\n  publicDirPrefix: "",\n  compression: [],\n  notFoundPage: "/404.html",\n  autoExt: [],\n  autoIndex: ["index.html", "index.htm"],\n  spaEntrypoint: "/index.html",\n};\n\nexport { config, serverConfig };\n', ".fastedge/static-index.js": '/*\n * Generated by @gcoredev/FastEdge-sdk-js fastedge-init\n */\n\nimport { createStaticServer } from "@gcoredev/fastedge-sdk-js";\nimport { staticAssetManifest } from "./build/static-asset-manifest.js";\nimport { serverConfig } from "./build-config.js";\n\nconst staticServer = createStaticServer(staticAssetManifest, serverConfig);\n\nasync function handleRequest(event) {\n  const response = await staticServer.serveRequest(event.request);\n  if (response != null) {\n    return response;\n  }\n\n  return new Response("Not found", { status: 404 });\n}\n\naddEventListener("fetch", (event) => event.respondWith(handleRequest(event)));\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\nnode_modules/\nout/\ndist/\nbuild/\n.fastedge/build/*\n*.wasm\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/\n", "README.md": "# FastEdge React Application\n\nA React + Vite frontend served as a static-site from a FastEdge application.\n\nAll front-end files are compiled and embedded within the wasm. [Read more](https://g-core.github.io/FastEdge-sdk-js/guides/creating-a-static-manifest/)\n\nFor a more complete React site with a backend server try the `react-app-hono` template.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/react-app.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.\n\n## Development\n\n```bash\nnpm run dev\n```\n\nThis will run the Vite server for developing your React front-end with HMR.\n", "VITE-README.md": "# React + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## React Compiler\n\nThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.\n", "eslint.config.js": "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport { defineConfig, globalIgnores } from 'eslint/config'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{js,jsx}'],\n    extends: [\n      js.configs.recommended,\n      reactHooks.configs['recommended-latest'],\n      reactRefresh.configs.vite,\n    ],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n      parserOptions: {\n        ecmaVersion: 'latest',\n        ecmaFeatures: { jsx: true },\n        sourceType: 'module',\n      },\n    },\n    rules: {\n      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],\n    },\n  },\n])\n", "index.html": '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>FastEdge - React</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>\n', "package.json": '{\n  "name": "react-app-fastedge",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "npm run build:client && npm run build:server",\n    "build:server": "npx fastedge-build --config ./.fastedge/build-config.js",\n    "build:client": "vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest",\n    "react": "^19.1.1",\n    "react-dom": "^19.1.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.36.0",\n    "@types/react": "^19.1.16",\n    "@types/react-dom": "^19.1.9",\n    "@vitejs/plugin-react": "^5.0.4",\n    "eslint": "^9.36.0",\n    "eslint-plugin-react-hooks": "^5.2.0",\n    "eslint-plugin-react-refresh": "^0.4.22",\n    "globals": "^16.4.0",\n    "vite": "^7.1.7"\n  }\n}\n', "public/vite.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>', "src/App.css": "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n", "src/App.jsx": 'import { useState } from "react";\nimport reactLogo from "./assets/react.svg";\nimport viteLogo from "/vite.svg";\nimport "./App.css";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <>\n      <div>\n        <a href="https://vite.dev" target="_blank">\n          <img src={viteLogo} className="logo" alt="Vite logo" />\n        </a>\n        <a href="https://react.dev" target="_blank">\n          <img src={reactLogo} className="logo react" alt="React logo" />\n        </a>\n      </div>\n      <h1>Vite + React</h1>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.jsx</code> and save to test HMR\n        </p>\n      </div>\n      <p className="read-the-docs">\n        Click on the Vite and React logos to learn more\n      </p>\n      <p className="read-the-docs">Powered by FastEdge</p>\n    </>\n  );\n}\n\nexport default App;\n', "src/assets/react.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>', "src/index.css": ":root {\n  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n", "src/main.jsx": "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.jsx'\n\ncreateRoot(document.getElementById('root')).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n)\n", "vite.config.js": "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n" } }, { "description": "React application starter-kit using Vite, static server only", "language": "typescript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".fastedge/build-config.js": 'const config = {\n  type: "static",\n  entryPoint: ".fastedge/static-index.js",\n  ignoreDotFiles: true,\n  ignoreDirs: ["./node_modules"],\n  ignoreWellKnown: false,\n  tsConfigPath: "./tsconfig.fastedge.json",\n  wasmOutput: "wasm/react-app.wasm",\n  publicDir: "./dist",\n  contentTypes: [],\n};\n\nconst serverConfig = {\n  type: "static",\n  extendedCache: [],\n  publicDirPrefix: "",\n  compression: [],\n  notFoundPage: "/404.html",\n  autoExt: [],\n  autoIndex: ["index.html", "index.htm"],\n  spaEntrypoint: "/index.html",\n};\n\nexport { config, serverConfig };\n', ".fastedge/static-index.js": '/*\n * Generated by @gcoredev/FastEdge-sdk-js fastedge-init\n */\n\nimport { createStaticServer } from "@gcoredev/fastedge-sdk-js";\nimport { staticAssetManifest } from "./build/static-asset-manifest.js";\nimport { serverConfig } from "./build-config.js";\n\nconst staticServer = createStaticServer(staticAssetManifest, serverConfig);\n\nasync function handleRequest(event) {\n  const response = await staticServer.serveRequest(event.request);\n  if (response != null) {\n    return response;\n  }\n\n  return new Response("Not found", { status: 404 });\n}\n\naddEventListener("fetch", (event) => event.respondWith(handleRequest(event)));\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\nnode_modules/\nout/\ndist/\nbuild/\n.fastedge/build/*\n*.wasm\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/\n", "README.md": "# FastEdge React Application\n\nA React + Vite frontend served as a static-site from a FastEdge application.\n\nAll front-end files are compiled and embedded within the wasm. [Read more](https://g-core.github.io/FastEdge-sdk-js/guides/creating-a-static-manifest/)\n\nFor a more complete React site with a backend server try the `react-app-hono` template.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/react-app.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.\n\n## Development\n\n```bash\nnpm run dev\n```\n\nThis will run the Vite server for developing your React front-end with HMR.\n", "VITE-README.md": "# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## React Compiler\n\nThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n\n      // Remove tseslint.configs.recommended and replace with this\n      tseslint.configs.recommendedTypeChecked,\n      // Alternatively, use this for stricter rules\n      tseslint.configs.strictTypeChecked,\n      // Optionally, add this for stylistic rules\n      tseslint.configs.stylisticTypeChecked,\n\n      // Other configs...\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from 'eslint-plugin-react-x'\nimport reactDom from 'eslint-plugin-react-dom'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n      // Enable lint rules for React\n      reactX.configs['recommended-typescript'],\n      // Enable lint rules for React DOM\n      reactDom.configs.recommended,\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n", "eslint.config.js": "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport tseslint from 'typescript-eslint'\nimport { defineConfig, globalIgnores } from 'eslint/config'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      js.configs.recommended,\n      tseslint.configs.recommended,\n      reactHooks.configs['recommended-latest'],\n      reactRefresh.configs.vite,\n    ],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n  },\n])\n", "index.html": '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>FastEdge - React</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n', "package.json": '{\n  "name": "react-app-fastedge",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "npm run build:client && npm run build:server",\n    "build:server": "npx fastedge-build --config ./.fastedge/build-config.js",\n    "build:client": "tsc -b && vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest",\n    "react": "^19.1.1",\n    "react-dom": "^19.1.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.36.0",\n    "@types/node": "^24.6.0",\n    "@types/react": "^19.1.16",\n    "@types/react-dom": "^19.1.9",\n    "@vitejs/plugin-react": "^5.0.4",\n    "eslint": "^9.36.0",\n    "eslint-plugin-react-hooks": "^5.2.0",\n    "eslint-plugin-react-refresh": "^0.4.22",\n    "globals": "^16.4.0",\n    "typescript": "~5.9.3",\n    "typescript-eslint": "^8.45.0",\n    "vite": "^7.1.12"\n  }\n}\n', "public/vite.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>', "src/App.css": "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n", "src/App.tsx": 'import { useState } from "react";\nimport reactLogo from "./assets/react.svg";\nimport viteLogo from "/vite.svg";\nimport "./App.css";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <>\n      <div>\n        <a href="https://vite.dev" target="_blank">\n          <img src={viteLogo} className="logo" alt="Vite logo" />\n        </a>\n        <a href="https://react.dev" target="_blank">\n          <img src={reactLogo} className="logo react" alt="React logo" />\n        </a>\n      </div>\n      <h1>Vite + React</h1>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.tsx</code> and save to test HMR\n        </p>\n      </div>\n      <p className="read-the-docs">\n        Click on the Vite and React logos to learn more\n      </p>\n      <p className="read-the-docs">Powered by FastEdge</p>\n    </>\n  );\n}\n\nexport default App;\n', "src/assets/react.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>', "src/index.css": ":root {\n  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n", "src/main.tsx": "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.tsx'\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n)\n", "tsconfig.app.json": '{\n  "compilerOptions": {\n    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",\n    "target": "ES2022",\n    "useDefineForClassFields": true,\n    "lib": ["ES2022", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "types": ["vite/client"],\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "verbatimModuleSyntax": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "erasableSyntaxOnly": true,\n    "noFallthroughCasesInSwitch": true,\n    "noUncheckedSideEffectImports": true\n  },\n  "include": ["src"]\n}\n', "tsconfig.fastedge.json": '{\n  "compilerOptions": {\n    "target": "ES2023",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "rootDir": ".",\n    "strict": true,\n    "skipLibCheck": true,\n    "noEmit": true,\n    "lib": ["ES2023"],\n    "types": ["@gcoredev/fastedge-sdk-js"]\n  },\n  "include": [".fastedge/**/*"],\n  "exclude": ["node_modules"]\n}\n', "tsconfig.json": '{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" },\n    { "path": "./tsconfig.node.json" }\n  ]\n}\n', "tsconfig.node.json": '{\n  "compilerOptions": {\n    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",\n    "target": "ES2023",\n    "lib": ["ES2023"],\n    "module": "ESNext",\n    "types": ["node"],\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "verbatimModuleSyntax": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "erasableSyntaxOnly": true,\n    "noFallthroughCasesInSwitch": true,\n    "noUncheckedSideEffectImports": true\n  },\n  "include": ["vite.config.ts"]\n}\n', "vite.config.ts": "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n" } }], "http-react-hono": [{ "description": "React application starter-kit using Vite and Hono framework, provides backend server functionality", "language": "javascript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\nnode_modules/\nout/\ndist/\nbuild/\n*.wasm\n*.local\n\n# Environment variables\n.env.local\n.env.*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/\n", "API-README.md": '# API Routes Setup\n\nThis project now has a clean separation between static site serving and API backend routes.\n\n## Structure\n\n```\nfastedge-server/\n\u251C\u2500\u2500 server.jsx              # Main FastEdge server (production)\n\u251C\u2500\u2500 dev-server.js           # Development API server\n\u251C\u2500\u2500 config/\n|   \u2514\u2500\u2500 server.config.js        # Static server configuration\n\u2514\u2500\u2500 api/\n    \u2514\u2500\u2500 routes.js           # API route definitions\n```\n\n## Development\n\n### Running the full stack in development:\n\n```bash\nnpm run dev\n```\n\nThis runs both:\n\n- Frontend (Vite) on http://localhost:5173\n- API server on http://localhost:3001\n\n### Running individually:\n\n```bash\n# Frontend only\nnpm run dev:vite\n\n# API server only\nnpm run dev:api\n```\n\n## API Endpoints\n\nThe API server provides the following endpoints:\n\n- `GET /api/hello` - Simple hello message\n- `GET /api/users` - Get list of users (mock data)\n- `POST /api/users` - Create a new user\n- `GET /api/status` - API status and environment info\n- `GET /health` - Health check\n\n### Example API calls:\n\n```javascript\n// Import the API utility\nimport { api } from "./utils/api";\n\n// Fetch users\nconst users = await api.get("api/users");\n\n// Create a user\nconst newUser = await api.post("api/users", {\n  name: "John Doe",\n  email: "john@example.com",\n});\n\n// Update a user\nconst updatedUser = await api.put("api/users/1", {\n  name: "Jane Doe",\n});\n\n// Delete a user\nawait api.delete("api/users/1");\n```\n\n### Environment Configuration\n\nThe app automatically detects the environment and uses the correct API endpoint:\n\n- **Development**: API calls are proxied through Vite dev server (same origin)\n- **Production**: API calls go directly to `/api/*` on the same domain\n\nEnvironment files:\n\n- `.env.development` - Development settings\n- `.env.production` - Production settings\n- `.env` - Default fallback settings\n\n## Production\n\nIn production (FastEdge WASM environment), both static files and API routes are served from the same server on the same domain, avoiding CORS issues.\n\nThe API routes will be available at:\n\n- `https://yourdomain.com/api/*`\n\n## Adding New API Routes\n\n1. Edit `fastedge-server/api/routes.js`\n2. Add your new routes to the `api` Hono instance\n3. The routes will automatically be available in both development and production\n\n## Notes\n\n- **Development**: Vite proxy forwards `/api/*` requests to the dev server on port 3001\n- **Production**: API routes are served directly from the same WASM bundle\n- CORS is enabled on the dev server for direct API access if needed\n- The `api` utility automatically handles environment differences\n- All API routes are prefixed with `/api/`\n- Environment variables are automatically loaded by Vite based on the mode\n', "ENVIRONMENT-SETUP.md": '# API Environment Setup Summary\n\n## What was set up:\n\n### 1. Environment Variables\n\n- `.env` - Default/fallback settings\n- `.env.development` - Development mode settings\n- `.env.production` - Production mode settings\n\n### 2. API Utility (`src/utils/api.js`)\n\n- Automatically detects environment (dev vs prod)\n- Provides convenient methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`\n- Handles URL building for different environments\n- TypeScript typed for better developer experience\n\n### 3. Vite Proxy Configuration\n\n- Development: Proxies `/api/*` requests to `localhost:3001`\n- Production: Serves API routes from same domain\n\n### 4. Updated React App\n\n- Demo component showing how to use the API utility\n- Environment info display\n- API interaction examples\n\n## How it works:\n\n### Development Mode:\n\n1. Run `npm run dev` to start both frontend and API server\n2. Frontend runs on `http://localhost:5173`\n3. API server runs on `http://localhost:3001`\n4. Vite proxy forwards `/api/*` requests from frontend to API server\n5. Your React code just calls `api.get(\'/api/users\')` - no URL management needed\n\n### Production Mode:\n\n1. Build with `npm run build`\n2. Both frontend and API are served from the same FastEdge WASM bundle\n3. API routes available at `https://yourdomain.com/api/*`\n4. Same React code works without changes\n\n## Usage in React Components:\n\n```tsx\nimport { api } from "../utils/api";\n\n// In your component\nconst fetchData = async () => {\n  try {\n    const users = await api.get("api/users");\n    setUsers(users);\n  } catch (error) {\n    console.error("Failed to fetch users:", error);\n  }\n};\n\nconst createUser = async (userData) => {\n  try {\n    const newUser = await api.post("api/users", userData);\n    return newUser;\n  } catch (error) {\n    console.error("Failed to create user:", error);\n  }\n};\n```\n\n## Benefits:\n\n\u2705 **No hardcoded URLs** - Environment automatically detected\n\u2705 **Same code works in dev and prod** - No environment-specific changes needed\n\u2705 **Type safety** - TypeScript support throughout\n\u2705 **Easy to use** - Simple API methods instead of manual fetch calls\n\u2705 **Proxy in dev** - No CORS issues during development\n\u2705 **Clean separation** - API routes separate from static serving logic\n\n## Commands:\n\n```bash\n# Run frontend only\nnpm run dev:vite\n\n# Run API server only\nnpm run dev:api\n\n# Run both frontend and API\nnpm run dev\n\n# Build for production\nnpm run build\n```\n', "README.md": "# FastEdge React Application\n\nA React + Vite frontend served from a FastEdge application using Hono.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/react-app.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.\n\n## Development\n\n```bash\nnpm run dev\n```\n\nThis will run the Vite server for developing your React front-end with HMR as well as a Hono server to provide the `/api` routes.\n\n## How it works\n\nThe React site is broken down into 2 main sections:\n\n\u251C\u2500\u2500 /fastedge-server \\\n\u2514\u2500\u2500 /src\n\n- /fastedge-server: \\\n  This is the backend for the React site, it is the FastEdge application that serves the React site and handles any backend API routes, \\\n  it is using [Hono](https://hono.dev/) to handle all incoming requests.\n\n- /src: \\\n  This is the React front end code. This gets built using Vite's React tooling.\n\nDuring the build process it takes all of your front-end code and embeds it into the wasm binary. \\\nThis allows the FastEdge static-server to serve your React site to the browser [(read more)](https://g-core.github.io/FastEdge-sdk-js/guides/creating-a-static-manifest/).\n\nApart from serving your React site, this example also provides some back-end routes: `/api/users`\n\nDuring development the `fastedge-server` is replaced with a [dev-server](./fastedge-server/dev-server.js). This makes for a faster development cycle.\n\n> **Note** \\\n> This dev-server is not a direct replacement for testing within the FastEdge environment. \\\n> @Hono/node-server does not have the same limitations or functionality as FastEdge. \\\n> This is purely provided as an example of how to achieve this working environment.\n", "VITE-README.md": "# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## React Compiler\n\nThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n\n      // Remove tseslint.configs.recommended and replace with this\n      tseslint.configs.recommendedTypeChecked,\n      // Alternatively, use this for stricter rules\n      tseslint.configs.strictTypeChecked,\n      // Optionally, add this for stylistic rules\n      tseslint.configs.stylisticTypeChecked,\n\n      // Other configs...\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from 'eslint-plugin-react-x'\nimport reactDom from 'eslint-plugin-react-dom'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n      // Enable lint rules for React\n      reactX.configs['recommended-typescript'],\n      // Enable lint rules for React DOM\n      reactDom.configs.recommended,\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n", "eslint.config.js": 'import js from "@eslint/js";\nimport globals from "globals";\nimport reactHooks from "eslint-plugin-react-hooks";\nimport reactRefresh from "eslint-plugin-react-refresh";\nimport { defineConfig, globalIgnores } from "eslint/config";\n\nexport default defineConfig([\n  globalIgnores(["dist"]),\n  {\n    files: ["**/*.{js,jsx}"],\n    extends: [\n      js.configs.recommended,\n      reactHooks.configs["recommended-latest"],\n      reactRefresh.configs.vite,\n    ],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n      parserOptions: {\n        ecmaVersion: "latest",\n        ecmaFeatures: { jsx: true },\n        sourceType: "module",\n      },\n    },\n    rules: {\n      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],\n    },\n  },\n  {\n    files: ["fastedge-server/dev-server.js"],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.node,\n      parserOptions: {\n        ecmaVersion: "latest",\n        sourceType: "module",\n      },\n    },\n    rules: {\n      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],\n    },\n  },\n]);\n', "fastedge-server/api/routes.js": 'import { Hono } from "hono";\n\nconst api = new Hono();\n\n// Example API routes\napi.get("/hello", async (c) => {\n  return c.json({ message: "Hello from API!" });\n});\n\napi.get("/users", async (c) => {\n  // Mock data - replace with your actual data source\n  const users = [\n    { id: 1, name: "John Doe", email: "john@example.com" },\n    { id: 2, name: "Jane Smith", email: "jane@example.com" },\n  ];\n  return c.json(users);\n});\n\napi.post("/users", async (c) => {\n  try {\n    const body = await c.req.json();\n    // Handle user creation logic here\n    return c.json({ success: true, data: body }, 201);\n  } catch {\n    return c.json({ error: "Invalid JSON" }, 400);\n  }\n});\n\napi.get("/status", async (c) => {\n  return c.json({\n    status: "ok",\n    timestamp: new Date().toISOString(),\n    environment: "fastedge",\n  });\n});\n\nexport { api };\n', "fastedge-server/config/asset-manifest.js": "/*\n * DO NOT EDIT THIS FILE - Generated by @gcoredev/FastEdge-sdk-js\n *\n * It will be overwritten on the next build.\n */\n\nconst staticAssetManifest = {\n  '/assets/index-BOPrukpD.js': { assetKey: '/assets/index-BOPrukpD.js', contentType: 'application/javascript', isText: true, fileInfo: { size: 197052, hash: '8637571ca3a16ca6fd5fc4ecb17a5e5026b0714b45fbefb2842a9afd3de6c34b', lastModifiedTime: 1761317967, assetPath: './dist/assets/index-BOPrukpD.js' }, lastModifiedTime: 1761317967, type: 'wasm-inline' },\n  '/assets/index-COcDBgFa.css': { assetKey: '/assets/index-COcDBgFa.css', contentType: 'text/css', isText: true, fileInfo: { size: 1381, hash: '053fffbd3cb2f092a85d67a83459e078b9fe405f2da931b9d21d03d6a853bf34', lastModifiedTime: 1761317967, assetPath: './dist/assets/index-COcDBgFa.css' }, lastModifiedTime: 1761317967, type: 'wasm-inline' },\n  '/assets/react-CHdo91hT.svg': { assetKey: '/assets/react-CHdo91hT.svg', contentType: 'image/svg+xml', isText: true, fileInfo: { size: 4126, hash: '35ef61ed53b323ae94a16a8ec659b3d0af3880698791133f23b084085ab1c2e5', lastModifiedTime: 1761317967, assetPath: './dist/assets/react-CHdo91hT.svg' }, lastModifiedTime: 1761317967, type: 'wasm-inline' },\n  '/index.html': { assetKey: '/index.html', contentType: 'text/html', isText: true, fileInfo: { size: 463, hash: '77cc1130ddd54c2cf4ec4456ed133ca40c87e85dde178380d6aa9051faad764a', lastModifiedTime: 1761317967, assetPath: './dist/index.html' }, lastModifiedTime: 1761317967, type: 'wasm-inline' },\n  '/vite.svg': { assetKey: '/vite.svg', contentType: 'image/svg+xml', isText: true, fileInfo: { size: 1497, hash: '4a748afd443918bb16591c834c401dae33e87861ab5dbad0811c3a3b4a9214fb', lastModifiedTime: 1761317967, assetPath: './dist/vite.svg' }, lastModifiedTime: 1761317967, type: 'wasm-inline' },\n};\n\nexport { staticAssetManifest };\n", "fastedge-server/config/build-config.js": 'const config = {\n  type: "static",\n  entryPoint: "./fastedge-server/server.js",\n  ignoreDotFiles: true,\n  ignoreDirs: ["./node_modules"],\n  ignoreWellKnown: false,\n  tsConfigPath: "./tsconfig.fastedge.json",\n  wasmOutput: "wasm/react-app.wasm",\n  publicDir: "./dist",\n  assetManifestPath: "./fastedge-server/config/asset-manifest.js",\n  contentTypes: [],\n};\n\nexport { config };\n', "fastedge-server/config/server.config.js": 'const serverConfig = {\n  type: "static",\n  extendedCache: [],\n  publicDirPrefix: "",\n  compression: [],\n  notFoundPage: "/404.html",\n  autoExt: [],\n  autoIndex: ["index.html", "index.htm"],\n  spaEntrypoint: "/index.html",\n};\n\nexport { serverConfig };\n', "fastedge-server/dev-server.js": 'import { Hono } from "hono";\nimport { cors } from "hono/cors";\nimport { serve } from "@hono/node-server";\nimport { api } from "./api/routes.js";\n\nconst app = new Hono();\n\n// Enable CORS for development\napp.use(\n  "*",\n  cors({\n    origin: ["http://localhost:5173", "http://localhost:3000"], // Add your frontend URLs\n    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],\n    allowHeaders: ["Content-Type", "Authorization"],\n  })\n);\n\n// Mount API routes\napp.route("/api", api);\n\n// Health check\napp.get("/", (c) => {\n  return c.json({\n    message: "API Development Server",\n    version: "1.0.0",\n    endpoints: {\n      api: "/api/*",\n      health: "/health",\n    },\n  });\n});\n\napp.get("/health", (c) => {\n  return c.json({ status: "healthy", timestamp: new Date().toISOString() });\n});\n\nconst port = Number(process.env.PORT) || 3001;\n\nconsole.log(`\u{1F680} API Server running on http://localhost:${port}`);\n\nserve({\n  fetch: app.fetch,\n  port,\n});\n', "fastedge-server/server.js": 'import { createStaticServer } from "@gcoredev/fastedge-sdk-js";\nimport { Hono } from "hono";\n\nimport { serverConfig } from "./config/server.config.js";\nimport { staticAssetManifest } from "./config/asset-manifest.js";\nimport { api } from "./api/routes.js";\n\nconst staticServer = createStaticServer(staticAssetManifest, serverConfig);\n\nconst app = new Hono();\n\n// Mount API routes for production\napp.route("/api", api);\n\n// Handle static files - this should come after API routes\napp.get("*", async (c) => {\n  return staticServer.serveRequest(c.req.raw);\n});\n\naddEventListener("fetch", (event) => {\n  event.respondWith(app.fetch(event.request));\n});\n', "index.html": '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>FastEdge - React</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>\n', "package.json": '{\n  "name": "react-app-fastedge",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "npm-run-all -p dev:vite dev:api",\n    "dev:vite": "vite",\n    "dev:api": "node fastedge-server/dev-server.js",\n    "build": "npm-run-all -s build:client build:server",\n    "build:server": "npx fastedge-build --config ./fastedge-server/config/build-config.js",\n    "build:client": "vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest",\n    "hono": "^4.9.8",\n    "react": "^19.1.1",\n    "react-dom": "^19.1.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.36.0",\n    "@hono/node-server": "^1.19.5",\n    "@types/node": "^24.6.0",\n    "@types/react": "^19.1.16",\n    "@types/react-dom": "^19.1.9",\n    "@vitejs/plugin-react": "^5.0.4",\n    "eslint": "^9.36.0",\n    "eslint-plugin-react-hooks": "^5.2.0",\n    "eslint-plugin-react-refresh": "^0.4.22",\n    "globals": "^16.4.0",\n    "npm-run-all2": "^8.0.4",\n    "vite": "^7.1.7"\n  }\n}\n', "public/vite.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>', "src/App.css": "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n", "src/App.jsx": 'import { useState } from "react";\nimport reactLogo from "./assets/react.svg";\nimport viteLogo from "/vite.svg";\nimport "./App.css";\nimport { api, apiConfig } from "./utils/api";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n\n  // Function to fetch users from API\n  const fetchUsers = async () => {\n    setLoading(true);\n    setError(null);\n    try {\n      const data = await api.get("api/users");\n      setUsers(data);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Failed to fetch users");\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return (\n    <>\n      <div>\n        <a href="https://vite.dev" target="_blank">\n          <img src={viteLogo} className="logo" alt="Vite logo" />\n        </a>\n        <a href="https://react.dev" target="_blank">\n          <img src={reactLogo} className="logo react" alt="React logo" />\n        </a>\n      </div>\n      <h1>Vite + React + FastEdge</h1>\n\n      {/* Environment Info */}\n      <div className="card">\n        <h3>Environment Info</h3>\n        <p>Mode: {apiConfig.isDevelopment ? "Development" : "Production"}</p>\n        <p>API Base URL: {apiConfig.baseUrl || "Same domain"}</p>\n      </div>\n\n      {/* Counter Demo */}\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.jsx</code> and save to test HMR\n        </p>\n      </div>\n\n      {/* API Demo */}\n      <div className="card">\n        <h3>API Demo</h3>\n        <div style={{ marginBottom: "1rem" }}>\n          <button onClick={fetchUsers} disabled={loading}>\n            {loading ? "Loading..." : "Fetch Users"}\n          </button>\n        </div>\n\n        {error && <p style={{ color: "red" }}>Error: {error}</p>}\n\n        {users.length > 0 && (\n          <div\n            style={{\n              display: "flex",\n              flexDirection: "column",\n              alignItems: "center",\n            }}\n          >\n            <h4>Users:</h4>\n            <ul style={{ textAlign: "left" }}>\n              {users.map((user) => (\n                <li key={user.id}>\n                  {user.name} ({user.email})\n                </li>\n              ))}\n            </ul>\n          </div>\n        )}\n      </div>\n\n      <p className="read-the-docs">\n        Click on the Vite and React logos to learn more\n      </p>\n      <p className="read-the-docs">Powered by FastEdge</p>\n    </>\n  );\n}\n\nexport default App;\n', "src/assets/react.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>', "src/index.css": ":root {\n  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n", "src/main.jsx": 'import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./index.css";\nimport App from "./App.jsx";\n\ncreateRoot(document.getElementById("root")).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n', "src/utils/api.js": '// API configuration utility\n// This handles the API base URL for different environments\n\nconst getApiConfig = () => {\n  // In development, use the separate dev server\n  // In production, API routes are served from the same domain\n  const baseUrl = import.meta.env.VITE_API_URL || "";\n  const isDevelopment = import.meta.env.DEV;\n  const isProduction = import.meta.env.PROD;\n\n  return {\n    baseUrl,\n    isDevelopment,\n    isProduction,\n  };\n};\n\nconst apiConfig = getApiConfig();\n\n// Helper function to build API URLs\nexport const buildApiUrl = (endpoint) => {\n  // Remove leading slash if present to avoid double slashes\n  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;\n\n  if (apiConfig.isDevelopment) {\n    // Development: use full URL to dev server\n    return `${apiConfig.baseUrl}/${cleanEndpoint}`;\n  } else {\n    // Production: use relative path (same domain)\n    return `/${cleanEndpoint}`;\n  }\n};\n\n// Convenient API client\nexport const api = {\n  // GET request\n  get: async (endpoint) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url);\n    if (!response.ok) {\n      throw new Error(`API GET ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // POST request\n  post: async (endpoint, data) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "POST",\n      headers: {\n        "Content-Type": "application/json",\n      },\n      body: data ? JSON.stringify(data) : undefined,\n    });\n    if (!response.ok) {\n      throw new Error(`API POST ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // PUT request\n  put: async (endpoint, data) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "PUT",\n      headers: {\n        "Content-Type": "application/json",\n      },\n      body: data ? JSON.stringify(data) : undefined,\n    });\n    if (!response.ok) {\n      throw new Error(`API PUT ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // DELETE request\n  delete: async (endpoint) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "DELETE",\n    });\n    if (!response.ok) {\n      throw new Error(`API DELETE ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n};\n\nexport { apiConfig };\n', "vite.config.js": 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      // Proxy API requests to the development server\n      "/api": {\n        target: "http://localhost:3001",\n        changeOrigin: true,\n        secure: false,\n      },\n    },\n  },\n});\n' } }, { "description": "React application starter-kit using Vite and Hono framework, provides backend server functionality", "language": "typescript", "applicationType": "http", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\nnode_modules/\nout/\ndist/\nbuild/\n*.wasm\n*.local\n\n# Environment variables\n.env.local\n.env.*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/\n", "API-README.md": '# API Routes Setup\n\nThis project now has a clean separation between static site serving and API backend routes.\n\n## Structure\n\n```\nfastedge-server/\n\u251C\u2500\u2500 server.tsx              # Main FastEdge server (production)\n\u251C\u2500\u2500 dev-server.ts           # Development API server\n\u251C\u2500\u2500 server.config.ts        # Static server configuration\n\u2514\u2500\u2500 api/\n    \u2514\u2500\u2500 routes.ts           # API route definitions\n```\n\n## Development\n\n### Running the full stack in development:\n\n```bash\nnpm run dev\n```\n\nThis runs both:\n\n- Frontend (Vite) on http://localhost:5173\n- API server on http://localhost:3001\n\n### Running individually:\n\n```bash\n# Frontend only\nnpm run dev:vite\n\n# API server only\nnpm run dev:api\n```\n\n## API Endpoints\n\nThe API server provides the following endpoints:\n\n- `GET /api/hello` - Simple hello message\n- `GET /api/users` - Get list of users (mock data)\n- `POST /api/users` - Create a new user\n- `GET /api/status` - API status and environment info\n- `GET /health` - Health check\n\n### Example API calls:\n\n```javascript\n// Import the API utility\nimport { api } from "./utils/api";\n\n// Fetch users\nconst users = await api.get("api/users");\n\n// Create a user\nconst newUser = await api.post("api/users", {\n  name: "John Doe",\n  email: "john@example.com",\n});\n\n// Update a user\nconst updatedUser = await api.put("api/users/1", {\n  name: "Jane Doe",\n});\n\n// Delete a user\nawait api.delete("api/users/1");\n```\n\n### Environment Configuration\n\nThe app automatically detects the environment and uses the correct API endpoint:\n\n- **Development**: API calls are proxied through Vite dev server (same origin)\n- **Production**: API calls go directly to `/api/*` on the same domain\n\nEnvironment files:\n\n- `.env.development` - Development settings\n- `.env.production` - Production settings\n- `.env` - Default fallback settings\n\n## Production\n\nIn production (FastEdge WASM environment), both static files and API routes are served from the same server on the same domain, avoiding CORS issues.\n\nThe API routes will be available at:\n\n- `https://yourdomain.com/api/*`\n\n## Adding New API Routes\n\n1. Edit `fastedge-server/api/routes.ts`\n2. Add your new routes to the `api` Hono instance\n3. The routes will automatically be available in both development and production\n\n## Notes\n\n- **Development**: Vite proxy forwards `/api/*` requests to the dev server on port 3001\n- **Production**: API routes are served directly from the same WASM bundle\n- CORS is enabled on the dev server for direct API access if needed\n- The `api` utility automatically handles environment differences\n- All API routes are prefixed with `/api/`\n- Environment variables are automatically loaded by Vite based on the mode\n', "ENVIRONMENT-SETUP.md": '# API Environment Setup Summary\n\n## What was set up:\n\n### 1. Environment Variables\n\n- `.env` - Default/fallback settings\n- `.env.development` - Development mode settings\n- `.env.production` - Production mode settings\n- `src/vite-env.d.ts` - TypeScript declarations for env variables\n\n### 2. API Utility (`src/utils/api.ts`)\n\n- Automatically detects environment (dev vs prod)\n- Provides convenient methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`\n- Handles URL building for different environments\n- TypeScript typed for better developer experience\n\n### 3. Vite Proxy Configuration\n\n- Development: Proxies `/api/*` requests to `localhost:3001`\n- Production: Serves API routes from same domain\n\n### 4. Updated React App\n\n- Demo component showing how to use the API utility\n- Environment info display\n- API interaction examples\n\n## How it works:\n\n### Development Mode:\n\n1. Run `npm run dev` to start both frontend and API server\n2. Frontend runs on `http://localhost:5173`\n3. API server runs on `http://localhost:3001`\n4. Vite proxy forwards `/api/*` requests from frontend to API server\n5. Your React code just calls `api.get(\'/api/users\')` - no URL management needed\n\n### Production Mode:\n\n1. Build with `npm run build`\n2. Both frontend and API are served from the same FastEdge WASM bundle\n3. API routes available at `https://yourdomain.com/api/*`\n4. Same React code works without changes\n\n## Usage in React Components:\n\n```tsx\nimport { api } from "../utils/api";\n\n// In your component\nconst fetchData = async () => {\n  try {\n    const users = await api.get("api/users");\n    setUsers(users);\n  } catch (error) {\n    console.error("Failed to fetch users:", error);\n  }\n};\n\nconst createUser = async (userData) => {\n  try {\n    const newUser = await api.post("api/users", userData);\n    return newUser;\n  } catch (error) {\n    console.error("Failed to create user:", error);\n  }\n};\n```\n\n## Benefits:\n\n\u2705 **No hardcoded URLs** - Environment automatically detected\n\u2705 **Same code works in dev and prod** - No environment-specific changes needed\n\u2705 **Type safety** - TypeScript support throughout\n\u2705 **Easy to use** - Simple API methods instead of manual fetch calls\n\u2705 **Proxy in dev** - No CORS issues during development\n\u2705 **Clean separation** - API routes separate from static serving logic\n\n## Commands:\n\n```bash\n# Run frontend only\nnpm run dev:vite\n\n# Run API server only\nnpm run dev:api\n\n# Run both frontend and API\nnpm run dev\n\n# Build for production\nnpm run build\n```\n', "README.md": "# FastEdge React Application\n\nA React + Vite frontend served from a FastEdge application using Hono.\n\nThis starter-kit provides backend route functionality examples for Users.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./wasm/react-app.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.\n\n## Development\n\n```bash\nnpm run dev\n```\n\nThis will run the Vite server for developing your React front-end with HMR as well as a Hono server to provide the `/api` routes.\n\n## How it works\n\nThe React site is broken down into 2 main sections:\n\n\u251C\u2500\u2500 /fastedge-server \\\n\u2514\u2500\u2500 /src\n\n- /fastedge-server: \\\n  This is the backend for the React site, it is the FastEdge application that serves the React site and handles any backend API routes, \\\n  it is using [Hono](https://hono.dev/) to handle all incoming requests.\n\n- /src: \\\n  This is the React front end code. This gets built using Vite's React tooling.\n\nDuring the build process it takes all of your front-end code and embeds it into the wasm binary. \\\nThis allows the FastEdge static-server to serve your React site to the browser [(read more)](https://g-core.github.io/FastEdge-sdk-js/guides/creating-a-static-manifest/).\n\nApart from serving your React site, this example also provides some back-end routes: `/api/users`\n\nDuring development the `fastedge-server` is replaced with a [dev-server](./fastedge-server//dev-server.ts). This makes for a faster development cycle.\n\n> **Note** \\\n> This dev-server is not a direct replacement for testing within the FastEdge environment. \\\n> @Hono/node-server does not have the same limitations or functionality as FastEdge. \\\n> This is purely provided as an example of how to achieve this working environment.\n", "VITE-README.md": "# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## React Compiler\n\nThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n\n      // Remove tseslint.configs.recommended and replace with this\n      tseslint.configs.recommendedTypeChecked,\n      // Alternatively, use this for stricter rules\n      tseslint.configs.strictTypeChecked,\n      // Optionally, add this for stylistic rules\n      tseslint.configs.stylisticTypeChecked,\n\n      // Other configs...\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from 'eslint-plugin-react-x'\nimport reactDom from 'eslint-plugin-react-dom'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n      // Enable lint rules for React\n      reactX.configs['recommended-typescript'],\n      // Enable lint rules for React DOM\n      reactDom.configs.recommended,\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n", "eslint.config.js": "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport tseslint from 'typescript-eslint'\nimport { defineConfig, globalIgnores } from 'eslint/config'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      js.configs.recommended,\n      tseslint.configs.recommended,\n      reactHooks.configs['recommended-latest'],\n      reactRefresh.configs.vite,\n    ],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n  },\n])\n", "fastedge-server/api/routes.ts": 'import { Hono } from "hono";\n\nconst api = new Hono();\n\n// Example API routes\napi.get("/hello", async (c) => {\n  return c.json({ message: "Hello from API!" });\n});\n\napi.get("/users", async (c) => {\n  // Mock data - replace with your actual data source\n  const users = [\n    { id: 1, name: "John Doe", email: "john@example.com" },\n    { id: 2, name: "Jane Smith", email: "jane@example.com" },\n  ];\n  return c.json(users);\n});\n\napi.post("/users", async (c) => {\n  try {\n    const body = await c.req.json();\n    // Handle user creation logic here\n    return c.json({ success: true, data: body }, 201);\n  } catch {\n    return c.json({ error: "Invalid JSON" }, 400);\n  }\n});\n\napi.get("/status", async (c) => {\n  return c.json({\n    status: "ok",\n    timestamp: new Date().toISOString(),\n    environment: "fastedge",\n  });\n});\n\nexport { api };\n', "fastedge-server/config/asset-manifest.ts": "/*\n * DO NOT EDIT THIS FILE - Generated by @gcoredev/FastEdge-sdk-js\n *\n * It will be overwritten on the next build.\n */\n\nconst staticAssetManifest = {};\n\nexport { staticAssetManifest };\n", "fastedge-server/config/build-config.ts": 'const config = {\n  type: "static",\n  entryPoint: "./fastedge-server/server.ts",\n  ignoreDotFiles: true,\n  ignoreDirs: ["./node_modules"],\n  ignoreWellKnown: false,\n  tsConfigPath: "./tsconfig.fastedge.json",\n  wasmOutput: "wasm/react-app.wasm",\n  publicDir: "./dist",\n  assetManifestPath: "./fastedge-server/config/asset-manifest.ts",\n  contentTypes: [],\n};\n\nexport { config };\n', "fastedge-server/config/server.config.ts": 'const serverConfig = {\n  type: "static",\n  extendedCache: [],\n  publicDirPrefix: "",\n  compression: [],\n  notFoundPage: "/404.html",\n  autoExt: [],\n  autoIndex: ["index.html", "index.htm"],\n  spaEntrypoint: "/index.html",\n};\n\nexport { serverConfig };\n', "fastedge-server/dev-server.ts": 'import { Hono } from "hono";\nimport { cors } from "hono/cors";\nimport { serve } from "@hono/node-server";\nimport { api } from "./api/routes.js";\n\nconst app = new Hono();\n\n// Enable CORS for development\napp.use(\n  "*",\n  cors({\n    origin: ["http://localhost:5173", "http://localhost:3000"], // Add your frontend URLs\n    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],\n    allowHeaders: ["Content-Type", "Authorization"],\n  })\n);\n\n// Mount API routes\napp.route("/api", api);\n\n// Health check\napp.get("/", (c) => {\n  return c.json({\n    message: "API Development Server",\n    version: "1.0.0",\n    endpoints: {\n      api: "/api/*",\n      health: "/health",\n    },\n  });\n});\n\napp.get("/health", (c) => {\n  return c.json({ status: "healthy", timestamp: new Date().toISOString() });\n});\n\nconst port = Number(process.env.PORT) || 3001;\n\nconsole.log(`\u{1F680} API Server running on http://localhost:${port}`);\n\nserve({\n  fetch: app.fetch,\n  port,\n});\n', "fastedge-server/server.ts": 'import { createStaticServer } from "@gcoredev/fastedge-sdk-js";\nimport { Hono } from "hono";\n\nimport { serverConfig } from "./config/server.config.js";\nimport { staticAssetManifest } from "./config/asset-manifest.js";\nimport { api } from "./api/routes.js";\n\nconst staticServer = createStaticServer(staticAssetManifest, serverConfig);\n\nconst app = new Hono();\n\n// Mount API routes for production\napp.route("/api", api);\n\n// Handle static files - this should come after API routes\napp.get("*", async (c) => {\n  return staticServer.serveRequest(c.req.raw);\n});\n\naddEventListener("fetch", (event: FetchEvent) => {\n  event.respondWith(app.fetch(event.request));\n});\n', "index.html": '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>FastEdge - React</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n', "package.json": '{\n  "name": "react-app-fastedge",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "npm-run-all -p dev:vite dev:api",\n    "dev:vite": "vite",\n    "dev:api": "node --import=tsx/esm fastedge-server/dev-server.ts",\n    "build": "npm-run-all -s build:client build:server",\n    "build:server": "npx fastedge-build --config ./fastedge-server/config/build-config.ts",\n    "build:client": "tsc -b && vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "@gcoredev/fastedge-sdk-js": "latest",\n    "hono": "^4.9.8",\n    "react": "^19.1.1",\n    "react-dom": "^19.1.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.36.0",\n    "@hono/node-server": "^1.19.5",\n    "@types/node": "^24.6.0",\n    "@types/react": "^19.1.16",\n    "@types/react-dom": "^19.1.9",\n    "@vitejs/plugin-react": "^5.0.4",\n    "eslint": "^9.36.0",\n    "eslint-plugin-react-hooks": "^5.2.0",\n    "eslint-plugin-react-refresh": "^0.4.22",\n    "globals": "^16.4.0",\n    "npm-run-all2": "^8.0.4",\n    "ts-node": "^10.9.2",\n    "tsx": "^4.20.6",\n    "typescript": "~5.9.3",\n    "typescript-eslint": "^8.45.0",\n    "vite": "^7.1.7"\n  }\n}\n', "public/vite.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>', "src/App.css": "#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}\n", "src/App.tsx": 'import { useState } from "react";\nimport reactLogo from "./assets/react.svg";\nimport viteLogo from "/vite.svg";\nimport "./App.css";\nimport { api, apiConfig } from "./utils/api";\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [users, setUsers] = useState<User[]>([]);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  // Function to fetch users from API\n  const fetchUsers = async () => {\n    setLoading(true);\n    setError(null);\n    try {\n      const data = await api.get("api/users");\n      setUsers(data);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Failed to fetch users");\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return (\n    <>\n      <div>\n        <a href="https://vite.dev" target="_blank">\n          <img src={viteLogo} className="logo" alt="Vite logo" />\n        </a>\n        <a href="https://react.dev" target="_blank">\n          <img src={reactLogo} className="logo react" alt="React logo" />\n        </a>\n      </div>\n      <h1>Vite + React + FastEdge</h1>\n\n      {/* Environment Info */}\n      <div className="card">\n        <h3>Environment Info</h3>\n        <p>Mode: {apiConfig.isDevelopment ? "Development" : "Production"}</p>\n        <p>API Base URL: {apiConfig.baseUrl || "Same domain"}</p>\n      </div>\n\n      {/* Counter Demo */}\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.tsx</code> and save to test HMR\n        </p>\n      </div>\n\n      {/* API Demo */}\n      <div className="card">\n        <h3>API Demo</h3>\n        <div style={{ marginBottom: "1rem" }}>\n          <button onClick={fetchUsers} disabled={loading}>\n            {loading ? "Loading..." : "Fetch Users"}\n          </button>\n        </div>\n\n        {error && <p style={{ color: "red" }}>Error: {error}</p>}\n\n        {users.length > 0 && (\n          <div\n            style={{\n              display: "flex",\n              flexDirection: "column",\n              alignItems: "center",\n            }}\n          >\n            <h4>Users:</h4>\n            <ul style={{ textAlign: "left" }}>\n              {users.map((user) => (\n                <li key={user.id}>\n                  {user.name} ({user.email})\n                </li>\n              ))}\n            </ul>\n          </div>\n        )}\n      </div>\n\n      <p className="read-the-docs">\n        Click on the Vite and React logos to learn more\n      </p>\n      <p className="read-the-docs">Powered by FastEdge</p>\n    </>\n  );\n}\n\nexport default App;\n', "src/assets/react.svg": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>', "src/index.css": ":root {\n  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\nbutton:hover {\n  border-color: #646cff;\n}\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #747bff;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n", "src/main.tsx": "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.tsx'\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n)\n", "src/utils/api.ts": '// API configuration utility\n// This handles the API base URL for different environments\n\ninterface ApiConfig {\n  baseUrl: string;\n  isDevelopment: boolean;\n  isProduction: boolean;\n}\n\nconst getApiConfig = (): ApiConfig => {\n  // In development, use the separate dev server\n  // In production, API routes are served from the same domain\n  const baseUrl = import.meta.env.VITE_API_URL || "";\n  const isDevelopment = import.meta.env.DEV;\n  const isProduction = import.meta.env.PROD;\n\n  return {\n    baseUrl,\n    isDevelopment,\n    isProduction,\n  };\n};\n\nconst apiConfig = getApiConfig();\n\n// Helper function to build API URLs\nexport const buildApiUrl = (endpoint: string): string => {\n  // Remove leading slash if present to avoid double slashes\n  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;\n\n  if (apiConfig.isDevelopment) {\n    // Development: use full URL to dev server\n    return `${apiConfig.baseUrl}/${cleanEndpoint}`;\n  } else {\n    // Production: use relative path (same domain)\n    return `/${cleanEndpoint}`;\n  }\n};\n\n// Convenient API client\nexport const api = {\n  // GET request\n  get: async (endpoint: string) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url);\n    if (!response.ok) {\n      throw new Error(`API GET ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // POST request\n  post: async (endpoint: string, data?: unknown) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "POST",\n      headers: {\n        "Content-Type": "application/json",\n      },\n      body: data ? JSON.stringify(data) : undefined,\n    });\n    if (!response.ok) {\n      throw new Error(`API POST ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // PUT request\n  put: async (endpoint: string, data?: unknown) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "PUT",\n      headers: {\n        "Content-Type": "application/json",\n      },\n      body: data ? JSON.stringify(data) : undefined,\n    });\n    if (!response.ok) {\n      throw new Error(`API PUT ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n\n  // DELETE request\n  delete: async (endpoint: string) => {\n    const url = buildApiUrl(endpoint);\n    const response = await fetch(url, {\n      method: "DELETE",\n    });\n    if (!response.ok) {\n      throw new Error(`API DELETE ${endpoint} failed: ${response.statusText}`);\n    }\n    return response.json();\n  },\n};\n\nexport { apiConfig };\n', "src/vite-env.d.ts": '/// <reference types="vite/client" />\n\ninterface ImportMetaEnv {\n  readonly VITE_API_URL: string;\n  readonly VITE_NODE_ENV: string;\n}\n\ninterface ImportMeta {\n  readonly env: ImportMetaEnv;\n}\n', "tsconfig.app.json": '{\n  "compilerOptions": {\n    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",\n    "target": "ES2022",\n    "useDefineForClassFields": true,\n    "lib": ["ES2022", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "types": ["vite/client"],\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "verbatimModuleSyntax": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "erasableSyntaxOnly": true,\n    "noFallthroughCasesInSwitch": true,\n    "noUncheckedSideEffectImports": true\n  },\n  "include": ["src"]\n}\n', "tsconfig.fastedge.json": '{\n  "compilerOptions": {\n    "target": "ES2023",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "rootDir": "./fastedge-server",\n    "strict": true,\n    "skipLibCheck": true,\n    "noEmit": true,\n    "lib": ["ES2023"],\n    "types": ["@gcoredev/fastedge-sdk-js"]\n  },\n  "include": ["./fastedge-server/**/*"],\n  "exclude": ["node_modules", "./fastedge-server/dev-server.ts"]\n}\n', "tsconfig.json": '{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" },\n    { "path": "./tsconfig.node.json" }\n  ]\n}\n', "tsconfig.node.json": '{\n  "compilerOptions": {\n    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",\n    "target": "ES2023",\n    "lib": ["ES2023"],\n    "module": "ESNext",\n    "types": ["node"],\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "verbatimModuleSyntax": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "erasableSyntaxOnly": true,\n    "noFallthroughCasesInSwitch": true,\n    "noUncheckedSideEffectImports": true\n  },\n  "include": ["vite.config.ts"]\n}\n', "vite.config.ts": 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      // Proxy API requests to the development server\n      "/api": {\n        target: "http://localhost:3001",\n        changeOrigin: true,\n        secure: false,\n      },\n    },\n  },\n});\n' } }], "cdn-base": [{ "description": "Simple CDN wireframe for request/response event hooks", "language": "assemblyscript", "applicationType": "cdn", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\n**/node_modules/\n**/out/\n**/dist/\n**/build/\n**/*.wasm\n**/target/\n\n# Binaries for programs and plugins\n/bin\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# other\n.DS_Store\n/coverage\n/typings\n.npm\n.eslintcache\n\n# dotenv environment variable files\n.env\n.env.*\n!.env.example\n\n# IDEs and editors\n/.idea\n.project\n.classpath\n.c9/\n*.launch\n.settings/\n*.sublime-workspace\n\n# IDE - VSCode\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/*\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/", "README.md": "# FastEdge Basic CDN Application\n\nA simple FastEdge proxy-wasm application that defines the different event hooks for Request/Response.\n\n## Build\n\n```bash\nnpm install\nnpm run build\n```\n\nThis will create `./build/basic-cdn.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.", "asconfig.json": '{\n  "extends": "./node_modules/@assemblyscript/wasi-shim/asconfig.json",\n  "targets": {\n    "debug": {\n      "outFile": "build/debug.wasm",\n      "textFile": "build/debug.wat",\n      "sourceMap": true,\n      "debug": true\n    },\n    "release": {\n      "outFile": "build/release.wasm",\n      "textFile": "build/release.wat",\n      "sourceMap": true,\n      "optimizeLevel": 3,\n      "shrinkLevel": 0,\n      "converge": false,\n      "noAssert": false\n    }\n  },\n  "options": {\n    "bindings": "esm",\n    "use": "abort=abort_proc_exit",\n    "exportRuntime": true\n  }\n}', "assembly/index.ts": 'export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.\nimport {\n  Context,\n  FilterDataStatusValues,\n  FilterHeadersStatusValues,\n  log,\n  LogLevelValues,\n  registerRootContext,\n  RootContext,\n  setLogLevel,\n} from "@gcoredev/proxy-wasm-sdk-as/assembly";\n\nclass HttpBodyRoot extends RootContext {\n  createContext(context_id: u32): Context {\n    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.trace\n    return new HttpBody(context_id, this);\n  }\n}\n\nclass HttpBody extends Context {\n  constructor(context_id: u32, root_context: HttpBodyRoot) {\n    super(context_id, root_context);\n  }\n\n  onRequestHeaders(\n    headers: u32,\n    end_of_stream: bool\n  ): FilterHeadersStatusValues {\n    log(LogLevelValues.info, "onRequestHeaders >>");\n    // Process the request headers here...\n\n    return FilterHeadersStatusValues.Continue;\n  }\n\n  onRequestBody(\n    body_buffer_length: usize,\n    end_of_stream: bool\n  ): FilterDataStatusValues {\n    log(LogLevelValues.info, "onRequestBody >>");\n    if (!end_of_stream) {\n      // Wait until the complete body is buffered\n      return FilterDataStatusValues.StopIterationAndBuffer;\n    }\n\n    // Process the request body here...\n    // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook onRequestHeaders.\n    return FilterDataStatusValues.Continue;\n  }\n\n  onResponseHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {\n    log(LogLevelValues.info, "onResponseHeaders >>");\n    // Process the response headers here...\n\n    return FilterHeadersStatusValues.Continue;\n  }\n\n  onResponseBody(\n    body_buffer_length: usize,\n    end_of_stream: bool\n  ): FilterDataStatusValues {\n    if (!end_of_stream) {\n      // Wait until the complete body is buffered\n      return FilterDataStatusValues.StopIterationAndBuffer;\n    }\n    log(LogLevelValues.info, "onResponseBody >>");\n    // Process the response body here...\n    // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook onResponseHeaders.\n\n    return FilterDataStatusValues.Continue;\n  }\n}\n\nregisterRootContext((context_id: u32) => {\n  return new HttpBodyRoot(context_id);\n}, "httpBody");\n', "package.json": '{\n  "name": "fastedge-basic-cdn-app",\n  "description": "Basic CDN example for FastEdge application",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "build": "asc assembly/index.ts --target release --outFile build/basic-cdn.wasm  --textFile build/basic-cdn.wat --sourceMap --optimize"\n  },\n  "devDependencies": {\n    "assemblyscript": "^0.28.9"\n  },\n  "dependencies": {\n    "@assemblyscript/wasi-shim": "^0.1.0",\n    "@gcoredev/proxy-wasm-sdk-as": "latest"\n  }\n}\n', "tsconfig.json": '{\n  "extends": "assemblyscript/std/assembly.json",\n  "include": ["./**/*.ts"]\n}' } }, { "description": "Simple CDN wireframe for request/response event hooks", "language": "rust", "applicationType": "cdn", "files": { "AGENTS.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### MCP Server (Recommended)\n\nAdd the FastEdge MCP server for build and deploy tools:\n\n```\ncodex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n### Claude Code Plugin (Premium Experience)\n\nFor blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:\n\n```\nclaude plugin add gcore-fastedge\n```\n\nFuture codex plugin coming soon \u{1F680}\n', "CLAUDE.md": '# FastEdge Application\n\nThis is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application \u2014 Wasm-powered serverless compute on 210+ global PoPs.\n\n## Getting Started with AI-Assisted Development\n\n### Claude Code\n\nInstall the FastEdge plugin for the full development experience:\n\n```\nclaude plugin add gcore-fastedge\n```\n\n**What you get:**\n- `/gcore-fastedge:scaffold` \u2014 Add features to your project (KV store, auth, geo-routing, etc.)\n- `/gcore-fastedge:test` \u2014 Set up TDD with `@gcoredev/fastedge-test`\n- `/gcore-fastedge:deploy` \u2014 Build, test, and deploy to FastEdge\n- `/gcore-fastedge:manage` \u2014 Manage apps, secrets, environment variables\n- Auto-triggered SDK reference and best practices\n\n### MCP Server (All Editors)\n\nAdd the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.\n\n```json\n{\n  "mcpServers": {\n    "fastedge": {\n      "type": "stdio",\n      "command": "docker",\n      "args": [\n        "run", "-i", "--rm", "--pull=always",\n        "-v", "${workspaceFolder}:/workspace",\n        "-e", "GCORE_API_KEY",\n        "ghcr.io/g-core/fastedge-mcp-server:latest"\n      ]\n    }\n  }\n}\n```\n\n**What you get:**\n- `build-wasm` \u2014 Compile to WASM (no local toolchain setup needed)\n- `upload-binary` \u2014 Upload WASM to FastEdge\n- `update-or-create-app` \u2014 Deploy or update applications\n- `update-env-vars-app` \u2014 Manage environment variables and secrets\n- SDK reference docs as MCP resources\n\n', ".cargo/config.toml": '[build]\ntarget = "wasm32-wasip1"', ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\nlerna-debug.log*\n\n# Dependencies & build artifacts\n**/node_modules/\n**/out/\n**/dist/\n**/build/\n**/*.wasm\n**/target/\n\n# Binaries for programs and plugins\n/bin\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# other\n.DS_Store\n/coverage\n/typings\n.npm\n.eslintcache\n\n# dotenv environment variable files\n.env\n.env.*\n!.env.example\n\n# IDEs and editors\n/.idea\n.project\n.classpath\n.c9/\n*.launch\n.settings/\n*.sublime-workspace\n\n# IDE - VSCode\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/*\n\n# FastEdge debugger artifacts\n**/.fastedge-debug/", "Cargo.toml": '[package]\nname = "basic_cdn"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nproxy-wasm = "0.2.1"\n\n[lib]\ncrate-type = ["cdylib"]\n', "README.md": "# FastEdge Basic CDN Application\n\nA simple FastEdge proxy-wasm application that defines the different event hooks for Request/Response.\n\n## Build\n\n```bash\ncargo build --release\n```\n\nThis will create `./target/wasm32-wasip1/release/basic_cdn.wasm` ready for deployment.\n\n## Deploy\n\nUse the FastEdge CLI or API to deploy the generated wasm binary file.", "src/lib.rs": 'use proxy_wasm::traits::*;\nuse proxy_wasm::types::*;\n\nproxy_wasm::main! {{\n    proxy_wasm::set_log_level(LogLevel::Info); // Set the log level to info - for more logging reduce this to LogLevel::Trace\n    proxy_wasm::set_root_context(|_| -> Box<dyn RootContext> { Box::new(HttpBodyRoot) });\n}}\n\nstruct HttpBodyRoot;\n\nimpl Context for HttpBodyRoot {}\n\nimpl RootContext for HttpBodyRoot {\n    fn create_http_context(&self, _context_id: u32) -> Option<Box<dyn HttpContext>> {\n        Some(Box::new(HttpBody {}))\n    }\n    fn get_type(&self) -> Option<ContextType> {\n        Some(ContextType::HttpContext)\n    }\n}\n\nstruct HttpBody {}\n\nimpl Context for HttpBody {}\n\nimpl HttpContext for HttpBody {\n    fn on_http_request_headers(&mut self, _: usize, _: bool) -> Action {\n        println!("on_http_request_headers: ");\n        // Process the request headers here...\n\n        Action::Continue\n    }\n\n    fn on_http_request_body(&mut self, _: usize, end_of_stream: bool) -> Action {\n        if end_of_stream {\n            // Wait until the complete body is buffered\n            println!("on_http_request_body: ");\n            // Process the request body here...\n            // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook on_http_request_headers.\n        }\n        Action::Continue\n    }\n\n    fn on_http_response_headers(&mut self, _: usize, _: bool) -> Action {\n        println!("on_http_response_headers: ");\n        // Process the response headers here...\n\n        Action::Continue\n    }\n\n    fn on_http_response_body(&mut self, _: usize, end_of_stream: bool) -> Action {\n        if end_of_stream {\n            println!("on_http_response_body: ");\n            // Process the response body here...\n            // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook on_http_response_headers.\n        }\n        Action::Continue\n    }\n}' } }] };

// src/utils/detect-package-manager.ts
var detectPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) {
    return "npm";
  }
  if (userAgent.startsWith("pnpm")) {
    return "pnpm";
  }
  if (userAgent.startsWith("yarn")) {
    return "yarn";
  }
  return "npm";
};

// src/create-app/validate-config.ts
var relativePath = (fullPath) => {
  if (fullPath === "." || fullPath === "./") {
    return ".";
  }
  if (fullPath.startsWith("./")) {
    return fullPath;
  }
  return `./${fullPath}`;
};
var templateLanguages = (template) => {
  if (template === "") {
    return ["assemblyscript", "javascript", "typescript", "rust"];
  }
  return FastEdgeTemplates[template].map(
    (temp) => temp.language
  );
};
var templateLanguageOptions = (languages) => {
  const langMap = {
    assemblyscript: "AssemblyScript",
    javascript: "JavaScript",
    typescript: "TypeScript",
    rust: "Rust"
  };
  return languages.map((language) => ({
    value: language,
    label: langMap[language]
  }));
};
var availableTemplateOptions = (language) => {
  return Object.entries(FastEdgeTemplates).filter(
    ([_3, templates]) => templates.some((temp) => temp.language === language)
  ).map(([templateName, _3]) => ({
    value: templateName,
    label: templateName
  }));
};
var selectTemplate = async (language, templateArgs) => {
  let selectedTemplate = templateArgs;
  if (templateArgs) {
    M2.step(`Template: ${selectedTemplate}`);
    return [false, selectedTemplate];
  }
  const templateOptions = availableTemplateOptions(language);
  if (templateOptions.length === 1) {
    selectedTemplate = templateOptions[0].value;
    M2.step(`Template: ${selectedTemplate}`);
    return [false, selectedTemplate];
  } else {
    selectedTemplate = await ve({
      message: "Select a template:",
      options: availableTemplateOptions(language)
    });
  }
  return [true, selectedTemplate];
};
var getLanguageInput = async (availableLangs) => {
  const userSelectedLang = await ve({
    message: "Select programming language:",
    options: templateLanguageOptions(availableLangs)
  });
  return [true, userSelectedLang];
};
var validateLanguageSelection = async (args2) => {
  const providedTemplate = args2["--template"] ?? "";
  const availableLangs = templateLanguages(providedTemplate);
  let selectedLang = "";
  if (args2["--javascript"]) {
    selectedLang = "javascript";
  } else if (args2["--typescript"]) {
    selectedLang = "typescript";
  } else if (args2["--rust"]) {
    selectedLang = "rust";
  } else if (args2["--assemblyscript"]) {
    selectedLang = "assemblyscript";
  }
  if (!selectedLang) {
    const userSelectedLang = await getLanguageInput(availableLangs);
    M2.step(`Language: ${userSelectedLang[1]}`);
    return userSelectedLang;
  }
  if (!availableLangs.includes(selectedLang)) {
    if (availableLangs.includes("assemblyscript") && selectedLang === "typescript") {
      selectedLang = "assemblyscript";
    } else {
      if (providedTemplate) {
        M2.warn(
          `The selected template "${providedTemplate}" does not support the provided language "${selectedLang}".`
        );
      }
      selectedLang = await ve({
        message: "Select programming language:",
        options: templateLanguageOptions(availableLangs)
      });
      return [true, selectedLang];
    }
  }
  M2.step(`Language: ${selectedLang}`);
  return [false, selectedLang];
};
var selectDirectory = async (args2) => {
  const remainingArgs = args2._.filter((arg2) => arg2.startsWith("-") === false);
  const hasSingleDirectoryArg = remainingArgs.length === 1;
  let userInteracted = false;
  let pathArg = "./";
  if (hasSingleDirectoryArg) {
    pathArg = relativePath(remainingArgs[0]);
    M2.step(`Creating in provided directory: ${pathArg}`);
  } else {
    userInteracted = true;
    pathArg = await he({
      message: "FastEdge-app will be created at?",
      initialValue: pathArg
    });
  }
  return [userInteracted, pathArg];
};
var confirmSetupConfig = async (args2) => {
  if (!args2["--template"]) {
    for (const template2 of availableTemplates) {
      if (args2._.includes(`--${template2}`)) {
        args2["--template"] = template2;
        break;
      }
    }
  }
  let packageManager = detectPackageManager();
  if (args2["--npm"]) {
    packageManager = "npm";
  } else if (args2["--pnpm"]) {
    packageManager = "pnpm";
  } else if (args2["--yarn"]) {
    packageManager = "yarn";
  }
  const [directoryInteracted, directoryPath] = await selectDirectory(args2);
  const [languageInteracted, language] = await validateLanguageSelection(args2);
  const [templateInteracted, template] = await selectTemplate(
    language,
    args2["--template"] ?? ""
  );
  let configConfirmed = true;
  const needsVerification = !args2["--no-verify"];
  if (needsVerification && !(directoryInteracted && templateInteracted && languageInteracted)) {
    configConfirmed = await ye({
      message: "Do you want to continue?"
    });
  }
  if (!configConfirmed) {
    xe("Operation cancelled");
    return process.exit(0);
  }
  return {
    directoryPath,
    template,
    language,
    packageManager,
    codespaces: !!args2["--codespaces"]
  };
};

// src/create-app/initialized-flag.ts
import path from "node:path";
import fs from "node:fs";
var createInitializedFile = async () => {
  try {
    const devcontainerPath = path.join(process.cwd(), ".devcontainer");
    const flagFilePath = path.join(devcontainerPath, ".codespace-initialized");
    const devcontainerExists = await fs.promises.access(devcontainerPath, fs.constants.F_OK).then(() => true).catch(() => false);
    if (devcontainerExists) {
      await fs.promises.writeFile(flagFilePath, "", "utf8");
    }
  } catch {
  }
};

// src/create-app/create-files.ts
import path2 from "node:path";
import fs2 from "node:fs";
var createTemplateFiles = async (config2) => {
  try {
    const templateFiles = FastEdgeTemplates[config2.template].find(
      (temp) => temp.language === config2.language
    );
    const installDir = path2.resolve(process.cwd(), config2.directoryPath);
    await fs2.promises.mkdir(installDir, { recursive: true });
    if (!templateFiles?.files) {
      throw new Error(
        `No template files found for template "${config2.template}" and language "${config2.language}".`
      );
    }
    const fileEntries = Object.entries(templateFiles.files).map(
      ([path4, content]) => ({
        path: path4,
        content
      })
    );
    for (const file of fileEntries) {
      const filePath = path2.join(installDir, file.path);
      const dirPath = path2.dirname(filePath);
      await fs2.promises.mkdir(dirPath, { recursive: true });
      await fs2.promises.writeFile(filePath, file.content, "utf8");
    }
    return true;
  } catch (error) {
    console.error("Error creating template files:", error);
    return false;
  }
};

// src/create-app/print-info.ts
import { readFileSync } from "node:fs";

// src/utils/npx-path.ts
import path3 from "node:path";
import { fileURLToPath } from "node:url";
var npxPackagePath = (filePath) => {
  const __dirname = path3.dirname(fileURLToPath(import.meta.url)).replace(/[\\/]bin([\\/][^\\/]*)?$/u, "");
  try {
    return path3.resolve(__dirname, filePath);
  } catch {
    throw new Error(`Failed to resolve the npxPackagePath: ${filePath}`);
  }
};

// src/create-app/print-info.ts
var USAGE_TEXT = `
Usage: create-fastedge-app [OPTION] [DIRECTORY]

Create a new FastEdge application in the specified DIRECTORY.

If no DIRECTORY is provided, the current directory will be used.

  Options:

  -h,   --help              Print this help information
  -v,   --version           Print the version number
  -t,   --template          Specify which template to use
  -l,   --list-templates    Print available template metadata as JSON
  -p,   --package-manager   Specify the package manager to use (npm, yarn, pnpm). Default is npm.
  --rs, --rust              Use Rust as the programming language for the FastEdge application.
  --js, --javascript        Use JavaScript as the programming language for the FastEdge application.
  --ts, --typescript        Use TypeScript as the programming language for the FastEdge application.
  --as, --assemblyscript    Use AssemblyScript as the programming language for the FastEdge application.
  --pnpm                    Use pnpm as the package manager for the FastEdge application.
  --yarn                    Use yarn as the package manager for the FastEdge application.


  Available templates:

    http              Simple request/response handling application
    http-react        React application starter-kit using Vite, static server only
    http-react-hono   React application starter-kit using Vite and Hono framework, provides backend server functionality
    cdn               Simple CDN wireframe for request/response event hooks

  Example:
    create-fastedge-app my-fastedge-app --typescript --template http-react
`;
function printVersion() {
  const packageJsonPath = npxPackagePath("./package.json");
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  const { version } = JSON.parse(packageJsonContent);
  console.log(`create-fastedge-app: ${version}`);
}
function printHelp() {
  console.log(USAGE_TEXT);
}

// src/create-app/template-list.ts
function getTemplateList() {
  return Object.entries(FastEdgeTemplates).map(([name, variants]) => {
    const languages = Array.from(new Set(variants.map((v2) => v2.language)));
    const description = variants[0].description;
    const applicationType = variants[0].applicationType;
    return {
      name,
      description,
      languages,
      applicationType
    };
  });
}

// src/create-app/index.ts
var exec = util.promisify(child_process.exec);
var loader = Y2();
var validateTemplate = (value) => {
  if (availableTemplates.includes(value)) {
    return value;
  }
  return "";
};
var args;
try {
  args = (0, import_arg.default)(
    {
      // Types
      "--version": Boolean,
      "--help": Boolean,
      "--list-templates": Boolean,
      "--template": validateTemplate,
      "--javascript": Boolean,
      "--typescript": Boolean,
      "--assemblyscript": Boolean,
      "--rust": Boolean,
      "--no-verify": Boolean,
      "--npm": Boolean,
      "--pnpm": Boolean,
      "--yarn": Boolean,
      "--codespaces": Boolean,
      // Aliases
      "-v": "--version",
      "-h": "--help",
      "-l": "--list-templates",
      "-t": "--template",
      "--js": "--javascript",
      "--as": "--assemblyscript",
      "--ts": "--typescript",
      "--rs": "--rust"
    },
    {
      permissive: true
    }
  );
} catch (error) {
  printHelp();
  process.exit(0);
}
if (args["--version"]) {
  printVersion();
  process.exit(0);
}
if (args["--help"]) {
  printHelp();
  process.exit(0);
}
if (args["--list-templates"]) {
  const templates = getTemplateList();
  console.log(JSON.stringify(templates, null, 2));
  process.exit(0);
}
console.log();
Ie(import_picocolors3.default.inverse(" create-fastedge-app "));
var config = await confirmSetupConfig(args);
loader.start("Creating project files...");
await createTemplateFiles(config);
await new Promise((resolve) => setTimeout(resolve, 500));
loader.stop("Project files created.");
if (config.language !== "rust") {
  loader.start(`${config.packageManager} installing dependencies...`);
  await exec(`${config.packageManager} install`, {
    cwd: config.directoryPath
  });
  loader.stop("Dependencies installed.");
}
if (config.codespaces) {
  await createInitializedFile();
}
console.log();
console.log(import_picocolors3.default.green("\u2713 ") + import_picocolors3.default.bold("Project created successfully!"));
console.log();
console.log(import_picocolors3.default.dim("Next steps:"));
console.log("");
if (config.directoryPath.replace(/\/+$/, "") !== ".") {
  console.log(`  ${import_picocolors3.default.cyan("cd")} ${config.directoryPath}`);
}
if (config.language !== "rust") {
  console.log(
    `  ${import_picocolors3.default.cyan(`${config.packageManager} run build`)} ${import_picocolors3.default.dim("# Build for production")}`
  );
} else {
  console.log(
    `  ${import_picocolors3.default.cyan("cargo build --release")} ${import_picocolors3.default.dim("# Build for production")}`
  );
}
console.log();
Se(import_picocolors3.default.dim("Happy coding! \u{1F680}"));
