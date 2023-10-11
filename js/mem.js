  function lengthBytesUTF8(str) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                if (u <= 127) {
                    ++len
                } else if (u <= 2047) {
                    len += 2
                } else if (u <= 65535) {
                    len += 3
                } else if (u <= 2097151) {
                    len += 4
                } else if (u <= 67108863) {
                    len += 5
                } else {
                    len += 6
                }
            }
            return len
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

        function allocateUTF8(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = _malloc(size);
            if (ret) stringToUTF8Array(str, HEAP8, ret, size);
            return ret
        }

        function allocateUTF8OnStack(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = stackAlloc(size);
            stringToUTF8Array(str, HEAP8, ret, size);
            return ret
        }

        function demangle(func) {
            return func
        }

        function demangleAll(text) {
            var regex = /__Z[\w\d_]+/g;
            return text.replace(regex, (function(x) {
                var y = demangle(x);
                return x === y ? x : x + " [" + y + "]"
            }))
        }

        function jsStackTrace() {
            var err = new Error;
            if (!err.stack) {
                try {
                    throw new Error(0)
                } catch (e) {
                    err = e
                }
                if (!err.stack) {
                    return "(no stack trace available)"
                }
            }
            return err.stack.toString()
        }

        function stackTrace() {
            var js = jsStackTrace();
            if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
            return demangleAll(js)
        }
        var PAGE_SIZE = 16384;
        var WASM_PAGE_SIZE = 65536;
        var ASMJS_PAGE_SIZE = 16777216;
        var MIN_TOTAL_MEMORY = 16777216;

        function alignUp(x, multiple) {
            if (x % multiple > 0) {
                x += multiple - x % multiple
            }
            return x
        }
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

        function updateGlobalBuffer(buf) {
            Module["buffer"] = buffer = buf
        }

        function updateGlobalBufferViews() {
            Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
            Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
            Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer)
        }
        var STATIC_BASE, STATICTOP, staticSealed;
        var STACK_BASE, STACKTOP, STACK_MAX;
        var DYNAMIC_BASE, DYNAMICTOP_PTR;
        STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
        staticSealed = false;

        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        }
        if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function(size) {
            var ret;
            try {
                if (ArrayBuffer.transfer) {
                    ret = ArrayBuffer.transfer(buffer, size)
                } else {
                    var oldHEAP8 = HEAP8;
                    ret = new ArrayBuffer(size);
                    var temp = new Int8Array(ret);
                    temp.set(oldHEAP8)
                }
            } catch (e) {
                return false
            }
            var success = _emscripten_replace_memory(ret);
            if (!success) return false;
            return ret
        });

        function enlargeMemory() {
            var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
            var LIMIT = 2147483648 - PAGE_MULTIPLE;
            if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) {
                return false
            }
            var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
            TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
            while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) {
                if (TOTAL_MEMORY <= 536870912) {
                    TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE)
                } else {
                    TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT)
                }
            }
            var replacement = Module["reallocBuffer"](TOTAL_MEMORY);
            if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
                TOTAL_MEMORY = OLD_TOTAL_MEMORY;
                return false
            }
            updateGlobalBuffer(replacement);
            updateGlobalBufferViews();
            return true
        }
        var byteLength;
        try {
            byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
            byteLength(new ArrayBuffer(4))
        } catch (e) {
            byteLength = (function(buffer) {
                return buffer.byteLength
            })
        }
        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 33554432;
        if (TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
        if (Module["buffer"]) {
            buffer = Module["buffer"]
        } else {
            if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
                Module["wasmMemory"] = new WebAssembly.Memory({
                    "initial": TOTAL_MEMORY / WASM_PAGE_SIZE
                });
                buffer = Module["wasmMemory"].buffer
            } else {
                buffer = new ArrayBuffer(TOTAL_MEMORY)
            }
            Module["buffer"] = buffer
        }
        updateGlobalBufferViews();

        function getTotalMemory() {
            return TOTAL_MEMORY
        }

        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Module["dynCall_v"](func)
                    } else {
                        Module["dynCall_vi"](func, callback.arg)
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg)
                }
            }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;

        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPRERUN__)
        }

        function ensureInitRuntime() {
            if (runtimeInitialized) return;
            runtimeInitialized = true;
            callRuntimeCallbacks(__ATINIT__)
        }

        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }

        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__);
            runtimeExited = true
        }

        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__)
        }

        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb)
        }

        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb)
        }

        function writeArrayToMemory(array, buffer) {
            HEAP8.set(array, buffer)
        }

        function writeAsciiToMemory(str, buffer, dontAddNull) {
            for (var i = 0; i < str.length; ++i) {
                HEAP8[buffer++ >> 0] = str.charCodeAt(i)
            }
            if (!dontAddNull) HEAP8[buffer >> 0] = 0
        }

        function unSign(value, bits, ignore) {
            if (value >= 0) {
                return value
            }
            return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value
        }

        function reSign(value, bits, ignore) {
            if (value <= 0) {
                return value
            }
            var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
            if (value >= half && (bits <= 32 || value > half)) {
                value = -2 * half + value
            }
            return value
        }
        var Math_abs = Math.abs;
        var Math_sqrt = Math.sqrt;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_pow = Math.pow;
        var Math_min = Math.min;
        var Math_clz32 = Math.clz32;
        var Math_trunc = Math.trunc;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;

        function getUniqueRunDependency(id) {
            return id
        }

        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
        }

        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback()
                }
            }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var dataURIPrefix = "data:application/octet-stream;base64,";

        function isDataURI(filename) {
            return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
        }

        function integrateWasmJS() {
            var wasmTextFile = "build.wast";
            var wasmBinaryFile = "build.wasm";
            var asmjsCodeFile = "build.temp.asm.js";
            if (!isDataURI(wasmTextFile)) {
                wasmTextFile = locateFile(wasmTextFile)
            }
            if (!isDataURI(wasmBinaryFile)) {
                wasmBinaryFile = locateFile(wasmBinaryFile)
            }
            if (!isDataURI(asmjsCodeFile)) {
                asmjsCodeFile = locateFile(asmjsCodeFile)
            }
            var wasmPageSize = 64 * 1024;
            var info = {
                "global": null,
                "env": null,
                "asm2wasm": asm2wasmImports,
                "parent": Module
            };
            var exports = null;

            function mergeMemory(newBuffer) {
                var oldBuffer = Module["buffer"];
                if (newBuffer.byteLength < oldBuffer.byteLength) {
                    err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
                }
                var oldView = new Int8Array(oldBuffer);
                var newView = new Int8Array(newBuffer);
                newView.set(oldView);
                updateGlobalBuffer(newBuffer);
                updateGlobalBufferViews()
            }

            function fixImports(imports) {
                return imports
            }

            function getBinary() {
                try {
                    if (Module["wasmBinary"]) {
                        return new Uint8Array(Module["wasmBinary"])
                    }
                    if (Module["readBinary"]) {
                        return Module["readBinary"](wasmBinaryFile)
                    } else {
                        throw "both async and sync fetching of the wasm failed"
                    }
                } catch (err) {
                    abort(err)
                }
            }

            function getBinaryPromise() {
                if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                    return fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }).then((function(response) {
                        if (!response["ok"]) {
                            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                        }
                        return response["arrayBuffer"]()
                    })).catch((function() {
                        return getBinary()
                    }))
                }
                return new Promise((function(resolve, reject) {
                    resolve(getBinary())
                }))
            }

            function doNativeWasm(global, env, providedBuffer) {
                if (typeof WebAssembly !== "object") {
                    err("no native wasm support detected");
                    return false
                }
                if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
                    err("no native wasm Memory in use");
                    return false
                }
                env["memory"] = Module["wasmMemory"];
                info["global"] = {
                    "NaN": NaN,
                    "Infinity": Infinity
                };
                info["global.Math"] = Math;
                info["env"] = env;

                function receiveInstance(instance, module) {
                    exports = instance.exports;
                    if (exports.memory) mergeMemory(exports.memory);
                    Module["asm"] = exports;
                    Module["usingWasm"] = true;
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");
                if (Module["instantiateWasm"]) {
                    try {
                        return Module["instantiateWasm"](info, receiveInstance)
                    } catch (e) {
                        err("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }

                function receiveInstantiatedSource(output) {
                    receiveInstance(output["instance"], output["module"])
                }

                function instantiateArrayBuffer(receiver) {
                    getBinaryPromise().then((function(binary) {
                        return WebAssembly.instantiate(binary, info)
                    })).then(receiver).catch((function(reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    }))
                }
                if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                    WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }), info).then(receiveInstantiatedSource).catch((function(reason) {
                        err("wasm streaming compile failed: " + reason);
                        err("falling back to ArrayBuffer instantiation");
                        instantiateArrayBuffer(receiveInstantiatedSource)
                    }))
                } else {
                    instantiateArrayBuffer(receiveInstantiatedSource)
                }
                return {}
            }
            Module["asmPreload"] = Module["asm"];
            var asmjsReallocBuffer = Module["reallocBuffer"];
            var wasmReallocBuffer = (function(size) {
                var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
                size = alignUp(size, PAGE_MULTIPLE);
                var old = Module["buffer"];
                var oldSize = old.byteLength;
                if (Module["usingWasm"]) {
                    try {
                        var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
                        if (result !== (-1 | 0)) {
                            return Module["buffer"] = Module["wasmMemory"].buffer
                        } else {
                            return null
                        }
                    } catch (e) {
                        return null
                    }
                }
            });
            Module["reallocBuffer"] = (function(size) {
                if (finalMethod === "asmjs") {
                    return asmjsReallocBuffer(size)
                } else {
                    return wasmReallocBuffer(size)
                }
            });
            var finalMethod = "";
            Module["asm"] = (function(global, env, providedBuffer) {
                env = fixImports(env);
                if (!env["table"]) {
                    var TABLE_SIZE = Module["wasmTableSize"];
                    if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
                    var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
                    if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
                        if (MAX_TABLE_SIZE !== undefined) {
                            env["table"] = new WebAssembly.Table({
                                "initial": TABLE_SIZE,
                                "maximum": MAX_TABLE_SIZE,
                                "element": "anyfunc"
                            })
                        } else {
                            env["table"] = new WebAssembly.Table({
                                "initial": TABLE_SIZE,
                                element: "anyfunc"
                            })
                        }
                    } else {
                        env["table"] = new Array(TABLE_SIZE)
                    }
                    Module["wasmTable"] = env["table"]
                }
                if (!env["memoryBase"]) {
                    env["memoryBase"] = Module["STATIC_BASE"]
                }
                if (!env["tableBase"]) {
                    env["tableBase"] = 0
                }
                var exports;
                exports = doNativeWasm(global, env, providedBuffer);
                assert(exports, "no binaryen method succeeded.");
                return exports
            });
        }
        integrateWasmJS();
        var ASM_CONSTS = [(function() {
            return Module.webglContextAttributes.premultipliedAlpha
        }), (function() {
            return Module.webglContextAttributes.preserveDrawingBuffer
        }), (function($0) {
            throw new Error('Internal Unity error: gles::GetProcAddress("' + Pointer_stringify($0) + '") was called but gles::GetProcAddress() is not implemented on Unity WebGL. Please report a bug.')
        }), (function() {
            return typeof Module.shouldQuit != "undefined"
        }), (function() {
            for (var id in Module.intervals) {
                window.clearInterval(id)
            }
            Module.intervals = {};
            for (var i = 0; i < Module.deinitializers.length; i++) {
                Module.deinitializers[i]()
            }
            Module.deinitializers = [];
            if (typeof Module.onQuit == "function") Module.onQuit()
        })];

        function _emscripten_asm_const_i(code) {
            return ASM_CONSTS[code]()
        }

        function _emscripten_asm_const_sync_on_main_thread_i(code) {
            return ASM_CONSTS[code]()
        }

        function _emscripten_asm_const_ii(code, a0) {
            return ASM_CONSTS[code](a0)
        }
        STATIC_BASE = GLOBAL_BASE;
        STATICTOP = STATIC_BASE + 4545808;
        __ATINIT__.push({
            func: (function() {
                __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AIScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AnimationScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Animation_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Animation_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Animation_6_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Avatar_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_ConstraintManager_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AnimationClip_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AudioScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Video_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Audio_Public_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Audio_Public_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Audio_Public_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_ClothScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Cloth_0_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_18()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_nvcloth_src_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_nvcloth_src_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_SwInterCollision_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_SwSolverKernel_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Input_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_GfxDeviceNull_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_2D_Renderer_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Allocator_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Allocator_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Application_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Burst_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_4_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_6_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_7_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Shadows_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_GUITexture_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Containers_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_File_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Geometry_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_0_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_98()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_4_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_6_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_8_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_10_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_11_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Interfaces_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Interfaces_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Interfaces_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Jobs_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Jobs_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Jobs_Internal_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Math_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Math_Random_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Misc_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Misc_2_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_127()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Misc_4_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Misc_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Profiler_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Profiler_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_SceneManager_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Shaders_0_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_116()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Shaders_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Transform_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Transform_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Utilities_2_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_2_9467()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Utilities_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Utilities_6_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Utilities_7_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Utilities_9_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_AssetBundleFileSystem_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Modules_0_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_13()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_14()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_15()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Profiler_Runtime_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_UnsafeUtility_bindings_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_4_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_GfxDevice_5_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Director_Core_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Scripting_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Scripting_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Scripting_3_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_TemplateInstantiations_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Serialize_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Serialize_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Serialize_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_LogAssert_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Shader_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Transform_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Source_0_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_DirectorScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_GridScriptingClasses_cpp()
            })
        }, {
            func: (function() {
                __GLOBAL__sub_I_Modules_Grid_Public_0_cpp()
            })
        }, {
            func: (function() {
                ___cxx_global_var_init_3660()
            })
        }