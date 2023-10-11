   function _JS_Sound_SetLoop(channelInstance, loop) {
            if (WEBAudio.audioWebEnabled == 0) return;
            WEBAudio.audioInstances[channelInstance].source.loop = loop
        }

        function _JS_Sound_SetLoopPoints(channelInstance, loopStart, loopEnd) {
            if (WEBAudio.audioWebEnabled == 0) return;
            var channel = WEBAudio.audioInstances[channelInstance];
            channel.source.loopStart = loopStart;
            channel.source.loopEnd = loopEnd
        }

        function _JS_Sound_SetPitch(channelInstance, v) {
            if (WEBAudio.audioWebEnabled == 0) return;
            WEBAudio.audioInstances[channelInstance].source.playbackRate.setValueAtTime(v, WEBAudio.audioContext.currentTime)
        }

        function _JS_Sound_SetPosition(channelInstance, x, y, z) {
            if (WEBAudio.audioWebEnabled == 0) return;
            WEBAudio.audioInstances[channelInstance].panner.setPosition(x, y, z)
        }

        function _JS_Sound_SetVolume(channelInstance, v) {
            if (WEBAudio.audioWebEnabled == 0) return;
            WEBAudio.audioInstances[channelInstance].gain.gain.setValueAtTime(v, WEBAudio.audioContext.currentTime)
        }

        function _JS_Sound_Stop(channelInstance, delay) {
            if (WEBAudio.audioWebEnabled == 0) return;
            var channel = WEBAudio.audioInstances[channelInstance];
            if (channel.source.buffer) {
                try {
                    channel.source.stop(WEBAudio.audioContext.currentTime + delay)
                } catch (e) {
                    channel.source.disconnect()
                }
                if (delay == 0) {
                    channel.source.onended = (function() {});
                    channel.setup()
                }
            }
        }

        function _JS_SystemInfo_GetBrowserName(buffer, bufferSize) {
            var browser = UnityLoader.SystemInfo.browser;
            if (buffer) stringToUTF8(browser, buffer, bufferSize);
            return lengthBytesUTF8(browser)
        }

        function _JS_SystemInfo_GetBrowserVersionString(buffer, bufferSize) {
            var browserVer = UnityLoader.SystemInfo.browserVersion;
            if (buffer) stringToUTF8(browserVer, buffer, bufferSize);
            return lengthBytesUTF8(browserVer)
        }

        function _JS_SystemInfo_GetCanvasClientSize(domElementSelector, outWidth, outHeight) {
            var selector = UTF8ToString(domElementSelector);
            var canvas = selector == "#canvas" ? Module["canvas"] : document.querySelector(selector);
            HEAPF64[outWidth >> 3] = canvas ? canvas.clientWidth : 0;
            HEAPF64[outHeight >> 3] = canvas ? canvas.clientHeight : 0
        }

        function _JS_SystemInfo_GetDocumentURL(buffer, bufferSize) {
            if (buffer) stringToUTF8(document.URL, buffer, bufferSize);
            return lengthBytesUTF8(document.URL)
        }

        function _JS_SystemInfo_GetGPUInfo(buffer, bufferSize) {
            var gpuinfo = UnityLoader.SystemInfo.gpu;
            if (buffer) stringToUTF8(gpuinfo, buffer, bufferSize);
            return lengthBytesUTF8(gpuinfo)
        }

        function _JS_SystemInfo_GetLanguage(buffer, bufferSize) {
            var language = UnityLoader.SystemInfo.language;
            if (buffer) stringToUTF8(language, buffer, bufferSize);
            return lengthBytesUTF8(language)
        }

        function _JS_SystemInfo_GetMemory() {
            return TOTAL_MEMORY / (1024 * 1024)
        }

        function _JS_SystemInfo_GetOS(buffer, bufferSize) {
            var browser = UnityLoader.SystemInfo.os + " " + UnityLoader.SystemInfo.osVersion;
            if (buffer) stringToUTF8(browser, buffer, bufferSize);
            return lengthBytesUTF8(browser)
        }

        function _JS_SystemInfo_GetPreferredDevicePixelRatio() {
            return Module.devicePixelRatio || window.devicePixelRatio || 1
        }

        function _JS_SystemInfo_GetScreenSize(outWidth, outHeight) {
            HEAPF64[outWidth >> 3] = UnityLoader.SystemInfo.width;
            HEAPF64[outHeight >> 3] = UnityLoader.SystemInfo.height
        }

        function _JS_SystemInfo_HasCursorLock() {
            return UnityLoader.SystemInfo.hasCursorLock
        }

        function _JS_SystemInfo_HasFullscreen() {
            return UnityLoader.SystemInfo.hasFullscreen
        }

        function _JS_SystemInfo_HasWebGL() {
            return UnityLoader.SystemInfo.hasWebGL
        }

        function _JS_UNETWebSockets_HostsContainingMessagesCleanHost(hostId) {
            for (i = 0; i < UNETWebSocketsInstances.hostsContainingMessages.length; i++) {
                if (UNETWebSocketsInstances.hostsContainingMessages[i] != null) {
                    if (UNETWebSocketsInstances.hostsContainingMessages[i].id == hostId) UNETWebSocketsInstances.hostsContainingMessages[i] = null
                }
            }
            var socket = UNETWebSocketsInstances.hostsContainingMessages[0];
            if (socket == null) return;
            if (socket.messages.length == 0) {
                socket.inQueue = false
            } else {
                UNETWebSocketsInstances.hostsContainingMessages.push(socket)
            }
            UNETWebSocketsInstances.hostsContainingMessages.shift()
        }

        function _JS_UNETWebSockets_HostsContainingMessagesPush(socket) {
            if (socket.inQueue == false) {
                UNETWebSocketsInstances.hostsContainingMessages.push(socket);
                socket.inQueue = true
            }
        }
        var UNETWebSocketsInstances = {
            hosts: [, , , , , , , , , , , , , , ],
            hostsContainingMessages: [],
            pingDataArray: null,
            HostStates: {
                Created: 0,
                Opening: 1,
                Connected: 2,
                Closing: 3,
                Closed: 4
            },
            EventTypes: {
                DataEvent: 0,
                ConnectEvent: 1,
                DisconnectEvent: 2,
                Nothing: 3
            }
        };

        function _JS_UNETWebSockets_AddHost(pingTimeoutParam) {
            var placeHolderSocket = {
                socket: null,
                buffer: new Uint8Array(0),
                error: null,
                id: -1,
                state: UNETWebSocketsInstances.HostStates.Closed,
                pingTimeout: pingTimeoutParam,
                messages: []
            };
            for (i = 0; i < UNETWebSocketsInstances.hosts.length; i++) {
                if (UNETWebSocketsInstances.hosts[i] == null) {
                    placeHolderSocket.id = i;
                    UNETWebSocketsInstances.hosts[i] = placeHolderSocket;
                    return i
                }
            }
            return -1
        }

        function _JS_UNETWebSockets_Init() {
            UNETWebSocketsInstances.pingDataArray = new ArrayBuffer(1);
            var arr = new Uint8Array(UNETWebSocketsInstances.pingDataArray);
            arr[0] = 255
        }

        function _JS_UNETWebSockets_IsHostCorrect(i) {
            if (i < UNETWebSocketsInstances.hosts.length && UNETWebSocketsInstances.hosts[i] != null && UNETWebSocketsInstances.hosts[i].socket != null) {
                return true
            }
            return false
        }

        function _JS_UNETWebSockets_IsHostReadyToConnect(i) {
            if (i < UNETWebSocketsInstances.hosts.length && UNETWebSocketsInstances.hosts[i] != null && UNETWebSocketsInstances.hosts[i].socket == null) {
                return true
            }
            return false
        }

        function _JS_UNETWebSockets_SocketCleanEvnt() {
            var host = UNETWebSocketsInstances.hostsContainingMessages.shift();
            host.inQueue = false;
            if (host.state == UNETWebSocketsInstances.HostStates.Opening) {
                host.state = UNETWebSocketsInstances.HostStates.Connected;
                if (host.messages.length != 0) _JS_UNETWebSockets_HostsContainingMessagesPush(host)
            } else if (host.state == UNETWebSocketsInstances.HostStates.Closing) {
                if (host.messages.length == 0) UNETWebSocketsInstances.hosts[host.id] = null;
                else {
                    host.messages.shift();
                    if (host.messages.length != 0) _JS_UNETWebSockets_HostsContainingMessagesPush(host)
                }
            } else {
                host.messages.shift();
                if (host.messages.length != 0) _JS_UNETWebSockets_HostsContainingMessagesPush(host)
            }
        }

        function _JS_UNETWebSockets_SocketCleanEvntFromHost(hostId) {
            if (UNETWebSocketsInstances.hosts[hostId].state == UNETWebSocketsInstances.HostStates.Opening) UNETWebSocketsInstances.hosts[hostId].state = UNETWebSocketsInstances.HostStates.Connected;
            else if (UNETWebSocketsInstances.hosts[hostId].messages.length != 0) UNETWebSocketsInstances.hosts[hostId].messages.shift();
            else if (UNETWebSocketsInstances.hosts[hostId].state == UNETWebSocketsInstances.HostStates.Closing) {
                UNETWebSocketsInstances.hosts[hostId].state = UNETWebSocketsInstances.HostStates.Closed;
                UNETWebSocketsInstances.hosts[hostId] = null;
                _JS_UNETWebSockets_HostsContainingMessagesCleanHost(hostId)
            }
        }

        function _JS_UNETWebSockets_SocketClose(hostId) {
            var socket = UNETWebSocketsInstances.hosts[hostId];
            if (socket.socket != null) socket.socket.close()
        }

        function _JS_UNETWebSockets_SocketCreate(hostId, url) {
            var str = Pointer_stringify(url);

            function keepAlive(socket) {
                var now = Date.now();
                var ab = new ArrayBuffer(1);
                var pData = new Uint8Array(ab);
                pData[0] = 255;
                if (now - socket.lastSentTime > socket.pingTimeout) {
                    socket.socket.send(UNETWebSocketsInstances.pingDataArray);
                    socket.lastSentTime = now
                }
            }

            function cancelKeepAlive(socket) {
                if (socket.timerID) {
                    Module.clearInterval(socket.timerID);
                    socket.timerID = 0
                }
            }
            var socket = {
                socket: new WebSocket(str, ["unitygame"]),
                buffer: new Uint8Array(0),
                error: null,
                id: hostId,
                state: UNETWebSocketsInstances.HostStates.Created,
                inQueue: false,
                timerID: 0,
                pingTimeout: 0,
                lastSentTime: Date.now(),
                messages: []
            };
            socket.socket.onopen = (function() {
                socket.state = UNETWebSocketsInstances.HostStates.Opening;
                _JS_UNETWebSockets_HostsContainingMessagesPush(socket);
                socket.timerID = Module.setInterval((function() {
                    keepAlive(socket)
                }), socket.pingTimeout)
            });
            socket.socket.onmessage = (function(e) {
                if (e.data instanceof Blob) {
                    var reader = new FileReader;
                    reader.addEventListener("loadend", (function() {
                        var array = new Uint8Array(reader.result);
                        _JS_UNETWebSockets_HostsContainingMessagesPush(socket);
                        if (array.length == 1 && array[0] == 255) {
                            return
                        }
                        socket.messages.push(array)
                    }));
                    reader.readAsArrayBuffer(e.data)
                }
            });
            socket.socket.onclose = (function(e) {
                cancelKeepAlive(socket);
                if (socket.state == UNETWebSocketsInstances.HostStates.Closed) {
                    return
                }
                socket.state = UNETWebSocketsInstances.HostStates.Closing;
                _JS_UNETWebSockets_HostsContainingMessagesPush(socket)
            });
            socket.socket.onerror = (function(e) {
                console.log("Error: " + e.data + " socket will be closed");
                socket.state = UNETWebSocketsInstances.HostStates.Closing;
                _JS_UNETWebSockets_HostsContainingMessagesPush(socket)
            });
            socket.pingTimeout = UNETWebSocketsInstances.hosts[socket.id].pingTimeout;
            UNETWebSocketsInstances.hosts[socket.id] = socket
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuff(ptr, length) {
            HEAPU8.set(UNETWebSocketsInstances.hostsContainingMessages[0].messages[0], ptr)
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffFromHost(hostId, ptr, length) {
            HEAPU8.set(UNETWebSocketsInstances.hosts[hostId].messages[0], ptr)
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffLength() {
            return UNETWebSocketsInstances.hostsContainingMessages[0].messages[0].length
        }

        function _JS_UNETWebSockets_SocketRecvEvntBuffLengthFromHost(hostId) {
            return UNETWebSocketsInstances.hosts[hostId].messages[0].length
        }

        function _JS_UNETWebSockets_SocketRecvEvntHost() {
            return UNETWebSocketsInstances.hostsContainingMessages[0].id
        }

        function _JS_UNETWebSockets_SocketRecvEvntType() {
            if (UNETWebSocketsInstances.hostsContainingMessages.length == 0) return UNETWebSocketsInstances.EventTypes.Nothing;
            while (UNETWebSocketsInstances.hostsContainingMessages.length != 0) {
                if (UNETWebSocketsInstances.hostsContainingMessages[0] == null) UNETWebSocketsInstances.hostsContainingMessages.shift();
                else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closed) UNETWebSocketsInstances.hostsContainingMessages.shift();
                else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Opening) break;
                else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closing) break;
                else if (UNETWebSocketsInstances.hostsContainingMessages[0].messages.length == 0) {
                    UNETWebSocketsInstances.hostsContainingMessages[0].inQueue = false;
                    UNETWebSocketsInstances.hostsContainingMessages.shift()
                } else break
            }
            if (UNETWebSocketsInstances.hostsContainingMessages.length == 0) return UNETWebSocketsInstances.EventTypes.Nothing;
            else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Opening) return UNETWebSocketsInstances.EventTypes.ConnectEvent;
            else if (UNETWebSocketsInstances.hostsContainingMessages[0].state == UNETWebSocketsInstances.HostStates.Closing && UNETWebSocketsInstances.hostsContainingMessages[0].messages.length == 0) return UNETWebSocketsInstances.EventTypes.DisconnectEvent;
            else return UNETWebSocketsInstances.EventTypes.DataEvent
        }

        function _JS_UNETWebSockets_SocketRecvEvntTypeFromHost(hostId) {
            var evnt = UNETWebSocketsInstances.EventTypes.Nothing;
            if (UNETWebSocketsInstances.hosts[hostId].state == UNETWebSocketsInstances.HostStates.Opening) evnt = UNETWebSocketsInstances.EventTypes.ConnectEvent;
            else if (UNETWebSocketsInstances.hosts[hostId].messages.length != 0) evnt = UNETWebSocketsInstances.EventTypes.DataEvent;
            else if (UNETWebSocketsInstances.hosts[hostId].state == UNETWebSocketsInstances.HostStates.Closing) evnt = UNETWebSocketsInstances.EventTypes.DisconnectEvent;
            return evnt
        }

        function _JS_UNETWebSockets_SocketSend(hostId, ptr, length) {
            var socket = UNETWebSocketsInstances.hosts[hostId];
            if (socket == 0 || socket.socket.readyState != 1 || socket.state != UNETWebSocketsInstances.HostStates.Connected) return;
            socket.socket.send(HEAPU8.buffer.slice(ptr, ptr + length));
            socket.lastSentTime = Date.now()
        }

        function _JS_UNETWebSockets_SocketStop() {
            for (i = 0; i < UNETWebSocketsInstances.hosts.length; i++) {
                if (UNETWebSocketsInstances.hosts[i] != null && UNETWebSocketsInstances.hosts[i].socket != null) {
                    var socket = UNETWebSocketsInstances.hosts[i];
                    socket.socket.close();
                    UNETWebSocketsInstances.hosts[i] = null
                }
            }
            UNETWebSocketsInstances.hosts = new Array(UNETWebSocketsInstances.hosts.length);
            UNETWebSocketsInstances.hostsContainingMessages = new Array
        }
        var wr = {
            requestInstances: {},
            nextRequestId: 1
        };

        function _JS_WebRequest_Abort(request) {
            wr.requestInstances[request].abort()
        }

        function _JS_WebRequest_Create(url, method) {
            var _url = Pointer_stringify(url);
            var _method = Pointer_stringify(method);
            var cacheControl = typeof Module.cacheControl == "function" ? Module.cacheControl(_url) : Module.cacheControl ? Module.cacheControl["UnityWebRequest"] || Module.cacheControl["default"] : "no-cache";
            var http = Module.companyName && Module.productName && cacheControl && cacheControl != "no-cache" ? new UnityLoader.UnityCache.XMLHttpRequest({
                companyName: Module.companyName,
                productName: Module.productName,
                cacheControl: cacheControl
            }) : new XMLHttpRequest;
            http.open(_method, _url, true);
            http.responseType = "arraybuffer";
            wr.requestInstances[wr.nextRequestId] = http;
            return wr.nextRequestId++
        }

        function _JS_WebRequest_GetResponseHeaders(request, buffer, bufferSize) {
            var headers = wr.requestInstances[request].getAllResponseHeaders();
            if (buffer) stringToUTF8(headers, buffer, bufferSize);
            return lengthBytesUTF8(headers)
        }

        function _JS_WebRequest_Release(request) {
            var http = wr.requestInstances[request];
            http.onload = null;
            http.onerror = null;
            http.ontimeout = null;
            http.onabort = null;
            delete http;
            wr.requestInstances[request] = null
        }

        function _JS_WebRequest_Send(request, ptr, length) {

        }

        function _JS_WebRequest_SetProgressHandler(request, arg, onprogress) {
            var http = wr.requestInstances[request];
            http.onprogress = function http_onprogress(e) {
                if (onprogress) {
                    if (e.lengthComputable) dynCall("viii", onprogress, [arg, e.loaded, e.total])
                }
            }
        }

        function _JS_WebRequest_SetRequestHeader(request, header, value) {
            var _header = Pointer_stringify(header);
            var _value = Pointer_stringify(value);
            wr.requestInstances[request].setRequestHeader(_header, _value)
        }

        function _JS_WebRequest_SetResponseHandler(request, arg, onresponse) {
            var http = wr.requestInstances[request];
            http.onload = function http_onload(e) {
                if (onresponse) {
                    var kWebRequestOK = 0;
                    var byteArray = new Uint8Array(http.response);
                    if (byteArray.length != 0) {
                        var buffer = _malloc(byteArray.length);
                        HEAPU8.set(byteArray, buffer);
                        dynCall("viiiiii", onresponse, [arg, http.status, buffer, byteArray.length, 0, kWebRequestOK])
                    } else {
                        dynCall("viiiiii", onresponse, [arg, http.status, 0, 0, 0, kWebRequestOK])
                    }
                }
            };

            function HandleError(err, code) {
                if (onresponse) {
                    var len = lengthBytesUTF8(err) + 1;
                    var buffer = _malloc(len);
                    stringToUTF8(err, buffer, len);
                    dynCall("viiiiii", onresponse, [arg, http.status, 0, 0, buffer, code]);
                    _free(buffer)
                }
            }
            http.onerror = function http_onerror(e) {
                var kWebErrorUnknown = 2;
                HandleError("Unknown error.", kWebErrorUnknown)
            };
            http.ontimeout = function http_onerror(e) {
                var kWebErrorTimeout = 14;
                HandleError("Connection timed out.", kWebErrorTimeout)
            };
            http.onabort = function http_onerror(e) {
                var kWebErrorAborted = 17;
                HandleError("Aborted.", kWebErrorAborted)
            }
        }

        function _JS_WebRequest_SetTimeout(request, timeout) {
            wr.requestInstances[request].timeout = timeout
        }

        function __GameCenterGenerateIdentityVerificationSignature() {
            err("missing function: _GameCenterGenerateIdentityVerificationSignature");
            abort(-1)
        }

        function __GameCenterGetLocalPlayer() {
            err("missing function: _GameCenterGetLocalPlayer");
            abort(-1)
        }

        function __GameCenterInit() {
            err("missing function: _GameCenterInit");
            abort(-1)
        }

        function __GameCenterLoadAchievementDescriptions() {
            err("missing function: _GameCenterLoadAchievementDescriptions");
            abort(-1)
        }

        function __GameCenterLoadAchievements() {
            err("missing function: _GameCenterLoadAchievements");
            abort(-1)
        }

        function __GameCenterLoadFriends() {
            err("missing function: _GameCenterLoadFriends");
            abort(-1)
        }

        function __GameCenterLoadLeaderboard() {
            err("missing function: _GameCenterLoadLeaderboard");
            abort(-1)
        }

        function __GameCenterLoadLeaderboardForIDs() {
            err("missing function: _GameCenterLoadLeaderboardForIDs");
            abort(-1)
        }

        function __GameCenterLoadPhoto() {
            err("missing function: _GameCenterLoadPhoto");
            abort(-1)
        }

        function __GameCenterLoadPlayers() {
            err("missing function: _GameCenterLoadPlayers");
            abort(-1)
        }

        function __GameCenterReportAchievement() {
            err("missing function: _GameCenterReportAchievement");
            abort(-1)
        }

        function __GameCenterReportAchievements() {
            err("missing function: _GameCenterReportAchievements");
            abort(-1)
        }

        function __GameCenterReportScore() {
            err("missing function: _GameCenterReportScore");
            abort(-1)
        }

        function __GameCenterResetAchievements() {
            err("missing function: _GameCenterResetAchievements");
            abort(-1)
        }

        function __GameCenterShowLoginView() {
            err("missing function: _GameCenterShowLoginView");
            abort(-1)
        }

        function __GameCenterShowView() {
            err("missing function: _GameCenterShowView");
            abort(-1)
        }

        function ___atomic_fetch_add_8(ptr, vall, valh, memmodel) {
            var l = HEAP32[ptr >> 2];
            var h = HEAP32[ptr + 4 >> 2];
            HEAP32[ptr >> 2] = _i64Add(l, h, vall, valh);
            HEAP32[ptr + 4 >> 2] = getTempRet0();
            return (setTempRet0(h), l) | 0
        }
        var ENV = {};

        function ___buildEnvironment(environ) {
            var MAX_ENV_VALUES = 64;
            var TOTAL_ENV_SIZE = 1024;
            var poolPtr;
            var envPtr;
            if (!___buildEnvironment.called) {
                ___buildEnvironment.called = true;
                ENV["USER"] = ENV["LOGNAME"] = "web_user";
                ENV["PATH"] = "/";
                ENV["PWD"] = "/";
                ENV["HOME"] = "/home/web_user";
                ENV["LANG"] = "C.UTF-8";
                ENV["_"] = Module["thisProgram"];
                poolPtr = getMemory(TOTAL_ENV_SIZE);
                envPtr = getMemory(MAX_ENV_VALUES * 4);
                HEAP32[envPtr >> 2] = poolPtr;
                HEAP32[environ >> 2] = envPtr
            } else {
                envPtr = HEAP32[environ >> 2];
                poolPtr = HEAP32[envPtr >> 2]
            }
            var strings = [];
            var totalSize = 0;
            for (var key in ENV) {
                if (typeof ENV[key] === "string") {
                    var line = key + "=" + ENV[key];
                    strings.push(line);
                    totalSize += line.length
                }
            }
            if (totalSize > TOTAL_ENV_SIZE) {
                throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")
            }
            var ptrSize = 4;
            for (var i = 0; i < strings.length; i++) {
                var line = strings[i];
                writeAsciiToMemory(line, poolPtr);
                HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
                poolPtr += line.length + 1
            }
            HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
        }

        function ___cxa_allocate_exception(size) {
            return _malloc(size)
        }

        function __ZSt18uncaught_exceptionv() {
            return !!__ZSt18uncaught_exceptionv.uncaught_exception
        }
        var EXCEPTIONS = {
            last: 0,
            caught: [],
            infos: {},
            deAdjust: (function(adjusted) {
                if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
                for (var key in EXCEPTIONS.infos) {
                    var ptr = +key;
                    var info = EXCEPTIONS.infos[ptr];
                    if (info.adjusted === adjusted) {
                        return ptr
                    }
                }
                return adjusted
            }),
            addRef: (function(ptr) {
                if (!ptr) return;
                var info = EXCEPTIONS.infos[ptr];
                info.refcount++
            }),
            decRef: (function(ptr) {
                if (!ptr) return;
                var info = EXCEPTIONS.infos[ptr];
                assert(info.refcount > 0);
                info.refcount--;
                if (info.refcount === 0 && !info.rethrown) {
                    if (info.destructor) {
                        Module["dynCall_vi"](info.destructor, ptr)
                    }
                    delete EXCEPTIONS.infos[ptr];
                    ___cxa_free_exception(ptr)
                }
            }),
            clearRef: (function(ptr) {
                if (!ptr) return;
                var info = EXCEPTIONS.infos[ptr];
                info.refcount = 0
            })
        };

        function ___cxa_begin_catch(ptr) {
            var info = EXCEPTIONS.infos[ptr];
            if (info && !info.caught) {
                info.caught = true;
                __ZSt18uncaught_exceptionv.uncaught_exception--
            }
            if (info) info.rethrown = false;
            EXCEPTIONS.caught.push(ptr);
            EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));
            return ptr
        }

        function ___cxa_free_exception(ptr) {
            try {
                return _free(ptr)
            } catch (e) {}
        }

        function ___cxa_end_catch() {
            Module["setThrew"](0);
            var ptr = EXCEPTIONS.caught.pop();
            if (ptr) {
                EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(ptr));
                EXCEPTIONS.last = 0
            }
        }

        function ___cxa_find_matching_catch_2() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_find_matching_catch_3() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_find_matching_catch_4() {
            return ___cxa_find_matching_catch.apply(null, arguments)
        }

        function ___cxa_pure_virtual() {
            ABORT = true;
            throw "Pure virtual function called!"
        }

        function ___cxa_rethrow() {
            var ptr = EXCEPTIONS.caught.pop();
            ptr = EXCEPTIONS.deAdjust(ptr);
            if (!EXCEPTIONS.infos[ptr].rethrown) {
                EXCEPTIONS.caught.push(ptr);
                EXCEPTIONS.infos[ptr].rethrown = true
            }
            EXCEPTIONS.last = ptr;
            throw ptr
        }

        function ___resumeException(ptr) {
            if (!EXCEPTIONS.last) {
                EXCEPTIONS.last = ptr
            }
            throw ptr
        }

        function ___cxa_find_matching_catch() {
            var thrown = EXCEPTIONS.last;
            if (!thrown) {
                return (setTempRet0(0), 0) | 0
            }
            var info = EXCEPTIONS.infos[thrown];
            var throwntype = info.type;
            if (!throwntype) {
                return (setTempRet0(0), thrown) | 0
            }
            var typeArray = Array.prototype.slice.call(arguments);
            var pointer = Module["___cxa_is_pointer_type"](throwntype);
            if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
            HEAP32[___cxa_find_matching_catch.buffer >> 2] = thrown;
            thrown = ___cxa_find_matching_catch.buffer;
            for (var i = 0; i < typeArray.length; i++) {
                if (typeArray[i] && Module["___cxa_can_catch"](typeArray[i], throwntype, thrown)) {
                    thrown = HEAP32[thrown >> 2];
                    info.adjusted = thrown;
                    return (setTempRet0(typeArray[i]), thrown) | 0
                }
            }
            thrown = HEAP32[thrown >> 2];
            return (setTempRet0(throwntype), thrown) | 0
        }

        function ___cxa_throw(ptr, type, destructor) {
            EXCEPTIONS.infos[ptr] = {
                ptr: ptr,
                adjusted: ptr,
                type: type,
                destructor: destructor,
                refcount: 0,
                caught: false,
                rethrown: false
            };
            EXCEPTIONS.last = ptr;
            if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
                __ZSt18uncaught_exceptionv.uncaught_exception = 1
            } else {
                __ZSt18uncaught_exceptionv.uncaught_exception++
            }
            throw ptr
        }

        function ___gxx_personality_v0() {}

        function ___lock() {}
        var ERRNO_CODES = {
            EPERM: 1,
            ENOENT: 2,
            ESRCH: 3,
            EINTR: 4,
            EIO: 5,
            ENXIO: 6,
            E2BIG: 7,
            ENOEXEC: 8,
            EBADF: 9,
            ECHILD: 10,
            EAGAIN: 11,
            EWOULDBLOCK: 11,
            ENOMEM: 12,
            EACCES: 13,
            EFAULT: 14,
            ENOTBLK: 15,
            EBUSY: 16,
            EEXIST: 17,
            EXDEV: 18,
            ENODEV: 19,
            ENOTDIR: 20,
            EISDIR: 21,
            EINVAL: 22,
            ENFILE: 23,
            EMFILE: 24,
            ENOTTY: 25,
            ETXTBSY: 26,
            EFBIG: 27,
            ENOSPC: 28,
            ESPIPE: 29,
            EROFS: 30,
            EMLINK: 31,
            EPIPE: 32,
            EDOM: 33,
            ERANGE: 34,
            ENOMSG: 42,
            EIDRM: 43,
            ECHRNG: 44,
            EL2NSYNC: 45,
            EL3HLT: 46,
            EL3RST: 47,
            ELNRNG: 48,
            EUNATCH: 49,
            ENOCSI: 50,
            EL2HLT: 51,
            EDEADLK: 35,
            ENOLCK: 37,
            EBADE: 52,
            EBADR: 53,
            EXFULL: 54,
            ENOANO: 55,
            EBADRQC: 56,
            EBADSLT: 57,
            EDEADLOCK: 35,
            EBFONT: 59,
            ENOSTR: 60,
            ENODATA: 61,
            ETIME: 62,
            ENOSR: 63,
            ENONET: 64,
            ENOPKG: 65,
            EREMOTE: 66,
            ENOLINK: 67,
            EADV: 68,
            ESRMNT: 69,
            ECOMM: 70,
            EPROTO: 71,
            EMULTIHOP: 72,
            EDOTDOT: 73,
            EBADMSG: 74,
            ENOTUNIQ: 76,
            EBADFD: 77,
            EREMCHG: 78,
            ELIBACC: 79,
            ELIBBAD: 80,
            ELIBSCN: 81,
            ELIBMAX: 82,
            ELIBEXEC: 83,
            ENOSYS: 38,
            ENOTEMPTY: 39,
            ENAMETOOLONG: 36,
            ELOOP: 40,
            EOPNOTSUPP: 95,
            EPFNOSUPPORT: 96,
            ECONNRESET: 104,
            ENOBUFS: 105,
            EAFNOSUPPORT: 97,
            EPROTOTYPE: 91,
            ENOTSOCK: 88,
            ENOPROTOOPT: 92,
            ESHUTDOWN: 108,
            ECONNREFUSED: 111,
            EADDRINUSE: 98,
            ECONNABORTED: 103,
            ENETUNREACH: 101,
            ENETDOWN: 100,
            ETIMEDOUT: 110,
            EHOSTDOWN: 112,
            EHOSTUNREACH: 113,
            EINPROGRESS: 115,
            EALREADY: 114,
            EDESTADDRREQ: 89,
            EMSGSIZE: 90,
            EPROTONOSUPPORT: 93,
            ESOCKTNOSUPPORT: 94,
            EADDRNOTAVAIL: 99,
            ENETRESET: 102,
            EISCONN: 106,
            ENOTCONN: 107,
            ETOOMANYREFS: 109,
            EUSERS: 87,
            EDQUOT: 122,
            ESTALE: 116,
            ENOTSUP: 95,
            ENOMEDIUM: 123,
            EILSEQ: 84,
            EOVERFLOW: 75,
            ECANCELED: 125,
            ENOTRECOVERABLE: 131,
            EOWNERDEAD: 130,
            ESTRPIPE: 86
        };

        function ___setErrNo(value) {
            if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
            return value
        }

        function ___map_file(pathname, size) {
            ___setErrNo(ERRNO_CODES.EPERM);
            return -1
        }
        var ERRNO_MESSAGES = {
            0: "Success",
            1: "Not super-user",
            2: "No such file or directory",
            3: "No such process",
            4: "Interrupted system call",
            5: "I/O error",
            6: "No such device or address",
            7: "Arg list too long",
            8: "Exec format error",
            9: "Bad file number",
            10: "No children",
            11: "No more processes",
            12: "Not enough core",
            13: "Permission denied",
            14: "Bad address",
            15: "Block device required",
            16: "Mount device busy",
            17: "File exists",
            18: "Cross-device link",
            19: "No such device",
            20: "Not a directory",
            21: "Is a directory",
            22: "Invalid argument",
            23: "Too many open files in system",
            24: "Too many open files",
            25: "Not a typewriter",
            26: "Text file busy",
            27: "File too large",
            28: "No space left on device",
            29: "Illegal seek",
            30: "Read only file system",
            31: "Too many links",
            32: "Broken pipe",
            33: "Math arg out of domain of func",
            34: "Math result not representable",
            35: "File locking deadlock error",
            36: "File or path name too long",
            37: "No record locks available",
            38: "Function not implemented",
            39: "Directory not empty",
            40: "Too many symbolic links",
            42: "No message of desired type",
            43: "Identifier removed",
            44: "Channel number out of range",
            45: "Level 2 not synchronized",
            46: "Level 3 halted",
            47: "Level 3 reset",
            48: "Link number out of range",
            49: "Protocol driver not attached",
            50: "No CSI structure available",
            51: "Level 2 halted",
            52: "Invalid exchange",
            53: "Invalid request descriptor",
            54: "Exchange full",
            55: "No anode",
            56: "Invalid request code",
            57: "Invalid slot",
            59: "Bad font file fmt",
            60: "Device not a stream",
            61: "No data (for no delay io)",
            62: "Timer expired",
            63: "Out of streams resources",
            64: "Machine is not on the network",
            65: "Package not installed",
            66: "The object is remote",
            67: "The link has been severed",
            68: "Advertise error",
            69: "Srmount error",
            70: "Communication error on send",
            71: "Protocol error",
            72: "Multihop attempted",
            73: "Cross mount point (not really error)",
            74: "Trying to read unreadable message",
            75: "Value too large for defined data type",
            76: "Given log. name not unique",
            77: "f.d. invalid for this operation",
            78: "Remote address changed",
            79: "Can   access a needed shared lib",
            80: "Accessing a corrupted shared lib",
            81: ".lib section in a.out corrupted",
            82: "Attempting to link in too many libs",
            83: "Attempting to exec a shared library",
            84: "Illegal byte sequence",
            86: "Streams pipe error",
            87: "Too many users",
            88: "Socket operation on non-socket",
            89: "Destination address required",
            90: "Message too long",
            91: "Protocol wrong type for socket",
            92: "Protocol not available",
            93: "Unknown protocol",
            94: "Socket type not supported",
            95: "Not supported",
            96: "Protocol family not supported",
            97: "Address family not supported by protocol family",
            98: "Address already in use",
            99: "Address not available",
            100: "Network interface is not configured",
            101: "Network is unreachable",
            102: "Connection reset by network",
            103: "Connection aborted",
            104: "Connection reset by peer",
            105: "No buffer space available",
            106: "Socket is already connected",
            107: "Socket is not connected",
            108: "Can't send after socket shutdown",
            109: "Too many references",
            110: "Connection timed out",
            111: "Connection refused",
            112: "Host is down",
            113: "Host is unreachable",
            114: "Socket already connected",
            115: "Connection already in progress",
            116: "Stale file handle",
            122: "Quota exceeded",
            123: "No medium (in tape drive)",
            125: "Operation canceled",
            130: "Previous owner died",
            131: "State not recoverable"
        };
        var PATH = {
            splitPath: (function(filename) {
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1)
            }),
            normalizeArray: (function(parts, allowAboveRoot) {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                        parts.splice(i, 1)
                    } else if (last === "..") {
                        parts.splice(i, 1);
                        up++
                    } else if (up) {
                        parts.splice(i, 1);
                        up--
                    }
                }
                if (allowAboveRoot) {
                    for (; up; up--) {
                        parts.unshift("..")
                    }
                }
                return parts
            }),
            normalize: (function(path) {
                var isAbsolute = path.charAt(0) === "/",
                    trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(path.split("/").filter((function(p) {
                    return !!p
                })), !isAbsolute).join("/");
                if (!path && !isAbsolute) {
                    path = "."
                }
                if (path && trailingSlash) {
                    path += "/"
                }
                return (isAbsolute ? "/" : "") + path
            }),
            dirname: (function(path) {
                var result = PATH.splitPath(path),
                    root = result[0],
                    dir = result[1];
                if (!root && !dir) {
                    return "."
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1)
                }
                return root + dir
            }),
            basename: (function(path) {
                if (path === "/") return "/";
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1)
            }),
            extname: (function(path) {
                return PATH.splitPath(path)[3]
            }),
            join: (function() {
                var paths = Array.prototype.slice.call(arguments, 0);
                return PATH.normalize(paths.join("/"))
            }),
            join2: (function(l, r) {
                return PATH.normalize(l + "/" + r)
            }),
            resolve: (function() {
                var resolvedPath = "",
                    resolvedAbsolute = false;
                for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path !== "string") {
                        throw new TypeError("Arguments to path.resolve must be strings")
                    } else if (!path) {
                        return ""
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = path.charAt(0) === "/"
                }
                resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function(p) {
                    return !!p
                })), !resolvedAbsolute).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
            }),
            relative: (function(from, to) {
                from = PATH.resolve(from).substr(1);
                to = PATH.resolve(to).substr(1);

                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== "") break
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== "") break
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1)
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..")
                }
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/")
            })
        };
        var TTY = {
            ttys: [],
            init: (function() {}),
            shutdown: (function() {}),
            register: (function(dev, ops) {
                TTY.ttys[dev] = {
                    input: [],
                    output: [],
                    ops: ops
                };
                FS.registerDevice(dev, TTY.stream_ops)
            }),
            stream_ops: {
                open: (function(stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    stream.tty = tty;
                    stream.seekable = false
                }),
                close: (function(stream) {
                    stream.tty.ops.flush(stream.tty)
                }),
                flush: (function(stream) {
                    stream.tty.ops.flush(stream.tty)
                }),
                read: (function(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty)
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now()
                    }
                    return bytesRead
                }),
                write: (function(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    for (var i = 0; i < length; i++) {
                        try {
                            stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                    }
                    if (length) {
                        stream.node.timestamp = Date.now()
                    }
                    return i
                })
            },
            default_tty_ops: {
                get_char: (function(tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            var BUFSIZE = 256;
                            var buf = new Buffer(BUFSIZE);
                            var bytesRead = 0;
                            var isPosixPlatform = process.platform != "win32";
                            var fd = process.stdin.fd;
                            if (isPosixPlatform) {
                                var usingDevice = false;
                                try {
                                    fd = fs.openSync("/dev/stdin", "r");
                                    usingDevice = true
                                } catch (e) {}
                            }
                            try {
                                bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null)
                            } catch (e) {
                                if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                                else throw e
                            }
                            if (usingDevice) {
                                fs.closeSync(fd)
                            }
                            if (bytesRead > 0) {
                                result = buf.slice(0, bytesRead).toString("utf-8")
                            } else {
                                result = null
                            }
                        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                            result = window.prompt("Input: ");
                            if (result !== null) {
                                result += "\n"
                            }
                        } else if (typeof readline == "function") {
                            result = readline();
                            if (result !== null) {
                                result += "\n"
                            }
                        }
                        if (!result) {
                            return null
                        }
                        tty.input = intArrayFromString(result, true)
                    }
                    return tty.input.shift()
                }),
                put_char: (function(tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = []
                    } else {
                        if (val != 0) tty.output.push(val)
                    }
                }),
                flush: (function(tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = []
                    }
                })
            },
            default_tty1_ops: {
                put_char: (function(tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = []
                    } else {
                        if (val != 0) tty.output.push(val)
                    }
                }),
                flush: (function(tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = []
                    }
                })
            }
        };
        var MEMFS = {
            ops_table: null,
            mount: (function(mount) {
                return MEMFS.createNode(null, "/", 16384 | 511, 0)
            }),
            createNode: (function(parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek
                            }
                        },
                        file: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap,
                                msync: MEMFS.stream_ops.msync
                            }
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink
                            },
                            stream: {}
                        },
                        chrdev: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: FS.chrdev_stream_ops
                        }
                    }
                }
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {}
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node
                }
                return node
            }),
            getFileDataAsRegularArray: (function(node) {
                if (node.contents && node.contents.subarray) {
                    var arr = [];
                    for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
                    return arr
                }
                return node.contents
            }),
            getFileDataAsTypedArray: (function(node) {
                if (!node.contents) return new Uint8Array;
                if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents)
            }),
            expandFileStorage: (function(node, newCapacity) {
                if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
                    node.contents = MEMFS.getFileDataAsRegularArray(node);
                    node.usedBytes = node.contents.length
                }
                if (!node.contents || node.contents.subarray) {
                    var prevCapacity = node.contents ? node.contents.length : 0;
                    if (prevCapacity >= newCapacity) return;
                    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                    newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
                    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newCapacity);
                    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
                    return
                }
                if (!node.contents && newCapacity > 0) node.contents = [];
                while (node.contents.length < newCapacity) node.contents.push(0)
            }),
            resizeFileStorage: (function(node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                    return
                }
                if (!node.contents || node.contents.subarray) {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(new ArrayBuffer(newSize));
                    if (oldContents) {
                        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
                    }
                    node.usedBytes = newSize;
                    return
                }
                if (!node.contents) node.contents = [];
                if (node.contents.length > newSize) node.contents.length = newSize;
                else
                    while (node.contents.length < newSize) node.contents.push(0);
                node.usedBytes = newSize
            }),
            node_ops: {
                getattr: (function(node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length
                    } else {
                        attr.size = 0
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr
                }),
                setattr: (function(node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size)
                    }
                }),
                lookup: (function(parent, name) {
                    throw FS.genericErrors[ERRNO_CODES.ENOENT]
                }),
                mknod: (function(parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev)
                }),
                rename: (function(old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name)
                        } catch (e) {}
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    old_node.parent = new_dir
                }),
                unlink: (function(parent, name) {
                    delete parent.contents[name]
                }),
                rmdir: (function(parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                    }
                    delete parent.contents[name]
                }),
                readdir: (function(node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue
                        }
                        entries.push(key)
                    }
                    return entries
                }),
                symlink: (function(parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node
                }),
                readlink: (function(node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return node.link
                })
            },
            stream_ops: {
                read: (function(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    assert(size >= 0);
                    if (size > 8 && contents.subarray) {
                        buffer.set(contents.subarray(position, position + size), offset)
                    } else {
                        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
                    }
                    return size
                }),
                write: (function(stream, buffer, offset, length, position, canOwn) {
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                            node.usedBytes = length;
                            return length
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
                    else {
                        for (var i = 0; i < length; i++) {
                            node.contents[position + i] = buffer[offset + i]
                        }
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length
                }),
                llseek: (function(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return position
                }),
                allocate: (function(stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
                }),
                mmap: (function(stream, buffer, offset, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                        allocated = false;
                        ptr = contents.byteOffset
                    } else {
                        if (position > 0 || position + length < stream.node.usedBytes) {
                            if (contents.subarray) {
                                contents = contents.subarray(position, position + length)
                            } else {
                                contents = Array.prototype.slice.call(contents, position, position + length)
                            }
                        }
                        allocated = true;
                        ptr = _malloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
                        }
                        buffer.set(contents, ptr)
                    }
                    return {
                        ptr: ptr,
                        allocated: allocated
                    }
                }),
                msync: (function(stream, buffer, offset, length, mmapFlags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    if (mmapFlags & 2) {
                        return 0
                    }
                    var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    return 0
                })
            }
        };
        var IDBFS = {
            dbs: {},
            indexedDB: (function() {
                if (typeof indexedDB !== "undefined") return indexedDB;
                var ret = null;
                if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                assert(ret, "IDBFS used, but indexedDB not supported");
                return ret
            }),
            DB_VERSION: 21,
            DB_STORE_NAME: "FILE_DATA",
            mount: (function(mount) {
                return MEMFS.mount.apply(null, arguments)
            }),
            syncfs: (function(mount, populate, callback) {
                IDBFS.getLocalSet(mount, (function(err, local) {
                    if (err) return callback(err);
                    IDBFS.getRemoteSet(mount, (function(err, remote) {
                        if (err) return callback(err);
                        var src = populate ? remote : local;
                        var dst = populate ? local : remote;
                        IDBFS.reconcile(src, dst, callback)
                    }))
                }))
            }),
            getDB: (function(name, callback) {
                var db = IDBFS.dbs[name];
                if (db) {
                    return callback(null, db)
                }
                var req;
                try {
                    req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
                } catch (e) {
                    return callback(e)
                }
                if (!req) {
                    return callback("Unable to connect to IndexedDB")
                }
                req.onupgradeneeded = (function(e) {
                    var db = e.target.result;
                    var transaction = e.target.transaction;
                    var fileStore;
                    if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
                    } else {
                        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
                    }
                    if (!fileStore.indexNames.contains("timestamp")) {
                        fileStore.createIndex("timestamp", "timestamp", {
                            unique: false
                        })
                    }
                });
                req.onsuccess = (function() {
                    db = req.result;
                    IDBFS.dbs[name] = db;
                    callback(null, db)
                });
                req.onerror = (function(e) {
                    callback(this.error);
                    e.preventDefault()
                })
            }),
            getLocalSet: (function(mount, callback) {
                var entries = {};

                function isRealDir(p) {
                    return p !== "." && p !== ".."
                }

                function toAbsolute(root) {
                    return (function(p) {
                        return PATH.join2(root, p)
                    })
                }
                var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
                while (check.length) {
                    var path = check.pop();
                    var stat;
                    try {
                        stat = FS.stat(path)
                    } catch (e) {
                        return callback(e)
                    }
                    if (FS.isDir(stat.mode)) {
                        check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
                    }
                    entries[path] = {
                        timestamp: stat.mtime
                    }
                }
                return callback(null, {
                    type: "local",
                    entries: entries
                })
            }),
            getRemoteSet: (function(mount, callback) {
                var entries = {};
                IDBFS.getDB(mount.mountpoint, (function(err, db) {
                    if (err) return callback(err);
                    try {
                        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                        transaction.onerror = (function(e) {
                            callback(this.error);
                            e.preventDefault()
                        });
                        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                        var index = store.index("timestamp");
                        index.openKeyCursor().onsuccess = (function(event) {
                            var cursor = event.target.result;
                            if (!cursor) {
                                return callback(null, {
                                    type: "remote",
                                    db: db,
                                    entries: entries
                                })
                            }
                            entries[cursor.primaryKey] = {
                                timestamp: cursor.key
                            };
                            cursor.continue()
                        })
                    } catch (e) {
                        return callback(e)
                    }
                }))
            }),
            loadLocalEntry: (function(path, callback) {
                var stat, node;
                try {
                    var lookup = FS.lookupPath(path);
                    node = lookup.node;
                    stat = FS.stat(path)
                } catch (e) {
                    return callback(e)
                }
                if (FS.isDir(stat.mode)) {
                    return callback(null, {
                        timestamp: stat.mtime,
                        mode: stat.mode
                    })
                } else if (FS.isFile(stat.mode)) {
                    node.contents = MEMFS.getFileDataAsTypedArray(node);
                    return callback(null, {
                        timestamp: stat.mtime,
                        mode: stat.mode,
                        contents: node.contents
                    })
                } else {
                    return callback(new Error("node type not supported"))
                }
            }),
            storeLocalEntry: (function(path, entry, callback) {
                try {
                    if (FS.isDir(entry.mode)) {
                        FS.mkdir(path, entry.mode)
                    } else if (FS.isFile(entry.mode)) {
                        FS.writeFile(path, entry.contents, {
                            canOwn: true
                        })
                    } else {
                        return callback(new Error("node type not supported"))
                    }
                    FS.chmod(path, entry.mode);
                    FS.utime(path, entry.timestamp, entry.timestamp)
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }),
            removeLocalEntry: (function(path, callback) {
                try {
                    var lookup = FS.lookupPath(path);
                    var stat = FS.stat(path);
                    if (FS.isDir(stat.mode)) {
                        FS.rmdir(path)
                    } else if (FS.isFile(stat.mode)) {
                        FS.unlink(path)
                    }
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }),
            loadRemoteEntry: (function(store, path, callback) {
                var req = store.get(path);
                req.onsuccess = (function(event) {
                    callback(null, event.target.result)
                });
                req.onerror = (function(e) {
                    callback(this.error);
                    e.preventDefault()
                })
            }),
            storeRemoteEntry: (function(store, path, entry, callback) {
                var req = store.put(entry, path);
                req.onsuccess = (function() {
                    callback(null)
                });
                req.onerror = (function(e) {
                    callback(this.error);
                    e.preventDefault()
                })
            }),
            removeRemoteEntry: (function(store, path, callback) {
                var req = store.delete(path);
                req.onsuccess = (function() {
                    callback(null)
                });
                req.onerror = (function(e) {
                    callback(this.error);
                    e.preventDefault()
                })
            }),
            reconcile: (function(src, dst, callback) {
                var total = 0;
                var create = [];
                Object.keys(src.entries).forEach((function(key) {
                    var e = src.entries[key];
                    var e2 = dst.entries[key];
                    if (!e2 || e.timestamp > e2.timestamp) {
                        create.push(key);
                        total++
                    }
                }));
                var remove = [];
                Object.keys(dst.entries).forEach((function(key) {
                    var e = dst.entries[key];
                    var e2 = src.entries[key];
                    if (!e2) {
                        remove.push(key);
                        total++
                    }
                }));
                if (!total) {
                    return callback(null)
                }
                var completed = 0;
                var db = src.type === "remote" ? src.db : dst.db;
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return callback(err)
                        }
                        return
                    }
                    if (++completed >= total) {
                        return callback(null)
                    }
                }
                transaction.onerror = (function(e) {
                    done(this.error);
                    e.preventDefault()
                });
                create.sort().forEach((function(path) {
                    if (dst.type === "local") {
                        IDBFS.loadRemoteEntry(store, path, (function(err, entry) {
                            if (err) return done(err);
                            IDBFS.storeLocalEntry(path, entry, done)
                        }))
                    } else {
                        IDBFS.loadLocalEntry(path, (function(err, entry) {
                            if (err) return done(err);
                            IDBFS.storeRemoteEntry(store, path, entry, done)
                        }))
                    }
                }));
                remove.sort().reverse().forEach((function(path) {
                    if (dst.type === "local") {
                        IDBFS.removeLocalEntry(path, done)
                    } else {
                        IDBFS.removeRemoteEntry(store, path, done)
                    }
                }))
            })
        };
        var NODEFS = {
            isWindows: false,
            staticInit: (function() {
                NODEFS.isWindows = !!process.platform.match(/^win/);
                var flags = process["binding"]("constants");
                if (flags["fs"]) {
                    flags = flags["fs"]
                }
                NODEFS.flagsForNodeMap = {
                    "1024": flags["O_APPEND"],
                    "64": flags["O_CREAT"],
                    "128": flags["O_EXCL"],
                    "0": flags["O_RDONLY"],
                    "2": flags["O_RDWR"],
                    "4096": flags["O_SYNC"],
                    "512": flags["O_TRUNC"],
                    "1": flags["O_WRONLY"]
                }
            }),
            bufferFrom: (function(arrayBuffer) {
                return Buffer.alloc ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer)
            }),
            mount: (function(mount) {
                assert(ENVIRONMENT_IS_NODE);
                return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
            }),
            createNode: (function(parent, name, mode, dev) {
                if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = FS.createNode(parent, name, mode);
                node.node_ops = NODEFS.node_ops;
                node.stream_ops = NODEFS.stream_ops;
                return node
            }),
            getMode: (function(path) {
                var stat;
                try {
                    stat = fs.lstatSync(path);
                    if (NODEFS.isWindows) {
                        stat.mode = stat.mode | (stat.mode & 292) >> 2
                    }
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                return stat.mode
            }),
            realPath: (function(node) {
                var parts = [];
                while (node.parent !== node) {
                    parts.push(node.name);
                    node = node.parent
                }
                parts.push(node.mount.opts.root);
                parts.reverse();
                return PATH.join.apply(null, parts)
            }),
            flagsForNode: (function(flags) {
                flags &= ~2097152;
                flags &= ~2048;
                flags &= ~32768;
                flags &= ~524288;
                var newFlags = 0;
                for (var k in NODEFS.flagsForNodeMap) {
                    if (flags & k) {
                        newFlags |= NODEFS.flagsForNodeMap[k];
                        flags ^= k
                    }
                }
                if (!flags) {
                    return newFlags
                } else {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
            }),
            node_ops: {
                getattr: (function(node) {
                    var path = NODEFS.realPath(node);
                    var stat;
                    try {
                        stat = fs.lstatSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    if (NODEFS.isWindows && !stat.blksize) {
                        stat.blksize = 4096
                    }
                    if (NODEFS.isWindows && !stat.blocks) {
                        stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
                    }
                    return {
                        dev: stat.dev,
                        ino: stat.ino,
                        mode: stat.mode,
                        nlink: stat.nlink,
                        uid: stat.uid,
                        gid: stat.gid,
                        rdev: stat.rdev,
                        size: stat.size,
                        atime: stat.atime,
                        mtime: stat.mtime,
                        ctime: stat.ctime,
                        blksize: stat.blksize,
                        blocks: stat.blocks
                    }
                }),
                setattr: (function(node, attr) {
                    var path = NODEFS.realPath(node);
                    try {
                        if (attr.mode !== undefined) {
                            fs.chmodSync(path, attr.mode);
                            node.mode = attr.mode
                        }
                        if (attr.timestamp !== undefined) {
                            var date = new Date(attr.timestamp);
                            fs.utimesSync(path, date, date)
                        }
                        if (attr.size !== undefined) {
                            fs.truncateSync(path, attr.size)
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                lookup: (function(parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    var mode = NODEFS.getMode(path);
                    return NODEFS.createNode(parent, name, mode)
                }),
                mknod: (function(parent, name, mode, dev) {
                    var node = NODEFS.createNode(parent, name, mode, dev);
                    var path = NODEFS.realPath(node);
                    try {
                        if (FS.isDir(node.mode)) {
                            fs.mkdirSync(path, node.mode)
                        } else {
                            fs.writeFileSync(path, "", {
                                mode: node.mode
                            })
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    return node
                }),
                rename: (function(oldNode, newDir, newName) {
                    var oldPath = NODEFS.realPath(oldNode);
                    var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
                    try {
                        fs.renameSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                unlink: (function(parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.unlinkSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                rmdir: (function(parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.rmdirSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                readdir: (function(node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readdirSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                symlink: (function(parent, newName, oldPath) {
                    var newPath = PATH.join2(NODEFS.realPath(parent), newName);
                    try {
                        fs.symlinkSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                readlink: (function(node) {
                    var path = NODEFS.realPath(node);
                    try {
                        path = fs.readlinkSync(path);
                        path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
                        return path
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                })
            },
            stream_ops: {
                open: (function(stream) {
                    var path = NODEFS.realPath(stream.node);
                    try {
                        if (FS.isFile(stream.node.mode)) {
                            stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags))
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                close: (function(stream) {
                    try {
                        if (FS.isFile(stream.node.mode) && stream.nfd) {
                            fs.closeSync(stream.nfd)
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                read: (function(stream, buffer, offset, length, position) {
                    if (length === 0) return 0;
                    try {
                        return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                write: (function(stream, buffer, offset, length, position) {
                    try {
                        return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }),
                llseek: (function(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            try {
                                var stat = fs.fstatSync(stream.nfd);
                                position += stat.size
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES[e.code])
                            }
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return position
                })
            }
        };
        var WORKERFS = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            reader: null,
            mount: (function(mount) {
                assert(ENVIRONMENT_IS_WORKER);
                if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
                var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
                var createdParents = {};

                function ensureParent(path) {
                    var parts = path.split("/");
                    var parent = root;
                    for (var i = 0; i < parts.length - 1; i++) {
                        var curr = parts.slice(0, i + 1).join("/");
                        if (!createdParents[curr]) {
                            createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0)
                        }
                        parent = createdParents[curr]
                    }
                    return parent
                }

                function base(path) {
                    var parts = path.split("/");
                    return parts[parts.length - 1]
                }
                Array.prototype.forEach.call(mount.opts["files"] || [], (function(file) {
                    WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate)
                }));
                (mount.opts["blobs"] || []).forEach((function(obj) {
                    WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"])
                }));
                (mount.opts["packages"] || []).forEach((function(pack) {
                    pack["metadata"].files.forEach((function(file) {
                        var name = file.filename.substr(1);
                        WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end))
                    }))
                }));
                return root
            }),
            createNode: (function(parent, name, mode, dev, contents, mtime) {
                var node = FS.createNode(parent, name, mode);
                node.mode = mode;
                node.node_ops = WORKERFS.node_ops;
                node.stream_ops = WORKERFS.stream_ops;
                node.timestamp = (mtime || new Date).getTime();
                assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
                if (mode === WORKERFS.FILE_MODE) {
                    node.size = contents.size;
                    node.contents = contents
                } else {
                    node.size = 4096;
                    node.contents = {}
                }
                if (parent) {
                    parent.contents[name] = node
                }
                return node
            }),
            node_ops: {
                getattr: (function(node) {
                    return {
                        dev: 1,
                        ino: undefined,
                        mode: node.mode,
                        nlink: 1,
                        uid: 0,
                        gid: 0,
                        rdev: undefined,
                        size: node.size,
                        atime: new Date(node.timestamp),
                        mtime: new Date(node.timestamp),
                        ctime: new Date(node.timestamp),
                        blksize: 4096,
                        blocks: Math.ceil(node.size / 4096)
                    }
                }),
                setattr: (function(node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp
                    }
                }),
                lookup: (function(parent, name) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }),
                mknod: (function(parent, name, mode, dev) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }),
                rename: (function(oldNode, newDir, newName) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }),
                unlink: (function(parent, name) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }),
                rmdir: (function(parent, name) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }),
                readdir: (function(node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue
                        }
                        entries.push(key)
                    }
                    return entries
                }),
                symlink: (function(parent, newName, oldPath) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }),
                readlink: (function(node) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                })
            },
            stream_ops: {
                read: (function(stream, buffer, offset, length, position) {
                    if (position >= stream.node.size) return 0;
                    var chunk = stream.node.contents.slice(position, position + length);
                    var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
                    buffer.set(new Uint8Array(ab), offset);
                    return chunk.size
                }),
                write: (function(stream, buffer, offset, length, position) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }),
                llseek: (function(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.size
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return position
                })
            }
        };
        STATICTOP += 16;
        STATICTOP += 16;
        STATICTOP += 16;
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            trackingDelegate: {},
            tracking: {
                openFlags: {
                    READ: 1,
                    WRITE: 2
                }
            },
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            handleFSError: (function(e) {
                if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
                return ___setErrNo(e.errno)
            }),
            lookupPath: (function(path, opts) {
                path = PATH.resolve(FS.cwd(), path);
                opts = opts || {};
                if (!path) return {
                    path: "",
                    node: null
                };
                var defaults = {
                    follow_mount: true,
                    recurse_count: 0
                };
                for (var key in defaults) {
                    if (opts[key] === undefined) {
                        opts[key] = defaults[key]
                    }
                }
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                }
                var parts = PATH.normalizeArray(path.split("/").filter((function(p) {
                    return !!p
                })), false);
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) {
                            current = current.mounted.root
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {
                                recurse_count: opts.recurse_count
                            });
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                            }
                        }
                    }
                }
                return {
                    path: current_path,
                    node: current
                }
            }),
            getPath: (function(node) {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
                    }
                    path = path ? node.name + "/" + path : node.name;
                    node = node.parent
                }
            }),
            hashName: (function(parentid, name) {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = (hash << 5) - hash + name.charCodeAt(i) | 0
                }
                return (parentid + hash >>> 0) % FS.nameTable.length
            }),
            hashAddNode: (function(node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node
            }),
            hashRemoveNode: (function(node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break
                        }
                        current = current.name_next
                    }
                }
            }),
            lookupNode: (function(parent, name) {
                var err = FS.mayLookup(parent);
                if (err) {
                    throw new FS.ErrnoError(err, parent)
                }
                var hash = FS.hashName(parent.id, name);
                for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node
                    }
                }
                return FS.lookup(parent, name)
            }),
            createNode: (function(parent, name, mode, rdev) {
                if (!FS.FSNode) {
                    FS.FSNode = (function(parent, name, mode, rdev) {
                        if (!parent) {
                            parent = this
                        }
                        this.parent = parent;
                        this.mount = parent.mount;
                        this.mounted = null;
                        this.id = FS.nextInode++;
                        this.name = name;
                        this.mode = mode;
                        this.node_ops = {};
                        this.stream_ops = {};
                        this.rdev = rdev
                    });
                    FS.FSNode.prototype = {};
                    var readMode = 292 | 73;
                    var writeMode = 146;
                    Object.defineProperties(FS.FSNode.prototype, {
                        read: {
                            get: (function() {
                                return (this.mode & readMode) === readMode
                            }),
                            set: (function(val) {
                                val ? this.mode |= readMode : this.mode &= ~readMode
                            })
                        },
                        write: {
                            get: (function() {
                                return (this.mode & writeMode) === writeMode
                            }),
                            set: (function(val) {
                                val ? this.mode |= writeMode : this.mode &= ~writeMode
                            })
                        },
                        isFolder: {
                            get: (function() {
                                return FS.isDir(this.mode)
                            })
                        },
                        isDevice: {
                            get: (function() {
                                return FS.isChrdev(this.mode)
                            })
                        }
                    })
                }
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node
            }),
            destroyNode: (function(node) {
                FS.hashRemoveNode(node)
            }),
            isRoot: (function(node) {
                return node === node.parent
            }),
            isMountpoint: (function(node) {
                return !!node.mounted
            }),
            isFile: (function(mode) {
                return (mode & 61440) === 32768
            }),
            isDir: (function(mode) {
                return (mode & 61440) === 16384
            }),
            isLink: (function(mode) {
                return (mode & 61440) === 40960
            }),
            isChrdev: (function(mode) {
                return (mode & 61440) === 8192
            }),
            isBlkdev: (function(mode) {
                return (mode & 61440) === 24576
            }),
            isFIFO: (function(mode) {
                return (mode & 61440) === 4096
            }),
            isSocket: (function(mode) {
                return (mode & 49152) === 49152
            }),
            flagModes: {
                "r": 0,
                "rs": 1052672,
                "r+": 2,
                "w": 577,
                "wx": 705,
                "xw": 705,
                "w+": 578,
                "wx+": 706,
                "xw+": 706,
                "a": 1089,
                "ax": 1217,
                "xa": 1217,
                "a+": 1090,
                "ax+": 1218,
                "xa+": 1218
            },
            modeStringToFlags: (function(str) {
                var flags = FS.flagModes[str];
                if (typeof flags === "undefined") {
                    throw new Error("Unknown file open mode: " + str)
                }
                return flags
            }),
            flagsToPermissionString: (function(flag) {
                var perms = ["r", "w", "rw"][flag & 3];
                if (flag & 512) {
                    perms += "w"
                }
                return perms
            }),
            nodePermissions: (function(node, perms) {
                if (FS.ignorePermissions) {
                    return 0
                }
                if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
                    return ERRNO_CODES.EACCES
                }
                return 0
            }),
            mayLookup: (function(dir) {
                var err = FS.nodePermissions(dir, "x");
                if (err) return err;
                if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
                return 0
            }),
            mayCreate: (function(dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return ERRNO_CODES.EEXIST
                } catch (e) {}
                return FS.nodePermissions(dir, "wx")
            }),
            mayDelete: (function(dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name)
                } catch (e) {
                    return e.errno
                }
                var err = FS.nodePermissions(dir, "wx");
                if (err) {
                    return err
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return ERRNO_CODES.ENOTDIR
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return ERRNO_CODES.EBUSY
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return 0
            }),
            mayOpen: (function(node, flags) {
                if (!node) {
                    return ERRNO_CODES.ENOENT
                }
                if (FS.isLink(node.mode)) {
                    return ERRNO_CODES.ELOOP
                } else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
            }),
            MAX_OPEN_FDS: 4096,
            nextfd: (function(fd_start, fd_end) {
                fd_start = fd_start || 0;
                fd_end = fd_end || FS.MAX_OPEN_FDS;
                for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                        return fd
                    }
                }
                throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
            }),
            getStream: (function(fd) {
                return FS.streams[fd]
            }),
            createStream: (function(stream, fd_start, fd_end) {
                if (!FS.FSStream) {
                    FS.FSStream = (function() {});
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: (function() {
                                return this.node
                            }),
                            set: (function(val) {
                                this.node = val
                            })
                        },
                        isRead: {
                            get: (function() {
                                return (this.flags & 2097155) !== 1
                            })
                        },
                        isWrite: {
                            get: (function() {
                                return (this.flags & 2097155) !== 0
                            })
                        },
                        isAppend: {
                            get: (function() {
                                return this.flags & 1024
                            })
                        }
                    })
                }
                var newStream = new FS.FSStream;
                for (var p in stream) {
                    newStream[p] = stream[p]
                }
                stream = newStream;
                var fd = FS.nextfd(fd_start, fd_end);
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream
            }),
            closeStream: (function(fd) {
                FS.streams[fd] = null
            }),
            chrdev_stream_ops: {
                open: (function(stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                        stream.stream_ops.open(stream)
                    }
                }),
                llseek: (function() {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                })
            },
            major: (function(dev) {
                return dev >> 8
            }),
            minor: (function(dev) {
                return dev & 255
            }),
            makedev: (function(ma, mi) {
                return ma << 8 | mi
            }),
            registerDevice: (function(dev, ops) {
                FS.devices[dev] = {
                    stream_ops: ops
                }
            }),
            getDevice: (function(dev) {
                return FS.devices[dev]
            }),
            getMounts: (function(mount) {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts)
                }
                return mounts
            }),
            syncfs: (function(populate, callback) {
                if (typeof populate === "function") {
                    callback = populate;
                    populate = false
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) {
                    console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;

                function doCallback(err) {
                    assert(FS.syncFSRequests > 0);
                    FS.syncFSRequests--;
                    return callback(err)
                }

                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(err)
                        }
                        return
                    }
                    if (++completed >= mounts.length) {
                        doCallback(null)
                    }
                }
                mounts.forEach((function(mount) {
                    if (!mount.type.syncfs) {
                        return done(null)
                    }
                    mount.type.syncfs(mount, populate, done)
                }))
            }),
            mount: (function(type, opts, mountpoint) {
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {
                        follow_mount: false
                    });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                    }
                }
                var mount = {
                    type: type,
                    opts: opts,
                    mountpoint: mountpoint,
                    mounts: []
                };
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount)
                    }
                }
                return mountRoot
            }),
            unmount: (function(mountpoint) {
                var lookup = FS.lookupPath(mountpoint, {
                    follow_mount: false
                });
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((function(hash) {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.indexOf(current.mount) !== -1) {
                            FS.destroyNode(current)
                        }
                        current = next
                    }
                }));
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                assert(idx !== -1);
                node.mount.mounts.splice(idx, 1)
            }),
            lookup: (function(parent, name) {
                return parent.node_ops.lookup(parent, name)
            }),
            mknod: (function(path, mode, dev) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === "." || name === "..") {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var err = FS.mayCreate(parent, name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.mknod(parent, name, mode, dev)
            }),
            create: (function(path, mode) {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0)
            }),
            mkdir: (function(path, mode) {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0)
            }),
            mkdirTree: (function(path, mode) {
                var dirs = path.split("/");
                var d = "";
                for (var i = 0; i < dirs.length; ++i) {
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                        FS.mkdir(d, mode)
                    } catch (e) {
                        if (e.errno != ERRNO_CODES.EEXIST) throw e
                    }
                }
            }),
            mkdev: (function(path, mode, dev) {
                if (typeof dev === "undefined") {
                    dev = mode;
                    mode = 438
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev)
            }),
            symlink: (function(oldpath, newpath) {
                if (!PATH.resolve(oldpath)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                var lookup = FS.lookupPath(newpath, {
                    parent: true
                });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                var newname = PATH.basename(newpath);
                var err = FS.mayCreate(parent, newname);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.symlink(parent, newname, oldpath)
            }),
            rename: (function(old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                try {
                    lookup = FS.lookupPath(old_path, {
                        parent: true
                    });
                    old_dir = lookup.node;
                    lookup = FS.lookupPath(new_path, {
                        parent: true
                    });
                    new_dir = lookup.node
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                relative = PATH.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (old_node === new_node) {
                    return
                }
                var isdir = FS.isDir(old_node.mode);
                var err = FS.mayDelete(old_dir, old_name, isdir);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (new_dir !== old_dir) {
                    err = FS.nodePermissions(old_dir, "w");
                    if (err) {
                        throw new FS.ErrnoError(err)
                    }
                }
                try {
                    if (FS.trackingDelegate["willMovePath"]) {
                        FS.trackingDelegate["willMovePath"](old_path, new_path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name)
                } catch (e) {
                    throw e
                } finally {
                    FS.hashAddNode(old_node)
                }
                try {
                    if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
            }),
            rmdir: (function(path) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, true);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readdir: (function(path) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                return node.node_ops.readdir(node)
            }),
            unlink: (function(path) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, false);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readlink: (function(path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
            }),
            stat: (function(path, dontFollow) {
                var lookup = FS.lookupPath(path, {
                    follow: !dontFollow
                });
                var node = lookup.node;
                if (!node) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return node.node_ops.getattr(node)
            }),
            lstat: (function(path) {
                return FS.stat(path, true)
            }),
            chmod: (function(path, mode, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {
                    mode: mode & 4095 | node.mode & ~4095,
                    timestamp: Date.now()
                })
            }),
            lchmod: (function(path, mode) {
                FS.chmod(path, mode, true)
            }),
            fchmod: (function(fd, mode) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chmod(stream.node, mode)
            }),
            chown: (function(path, uid, gid, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {
                    timestamp: Date.now()
                })
            }),
            lchown: (function(path, uid, gid) {
                FS.chown(path, uid, gid, true)
            }),
            fchown: (function(fd, uid, gid) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chown(stream.node, uid, gid)
            }),
            truncate: (function(path, len) {
                if (len < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: true
                    });
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var err = FS.nodePermissions(node, "w");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                node.node_ops.setattr(node, {
                    size: len,
                    timestamp: Date.now()
                })
            }),
            ftruncate: (function(fd, len) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                FS.truncate(stream.node, len)
            }),
            utime: (function(path, atime, mtime) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                node.node_ops.setattr(node, {
                    timestamp: Math.max(atime, mtime)
                })
            }),
            open: (function(path, flags, mode, fd_start, fd_end) {
                if (path === "") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
                mode = typeof mode === "undefined" ? 438 : mode;
                if (flags & 64) {
                    mode = mode & 4095 | 32768
                } else {
                    mode = 0
                }
                var node;
                if (typeof path === "object") {
                    node = path
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {
                            follow: !(flags & 131072)
                        });
                        node = lookup.node
                    } catch (e) {}
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                        }
                    } else {
                        node = FS.mknod(path, mode, 0);
                        created = true
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512
                }
                if (flags & 65536 && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                if (!created) {
                    var err = FS.mayOpen(node, flags);
                    if (err) {
                        throw new FS.ErrnoError(err)
                    }
                }
                if (flags & 512) {
                    FS.truncate(node, 0)
                }
                flags &= ~(128 | 512);
                var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false
                }, fd_start, fd_end);
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream)
                }
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                        err("read file: " + path)
                    }
                }
                try {
                    if (FS.trackingDelegate["onOpenFile"]) {
                        var trackingFlags = 0;
                        if ((flags & 2097155) !== 1) {
                            trackingFlags |= FS.tracking.openFlags.READ
                        }
                        if ((flags & 2097155) !== 0) {
                            trackingFlags |= FS.tracking.openFlags.WRITE
                        }
                        FS.trackingDelegate["onOpenFile"](path, trackingFlags)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
                }
                return stream
            }),
            close: (function(stream) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (stream.getdents) stream.getdents = null;
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream)
                    }
                } catch (e) {
                    throw e
                } finally {
                    FS.closeStream(stream.fd)
                }
                stream.fd = null
            }),
            isClosed: (function(stream) {
                return stream.fd === null
            }),
            llseek: (function(stream, offset, whence) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                stream.position = stream.stream_ops.llseek(stream, offset, whence);
                stream.ungotten = [];
                return stream.position
            }),
            read: (function(stream, buffer, offset, length, position) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var seeking = typeof position !== "undefined";
                if (!seeking) {
                    position = stream.position
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead
            }),
            write: (function(stream, buffer, offset, length, position, canOwn) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if (stream.flags & 1024) {
                    FS.llseek(stream, 0, 2)
                }
                var seeking = typeof position !== "undefined";
                if (!seeking) {
                    position = stream.position
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking) stream.position += bytesWritten;
                try {
                    if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
                }
                return bytesWritten
            }),
            allocate: (function(stream, offset, length) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
                }
                stream.stream_ops.allocate(stream, offset, length)
            }),
            mmap: (function(stream, buffer, offset, length, position, prot, flags) {
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EACCES)
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
            }),
            msync: (function(stream, buffer, offset, length, mmapFlags) {
                if (!stream || !stream.stream_ops.msync) {
                    return 0
                }
                return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
            }),
            munmap: (function(stream) {
                return 0
            }),
            ioctl: (function(stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
                }
                return stream.stream_ops.ioctl(stream, cmd, arg)
            }),
            readFile: (function(path, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "r";
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"')
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = UTF8ArrayToString(buf, 0)
                } else if (opts.encoding === "binary") {
                    ret = buf
                }
                FS.close(stream);
                return ret
            }),
            writeFile: (function(path, data, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "w";
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data === "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
                } else if (ArrayBuffer.isView(data)) {
                    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
                } else {
                    throw new Error("Unsupported data type")
                }
                FS.close(stream)
            }),
            cwd: (function() {
                return FS.currentPath
            }),
            chdir: (function(path) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                if (lookup.node === null) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                var err = FS.nodePermissions(lookup.node, "x");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                FS.currentPath = lookup.path
            }),
            createDefaultDirectories: (function() {
                FS.mkdir("/tmp");
                FS.mkdir("/home");
                FS.mkdir("/home/web_user")
            }),