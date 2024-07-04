
// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

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
      const exports = dartInstance.exports;
      const read = exports.$listRead;
      const length = exports.$listLength(list);
      const array = new constructor(length);
      for (let i = 0; i < length; i++) {
        array[i] = read(list, i);
      }
      return array;
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

_12: x0 => new Array(x0),
_13: x0 => new Promise(x0),
_18: (o,s,v) => o[s] = v,
_19: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._19(f,arguments.length,x0) }),
_20: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._20(f,arguments.length,x0) }),
_21: (x0,x1,x2) => x0.call(x1,x2),
_22: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._22(f,arguments.length,x0,x1) }),
_23: (x0,x1) => x0.call(x1),
_24: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._24(f,arguments.length,x0,x1) }),
_45: () => Symbol("jsBoxedDartObjectProperty"),
_49: v => v.toString(),
_61: Date.now,
_63: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_65: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_85: s => JSON.stringify(s),
_86: s => printToConsole(s),
_87: a => a.join(''),
_97: (s, p, i) => s.indexOf(p, i),
_103: (a, i) => a.push(i),
_114: a => a.length,
_116: (a, i) => a[i],
_117: (a, i, v) => a[i] = v,
_120: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_121: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_122: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_123: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_124: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_125: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_126: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_129: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_130: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_133: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_137: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_138: (b, o) => new DataView(b, o),
_140: Function.prototype.call.bind(DataView.prototype.getUint8),
_142: Function.prototype.call.bind(DataView.prototype.getInt8),
_144: Function.prototype.call.bind(DataView.prototype.getUint16),
_146: Function.prototype.call.bind(DataView.prototype.getInt16),
_148: Function.prototype.call.bind(DataView.prototype.getUint32),
_150: Function.prototype.call.bind(DataView.prototype.getInt32),
_156: Function.prototype.call.bind(DataView.prototype.getFloat32),
_158: Function.prototype.call.bind(DataView.prototype.getFloat64),
_178: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_180: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_181: (handle) => clearInterval(handle),
_182: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_183: () => Date.now(),
_214: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_215: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_216: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_217: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_218: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_220: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_221: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_222: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_223: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_224: (x0,x1,x2) => x0.getValue(x1,x2),
_225: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_226: (x0,x1) => x0._malloc(x1),
_227: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_228: (x0,x1) => x0._free(x1),
_229: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_230: (x0,x1) => x0._malloc(x1),
_231: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_232: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_233: (x0,x1) => x0._free(x1),
_234: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_235: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_236: (x0,x1) => x0._malloc(x1),
_237: (x0,x1) => x0._malloc(x1),
_238: (x0,x1,x2,x3) => x0.stringToUTF8(x1,x2,x3),
_239: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_240: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_241: (x0,x1) => x0.UTF8ToString(x1),
_242: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_243: (x0,x1) => x0._malloc(x1),
_244: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_245: (x0,x1,x2) => x0.getValue(x1,x2),
_246: (x0,x1) => x0._free(x1),
_247: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_248: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_249: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_250: (x0,x1) => x0.UTF8ToString(x1),
_251: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_252: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_253: (x0,x1) => x0._malloc(x1),
_254: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_255: (x0,x1) => x0.UTF8ToString(x1),
_256: (x0,x1) => x0._free(x1),
_257: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_258: (x0,x1) => x0.UTF8ToString(x1),
_259: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_260: (x0,x1) => x0._malloc(x1),
_261: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_262: (x0,x1) => x0._free(x1),
_263: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_268: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_269: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_270: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_271: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_272: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_273: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_274: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_275: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_276: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_277: (x0,x1) => x0._malloc(x1),
_278: (x0,x1,x2) => x0.writeArrayToMemory(x1,x2),
_279: (x0,x1) => x0._malloc(x1),
_280: (x0,x1,x2) => x0.writeArrayToMemory(x1,x2),
_281: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_282: (x0,x1) => x0._free(x1),
_283: (x0,x1) => x0._free(x1),
_284: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_285: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_286: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_288: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_289: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_290: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_298: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_299: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_300: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_301: (x0,x1) => x0._malloc(x1),
_302: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_303: (x0,x1) => x0.UTF8ToString(x1),
_304: (x0,x1) => x0._free(x1),
_305: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_306: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_318: (x0,x1) => x0._malloc(x1),
_319: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_320: (x0,x1) => x0._free(x1),
_334: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_335: (x0,x1) => x0._malloc(x1),
_336: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_337: (x0,x1,x2) => x0.getValue(x1,x2),
_338: (x0,x1) => x0._free(x1),
_342: (x0,x1) => x0._malloc(x1),
_343: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_344: (x0,x1) => x0._free(x1),
_346: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_347: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_349: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_351: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_352: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_353: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_354: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_355: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_356: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_357: (x0,x1) => x0._malloc(x1),
_358: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_359: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_360: (x0,x1) => x0._free(x1),
_361: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_362: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_363: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_364: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_365: (x0,x1) => x0._malloc(x1),
_366: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_367: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_368: (x0,x1) => x0._free(x1),
_369: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_370: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_371: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_372: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_373: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_374: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_375: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_380: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_381: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_383: (x0,x1) => x0._malloc(x1),
_384: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_385: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_386: (x0,x1) => x0._free(x1),
_388: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_389: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_390: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_391: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_392: (x0,x1) => x0._malloc(x1),
_393: (x0,x1,x2,x3) => x0.setValue(x1,x2,x3),
_394: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_395: (x0,x1) => x0._free(x1),
_397: (x0,x1,x2,x3,x4,x5) => x0.ccall(x1,x2,x3,x4,x5),
_411: (x0,x1) => x0.getElementById(x1),
_412: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._412(f,arguments.length,x0) }),
_413: (x0,x1,x2) => x0.addEventListener(x1,x2),
_414: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._414(f,arguments.length,x0) }),
_415: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._415(f,arguments.length,x0) }),
_532: f => finalizeWrapper(f, function() { return dartInstance.exports._532(f,arguments.length) }),
_533: f => finalizeWrapper(f, function() { return dartInstance.exports._533(f,arguments.length) }),
_534: f => finalizeWrapper(f, function() { return dartInstance.exports._534(f,arguments.length) }),
_535: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._535(f,arguments.length,x0) }),
_536: f => finalizeWrapper(f, function() { return dartInstance.exports._536(f,arguments.length) }),
_537: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._537(f,arguments.length,x0) }),
_538: f => finalizeWrapper(f, function() { return dartInstance.exports._538(f,arguments.length) }),
_539: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._539(f,arguments.length,x0) }),
_540: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._540(f,arguments.length,x0,x1) }),
_541: f => finalizeWrapper(f, function() { return dartInstance.exports._541(f,arguments.length) }),
_542: f => finalizeWrapper(f, function(x0,x1,x2,x3) { return dartInstance.exports._542(f,arguments.length,x0,x1,x2,x3) }),
_543: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._543(f,arguments.length,x0) }),
_544: f => finalizeWrapper(f, function() { return dartInstance.exports._544(f,arguments.length) }),
_545: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._545(f,arguments.length,x0,x1) }),
_546: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._546(f,arguments.length,x0) }),
_547: f => finalizeWrapper(f, function() { return dartInstance.exports._547(f,arguments.length) }),
_548: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15) { return dartInstance.exports._548(f,arguments.length,x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15) }),
_549: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._549(f,arguments.length,x0) }),
_550: f => finalizeWrapper(f, function() { return dartInstance.exports._550(f,arguments.length) }),
_551: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._551(f,arguments.length,x0) }),
_552: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._552(f,arguments.length,x0) }),
_553: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._553(f,arguments.length,x0) }),
_554: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._554(f,arguments.length,x0) }),
_555: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._555(f,arguments.length,x0,x1) }),
_556: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._556(f,arguments.length,x0,x1) }),
_557: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._557(f,arguments.length,x0,x1) }),
_558: f => finalizeWrapper(f, function() { return dartInstance.exports._558(f,arguments.length) }),
_559: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._559(f,arguments.length,x0,x1) }),
_560: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._560(f,arguments.length,x0,x1) }),
_561: f => finalizeWrapper(f, function() { return dartInstance.exports._561(f,arguments.length) }),
_562: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._562(f,arguments.length,x0,x1) }),
_563: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._563(f,arguments.length,x0,x1) }),
_564: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._564(f,arguments.length,x0,x1) }),
_565: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._565(f,arguments.length,x0) }),
_566: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._566(f,arguments.length,x0,x1) }),
_567: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4) { return dartInstance.exports._567(f,arguments.length,x0,x1,x2,x3,x4) }),
_568: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._568(f,arguments.length,x0) }),
_569: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4,x5,x6,x7,x8) { return dartInstance.exports._569(f,arguments.length,x0,x1,x2,x3,x4,x5,x6,x7,x8) }),
_570: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._570(f,arguments.length,x0) }),
_571: f => finalizeWrapper(f, function() { return dartInstance.exports._571(f,arguments.length) }),
_572: f => finalizeWrapper(f, function() { return dartInstance.exports._572(f,arguments.length) }),
_573: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._573(f,arguments.length,x0,x1,x2) }),
_574: f => finalizeWrapper(f, function() { return dartInstance.exports._574(f,arguments.length) }),
_575: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._575(f,arguments.length,x0,x1) }),
_576: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._576(f,arguments.length,x0,x1) }),
_577: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._577(f,arguments.length,x0,x1,x2) }),
_578: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._578(f,arguments.length,x0,x1) }),
_579: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._579(f,arguments.length,x0,x1) }),
_580: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._580(f,arguments.length,x0,x1) }),
_581: f => finalizeWrapper(f, function() { return dartInstance.exports._581(f,arguments.length) }),
_582: f => finalizeWrapper(f, function() { return dartInstance.exports._582(f,arguments.length) }),
_583: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._583(f,arguments.length,x0,x1,x2) }),
_584: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._584(f,arguments.length,x0) }),
_585: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._585(f,arguments.length,x0) }),
_586: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._586(f,arguments.length,x0) }),
_587: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._587(f,arguments.length,x0,x1) }),
_588: f => finalizeWrapper(f, function() { return dartInstance.exports._588(f,arguments.length) }),
_589: f => finalizeWrapper(f, function() { return dartInstance.exports._589(f,arguments.length) }),
_590: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._590(f,arguments.length,x0) }),
_591: f => finalizeWrapper(f, function() { return dartInstance.exports._591(f,arguments.length) }),
_592: f => finalizeWrapper(f, function() { return dartInstance.exports._592(f,arguments.length) }),
_593: f => finalizeWrapper(f, function() { return dartInstance.exports._593(f,arguments.length) }),
_594: f => finalizeWrapper(f, function() { return dartInstance.exports._594(f,arguments.length) }),
_595: f => finalizeWrapper(f, function() { return dartInstance.exports._595(f,arguments.length) }),
_596: f => finalizeWrapper(f, function() { return dartInstance.exports._596(f,arguments.length) }),
_597: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._597(f,arguments.length,x0,x1,x2) }),
_598: f => finalizeWrapper(f, function() { return dartInstance.exports._598(f,arguments.length) }),
_599: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._599(f,arguments.length,x0) }),
_600: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._600(f,arguments.length,x0) }),
_601: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._601(f,arguments.length,x0,x1,x2) }),
_602: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._602(f,arguments.length,x0) }),
_603: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._603(f,arguments.length,x0) }),
_604: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4,x5,x6) { return dartInstance.exports._604(f,arguments.length,x0,x1,x2,x3,x4,x5,x6) }),
_605: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._605(f,arguments.length,x0) }),
_606: f => finalizeWrapper(f, function(x0,x1,x2,x3) { return dartInstance.exports._606(f,arguments.length,x0,x1,x2,x3) }),
_607: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._607(f,arguments.length,x0,x1) }),
_608: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4) { return dartInstance.exports._608(f,arguments.length,x0,x1,x2,x3,x4) }),
_609: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4) { return dartInstance.exports._609(f,arguments.length,x0,x1,x2,x3,x4) }),
_610: f => finalizeWrapper(f, function(x0,x1,x2,x3,x4,x5) { return dartInstance.exports._610(f,arguments.length,x0,x1,x2,x3,x4,x5) }),
_611: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._611(f,arguments.length,x0,x1,x2) }),
_612: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._612(f,arguments.length,x0) }),
_613: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._613(f,arguments.length,x0,x1,x2) }),
_614: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._614(f,arguments.length,x0,x1) }),
_615: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._615(f,arguments.length,x0,x1) }),
_616: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._616(f,arguments.length,x0,x1) }),
_617: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._617(f,arguments.length,x0,x1) }),
_618: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._618(f,arguments.length,x0) }),
_619: f => finalizeWrapper(f, function() { return dartInstance.exports._619(f,arguments.length) }),
_620: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._620(f,arguments.length,x0,x1) }),
_621: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._621(f,arguments.length,x0,x1) }),
_622: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._622(f,arguments.length,x0,x1) }),
_623: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._623(f,arguments.length,x0) }),
_624: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._624(f,arguments.length,x0) }),
_625: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._625(f,arguments.length,x0) }),
_626: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._626(f,arguments.length,x0) }),
_627: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._627(f,arguments.length,x0) }),
_628: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._628(f,arguments.length,x0,x1,x2) }),
_629: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._629(f,arguments.length,x0) }),
_630: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._630(f,arguments.length,x0) }),
_631: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._631(f,arguments.length,x0,x1) }),
_632: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._632(f,arguments.length,x0) }),
_633: f => finalizeWrapper(f, function(x0,x1,x2,x3) { return dartInstance.exports._633(f,arguments.length,x0,x1,x2,x3) }),
_634: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._634(f,arguments.length,x0) }),
_635: f => finalizeWrapper(f, function() { return dartInstance.exports._635(f,arguments.length) }),
_646: (x0,x1,x2) => x0[x1] = x2,
_648: o => o === undefined,
_649: o => typeof o === 'boolean',
_650: o => typeof o === 'number',
_652: o => typeof o === 'string',
_655: o => o instanceof Int8Array,
_656: o => o instanceof Uint8Array,
_657: o => o instanceof Uint8ClampedArray,
_658: o => o instanceof Int16Array,
_659: o => o instanceof Uint16Array,
_660: o => o instanceof Int32Array,
_661: o => o instanceof Uint32Array,
_662: o => o instanceof Float32Array,
_663: o => o instanceof Float64Array,
_664: o => o instanceof ArrayBuffer,
_665: o => o instanceof DataView,
_666: o => o instanceof Array,
_667: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_671: (l, r) => l === r,
_672: o => o,
_673: o => o,
_674: o => o,
_675: b => !!b,
_676: o => o.length,
_679: (o, i) => o[i],
_680: f => f.dartFunction,
_681: l => arrayFromDartList(Int8Array, l),
_682: (data, length) => {
          const jsBytes = new Uint8Array(length);
          const getByte = dartInstance.exports.$uint8ListGet;
          for (let i = 0; i < length; i++) {
            jsBytes[i] = getByte(data, i);
          }
          return jsBytes;
        },
