var my4399UnityModule = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    return (function(UnityModule) {
        UnityModule = UnityModule || {};
        var Module = typeof UnityModule !== "undefined" ? UnityModule : {};
        if (typeof ENVIRONMENT_IS_PTHREAD === "undefined" || !ENVIRONMENT_IS_PTHREAD) {
            Module["preRun"].push((function() {
                var unityFileSystemInit = Module["unityFileSystemInit"] || (function() {
                    if (!Module.indexedDB) {
                        console.log("IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved.")
                    }
                    FS.mkdir("/idbfs");
                    FS.mount(IDBFS, {}, "/idbfs");
                    Module.addRunDependency("JS_FileSystem_Mount");
                    FS.syncfs(true, (function(err) {
                        Module.removeRunDependency("JS_FileSystem_Mount")
                    }))
                });
                unityFileSystemInit()
            }))
        }
        Module["SetFullscreen"] = (function(fullscreen) {
            if (typeof runtimeInitialized === "undefined" || !runtimeInitialized) {
                console.log("Runtime not initialized yet.")
            } else if (typeof JSEvents === "undefined") {
                console.log("Player not loaded yet.")
            } else {
                var tmp = JSEvents.canPerformEventHandlerRequests;
                JSEvents.canPerformEventHandlerRequests = (function() {
                    return 1
                });
                Module.ccall("SetFullscreen", null, ["number"], [fullscreen]);
                JSEvents.canPerformEventHandlerRequests = tmp
            }
        });
        Module["demangle"] = demangle || (function(symbol) {
            return symbol
        });
        var MediaDevices = [];
        if (typeof ENVIRONMENT_IS_PTHREAD === "undefined" || !ENVIRONMENT_IS_PTHREAD) {
            Module["preRun"].push((function() {
                var enumerateMediaDevices = (function() {
                    var getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                    if (!getMedia) return;

                    function addDevice(label) {
                        label = label ? label : "device #" + MediaDevices.length;
                        var device = {
                            deviceName: label,
                            refCount: 0,
                            video: null
                        };
                        MediaDevices.push(device)
                    }
                    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                        if (typeof MediaStreamTrack == "undefined" || typeof MediaStreamTrack.getSources == "undefined") {
                            console.log("Media Devices cannot be enumerated on this browser.");
                            return
                        }

                        function gotSources(sourceInfos) {
                            for (var i = 0; i !== sourceInfos.length; ++i) {
                                var sourceInfo = sourceInfos[i];
                                if (sourceInfo.kind === "video") addDevice(sourceInfo.label)
                            }
                        }
                        MediaStreamTrack.getSources(gotSources)
                    }
                    navigator.mediaDevices.enumerateDevices().then((function(devices) {
                        devices.forEach((function(device) {
                            if (device.kind == "videoinput") addDevice(device.label)
                        }))
                    })).catch((function(err) {
                        console.log(err.name + ": " + error.message)
                    }))
                });
                enumerateMediaDevices()
            }))
        }

        function SendMessage(gameObject, func, param) {
            if (param === undefined) Module.ccall("SendMessage", null, ["string", "string"], [gameObject, func]);
            else if (typeof param === "string") Module.ccall("SendMessageString", null, ["string", "string", "string"], [gameObject, func, param]);
            else if (typeof param === "number") Module.ccall("SendMessageFloat", null, ["string", "string", "number"], [gameObject, func, param]);
            else throw "" + param + " is does not have a type which is supported by SendMessage."
        }
        Module["SendMessage"] = SendMessage;
        var moduleOverrides = {};
        var key;
        for (key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key]
            }
        }
        Module["arguments"] = [];
        Module["thisProgram"] = "./this.program";
        Module["quit"] = (function(status, toThrow) {
            throw toThrow
        });
        Module["preRun"] = [];
        Module["postRun"] = [];
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        ENVIRONMENT_IS_WEB = typeof window === "object";
        ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
        ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        var scriptDirectory = "";

        function locateFile(path) {
            if (Module["locateFile"]) {
                return Module["locateFile"](path, scriptDirectory)
            } else {
                return scriptDirectory + path
            }
        }
        if (ENVIRONMENT_IS_NODE) {
            scriptDirectory = __dirname + "/";
            var nodeFS;
            var nodePath;
            Module["read"] = function shell_read(filename, binary) {
                var ret;
                if (!nodeFS) nodeFS = require("fs");
                if (!nodePath) nodePath = require("path");
                filename = nodePath["normalize"](filename);
                ret = nodeFS["readFileSync"](filename);
                return binary ? ret : ret.toString()
            };
            Module["readBinary"] = function readBinary(filename) {
                var ret = Module["read"](filename, true);
                if (!ret.buffer) {
                    ret = new Uint8Array(ret)
                }
                assert(ret.buffer);
                return ret
            };
            if (process["argv"].length > 1) {
                Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")
            }
            Module["arguments"] = process["argv"].slice(2);
            process["on"]("uncaughtException", (function(ex) {
                if (!(ex instanceof ExitStatus)) {
                    throw ex
                }
            }));
            process["on"]("unhandledRejection", (function(reason, p) {
                process["exit"](1)
            }));
            Module["quit"] = (function(status) {
                process["exit"](status)
            });
            Module["inspect"] = (function() {
                return "[Emscripten Module object]"
            })
        } else if (ENVIRONMENT_IS_SHELL) {
            if (typeof read != "undefined") {
                Module["read"] = function shell_read(f) {
                    return read(f)
                }
            }
            Module["readBinary"] = function readBinary(f) {
                var data;
                if (typeof readbuffer === "function") {
                    return new Uint8Array(readbuffer(f))
                }
                data = read(f, "binary");
                assert(typeof data === "object");
                return data
            };
            if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs
            } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            if (typeof quit === "function") {
                Module["quit"] = (function(status) {
                    quit(status)
                })
            }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WEB) {
                if (document.currentScript) {
                    scriptDirectory = document.currentScript.src
                }
            } else {
                scriptDirectory = self.location.href
            }
            if (_scriptDir) {
                scriptDirectory = _scriptDir
            }
            if (scriptDirectory.indexOf("blob:") !== 0) {
                scriptDirectory = scriptDirectory.split("/").slice(0, -1).join("/") + "/"
            } else {
                scriptDirectory = ""
            }
            Module["read"] = function shell_read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (ENVIRONMENT_IS_WORKER) {
                Module["readBinary"] = function readBinary(url) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response)
                }
            }
            Module["readAsync"] = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return
                    }
                    onerror()
                };
                xhr.onerror = onerror;
                xhr.send(null)
            };
            Module["setWindowTitle"] = (function(title) {
                document.title = title
            })
        } else {}
        var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
        var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);
        for (key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key]
            }
        }
        moduleOverrides = undefined;
        var STACK_ALIGN = 16;

        function staticAlloc(size) {
            var ret = STATICTOP;
            STATICTOP = STATICTOP + size + 15 & -16;
            return ret
        }

        function dynamicAlloc(size) {
            var ret = HEAP32[DYNAMICTOP_PTR >> 2];
            var end = ret + size + 15 & -16;
            HEAP32[DYNAMICTOP_PTR >> 2] = end;
            if (end >= TOTAL_MEMORY) {
                var success = enlargeMemory();
                if (!success) {
                    HEAP32[DYNAMICTOP_PTR >> 2] = ret;
                    return 0
                }
            }
            return ret
        }

        function alignMemory(size, factor) {
            if (!factor) factor = STACK_ALIGN;
            var ret = size = Math.ceil(size / factor) * factor;
            return ret
        }

        function getNativeTypeSize(type) {
            switch (type) {
                case "i1":
                case "i8":
                    return 1;
                case "i16":
                    return 2;
                case "i32":
                    return 4;
                case "i64":
                    return 8;
                case "float":
                    return 4;
                case "double":
                    return 8;
                default:
                    {
                        if (type[type.length - 1] === "*") {
                            return 4
                        } else if (type[0] === "i") {
                            var bits = parseInt(type.substr(1));
                            assert(bits % 8 === 0);
                            return bits / 8
                        } else {
                            return 0
                        }
                    }
            }
        }

        function warnOnce(text) {
            if (!warnOnce.shown) warnOnce.shown = {};
            if (!warnOnce.shown[text]) {
                warnOnce.shown[text] = 1;
                err(text)
            }
        }
        var asm2wasmImports = {
            "f64-rem": (function(x, y) {
                return x % y
            }),
            "debugger": (function() {
                debugger
            })
        };
        var jsCallStartIndex = 1;
        var functionPointers = new Array(0);

        function addFunction(func, sig) {
            var base = 0;
            for (var i = base; i < base + 0; i++) {
                if (!functionPointers[i]) {
                    functionPointers[i] = func;
                    return jsCallStartIndex + i
                }
            }
            throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
        }
        var funcWrappers = {};

        function getFuncWrapper(func, sig) {
            if (!func) return;
            assert(sig);
            if (!funcWrappers[sig]) {
                funcWrappers[sig] = {}
            }
            var sigCache = funcWrappers[sig];
            if (!sigCache[func]) {
                if (sig.length === 1) {
                    sigCache[func] = function dynCall_wrapper() {
                        return dynCall(sig, func)
                    }
                } else if (sig.length === 2) {
                    sigCache[func] = function dynCall_wrapper(arg) {
                        return dynCall(sig, func, [arg])
                    }
                } else {
                    sigCache[func] = function dynCall_wrapper() {
                        return dynCall(sig, func, Array.prototype.slice.call(arguments))
                    }
                }
            }
            return sigCache[func]
        }

        function makeBigInt(low, high, unsigned) {
            return unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296
        }

        function dynCall(sig, ptr, args) {
            if (args && args.length) {
                return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
            } else {
                return Module["dynCall_" + sig].call(null, ptr)
            }
        }
        var GLOBAL_BASE = 1024;
        var ABORT = 0;
        var EXITSTATUS = 0;

        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text)
            }
        }

        function getCFunc(ident) {
            var func = Module["_" + ident];
            assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
            return func
        }
        var JSfuncs = {
            "stackSave": (function() {
                stackSave()
            }),
            "stackRestore": (function() {
                stackRestore()
            }),
            "arrayToC": (function(arr) {
                var ret = stackAlloc(arr.length);
                writeArrayToMemory(arr, ret);
                return ret
            }),
            "stringToC": (function(str) {
                var ret = 0;
                if (str !== null && str !== undefined && str !== 0) {
                    var len = (str.length << 2) + 1;
                    ret = stackAlloc(len);
                    stringToUTF8(str, ret, len)
                }
                return ret
            })
        };
        var toC = {
            "string": JSfuncs["stringToC"],
            "array": JSfuncs["arrayToC"]
        };

        function ccall(ident, returnType, argTypes, args, opts) {
            function convertReturnValue(ret) {
                if (returnType === "string") return Pointer_stringify(ret);
                if (returnType === "boolean") return Boolean(ret);
                return ret
            }
            var func = getCFunc(ident);
            var cArgs = [];
            var stack = 0;
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    var converter = toC[argTypes[i]];
                    if (converter) {
                        if (stack === 0) stack = stackSave();
                        cArgs[i] = converter(args[i])
                    } else {
                        cArgs[i] = args[i]
                    }
                }
            }
            var ret = func.apply(null, cArgs);
            ret = convertReturnValue(ret);
            if (stack !== 0) stackRestore(stack);
            return ret
        }

        function cwrap(ident, returnType, argTypes, opts) {
            argTypes = argTypes || [];
            var numericArgs = argTypes.every((function(type) {
                return type === "number"
            }));
            var numericRet = returnType !== "string";
            if (numericRet && numericArgs && !opts) {
                return getCFunc(ident)
            }
            return (function() {
                return ccall(ident, returnType, argTypes, arguments, opts)
            })
        }

        function setValue(ptr, value, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*") type = "i32";
            switch (type) {
                case "i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case "i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case "i64":
                    tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
                    break;
                case "float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case "double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                default:
                    abort("invalid type for setValue: " + type)
            }
        }
        var ALLOC_NORMAL = 0;
        var ALLOC_STACK = 1;
        var ALLOC_STATIC = 2;
        var ALLOC_NONE = 4;

        function allocate(slab, types, allocator, ptr) {
            var zeroinit, size;
            if (typeof slab === "number") {
                zeroinit = true;
                size = slab
            } else {
                zeroinit = false;
                size = slab.length
            }
            var singleType = typeof types === "string" ? types : null;
            var ret;
            if (allocator == ALLOC_NONE) {
                ret = ptr
            } else {
                ret = [typeof _malloc === "function" ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
            }
            if (zeroinit) {
                var stop;
                ptr = ret;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                    HEAP32[ptr >> 2] = 0
                }
                stop = ret + size;
                while (ptr < stop) {
                    HEAP8[ptr++ >> 0] = 0
                }
                return ret
            }
            if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                    HEAPU8.set(slab, ret)
                } else {
                    HEAPU8.set(new Uint8Array(slab), ret)
                }
                return ret
            }
            var i = 0,
                type, typeSize, previousType;
            while (i < size) {
                var curr = slab[i];
                type = singleType || types[i];
                if (type === 0) {
                    i++;
                    continue
                }
                if (type == "i64") type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                    typeSize = getNativeTypeSize(type);
                    previousType = type
                }
                i += typeSize
            }
            return ret
        }

        function getMemory(size) {
            if (!staticSealed) return staticAlloc(size);
            if (!runtimeInitialized) return dynamicAlloc(size);
            return _malloc(size)
        }

        function Pointer_stringify(ptr, length) {
            if (length === 0 || !ptr) return "";
            var hasUtf = 0;
            var t;
            var i = 0;
            while (1) {
                t = HEAPU8[ptr + i >> 0];
                hasUtf |= t;
                if (t == 0 && !length) break;
                i++;
                if (length && i == length) break
            }
            if (!length) length = i;
            var ret = "";
            if (hasUtf < 128) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                    curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
                    ret = ret ? ret + curr : curr;
                    ptr += MAX_CHUNK;
                    length -= MAX_CHUNK
                }
                return ret
            }
            return UTF8ToString(ptr)
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

        function UTF8ArrayToString(u8Array, idx) {
            var endPtr = idx;
            while (u8Array[endPtr]) ++endPtr;
            if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
                return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
            } else {
                var u0, u1, u2, u3, u4, u5;
                var str = "";
                while (1) {
                    u0 = u8Array[idx++];
                    if (!u0) return str;
                    if (!(u0 & 128)) {
                        str += String.fromCharCode(u0);
                        continue
                    }
                    u1 = u8Array[idx++] & 63;
                    if ((u0 & 224) == 192) {
                        str += String.fromCharCode((u0 & 31) << 6 | u1);
                        continue
                    }
                    u2 = u8Array[idx++] & 63;
                    if ((u0 & 240) == 224) {
                        u0 = (u0 & 15) << 12 | u1 << 6 | u2
                    } else {
                        u3 = u8Array[idx++] & 63;
                        if ((u0 & 248) == 240) {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3
                        } else {
                            u4 = u8Array[idx++] & 63;
                            if ((u0 & 252) == 248) {
                                u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4
                            } else {
                                u5 = u8Array[idx++] & 63;
                                u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5
                            }
                        }
                    }
                    if (u0 < 65536) {
                        str += String.fromCharCode(u0)
                    } else {
                        var ch = u0 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                    }
                }
            }
        }

        function UTF8ToString(ptr) {
            return UTF8ArrayToString(HEAPU8, ptr)
        }

        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = 65536 + ((u & 1023) << 10) | u1 & 1023
                }
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    outU8Array[outIdx++] = u
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    outU8Array[outIdx++] = 192 | u >> 6;
                    outU8Array[outIdx++] = 128 | u & 63
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    outU8Array[outIdx++] = 224 | u >> 12;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63
                } else if (u <= 2097151) {
                    if (outIdx + 3 >= endIdx) break;
                    outU8Array[outIdx++] = 240 | u >> 18;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63
                } else if (u <= 67108863) {
                    if (outIdx + 4 >= endIdx) break;
                    outU8Array[outIdx++] = 248 | u >> 24;
                    outU8Array[outIdx++] = 128 | u >> 18 & 63;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63
                } else {
                    if (outIdx + 5 >= endIdx) break;
                    outU8Array[outIdx++] = 252 | u >> 30;
                    outU8Array[outIdx++] = 128 | u >> 24 & 63;
                    outU8Array[outIdx++] = 128 | u >> 18 & 63;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63
                }
            }
            outU8Array[outIdx] = 0;
            return outIdx - startIdx
        }

        function stringToUTF8(str, outPtr, maxBytesToWrite) {
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
        }