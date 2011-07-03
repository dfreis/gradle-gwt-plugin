(function() {
    window.twttr = window.twttr || {anywhere:{}};
    twttr.anywhere.isDevMode = (window._VERSION.indexOf("_dev") === 0);
    twttr.anywhere.assetPath = function() {
        var Z = parent.twttr.anywhere._assetUrl();
        var a = twttr.anywhere.isDevMode ? "" : window._VERSION;
        return[Z,a].join((twttr.anywhere.isDevMode ? "" : "/"))
    };
    var S = "twitter_anywhere_identity";
    var W = twttr.anywhere.assetPath,L,Q,A,N;
    if (twttr.anywhere.isDevMode) {
        L = [W() + "/vendor/jquery-1.4.2.js",W() + "/javascripts/base_lite.js",W() + "/javascripts/lib/json2.js",W() + "/javascripts/lib/twitter_text.js",W() + "/javascripts/api/init.js"];
        Q = [W() + "/javascripts/api/utilities/local_storage_cache.js",W() + "/javascripts/api/utilities/cache.js",W() + "/javascripts/api/utilities/helpers.js"];
        N = [W() + "/javascripts/api/utilities/base_collection.js",W() + "/javascripts/api/models/base.js",W() + "/javascripts/api/mixins/status_actions.js"];
        A = [W() + "/javascripts/lib/mustache.js",W() + "/javascripts/scribe.js",W() + "/javascripts/iframe.js",W() + "/javascripts/remote.js",W() + "/javascripts/auth.js",W() + "/javascripts/linkify.js",W() + "/javascripts/styles.js",W() + "/javascripts/api/models/user.js",W() + "/javascripts/api/models/direct_message.js",W() + "/javascripts/api/models/saved_search.js",W() + "/javascripts/api/models/list.js",W() + "/javascripts/api/models/status.js",W() + "/javascripts/api/models/search_result.js",W() + "/javascripts/api/models/place.js"]
    } else {
        L = [parent.twttr.anywhere._proto() + "://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"];
        Q = [W() + "/javascripts/client.bundle.js"];
        N = [];
        A = [W() + "/javascripts/api.bundle.js"]
    }
    var H = {};
    if (twttr.anywhere.isDevMode) {
        H.hovercards = [W() + "/javascripts/templates/hovercard_content.js",W() + "/javascripts/templates/hovercard_inner_footer.js",W() + "/javascripts/bubble.js",W() + "/javascripts/user_card.js",W() + "/javascripts/hovercards.js"];
        H.tweetBox = [W() + "/javascripts/tweet_box.js"];
        H.tweetButton = [W() + "/javascripts/templates/tweet_button.js",W() + "/javascripts/tweet_button.js"];
        H.connect = [W() + "/javascripts/templates/connect_button.js",W() + "/javascripts/templates/connected_button.js",W() + "/javascripts/connect.js"];
        H.follow = [W() + "/javascripts/templates/follow_button.js",W() + "/javascripts/follow.js"]
    } else {
        H.hovercards = [W() + "/javascripts/hovercards.bundle.js"];
        H.tweetBox = [W() + "/javascripts/tweet_box.bundle.js"];
        H.tweetButton = [W() + "/javascripts/tweet_button.bundle.js"];
        H.connect = [W() + "/javascripts/connect.bundle.js"];
        H.follow = [W() + "/javascripts/follow.bundle.js"]
    }
    var X = parent.twttr.anywhere._serverUrl(true);
    var K = "a.twitter-anywhere-user";

    function I(a, b) {
        for (var Z in b) {
            a[Z] = b[Z]
        }
        return a
    }

    var T = function(a, Z) {
        this.path = a;
        this.context = Z;
        this.loaded = false;
        this.callbacks = []
    };
    T.prototype.registerCallback = function(Z) {
        this.callbacks.push(Z);
        return this
    };
    T.prototype.finishedLoading = function() {
        this.loaded = true;
        for (var a = 0,Z = this.callbacks.length; a < Z; ++a) {
            this.callbacks[a]()
        }
    };
    T.prototype.load = function() {
        var a = this.context.document.createElement("script");
        a.type = "text/javascript";
        a.src = this.path;
        this.context.document.getElementsByTagName("head")[0].appendChild(a);
        var Z = this;
        if (this.context.attachEvent) {
            a.onreadystatechange = function() {
                var b = this.readyState;
                if (b === "loaded" || b === "complete") {
                    this.onreadystatechange = null;
                    Z.finishedLoading()
                }
            }
        } else {
            a.onload = a.onerror = function() {
                Z.finishedLoading()
            }
        }
    };
    var F = function(a, g, Z) {
        this.context = Z;
        if (!this.context.Manifesto) {
            this.context.Manifesto = {}
        }
        var j,d;
        var e = this;
        d = a.length;
        if (d === 0) {
            g();
            return
        }
        function f() {
            d--;
            if (d === 0) {
                g()
            }
        }

        for (var b = 0,c = a.length; b < c; ++b) {
            j = a[b];
            if (this.hasFinishedLoading(j)) {
                f()
            } else {
                if (this.isCurrentlyLoading(j)) {
                    this.context.Manifesto[j].registerCallback(f)
                } else {
                    var h = new T(j, this.context);
                    this.context.Manifesto[j] = h;
                    h.registerCallback(f).load()
                }
            }
        }
    };
    F.prototype.hasFinishedLoading = function(Z) {
        return this.context.Manifesto[Z] && this.context.Manifesto[Z].loaded
    };
    F.prototype.isCurrentlyLoading = function(Z) {
        return this.context.Manifesto[Z] && !this.context.Manifesto[Z].loaded
    };
    twttr.fetch = function(Z, b, a) {
        new F(Z, b, (a || window))
    };
    twttr.fetchSerial = function(Z, e) {
        var a = 0;
        var b = Z.length;
        if (b === 0) {
            e();
            return
        }
        function d() {
            if (a == b) {
                e()
            } else {
                c()
            }
        }

        function c() {
            twttr.fetch([Z[a]], function() {
                a++;
                d()
            })
        }

        c()
    };
    twttr.oauth2URL = function(Z) {
        var a = $.extend({oauth_callback_url:window.parent.twttr.anywhere._config.callbackURL || window.parent.location.href.split("#").shift(),oauth_mode:"flow_web_client",_:(new Date()).getTime(),oauth_client_identifier:window.parent.twttr.anywhere._config.clientID}, Z);
        return window.parent.twttr.anywhere._oauthUrl(true) + "/authorize?" + $.param(a)
    };
    twttr.callComplete = function(a) {
        var b = a.complete;
        var Z = Array.prototype.slice.call(arguments, 1);
        if (b) {
            b.apply(this, Z)
        }
    };
    function R(a) {
        if (parent.twttr.anywhere._signedOutCookiePresent() || parent.twttr.anywhere._config.oauthDisabled) {
            return
        }
        if (!parent.twttr.anywhere._headlessAuthWindow) {
            var Z = twttr.IFrame.create({content:twttr.oauth2URL({headless:true}),css:{position:"absolute",top:"-9999em"}});
            parent.twttr.anywhere._headlessAuthWindow = Z
        }
    }

    function E(Z, b, a) {
        this.selector = Z;
        this.window = b;
        this.client = a
    }

    E.setOptions = function(Z, a) {
        return twttr.merge({}, Z, a, true)
    };
    I(E.prototype, {connectButton:function(Z) {
        Z = twttr.merge({size:"medium",explanation:false}, Z);
        twttr.fetch(H.connect, twttr.bind(this, function() {
            twttr.anywhere.connectButton(this, Z)
        }), window)
    },linkifyUsers:function(Z) {
        Z = Z || {};
        twttr.anywhere.linkify(this, Z);
        twttr.callComplete(Z)
    },followButton:function(a, Z) {
        Z = twttr.merge({screenName:a}, Z);
        twttr.fetch(H.follow, twttr.bind(this, function() {
            twttr.anywhere.followButton(this, Z)
        }))
    },tweetButton:function(Z) {
        twttr.fetch(H.tweetButton, twttr.bind(this, function() {
            twttr.anywhere.tweetButton(this, Z)
        }))
    },hovercards:function(Z) {
        Z = twttr.merge({infer:false,linkify:true,selector:K}, Z);
        if (Z.infer || Z.username) {
            Z.linkify = false
        }
        function a() {
            twttr.fetch(H.hovercards, twttr.bind(this, function() {
                twttr.anywhere.hoverCards(this, Z)
            }), window)
        }

        if (Z.linkify) {
            this.linkifyUsers({complete:twttr.bind(this, function() {
                this.selector = jQuery.map(this.selector.split(","),
                                          function(c, b) {
                                              return c + " " + Z.selector
                                          }).join(",");
                a.call(this, a)
            })})
        } else {
            a.call(this)
        }
    },tweetBox:function(Z) {
        Z = twttr.merge({counter:true,defaultContent:"",height:65,width:515,label:"What's happening?",onTweet:function(b, a) {
        }}, Z);
        twttr.fetch(H.tweetBox, twttr.bind(this, function() {
            twttr.anywhere.tweetBox(this, Z)
        }), window)
    }});
    var V = {attemptImmediateAuth:function(Z) {
        if (this.isConnected()) {
            Z(true, this.currentUser)
        } else {
            this.bind("authComplete", function(c, a, b) {
                Z(true, a)
            });
            this.bind("authFailed", function(a) {
                Z(false)
            });
            R()
        }
    },isConnected:function() {
        return !!this.currentUser
    },linkifyUsers:function(Z) {
        this("body").linkifyUsers(Z)
    },hovercards:function(a) {
        var b = this;
        a = twttr.merge({linkify:true,selector:K}, a);
        function Z() {
            a.linkify = false;
            b(a.selector).hovercards(a)
        }

        if (a.linkify) {
            this.linkifyUsers({complete:Z})
        } else {
            Z()
        }
    },signIn:function(Z) {
        twttr.anywhere.signIn(Z)
    },requireConnect:function(Z) {
        return twttr.anywhere.requireConnect(Z, this)
    },_fireSignOut:function() {
        var Z = this;
        twttr.anywhere.remote.call("signOut", [], function() {
        });
        parent.twttr.anywhere._removeToken();
        M = null;
        D = false;
        Z.currentUser = null;
        twttr.cookie.set(S, null, -1, null, window.parent);
        twttr.anywhere.api.cache.clear();
        Z.trigger("signOut")
    },_fireAuthComplete:function(a) {
        var Z = this;
        twttr.anywhere.api.cache.clear();
        C(function(b) {
            P(b, function() {
                var c;
                if ((c = b.data("_identity"))) {
                    twttr.cookie.set(S, c, null, null, window.parent)
                }
                Z.currentUser = b;
                Z.trigger("authComplete", [b,a])
            })
        })
    },_fireAuthFailed:function() {
        this.trigger("authFailed")
    }};
    var M,D = false,J = [];

    function C(Z) {
        if (M) {
            Z(M)
        } else {
            J.push(Z);
            if (!D) {
                D = true;
                twttr.anywhere.api.models.User.current(twttr.bind(this, function(b) {
                    M = b;
                    D = false;
                    for (var c = 0,a; (a = J[c]); c++) {
                        a(b)
                    }
                    J = []
                }))
            }
        }
    }

    var B = 0;

    function U(a) {
        var Z = function(b) {
            return new E(b, a, Z)
        };
        Z.id = B++;
        twttr.merge(Z, V);
        twttr.merge(Z, twttr.EventProvider);
        twttr.merge(Z, twttr.anywhere.api.models);
        parent.twttr.anywhere._clients.push(Z);
        Z.version = window._VERSION;
        return Z
    }

    function Y(a, b) {
        if (a === null || a == "en" || (a && !a.match(/^[a-z]{2}$/))) {
            b();
            return
        }
        var Z = parent.twttr.anywhere._baseUrl() + "/javascripts/i18n/" + a + ".js";
        twttr.fetch([Z], b)
    }

    function P(Z, b) {
        var a;
        if (Z) {
            a = Z.lang;
            Y(a, b)
        } else {
            twttr.anywhere.remote.call("getLanguage", [], function(c) {
                if (c) {
                    Y(c, b)
                } else {
                    if ((c = parent.twttr.anywhere._config.lang)) {
                        Y(c, b)
                    } else {
                        c = parent.document.documentElement.getAttribute("lang");
                        Y(c, b)
                    }
                }
            })
        }
    }

    window._init = function(b, Z) {
        var a = U(Z.window);
        a.currentUser = Z.currentUser;
        b(a);
        return a
    };
    function O(Z) {
        twttr.anywhere.remote.call(Z.method, Z.args, Z.uuid)
    }

    function G(Z) {
        Z = Z || {};
        P(Z.currentUser, function() {
            $.each(window._initCallbacks, function(b, c) {
                var d = c[0],a = c[1];
                api = _init(d, I(a, Z));
                twttr.anywhere.remote.bind("authRequired", function(e) {
                    api.unbind("authComplete");
                    if (e) {
                        api.one("authComplete", function() {
                            O(e)
                        })
                    }
                    if (parent.twttr.anywhere.token) {
                        parent.twttr.anywhere._removeToken();
                        R()
                    } else {
                        twttr.anywhere.requireConnect(jQuery.noop, api)
                    }
                })
            })
        })
    }

    twttr.anywhere.scribe = function(Z) {
        var Z = twttr.merge({url:parent.document.location.href,token:parent.twttr.anywhere.token || "",client_id:parent.twttr.anywhere._config.clientID || "",version:window._VERSION}, Z);
        window.scribe(Z, "anywhere")
    };
    twttr.fetch(L, function() {
        twttr.fetch(Q, function() {
            twttr.fetch(N, function() {
                twttr.fetch(A, function() {
                    twttr.IFrame.domain = parent.twttr.anywhere._config.domain;
                    twttr.storage = twttr.LocalStorage.create(window.parent);
                    twttr.anywhere.api.initialize();
                    twttr.anywhere.remote.createClient(X, function() {
                        twttr.anywhere.scribe({event_name:"initialize"});
                        window._ready = true;
                        if (parent.twttr.anywhere.token) {
                            twttr.anywhere.api.models.User.current({success:function(Z) {
                                if (Z.data("_identity")) {
                                    twttr.cookie.set(S, Z.data("_identity"), null, null, window.parent)
                                }
                                G({currentUser:Z})
                            },error:function() {
                                window.parent.twttr.anywhere._removeToken();
                                G()
                            }})
                        } else {
                            G()
                        }
                    })
                })
            })
        })
    })
}());