_683: l => arrayFromDartList(Uint8ClampedArray, l),
_684: l => arrayFromDartList(Int16Array, l),
_685: l => arrayFromDartList(Uint16Array, l),
_686: l => arrayFromDartList(Int32Array, l),
_687: l => arrayFromDartList(Uint32Array, l),
_688: l => arrayFromDartList(Float32Array, l),
_689: l => arrayFromDartList(Float64Array, l),
_690: (data, length) => {
          const read = dartInstance.exports.$byteDataGetUint8;
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, read(data, i));
          }
          return view;
        },
_691: l => arrayFromDartList(Array, l),
_692:       (s, length) => {
        if (length == 0) return '';

        const read = dartInstance.exports.$stringRead1;
        let result = '';
        let index = 0;
        const chunkLength = Math.min(length - index, 500);
        let array = new Array(chunkLength);
        while (index < length) {
          const newChunkLength = Math.min(length - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(s, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      }
      ,
_693:     (s, length) => {
      if (length == 0) return '';

      const read = dartInstance.exports.$stringRead2;
      let result = '';
      let index = 0;
      const chunkLength = Math.min(length - index, 500);
      let array = new Array(chunkLength);
      while (index < length) {
        const newChunkLength = Math.min(length - index, 500);
        for (let i = 0; i < newChunkLength; i++) {
          array[i] = read(s, index++);
        }
        if (newChunkLength < chunkLength) {
          array = array.slice(0, newChunkLength);
        }
        result += String.fromCharCode(...array);
      }
      return result;
    }
    ,
_694:     (s) => {
      let length = s.length;
      let range = 0;
      for (let i = 0; i < length; i++) {
        range |= s.codePointAt(i);
      }
      const exports = dartInstance.exports;
      if (range < 256) {
        if (length <= 10) {
          if (length == 1) {
            return exports.$stringAllocate1_1(s.codePointAt(0));
          }
          if (length == 2) {
            return exports.$stringAllocate1_2(s.codePointAt(0), s.codePointAt(1));
          }
          if (length == 3) {
            return exports.$stringAllocate1_3(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2));
          }
          if (length == 4) {
            return exports.$stringAllocate1_4(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3));
          }
          if (length == 5) {
            return exports.$stringAllocate1_5(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4));
          }
          if (length == 6) {
            return exports.$stringAllocate1_6(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5));
          }
          if (length == 7) {
            return exports.$stringAllocate1_7(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6));
          }
          if (length == 8) {
            return exports.$stringAllocate1_8(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7));
          }
          if (length == 9) {
            return exports.$stringAllocate1_9(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8));
          }
          if (length == 10) {
            return exports.$stringAllocate1_10(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8), s.codePointAt(9));
          }
        }
        const dartString = exports.$stringAllocate1(length);
        const write = exports.$stringWrite1;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.codePointAt(i));
        }
        return dartString;
      } else {
        const dartString = exports.$stringAllocate2(length);
        const write = exports.$stringWrite2;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.charCodeAt(i));
        }
        return dartString;
      }
    }
    ,
_695: () => ({}),
_696: () => [],
_697: l => new Array(l),
_698: () => globalThis,
_699: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_701: (o, p) => o[p],
_702: (o, p, v) => o[p] = v,
_703: (o, m, a) => o[m].apply(o, a),
_705: o => String(o),
_706: (p, s, f) => p.then(s, f),
_724: (o, p) => o[p],
_725: (o, p, v) => o[p] = v,
_2146: (x0,x1) => x0.width = x1,
_2148: (x0,x1) => x0.height = x1,
_2525: () => globalThis.window,
_2567: x0 => x0.innerWidth,
_2568: x0 => x0.innerHeight,
_7501: () => globalThis.document
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
  moduleInstance.exports.$invokeMain(args);
}

