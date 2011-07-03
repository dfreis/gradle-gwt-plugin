window.twttr = window.twttr || {};
function replaceParams(B, A) {
    if (A) {
        for (var C in A) {
            B = B.replace(new RegExp("\\%\\{" + C + "\\}", "gi"), A[C])
        }
    }
    return B
}
function _(C, A) {
    if (twttr.i18n) {
        var B = twttr.i18n[C];
        if (B) {
            C = B
        }
    }
    return replaceParams(C, A)
}
twttr.augmentObject = function(B, C) {
    for (var A in C) {
        B[A] = C[A]
    }
    return B
};
twttr.statics = function(A) {
    return twttr.augmentObject(this, A)
};
twttr.augmentObject(twttr, {namespaceOf:function(A) {
    return twttr.is.object(A) ? A : window
},util:{linkify:{_link:function(A) {
    return A.replace(/\b(((https?\:\/\/)|www\.).+?)(([!?,.\)]+)?(\s|$))/g, function(G, F, D, C, B) {
        var E = D.match(/w/) ? "http://" : "";
        return'<a class="twitter-hyperlink" target="_blank" href="' + E + F + '">' + ((F.length > 25) ? F.substr(0, 24) + "..." : F) + "</a>" + B
    })
},_at:function(A) {
    return A.replace(/\B[@?]([a-zA-Z0-9_]{1,20})/g, function(B, C) {
        return'@<a target="_blank" class="twitter-atreply" href="http://twitter.com/' + C + '">' + C + "</a>"
    })
},_list:function(A) {
    return A.replace(/\B[@?]([a-zA-Z0-9_]{1,20}\/[a-zA-Z0-9_]+)/g, function(B, C) {
        return'@<a target="_blank" class="twitter-listname" href="http://twitter.com/' + C + '">' + C + "</a>"
    })
},_hash:function(A) {
    return A.replace(/\B[#?]([a-zA-Z0-9_]+)/gi, function(B, C) {
        return'<a target="_blank" class="twitter-hashtag" href="http://twitter.com/search?q=%23' + C + '">#' + C + "</a>"
    })
},clean:function(A) {
    return this._hash(this._at(this._list(this._link(A))))
}}},merge:function() {
    var C = arguments;
    var F = arguments[arguments.length - 1];
    var B = false;
    if (twttr.is.nil(C[0]) || !twttr.is.def(C[0])) {
        if (C.length < 2) {
            return{}
        }
        [].shift.call(C);
        return this.merge.apply(this, C)
    }
    if (twttr.is.bool(F)) {
        B = F;
        [].pop.call(C)
    }
    for (var E = 0,A = C.length - 1; E < A; E++) {
        for (var D in C[E + 1]) {
            if (B && C[0][D] && twttr.is.object(C[0][D]) && !twttr.is.fn(C[0][D]) && twttr.is.object(C[E + 1][D]) && !twttr.is.fn(C[E + 1][D]) && !twttr.is.element(C[0][D]) && !twttr.is.element(C[E + 1][D])) {
                this.merge(C[0][D], C[E + 1][D], B)
            } else {
                if (twttr.is.object(C[E + 1][D]) && !twttr.is.fn(C[E + 1][D]) && !twttr.is.element(C[E + 1][D])) {
                    C[0][D] = this.merge({}, C[E + 1][D], B)
                } else {
                    C[0][D] = C[E + 1][D]
                }
            }
        }
    }
    return C[0]
},extend:function(B, C) {
    var A = function() {
    };
    A.prototype = C.prototype;
    B.prototype = new A();
    B.prototype.constructor = B;
    B.uber = C.prototype;
    if (C.prototype.constructor == Object.prototype.constructor) {
        C.prototype.constructor = C
    }
},method:function(A, B) {
    this.prototype[A] = B;
    return this
},methods:function(B) {
    for (var A in B) {
        this.prototype[A] = B[A]
    }
    return this
},_uberWrapper:function(B, A) {
    return function() {
        return B.apply(A, arguments)
    }
},klass:function(A, B) {
    var C = twttr.magic(A, B);
    C.method = twttr.method;
    C.methods = twttr.methods;
    C.statics = twttr.statics;
    C._name = A;
    C.superclass = function(D) {
        twttr.extend(C, D);
        return C
    };
    return C
},augmentAndExtend:function(B, C, D) {
    var A = twttr.namespaceOf(B);
    A[C] = function() {
        A[C].uber.constructor.apply(this, arguments)
    };
    twttr.extend(A[C], D);
    return A[C]
},auxo:function(C, D, B) {
    var A = twttr.is.object(B) ? B : twttr;
    return twttr.augmentAndExtend(A, C, D)
},augmentString:function(G, E, C) {
    var F = window;
    var D = G.split(".");
    for (var B = 0,A = D.length; B < A; ++B) {
        if (C) {
            F = twttr.is.def(D[B + 1]) ? (F[D[B]] || {}) : (F[D[B]] = E)
        } else {
            F = F[D[B]] = F[D[B]] || (twttr.is.def(D[B + 1]) ? {} : E)
        }
    }
    return F
},magic:function(B, A) {
    if (twttr.is.string(B)) {
        return twttr.augmentString(B, A)
    } else {
        return twttr.augmentObject(B, A)
    }
},bind:function(B, A) {
    return function() {
        return A.apply(B, arguments)
    }
},is:{element:function(A) {
    return this.def(A.nodeType) || (A.document && A.document.nodeType)
},bool:function(A) {
    return typeof A === "boolean"
},nil:function(A) {
    return A === null
},def:function(A) {
    return !(typeof A === "undefined")
},number:function(A) {
    return typeof A === "number" && isFinite(A)
},fn:function(A) {
    return typeof A === "function"
},array:function(A) {
    return A ? this.number(A.length) && this.fn(A.splice) : false
},string:function(A) {
    return typeof A === "string"
},blank:function(A) {
    return A === ""
},falsy:function(A) {
    return A === false || A === null || A === undefined
},object:function(A) {
    return(A && (typeof A === "object" || this.fn(A))) || false
}},templates:{},timeouts:{},wait:(function() {
    var A = {};
    twttr.clearWait = function(B) {
        if (twttr.is.def(A[B])) {
            clearTimeout(B);
            delete A[B]
        }
    };
    return function(E, C) {
        var B = "TIMER_" + (new Date()).getTime();
        var D = setTimeout(function() {
            if (!twttr.is.def(A[B])) {
                return
            }
            E()
        }, C);
        A[B] = D;
        return B
    }
}())});
(function() {
    twttr.EventProvider = {
        events:null,
    _provider:function() {
        if (!this._eventProvider) {
            this._eventProvider = $({})
        }
        return this._eventProvider
    },_createEvent:function(A) {
        if (!this.events) {
            this.events = {}
        }
        if (!this.events[A]) {
            this.events[A] = new $.Event(A)
        }
        if (!$.event.special[A]) {
            $.event.special[A] = {setup:$.noop,teardown:$.noop}
        }
    },trigger:function() {
        this._createEvent(arguments[0]);
        var A = this._provider();
        A.trigger.apply(A, arguments)
    },bind:function() {
        this._createEvent(arguments[0]);
        var A = this._provider();
        A.bind.apply(A, arguments)
    },one:function() {
        this._createEvent(arguments[0]);
        var A = this._provider();
        A.one.apply(A, arguments)
    },unbind:function() {
        var A = this._provider();
        A.unbind.apply(A, arguments)
    }};
    twttr.cookie = {};
    twttr.cookie.get = function(C) {
        var D = C + "=";
        var A = document.cookie.split(";");
        for (var B = 0; B < A.length; B++) {
            var E = A[B];
            while (E.charAt(0) === " ") {
                E = E.substring(1, E.length)
            }
            if (E.indexOf(D) === 0) {
                return E.substring(D.length, E.length)
            }
        }
        return null
    };
    twttr.cookie.set = function(C, E, G, D, F) {
        var A;
        D = D ? "; domain=" + D : "";
        F = F || window;
        if (G) {
            var B = new Date();
            B.setTime(B.getTime() + (G * 24 * 60 * 60 * 1000));
            A = "; expires=" + B.toGMTString()
        } else {
            A = ""
        }
        F.document.cookie = C + "=" + E + A + "; path=/" + D
    }
}());
twttr.LocalStorage = (function() {
    return{create:function(F) {
        var A,E,D;

        function B(H) {
            var L = D.childNodes,K,J = null;
            for (var I = 0,G = L.length; I < G; I++) {
                K = L.item(I);
                if (K.getAttribute("key") == H) {
                    J = K;
                    break
                }
            }
            return J
        }

        var C = {isExpired:function(H) {
            if (H.match(/_expiry$/)) {
                return false
            }
            var G = this.get(H + "_expiry");
            return(G && (new Date()).getTime() > G)
        },setExpiry:function(H, G) {
            this.set(H + "_expiry", (new Date()).getTime() + (1000 * 60 * 60 * G))
        },setWithExpiry:function(H, I, G) {
            this.setExpiry(H, G);
            this.set(H, I)
        },expire:function(G) {
            this.del(G);
            this.del(G + "_expiry")
        }};
        if ((A = F.localStorage)) {
            C.get = function(G) {
                if (this.isExpired(G)) {
                    this.expire(G);
                    return null
                } else {
                    return A[G]
                }
            };
            C.set = function(G, H) {
                return(A[G] = H)
            };
            C.del = function(G) {
                A.removeItem(G)
            };
            C.clear = function() {
                A.clear()
            };
            C.getAll = function(K) {
                var J = -1,I,G = localStorage.length,H = {};
                while (++J < G) {
                    I = localStorage.key(J);
                    if (typeof K == "undefined" || I.match(K)) {
                        H[I] = localStorage.getItem(I)
                    }
                }
                return H
            }
        } else {
            if (F.document.documentElement.addBehavior) {
                A = F.document.documentElement;
                A.addBehavior("#default#userData");
                A.load("twitter-anywhere");
                E = A.xmlDocument;
                D = E.documentElement;
                C.get = function(G) {
                    var I,H = null;
                    if (this.isExpired(G)) {
                        this.expire(G)
                    } else {
                        I = B(G);
                        if (I) {
                            H = I.getAttribute("value")
                        }
                    }
                    return H
                };
                C.set = function(G, I) {
                    var H = B(G);
                    if (!H) {
                        H = E.createNode(1, "item", "");
                        H.setAttribute("key", G);
                        H.setAttribute("value", I);
                        D.appendChild(H)
                    } else {
                        H.setAttribute("value", I)
                    }
                    A.save("twitter-anywhere");
                    return I
                };
                C.del = function(G) {
                    var H = B(G);
                    if (H) {
                        D.removeChild(H)
                    }
                    A.save("twitter-anywhere")
                };
                C.clear = function() {
                    while (D.firstChild) {
                        D.removeChild(D.firstChild)
                    }
                    A.save("twitter-anywhere")
                };
                C.getAll = function(L) {
                    var K = D.childNodes,J = -1,G = K.length,I = {},M,H;
                    while (++J < G) {
                        M = K.item(J);
                        H = M.getAttribute("key");
                        if (typeof L == "undefined" || H.match(L)) {
                            I[H] = M.getAttribute("value")
                        }
                    }
                    return I
                }
            }
        }
        return C
    }}
}());
if (!window.JSON) {
    window.JSON = {}
}
(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta = {"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i,k,v,length,mind = gap,partial,value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {case"string":return quote(value);case"number":return isFinite(value) ? String(value) : "null";case"boolean":case"null":return String(value);case"object":if (!value) {
            return"null"
        }gap += indent;partial = [];if (Object.prototype.toString.apply(value) === "[object Array]") {
            length = value.length;
            for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null"
            }
            v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
            gap = mind;
            return v
        }if (rep && typeof rep === "object") {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
                k = rep[i];
                if (typeof k === "string") {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ": " : ":") + v)
                    }
                }
            }
        } else {
            for (k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ": " : ":") + v)
                    }
                }
            }
        }v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";gap = mind;return v
        }
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {"":value})
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k,v,value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"":j}, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
var Mustache = (function() {
    var A = function() {
    };
    A.prototype = {otag:"{{",ctag:"}}",render:function(E, D, C) {
        if (E.indexOf(this.otag) == -1) {
            return E
        }
        var B = this.render_section(E, D, C);
        B = this.render_i18n(B);
        return this.render_tags(B, D, C)
    },render_partial:function(B, D, C) {
        if (typeof (D[B]) != "object") {
            throw ({message:"subcontext for '" + B + "' is not an object"})
        }
        if (!C || !C[B]) {
            throw ({message:"unknown_partial"})
        }
        return this.render(C[B], D[B], C)
    },render_section:function(D, C, B) {
        var G = (D.indexOf(this.otag + "#") == -1);
        var H = (D.indexOf(this.otag + "!") == -1);
        if (!G && !H) {
            return D
        }
        var F = this;
        var E = new RegExp(this.otag + "(\\#|\\~)(.+)" + this.ctag + "\\s*([\\s\\S]+?)" + this.otag + "\\/\\2" + this.ctag + "\\s*", "mg");
        return D.replace(E, function(K, I, J, L) {
            var M = F.find(J, C);
            if (F.is_array(M)) {
                return F.map(M,
                            function(N) {
                                return F.render(L, F.merge(C, F.create_context(N)), B)
                            }).join("")
            } else {
                if (I == "#" && !twttr.is.falsy(M)) {
                    return F.render(L, C, B)
                } else {
                    if (I == "~" && twttr.is.falsy(M)) {
                        return F.render(L, C, B)
                    } else {
                        return""
                    }
                }
            }
        })
    },render_i18n:function(B) {
        if (B.indexOf(this.otag + "_i") == -1) {
            return B
        }
        var D = this;
        var C = new RegExp(this.otag + "\\_i" + this.ctag + "\\s*([\\s\\S]+?)" + this.otag + "\\/i" + this.ctag + "\\s*", "mg");
        return B.replace(C, function(E, F) {
            return _(F)
        })
    },render_tags:function(G, F, E) {
        var B = G.split("\n");
        var C = function() {
            return new RegExp(I.otag + "(=|!|<|\\{)?([^/#]+?)\\1?" + I.ctag + "+", "g")
        };
        var I = this;
        var H = C();
        for (var D = 0; D < B.length; D++) {
            B[D] = B[D].replace(H, function(L, J, K) {
                switch (J) {case"!":return L;case"=":I.set_delimiters(K);H = C();D--;return"";case"<":return I.render_partial(K, F, E);case"{":var M = I.find(K, F);return twttr.is.def(M) ? M : "";default:var M = I.find(K, F);return twttr.is.def(M) ? I.escape(M) : ""
                }
            }, this)
        }
        return B.join("\n")
    },set_delimiters:function(C) {
        var B = C.split(" ");
        this.otag = this.escape_regex(B[0]);
        this.ctag = this.escape_regex(B[1])
    },escape_regex:function(C) {
        if (!arguments.callee.sRE) {
            var B = ["/",".","*","+","?","|","(",")","[","]","{","}","\\"];
            arguments.callee.sRE = new RegExp("(\\" + B.join("|\\") + ")", "g")
        }
        return C.replace(arguments.callee.sRE, "\\$1")
    },find:function(B, C) {
        B = this.trim(B);
        if (twttr.is.def(C) && typeof C[B] === "function") {
            return C[B].apply(C)
        }
        if (C && C[B] !== undefined && C[B] !== null) {
            return C[B]
        } else {
            return undefined
        }
    },i18n:function(B, C) {
        return _(this.trim(B))
    },escape:function(B) {
        return B.toString().replace(/[&"<>\\]/g, function(C) {
            switch (C) {case"&":return"&amp;";case"\\":return"\\\\";case'"':return'"';case"<":return"&lt;";case">":return"&gt;";default:return C
            }
        })
    },merge:function(C, B) {
        var E = {};
        for (var D in C) {
            if (C.hasOwnProperty(D)) {
                E[D] = C[D]
            }
        }
        for (var D in B) {
            if (B.hasOwnProperty(D)) {
                E[D] = B[D]
            }
        }
        return E
    },create_context:function(B) {
        if (this.is_object(B)) {
            return B
        } else {
            return{".":B}
        }
    },is_object:function(B) {
        return B && typeof B == "object"
    },is_array:function(B) {
        return(B && typeof B === "object" && B.constructor === Array)
    },trim:function(B) {
        return B.replace(/^\s*|\s*$/g, "")
    },map:function(F, D) {
        if (typeof F.map == "function") {
            return F.map(D)
        } else {
            var E = [];
            var B = F.length;
            for (var C = 0; C < B; C++) {
                E.push(D(F[C]))
            }
            return E
        }
    }};
    return({name:"mustache.js",version:"0.1",to_html:function(D, B, C) {
        return new A().render(D, B, C)
    }})
}());
var TwitterText = (function() {
    var K = {};
    var F = {};
    var C = "!'#%&'()*+,\\-./:;<=>?@\\[/\\]^_{|}~";
    F.spaces = new RegExp("\\s");
    F.at_signs = new RegExp("[@?]");
    F.extract_mentions = new RegExp("(^|[^a-zA-Z0-9_])" + F.at_signs.source + "([a-zA-Z0-9_]{1,20})(?=(.|$))", "g");
    F.extract_reply = new RegExp("^(?:" + F.spaces.source + ")*" + F.at_signs.source + "([a-zA-Z0-9_]{1,20})", "g");
    F.list_name = /^[a-zA-Z\x80-\xff].{0,79}$/;
    var I = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ?ÑÒÓÔÕÖØÙÚÛÜ??ßàáâãäåæçèéêëìíîï?ñòóôõöøùúûü??\\303\\277";
    var O = "[a-z0-9_" + I + "]";
    F.auto_link_hashtags = new RegExp("(^|[^0-9A-Z&\\/]+)(#|?)([0-9A-Z_]*[A-Z_]+" + O + "*)", "ig");
    F.auto_link_usernames_or_lists = /([^a-zA-Z0-9_]|^)([@?]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9\x80-\xff\-]{0,79})?/g;
    F.auto_link_emoticon = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/g;
    F.valid_preceding_chars = new RegExp("(?:[^\\/\"':!=]|^|\\:)", "ig");
    F.valid_domain = new RegExp("(?:[^" + C + "\\s][.-](?=[^" + C + "\\s])|[^" + C + "\\s]){1,}\\.[a-z]{2,}(?::[0-9]+)?", "ig");
    F.valid_url_path_chars = new RegExp("(?:[.,]?[a-z0-9!*'();:=+$/%#\\[\\]\\-_,~@])", "ig");
    F.valid_url_path_ending_chars = new RegExp("[a-z0-9)=#/]", "ig");
    F.valid_url_query_chars = new RegExp("[a-z0-9!*'();:&=+$/%#\\[\\]\\-_.,~]", "ig");
    F.valid_url_query_ending_chars = new RegExp("[a-z0-9_&=#]", "ig");
    var A = "(       (" + F.valid_preceding_chars.source + ")       (         (https?:\\/\\/|www\\.)         (" + F.valid_domain.source + ")         (/" + F.valid_url_path_chars.source + "*" + F.valid_url_path_ending_chars.source + "?)?         (\\?" + F.valid_url_query_chars.source + "*" + F.valid_url_query_ending_chars.source + ")?         )     )";
    F.valid_url = new RegExp(A.replace(/[\s]/g, ""), "gi");
    var G = /www\./i;
    var J = "tweet-url";
    var B = "list-slug";
    var D = "username";
    var H = "hashtag";
    var N = ' rel="nofollow"';
    var M = function(Q) {
        var P = "";
        for (attr in Q) {
            if (Q[attr]) {
                P += " " + attr + '="' + Q[attr] + '"'
            }
        }
        return P
    };
    var L = function(Q) {
        var P = {};
        for (key in Q) {
            P[key] = Q[key]
        }
        return P
    };
    K.auto_link = function(Q, P) {
        return this.auto_link_usernames_or_lists(this.auto_link_urls_custom(this.auto_link_hashtags(Q, P), P), P)
    };
    K.auto_link_usernames_or_lists = function(S, P, R) {
        options = L(P);
        options.url_class = options.url_class || J;
        options.list_class = options.list_class || B;
        options.username_class = options.username_class || D;
        options.username_url_base = options.username_url_base || "http://twitter.com/";
        options.list_url_base = options.list_url_base || "http://twitter.com/";
        var T = "";
        if (!options.suppress_no_follow) {
            T = N
        }
        var Q = S.replace(F.auto_link_usernames_or_lists, function(W, a, Z, Y, X, U, c) {
            if (X && !options.suppress_lists) {
                var b = Y + X;
                var V = b;
                if (R) {
                    b = R(V)
                }
                return a + Z + '<a class="' + options.url_class + " " + options.list_class + '" href="' + options.list_url_base + V + '"' + T + ">" + b + "</a>"
            } else {
                var b = Y;
                if (R) {
                    b = R(S)
                }
                return a + Z + '<a class="' + options.url_class + " " + options.username_class + '" href="' + options.username_url_base + b + '"' + T + ">" + b + "</a>"
            }
        });
        return Q
    };
    K.auto_link_urls_custom = function(S, Q) {
        var P = L(Q);
        if (!P.suppress_no_follow) {
            P.rel = "nofollow"
        } else {
            P.suppress_no_follow = null
        }
        var R = S.replace(F.valid_url, function(W, Z, X, T, a, Y, V, c) {
            var b = M(P);
            var U;
            if (a.match(G)) {
                U = "http://" + T
            } else {
                U = T
            }
            return X + '<a href="' + U + '"' + b + ">" + T + "</a>"
        });
        return R
    };
    K.auto_link_hashtags = function(T, Q, S) {
        var P = L(Q);
        P.url_class = P.url_class || J;
        P.hashtag_class = P.hashtag_class || H;
        P.hashtag_url_base = P.hashtag_url_base || "http://twitter.com/search?q=%23";
        var U = "";
        if (!P.suppress_no_follow) {
            U = N
        }
        var R = T.replace(F.auto_link_hashtags, function(a, W, X, Z, Y, V) {
            if (S) {
                Z = S(Z)
            }
            return W + '<a href="' + P.hashtag_url_base + Z + '" title="#' + Z + '" class="' + P.url_class + " " + P.hashtag_class + '"' + U + ">" + X + Z + "</a>"
        });
        return R
    };
    K.extract_mentioned_screen_names = function(S, R) {
        if (!S) {
            return[]
        }
        var Q = [];
        S.replace(F.extract_mentions, function(X, T, W, V, U) {
            if (!V.match(F.at_signs)) {
                Q.push(W)
            }
        });
        if (R) {
            for (var P = 0; P < Q.length; P++) {
                R(Q[P])
            }
        }
        return Q
    };
    K.extract_reply_screen_name = function(R, P) {
        if (!R) {
            return null
        }
        var Q = null;
        R.replace(F.extract_reply, function(T, U, S) {
            Q = U;
            if (P) {
                P(Q)
            }
        });
        return Q
    };
    K.extract_urls = function(S, Q) {
        if (!S) {
            return[]
        }
        var R = [];
        S.replace(F.valid_url, function(W, Z, X, T, a, Y, V, b) {
            var U;
            if (a.match(G)) {
                U = "http://" + T
            } else {
                U = T
            }
            R.push(U)
        });
        if (Q) {
            for (var P = 0; P < R.length; P++) {
                Q(R[P])
            }
        }
        return R
    };
    K.extract_hashtags = function(S, R) {
        if (!S) {
            return[]
        }
        var P = [];
        S.replace(F.auto_link_hashtags, function(W, U, V, T) {
            P.push(T)
        });
        if (R) {
            for (var Q = 0; Q < P.length; Q++) {
                R(P[Q])
            }
        }
        return P
    };
    K.printUnicodeSpaces = function() {
    };
    K.regexes = F;
    var E = "em";
    K.hit_highlight = function(a, c, R) {
        c = c || [];
        R = R || {};
        if (c.length === 0) {
            return a
        }
        var l = R.tag || E,b = ["<" + l + ">","</" + l + ">"],m = a.split("<"),n,Z = [],d,f,e;
        for (f = 0; f < m.length; f += 1) {
            d = m[f];
            if (!d) {
                Z.push("")
            } else {
                n = d.split(">");
                for (e = 0; e < n.length; e += 1) {
                    Z.push(n[e])
                }
            }
        }
        var X = "",k = 0,Y = Z[0],P = 0,U = 0,V = false,Q = Y,S = [],T,g,o,h,W;
        for (f = 0; f < c.length; f += 1) {
            for (e = 0; e < c[f].length; e += 1) {
                S.push(c[f][e])
            }
        }
        for (T = 0; T < S.length; T += 1) {
            g = S[T];
            o = b[T % 2];
            h = false;
            while (Y != null && g >= P + Y.length) {
                X += Q.slice(U);
                if (V && g === P + Q.length) {
                    X += o;
                    h = true
                }
                if (Z[k + 1]) {
                    X += "<" + Z[k + 1] + ">"
                }
                P += Q.length;
                U = 0;
                k += 2;
                Y = Z[k];
                Q = Y;
                V = false
            }
            if (!h && Y != null) {
                W = g - P;
                X += Q.slice(U, W) + o;
                U = W;
                if (T % 2 === 0) {
                    V = true
                }
            }
        }
        if (Y != null) {
            if (U < Q.length) {
                X += Q.slice(U)
            }
            for (T = k + 1; T < Z.length; T += 1) {
                X += (T % 2 === 0 ? Z[T] : "<" + Z[T] + ">")
            }
        }
        return X
    };
    return K
}());
if (!window.twttr) {
    window.twttr = {}
}
twttr.augmentString("twttr.messaging", {setup:function(A, D) {
    var C = 1;
    var B = window.postMessage && !(jQuery.browser.msie && jQuery.browser.version < 8);
    if (B) {
        this.transport = "postMessage"
    } else {
        if ($.browser.msie) {
            this.transport = "name"
        } else {
            this.transport = false
        }
    }
    twttr.postMessage = function(E, F) {
        E = twttr.messaging.encode(E);
        switch (twttr.messaging.transport) {case"postMessage":F.postMessage(E, A);break;case"name":F.name = (new Date()).getTime() + (C++) + "^" + document.domain + "&" + window.escape(E);break
        }
    };
    twttr._messageHandler = function(F) {
        var E = twttr.messaging.decode(F.data);
        D(E)
    };
    twttr._messagePoll = function(E, I) {
        var G = "";

        function F(J) {
            var K = J.split("^").pop().split("&");
            return{domain:K[0],data:window.unescape(K[1])}
        }

        function H() {
            var J = E[I];
            if (J != G) {
                G = J;
                twttr._messageHandler(F(J))
            }
        }

        setInterval(H, 1000 / 20)
    };
    if (B) {
        if (window.attachEvent) {
            window.attachEvent("onmessage", twttr._messageHandler)
        } else {
            window.addEventListener("message", twttr._messageHandler, false)
        }
    } else {
        if ($.browser.msie) {
            twttr._messagePoll(window, "name")
        }
    }
},encode:function(A) {
    return JSON.stringify(A)
},decode:function(A) {
    return JSON.parse(A)
}});
(function() {
    var D,E,K,C;
    var A = 0,H = {},F = [],L = {};

    function G() {
        if (!C) {
            C = F.shift();
            if (C) {
                twttr.postMessage(C, D)
            }
        }
    }

    function J(N) {
        if (twttr.messaging.transport != "postMessage") {
            F.push(N);
            G()
        } else {
            twttr.postMessage(N, D)
        }
    }

    function B(P) {
        var O = P.event;
        var Q = P.data;
        var N;
        if ((N = L[O])) {
            $.each(N, function(R, S) {
                S(Q)
            })
        }
    }

    function I(N) {
        if (N.status == 401) {
            B({event:"authRequired",data:N.originalMessage})
        }
    }

    function M(N) {
        if (N.ready && !K.executed) {
            J({ready:true,uuid:999});
            K.executed = true;
            K();
            return
        }
        if (twttr.messaging.transport != "postMessage") {
            C = null;
            G()
        }
        var O;
        if (typeof N.uuid != "undefined" && (O = H[N.uuid])) {
            if (N.data && N.data.error) {
                I(N.data);
                if (O.error) {
                    O.error(N.data)
                }
            } else {
                if (O.success) {
                    O.success(N.data)
                }
                delete H[N.uuid];
                H[N.uuid] = null
            }
        }
    }

    twttr.augmentString("twttr.anywhere.remote", {init:function(O, N, P) {
        N = N || "*";
        D = O.contentWindow;
        K = P;
        twttr.messaging.setup(N, M)
    },bind:function(O, N) {
        if (!L[O]) {
            L[O] = []
        }
        L[O].push(N);
        return N
    },call:function(R, O, N) {
        var P,Q;
        if (typeof N == "number") {
            Q = N
        } else {
            if (typeof N == "function") {
                P = {success:N}
            } else {
                P = N
            }
        }
        if (typeof Q == "undefined") {
            Q = A++;
            H[Q] = P
        }
        J({uuid:Q,method:R,args:O,token:parent.twttr.anywhere.token})
    },createClient:function(N, O) {
        twttr.IFrame.create({content:N}, function() {
            twttr.anywhere.remote.init(this.node, N, function() {
                O()
            })
        })
    }})
}());
(function() {
    twttr.IFrame = (function() {
        var C = "<!DOCTYPE html><html><head>",A = "</head><body>",E = "</body></html>";
        var D = function(I, J) {
            for (var H in J) {
                I[H] = J[H]
            }
            return I
        };
        var G = function(H) {
            return jQuery.map(H || [],
                             function(J, I) {
                                 return'<link rel="stylesheet" href="' + J + '" type="text/css">'
                             }).join("")
        };
        var B = function(H) {
            return jQuery.map(H || [],
                             function(J, I) {
                                 return'<script type="text/javascript" src="' + J + '"><\/script>'
                             }).join("")
        };
        var F = function(Q) {
            var H = Q.window.document,P = $('<iframe allowtransparency="true" frameborder="0" tabindex="-1" role="presentation" scrolling="no"/>', H),L = P[0],K = Q.complete,O = Q.content,N = $.browser;
            if (Q.css) {
                P.css(Q.css)
            }
            this.node = L;
            var I = function() {
                this.window = this.contentWindow = L.contentWindow;
                this.$node = P;
                var S = D(function(T) {
                    return $(T, L.contentWindow.document)
                }, $);
                this.jQuery = S;
                try {
                    if (!this.window.jQuery) {
                        this.window.jQuery = S;
                        this.window.$ = S
                    }
                } catch(R) {
                }
                K.call(this, this)
            };
            if (O) {
                if (twttr.is.string(O)) {
                    if (K) {
                        P.bind("load", twttr.bind(this, function() {
                            P.unbind("load");
                            I.call(this)
                        }))
                    }
                    L.src = O
                } else {
                    var J = "";
                    if (N.mozilla) {
                        L.src = "javascript:" + (new Date()).getTime() + ";'';"
                    }
                    if (N.msie && twttr.IFrame.domain) {
                        L.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"" + document.domain + "\\\";<\\\\/script>\\');document.close();};<\/script>'";
                        J = '<script>document.domain = "' + twttr.IFrame.domain + '";<\/script>'
                    }
                    P.bind("load", twttr.bind(this, function(U) {
                        P.unbind("load");
                        var T = L.contentWindow.document,R = C + J + G(O.css) + (O.styles ? ('<base href="' + twttr.anywhere.assetPath() + '/stylesheets/"><style type="text/css">' + O.styles + "</style>") : "") + B(O.js) + A + (O.body || "") + E;
                        var S = this;
                        T.open();
                        T.write(R);
                        T.close();
                        I.call(S)
                    }))
                }
                var M = Q.parentNode;
                if (typeof Q.parentNode == "string") {
                    M = $(Q.parentNode, H)
                } else {
                    M = Q.parentNode
                }
                P.appendTo(M || H.body)
            }
        };
        return{create:function(H, I) {
            H = D({window:window,complete:I}, H);
            return(new F(H)).node
        }}
    }())
}());
(function() {
    twttr.anywhere.requireConnect = function(C, A, B) {
        C = C || function() {
        };
        B = B || {};
        if (window.parent.twttr.anywhere.token) {
            twttr.anywhere.api.models.User.current(function(D) {
                A.currentUser = D;
                C(D)
            });
            return true
        } else {
            A.one("authComplete", function() {
                C()
            });
            twttr.anywhere.signIn(B);
            return false
        }
    };
    twttr.anywhere.signIn = function(I) {
        I = I || {};
        var H = {};
        if (I.scope) {
            H.oauth_scope = I.scope
        }
        var A,G;
        A = G = 500;
        var D = screen.height;
        var C = screen.width;
        var B = Math.round((C / 2) - (A / 2));
        var F = 0;
        if (D > G) {
            F = Math.round((D / 2) - (G / 2))
        }
        var E = false;
        E = window.open(twttr.oauth2URL(H), "twitter_anywhere_auth", "left=" + B + ",top=" + F + ",width=" + A + ",height=" + G + ",personalbar=no,toolbar=no,resizable=no,scrollbars=yes");
        if (!E) {
            window.parent.location.href = twttr.oauth2URL(H)
        }
    }
}());
(function() {
    var A = {A:1,SCRIPT:1,NOSCRIPT:1,OBJECT:1,IFRAME:1,TEXTAREA:1,INPUT:1,SELECT:1,BUTTON:1,STYLE:1,PRE:1,TITLE:1};
    twttr.anywhere.constants = {matchers:{screen_name:/\B[\u0040\uFF20]([a-zA-Z0-9_]{1,20})\b/g,single_name:/\B[\u0040\uFF20]([a-zA-Z0-9_]{1,20})\b/}};
    var B = twttr.anywhere.constants.matchers.screen_name;
    var C = 0;
    twttr.anywhere.linkify = function(H, F) {
        var I = H.window,D = H.selector,J = I.document.createElement("div"),G = F.className || "twitter-anywhere-user";

        function E(N) {
            var L = $.makeArray(N.childNodes);
            $.each(L, function(P, Q) {
                E(Q)
            });
            if (N.nodeType == 3 && !A[N.parentNode.tagName]) {
                if (!N.nodeValue.match(B)) {
                    return
                }
                var K = N.nodeValue.replace(B, "@<a class='" + G + "' href='" + window.parent.twttr.anywhere._baseUrl() + "/$1'>$1</a>");
                J.innerHTML = K;
                var O = N.parentNode;
                var M = J.lastChild;
                O.replaceChild(M, N);
                while (J.firstChild) {
                    O.insertBefore(J.firstChild, M)
                }
            }
        }

        $(D, I.document).each(function(K, L) {
            E(L)
        })
    }
}());
window.twttr = window.twttr || {};
window.twttr.stylesheets = {};
twttr.stylesheets["tweet_box_simple.css"] = "\n#tweet-box {\n  border-radius: 3px;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  border: 1px solid #AAA;\n  padding: 4px;\n  font-size: 14px;\n  font-family: 'Lucida Grande', sans-serif;\n  overflow: auto;\n}\n\n#link-shortening-button {\n  display: none;\n}";
twttr.stylesheets["tweet_box_base.css"] = "* {\n  margin: 0;\n  padding: 0;\n}\n\n#tweet-box-container label {\n  float: left;\n  color:#333333;\n  font-family:'Helvetica Neue','Helvetica','Arial',sans-serif;\n  font-size:20px;\n  font-weight:normal;\n  line-height:1.1;\n  margin: 3px 45px 5px 0;\n}\n\n#tweeting-controls {\n  text-align: right;\n  /* 1px right margin prevents the button from triggering a scroll on\n  the parent iframe when it is focused */\n  margin: 8px 1px 1px 0;\n}\n\n#tweet-box-header {\n  zoom:1;\n}\n\n#tweet-box-header:after {\n  content: \".\";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n}\n\n#tweeting-controls a {\n  line-height: 13px;\n}\n\n#counter {\n  float: right;\n  font-family: 'Helvetica Neue','Helvetica','Arial',sans-serif;\n  background: none repeat scroll 0 0 transparent;\n  color: #ccc;\n  font-size: 24px;\n  font-weight: 500;\n}\n\n#counter.warning {\n  color: #5C0002;\n}\n\n#counter.danger {\n  color: #D40D12;\n}\n\n.loading #counter {\n  display: none;\n}\n\n#spinner {\n  width: 14px;\n  height: 14px;\n  margin: 5px 0;\n  background: url(../images/spinner.gif) no-repeat;\n  display: none;\n  float: right;\n}\n\n.loading #spinner {\n  display: block;\n}\n\n\n.btn {\n  background: #ddd url(../images/bg-btn.gif) repeat-x scroll 0 0;\n  cursor: pointer;\n  border-color: #ddd #ddd #ccc;\n  border-style: solid;\n  border-width: 1px;\n  padding: 0 8px;\n  display: inline-block;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n}\n\n.btn button {\n  overflow: visible;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  text-shadow: 1px 1px 0 #fff;\n  color: #333;\n  font-size: 11px;\n  font-family: \"lucida grande\", helvetica, tahoma, arial;\n}\n\n.btn-hover,\n.btn-focus {\n  border-color: #999 #999 #888 !important;\n  color: #000;\n}\n\n.btn-focus button {\n  outline: none;\n  -moz-outline-style: none;\n}\n\n.btn-active {\n  background-image: none;\n  outline: none;\n}\n\n:focus {\n  -moz-outline-style: none;\n}\n\n.btn-m {\n  padding: 2px 15px 3px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  background-position: 0 -200px;\n}\n\n.btn-m button {\n  font-size: 15px;\n  font-family: \"helvetica neue\", arial, sans-serif;\n}\n\n.btn-disabled {\n  opacity: 0.6;\n  filter: alpha(opacity=60);\n  background-image: none;\n}";
twttr.stylesheets["follow_button.css"] = "body {\n  /* Prevent the button from being wrapped by the parent iframe  */\n  width: 500px;\n}\n\na {\n\tcolor: #196698;\n\tfont-weight: normal;\n\ttext-decoration: none;\n}\n\na:hover {\n\ttext-decoration: underline;\n}\n\n\n\n/* Basic structure */\n\n.twitter-follow-btn {\n  font: 12px Arial, sans-serif;\n  display: inline-block;\n  white-space: nowrap;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n  min-height: 22px;\n  *height: 22px;\n  line-height: 22px;\n}\n\n\n/* Default and in-progress states */\n\n.twitter-follow-btn-default,\n.twitter-follow-btn-inprog {\n  background: #1D6B9C url(../images/gradient-background.png) repeat-x;\n  border: 1px solid #18566A;\n  padding: 0 7px 0 2px;\n}\n\n.twitter-follow-btn-default i,\n.twitter-follow-btn-inprog i {\n  float: left;\n  height: 22px;\n  width: 23px;\n  border-right: 1px solid #73AFD5;\n}\n\n.twitter-follow-btn-default i b {\n  display: block;\n  background: url(../images/t_170px.png) no-repeat 3px 3px;\n  height: 22px;\n  width: 22px;\n  border-right: 1px solid #094B60;\n}\n\n.twitter-follow-btn-default button,\n.twitter-follow-btn-inprog button {\n  *display: inline-block;\n  *height: 22px;\n  *vertical-align: middle;\n  font: 12px Arial, sans-serif;\n  text-shadow: 0 -1px 0 #18566A;\n  padding: 0 0 0 4px;\n  overflow: visible;\n  border: 0;\n  background: transparent;\n  color: #fff;\n}\n\n.twitter-follow-btn-default:hover {\n  border: 1px solid #00242C;\n  background-position: left -23px;\n}\n\n.twitter-follow-btn-default:active {\n  border: 1px solid #044D77;\n  background-position: left -46px;\n  color: rgba(255,255,255,0.8);\n}\n\n\n.twitter-follow-btn-inprog i b {\n  background: url(../images/spinner.gif) no-repeat 3px 3px;\n  display: block;\n  height: 22px;\n  width: 22px;\n  border-right: 1px solid #094B60;\n}\n\n\n/* Initializing (placeholder) */\n\n.twitter-follow-btn-init {\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 0 0 8px;\n  width: 152px;\n}\n\n.twitter-follow-btn-init span {\n  background: url(../images/spinner.gif) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n/* Following and Pending */\n\n.twitter-follow-btn-following,\n.twitter-follow-btn-pending {\n  display: none;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 8px;\n}\n\n.twitter-follow-btn-following span,\n.twitter-follow-btn-pending span {\n  background: url(../images/t_170px.png) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n/* Error */\n\n.twitter-follow-btn-alert {\n  display: none;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 8px;\n}\n\n.twitter-follow-btn-alert span {\n  background: url(../images/alert.png) no-repeat 0 center;\n  padding-left: 20px;\n}";
twttr.stylesheets["bubble.css"] = ".twitter-bubble {\n  position: absolute;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n  z-index: 99999;\n}\n\n.twitter-bubble-content {\n  margin: 10px 0 11px 0;\n  border: 4px solid #ddd;\n  border-width: 5px 4px 4px 4px;\n  border-radius: 5px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  background: #fff;\n  overflow: hidden;\n  -moz-box-shadow: #aaa 0 1px 0;\n  -webkit-box-shadow: #aaa 0 1px 0;\n}\n\n.twitter-bubble-divot {\n  left: 16px;\n  width: 27px;\n  height: 15px;\n  background-repeat: no-repeat;\n}\n\n.twitter-bubble-divot-bottom {\n  position: absolute;\n  bottom: 0px;\n  background-image: url(../images/divvy.png);\n}\n\n.ie .twitter-bubble-divot-bottom,\n.ff3 .twitter-bubble-divot-bottom,\n.opera .twitter-bubble-divot-bottom {\n  background-image: url(../images/divvy.gif);\n}\n\n.twitter-bubble-divot-top {\n  position: absolute;\n  top: 0px;\n  background-image: url(../images/divvy-up.gif);\n}";
twttr.stylesheets["hovercards.css"] = '* {\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: "lucida grande", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  color: #333;\n  font-size: 11px;\n}\n\n.twitter-bubble-wrapper {\n/*  display: inline-block;*/\n  position: absolute;\n}\n\na {\n  cursor: pointer;\n  color: #2276bb;\n  text-decoration: none;\n}\n\na img {\n  border: 0;\n}\n\n#follow-frame {\n  width: 282px;\n  height: 39px;\n}\n\n.bd .loading-inline-spinner img {\n  display: block;\n  width: 14px;\n  height: 14px;\n  margin: 17px auto;\n}\n\n.loading-msg {\n  background: url(../images/spinner.gif) no-repeat left center;\n  padding: 5px 20px 5px 20px;\n  margin: 0 10px;\n  width: 50px;\n}\n\n.user-dne {\n  display: inline-block;\n  padding: 5px;\n  width: 165px;\n}\n\n.hovercard-inner .bd {\n  padding: 10px;\n  overflow: hidden;\n}\n\n.hovercard-inner a:visited {\n  color: #2276bb;\n}\n\n.hovercard-inner p.location {\n  height: 16px;\n}\n\n.hovercard-inner .avatar,\n.loading-inline-graphic {\n  float: left;\n  display: block;\n  width: 48px;\n  height: 48px;\n}\n\n.loading-inline-graphic {\n  background-repeat: none;\n  background-position: 0 0;\n  background-color: transparent;\n}\n\n.hovercard-inner .bio {\n  margin-left: 56px;\n}\n\n.hovercard-inner .bio span em {\n  display: block;\n  font-style: normal;\n}\n\n.hovercard-inner .bio p {\n  line-height: 16px;\n}\n\n.hovercard-inner .fn-above { /* FULL NAME above durr*/\n  font-weight: bold;\n  font-family: "helvetica neue", helvetica, arial, sans-serif;\n  font-size: 15px;\n  color: #333;\n}\n\n.hovercard-inner .sn a {\n  font-size: 11px;\n  line-height: 14px;\n  font-weight: normal;\n}\n\n.inline .hovercard-inner .at_symbol {\n  display: none;\n}\n\n.hovercard-inner .sn img {\n  position: relative;\n  top: 2px;\n}\n\n.hovercard-inner .user i {\n  display: inline-block;\n  background-position: -176px -32px;\n  width: 15px;\n  background-image:url(../images/sprite-icons.png);\n  background-repeat: no-repeat;\n  height: 13px;\n  outline-color: -moz-use-text-color;\n  overflow: hidden;\n  margin: 0 3px -3px 0;\n}\n\n.hovercard-inner .user b {\n  background-image:url(../images/sprite-icons.png);\n  background-repeat: no-repeat;\n  background-position: 0 -64px;\n}\n\n.hovercard-inner .description {\n  color: #656565;\n  clear: left;\n  overflow: hidden;\n  height: auto;\n  padding-top: 3px;\n}\n\n.hovercard-inner .description-inactive {\n  display: none;\n}\n\n.hovercard-inner ul.user_stats {\n  overflow: hidden;\n  zoom:1; /* Self clear the UL for IE since its LI\'s are floated */\n}\n\n.hovercard-inner ul.user_stats,\n.hovercard-inner .user_stats li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.hovercard-inner .description p,\n.hovercard-inner .description ul {\n  padding: 3px 0;\n  color: #333;\n}\n\n.hovercard-inner .user_stats li {\n  float: left;\n  border-right: 1px solid #eee;\n  padding: 1px 12px;\n  letter-spacing: -0.5px;\n}\n\n.hovercard-inner .user_stats li.last {\n  border-right-width: 0;\n}\n\n.hovercard-inner .user_stats li.first {\n  padding-left: 0;\n}\n\n.hovercard-inner .user_stats .stat {\n  font-weight: bold;\n  display: block;\n  color: #333;\n  font-size: 12px;\n  font-family: "Helvetica Neue", Arial, sans-serif;\n  letter-spacing: 0.5px;\n}\n\n.hovercard-inner .user_stats .type {\n  color: #666;\n}\n\n.hovercard-inner .hovercard-inner-footer {\n  background: #f6f6f6;\n  height: 39px;\n}\n\n.hovercard-inner .hovercard-inner-footer .loading-msg {\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n  background: url(../images/spinner.gif) no-repeat left center;\n  padding: 0 0 0 20px;\n}\n\n.follow-controls,\n.following-controls {\n  float: left;\n  _display: inline;\n  margin-left: 10px;\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n}\n\n.action-dropdowns {\n  float: right;\n  _display: inline;\n  margin-right: 7px;\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n}\n\n.follow-controls a,\n.action-dropdowns a {\n  _margin: 7px 0;\n}\n\n\n\n.hovercard-inner .setting {\n  background: url(../images/sprite-icons.png) -96px -48px no-repeat;\n  width: 16px;\n  height: 16px;\n  display: inline-block;\n  _overflow: hidden;\n  cursor: pointer;\n  margin-left: 5px;\n  margin-bottom: -5px;\n}\n\n.hovercard-inner .sms-setting-off {\n  background-position: -160px -48px;\n}\n\n.hovercard-inner .sms-setting-not-off {\n  background-position: -48px -48px;\n}\n\n.hovercard-inner .replies-setting-off {\n  background-position: -144px -48px;\n}\n\n.hovercard-inner .replies-setting-not-off {\n  background-position: 0 -48px;\n}\n\n.hovercard-inner .shares-setting-off {\n  background-position: -176px -48px;\n}\n\n.hovercard-inner .shares-setting-not-off {\n  background-position: -96px -48px;\n}\n\n.hovercard-inner .is-following {\n  background: url(../images/sprite-icons.png) -160px -16px;\n  width: 10px;\n  height: 9px;\n  display: inline-block;\n  _overflow: hidden;\n  margin-right: 3px;\n\n  /* Helps IE 6 position the checkmark correctly */\n  _border-bottom: 2px solid #f6f6f6;\n}\n\n.follow-alert .alert,\n.follow-pending .pending,\n.is-you {\n  height: 39px;\n  line-height: 39px;\n  vertical-align: middle;\n  margin-left: 10px;\n}\n\n.hovercard-inner .following-controls,\n.hovercard-inner .is-you,\n.hovercard-inner .pending,\n.hovercard-inner .alert {\n  font-weight: bold;\n}\n\n.hovercard-inner .alert i {\n  background: transparent url(../images/alert.png) no-repeat;\n  height: 13px;\n  width: 14px;\n  margin-right: 5px;\n  margin-bottom: -2px;\n  display: inline-block;\n  _display: inline;\n}\n\n.hovercard-inner .following-controls .you-follow-user {\n  /* Helps IE 8 prevent the SMS icon from overlapping with the following */\n  border-right: solid 1px #f6f6f6;\n  display: inline-block;\n}\n\n.hovercard .not-following .following-controls,\n.hovercard .following .follow-controls,\n.hovercard .blocking .follow-controls,\n.hovercard .follow-pending .follow-controls,\n.hovercard .follow-pending .following-controls,\n.hovercard .follow-alert .follow-controls,\n.hovercard .follow-alert .following-controls,\n.hovercard .pending,\n.hovercard .is-you,\n.hovercard .alert,\n.hovercard .you .follow-controls,\n.hovercard .not-following .unfollow,\n.hovercard .follow-pending .unfollow,\n.hovercard .follow-alert .unfollow,\n.hovercard .following .follow,\n.hovercard .not-blocking .unblock,\n.hovercard .blocking .block,\n.hovercard .blocking .direct-message,\n.hovercard .blocking .follow,\n.hovercard .blocking .report-for-spam {\n  display: none;\n}\n\n.hovercard .you .is-you,\n.hovercard .follow-pending .pending,\n.hovercard .follow-alert .alert {\n  display: block;\n}\n\n.profile-pic {\n  width: 48px;\n  height: 48px;\n  float: left;\n  position: relative;\n}\n\n.profile-pic .icon {\n  background: url(../images/t_170px.png) no-repeat 0 0;\n  width: 14px;\n  height: 17px;\n  position: absolute;\n  _overflow: hidden;\n  bottom: -5px;\n  right: -5px;\n}\n\n\n.ie6-fix .twitter-bubble-divot-bottom {\n  _bottom: -1px;\n}';
twttr.stylesheets["generic_buttons.css"] = '/* =Individual Button Styles\n----------------------------------------------- */\na.a-btn {\n  zoom: 1;\n  background: #ddd url(../images/bg-btn.gif) repeat-x scroll 0 0;\n  cursor: pointer;\n  text-shadow: 1px 1px 0 #fff !important;\n  border-color: #ddd #ddd #ccc !important;\n  border-style: solid;\n  border-width: 1px !important;\n  text-decoration: none;\n  padding: 4px 8px 5px;\n  line-height: 14px;\n  font-size: 11px;\n  font-family: "lucida grande", helvetica, tahoma, arial;\n  display: inline-block;\n  _display: inline;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n}\n\na.a-btn,\na.a-btn:visited {\n  color: #333 !important;\n}\na.a-btn:hover,\na.a-btn:focus {\n  text-decoration: none;\n  border-color: #999 #999 #888 !important;\n  color: #000;\n  outline: none;\n}\na.a-btn:active {\n  background-image: none;\n  outline: none;\n}\n:focus {\n  -moz-outline-style: none;\n}\n\na.a-btn-m {\n  font-size: 15px;\n  font-family: "helvetica neue", arial, sans-serif;\n  padding: 5px 15px 6px;\n  line-height: 20px;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  background-position: 0 -200px;\n}\na.a-btn-l {\n  font-size: 20px;\n  line-height: 26px;\n  padding: 7px 20px 8px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  border-radius: 6px;\n  font-family: "helvetica neue", arial, sans-serif;\n  background-position: 0 -400px;\n}\na.btn-disabled {\n  opacity: 0.6;\n  filter: alpha(opacity=60);\n  background-image: none;\n}';
twttr.stylesheets["connect_button.css"] = '/* global class for buttons */\n\n/* Initializing (placeholder) */\n\n.twitter-connect-init {\n  font: 12px Arial, sans-serif;\n  display: inline-block;\n  white-space: nowrap;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n\tcolor: #fff;\n\tbackground: #eee;\n\tborder: 1px solid #ccc;\n\tcolor: #333;\n\ttext-shadow: 0 1px 0 #fff;\n  padding: 0 0 0 8px;\n}\n\n.twitter-connect-init-small {\n  min-height: 19px;\n  *height: 19px;\n  line-height: 19px;\n  width: 121px;\n}\n\n.twitter-connect-init-medium {\n  min-height: 22px;\n  *height: 22px;\n  line-height: 22px;\n  width: 138px;\n}\n.twitter-connect-init-large {\n  min-height: 26px;\n  *height: 26px;\n  line-height: 26px;\n  width: 162px;\n}\n\n.twitter-connect-init-xlarge {\n  min-height: 38px;\n  *height: 38px;\n  line-height: 38px;\n  width: 228px;\n}\n\n.twitter-connect-init span {\n  background: url(../images/spinner.gif) no-repeat 0 center;\n  padding-left: 20px;\n}\n\n\n\n.twitter-connect {\n  border: 0;\n  display: inline-block;\n  background-repeat: no-repeat;\n  background-position: top left;\n}\n\n.twitter-connect span {\n  position: absolute;\n  left: -9999px;\n}\n\n.twitter-button {\n  font: 12px Arial, sans-serif;\n  color: #fff;\n  background: #1D6B9C url(../images/gradient-background.png) repeat-x;\n  text-indent: 0;\n  border: 1px solid #18566A;\n  display: inline-block;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -border-radius: 4px;\n  text-shadow: 0 -1px 0 #18566A;\n}\n\n.twitter-button:hover {\n  border: 1px solid #00242C;\n  background-position: left -23px;\n  text-decoration: none;\n}\n\n.twitter-button:active {\n  border: 1px solid #044D77;\n  background-position: left -46px;\n  text-decoration: none;\n  color: rgba(255,255,255,0.8);\n}\n\n\n/* 129px */\n\n.twitter-connect-small {\n  background: url(../images/connect_129px.png) no-repeat;\n  width: 129px;\n  height: 19px;\n}\n.twitter-connect-small:hover {\n  background-position: left -19px;\n}\n.twitter-connect-small:active {\n  background-position: left -38px;\n}\n\n.twitter-connected-small {\n  background: url(../images/connected_129px.png) no-repeat;\n  width: 137px;\n  height: 23px;\n}\n\n/* 146px */\n\n.twitter-connect-medium {\n  background: url(../images/connect_146px.png) no-repeat;\n  width: 146px;\n  height: 23px;\n}\n.twitter-connect-medium:hover {\n  background-position: left -23px;\n}\n.twitter-connect-medium:active {\n  background-position: left -46px;\n}\n\n.twitter-connected-medium {\n  background: url(../images/connected_146px.png) no-repeat;\n  width: 159px;\n  height: 23px;\n}\n\n/* 170px */\n\n.twitter-connect-large {\n  background: url(../images/connect_170px.png) no-repeat;\n  width: 170px;\n  height: 26px;\n}\n.twitter-connect-large:hover {\n  background-position: left -26px;\n}\n.twitter-connect-large:active {\n  background-position: left -52px;\n}\n\n.twitter-connected-large {\n  background: url(../images/connected_170px.png) no-repeat;\n  width: 182px;\n  height: 26px;\n}\n\n/* 236px */\n\n.twitter-connect-xlarge {\n  background: url(../images/connect_236px.png) no-repeat;\n  width: 236px;\n  height: 38px;\n}\n.twitter-connect-xlarge:hover {\n  background-position: left -38px;\n}\n.twitter-connect-xlarge:active {\n  background-position: left -76px;\n}\n\n.twitter-connected-xlarge {\n  background: url(../images/connected_236px.png) no-repeat;\n  width: 258px;\n  height: 38px;\n}\n\n\n\n/* boxes */\n.twitter-connect-box {\n  font: 13px/17px Lucida Grande, "Lucida Grande", Arial, Helvetica, sans-serif;\n  padding: 8px 10px 9px 10px;\n  width: 200px;\n  background: #C7E0EC url(../images/rays-box.jpg) no-repeat center top;\n  color: #001F33;\n  text-shadow: 0 1px 0 #E5F0F6;\n  border-radius: 5px;\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  box-shadow: 0 1px 0 rgba(0,0,0,.3);\n  display: inline-block;\n  vertical-align: top;\n}\n\n.twitter-connect-box p {\n  margin: 0 0 8px 0;\n  padding: 0;\n}\n\n.twitter-connect-box-small {\n  font-size: 10px;\n  line-height: 14px;\n  width: 129px;\n}\n\n.twitter-connect-box-medium {\n  font-size: 11px;\n  line-height: 15px;\n  width: 146px;\n}\n\n.twitter-connect-box-large {\n  font-size: 11px;\n  line-height: 15px;\n  width: 170px;\n}\n\n.twitter-connect-box-xlarge {\n  font-size: 12px;\n  line-height: 17px;\n  width: 236px;\n}';
window.scribe = function(A, D, C, B) {
    C = C || {};
    if (window.DARKMODE_SCRIBE) {
        return this
    }
    if (typeof (A) == "function") {
        A = A.call(this, B);
        if (A === null) {
            return
        }
    }
    var E = {log:JSON.stringify(A)};
    if (C.filter) {
        E.filter = C.filter
    }
    if (D) {
        E.category = D
    }
    (new Image()).src = parent.twttr.anywhere._baseUrl(true) + "/scribe?" + $.param($.extend(E, {ts:(new Date()).getTime()}))
};