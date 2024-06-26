let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    // Imports
    const dart2wasm = {

_11: x0 => new Array(x0),
_12: x0 => new Promise(x0),
_17: (o,s,v) => o[s] = v,
_18: f => finalizeWrapper(f,x0 => dartInstance.exports._18(f,x0)),
_19: f => finalizeWrapper(f,x0 => dartInstance.exports._19(f,x0)),
_20: (x0,x1,x2) => x0.call(x1,x2),
_21: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._21(f,x0,x1)),
_22: (x0,x1) => x0.call(x1),
_23: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._23(f,x0,x1)),
_44: () => Symbol("jsBoxedDartObjectProperty"),
_48: v => stringToDartString(v.toString()),
_60: Date.now,
_62: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_64: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_84: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_85: s => printToConsole(stringFromDartString(s)),
_88: (a, i) => a.push(i),
_99: a => a.length,
_101: (a, i) => a[i],
_102: (a, i, v) => a[i] = v,
_104: a => a.join(''),
_114: (s, p, i) => s.indexOf(p, i),
_117: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_118: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_119: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_120: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_121: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_122: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_123: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_126: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_127: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_132: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_136: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_137: (b, o) => new DataView(b, o),
_139: Function.prototype.call.bind(DataView.prototype.getUint8),
_141: Function.prototype.call.bind(DataView.prototype.getInt8),
_143: Function.prototype.call.bind(DataView.prototype.getUint16),
_145: Function.prototype.call.bind(DataView.prototype.getInt16),
_147: Function.prototype.call.bind(DataView.prototype.getUint32),
_149: Function.prototype.call.bind(DataView.prototype.getInt32),
_155: Function.prototype.call.bind(DataView.prototype.getFloat32),
_157: Function.prototype.call.bind(DataView.prototype.getFloat64),
_177: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_179: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_180: (handle) => clearInterval(handle),
_181: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_182: () => Date.now(),
_213: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_214: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_215: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_216: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_217: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_219: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_220: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_221: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_222: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_223: (x0,x1,x2) => x0.getValue(x1,x2),
_224: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_225: (x0,x1) => x0._malloc(x1),
_226: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_227: (x0,x1) => x0._free(x1),
_228: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_229: (x0,x1) => x0._malloc(x1),
_230: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_231: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_232: (x0,x1) => x0._free(x1),
_233: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_234: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_235: (x0,x1) => x0._malloc(x1),
_236: (x0,x1) => x0._malloc(x1),
_237: (x0,x1,x2,x3) => x0.stringToUTF8(x1,x2,x3),
_238: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_239: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_240: (x0,x1) => x0.UTF8ToString(x1),
_241: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_242: (x0,x1) => x0._malloc(x1),
_243: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_244: (x0,x1,x2) => x0.getValue(x1,x2),
_245: (x0,x1) => x0._free(x1),
_246: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_247: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_248: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_249: (x0,x1) => x0.UTF8ToString(x1),
_250: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_251: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_252: (x0,x1) => x0._malloc(x1),
_253: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_254: (x0,x1) => x0.UTF8ToString(x1),
_255: (x0,x1) => x0._free(x1),
_256: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_257: (x0,x1) => x0.UTF8ToString(x1),
_258: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_259: (x0,x1) => x0._malloc(x1),
_260: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_261: (x0,x1) => x0._free(x1),
_262: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_267: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_268: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_269: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_270: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_271: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_272: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_273: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_274: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_275: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_276: (x0,x1) => x0._malloc(x1),
_277: (x0,x1,x2) => x0.writeArrayToMemory(x1,x2),
_278: (x0,x1) => x0._malloc(x1),
_279: (x0,x1,x2) => x0.writeArrayToMemory(x1,x2),
_280: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_281: (x0,x1) => x0._free(x1),
_282: (x0,x1) => x0._free(x1),
_283: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_284: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_285: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_287: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_288: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_289: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_297: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_298: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_299: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_300: (x0,x1) => x0._malloc(x1),
_301: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_302: (x0,x1) => x0.UTF8ToString(x1),
_303: (x0,x1) => x0._free(x1),
_304: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_305: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_317: (x0,x1) => x0._malloc(x1),
_318: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_319: (x0,x1) => x0._free(x1),
_333: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_334: (x0,x1) => x0._malloc(x1),
_335: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_336: (x0,x1,x2) => x0.getValue(x1,x2),
_337: (x0,x1) => x0._free(x1),
_341: (x0,x1) => x0._malloc(x1),
_342: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_343: (x0,x1) => x0._free(x1),
_345: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_346: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_348: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_350: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_351: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_352: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_353: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_354: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_355: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_356: (x0,x1) => x0._malloc(x1),
_357: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_358: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_359: (x0,x1) => x0._free(x1),
_360: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_361: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_362: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_363: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_364: (x0,x1) => x0._malloc(x1),
_365: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_366: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_367: (x0,x1) => x0._free(x1),
_368: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_369: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_370: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_371: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_372: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_373: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_374: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_379: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_380: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_382: (x0,x1) => x0._malloc(x1),
_383: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_384: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_385: (x0,x1) => x0._free(x1),
_387: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_388: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_389: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_390: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_391: (x0,x1) => x0._malloc(x1),
_392: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_393: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_394: (x0,x1) => x0._free(x1),
_396: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_410: (x0,x1) => x0.getElementById(x1),
_411: f => finalizeWrapper(f,x0 => dartInstance.exports._411(f,x0)),
_412: (x0,x1,x2) => x0.addEventListener(x1,x2),
_413: f => finalizeWrapper(f,x0 => dartInstance.exports._413(f,x0)),
_414: f => finalizeWrapper(f,x0 => dartInstance.exports._414(f,x0)),
_531: f => finalizeWrapper(f,() => dartInstance.exports._531(f)),
_532: f => finalizeWrapper(f,() => dartInstance.exports._532(f)),
_533: f => finalizeWrapper(f,() => dartInstance.exports._533(f)),
_534: f => finalizeWrapper(f,x0 => dartInstance.exports._534(f,x0)),
_535: f => finalizeWrapper(f,() => dartInstance.exports._535(f)),
_536: f => finalizeWrapper(f,x0 => dartInstance.exports._536(f,x0)),
_537: f => finalizeWrapper(f,() => dartInstance.exports._537(f)),
_538: f => finalizeWrapper(f,x0 => dartInstance.exports._538(f,x0)),
_539: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._539(f,x0,x1)),
_540: f => finalizeWrapper(f,() => dartInstance.exports._540(f)),
_541: f => finalizeWrapper(f,(x0,x1,x2,x3) => dartInstance.exports._541(f,x0,x1,x2,x3)),
_542: f => finalizeWrapper(f,x0 => dartInstance.exports._542(f,x0)),
_543: f => finalizeWrapper(f,() => dartInstance.exports._543(f)),
_544: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._544(f,x0,x1)),
_545: f => finalizeWrapper(f,x0 => dartInstance.exports._545(f,x0)),
_546: f => finalizeWrapper(f,() => dartInstance.exports._546(f)),
_547: f => finalizeWrapper(f,(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15) => dartInstance.exports._547(f,x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15)),
_548: f => finalizeWrapper(f,x0 => dartInstance.exports._548(f,x0)),
_549: f => finalizeWrapper(f,() => dartInstance.exports._549(f)),
_550: f => finalizeWrapper(f,x0 => dartInstance.exports._550(f,x0)),
_551: f => finalizeWrapper(f,x0 => dartInstance.exports._551(f,x0)),
_552: f => finalizeWrapper(f,x0 => dartInstance.exports._552(f,x0)),
_553: f => finalizeWrapper(f,x0 => dartInstance.exports._553(f,x0)),
_554: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._554(f,x0,x1)),
_555: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._555(f,x0,x1)),
_556: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._556(f,x0,x1)),
_557: f => finalizeWrapper(f,() => dartInstance.exports._557(f)),
_558: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._558(f,x0,x1)),
_559: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._559(f,x0,x1)),
_560: f => finalizeWrapper(f,() => dartInstance.exports._560(f)),
_561: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._561(f,x0,x1)),
_562: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._562(f,x0,x1)),
_563: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._563(f,x0,x1)),
_564: f => finalizeWrapper(f,x0 => dartInstance.exports._564(f,x0)),
_565: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._565(f,x0,x1)),
_566: f => finalizeWrapper(f,(x0,x1,x2,x3,x4) => dartInstance.exports._566(f,x0,x1,x2,x3,x4)),
_567: f => finalizeWrapper(f,x0 => dartInstance.exports._567(f,x0)),
_568: f => finalizeWrapper(f,(x0,x1,x2,x3,x4,x5,x6,x7,x8) => dartInstance.exports._568(f,x0,x1,x2,x3,x4,x5,x6,x7,x8)),
_569: f => finalizeWrapper(f,x0 => dartInstance.exports._569(f,x0)),
_570: f => finalizeWrapper(f,() => dartInstance.exports._570(f)),
_571: f => finalizeWrapper(f,() => dartInstance.exports._571(f)),
_572: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._572(f,x0,x1,x2)),
_573: f => finalizeWrapper(f,() => dartInstance.exports._573(f)),
_574: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._574(f,x0,x1)),
_575: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._575(f,x0,x1)),
_576: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._576(f,x0,x1,x2)),
_577: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._577(f,x0,x1)),
_578: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._578(f,x0,x1)),
_579: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._579(f,x0,x1)),
_580: f => finalizeWrapper(f,() => dartInstance.exports._580(f)),
_581: f => finalizeWrapper(f,() => dartInstance.exports._581(f)),
_582: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._582(f,x0,x1,x2)),
_583: f => finalizeWrapper(f,x0 => dartInstance.exports._583(f,x0)),
_584: f => finalizeWrapper(f,x0 => dartInstance.exports._584(f,x0)),
_585: f => finalizeWrapper(f,x0 => dartInstance.exports._585(f,x0)),
_586: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._586(f,x0,x1)),
_587: f => finalizeWrapper(f,() => dartInstance.exports._587(f)),
_588: f => finalizeWrapper(f,() => dartInstance.exports._588(f)),
_589: f => finalizeWrapper(f,x0 => dartInstance.exports._589(f,x0)),
_590: f => finalizeWrapper(f,() => dartInstance.exports._590(f)),
_591: f => finalizeWrapper(f,() => dartInstance.exports._591(f)),
_592: f => finalizeWrapper(f,() => dartInstance.exports._592(f)),
_593: f => finalizeWrapper(f,() => dartInstance.exports._593(f)),
_594: f => finalizeWrapper(f,() => dartInstance.exports._594(f)),
_595: f => finalizeWrapper(f,() => dartInstance.exports._595(f)),
_596: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._596(f,x0,x1,x2)),
_597: f => finalizeWrapper(f,() => dartInstance.exports._597(f)),
_598: f => finalizeWrapper(f,x0 => dartInstance.exports._598(f,x0)),
_599: f => finalizeWrapper(f,x0 => dartInstance.exports._599(f,x0)),
_600: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._600(f,x0,x1,x2)),
_601: f => finalizeWrapper(f,x0 => dartInstance.exports._601(f,x0)),
_602: f => finalizeWrapper(f,x0 => dartInstance.exports._602(f,x0)),
_603: f => finalizeWrapper(f,(x0,x1,x2,x3,x4,x5,x6) => dartInstance.exports._603(f,x0,x1,x2,x3,x4,x5,x6)),
_604: f => finalizeWrapper(f,x0 => dartInstance.exports._604(f,x0)),
_605: f => finalizeWrapper(f,(x0,x1,x2,x3) => dartInstance.exports._605(f,x0,x1,x2,x3)),
_606: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._606(f,x0,x1)),
_607: f => finalizeWrapper(f,(x0,x1,x2,x3,x4) => dartInstance.exports._607(f,x0,x1,x2,x3,x4)),
_608: f => finalizeWrapper(f,(x0,x1,x2,x3,x4) => dartInstance.exports._608(f,x0,x1,x2,x3,x4)),
_609: f => finalizeWrapper(f,(x0,x1,x2,x3,x4,x5) => dartInstance.exports._609(f,x0,x1,x2,x3,x4,x5)),
_610: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._610(f,x0,x1,x2)),
_611: f => finalizeWrapper(f,x0 => dartInstance.exports._611(f,x0)),
_612: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._612(f,x0,x1,x2)),
_613: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._613(f,x0,x1)),
_614: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._614(f,x0,x1)),
_615: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._615(f,x0,x1)),
_616: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._616(f,x0,x1)),
_617: f => finalizeWrapper(f,x0 => dartInstance.exports._617(f,x0)),
_618: f => finalizeWrapper(f,() => dartInstance.exports._618(f)),
_619: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._619(f,x0,x1)),
_620: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._620(f,x0,x1)),
_621: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._621(f,x0,x1)),
_622: f => finalizeWrapper(f,x0 => dartInstance.exports._622(f,x0)),
_623: f => finalizeWrapper(f,x0 => dartInstance.exports._623(f,x0)),
_624: f => finalizeWrapper(f,x0 => dartInstance.exports._624(f,x0)),
_625: f => finalizeWrapper(f,x0 => dartInstance.exports._625(f,x0)),
_626: f => finalizeWrapper(f,x0 => dartInstance.exports._626(f,x0)),
_627: f => finalizeWrapper(f,(x0,x1,x2) => dartInstance.exports._627(f,x0,x1,x2)),
_628: f => finalizeWrapper(f,x0 => dartInstance.exports._628(f,x0)),
_629: f => finalizeWrapper(f,x0 => dartInstance.exports._629(f,x0)),
_630: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._630(f,x0,x1)),
_631: f => finalizeWrapper(f,x0 => dartInstance.exports._631(f,x0)),
_632: f => finalizeWrapper(f,(x0,x1,x2,x3) => dartInstance.exports._632(f,x0,x1,x2,x3)),
_633: f => finalizeWrapper(f,x0 => dartInstance.exports._633(f,x0)),
_634: f => finalizeWrapper(f,() => dartInstance.exports._634(f)),
_645: (x0,x1,x2) => x0[x1] = x2,
_647: o => o === undefined,
_648: o => typeof o === 'boolean',
_649: o => typeof o === 'number',
_651: o => typeof o === 'string',
_654: o => o instanceof Int8Array,
_655: o => o instanceof Uint8Array,
_656: o => o instanceof Uint8ClampedArray,
_657: o => o instanceof Int16Array,
_658: o => o instanceof Uint16Array,
_659: o => o instanceof Int32Array,
_660: o => o instanceof Uint32Array,
_661: o => o instanceof Float32Array,
_662: o => o instanceof Float64Array,
_663: o => o instanceof ArrayBuffer,
_664: o => o instanceof DataView,
_665: o => o instanceof Array,
_666: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_670: (l, r) => l === r,
_671: o => o,
_672: o => o,
_673: o => o,
_674: b => !!b,
_675: o => o.length,
_678: (o, i) => o[i],
_679: f => f.dartFunction,
_680: l => arrayFromDartList(Int8Array, l),
_681: l => arrayFromDartList(Uint8Array, l),
_682: l => arrayFromDartList(Uint8ClampedArray, l),
_683: l => arrayFromDartList(Int16Array, l),
_684: l => arrayFromDartList(Uint16Array, l),
_685: l => arrayFromDartList(Int32Array, l),
_686: l => arrayFromDartList(Uint32Array, l),
_687: l => arrayFromDartList(Float32Array, l),
_688: l => arrayFromDartList(Float64Array, l),
_689: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_690: l => arrayFromDartList(Array, l),
_691: stringFromDartString,
_692: stringToDartString,
_693: () => ({}),
_694: () => [],
_695: l => new Array(l),
_696: () => globalThis,
_697: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_699: (o, p) => o[p],
_700: (o, p, v) => o[p] = v,
_701: (o, m, a) => o[m].apply(o, a),
_703: o => String(o),
_704: (p, s, f) => p.then(s, f),
_723: (o, p) => o[p],
_724: (o, p, v) => o[p] = v,
_2145: (x0,x1) => x0.width = x1,
_2147: (x0,x1) => x0.height = x1,
_2524: () => globalThis.window,
_2566: x0 => x0.innerWidth,
_2567: x0 => x0.innerHeight,
_7500: () => globalThis.document
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

