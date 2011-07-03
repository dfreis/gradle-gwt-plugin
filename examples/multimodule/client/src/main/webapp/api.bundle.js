(function() {
    twttr.anywhere.api = {};
    var C = ["models","util","proxies","mixins"];
    for (var B = 0,A = C.length; B < A; ++B) {
        twttr.anywhere.api[C[B]] = {}
    }
    twttr.anywhere.api.initialize = function() {
        for (var D in twttr.anywhere.api.models) {
            if (D == "Base") {
                continue
            }
            (function() {
                twttr.anywhere.api.proxies[D] = twttr.anywhere.api.util.proxyModel(twttr.anywhere.api.models[D], function(E) {
                    this.event = E
                })
            }())
        }
        twttr.anywhere.api.util.BaseCollection._name = "twttr.anywhere.proxies.Collection";
        twttr.anywhere.api.proxies.Collection = twttr.anywhere.api.util.proxyModel(twttr.anywhere.api.util.BaseCollection, function(E) {
            this.event = E
        });
        delete twttr.anywhere.api.util.BaseCollection._name;
        if (window.localStorage) {
            twttr.anywhere.api.cache = new twttr.anywhere.api.util.LocalStorageCache()
        } else {
            twttr.anywhere.api.cache = new twttr.anywhere.api.util.DefaultCache()
        }
    }
}());
(function() {
    var A = {"users/show":{},"account/verify_credentials":{},"users/lookup":{}};
    var B = 0.5;
    twttr.klass("twttr.anywhere.api.util.LocalStorageCache",
               function() {
               }).methods({clear:function() {
        for (var C in twttr.storage.getAll(/twitter_anywhere_cache_/)) {
            twttr.storage.expire(C)
        }
    },put:function(F, D, C) {
        if (F in A) {
            var E = this._createKey(F, D);
            twttr.storage.setWithExpiry(E, JSON.stringify(C), B);
            return true
        } else {
            return false
        }
    },get:function(F, D) {
        var E = this._createKey(F, D),C;
        if ((C = twttr.storage.get(E))) {
            return JSON.parse(C)
        } else {
            return null
        }
    },expire:function(D) {
        for (var C in twttr.storage.getAll(/twitter_anywhere_cache_/)) {
            if (C.match(D)) {
                twttr.storage.expire(C)
            }
        }
    },writeThroughCallback:function(E, D, C) {
        return twttr.bind(this, function(F) {
            this.put(E, D, F);
            C(F)
        })
    },_createKey:function(D, C) {
        return"twitter_anywhere_cache_" + JSON.stringify([D,C])
    }})
}());
(function() {
    var A = {"users/show":{},"account/verify_credentials":{},"users/lookup":{}};
    twttr.klass("twttr.anywhere.api.util.DefaultCache",
               function() {
                   this.store = {}
               }).methods({clear:function() {
        this.store = {}
    },put:function(D, C, B) {
        if (D in A) {
            this.store[this._createKey(D, C)] = B;
            return true
        } else {
            return false
        }
    },get:function(E, C) {
        var D = this._createKey(E, C),B;
        if ((B = this.store[D])) {
            return B
        } else {
            return null
        }
    },expire:function(C) {
        for (var B in this.store) {
            if (B.match(C)) {
                delete this.store[B]
            }
        }
    },writeThroughCallback:function(D, C, B) {
        return twttr.bind(this, function(E) {
            this.put(D, C, E);
            B(E)
        })
    },_createKey:function(C, B) {
        return JSON.stringify([C,B])
    }})
}());
(function() {
    twttr.klass("twttr.anywhere.api.util.EventChain",
               function() {
               }).methods(twttr.EventProvider);
    var A = ["cast","success","error","eventName"];
    twttr.augmentObject(twttr.anywhere.api.util, {chain:new twttr.anywhere.api.util.EventChain(),noop:function() {
    },camelize:function(B) {
        return B.replace(/_(.)/g, function(C, D) {
            return D.toUpperCase()
        })
    },filterOptions:function(G, C) {
        var F = {};
        for (var E = 0,B = G.length; E < B; ++E) {
            var D = G[E];
            if (twttr.is.def(C[D])) {
                F[D] = C[D]
            }
        }
        return F
    },underscore:function(B) {
        return B.replace(/([a-z])([A-Z])/g, function(C, E, D) {
            return E + "_" + D.toLowerCase()
        })
    },buildCollection:function(C, E) {
        var F = new twttr.anywhere.api.util.BaseCollection();
        for (var D = 0,B = E.length; D < B; ++D) {
            F.push(new C(E[D]))
        }
        return F
    },traverse:function(D, C) {
        if (!C.length) {
            return D
        }
        var B = C.shift();
        if (D[B]) {
            return twttr.anywhere.api.util.traverse(D[B], C)
        } else {
            return null
        }
    },cleanParams:function(C) {
        for (var B = A.length - 1; B >= 0; --B) {
            delete C[A[B]]
        }
    },optify:function(B) {
        var C = {success:twttr.anywhere.api.util.noop,error:twttr.anywhere.api.util.noop};
        if (!B) {
            return C
        }
        if (twttr.is.fn(B)) {
            return twttr.merge({}, C, {success:B})
        } else {
            return twttr.merge({}, C, B)
        }
    },returnClassFromType:function(B) {
        if (twttr.is.array(B)) {
            return[twttr.anywhere.api.models[B[0]]]
        } else {
            return twttr.anywhere.api.models[B]
        }
    },genEventName:function() {
        return"chain_" + (new Date()).getTime() + Math.random() * 1000
    },proxyNameFromType:function(B) {
        return(B === null || twttr.is.array(B)) ? "Collection" : B
    },callMethod:function(E) {
        var D = E.options.cast || E.cast;
        twttr.anywhere.api.util.cleanParams(E.params);
        var B;
        delete E.options.cast;
        function C(H) {
            E.dataSource.shift();
            var G = E.dataSource.length ? twttr.anywhere.api.util.traverse(H, E.dataSource) : H;
            var F;
            if (twttr.is.array(D)) {
                F = twttr.anywhere.api.util.buildCollection(D[0], G)
            } else {
                F = new D(G)
            }
            setTimeout(function() {
                E.options.success(F)
            }, 0)
        }

        if (twttr.anywhere.api.cache && (B = twttr.anywhere.api.cache.get(E.url, E.params))) {
            C(B)
        } else {
            twttr.anywhere.remote.call(E.url, E.params, {success:(twttr.anywhere.api.cache) ? twttr.anywhere.api.cache.writeThroughCallback(E.url, E.params, C) : C,error:E.options.error})
        }
    },chainable:function(D) {
        D = twttr.anywhere.api.util.optify(D);
        var C = D.success;
        var B;
        if (!D.eventName) {
            B = twttr.anywhere.api.util.genEventName()
        } else {
            B = D.eventName;
            delete D.eventName
        }
        function E(F) {
            twttr.anywhere.api.util.chain.trigger(B, [F]);
            if (C) {
                C(F)
            }
        }

        E.event = B;
        D.success = E;
        return D
    },chainableMethod:function(C, E) {
        var B = twttr.anywhere.api.util.proxyNameFromType(C);
        var D = function() {
            var G = Array.prototype.slice.call(arguments, 0);
            var I = G.pop();
            var F = {};
            if (I) {
                if (twttr.is.array(I) || !twttr.is.object(I) || (C === null && twttr.is.fn(I))) {
                    G.push(I)
                } else {
                    F = I
                }
            }
            F = twttr.anywhere.api.util.chainable(F);
            F.cast = twttr.anywhere.api.util.returnClassFromType(C);
            G.push(F);
            var H = E.apply(this, G);
            if (!F.eventName && this.constructor != twttr.anywhere.api.util.BaseCollection) {
                return new twttr.anywhere.api.proxies[B](F.success.event)
            } else {
                return H
            }
        };
        D.proxyName = B;
        return D
    },aliasMethod:function(C, E) {
        var B = twttr.anywhere.api.util.proxyNameFromType(C);
        var D = function() {
            return E.apply(this, arguments)
        };
        D.proxyName = B;
        return D
    },proxyModel:function(D, E) {
        var F = D._name.replace("models", "proxies");
        var C = twttr.klass(F, E);
        for (var B in D.prototype) {
            (function() {
                var G = B;
                C.prototype[G] = function() {
                    var K = Array.prototype.slice.call(arguments, 0);
                    var J = !!D.prototype[G].proxyName;
                    var H;
                    if (J) {
                        H = twttr.anywhere.api.util.genEventName();
                        var L = K.pop();
                        var I = {};
                        if (L) {
                            if (twttr.is.array(L) || !twttr.is.object(L) || (D == twttr.anywhere.api.util.BaseCollection && twttr.is.fn(L))) {
                                K.push(L)
                            } else {
                                I = L
                            }
                        }
                        I = twttr.anywhere.api.util.optify(I);
                        I.eventName = H;
                        K.push(I)
                    }
                    twttr.anywhere.api.util.chain.bind(this.event, function(N, M) {
                        D.prototype[G].apply(M, K)
                    });
                    if (J) {
                        return new twttr.anywhere.api.proxies[D.prototype[G].proxyName](H)
                    }
                }
            }())
        }
        return C
    },model:function(C, F) {
        if (!F) {
            F = function(G) {
                twttr.anywhere.api.models.Base.call(this, G)
            }
        }
        var B = twttr.klass(C, F).superclass(twttr.anywhere.api.models.Base);

        function D(G) {
            return twttr.anywhere.api.util.underscore(G).toLowerCase()
        }

        function E(H, G) {
            G = G || D(H);
            if (!B._registry) {
                B._registry = {}
            }
            B._registry[G] = H
        }

        B.hasMany = function(H, G) {
            G = G || D(H);
            if (!B._registry) {
                B._registry = {}
            }
            B._registry[G] = [H];
            return B
        };
        B.belongsTo = function(H, G) {
            E(H, G);
            return B
        };
        B.hasOne = function(H, G) {
            E(H, G);
            return B
        };
        return B
    }})
}());
(function() {
    var A = twttr.anywhere.api.util.chainableMethod;
    var B = function(C) {
        return A(null, function() {
            var E = Array.prototype.slice.call(arguments, 0);
            var D = E.pop();
            var F = C.apply(this, E);
            D.success(F);
            return F
        })
    };
    twttr.klass("twttr.anywhere.api.util.BaseCollection",
               function(C) {
                   this.array = C || []
               }).methods({each:B(function(E) {
        for (var D = 0,C = this.array.length; D < C; ++D) {
            E(this.array[D], D)
        }
        return this
    }),join:function(E, C) {
        if (twttr.is.fn(E)) {
            C = E;
            E = ""
        }
        var D = this.array.join(E);
        if (C) {
            C(D)
        }
        return D
    },concat:function(C) {
        this.array.concat(C);
        return this
    },find:B(function(E) {
        for (var D = 0,C = this.array.length; D < C; ++D) {
            if (E(this.array[D], D)) {
                return this.array[D]
            }
        }
        return null
    }),filter:B(function(F) {
        var D = new this.constructor();
        for (var E = 0,C = this.array.length; E < C; ++E) {
            if (F(this.array[E], E)) {
                D.push(this.array[E])
            }
        }
        return D
    }),some:function(E) {
        for (var D = 0,C = this.array.length; D < C; ++D) {
            if (E.call(this.array, this.array[D], D, this.array)) {
                return true
            }
        }
        return false
    },every:function(E) {
        for (var D = 0,C = this.array.length; D < C; ++D) {
            if (!E.call(this.array, this.array[D], D, this.array)) {
                return false
            }
        }
        return true
    },map:B(function(F) {
        var D = new this.constructor();
        for (var E = 0,C = this.array.length; E < C; ++E) {
            D.push(F(this.array[E], E))
        }
        return D
    }),none:function(C) {
        var D = this.any(C);
        return !D
    },length:function() {
        return this.array.length
    },get:B(function(E, C) {
        var D = this.array[E];
        if (C) {
            C(D)
        }
        return D
    }),push:function(C) {
        if (twttr.is.array(C)) {
            this.array.concat(C)
        } else {
            this.array.push(C)
        }
        return this
    },pop:function(F, C) {
        var E;
        if (twttr.is.fn(F)) {
            C = F;
            F = undefined
        }
        if (F) {
            var D = this.array.length - F;
            E = new this.constructor(this.array.slice(D));
            this.array = this.array.slice(0, D)
        } else {
            E = this.array.pop()
        }
        if (C) {
            C(E)
        }
        return E
    },first:B(function(D, C) {
        if (!D) {
            D = 1
        }
        if (twttr.is.fn(D)) {
            C = D;
            D = 1
        }
        var E;
        if (D == 1) {
            E = this.array[0]
        } else {
            E = new this.constructor(this.array.slice(0, D))
        }
        if (C) {
            C(E)
        }
        return E
    }),last:B(function(D, C) {
        if (!D) {
            D = 1
        }
        if (twttr.is.fn(D)) {
            C = D;
            D = 1
        }
        var E;
        if (D == 1) {
            E = this.array[this.array.length - 1]
        } else {
            E = new this.constructor(this.array.slice(this.array.length - D))
        }
        if (C) {
            C(E)
        }
        return E
    })})
}());
(function() {
    twttr.klass("twttr.anywhere.api.models.Base",
               function(E) {
                   if (!E) {
                       return null
                   }
                   if (E.constructor.uber && E.constructor.uber.constructor == twttr.anywhere.api.models.Base) {
                       return E
                   }
                   this.attributes = {};
                   var B = this.constructor._registry;
                   for (var D in E) {
                       this.data(D, E[D]);
                       if (D.indexOf("_") !== 0) {
                           var C = twttr.anywhere.api.util.camelize(D);
                           if (!this[C]) {
                               if (B && B[C]) {
                                   var A = twttr.anywhere.api.models[B[C]];
                                   if (B[C] instanceof Array) {
                                       this[C] = twttr.anywhere.api.util.buildCollection(A, this.data(D))
                                   } else {
                                       this[C] = new A(this.data(D))
                                   }
                               } else {
                                   this[C] = this.data(D)
                               }
                           }
                       }
                   }
               }).methods({data:function(A, B) {
        if (typeof A == "string" && typeof B != "undefined") {
            this.attributes[A] = B;
            return B
        }
        if (typeof A == "object" && typeof B == "undefined") {
            return twttr.merge(this.attributes, A)
        }
        if (typeof A == "string" && typeof B == "undefined") {
            return this.attributes[A]
        }
        if (typeof A == "undefined" && typeof B == "undefined") {
            return this.attributes
        }
    }})
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.augmentString("twttr.anywhere.api.mixins.StatusActions", {retweet:C("Status", function(D) {
        return twttr.anywhere.api.models.Status.retweet(this, D)
    }),favorite:C("Status", function(D) {
        return twttr.anywhere.api.models.Status.favorite(this, D)
    }),unfavorite:C("Status", function(D) {
        return twttr.anywhere.api.models.Status.unfavorite(this, D)
    }),reply:C("Status", function(E, D) {
        return twttr.anywhere.api.models.Status.reply(this, E, D)
    })})
}());
(function() {
    var C = twttr.anywhere.api.util.chainableMethod;
    var E = twttr.anywhere.api.util.aliasMethod;
    var I = twttr.anywhere.api.util.callMethod;
    var H = twttr.anywhere.api.util.noop;

    function B(J) {
        if (twttr.anywhere.api.cache) {
            twttr.anywhere.api.cache.expire(new RegExp("\\b" + J.screenName + "\\b"));
            twttr.anywhere.api.cache.expire(new RegExp("\\b" + J.id + "\\b"))
        }
    }

    function G() {
        if (twttr.anywhere.api.cache) {
            twttr.anywhere.api.cache.expire(/verify_credentials/)
        }
    }

    twttr.anywhere.api.util.model("twttr.anywhere.api.models.User").hasOne("Status").statics({identify:function(J) {
        var K = J;
        if (J instanceof this) {
            K = J.id
        }
        return K
    },find:C("User", function(K, J) {
        var L;
        if (twttr.is.string(K)) {
            L = {screen_name:K}
        } else {
            L = {user_id:K}
        }
        I({options:J,url:"users/show",params:[L],dataSource:["user"]})
    }),findAll:C(["User"], function(K, L) {
        var O = [];
        var N = [];
        for (var M = 0,J = K.length; M < J; ++M) {
            if (twttr.is.string(K[M])) {
                O.push(K[M])
            } else {
                N.push(K[M])
            }
        }
        I({options:L,url:"users/lookup",params:[
            {user_id:N.join(","),screen_name:O.join(",")}
        ],dataSource:["users"]})
    }),current:C("CurrentUser", function(J) {
        I({options:J,url:"account/verify_credentials",params:[],dataSource:["user"]})
    }),search:C(["User"], function(K, J) {
        I({options:J,url:"users/search",params:[twttr.merge(J, {q:K})],dataSource:["users"]})
    })}).methods({favorites:C(["Status"], function(J) {
        I({options:J,url:"favorites",params:[twttr.merge(J, {id:this.id})],dataSource:["statuses"]})
    }),timeline:C(["Status"], function(J) {
        I({options:J,url:"statuses/user_timeline",params:[twttr.merge(J, {user_id:this.id})],dataSource:["statuses"]})
    }),followers:C(["User"], function(J) {
        I({options:J,url:"statuses/followers",params:[twttr.merge(J, {user_id:this.user_id})],dataSource:["users"]})
    }),friends:C(["User"], function(J) {
        I({options:J,url:"statuses/friends",params:[twttr.merge(J, {user_id:this.id})],dataSource:["users"]})
    }),_isFollowing:function(L, K, J) {
        twttr.anywhere.remote.call("friendships/exists", [
            {user_a:L,user_b:K}
        ], {success:J.success,error:J.error})
    },isFollowing:function(J, L) {
        L = twttr.anywhere.api.util.optify(L);
        var K = twttr.anywhere.api.models.User.identify(J);
        this._isFollowing(this.id, K, L)
    },isFriend:function(J, K) {
        this.isFollowing(J, K)
    },isFollowedBy:function(J, L) {
        L = twttr.anywhere.api.util.optify(L);
        var K = twttr.anywhere.api.models.User.identify(J);
        this._isFollowing(K, this.id, L)
    },isMutual:function(J, L) {
        L = twttr.anywhere.api.util.optify(L);
        var K = twttr.anywhere.api.models.User.identify(J);
        twttr.anywhere.remote.call("friendships/show", [
            {source_id:this.id,target_id:K}
        ], {success:function(M) {
            L.success(M.relationship.source.following && M.relationship.source.followed_by)
        },error:L.error})
    },block:C("User", function(J) {
        I({options:J,url:"blocks/create",params:[twttr.merge(J, {user_id:this.id})],dataSource:["user"]})
    }),unblock:C("User", function(J) {
        I({options:J,url:"blocks/destroy",params:[twttr.merge(J, {user_id:this.id})],dataSource:["user"]})
    }),directMessage:E("DirectMessage", function(K, J) {
        return twttr.anywhere.api.models.DirectMessage.send(this.id, K, J)
    }),dm:E("DirectMessage", function(K, J) {
        return this.directMessage(K, J)
    }),follow:C("User", function(J) {
        B(this);
        I({options:J,url:"friendships/create",params:[
            {user_id:this.id}
        ],dataSource:["user"]})
    }),unfollow:C("User", function(J) {
        B(this);
        I({options:J,url:"friendships/destroy",params:[
            {user_id:this.id}
        ],dataSource:["user"]})
    }),report:C("User", function(J) {
        I({options:J,url:"report_spam",params:[
            {user_id:this.id}
        ],dataSource:["user"]})
    }),notifications:C("User", function(J, L) {
        B(this);
        var K = J == "on" ? "notifications/follow" : "notifications/leave";
        I({options:L,url:K,params:[
            {user_id:this.id}
        ],dataSource:["user"]})
    }),lists:C(["List"], function(J) {
        I({options:J,url:":user/lists",params:[this.id,J],dataSource:["lists_list","lists"]})
    }),memberships:C(["List"], function(J) {
        I({options:J,url:":user/lists/memberships",params:[this.id,J],dataSource:["lists_list","lists"]})
    }),subscriptions:C(["List"], function(J) {
        I({options:J,url:":user/lists/subscriptions",params:[this.id,J],dataSource:["lists_list","lists"]})
    })});
    twttr.klass("twttr.anywhere.api.models.CurrentUser",
               function(J) {
                   twttr.anywhere.api.models.User.call(this, J)
               }).superclass(twttr.anywhere.api.models.User).methods({directMessages:C(["DirectMessage"], function(J) {
        I({options:J,url:"direct_messages",params:[J],dataSource:["direct_messages"]})
    }),dms:E(["DirectMessage"], function(J) {
        return this.directMessages(J)
    }),receivedMessages:E(["DirectMessage"], function(J) {
        return this.directMessages(J)
    }),sentMessages:C(["DirectMessage"], function(J) {
        I({options:J,url:"direct_messages/sent",params:[J],dataSource:["direct_messages"]})
    }),homeTimeline:C(["Status"], function(K) {
        var J = "statuses/home_timeline";
        if (K.withoutRetweets) {
            J = "statuses/friends_timeline"
        }
        I({options:K,url:J,params:[K],dataSource:["statuses"]})
    }),mentions:C(["Status"], function(J) {
        I({options:J,url:"statuses/mentions",params:[J],dataSource:["statuses"]})
    }),_retweets:C(["Status"], function(K, J) {
        I({options:J,url:K,params:[J],dataSource:["statuses"]})
    }),retweeting:E(["Status"], function(J) {
        return this._retweets("statuses/retweeted_by_me", J)
    }),retweets:E(["Status"], function(J) {
        return this._retweets("statuses/retweeted_to_me", J)
    }),retweeted:E(["Status"], function(J) {
        return this._retweets("statuses/retweets_of_me", J)
    }),blocks:C(["User"], function(J) {
        I({options:J,url:"blocks/blocking",params:[J],dataSource:["users"]})
    }),lists:E(["List"], function(J) {
        return this.constructor.uber.lists.call(this, J)
    }),isBlocking:function(J, L) {
        L = twttr.anywhere.api.util.optify(L);
        var K = twttr.anywhere.api.models.User.identify(J);
        twttr.anywhere.remote.call("blocks/exists", [
            {user_id:K}
        ], {success:function(M) {
            L.success((M.user ? true : false))
        },error:function(M) {
            if (M.status == 404) {
                L.success(false)
            } else {
                L.error(M)
            }
        }})
    },update:C("User", function(J) {
        B(this);
        G();
        I({options:J,url:"account/update",params:[J],dataSource:["user"]})
    }),savedSearches:C(["SavedSearch"], function(J) {
        I({options:J,url:"saved_searches",params:[],dataSource:["saved_searches"]})
    }),searches:E(["SavedSearch"], function(J) {
        return this.savedSearches(J)
    }),logout:function(J) {
        parent.twttr.anywhere.signOut()
    }});
    twttr.augmentObject(twttr.anywhere.api.models.CurrentUser.prototype.savedSearches, {create:C("SavedSearch", function(K, J) {
        I({options:J,url:"saved_searches/create",params:[
            {query:K}
        ],dataSource:["saved_search"]})
    }),find:C("SavedSearch", function(K, J) {
        I({options:J,url:"saved_searches/show/:id",params:[K,J],dataSource:["saved_search"]})
    })});
    twttr.augmentObject(twttr.anywhere.api.models.CurrentUser.prototype.lists, {find:C("List", function(K, J) {
        twttr.anywhere.api.models.User.current(function(L) {
            I({options:J,url:":user/lists/:id",params:[L.id,K,{}],dataSource:["list"]})
        })
    }),create:C("List", function(K, J) {
        twttr.anywhere.api.models.User.current(function(L) {
            I({options:J,url:":user/lists/create",params:[L.id,twttr.merge(J, {name:K})],dataSource:["list"]})
        })
    })});
    twttr.anywhere.api.models.CurrentUser._registry = twttr.anywhere.api.models.User._registry;
    var A = ["block","unblock","report","follow","unfollow","notifications"];
    for (var D = 0,F = A.length; D < F; ++D) {
        twttr.anywhere.api.models.CurrentUser[A[D]] = H
    }
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.DirectMessage").belongsTo("User", "sender").belongsTo("User", "receipient").statics({send:B("DirectMessage", function(D, F, E) {
        A({options:E,url:"direct_messages/new",params:[
            {user:twttr.anywhere.api.models.User.identify(D),text:F}
        ],dataSource:["direct_message"]})
    })}).methods({destroy:B("DirectMessage", function(D) {
        A({options:D,url:"direct_messages/destroy",params:[
            {id:this.id}
        ],dataSource:["direct_message"]})
    })})
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.SavedSearch").methods({destroy:B("SavedSearch", function(D) {
        A({options:D,url:"saved_searches/destroy",params:[
            {id:this.id}
        ],dataSource:["saved_search"]})
    }),results:B(["SearchResult"], function(D) {
        D.q = this.query;
        A({options:D,url:"search",params:[D],dataSource:["","results"]})
    })})
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    var D = twttr.anywhere.api.util.filterOptions;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.List").belongsTo("User").methods({subscribe:B("List", function(E) {
        A({options:E,url:":user/:list_id/subscribers/create",params:[this.user.id,this.id,{}],dataSource:["list"]})
    }),follow:C("List", function(E) {
        return this.subscribe(E)
    }),unsubscribe:B("List", function(E) {
        A({options:E,url:":user/:id/subscribers/destroy",params:[this.user.id,this.id,{}],dataSource:["list"]})
    }),unfollow:C("List", function(E) {
        return this.unsubscribe(E)
    }),add:B("List", function(E, F) {
        A({options:F,url:":user/:list_id/members/create",params:[this.user.id,this.id,{id:twttr.anywhere.api.models.User.identify(E)}],dataSource:["list"]})
    }),remove:B("List", function(E, F) {
        A({options:F,url:":user/:id/members/destroy",params:[this.user.id,this.id,{id:twttr.anywhere.api.models.User.identify(E)}],dataSource:["list"]})
    }),owner:function() {
        return this.user
    },isMember:function(E, G) {
        G = twttr.anywhere.api.util.optify(G);
        var F = G.success;
        G.success = function(H) {
            if (H.user) {
                F(true)
            } else {
                F(false)
            }
        };
        A({options:G,url:":user/:list_id/members/:id",params:[this.user.id,this.id,twttr.anywhere.api.models.User.identify(E),{}],cast:twttr.anywhere.api.models.User,dataSource:["user"]})
    },isSubscriber:function(E, G) {
        G = twttr.anywhere.api.util.optify(G);
        var F = G.success;
        G.success = function(H) {
            if (H.user) {
                F(true)
            } else {
                F(false)
            }
        };
        A({options:G,url:":user/:list_id/subscribers/:id",params:[this.user.id,this.id,twttr.anywhere.api.models.User.identify(E),{}],cast:twttr.anywhere.api.models.User,dataSource:["user"]})
    },destroy:B("List", function(E) {
        A({options:E,url:":user/lists/:id/destroy",params:[this.user.id,this.id,{}],dataSource:["list"]})
    }),update:B("List", function(E) {
        var F = D(["name","description","mode"], E);
        A({options:E,url:":user/lists/:id/create",params:[this.user.id,this.id,F],dataSource:["list"]})
    }),statuses:B(["Status"], function(E) {
        A({options:E,url:":user/lists/:id/statuses",params:[this.user.id,this.id,E],dataSource:["statuses"]})
    }),subscribers:B(["User"], function(E) {
        A({options:E,url:":user/:list_id/subscribers",params:[this.user.id,this.id,E],dataSource:["users_list","users"]})
    }),followers:C(["User"], function(E) {
        return this.subscribers(E)
    }),members:B(["User"], function(E) {
        A({options:E,url:":user/:list_id/members",params:[this.user.id,this.id,E],dataSource:["users_list","users"]})
    }),following:C(["User"], function(E) {
        return this.members(E)
    })})
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.Status").belongsTo("User").belongsTo("Status", "retweeted_status").hasOne("Place").statics({identify:function(D) {
        var E = D;
        if (D instanceof this) {
            E = D.id
        }
        return E
    },find:B("Status", function(E, D) {
        A({options:D,url:"statuses/show",params:[
            {id:E}
        ],dataSource:["status"]})
    }),update:B("Status", function(D, E) {
        A({options:E,url:"statuses/update",params:[twttr.merge({status:D}, E.params)],dataSource:["status"]})
    }),publicTimeline:B(["Status"], function(D) {
        A({options:D,url:"statuses/public_timeline",params:[],dataSource:["statuses"]})
    }),retweet:B("Status", function(D, F) {
        var E = this.identify(D);
        A({options:F,url:"statuses/retweet/:id",params:[E],dataSource:["status"]})
    }),favorite:B("Status", function(D, F) {
        var E = this.identify(D);
        A({options:F,url:"favorites/create/:id",params:[E],dataSource:["status"]})
    }),unfavorite:B("Status", function(D, F) {
        var E = this.identify(D);
        A({options:F,url:"favorites/destroy/:id",params:[E],dataSource:["status"]})
    }),reply:C("Status", function(D, G, F) {
        var E = this.identify(D);
        F = twttr.merge(twttr.anywhere.api.util.optify(F), {in_reply_to_status_id:E});
        return this.update(G, F)
    }),search:B(["SearchResult"], function(E, D) {
        A({options:D,url:"search",params:[twttr.merge({q:E}, D)],dataSource:["","results"]})
    })}).methods(twttr.anywhere.api.mixins.StatusActions).methods({destroy:B("Status", function(D) {
        A({options:D,url:"statuses/destroy",params:[
            {id:this.id}
        ],dataSource:["status"]})
    }),retweets:B(["Status"], function(D) {
        A({options:D,url:"statuses/retweets/:id",params:[this.id,D],dataSource:["status"]})
    }),retweeters:B(["User"], function(D) {
        A({options:D,url:"statuses/:id/retweeted_by",params:[this.id,D],dataSource:["users"]})
    }),contributors:C(["User"], function(D) {
        var E = this.data("contributors");
        if (E && twttr.is.array(E)) {
            return twttr.anywhere.api.models.User.findAll(this.data("contributors"), D)
        } else {
            D.success([])
        }
    }),inReplyTo:C("User", function(D) {
        D = twttr.anywhere.api.util.optify(D);
        if (this.in_reply_to_user_id) {
            return twttr.anywhere.api.models.User.find(this.in_reply_to_user_id, D)
        } else {
            D.success(null)
        }
    })})
}());
(function() {
    var A = twttr.anywhere.api.util.aliasMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.SearchResult").methods(twttr.anywhere.api.mixins.StatusActions)
}());
(function() {
    var B = twttr.anywhere.api.util.chainableMethod;
    var C = twttr.anywhere.api.util.aliasMethod;
    var A = twttr.anywhere.api.util.callMethod;
    twttr.anywhere.api.util.model("twttr.anywhere.api.models.Place").belongsTo("Place", "contained_within").statics({find:B("Place", function(E, D) {
        A({options:D,url:"geo/id",params:[
            {id:E}
        ],dataSource:["place"]})
    }),nearby:B(["Place"], function(D) {
        A({options:D,url:"geo/reverse_geocode",params:[D],dataSource:["","result","places"]})
    })})
}());