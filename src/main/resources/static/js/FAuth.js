//require('./TN.js')();
! function (window, document, undefined) {
    var tn = {};
    tn.envConfig = {
        //开发环境配置
        dev: {
            domain : "tuniu-sst.org",//dev环境cookie存储的根域名
            fauthDomain: "http://public-api.fipued.rct.tuniu-sst.org/",//dev环境权限系统的地址
            fDomain:"tuniu.org"//生产环境根域名
        },
        //sst
        sst: {
            domain : "tuniu-sst.org",
            fauthDomain: "http://public-api.fipued.rct.tuniu-sst.org/",
            fDomain:"tuniu.org"
        },
        //sit
        sit: {
            domain : "blackfi.sh",
            fauthDomain: "http://public-api.fipued.inf.sit.blackfi.sh/",
            fDomain:"blackfi.sh"
        },
        //pre
        pre: {
            domain : "tuniu.org",
            fauthDomain: "http://public-api.fipued.rct.tuniu.org/",
            fDomain:"tuniu.org"
        },
        //prd
        prd: {
            domain : "tuniu.org",
            fauthDomain: "http://public-api.fipued.rct.tuniu.org/",
            fDomain:"tuniu.org"
        }

    };
    tn.config = tn.envConfig['sit'];


    var rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

    tn.uriTest = {
        scheme: /^([^:]+)\:.+$/,
        user: /^([^@\/]+)@.+$/,
        host: /^([^:\/\?\#]+).*$/,
        port: /^:(\d+)/,
        path: /^([^\?#]*)/,
        dirPath: /^(.*\/)[^\/]*$/,
        fragment: /^[^#]*#(.*)$/,
        absUri: /^\w(\w|\d|\+|\-|\.)*:/i
    }

    /**
     * 浏览器判断
     * @return
     * 		tn.browser.msie
     * 		tn.browser.mozilla
     * 		tn.browser.webkit
     * 		tn.browser.opera
     * 		tn.browser.version
     */
    tn.browser = {};

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();
        var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }

    var browserMatch = uaMatch(navigator.userAgent);
    if (browserMatch.browser) {
        tn.browser[browserMatch.browser] = true;
        tn.browser.version = browserMatch.version;
    }

    /**
     * 类型判断
     * public method :
     * 		tn.type.isArray()
     * 		tn.type.isBoolean()
     * 		tn.type.isFunction()
     * 		tn.type.isNull()
     * 		tn.type.isNumber()
     * 		tn.type.isObject()
     * 		tn.type.isString()
     * 		tn.type.isUndefined()
     * 		tn.type.isDefined()
     * 		tn.type.isNumeric()
     * 		tn.type.isDate()
     */
    tn.type = {
        isArray: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (Array.isArray && !Array.isArray(c) || !(tn.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Array") > -1 || c instanceof Array))) {
                    return false;
                }
            }
            return true;
        },
        isBoolean: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(typeof c === "boolean" || tn.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Boolean") > -1 || c instanceof Boolean))) {
                    return false;
                }
            }
            return true;
        },
        isFunction: function () {
            for (var b = 0, a = arguments.length; b < a; b++) {
                if (typeof arguments[b] !== "function") {
                    return false;
                }
            }
            return true;
        },
        isNull: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (c === null || tn.type.isUndefined(c)) {
                    return true;
                }
            }
            return false;
        },
        isNumber: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(typeof c === "number" || tn.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Number") > -1 || c instanceof Number)) || isNaN(c)) {
                    return false;
                }
            }
            return true;
        },
        isObject: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (typeof c != "object" || c === null) {
                    return false;
                }
            }
            return true;
        },
        isString: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(typeof c === "string" || tn.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("String") > -1 || c instanceof String))) {
                    return false;
                }
            }
            return true;
        },
        isUndefined: function () {
            for (var b = 0, a = arguments.length; b < a; b++) {
                if (typeof arguments[b] === "undefined") {
                    return true;
                }
            }
            return false;
        },
        isDefined: function () {
            for (var a = 0; a < arguments.length; a++) {
                if (tn.type.isUndefined(arguments[a])) {
                    return false;
                }
            }
            return true;
        },
        isNumeric: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(!isNaN(c) && isFinite(c) && (c !== null) && !tn.type.isBoolean(c) && !tn.type.isArray(c))) {
                    return false;
                }
            }
            return true;
        },
        isDate: function () {
            for (var b = 0, a = arguments.length; b < a; b++) {
                o = arguments[b];
                if (!(tn.type.isObject(o) && o.constructor && (o.constructor.toString().indexOf("Date") > -1 || o instanceof Date))) {
                    return false;
                }
            }
            return true;
        }
    };

    /**
     * JSON编解码
     * public method :
     * 		tn.json.encode(string)
     * 		tn.json.decode(object)
     */
    tn.json = new function () {
        var useHasOwn = !!{}.hasOwnProperty;
        var pad = function (n) {
            return n < 10 ? "0" + n : n;
        };
        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };
        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
        };
        var encodeArray = function (o) {
            var a = ["["],
                b, i, l = o.length,
                v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : tn.json.decode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };
        var encodeDate = function (o) {
            return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) +
                '"';
        };
        this.decode = function (o) {
            if (typeof o == "undefined" || o === null) {
                return "null";
            } else if (o instanceof Array) {
                return encodeArray(o);
            } else if (o instanceof Date) {
                return encodeDate(o);
            } else if (typeof o == "string") {
                return encodeString(o);
            } else if (typeof o == "number") {
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o == "boolean") {
                return String(o);
            } else {
                var a = ["{"],
                    b, i, v;
                for (i in o) {
                    if (!useHasOwn || o.hasOwnProperty(i)) {
                        v = o[i];
                        switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if (b) {
                                    a.push(',');
                                }
                                a.push(this.decode(i), ":",
                                    v === null ? "null" : this.decode(v));
                                b = true;
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }
        };
        this.encode = function (json) {
            var json = json ? json.replace(/\u2028/g, '').replace(/\u2029/g, '') : undefined;
            return eval("(" + json + ")");
        };
    };

    /**
     * Cookie设置
     * public method :
     * 		tn.cookie.get(key)
     * 		tn.cookie.set(key, value, days, path, domain, secure)
     */
    tn.cookie = new function () {
        this.set = function(b, e, i, g, c, f) {
            if (!c) {
                c = tn.config.domain;
            }
            if (!g) {
                g = "/";
            }
            var a = -1;
            if (tn.type.isNumber(i) && i >= 0) {
                var h = new Date();
                h.setTime(h.getTime() + (i * 86400000));
                a = h.toGMTString();
            } else {
                if (tn.type.isDate(i)) {
                    a = i.toGMTString();
                }
            }
            document.cookie = b + "=" + escape(e) + (a != -1 ? ";expires=" + a : "") + (g ? ";path=" + g : "") + (c ? "; domain=" + c : "") + (f ? "; secure" : "");
        };
        //isun=true,获取未解码的cookie
        this.get = function (a,isun) {
            return !(new RegExp(" " + a + "=([^;]*)").test(" " + document.cookie)) ?"":(isun?RegExp.$1:unescape(RegExp.$1));
        };
        this.clear = function (a) {
            this.set(a, "", -1);
        };
        this.TNClear = function (a) {
            this.set(a, "", 0);
        };
        this.isEnabled = function () {
            if (!tn.type.isBoolean(navigator.cookieEnabled)) {
                var b = "CookieAllowed",
                    a = "__BrowserForCookieSupport__";
                this.set(a, test, 90, null);
                navigator.cookieEnabled = (b == this.get(a));
                if (navigator.cookieEnabled) {
                    this.remove(a);
                }
            }
            return navigator.cookieEnabled;
        };
    };

    /**
     * GUID设置
     * public method :
     * 		tn.guid.guid()
     */
    tn.guid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var cache = {};

    /**
     * 简易模板
     * @param  {html} str html模板
     * @param  {object} data 绑定的数据
     * @return {object or function} 返回结果模板或者绑定数据方法
     */
    tn.tmpl = function tmpl(str, data) {
        var fn;
        if (!/\W/.test(str)) {
            cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML);
        } else {
            fn = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(
                    /((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") +
                "');}return p.join('');");
        }
        return data ? fn(data) : fn;
    };

    /**
     * 常用工具对象合并
     * @param  {object} obj 要合并的对象
     * @return {object}     合并后的对象
     */
    tn.util = {};
    tn.util.merge = function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n];
            }
        }
        return obj;
    };
    window.serverTransfer = false;
    tn.isLogin = false;
    tn.ajax = new function () {
        this.request = function (options) {
            //var nickname = tn.cookie.get("tnFinanceNameSpelling");
            var token = tn.cookie.get("tnFinanceSessionId");
            var workNum = tn.cookie.get("tnFinanceWorkNum");
            return new function () {
                var _this = this;
                $.extend(this, {
                    url: "",
                    async: true,
                    type: "GET",
                    encode: true,
                    contentType: "application/json; charset=UTF-8",
                    addlistener: {
                        beforerequest: "beforeSend",
                        success: "success",
                        requestcomplete: "complete",
                        error: "error",
                        beforesuccess: "dataFilter"
                    }
                }, options);
                for (var i in this.listener) {
                    var functionStr = 'if ("' + i + '" == "success"){' + 'var data = arguments[0], textStatus = arguments[1];' + 'if (this.encode){' + 'try{' + 'data = tn.Base64.decode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = tn.json.encode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + '}else{' + 'data = tn.json.encode(data);' + '}' + 'if(!data.success){' + 'alert("后台数据报错：错误代码：" + data.errorCode + "，错误信息：" + data.msg);return;' + '}else{' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}' + '}else if("' + i + '" == "requestcomplete"){' + 'var data = arguments[0];' + 'try{' + 'data = tn.Base64.decode(data.responseText);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = tn.json.encode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}else if("' + i + '" == "beforesuccess"){' + 'var data = arguments[0], type = arguments[1];' + 'this.listener["' + i + '"].call(this, data, type);return data' + '}else if("' + i + '" == "error"){' + 'this.listener["' + i + '"].call(this, arguments);' + '}else{' + 'this.listener["' + i + '"].call(this, arguments);' + '}';
                    this[this.addlistener[i]] = new Function(functionStr);
                }
                try {
                    var userData;
                    if (this.type.toUpperCase() === "GET") {
                        userData = $.extend({
                            token: token,
                            workNum: workNum,
                            r: Math.random()
                        }, this.data);
                        //userData = tn.Base64.encode(tn.json.decode(userData));
                        var param = [];
                        for (var i in userData){
                            param.push(i +'='+ userData[i]);
                        }
                        this.url = this.url + "?" + param.join("&");
                        delete this.data;
                    }
                    if (this.type.toUpperCase() === "POST") {
                        var defaultData = {
                            //token: token,
                            workNum: workNum,
                            //r: Math.random()
                        }
                        userData = $.extend(true, {}, defaultData, this.data)
                        //this.data = tn.Base64.encode(tn.json.decode(userData));
                        this.data = JSON.stringify(userData);
                        this.url = this.url + "?token=" + token;
                    }
                    $.ajax(this);
                } catch (e) {
                    alert(e.message);
                }
            };
        };
    };

    var Nibbler = function (options) {
        var construct, pad, dataBits, codeBits, keyString, arrayData, mask, group, max, gcd, translate, encode, decode, utf16to8, utf8to16;
        construct = function () {
            var i, mag, prev;
            pad = options.pad || '';
            dataBits = options.dataBits;
            codeBits = options.codeBits;
            keyString = options.keyString;
            arrayData = options.arrayData;
            mag = Math.max(dataBits, codeBits);
            prev = 0;
            mask = [];
            for (i = 0; i < mag; i += 1) {
                mask.push(prev);
                prev += prev + 1;
            }
            max = prev;
            group = dataBits / gcd(dataBits, codeBits);
        };
        gcd = function (a, b) {
            var t;
            while (b !== 0) {
                t = b;
                b = a % b;
                a = t;
            }
            return a;
        };
        encode = function (str) {
            str = utf16to8(str);
            var out = "",
                i = 0,
                len = str.length,
                c1, c2, c3, base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        };
        decode = function (str) {
            var c1, c2, c3, c4;
            var i, len, out;
            var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -
                    1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                do {
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1) break;
                do {
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1) break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61) {
                        out = utf8to16(out);
                        return out;
                    }
                    c3 = base64DecodeChars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1) break;
                out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) {
                        out = utf8to16(out);
                        return out;
                    }
                    c4 = base64DecodeChars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1) break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            out = utf8to16(out);
            return out;
        };
        utf16to8 = function (str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        };
        utf8to16 = function (str) {
            var out, i, len, c;
            var char2, char3;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        out += str.charAt(i - 1);
                        break;
                    case 12:
                    case 13:
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        }
        this.encode = encode;
        this.decode = decode;
        construct();
    }

    tn.Base64 = new Nibbler({
        dataBits: 8,
        codeBits: 6,
        keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        pad: '='
    });

    Date.prototype.tempDate = null;

    Date.prototype.pad = function (num, n) {
        if ((num + "").length >= n) return num;
        return arguments.callee("0" + num, n);
    };
    /**
     * 时间日期格式化
     * @param  {Date} date   日期对象
     * @param  {String} format 格式化内容
     * @return {String}        返回格式如：2013-01-01，如果为IE则返回2013/01/01
     */
    Date.prototype.TNFormat = function (date, format) {
        format = format ? format : "y-m-d";
        var str = "";
        if (!date) {
            return "";
        }
        switch (format) {
            case "y":
                str = date.getFullYear();
                break;
            case "y-m":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2);
                break;
            case "y-m-d":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2);
                break;
            case "h-m-s":
                str = this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2);
                break;
            case "y-m-d-h-m-s":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2) + " " + this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(),
                        2) + ":" + this.pad(date.getSeconds(), 2);
                break;
            case "y-m-d-h-m-s-t":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2) + " " + this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(),
                        2) + ":" + this.pad(date.getSeconds(), 2) + ":" + this.pad(date.getMilliseconds(), 2);
                break;
        }
        if (tn.browser.msie) {
            return str.replace(/-/ig, "/");
        }
        return str;
    };
    /**
     * 将字符串转化为日期对象
     * @param  {String} date   日期字符串，如2013-01-01
     * @param  {String} format 格式化字符串
     * @return {Date}        返回日期对象
     */
    Date.prototype.parseDate = function (date, format) {
        if (date.constructor == Date) {
            return new Date(date);
        }
        var parts = date.split(/\W+/);
        var against = format.split(/\W+/),
            d, m, y, h, min, now = new Date();
        for (var i = 0; i < parts.length; i++) {
            switch (against[i]) {
                case 'd':
                case 'e':
                    d = parseInt(parts[i], 10);
                    break;
                case 'm':
                    m = parseInt(parts[i], 10) - 1;
                    break;
                case 'Y':
                case 'y':
                    y = parseInt(parts[i], 10);
                    y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
                    break;
                case 'H':
                case 'I':
                case 'k':
                case 'l':
                    h = parseInt(parts[i], 10);
                    break;
                case 'P':
                case 'p':
                    if (/pm/i.test(parts[i]) && h < 12) {
                        h += 12;
                    } else if (/am/i.test(parts[i]) && h >= 12) {
                        h -= 12;
                    }
                    break;
                case 'M':
                    min = parseInt(parts[i], 10);
                    break;
            }
        }
        return new Date(y === undefined ? now.getFullYear() : y, m === undefined ? now.getMonth() : m, d === undefined ? now.getDate() : d, h === undefined ? now.getHours() : h, min ===
        undefined ? now.getMinutes() : min, 0);
    };

    Date.prototype.addDays = function (n) {
        this.setDate(this.getDate() + n);
    };

    Date.prototype.addMonths = function (n) {
        if (this.tempDate === null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setMonth(this.getMonth() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };

    Date.prototype.getMaxDays = function () {
        var tmpDate = new Date(Date.parse(this)),
            d = 28,
            m;
        m = tmpDate.getMonth();
        d = 28;
        while (tmpDate.getMonth() == m) {
            d++;
            tmpDate.setDate(d);
        }
        return d - 1;
    };

    Date.prototype.addYears = function (n) {
        if (this.tempDate == null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setFullYear(this.getFullYear() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };

    Date.prototype.config = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        M: 2592000000,
        y: 31536000000
    };

    tn.datePack = {
        toString: function (date, format) {
            if (!date) return "";
            if (!tn.type.isDate(date)) return "";
            format = format ? format : "y-m-d";
            switch (format) {
                case "y-m":
                    return date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2);
                case "y-m-d":
                    return date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2);
                case "h-m-s":
                    return this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2);
                case "y-m-d-h-m-s":
                    return date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2) + " " + this.pad(date.getHours(), 2) + ":" + this.pad(date
                            .getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2);
            }
        },
        pad: function (num, n) {
            if ((num + "").length >= n)
                return num;
            return arguments.callee("0" + num, n);
        },
        parseDate: function (string) {
            var matches;
            if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) {
                return new Date(matches[1], matches[2] - 1, matches[3]);
            } else {
                return null;
            };
        },
        addDate: function (date, days, format) {
            var dateLong = new Date(date).valueOf();
            dateLong += 24 * 60 * 60 * 1000 * days;
            return this.toString(new Date(dateLong), format || "y-m-d");
        },
        delDate: function (date, days, format) {
            var dateLong = new Date(date).valueOf();
            dateLong -= 24 * 60 * 60 * 1000 * days;
            return this.toString(new Date(dateLong), format || "y-m-d");
        },
        getDay: function (days) {
            return new Date(days).getDay();
        },
        getTime: function (date) {
            return new Date(date).getTime();
        },
        isAmong: function (date, minDate, maxDate) {
            var dateLong = new Date(date).valueOf();
            var minDateLong = new Date(minDate).valueOf();
            var maxDateLong = new Date(maxDate).valueOf();
            if (minDateLong <= dateLong < maxDateLong) {
                return true;
            } else {
                return false;
            }
        },
        defaultConfig: {
            weekNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            format: "YYYY-MM-DD",
            seconds: 1000, // 1000
            minutes: 60000, // 60 * 1000
            hours: 3600000, // 60 * 60 * 1000
            days: 86400000, // 24 * 60 * 60 * 1000
            weeks: 604800000, // 7 * 24 * 60 * 60 * 1000
            months: 2592000000, // 30 * 24 * 60 * 60 * 1000
            years: 31536000000 // 365 * 24 * 60 * 60 * 1000
        }
    }


    // tn.URI = URI;

    window.tn = tn;
    window.TNAjax = tn.ajax;
}(window, document);
function FAuth(){
    this.domain = tn.config.fDomain;
    this.authDomain = tn.config.fauthDomain;
    this.indexPage = this.authDomain + 'view/index.html';
    this.loginPage = this.authDomain + 'login/' + '?return_uri=' +  this.indexPage;
    this.loginCheck = this.authDomain + "login/check.php";
    this.logoutPage = this.authDomain + "login/?logout";
    this.menuApi = this.authDomain + "login/menu.php";
    this.isProEvn = document.domain.split('.').slice(-2).join('.') == this.domain;
    this.inIframe = (window.frames.length != parent.frames.length);
}
$.extend(FAuth.prototype,{
    myBrowser: function(){
        var userAgent = navigator.userAgent;
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        };
        if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        }
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        }
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        };
    },
    isLogin: function(callback){
        var mb = this.myBrowser();
        var self = this;
        if(self.isProEvn == true){
            if (!tn.cookie.get("tnFinanceSessionId") || tn.cookie.get("tnFinanceSessionId").length === 0) {
                if(self.inIframe){
                    window.parent.location.href = self.loginPage;
                }else{
                    location.href = self.loginPage;
                }
                return false;
            }
        }
        var ajax = {
            url: self.loginCheck,
            type: "GET",
            dataType: "text",
            async:false,
          	data: {
                sid: tn.cookie.get("tnFinanceSessionId")
            },
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            success: function(data) {
                if(data == 'true')
                {
                    typeof callback == 'function' && callback.call(self, true);
                }
                else
                {
                    tn.cookie.TNClear("tnFinanceSessionId");
                    tn.cookie.TNClear("tnFinanceName");
                    tn.cookie.TNClear("tnFinanceNameSpelling");
                    tn.cookie.TNClear("tnFinanceWorkNum");
                    if(self.inIframe){
                        window.parent.location.href = self.loginPage;
                    }else{
                        location.href =self.loginPage;
                    }
                    return false;
                }
            },
            error: function(){
                alert("error");
            }
        };
        switch(mb){
            case 'Firefox':
                $.extend(ajax, {
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                });
                break;
            case 'Chrome':
                $.extend(ajax, {
                    xhrFields:{
                        withCredentials : true
                    },
                });
                break;
            default:
                $.extend(ajax, {
                    xhrFields:{
                        withCredentials : true
                    },
                });
        }
        $.ajax(ajax);
    },
    isAuth: function(){
        var self = this;
        $.ajax({
            url: self.menuApi,
            data : {
                token: tn.cookie.get("tnFinanceSessionId"),
                workNum: tn.cookie.get("tnFinanceWorkNum")
            },
            type: "GET",
            success: function(res) {
                res = tn.json.encode(tn.Base64.decode(res))
                var menuList = res.data.menuList;
                var aflag = false;
                var nowUrlPath = 'http://'+window.document.location.host+window.document.location.pathname;
                for(var i in menuList){
                    if(menuList[i].dataUrl == nowUrlPath){
                        aflag = true;
                    }
                }
                if(!aflag){
                    window.location.href = self.authDomain + 'view/notice.html';
                }
            },
        });
    },
    logout: function() {
        tn.cookie.TNClear("tnFinanceSessionId");
        tn.cookie.TNClear("tnFinanceName");
        tn.cookie.TNClear("tnFinanceNameSpelling");
        tn.cookie.TNClear("tnFinanceWorkNum");
        location.href = this.logoutPage;
        return false;
    }
});

var fAuth = new FAuth();
//fAuth.isLogin();//只验证登录
fAuth.isLogin(fAuth.isAuth);
